const {parseTime} = require('@core/utils');

const cookieConfig = {
    domain: process.env.COOKIES_DOMAIN,
    httpOnly: true,
    sameSite: 'Strict'
};

class CookieHelper {
    setTokens(ctx, tokens) {
        const {accessToken, refreshToken} = tokens;
        ctx.cookies.set('access_token', accessToken, {
            ...cookieConfig,
            maxAge: parseTime(process.env.ACCESS_TOKEN_EXPIRES_IN)
        });
        ctx.cookies.set('refresh_token', refreshToken, {
            ...cookieConfig,
            maxAge: parseTime(process.env.REFRESH_TOKEN_EXPIRES_IN)
        });
    }

    clearTokens(ctx) {
        ctx.cookies.set('access_token', null, {...cookieConfig, maxAge: 0});
        ctx.cookies.set('refresh_token', null, {...cookieConfig, maxAge: 0});
    }
}

module.exports = new CookieHelper();
