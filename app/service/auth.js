const EmailManager = require('@core/email');
const {AuthFailed, Forbidden} = require('@core/http-exception');
const AccountDao = require('@dao/account');
const CookieHelper = require('@core/cookie');
const {generateToken, parseTime} = require('@core/utils');
const jwt = require('jsonwebtoken');
const redis = require('@core/redis');

class AuthService {
    static async login(email, code, ctx) {
        const verifyRes = await EmailManager.verifyCode(email, code);
        if (!verifyRes) throw new AuthFailed('验证码错误');
        // 验证后清除验证码
        await EmailManager.delCode(email);

        const [err, account] = await AccountDao.findOrCreate(email);
        if (err) throw err;

        const tokens = await this.generateTokens(account, ctx.ip);
        CookieHelper.setTokens(ctx, tokens);

        return tokens;
    }

    static async generateTokens(account, ip) {
        const {id, email} = account;
        const accessToken = generateToken({id, email});
        const refreshToken = generateToken({id, email, ip}, true);

        await redis.set(
            `refresh_token:${email}`,
            refreshToken,
            parseTime(process.env.REFRESH_TOKEN_EXPIRES_IN) / 1000
        );
        return {accessToken, refreshToken};
    }

    static verifyToken(token) {
        if (!token) throw new Forbidden('未携带令牌');

        try {
            const decode = jwt.verify(
                token.replace('Bearer ', ''),
                process.env.ACCESS_TOKEN_SECRET_KEY
            );
            return decode;
        } catch (err) {
            if (err.name === 'TokenExpiredError')
                throw new AuthFailed('令牌已过期');

            throw new AuthFailed('无效令牌');
        }
    }

    static async refreshTokens(token, ctx) {
        if (!token) throw new Forbidden('未携带令牌');

        try {
            const decode = jwt.verify(
                token.replace('Bearer ', ''),
                process.env.REFRESH_TOKEN_SECRET_KEY
            );
            const _token = await redis.get(`refresh_token:${decode.email}`);

            if (
                !_token ||
                _token !== token.replace('Bearer ', '') ||
                decode.ip !== ctx.ip
            )
                throw new AuthFailed('无效令牌');

            const tokens = await this.generateTokens(decode, ctx.ip);
            CookieHelper.setTokens(ctx, tokens);
        } catch (err) {
            if (err.name === 'TokenExpiredError')
                throw new AuthFailed('令牌已过期');

            throw new AuthFailed('无效令牌');
        }
    }

    static logout(ctx) {
        CookieHelper.clearTokens(ctx);
    }
}

module.exports = AuthService;
