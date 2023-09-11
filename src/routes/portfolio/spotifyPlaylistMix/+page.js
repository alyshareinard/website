import { page } from '$app/stores'
import { the_code, access_token, code_verifier } from './spotifyCreds.js'
import { get } from 'svelte/store';
import { get_token, get_profile } from './login/spotifyPkceAuth.js'
import { redirect } from '@sveltejs/kit';
export function load() {
    console.log("in page.js")
    console.log("verifier", get(code_verifier))
    console.log("code", get(the_code))
/*    if(!get(the_code)) {
        console.log("checking the url for the code... ")
        console.log(page.data)
        const code = $page.url?.searchParams.get('code');

        console.log(code)
        the_code.set(code)
        console.log("setting the code")
        console.log(get(the_code))
/*        if ( code==null ){
            console.log("code not found, redirecting")
            throw redirect(307, './login/');
        }
    } else {
        console.log('code is still here!')
        console.log(get(the_code))
        get_token()
    }*/
    
}