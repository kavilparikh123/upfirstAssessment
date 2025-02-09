export const validateAuthorizeRequest = (query: any) => {
    const { response_type, client_id, redirect_uri } = query;

    if (!response_type || response_type.toLowerCase() !== 'code') {
        return { error: 'Invalid response_type', isValid: false };
    }

    if (client_id !== process.env.CLIENT_ID) {
        return { error: 'Invalid client_id', isValid: false };
    }

    if (!process.env.REDIRECT_URIS?.split(',').includes(redirect_uri)) {
        return { error: 'Invalid redirect_uri', isValid: false };
    }

    return { isValid: true };
};

export const validateTokenRequest = (body: any) => {
    const { grant_type, client_id, redirect_uri } = body;

    if (!grant_type || !['authorization_code', 'refresh_token'].includes(grant_type)) {
        return { error: 'Invalid grant_type', isValid: false };
    }

    if (client_id !== process.env.CLIENT_ID) {
        return { error: 'Invalid client_id', isValid: false };
    }

    if (!process.env.REDIRECT_URIS?.split(',').includes(redirect_uri)) {
        return { error: 'Invalid redirect_uri', isValid: false };
    }

    return { isValid: true };
};
