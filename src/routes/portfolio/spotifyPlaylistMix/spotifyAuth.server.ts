import { SPOTIFY_CLIENT_ID,  spotifyRedirectURL } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
export async function refresh_token(cookies) {
	console.log('in refresh_token');
	let refresh_token = cookies.get('refresh_token', { path: '/' });

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
	const { access_token, new_refresh_token } = await response;
	if (access_token) {
		console.log('TRYING TO SET COOKIES');
		cookies.set('access_token', access_token, { maxAge: 3600, path: '/' });
		cookies.set('refresh_token', new_refresh_token, { path: '/' });
	} else {
		cookies.delete('refresh_token', { path: '/' });
		console.log('Houston, we have a problem ');
		console.log(response);
		redirect(303, '../login');
	}

	return access_token;
}
export async function get_token(url) {
	let verifier = url.cookies.get('code_verifier', { path: '/' });
	let code = url.cookies.get('code', { path: '/' });

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
		url.cookies.set('access_token', access_token, { maxAge: 3600,  path: '/' });
		url.cookies.set('refresh_token', refresh_token, { path: '/' });
		return access_token;
	} else {
		console.log('Houston, we have a problem ');
		console.log(response);
		redirect(303, url.url.href + '/login');
	}
}
