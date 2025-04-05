<div align="center"><a name="readme-top"></a>
<img height="180" src="https://camo.githubusercontent.com/be50e2d0b613d863b0e3336e74453ca8845797a9f29c3fcee5cbd401807c6009/68747470733a2f2f63646e2e716e6574732e636e2f6c6f676f2e737667" />
<h1 style="margin-top: 1.5rem">Qnets SSO Serve</h1>

Qnets SSO Server, Based on Koa + Prisma + JWT

English · [中文](./README-zh_CN.md)

</div>

## Introduction

- This project is only a single sign on server, and users only need to log in once to access all Qnets projects, and support login free for 7 days.

### Completed API

> The interface has no special instructions and must carry a token for authentication.

Select Authorization and Bearer Token for Type in Postman software, and fill in the token value.

Token needs to be carried on the header in the code

```js
// Transcoding token
function _encode() {
    const token = localStorage.getItem('token');
    return 'Bearer ' + token;
}

// Code example: Focus on header carrying Authorization Bearer+token
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

// Carrying tokens on Axios
config.headers['Authorization'] = _encode();
```

Please refer to the specific interfaces of each module for details [API Document](https://github.com/hzh11012/qnets-sso/tree/master/doc)

### Technology Stack

- koa2
- prisma
- zod
- eslint + prettier
- module-alias
- mysql

## Project Structure

### Directory Structure

```js
│
├─app
   ├─api
   ├─dao
   ├─service
   └─validators
├─core
├─doc
├─middlewares
├─prisma
├─app.js
└─...
```

## Configuration

### Environment Variables

> Incomplete environment variables will result in service unavailability. Please go to supplement.

[Env](https://github.com/hzh11012/qnets-sso/tree/master/.env)

- <code>NODE_PORT</code>：Service port, default <code>4800</code>
- <code>DATABASE_URL</code>：Prisma MySQL connection URL, format mysql://USER:PASSWORD @HOST: PORT/DATABASE
- <code>ACCESS_TOKEN_SECRET_KEY</code>：Access token secret key
- <code>REFRESH_TOKEN_SECRET_KEY</code>：Refresh token secret key
- <code>ACCESS_TOKEN_EXPIRES_IN</code>：Access token expiration time, default <code>1 hour</code>
- <code>REFRESH_TOKEN_EXPIRES_IN</code>：Refresh token expiration time, default <code>7 day</code>
- <code>SMS_APP_ID</code>：Tencent Cloud SMS Application ID
- <code>SMS_SIGN_NAME</code>：Tencent Cloud SMS Signature Content
- <code>SMS_TEMPLATE_ID</code>：Tencent Cloud SMS Template ID
- <code>SMS_SECRET_ID</code>：Tencent Cloud SMS SecretId
- <code>SMS_SECRET_KEY</code>：Tencent Cloud SMS SecretKey
- <code>SMS_REGION</code>：Tencent Cloud SMS Region
- <code>COOKIES_DOMAIN</code>：The effective domain of cookies

## Quick Start

```bash
$ git clone https://github.com/hzh11012/qnets-sso.git

## Install dependencies
$ yarn

## Run
$ yarn dev
```

### Star History

[![Star History Chart](https://api.star-history.com/svg?repos=hzh11012/qnets-sso&type=Date)](https://star-history.com/#hzh11012/qnets-sso)

### Contributors

<a href="https://github.com/hzh11012/qnets-sso/graphs/contributors"><img src="https://contrib.rocks/image?repo=hzh11012/qnets-sso"></a>

### License

[MIT](https://github.com/hzh11012/qnets-sso/blob/master/LICENSE)
