const nodemailer = require('nodemailer');
const {randomNum} = require('@core/utils');
const redis = require('@core/redis');
const generateEmailTemplate = require('@core/template');

const config = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
};

class EmailManager {
    client;

    constructor() {
        this.client = nodemailer.createTransport(config);
    }

    async delCode(email) {
        await redis.del(`email:${email}`);
    }

    async verifyCode(email, code) {
        const _code = await redis.get(`email:${email}`);
        return _code && _code === code;
    }

    async sendCode(email, age) {
        const code = randomNum(6);
        const maxAge = age || 5;
        const options = {
            from: `"Qnets" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Qnets - 账号验证',
            html: generateEmailTemplate(code, maxAge)
        };

        await this.client.sendMail(options);
        return [code, maxAge];
    }
}

module.exports = new EmailManager();
