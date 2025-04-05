const tencentCloud = require('tencentcloud-sdk-nodejs');
const {randomNum} = require('@core/utils');
const redis = require('@core/redis');

const smsClient = tencentCloud.sms.v20210111.Client;

const params = {
    // 应用 ID
    SmsSdkAppId: process.env.SMS_APP_ID,
    // 短信签名内容
    SignName: process.env.SMS_SIGN_NAME,
    // 模板 ID
    TemplateId: process.env.SMS_TEMPLATE_ID
};

const config = {
    credential: {
        secretId: process.env.SMS_SECRET_ID,
        secretKey: process.env.SMS_SECRET_KEY
    },
    region: process.env.SMS_REGION
};

class SmsManager {
    client;

    constructor() {
        this.client = new smsClient(config);
    }

    async delCode(phone) {
        await redis.del(`sms:${phone}`);
    }

    async verifyCode(phone, code) {
        const _code = await redis.get(`sms:${phone}`);
        return _code && _code === code;
    }

    async sendCode(phone, age) {
        const code = randomNum(6);
        const maxAge = age || 5;
        const config = {
            ...params,
            TemplateParamSet: [code, String(maxAge)],
            PhoneNumberSet: [`+86${phone}`]
        };
        await this.client.SendSms(config);
        return [code, maxAge];
    }
}

module.exports = new SmsManager();
