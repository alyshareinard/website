declare module '$env/static/private' {
    export const SPOTIFY_CLIENT_ID: string;
    export const SPOTIFY_CLIENT_SECRET: string;
    export const spotifyRedirectURL: string;
}

declare module '$lib/server/spotify' {
    export function encrypt(text: string): string;
    export function decrypt(hash: string): string;
    export function getAccessToken(code: string): Promise<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
    }>;
    export function refreshAccessToken(refresh_token: string): Promise<{
        access_token: string;
        expires_in: number;
    }>;
}
