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
	default: async ({ request }: RequestEvent) => {
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
			const airtableResponse = await fetch(
				`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Contact%20Form`,
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

			if (!airtableResponse.ok) {
				throw new Error('Failed to submit to Airtable');
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
