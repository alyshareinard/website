import { spotifyClientId, spotifyRedirectURL } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
export async function refresh_token(cookies) {
	console.log('in refresh_token');
	let refresh_token = cookies.get('refresh_token');

	const params = new URLSearchParams();
	params.append('client_id', spotifyClientId);
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
		cookies.set('access_token', access_token, { maxAge: 3600 });
		cookies.set('refresh_token', new_refresh_token);
	} else {
		cookies.delete('refresh_token');
		console.log('Houston, we have a problem ');
		console.log(response);
		throw redirect(303, spotifyRedirectURL + 'login');
	}

	return access_token;
}
export async function get_token(url) {
	let verifier = url.cookies.get('code_verifier');
	let code = url.cookies.get('code');

	const params = new URLSearchParams();
	params.append('client_id', spotifyClientId);
	params.append('grant_type', 'authorization_code');
	params.append('code', code);
	params.append('redirect_uri', spotifyRedirectURL);
	params.append('code_verifier', verifier);

	console.log('sending: ', params);
	const result = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: params
	});
	const response = await result.json();
	console.log(response);
	const { access_token, refresh_token } = response;
	if (access_token) {
		url.cookies.set('access_token', access_token, { maxAge: 3600 });
		url.cookies.set('refresh_token', refresh_token);
		return access_token;
	} else {
		console.log('Houston, we have a problem ');
		console.log(response);
		throw redirect(303, url.url.href + '/login');
	}
}
