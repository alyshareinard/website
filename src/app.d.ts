/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	namespace NodeJS {
		interface ProcessEnv {
			AIRTABLE_BASE_ID: string;
			contactForm_api: string;
			TURNSTILE_SECRET_KEY: string;
		}
	}
}

// Add type declarations for third-party modules
declare module 'svelte-carousel' {
	import type { SvelteComponentTyped } from 'svelte';

	export default class Carousel extends SvelteComponentTyped<{
		autoplay?: boolean;
		autoplayDuration?: number;
		dots?: boolean;
		infinite?: boolean;
		arrows?: boolean;
		particularItem?: number;
	}> {}
}

export {};
