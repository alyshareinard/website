import { superValidate } from 'sveltekit-superforms/server';
import { loginSchema } from './login-schema';
import { fail } from '@sveltejs/kit';

export const load = async () => {
    const form = await superValidate(loginSchema);
    return { form };
};

export const actions = {
    default: async ({ request }) => {
        const form = await superValidate(request, loginSchema);
        
        if (!form.valid) {
            return fail(400, { form });
        }

        // Here you would typically validate the credentials
        // For now, we'll just return invalid credentials
        return { form };
    }
};
