import { z } from 'zod';
const serviceOptions = ['Webpage', 'App', 'Integration'] as const;

export const contactFormSchema = z.object({
		fname: z.string().min(2),
		lname: z.string().min(2),
		email: z.string().email(),
		serviceTypes: z.enum(serviceOptions),
		memo: z.string().min(10),
	});


export type ContactFormSchema = typeof contactFormSchema;


