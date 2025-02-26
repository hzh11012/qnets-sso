require('module-alias/register');

const Koa = require('koa');
const onerror = require('koa-onerror');
const parser = require('koa-bodyparser');
const cors = require('@koa/cors');
const ratelimit = require('koa-ratelimit');
const InitManager = require('@core/init');
const errorConf = require('@middlewares/exception');
const {createServer} = require('http');
const dotenv = require('dotenv');

const envFile =
    process.env.NODE_ENV === 'production'
        ? '.env.production'
        : '.env.development';
dotenv.config({path: envFile});

const app = new Koa();

app.use(cors());
onerror(app, errorConf);
app.use(parser());

// 接口调用频率限制（Rate-Limiting）
// https://github.com/koajs/ratelimit
const db = new Map();
app.use(
    ratelimit({
        driver: 'memory',
        db: db,
        duration: 60000,
        errorMessage: '访问频率过高，请稍后再试',
        id: ctx => ctx.realIp,
        headers: {
            remaining: 'Rate-Limit-Remaining',
            reset: 'Rate-Limit-Reset',
            total: 'Rate-Limit-Total'
        },
        max: 99,
        disableHeader: false,
        whitelist: () => {},
        blacklist: () => {}
    })
);

// routes自动注册
InitManager.initCore(app);

const httpServer = createServer(app.callback());

httpServer.listen(process.env.NODE_PORT, () =>
    console.log(
        `当前 Node.js 服务已启动，地址: http://localhost:${process.env.NODE_PORT}`
    )
);

module.exports = httpServer;
