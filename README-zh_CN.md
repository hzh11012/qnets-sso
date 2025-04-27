<div align="center"><a name="readme-top"></a>
<img height="180" src="https://camo.githubusercontent.com/be50e2d0b613d863b0e3336e74453ca8845797a9f29c3fcee5cbd401807c6009/68747470733a2f2f63646e2e716e6574732e636e2f6c6f676f2e737667" />
<h1 style="margin-top: 1.5rem">Qnets 认证中心</h1>

Qnets 单点登录服务端, 基于 Koa + Prisma + JWT 实现

[English](./README.md) · 中文

</div>

## 简介

- 本项目仅为单点登录服务端，用户只需要登录一次即可访问所有Qnets项目，且支持7天内免登录。

### 实现接口

> 接口无特殊说明，必须携带token进行鉴权

在 Postman 软件里选择 Authorization，Type选择Bearer Token，填写上token值即可。

在代码中需要在header上携带token：

```js
// 转码 token
function _encode() {
    const token = localStorage.getItem('token');
    return 'Bearer ' + token;
}

// 代码示例：重点看header携带 Authorization Bearer + token
ajax({
    url: 'http://localhost:4800/api/sso/login',
    method: 'GET',
    success: res => {
        console.log(res.data);
    },
    header: {
        Authorization: _encode()
    }
});

// 在 axios 携带token
config.headers['Authorization'] = _encode();
```

各模块具体接口请查看 [接口文档](https://github.com/hzh11012/qnets-sso/tree/master/doc)

### 技术栈

- koa2 框架
- prisma 对象关系映射
- zod 规则校验
- eslint + prettier 格式化
- module-alias 路径别名
- mysql 数据库

## 项目结构

### 目录结构

```js
│
├─app
   ├─api                // 接口层
   ├─dao                // DAO层
   ├─service            // 服务层
   └─validators         // 校验规则定义
├─core                  // 基础核心工具配置
├─doc                   // 接口文档
├─middleware            // 中间件
├─prisma                // 模型定义
├─app.js                // 主入口
└─...
```

## 配置

### 环境变量

> 环境变量不完整将会导致服务不可用, 请前往补充

[环境变量](https://github.com/hzh11012/qnets-sso/tree/master/.env)

- <code>NODE_PORT</code>：服务端口，默认 <code>4800</code>
- <code>DATABASE_URL</code>：Prisma MySQL 连接URL，格式mysql://USER:PASSWORD@HOST:PORT/DATABASE
- <code>ACCESS_TOKEN_SECRET_KEY</code>：访问令牌密钥
- <code>REFRESH_TOKEN_SECRET_KEY</code>：刷新令牌密钥
- <code>ACCESS_TOKEN_EXPIRES_IN</code>：访问令牌过期时间，默认 <code>1小时</code>
- <code>REFRESH_TOKEN_EXPIRES_IN</code>：刷新令牌过期时间，默认 <code>7天</code>
- <code>SMTP_HOST</code>：邮箱发送服务地址，默认 <code>smtp.qq.com</code>
- <code>SMTP_PORT</code>：邮箱发送服务端口，默认 <code>465</code>
- <code>SMTP_USER</code>：邮箱发送服务账号
- <code>SMTP_PASS</code>：邮箱发送服务密钥
- <code>COOKIES_DOMAIN</code>：Cookie的有效域

## 快速开始

```bash
$ git clone https://github.com/hzh11012/qnets-sso.git

## 安装依赖
$ yarn

## 运行
$ yarn dev
```

### 星历史

[![Star History Chart](https://api.star-history.com/svg?repos=hzh11012/qnets-sso&type=Date)](https://star-history.com/#hzh11012/qnets-sso)

### 贡献者

<a href="https://github.com/hzh11012/qnets-sso/graphs/contributors"><img src="https://contrib.rocks/image?repo=hzh11012/qnets-sso"></a>

### 许可证

[MIT](https://github.com/hzh11012/qnets-sso/blob/master/LICENSE)
