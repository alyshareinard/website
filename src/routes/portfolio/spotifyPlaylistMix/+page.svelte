<script>
    import { get_token, get_profile } from './login/spotifyPkceAuth'
    import { access_token, the_code, code_verifier } from './spotifyCreds.js'
    import { onMount } from 'svelte';
    import { get } from 'svelte/store';
    import { page } from '$app/stores'
    import { redirect } from '@sveltejs/kit';
	import { goto } from '$app/navigation';

    let savestore = false
    $: if (savestore && $the_code) {
        window.sessionStorage.setItem("the_code", JSON.stringify($the_code))
    }
    $: if (savestore && $code_verifier) {
        window.sessionStorage.setItem("code_verifier", JSON.stringify($code_verifier))
    }

    let profile;
    onMount(() => {
        let ses = window.sessionStorage.getItem("the_code")
        if (ses) {
            console.log("sob-- ~ loading the code", ses)
            $the_code = JSON.parse(ses)
        }
        ses = window.sessionStorage.getItem("code_verifier")
        if (ses) {
            console.log("sob-- ~ loading verifier", ses)
            $code_verifier = JSON.parse(ses)
        }
    savestore = true
        console.log('on mount')
        console.log("verifier", get(code_verifier))
        console.log("code", get(the_code))
        if(get(access_token)){
            console.log("access token exists")
            console.log(access_token)
            profile = get_profile()
            console.log(profile)
        } else if(get(the_code)) {
            console.log("page.svelte - getting access token")
            let myToken = get_token()
            console.log(myToken)
        } else if ($page.url?.searchParams.get('code')){
            const code = $page.url?.searchParams.get('code');
            console.log('setting code as', code)
            the_code.set(code)
            console.log("now getting access token")
            let myToken = get_token()
            console.log(myToken) 
        } else {
            console.log("redirecting to login")
            goto('spotifyPlaylistMix/login/');
        }
    })
    


//    $: if(get(access_token)){
        
        
//    }
</script>


<p>
so far so good

</p>
{profile}
