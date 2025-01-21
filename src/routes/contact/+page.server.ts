import { CLOUDFLARE_SECRET_KEY } from '$env/static/private';
import { AIRTABLE_BASE_ID, contactForm_api } from '$env/static/private';
import { fail } from '@sveltejs/kit';
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
		turnstile: { type: 'string' },
		memo: { type: 'string', minLength: 10 }
	},
	required: ['fname', 'lname', 'email', 'serviceTypes', 'turnstile', 'memo'],
	additionalProperties: false,
	$schema: 'http://json-schema.org/draft-07/schema#'
} as const satisfies JSONSchema; // Define as const to get type inference

export const load = async () => {
	const form = await superValidate(schemasafe(schema));
	console.log('in load form is ', form);
	// Always return { form } in load functions
	return { form };
};

export const actions = {
	default: async ({ request }) => {
		console.log('do I get here?');
		const formData = await request.formData();

		//const token = formData.get('cf-turnstile-response') as string;
		const form = await superValidate(formData, schemasafe(schema));

		if (!form.valid) fail(400, { form });

		const { fname, lname, email, serviceTypes, turnstile, memo } = form.data;

		const token = turnstile; // if you edited the formsField option change this
		const SECRET_KEY = CLOUDFLARE_SECRET_KEY; // you should use $env module for secrets
		console.log('checking token', token);
		const { success, error } = await validateToken(token, SECRET_KEY);
		console.log('success', success);
		console.log('error', error);
		if (!success) {
			console.log('this should return on invalid captcha');
			return message(form, 'Invalid captcha');
		}
			//fail(400, { error: error || "Invalid CAPTCHA"});
			
		//		    return {
		//				submission_status:'failed',
		//				return message(form, 'Form posted successfully!');
		//		        error: error || 'Invalid CAPTCHA',
		//		    };

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
						//						turnstile
					}
				}
			]
		};
		console.log('sending', data.records[0].fields);
		const response = await fetch(AIRTABLE_URL, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${contactForm_api}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		console.log('response from airtable', response);

		return message(form, 'Form posted successfully!');
	}
};
