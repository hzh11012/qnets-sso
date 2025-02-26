const Router = require('koa-router');
const {LoginValidator, PhoneValidator} = require('@validators/sso');
const {SmsManager} = require('@core/sms');
const {Resolve, Forbidden, AuthFailed} = require('@core/http-exception');
const basicAuth = require('basic-auth');
const jwt = require('jsonwebtoken');
const res = new Resolve();

const router = new Router({
    prefix: '/api/sso'
});

// 获取短信验证码
router.post('/code', ctx => {
    const parameter = PhoneValidator(ctx.request.body);
    SmsManager.sendCode(parameter.phone);
    ctx.response.status = 200;
    ctx.body = res.success('验证码发送成功');
});

module.exports = router;
