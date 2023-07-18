// admin 模块的业务逻辑层
const md5 = require("md5");
const { loginDao } = require("../dao/adminDao");

module.exports.loginService = async function (loginInfo) {
    loginInfo.loginPwd = md5(loginInfo.loginPwd); // 进行加密
    // 接下来进行数据的验证，也就是查询该条数据在数据库里面有没有
    let data = await loginDao(loginInfo);
    if (data && data.dataValues) {
        // 添加 token
    }
    return { data };
    // {
    //     data : null
    // }
}