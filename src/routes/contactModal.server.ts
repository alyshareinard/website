import { AIRTABLE_BASE_ID, contactForm_api} from '$env/static/private';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod'

const new_contact = z.object({
	name: z.string(),
	email: z.string().email(),
	contactMessage: z.string(),
})

export const load = async ({event}) => {
	const form = await superValidate(event, new_contact)
	return {
		form,
	}
}

export const actions = {
	default: async ({event}) => {
		const form = await superValidate(event, new_contact)
		console.log('POSTING: ',form);

		if (!form.valid) fail(400, { form })
		
		const { name, email, contactMessage } = form.data

		const AIRTABLE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Submissions`
		console.log(AIRTABLE_URL)
		let data = {
			records: [
				{
					fields: {
						"First name":"bob",
						"Last name":"boberson",
						"Message":"A message",
					},
				},
			],
		}
		console.log(data)
		try {
		const response = await fetch(AIRTABLE_URL, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${contactForm_api}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
		if (response) {
			const responsej = response.json();
			console.log(responsej)
			return message(form, responsej)
			// omitted
		}
		} catch (error) {
			console.log(error)
			return message(form, error)
		}

	},
}