import { redirect, type RequestEvent, type ServerLoadEvent } from '@sveltejs/kit';
import { refresh_token, get_token } from './spotifyAuth.server.js';
import { create_playlist, get_playlists, get_profile } from './spotifyCode.server.js';

function cookieExistsAndHasValue(value: string, event: RequestEvent) {
	const cookieValue = event.cookies.get(value);
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

export async function load(event: ServerLoadEvent) {
	let user_name = '';
	let playlists;
	//first we check if there is a code in the URL

	if (event.url.searchParams.has('code')) {
		const code = event.url.searchParams.get('code') ?? '';
		event.cookies.set('code', code, { path: '/' });
		//		event.url.searchParams.set('code', null);
		const new_url = event.url.pathname;

		redirect(303, new_url);
	} else if (
		cookieExistsAndHasValue('refresh_token', event) &&
		!cookieExistsAndHasValue('access_token', event)
	) {
		await refresh_token(event.cookies);
		user_name = await get_profile(event.cookies, user_name);
		playlists = await get_playlists(event.cookies, playlists);
	} else if (cookieExistsAndHasValue('access_token', event)) {
		user_name = await get_profile(event.cookies, user_name);
		playlists = await get_playlists(event.cookies, playlists);
	} else if (cookieExistsAndHasValue('code', event)) {
		try {
			await get_token(event);
			user_name = await get_profile(event.cookies, user_name);
			playlists = await get_playlists(event.cookies, playlists);
		} catch (error) {
			console.log('Error causing redirect: ', error);
			redirect(303, event.url.href + '/login');
		}
	} else {
		console.log('no code, sending to login page' + event.url.href);
		redirect(303, event.url.href + '/login');
	}

	return {
		user_name,
		playlists
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	default: async ({ cookies, request }: RequestEvent) => {
		const data = await request.formData();
		console.log('in page.server, data is: ', data);
		const liked_songs = data.get('liked_songs') === 'true';
		console.log('liked songs is in actions: ', liked_songs);
		const chosen_playlists = data.get('chosen_playlists')?.toString() || '[]';
		const avoid_playlists = data.get('avoid_playlists')?.toString() || '[]';
		const todays_playlist = data.get('todays_playlist')?.toString() || 'false';
		console.log("Today's list in actions is: ", todays_playlist);
		console.log('action triggered');
		const complete = await create_playlist(
			liked_songs,
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
