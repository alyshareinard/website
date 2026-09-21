import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import {
	MixInputError,
	SpotifyError,
	clampLimit,
	createSpotify,
	isSpotifyId,
	runMix,
	type Target
} from '$lib/spotify/mix';
import {
	APP_PATH,
	LOGIN_PATH,
	consumeState,
	currentToken,
	exchangeCode,
	signInAgain
} from './spotifyAuth.server';

const MAX_PLAYLISTS_PER_LIST = 50;

/** Reads a JSON array of Spotify IDs from a form field, ignoring anything that isn't one. */
function parseIds(value: FormDataEntryValue | null): string[] {
	try {
		const parsed = JSON.parse(String(value ?? '[]'));
		if (!Array.isArray(parsed)) return [];
		return parsed.filter(isSpotifyId).slice(0, MAX_PLAYLISTS_PER_LIST);
	} catch {
		return [];
	}
}

export const load: PageServerLoad = async ({ url, cookies }) => {
	// Spotify sends the visitor back here with ?code=...&state=... (or ?error=... if they said no).
	if (url.searchParams.has('error')) redirect(303, LOGIN_PATH);

	const code = url.searchParams.get('code');
	if (code) {
		if (!consumeState(cookies, url.searchParams.get('state'))) redirect(303, LOGIN_PATH);
		const signedIn = await exchangeCode(cookies, code);
		redirect(303, signedIn ? APP_PATH : LOGIN_PATH);
	}

	const token = await currentToken(cookies);
	if (!token) redirect(303, LOGIN_PATH);

	try {
		const spotify = createSpotify(token);
		const profile = await spotify.profile();
		const playlists = await spotify.ownedPlaylists(profile.id);
		return { user_name: profile.name, playlists, loadError: '' };
	} catch (error) {
		if (error instanceof SpotifyError) {
			if (error.status === 401) signInAgain(cookies);
			return { user_name: '', playlists: [], loadError: error.message };
		}
		throw error;
	}
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const form = await request.formData();

		const targetId = String(form.get('target') ?? '');
		let target: Target;
		if (targetId === 'new') {
			target = { kind: 'new', name: String(form.get('newName') ?? '') };
		} else if (isSpotifyId(targetId)) {
			target = { kind: 'existing', id: targetId };
		} else {
			return fail(400, { success: false, message: 'Choose which playlist should receive the mix.' });
		}

		const token = await currentToken(cookies);
		if (!token) signInAgain(cookies);

		try {
			const result = await runMix(createSpotify(token), {
				chosenIds: parseIds(form.get('chosen')),
				avoidIds: parseIds(form.get('avoid')),
				includeLiked: form.get('liked') === 'true',
				target,
				limit: clampLimit(Number(form.get('limit')))
			});
			return { success: true, ...result, message: '' };
		} catch (error) {
			if (error instanceof MixInputError) {
				return fail(400, { success: false, message: error.message });
			}
			if (error instanceof SpotifyError) {
				if (error.status === 401) signInAgain(cookies);
				return fail(502, { success: false, message: error.message });
			}
			throw error;
		}
	}
};
