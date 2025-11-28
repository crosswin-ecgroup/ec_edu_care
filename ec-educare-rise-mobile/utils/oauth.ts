import * as Crypto from 'expo-crypto';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { Platform } from 'react-native';

// Configuration
// In a real app, use env vars (e.g. process.env.EXPO_PUBLIC_IDENTITY_SERVER_URL)
export const IDENTITY_SERVER_URL = process.env.EXPO_PUBLIC_IDENTITY_SERVER_URL || 'https://localhost:5001';
export const CLIENT_ID = process.env.EXPO_PUBLIC_CLIENT_ID || 'ec-educare-mobile';
export const REDIRECT_URI = makeRedirectUri({
    scheme: 'com.eceducare.app'
});
export const SCOPES = process.env.EXPO_PUBLIC_SCOPES || 'openid profile email roles offline_access educare.api';

export async function generateCodeVerifier(): Promise<string> {
    // Generate a random string
    const randomBytes = await Crypto.getRandomBytesAsync(32);
    return toBase64Url(randomBytes);
}

export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
    const hash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        codeVerifier,
        { encoding: Crypto.CryptoEncoding.BASE64 }
    );
    // Convert standard base64 to base64url
    return hash.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function toBase64Url(buffer: Uint8Array): string {
    let str = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        str += String.fromCharCode(bytes[i]);
    }
    return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

// Polyfill btoa if needed (React Native usually has it, but just in case)
if (typeof btoa === 'undefined') {
    global.btoa = function (str) {
        return new Buffer(str, 'binary').toString('base64');
    };
}

export function buildAuthUrl(codeChallenge: string, state: string): string {
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        scope: SCOPES,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        state: state,
    });
    return `${IDENTITY_SERVER_URL}/connect/authorize?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string, codeVerifier: string): Promise<any> {
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
    });

    const response = await fetch(`${IDENTITY_SERVER_URL}/connect/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Token exchange failed: ${response.status} ${errorText}`);
    }

    return await response.json();
}

export async function refreshAccessToken(refreshToken: string): Promise<any> {
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
    });

    const response = await fetch(`${IDENTITY_SERVER_URL}/connect/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
    });

    if (!response.ok) {
        throw new Error('Token refresh failed');
    }

    return await response.json();
}

export async function revokeToken(token: string, type: 'access_token' | 'refresh_token' = 'access_token') {
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        token: token,
        token_type_hint: type
    });

    await fetch(`${IDENTITY_SERVER_URL}/connect/revocation`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
    });
}

export async function getUserInfo(accessToken: string) {
    const response = await fetch(`${IDENTITY_SERVER_URL}/connect/userinfo`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user info');
    }

    return await response.json();
}
