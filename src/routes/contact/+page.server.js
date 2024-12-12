import { AIRTABLE_BASE_ID, contactForm_api } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
import { CLOUDFLARE_SECRET_KEY } from '$env/static/private';
//watch https://levelup.video/tutorials/sveltekit/custom-form-handlers to improve in future

const serviceOptions = ['Webpage', 'App', 'Integration'];// as const;
const new_contact = z.object({
	fname: z.string(),
	lname: z.string(),
	email: z.string().email(),
	serviceTypes: z.enum(serviceOptions),
	memo: z.string(),
	turnstile: z.string()
});
/*
interface TokenValidateResponse {
    'error-codes': string[];
    success: boolean;
    action: string;
    cdata: string;
}*/

/*export const load = async (event) => {



	const form = await superValidate(event, new_contact);
	return {
		form
	};
};*/

async function validateToken(token, secret) {
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
		console.log('response', response)
    );

    const data = await response.json();

    return {
        // Return the status
        turnstyleSuccess: data.success,

        // Return the first error if it exists
        turnstyleError: data['error-codes']?.length ? data['error-codes'][0] : null,
    };
}

export const actions = {
	/*default: async ({ request }) => {
		console.log('In page.server.js, checking token');
        const data = await request.formData();

        const token = data.get('cf-turnstile-response'); // if you edited the formsField option change this
        const SECRET_KEY = CLOUDFLARE_SECRET_KEY; // you should use $env module for secrets
		console.log('looking for good token', token)
        const { success, error } = await validateToken(token, SECRET_KEY);
		console.log('success', success)
        if (!success)
            return {
                error: error || 'Invalid CAPTCHA',
            };

        // do something, the captcha is valid!
		return {
			success: true};
    },*/

	contactForm: async (event) => {
		console.log('do I get here?');
		const form = await superValidate(event, new_contact);

		if (!form.valid) fail(400, { form });

		
		const { fname, lname, email, serviceTypes, memo, turnstile } = form.data;

		const token = turnstile // if you edited the formsField option change this
        const SECRET_KEY = CLOUDFLARE_SECRET_KEY // you should use $env module for secrets
		console.log('checking token', token)
        const { success, error } = await validateToken(token, SECRET_KEY);
		console.log('success', success)
		console.log('error', error)
        if (!success)
            return {
                error: error || 'Invalid CAPTCHA',
            };

		const AIRTABLE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/submissions`;

		let data = {
			records: [
				{
					fields: {
						fname,
						lname,
						email,
						serviceTypes,
						memo,
						turnstile
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
		console.log('response', response);

		return {
			form
		};
	},

};
