# 单点认证模块

## 接口前缀

```shell
http://localhost:4800/api/sso
```

## 登录

> 无需携带token

```
POST  /login
```

### 参数说明

| 参数  | 说明   | 是否必填 |
| ----- | ------ | :------: |
| email | 邮箱   |    是    |
| code  | 验证码 |    是    |

### 成功操作返回

```json
{
    "code": 200,
    "msg": "登录成功"
}
```

## 发送验证码

> 无需携带token

```
POST  /code
```

### 参数说明

| 参数  | 说明 | 是否必填 |
| ----- | ---- | :------: |
| email | 邮箱 |    是    |

### 成功操作返回

```json
{
    "code": 200,
    "msg": "验证码发送成功"
}
```

## 刷新token

```
POST  /refresh
```

### 参数说明

无

### 成功操作返回

```json
{
    "code": 200,
    "msg": "令牌更新成功"
}
```

## 验证token

```
POST  /verify
```

### 参数说明

无

### 成功操作返回

```json
{
    "code": 200,
    "msg": "令牌验证成功",
    "data": {
        "id": "01JR2NDC0AE47C5A1TWAKDF0C0",
        "email": "xxxxxx@qq.com",
        "iat": 1729363909,
        "exp": 1729367509
    }
}
```

## 退出登录

```
POST  /logout
```

### 参数说明

无

### 成功操作返回

```json
{
    "code": 200,
    "msg": "退出登录成功"
}
```
