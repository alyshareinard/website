import { superValidate } from 'sveltekit-superforms/server';
import { loginSchema } from './login-schema';
import { fail } from '@sveltejs/kit';
export const load = async () => {
	// Server API:
	const form = await superValidate(loginSchema);

	// Always return { form } in load and form actions.
	return { form };
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, loginSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		// TODO: Do something with the validated data

		return { form };
	}
};
