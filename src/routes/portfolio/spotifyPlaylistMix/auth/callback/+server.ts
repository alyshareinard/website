import { encrypt, getAccessToken } from '$lib/server/spotify';
import { serialize } from 'cookie';
import { dev } from '$app/environment';
import type { RequestHandler } from '@sveltejs/kit';

import type { Cookies } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, cookies }) => {
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    if (!code || !state) {
        return new Response(null, {
            status: 302,
            headers: {
                Location: '/#error=state_mismatch'
            }
        });
    }

    try {
        const codeVerifier = cookies.get('code_verifier');
        if (!codeVerifier) {
            return new Response(null, {
                status: 302,
                headers: {
                    Location: '/#error=missing_code_verifier'
                }
            });
        }

        const result = await getAccessToken(code, codeVerifier);
        const { access_token, refresh_token, expires_in } = result;
        
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const user = JSON.stringify(await response.json());

        const headers = new Headers();
        
        // Set cookies
        const cookieHeaders = [
            serialize('accessToken', access_token, {
                path: '/',
                httpOnly: true,
                maxAge: expires_in,
                secure: !dev,
                sameSite: 'lax'
            }),
            serialize('refreshToken', encrypt(refresh_token), {
                path: '/',
                httpOnly: true,
                secure: !dev,
                maxAge: 60 * 60 * 24,
                sameSite: 'lax'
            }),
            serialize('user', encrypt(user), {
                path: '/',
                httpOnly: true,
                secure: !dev,
                maxAge: 60 * 60 * 24,
                sameSite: 'lax'
            })
        ];

        cookieHeaders.forEach(cookie => headers.append('set-cookie', cookie));
        headers.set('Location', '/portfolio/spotifyPlaylistMix/login/success');

        return new Response(null, {
            status: 302,
            headers
        });
    } catch (error) {
        console.error('Spotify auth error:', error);
        return new Response(null, {
            status: 302,
            headers: {
                Location: '/portfolio/spotifyPlaylistMix/error'
            }
        });
    }
};
