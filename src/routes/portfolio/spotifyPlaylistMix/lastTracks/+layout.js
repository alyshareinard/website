import { redirect } from '@sveltejs/kit';
console.log("loading layout")

export const load = async ({ locals }) => {
    console.log(locals)
    if(!locals?.session?.user) {
        console.log("user not found, redirecting")
        throw redirect(307, './login/');
    }    
    return {
        user: locals.session.user,
    }
} 