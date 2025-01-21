import { AIRTABLE_BASE_ID, contactForm_api } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import { superValidate, type JSONSchema } from 'sveltekit-superforms';
import { schemasafe } from 'sveltekit-superforms/adapters';
import { message } from 'sveltekit-superforms';

//import { CLOUDFLARE_SECRET_KEY } from '$env/static/private';

//watch https://levelup.video/tutorials/sveltekit/custom-form-handlers to improve in future



const schema = {
	type: 'object',
	properties: {
	  fname: { type: 'string', minLength: 2 },
	  lname: { type: 'string', minLength: 2 },
	  email: { type: 'string', format: 'email' },
	  serviceTypes: { type: 'string', enum: ['Webpage', 'App', 'Integration'] },
	  memo: { type: 'string', minLength: 10 },
	},
	required: ['fname', 'lname', 'email', 'serviceTypes', 'memo'],
	additionalProperties: false,
	$schema: 'http://json-schema.org/draft-07/schema#'
  } as const satisfies JSONSchema; // Define as const to get type inference
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

export const load = async () => {
	const form = await superValidate(schemasafe(schema));
	console.log('in load form is ', form);
	// Always return { form } in load functions
	return { form };
};





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

    default: async ({ request }) => {
		console.log('do I get here?');
        const formData = await request.formData();
        const form = await superValidate(formData, schemasafe(schema));

		if (!form.valid) fail(400, { form });

		
		const { fname, lname, email, serviceTypes, memo } = form.data;


		//const token = turnstile // if you edited the formsField option change this
        //const SECRET_KEY = CLOUDFLARE_SECRET_KEY // you should use $env module for secrets
		//console.log('checking token', token)
        //const { turnstyleSuccess, turnstyleError } = await validateToken(token, SECRET_KEY);
		//console.log('success', turnstyleSuccess)
		//console.log('error',   turnstyleError)
        //if (!turnstyleSuccess)
        //    return {
        //        error: turnstyleError || 'Invalid CAPTCHA',
        //    };

		const AIRTABLE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/submissions`;

		const data = {
			records: [
				{
					fields: {
						fname,
						lname,
						email,
						serviceTypes,
						memo,
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
		console.log('response', response);

        return message(form, 'Form posted successfully!');

	},

};