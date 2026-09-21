// Spotify playlist mixing logic. No SvelteKit imports, and fetch is injectable, so it can be tested
// without a network. Nothing in here logs: requests carry access tokens.

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

export interface Deps {
	fetch?: FetchLike;
	sleep?: (ms: number) => Promise<void>;
}

export interface PlaylistInfo {
	id: string;
	name: string;
}

export type Target = { kind: 'existing'; id: string } | { kind: 'new'; name: string };

export interface MixRequest {
	chosenIds: string[];
	avoidIds: string[];
	includeLiked: boolean;
	target: Target;
	limit: number;
}

export interface MixResult {
	playlistId: string;
	playlistUrl: string;
	trackCount: number;
	created: boolean;
}

/** Something the user can fix (nothing picked, nothing left after filtering...). */
export class MixInputError extends Error {}

/** Spotify said no. `status` is the HTTP status when there was one. */
export class SpotifyError extends Error {
	status?: number;
	constructor(message: string, status?: number) {
		super(message);
		this.status = status;
	}
}

const API = 'https://api.spotify.com/v1';
const ADD_CHUNK = 100;

export const DEFAULT_MIX_SIZE = 50;
export const MAX_MIX_SIZE = 200;

export function clampLimit(value: number): number {
	if (!Number.isFinite(value)) return DEFAULT_MIX_SIZE;
	return Math.min(MAX_MIX_SIZE, Math.max(1, Math.floor(value)));
}

/** Fisher-Yates. (`array.sort(() => Math.random() - 0.5)` is biased.) */
export function shuffled<T>(items: readonly T[], random: () => number = Math.random): T[] {
	const result = [...items];
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}

/** Merge, drop duplicates and anything from the excluded lists, shuffle, then take `limit`. */
export function buildMix(
	sources: string[][],
	avoid: string[][],
	limit: number,
	random: () => number = Math.random
): string[] {
	const excluded = new Set(avoid.flat());
	const seen = new Set<string>();
	const pool: string[] = [];
	for (const uri of sources.flat()) {
		if (seen.has(uri) || excluded.has(uri)) continue;
		seen.add(uri);
		pool.push(uri);
	}
	// Shuffle before slicing, so the mix isn't just the first playlist's first tracks.
	return shuffled(pool, random).slice(0, clampLimit(limit));
}

/** Spotify's own IDs are base-62. Anything else never goes into a URL. */
export function isSpotifyId(value: unknown): value is string {
	return typeof value === 'string' && /^[A-Za-z0-9]{1,64}$/.test(value);
}

