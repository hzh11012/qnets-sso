const Router = require('koa-router');
const {LoginValidator, PhoneValidator} = require('@validators/sso');
const {Resolve} = require('@core/http-exception');
const smsService = require('@service/sms');
const authService = require('@service/auth');
const res = new Resolve();

const router = new Router({
    prefix: '/api/sso'
});

// 获取短信验证码
router.post('/code', async ctx => {
    const {phone} = PhoneValidator(ctx.request.body);

    await smsService.sendCode(phone);

    ctx.response.status = 200;
    ctx.body = res.success('验证码发送成功');
});

// 登录
router.post('/login', async ctx => {
    const {phone, code} = LoginValidator(ctx.request.body);

    await authService.login(phone, code, ctx);

    ctx.response.status = 200;
    ctx.body = res.success('登录成功');
});

// 更新token
router.post('/refresh', async ctx => {
    const token = ctx.headers.authorization;

    await authService.refreshTokens(token, ctx);

    ctx.response.status = 200;
    ctx.body = res.success('令牌更新成功');
});

// 验证token
router.post('/verify', ctx => {
    const token = ctx.headers.authorization;

    const data = authService.verifyToken(token);

    ctx.response.status = 200;
    ctx.body = res.json(data, '令牌验证成功');
});

// 退出登录
router.post('/logout', ctx => {
    authService.logout(token);

    ctx.response.status = 200;
    ctx.body = res.success('退出登录成功');
});

module.exports = router;
