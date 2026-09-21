import { env } from '$env/dynamic/private';
import { redirect, type Cookies } from '@sveltejs/kit';

// This flow uses PKCE, so the Spotify client secret is never needed. Nothing in this file logs:
// the requests and responses carry authorization codes and tokens.

export const APP_PATH = '/portfolio/spotifyPlaylistMix';
export const LOGIN_PATH = `${APP_PATH}/login`;

const TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SCOPES = [
	'playlist-read-private',
	'playlist-read-collaborative',
	'playlist-modify-private',
	'playlist-modify-public',
	'user-library-read',
	'user-read-private'
].join(' ');

const ACCESS_COOKIE = 'access_token';
const REFRESH_COOKIE = 'refresh_token';
const VERIFIER_COOKIE = 'code_verifier';
const STATE_COOKIE = 'oauth_state';

const REFRESH_MAX_AGE = 60 * 60 * 24 * 30;
const LOGIN_MAX_AGE = 60 * 10;

function config() {
	// Both spellings are accepted: Vercel uses SPOTIFY_CLIENT_ID, the local .env uses spotifyClientId.
	const clientId = env.SPOTIFY_CLIENT_ID ?? env.spotifyClientId;
	const redirectUri = env.spotifyRedirectURL ?? env.SPOTIFY_REDIRECT_URL;
	if (!clientId || !redirectUri) throw new Error('Spotify sign-in is not configured on this server.');
	return { clientId, redirectUri };
}

function base64Url(bytes: ArrayBuffer | Uint8Array): string {
	return btoa(String.fromCharCode(...new Uint8Array(bytes)))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');
}

function randomToken(byteLength: number): string {
	return base64Url(crypto.getRandomValues(new Uint8Array(byteLength)));
}

async function challengeFor(verifier: string): Promise<string> {
	return base64Url(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)));
}

export function clearSession(cookies: Cookies) {
	for (const name of [ACCESS_COOKIE, REFRESH_COOKIE, VERIFIER_COOKIE, STATE_COOKIE]) {
		cookies.delete(name, { path: '/' });
	}
}

/** Stores the PKCE verifier and a `state` value, and returns the Spotify sign-in URL. */
export async function startLogin(cookies: Cookies): Promise<string> {
	const { clientId, redirectUri } = config();
	clearSession(cookies);

	const verifier = randomToken(64);
	const state = randomToken(16);
	cookies.set(VERIFIER_COOKIE, verifier, { path: '/', maxAge: LOGIN_MAX_AGE });
	cookies.set(STATE_COOKIE, state, { path: '/', maxAge: LOGIN_MAX_AGE });

	const params = new URLSearchParams({
		response_type: 'code',
		client_id: clientId,
		scope: SCOPES,
		state,
		code_challenge_method: 'S256',
		code_challenge: await challengeFor(verifier),
		redirect_uri: redirectUri
	});
	return `https://accounts.spotify.com/authorize?${params}`;
}

/** Returns true when the `state` Spotify sent back matches the one we stored (and uses it up). */
export function consumeState(cookies: Cookies, returned: string | null): boolean {
	const expected = cookies.get(STATE_COOKIE);
	cookies.delete(STATE_COOKIE, { path: '/' });
	return !!expected && returned === expected;
}

function saveTokens(
	cookies: Cookies,
	tokens: { access_token?: string; refresh_token?: string; expires_in?: number }
): string | null {
	if (!tokens.access_token) return null;
	// Renew a minute before Spotify would reject it
	const maxAge = Math.max(60, (tokens.expires_in ?? 3600) - 60);
	cookies.set(ACCESS_COOKIE, tokens.access_token, { path: '/', maxAge });
	if (tokens.refresh_token) {
		cookies.set(REFRESH_COOKIE, tokens.refresh_token, { path: '/', maxAge: REFRESH_MAX_AGE });
	}
	return tokens.access_token;
}

async function requestTokens(params: URLSearchParams) {
	const response = await fetch(TOKEN_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: params
	});
	if (!response.ok) return null;
	return (await response.json()) as {
		access_token?: string;
		refresh_token?: string;
		expires_in?: number;
	};
}

/** Trades the one-time code from Spotify for tokens. */
export async function exchangeCode(cookies: Cookies, code: string): Promise<boolean> {
	const { clientId, redirectUri } = config();
	const verifier = cookies.get(VERIFIER_COOKIE);
	cookies.delete(VERIFIER_COOKIE, { path: '/' });
	if (!verifier) return false;

	const tokens = await requestTokens(
		new URLSearchParams({
			client_id: clientId,
			grant_type: 'authorization_code',
			code,
			redirect_uri: redirectUri,
			code_verifier: verifier
		})
	);
	return !!tokens && !!saveTokens(cookies, tokens);
}

/** A usable access token, refreshing it if needed. Null means the user has to sign in again. */
export async function currentToken(cookies: Cookies): Promise<string | null> {
	const access = cookies.get(ACCESS_COOKIE);
	if (access) return access;

	const refresh = cookies.get(REFRESH_COOKIE);
	if (!refresh) return null;

	const { clientId } = config();
	const tokens = await requestTokens(
		new URLSearchParams({ client_id: clientId, grant_type: 'refresh_token', refresh_token: refresh })
	);
	const token = tokens ? saveTokens(cookies, tokens) : null;
	if (!token) cookies.delete(REFRESH_COOKIE, { path: '/' });
	return token;
}

export function signInAgain(cookies: Cookies): never {
	clearSession(cookies);
	redirect(303, LOGIN_PATH);
}
