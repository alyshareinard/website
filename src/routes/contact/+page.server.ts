import { AIRTABLE_BASE_ID, contactForm_api } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import { TURNSTILE_SECRET_KEY } from '$env/static/private';
import { superValidate, type JSONSchema } from 'sveltekit-superforms';
import { schemasafe } from 'sveltekit-superforms/adapters';
import { message } from 'sveltekit-superforms';
interface TokenValidateResponse {
	'error-codes': string[];
	success: boolean;
	action: string;
	cdata: string;
}

async function validateToken(token: string, secret: string) {
	const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			response: token,
			secret: secret
		})
	});

	const data: TokenValidateResponse = await response.json();

	return {
		// Return the status
		success: data.success,

		// Return the first error if it exists
		error: data['error-codes']?.length ? data['error-codes'][0] : null
	};
}

const schema = {
	type: 'object',
	properties: {
		fname: { type: 'string', minLength: 2 },
		lname: { type: 'string', minLength: 2 },
		email: { type: 'string', format: 'email' },
		serviceTypes: { type: 'string', enum: ['Webpage', 'App', 'Integration'] },
		memo: { type: 'string', minLength: 10 }
	},
	required: ['fname', 'lname', 'email', 'serviceTypes', 'memo'],
	additionalProperties: false,
	$schema: 'http://json-schema.org/draft-07/schema#'
} as const satisfies JSONSchema; // Define as const to get type inference

export const load = async () => {
	const form = await superValidate(schemasafe(schema));
	console.log('in load form is ', form);
	// Always return { form } in load functions
	return { form };
};

async function verifyTurnstileToken(token: string) {
	const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			secret: TURNSTILE_SECRET_KEY,
			response: token
		})
	});

	const data = await response.json();
	return data.success;
}

export const actions = {
	default: async ({ request }) => {
		try {
			const formData = await request.formData();
			const turnstileToken = formData.get('cf-turnstile-response');

			if (!turnstileToken || typeof turnstileToken !== 'string') {
				return fail(400, { message: 'Turnstile verification failed' });
			}

			// Validate the turnstile token
			const { success, error } = await validateToken(turnstileToken, TURNSTILE_SECRET_KEY);
			if (!success) {
				console.error('Turnstile validation failed:', error);
				return fail(400, { message: 'Turnstile verification failed' });
			}

			// Validate the form data
			const form = await superValidate(formData, schemasafe(schema));
			if (!form.valid) {
				return fail(400, { form });
			}

			const { fname, lname, email, serviceTypes, memo } = form.data;

			// Submit to Airtable
			const AIRTABLE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/submissions`;
			const data = {
				records: [
					{
						fields: {
							fname,
							lname,
							email,
							serviceTypes,
							memo
						}
					}
				]
			};

			const response = await fetch(AIRTABLE_URL, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${contactForm_api}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});

			if (!response.ok) {
				const errorData = await response.json();
				console.error('Airtable API error:', errorData);
				return fail(500, { message: 'Failed to submit form' });
			}

			return message(form, 'Form posted successfully!');
		} catch (error) {
			console.error('Form submission error:', error);
			return fail(500, { message: 'An unexpected error occurred' });
		}
	}
};
