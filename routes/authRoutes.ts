import express, { Request, Response } from 'express';
import { randomBytes } from 'crypto';
import { CLIENT_ID, REDIRECT_URIS, authorizationCodes } from '../utils/storage';
import { validateAuthorizeRequest } from '../utils/validators';

const router = express.Router();

router.get('/authorize', (req: Request, res: Response): void => {
    const { error, isValid } = validateAuthorizeRequest(req.query);
    if (!isValid) {
        res.status(400).json({ error });
        return;
    }

    const authCode = randomBytes(16).toString('hex');
    authorizationCodes.set(authCode, { client_id: CLIENT_ID, expiresAt: Date.now() + 300000 });

    let redirectUrl = `${req.query.redirect_uri}?code=${authCode}`;
    if (req.query.state) redirectUrl += `&state=${req.query.state}`;

    res.redirect(302, redirectUrl);
});

export default router;
