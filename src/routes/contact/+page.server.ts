import { AIRTABLE_BASE_ID, contactForm_api } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
//watch https://levelup.video/tutorials/sveltekit/custom-form-handlers to improve in future

const new_contact = z.object({
	fname: z.string(),
    lname: z.string(),
	email: z.string().email(),
	message: z.string()
});

export const load = async (event) => {
	const form = await superValidate(event, new_contact);
	return {
		form
	};
};

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, new_contact);
		if (!form.valid) fail(400, { form });

		const { fname, lname, email, message } = form.data;

		const AIRTABLE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/submissions`;

		let data = {
			records: [
				{
					fields: {
						fname,
                        lname,
						email,
						message
					}
				}
			]
		};
		await fetch(AIRTABLE_URL, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${contactForm_api}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});

		return {
			form
		};
	}
};
