export const contactFormSchema = z.object({
	name: z.string().default('Hello world!'),
	email: z.string().email(),
    message:z.string(),
});

export type contactFormSchema = typeof contactFormSchema;
