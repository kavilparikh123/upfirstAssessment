import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { CLIENT_ID, SECRET_KEY, authorizationCodes, refreshTokens } from '../utils/storage';
import { validateTokenRequest } from '../utils/validators';

const router = express.Router();

router.post('/token', (req: Request, res: Response): void => {
    const { error, isValid } = validateTokenRequest(req.body);
    if (!isValid) {
        res.status(400).json({ error });
        return;
    }

    const { grant_type, code, refresh_token, client_id } = req.body;

    if (grant_type === 'authorization_code') {
        const authCodeData = authorizationCodes.get(code);
        if (!authCodeData || Date.now() > authCodeData.expiresAt) {
            res.status(400).json({ error: 'Invalid or expired authorization code' });
            return;
        }

        authorizationCodes.delete(code);

        const accessToken = jwt.sign({ client_id }, SECRET_KEY, { expiresIn: '1h' });
        const newRefreshToken = randomBytes(32).toString('hex');
        refreshTokens.set(newRefreshToken, client_id);

        res.json({
            access_token: accessToken,
            token_type: 'bearer',
            expires_in: 3600,
            refresh_token: newRefreshToken,
        });
        return;
    }

    if (grant_type === 'refresh_token') {
        if (!refreshTokens.has(refresh_token)) {
            res.status(400).json({ error: 'Invalid refresh token' });
            return;
        }

        const accessToken = jwt.sign({ client_id }, SECRET_KEY, { expiresIn: '1h' });
        const newRefreshToken = randomBytes(32).toString('hex');

        refreshTokens.delete(refresh_token);
        refreshTokens.set(newRefreshToken, client_id);

        res.json({
            access_token: accessToken,
            token_type: 'bearer',
            expires_in: 3600,
            refresh_token: newRefreshToken,
        });
        return;
    }

    res.status(400).json({ error: 'Unsupported grant type' });
});

export default router;
