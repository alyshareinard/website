import { writable} from 'svelte/store'

export const code_verifier = writable();
export const the_code = writable();
export const access_token = writable();