import { redirect } from '@sveltejs/kit';
import { refresh_token, get_token } from './spotifyAuth.server.js';
import { create_playlist, get_playlists, get_profile } from './spotifyCode.server.js';

/** @type {import('./$types').PageServerLoad} */

function cookieExistsAndHasValue(value, url) {
	let cookieValue = url.cookies.get(value, { path: '/' });
	console.log('in cookies exist');
	console.log(value);

	if (!cookieValue) {
		console.log('cookie does not exist');
		return false;
	} else if (cookieValue == 'undefined') {
		console.log('cookie exists but is undefined');
	} else {
		console.log('cookie exists and has value');
		return true;
	}
}

export async function load(url) {
	let user_name = '';
	let playlists;
	//first we check if there is a code in the URL

	if (url.url.searchParams.has('code')) {
		const code = url.url.searchParams.get('code');
		url.cookies.set('code', code, { path: '/' });
//		url.url.searchParams.set('code', null);
		const new_url = url.url.pathname;

		redirect(303, new_url);
	} else if (
		cookieExistsAndHasValue('refresh_token', url) &&
		!cookieExistsAndHasValue('access_token', url)
	) {
		await refresh_token(url.cookies);
		user_name = await get_profile(url.cookies, user_name);
		playlists = await get_playlists(url.cookies, playlists);
	} else if (cookieExistsAndHasValue('access_token', url)) {
		user_name = await get_profile(url.cookies, user_name);
		playlists = await get_playlists(url.cookies, playlists);
	} else if (cookieExistsAndHasValue('code', url)) {
		try {
			await get_token(url);
			user_name = await get_profile(url.cookies, user_name);
			playlists = await get_playlists(url.cookies, playlists);
		} catch (error) {
			console.log('Error causing redirect: ', error);
			redirect(303, url.url.href + '/login');
		}
	} else {
		console.log('no code, sending to login page' + url.url.href);
		redirect(303, url.url.href + '/login');
	}

	return {
		user_name,
		playlists
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ cookies, request }) => {
		console.log('IN LOAD ACTIONS');
		const data = await request.formData();
		const chosen_playlists = data.get('chosen_playlists');
		const avoid_playlists = data.get('avoid_playlists');
		const todays_playlist = data.get('todays_playlist');
		console.log("Today's list in actions is: ", todays_playlist);
		console.log('action triggered');
		let complete = await create_playlist(
			chosen_playlists,
			avoid_playlists,
			todays_playlist,
			cookies
		);
		return {
			message: complete
		};
	}
};
