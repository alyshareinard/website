import { spotifyClientId, spotifyRedirectURL } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

function generateRandomString(length) {
	let text = '';
	let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
async function generateCodeChallenge(codeVerifier) {
	function base64encode(string) {
		return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
			.replace(/\+/g, '-')
			.replace(/\//g, '_')
			.replace(/=+$/, '');
	}

	const encoder = new TextEncoder();
	const data = encoder.encode(codeVerifier);


	const digest = await  crypto.subtle.digest('SHA-256', data);

	return base64encode(digest);

}
async function get_code(event) {

 
	//if cookie exists delete it
	if (event.cookies.get('access_token', { path: '/' })) {
		event.cookies.delete('access_token', { path: '/' })
	}
	if (event.cookies.get('refresh_token', { path: '/' })) {
		event.cookies.delete('refresh_token', { path: '/' })
	}

	
	let codeVerifier = await generateRandomString(128);

	const challenge = await generateCodeChallenge(codeVerifier);
	event.cookies.set('code_verifier', codeVerifier, { path: '/' })
	let state = generateRandomString(16);
	let scope = 'user-library-read user-read-private user-read-email playlist-read-private playlist-read-collaborative user-library-modify playlist-modify-private playlist-modify-public user-read-recently-played'

	let args = new URLSearchParams({
		response_type: 'code',
		client_id: spotifyClientId,
		scope: scope,
		redirect_uri: spotifyRedirectURL,
		state: state,
		code_challenge_method: 'S256',
		code_challenge: challenge
	});
	let url = 'https://accounts.spotify.com/authorize?' + args;
    return(url)
}

/** @type {import('./$types').Actions} */
export const actions = {
    default: async (event) => {
		console.log(' IN LOGIN ACTIONS', event)
        let url = await get_code(event);
		console.log('url: ', url)

        throw(redirect(303, url))

    }
}