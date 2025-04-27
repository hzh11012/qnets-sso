const generateEmailTemplate = (code, age) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        .container { 
            max-width: 600px; 
            margin: 20px auto; 
            padding: 30px; 
            border: 1px solid #eee;
        }
        .container p:last-child {
            margin-bottom: 0;
        }

        .container h3:first-child {
            margin-top: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h3>您好！欢迎使用Qnets</h3>
        <p>您的验证码为：<strong>${code}</strong></p>
        <p>该验证码${age}分钟内有效，请勿泄露给他人。</p>
        <p>如非本人操作，请忽略此邮件。</p>
    </div>
</body>
</html>
`;

module.exports = generateEmailTemplate;