export function createSpotify(token: string, deps: Deps = {}) {
	const doFetch: FetchLike = deps.fetch ?? ((input, init) => fetch(input, init));
	const sleep = deps.sleep ?? ((ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms)));

	async function describe(response: Response): Promise<string> {
		if (response.status === 401) return 'Your Spotify session expired. Please sign in again.';
		let detail = '';
		try {
			const body = await response.json();
			detail = body?.error?.message ?? '';
		} catch {
			/* not JSON */
		}
		if (response.status === 404) return "Spotify couldn't find that playlist.";
		if (response.status === 403) {
			return `Spotify refused the request${detail ? `: ${detail}` : '.'}`;
		}
		return `Spotify returned an error (${response.status})${detail ? `: ${detail}` : '.'}`;
	}

	async function call(url: string, init: RequestInit = {}, attempt = 0): Promise<Response> {
		const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
		if (init.body) headers['Content-Type'] = 'application/json';
		const response = await doFetch(url, { ...init, headers });

		if (response.status === 429 && attempt < 2) {
			const seconds = Math.min(Number(response.headers.get('Retry-After')) || 1, 5);
			await sleep(seconds * 1000);
			return call(url, init, attempt + 1);
		}
		if (!response.ok) throw new SpotifyError(await describe(response), response.status);
		return response;
	}

	/** Follows `next` links until the list ends. */
	async function pages<T>(firstUrl: string): Promise<T[]> {
		const all: T[] = [];
		let url: string | null = firstUrl;
		while (url) {
			const data: { items?: T[]; next?: string | null } = await (await call(url)).json();
			all.push(...(data.items ?? []));
			url = data.next ?? null;
		}
		return all;
	}

	type TrackItem = { track?: { uri?: string } | null };
	const uris = (items: TrackItem[]): string[] =>
		items
			.map((item) => item.track?.uri)
			.filter((uri): uri is string => typeof uri === 'string' && !uri.startsWith('spotify:local:'));

	return {
		async profile(): Promise<{ id: string; name: string }> {
			const me = await (await call(`${API}/me`)).json();
			return { id: me.id, name: me.display_name || me.id };
		},

		/** Playlists this user owns, i.e. the ones the mix can be written to. */
		async ownedPlaylists(userId: string): Promise<PlaylistInfo[]> {
			const items = await pages<{ id: string; name: string; owner?: { id?: string } } | null>(
				`${API}/me/playlists?limit=50`
			);
			return items
				.filter((item): item is NonNullable<typeof item> => !!item && item.owner?.id === userId)
				.map((item) => ({ id: item.id, name: item.name }));
		},

		async playlistUris(id: string): Promise<string[]> {
			const fields = encodeURIComponent('items(track(uri)),next');
			return uris(
				await pages<TrackItem>(`${API}/playlists/${encodeURIComponent(id)}/tracks?limit=100&fields=${fields}`)
			);
		},

		async likedUris(): Promise<string[]> {
			return uris(await pages<TrackItem>(`${API}/me/tracks?limit=50`));
		},

		async createPlaylist(name: string): Promise<{ id: string; url: string }> {
			const created = await (
				await call(`${API}/me/playlists`, {
					method: 'POST',
					body: JSON.stringify({
						name,
						description: 'Created by Spotify Playlist Mixer',
						public: false
					})
				})
			).json();
			return { id: created.id, url: `https://open.spotify.com/playlist/${created.id}` };
		},

		/** Replaces everything in the playlist. Spotify takes 100 tracks per request. */
		async replaceTracks(id: string, trackUris: string[]): Promise<void> {
			const path = `${API}/playlists/${encodeURIComponent(id)}/tracks`;
			await call(path, {
				method: 'PUT',
				body: JSON.stringify({ uris: trackUris.slice(0, ADD_CHUNK) })
			});
			for (let start = ADD_CHUNK; start < trackUris.length; start += ADD_CHUNK) {
				await call(path, {
					method: 'POST',
					body: JSON.stringify({ uris: trackUris.slice(start, start + ADD_CHUNK) })
				});
			}
		}
	};
}

export type Spotify = ReturnType<typeof createSpotify>;

export async function runMix(
	api: Spotify,
	request: MixRequest,
	random: () => number = Math.random
): Promise<MixResult> {
	if (!request.chosenIds.length && !request.includeLiked) {
		throw new MixInputError('Pick at least one playlist, or include your liked songs.');
	}
	if (request.target.kind === 'new' && !request.target.name.trim()) {
		throw new MixInputError('Give the new playlist a name.');
	}

	const sources = await Promise.all([
		...request.chosenIds.map((id) => api.playlistUris(id)),
		...(request.includeLiked ? [api.likedUris()] : [])
	]);
	const avoid = await Promise.all(request.avoidIds.map((id) => api.playlistUris(id)));

	const tracks = buildMix(sources, avoid, request.limit, random);
	if (!tracks.length) {
		throw new MixInputError('Nothing left after removing duplicates and the playlists you excluded.');
	}

	let playlistId: string;
	let playlistUrl: string;
	let created = false;
	if (request.target.kind === 'existing') {
		playlistId = request.target.id;
		playlistUrl = `https://open.spotify.com/playlist/${playlistId}`;
	} else {
		const playlist = await api.createPlaylist(request.target.name.trim().slice(0, 100));
		playlistId = playlist.id;
		playlistUrl = playlist.url;
		created = true;
	}

	await api.replaceTracks(playlistId, tracks);
	return { playlistId, playlistUrl, trackCount: tracks.length, created };
}
