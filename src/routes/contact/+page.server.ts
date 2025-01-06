
import { CLOUDFLARE_SECRET_KEY } from '$env/static/private';


interface TokenValidateResponse {
	'error-codes': string[];
	success: boolean;
	action: string;
	cdata: string;
}

/*const schema = {
	type: 'object',
	properties: {
		token: { type: 'string', minLength: 2 }
	},
	required: ['token'],
	additionalProperties: false,
	$schema: 'http://json-schema.org/draft-07/schema#'
} as const satisfies JSONSchema; // Define as const to get type inference
*/
/*
export const load = async () => {
	const form = await superValidate(schemasafe(schema));
	console.log('in load form is ', form);
	// Always return { form } in load functions
	return { form };
};*/

async function validateToken(token: string, secret: string) {
	const response = await fetch(
		'https://challenges.cloudflare.com/turnstile/v0/siteverify',
		{
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				response: token,
				secret: secret,
			}),
		},
	);

	const data: TokenValidateResponse = await response.json();

	return {
		// Return the status
		success: data.success,

		// Return the first error if it exists
		error: data['error-codes']?.length ? data['error-codes'][0] : null,
	};
}

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();

		const token = data.get('cf-turnstile-response') as string; // if you edited the formsField option change this
		const SECRET_KEY = CLOUDFLARE_SECRET_KEY; // you should use $env module for secrets

		const { success, error } = await validateToken(token, SECRET_KEY);
		console.log('success', success)
		console.log('error', error)
		if (!success)
			return {
				error: error || 'Invalid CAPTCHA',
			};
		else
			return {
				success: true,
		}

	},
};