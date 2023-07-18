// admin 模块的业务逻辑层
const md5 = require("md5");
const { loginDao } = require("../dao/adminDao");
const jwt = require("jsonwebtoken");

module.exports.loginService = async function (loginInfo) {
    loginInfo.loginPwd = md5(loginInfo.loginPwd); // 进行加密
    // 接下来进行数据的验证，也就是查询该条数据在数据库里面有没有
    let data = await loginDao(loginInfo);
    if (data && data.dataValues) {
        // 添加 token
        data = {
            id: data.dataValues.id,
            loginId: data.dataValues.loginId,
            name: data.dataValues.name,
        };
        var loginPeriod = null;
        if (loginInfo.remember) {
            // 如果用户勾选了登录 7 天，那么 remember 里面是有值的，将这个值赋值给 period
            loginPeriod = parseInt(loginInfo.remember);
        } else {
            // 否则的话，默认时常为 1 天
            loginPeriod = 1;
        }
        // 生成 token
        const token = jwt.sign(data, md5(process.env.JWT_SECRET), { expiresIn: 60 * 60 * 24 * loginPeriod });
        return {
            token,
            data
        }
    }
    return { data };
}