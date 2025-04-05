const SmsManager = require('@core/sms');
const {HttpException} = require('@core/http-exception');
const redis = require('@core/redis');

class SmsService {
    async sendCode(phone) {
        try {
            const [code, maxAge] = await SmsManager.sendCode(phone);
            await redis.set(`sms:${phone}`, code, maxAge * 60);
        } catch (err) {
            throw new HttpException(`验证码发送失败: ${err.code}`);
        }
    }
}

module.exports = new SmsService();
