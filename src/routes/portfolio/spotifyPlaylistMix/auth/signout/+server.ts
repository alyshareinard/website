import { dev } from '$app/environment';
import { serialize } from 'cookie';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
    const headers = new Headers();
    
    // Set cookies
    const cookies = [
        serialize('accessToken', '', {
            path: '/',
            httpOnly: true,
            maxAge: 0,
            secure: !dev,
            sameSite: 'lax'
        }),
        serialize('refreshToken', '', {
            path: '/',
            httpOnly: true,
            maxAge: 0,
            secure: !dev,
            sameSite: 'lax'
        }),
        serialize('user', '', {
            path: '/',
            httpOnly: true,
            maxAge: 0,
            secure: !dev,
            sameSite: 'lax'
        })
    ];

    cookies.forEach(cookie => headers.append('set-cookie', cookie));
    headers.set('Location', '/portfolio/spotifyPlaylistMix');

    return new Response(null, {
        status: 302,
        headers
    });
}
