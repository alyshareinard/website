import { redirect } from '@sveltejs/kit';
    export const load = async ({ locals }) => {      
        if(locals?.session?.user) {
            console.log("redirecting from login page")
            throw redirect(302, '..');
        }
        
        return {}
    }