// admin 模块的业务逻辑层
const md5 = require("md5");
const { loginDao, updateAdminDao } = require("../dao/adminDao");
const jwt = require("jsonwebtoken");
const { ValidationError } = require("../utils/errors");
const { formatResponse } = require("../utils/tool");

// 登录
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

// 更新
module.exports.updateAdminService = async function (accountInfo) {
    // 1. 根据传入的账号信息查询对应的用户（注意使用旧密码）
    const adminInfo = await loginDao({
        loginId: accountInfo.loginId,
        loginPwd: md5(accountInfo.oldLoginPwd)
    })
    // 2. 分为两种情况，有用户信息和没有用户信息
    if (adminInfo && adminInfo.dataValues) {
        // 说明密码正确，开始修改
        // 其实就是组装新的对象，然后进行更新即可
        const newPassword = md5(accountInfo.loginPwd); // 密码加密
        await updateAdminDao({
            name: accountInfo.name,
            loginId: accountInfo.loginId,
            loginPwd: newPassword
        })
        return formatResponse(0, "", {
            "loginId": accountInfo.loginId,
            "name": accountInfo.name,
            "id": adminInfo.dataValues.id
        })
    } else {
        // 密码输入不正确
        // 抛出自定义错误
        throw new ValidationError("旧密码不正确");
    }
}