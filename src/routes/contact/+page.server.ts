import { AIRTABLE_BASE_ID, contactForm_api } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import { TURNSTILE_SECRET_KEY } from '$env/static/private';
interface TokenValidateResponse {
	'error-codes': string[];
	success: boolean;
	action: string;
	cdata: string;
}

async function validateToken(token: string, secret: string) {
	console.log('Validating turnstile token...');
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
		console.log('Form submission started...');
		try {
			const formData = await request.formData();
			console.log('Form data received:', Object.fromEntries(formData));
			const turnstileToken = formData.get('cf-turnstile-response');
			console.log('Turnstile token present:', !!turnstileToken);

			if (!turnstileToken || typeof turnstileToken !== 'string') {
				return fail(400, { message: 'Turnstile verification failed' });
			}

			// Validate the turnstile token
			const { success, error } = await validateToken(turnstileToken, TURNSTILE_SECRET_KEY);
			console.log('Turnstile validation result:', { success, error });
			if (!success) {
				console.error('Turnstile validation failed:', error);
				return fail(400, { message: 'Turnstile verification failed' });
			}

			// Get form fields
			const fname = formData.get('fname');
			const lname = formData.get('lname');
			const email = formData.get('email');
			const serviceTypes = formData.get('serviceTypes');
			const memo = formData.get('memo');

			// Basic validation
			if (!fname || !lname || !email || !serviceTypes || !memo) {
				return fail(400, { message: 'All fields are required' });
			}

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

			console.log('Submitting to Airtable...');
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
				console.log('Airtable error response:', errorData);
				console.error('Airtable API error:', errorData);
				return fail(500, { message: 'Failed to submit form' });
			}

			console.log('Form submission completed successfully');
			return { success: true, message: 'Form posted successfully!' };
		} catch (error) {
			console.error('Form submission error:', error);
			return fail(500, { message: 'An unexpected error occurred' });
		}
	}
};
