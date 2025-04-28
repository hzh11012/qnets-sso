const Router = require('koa-router');
const {LoginValidator, EmailValidator} = require('@validators/sso');
const {Resolve} = require('@core/http-exception');
const emailService = require('@service/email');
const authService = require('@service/auth');
const res = new Resolve();

const router = new Router({
    prefix: '/api/sso'
});

// 获取邮箱验证码
router.post('/code', async ctx => {
    const {email} = EmailValidator(ctx.request.body);

    await emailService.sendCode(email);

    ctx.response.status = 200;
    ctx.body = res.success('验证码发送成功');
});

// 登录
router.post('/login', async ctx => {
    const {email, code} = LoginValidator(ctx.request.body);

    await authService.login(email, code, ctx);

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
    authService.logout(ctx);

    ctx.response.status = 200;
    ctx.body = res.success('退出登录成功');
});

module.exports = router;
