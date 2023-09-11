import { PUBLIC_spotifyClientId, PUBLIC_spotifyRedirectURL } from '$env/static/public';
import { code_verifier, the_code, access_token } from '../spotifyCreds.js';
import { browser } from '$app/environment';
import { get } from 'svelte/store';

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
	if (browser) {
		const digest = await window.crypto.subtle.digest('SHA-256', data);
		return base64encode(digest);
	}
}

export async function get_code() {
	console.log("in get_code.  Should redirect to: ")
	console.log(PUBLIC_spotifyRedirectURL)
	
	let codeVerifier = generateRandomString(128);
	console.log(codeVerifier)
	const challenge = await generateCodeChallenge(codeVerifier);
	window.sessionStorage.setItem("code_verifier", JSON.stringify(codeVerifier))
	let state = generateRandomString(16);
	let scope = 'user-read-private user-read-email';
	code_verifier.set(codeVerifier);
	console.log("in memory ", get(code_verifier))

	let args = new URLSearchParams({
		response_type: 'code',
		client_id: PUBLIC_spotifyClientId,
		scope: scope,
		redirect_uri: PUBLIC_spotifyRedirectURL,
		state: state,
		code_challenge_method: 'S256',
		code_challenge: challenge
	});
	window.location = 'https://accounts.spotify.com/authorize?' + args;
}

export async function get_token() {
	let codeVerifier = get(code_verifier);
	let codeVerifier2=window.sessionStorage.getItem("code_verifier")
	let code = get(the_code);
	console.log("verifier", codeVerifier)
	console.log("verifier2", codeVerifier2)
	console.log("code", code)
	let args = new URLSearchParams({
		grant_type:'authorization_code',
		code:code,
		redirect_uri: PUBLIC_spotifyRedirectURL,
		client_id: PUBLIC_spotifyClientId,
		code_verifier: codeVerifier
		}).toString()
	console.log("sending this")
	console.log(args)
	console.log(args.grant_type)

	const response = fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: args
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error('HTTP status ' + response.status);
			}
			return response.json();
		})
		.then((data) => {
			console.log('in get token');
			console.log(data);
			access_token.set(data.access_token);
			return(data.access_token)
		})
		.catch((error) => {
			console.error('Error:', error);
		});
		console.log(response)
//		const { access_token } = await response.json();
//		console.log("ACCESS TOKEN IS: ", access_token)
//		return access_token;
}

export async function get_profile() {
	let codeVerifier = get(code_verifier);
	let code = get(the_code);
	console.log("verifier", codeVerifier)
	console.log("code", code)
	const response = await fetch('https://api.spotify.com/v1/me', {
		headers: {
			Authorization: 'Bearer ' + get(access_token)
		}
	});

	const data = await response.json();
	console.log("in get profile")
	console.log(data)
	return(data)
}
