import { spotifyClientId, spotifyRedirectURL } from '$env/static/private';
import { browser } from '$app/environment';
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
	console.log("codeverifier ", codeVerifier)
	console.log("data ", data)

	const digest = await  crypto.subtle.digest('SHA-256', data);
	console.log("digest ", digest)
	return base64encode(digest);

}
async function get_code(event) {
	console.log("in get_code.  Should redirect to: ")
	console.log(spotifyRedirectURL)
	
	let codeVerifier = await generateRandomString(128);
	console.log("code verifier", codeVerifier)
	const challenge = await generateCodeChallenge(codeVerifier);
    console.log("challenge"), challenge
	event.cookies.set('code_verifier', codeVerifier)
	let state = generateRandomString(16);
	let scope = 'user-read-private user-read-email';

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
		console.log(event)
        let url = await get_code(event);
        console.log("URL is: ", url);
        throw(redirect(303, url))

    }
}