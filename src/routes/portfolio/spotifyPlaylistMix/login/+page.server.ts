import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { startLogin } from '../spotifyAuth.server';

export const actions: Actions = {
	default: async ({ cookies }) => {
		redirect(303, await startLogin(cookies));
	}
};
