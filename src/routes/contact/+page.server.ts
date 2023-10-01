import { AIRTABLE_BASE_ID, contactForm_api } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';
//watch https://levelup.video/tutorials/sveltekit/custom-form-handlers to improve in future

const serviceOptions = ["Webpage", "Webapp", "Integration"] as const;
const new_contact = z.object({
	fname: z.string(),
    lname: z.string(),
	email: z.string().email(),
	serviceTypes: z.enum(serviceOptions),
	memo: z.string()
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

		const { fname, lname, email, serviceTypes,memo } = form.data;

		const AIRTABLE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/submissions`;

		let data = {
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
		console.log("sending", data.records[0].fields)
		const response = await fetch(AIRTABLE_URL, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${contactForm_api}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		console.log("response", response)

		return {
			form
		};
	}
};
