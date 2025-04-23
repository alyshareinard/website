import { AIRTABLE_BASE_ID, contactForm_api } from '$env/static/private';
import { TURNSTILE_SECRET_KEY } from '$env/static/private';
import { fail, type RequestEvent } from '@sveltejs/kit';

interface TokenValidateResponse {
	'error-codes': string[];
	success: boolean;
	action: string;
	cdata: string;
}

interface ValidationResult {
	success: boolean;
	error?: string;
}

async function validateToken(token: string | null, secret: string): Promise<ValidationResult> {
	if (!token) return { success: false, error: 'No token provided' };

	console.log('Validating turnstile token...');
	try {
		const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				response: token,
				secret
			})
		});

		const data: TokenValidateResponse = await response.json();
		console.log('Turnstile validation response:', data);

		if (!data.success) {
			return { success: false, error: data['error-codes']?.join(', ') || 'Validation failed' };
		}

		return { success: true };
	} catch (error) {
		console.error('Error validating token:', error);
		return { success: false, error: 'Failed to validate token' };
	}
}

export const actions = {
	submit: async ({ request }: RequestEvent) => {
		const formData = await request.formData();

		// Get form data
		const fname = formData.get('fname');
		const lname = formData.get('lname');
		const email = formData.get('email');
		const serviceTypes = formData.get('serviceTypes');
		const memo = formData.get('memo');
		const token = formData.get('cf-turnstile-response');

		// Basic validation
		if (!fname || !lname || !email || !serviceTypes || !memo) {
			return fail(400, { message: 'All fields are required' });
		}

		// Validate Turnstile token
		const { success, error } = await validateToken(token?.toString() || null, TURNSTILE_SECRET_KEY);
		if (!success) {
			return fail(400, {
				error: error || 'Invalid CAPTCHA'
			});
		}

		// Submit to Airtable
		try {
			// Validate environment variables
			if (!contactForm_api || !AIRTABLE_BASE_ID) {
				console.error('Missing required environment variables:', {
					hasApiKey: !!contactForm_api,
					hasBaseId: !!AIRTABLE_BASE_ID
				});
				throw new Error('Missing required Airtable configuration');
			}

			console.log('Submitting to Airtable...');

			const airtableResponse = await fetch(
				`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Submissions`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${contactForm_api}`,
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						records: [
							{
								fields: {
									fname: fname.toString(),
									lname: lname.toString(),
									email: email.toString(),
									serviceTypes: serviceTypes.toString(),
									memo: memo.toString()
								}
							}
						]
					})
				}
			);

			console.log('Airtable response status:', airtableResponse.status);
			console.log('Airtable response status text:', airtableResponse.statusText);

			if (!airtableResponse.ok) {
				const errorData = await airtableResponse.text();
				console.error('Airtable error response:', errorData);
				throw new Error(`Failed to submit to Airtable: ${airtableResponse.status} ${airtableResponse.statusText}`);
			}

			// Parse response to confirm success
			const responseData = await airtableResponse.json();
			console.log('Airtable success response:', responseData);

			return {
				success: true
			};
		} catch (error) {
			console.error('Form submission error:', error);
			return fail(500, { message: 'An unexpected error occurred' });
		}
	}
};
