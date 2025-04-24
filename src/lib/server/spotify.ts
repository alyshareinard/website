import crypto from 'crypto';
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '$env/static/private';

// Simple encryption using a hash of the secret
export function encrypt(text: string): string {
    const hash = crypto
        .createHmac('sha256', SPOTIFY_CLIENT_SECRET || 'fallback')
        .update(text)
        .digest('hex');
    return `${hash}:${text}`;
}

export function decrypt(hash: string): string {
    const [hashValue, text] = hash.split(':');
    const expectedHash = crypto
        .createHmac('sha256', SPOTIFY_CLIENT_SECRET || 'fallback')
        .update(text)
        .digest('hex');
    
    if (hashValue !== expectedHash) {
        throw new Error('Invalid hash');
    }
    
    return text;
}

export async function getAccessToken(code: string): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
}> {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', 'https://www.tech-aly.com/portfolio/spotifyPlaylistMix/auth/callback');

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(
                `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
            ).toString('base64')}`
        },
        body: params
    });

    if (!response.ok) {
        console.log(response)
        throw new Error('Failed to get access token');
    }

    return response.json();
}

export async function refreshAccessToken(refresh_token: string): Promise<{
    access_token: string;
    expires_in: number;
}> {
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refresh_token);

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(
                `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
            ).toString('base64')}`
        },
        body: params
    });

    if (!response.ok) {
        throw new Error('Failed to refresh token');
    }

    return response.json();
}
