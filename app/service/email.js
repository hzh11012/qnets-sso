const EmailManager = require('@core/email');
const {HttpException} = require('@core/http-exception');
const redis = require('@core/redis');

class EmailService {
    static async sendCode(email) {
        try {
            const [code, maxAge] = await EmailManager.sendCode(email);
            await redis.set(`email:${email}`, code, maxAge * 60);
        } catch (err) {
            throw new HttpException(`验证码发送失败: ${err.message}`);
        }
    }
}

module.exports = EmailService;
