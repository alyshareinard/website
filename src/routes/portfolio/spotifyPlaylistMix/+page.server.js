
import { redirect } from '@sveltejs/kit';
import { spotifyClientId, spotifyRedirectURL } from '$env/static/private';
/** @type {import('./$types').PageServerLoad} */

async function get_token(cookies) {
	let verifier = cookies.get("code_verifier");
	let code = cookies.get("code");


    const params = new URLSearchParams();
    params.append("client_id", spotifyClientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", spotifyRedirectURL);
    params.append("code_verifier", verifier);

    console.log("sending: ", params);
    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });
    const response = await result.json()
    console.log("RESPONSE: ", response);
    const { access_token } = response;
    console.log("accss token is", access_token)
    cookies.set("access_token", access_token, {maxAge:3600});

    return access_token;
}
async function get_profile(cookies) {
        
	const response = await fetch('https://api.spotify.com/v1/me', {
		headers: {
			Authorization: 'Bearer ' + cookies.get("access_token")
		}
	});

	const data = await response.json();
	console.log("in get profile")
	console.log(data)
	return(data.display_name)
}


export async function load(url) {
    let user_name=""
    console.log('url: ', url)
        if (url.url.searchParams.has('code')) {
            const code = url.url.searchParams.get('code');
            url.cookies.set("code",code)
            url.url.searchParams.set('code', null)
            console.log("code is ", code)
            console.log('removing the evidence')
            const new_url = url.url.pathname
            console.log('redirecting to ' + new_url)
            
            throw(redirect(303, new_url))

        } else if (url.cookies.get("access_token")) {
            console.log("access token is ", url.cookies.get("access_token"))
            user_name=await get_profile(url.cookies)
        }else if (url.cookies.get('code')) { 
            console.log("The code in cookies is ", url.cookies.get('code'))
            const result = await get_token(url.cookies)
            console.log("result is ", result)
//            console.log(get_profile(url.cookies))
        } else {
            console.log('no code, sending to login page')
            throw(redirect(303, url.url.href + '/login'))
        }

        return {
            user_name
        }

}