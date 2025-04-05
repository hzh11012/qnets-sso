const SmsManager = require('@core/sms');
const {HttpException, AuthFailed, Forbidden} = require('@core/http-exception');
const AccountDao = require('@dao/account');
const CookieHelper = require('@core/cookie');
const {generateToken, parseTime} = require('@core/utils');
const jwt = require('jsonwebtoken');
const redis = require('@core/redis');

class AuthService {
    async login(phone, code, ctx) {
        const verifyRes = await SmsManager.verifyCode(phone, code);
        if (!verifyRes) throw new AuthFailed('验证码错误');
        // 验证后清楚验证码
        await SmsManager.delCode(phone);

        const [err, account] = await AccountDao.findOrCreate(phone);
        if (err) throw new HttpException(`用户注册失败：${err.msg}`);

        const tokens = await this.generateTokens(account, ctx.ip);
        CookieHelper.setTokens(ctx, tokens);

        return tokens;
    }

    async generateTokens(account, ip) {
        const {id, phone} = account;
        const accessToken = generateToken({id, phone});
        const refreshToken = generateToken({id, phone, ip}, true);

        await redis.set(
            `refresh_token:${phone}`,
            refreshToken,
            parseTime(process.env.REFRESH_TOKEN_EXPIRES_IN) / 1000
        );
        return {accessToken, refreshToken};
    }

    verifyToken(token) {
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

    async refreshTokens(token, ctx) {
        if (!token) throw new Forbidden('未携带令牌');

        try {
            const decode = jwt.verify(
                token.replace('Bearer ', ''),
                process.env.REFRESH_TOKEN_SECRET_KEY
            );
            const _token = await redis.get(`refresh_token:${decode.phone}`);

            if (
                !_token ||
                _token !== token.replace('Bearer ', '') ||
                decode.ip !== ctx.ip
            )
                throw new AuthFailed('无效令牌');

                
            const tokens = await this.generateTokens(decode, ctx.ip);
            CookieHelper.setTokens(ctx, tokens);
        } catch (err) {
            console.log(err);
            if (err.name === 'TokenExpiredError')
                throw new AuthFailed('令牌已过期');

            throw new AuthFailed('无效令牌');
        }
    }

    logout(ctx) {
        CookieHelper.clearTokens(ctx);
    }
}

module.exports = new AuthService();
