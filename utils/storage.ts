import dotenv from 'dotenv';

dotenv.config();

export const CLIENT_ID = process.env.CLIENT_ID || 'default_client_id';
export const REDIRECT_URIS = process.env.REDIRECT_URIS?.split(',') || ['http://localhost:8081/process'];
export const SECRET_KEY = process.env.JWT_SECRET || '';

if (!SECRET_KEY) {
    throw new Error("JWT_SECRET is required. Please set it in the .env file.");
}

export const authorizationCodes = new Map<string, { client_id: string; expiresAt: number }>();
export const refreshTokens = new Map<string, string>();
