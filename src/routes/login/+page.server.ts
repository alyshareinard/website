import { superValidate } from 'sveltekit-superforms';
import { schemasafe, type ValidationAdapter } from 'sveltekit-superforms/adapters';
import { loginSchema } from './login-schema';
import { fail, type RequestEvent } from '@sveltejs/kit';

const loginAdapter = schemasafe(loginSchema) as ValidationAdapter<Record<string, unknown>>;

export const load = async () => {
	const form = await superValidate(loginAdapter);
	return { form };
};

export const actions = {
	default: async ({ request }: RequestEvent) => {
		const form = await superValidate(request, loginAdapter);

		if (!form.valid) {
			return fail(400, { form });
		}

		// Here you would typically validate the credentials
		// For now, we'll just return invalid credentials
		return { form };
	}
};
