const Zod = require('zod');
const {ParameterException} = require('@core/http-exception');

const CODE_REG = /^[0-9]{6}$/;

const LoginValidator = parameter => {
    const schema = Zod.object({
        email: Zod.string({
            required_error: '邮箱不能为空',
            invalid_type_error: '邮箱类型错误'
        })
            .min(1, {
                message: '邮箱不能为空'
            })
            .max(255, {
                message: '邮箱长度超出限制'
            })
            .email('邮箱格式错误'),
        code: Zod.string({
            required_error: '验证码不能为空',
            invalid_type_error: '验证码类型错误'
        })
            .min(1, {
                message: '验证码不能为空'
            })
            .regex(CODE_REG, {
                message: '验证码格式错误'
            })
    });
    const result = schema.safeParse(parameter);

    if (!result.success) {
        throw new ParameterException(result.error.issues[0].message);
    }
    return result.data;
};

const EmailValidator = parameter => {
    const schema = Zod.object({
        email: Zod.string({
            required_error: '邮箱不能为空',
            invalid_type_error: '邮箱类型错误'
        })
            .min(1, {
                message: '邮箱不能为空'
            })
            .max(255, {
                message: '邮箱长度超出限制'
            })
            .email('邮箱格式错误')
    });

    const result = schema.safeParse(parameter);

    if (!result.success) {
        throw new ParameterException(result.error.issues[0].message);
    }
    return result.data;
};

module.exports = {
    LoginValidator,
    EmailValidator
};
