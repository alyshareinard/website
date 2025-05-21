import { SPOTIFY_CLIENT_ID, spotifyRedirectURL } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';

// Define a type for our request object with cookies
interface RequestWithCookies {
	cookies: Cookies;
	redirect?: (status: number, location: string) => never;
}

/**
 * Refreshes the Spotify access token using the stored refresh token
 */
export async function refresh_token(cookies: Cookies): Promise<string | null> {
	console.log('in refresh_token');
	const refresh_token = cookies.get('refresh_token');
	
	// If no refresh token exists, we can't proceed
	if (!refresh_token) {
		console.log('No refresh token found');
		redirect(303, '/portfolio/spotifyPlaylistMix/login');
		return null; // This line won't execute due to redirect, but TypeScript needs it
	}

	const params = new URLSearchParams();
	params.append('client_id', SPOTIFY_CLIENT_ID);
	params.append('grant_type', 'refresh_token');
	params.append('refresh_token', refresh_token);

	console.log('sending: ', params);
	const result = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: params
	});
	
	const response = await result.json();
	console.log('Here is response: ', response);
	
	const { access_token, refresh_token: new_refresh_token } = response;
	
	if (access_token) {
		console.log('TRYING TO SET COOKIES');
		cookies.set('access_token', access_token, { maxAge: 3600, path: '/' });
		
		// Only set the new refresh token if it exists
		if (new_refresh_token) {
			cookies.set('refresh_token', new_refresh_token, { path: '/' });
		}
		
		return access_token;
	} else {
		cookies.delete('refresh_token', { path: '/' });
		console.log('Houston, we have a problem ');
		console.log(response);
		redirect(303, '/portfolio/spotifyPlaylistMix/login');
		return null; // This line won't execute due to redirect, but TypeScript needs it
	}
}

/**
 * Gets a new access token from Spotify using the authorization code flow
 */
export async function get_token(request: RequestWithCookies): Promise<string | null> {
	const verifier = request.cookies.get('code_verifier');
	const code = request.cookies.get('code');

	// If either code or verifier is missing, we can't proceed
	if (!verifier || !code) {
		console.log('Missing code or verifier');
		if (request.redirect) {
			request.redirect(303, '/portfolio/spotifyPlaylistMix/login');
		} else {
			redirect(303, '/portfolio/spotifyPlaylistMix/login');
		}
		return null; // This line won't execute due to redirect, but TypeScript needs it
	}

	const params = new URLSearchParams();
	params.append('client_id', SPOTIFY_CLIENT_ID);
	params.append('grant_type', 'authorization_code');
	params.append('code', code);
	params.append('redirect_uri', spotifyRedirectURL);
	params.append('code_verifier', verifier);

	console.log('sending to spotify: ', params);
	const result = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: params
	});
	
	const response = await result.json();
	console.log(response);
	
	const { access_token, refresh_token } = response;
	
	if (access_token) {
		request.cookies.set('access_token', access_token, { maxAge: 3600, path: '/' });
		
		// Only set the refresh token if it exists
		if (refresh_token) {
			request.cookies.set('refresh_token', refresh_token, { path: '/' });
		}
		
		return access_token;
	} else {
		console.log('Houston, we have a problem ');
		console.log(response);
		
		if (request.redirect) {
			request.redirect(303, '/portfolio/spotifyPlaylistMix/login');
		} else {
			redirect(303, '/portfolio/spotifyPlaylistMix/login');
		}
		
		return null; // This line won't execute due to redirect, but TypeScript needs it
	}
}
