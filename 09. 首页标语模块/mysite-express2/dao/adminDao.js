// 这一层负责和数据库打交道
const adminModel = require("./model/adminModel");

// 登录
module.exports.loginDao = async function(loginInfo){
    // 接下来就需要连接数据库进行一个查询
    return await adminModel.findOne({
        where : {
            loginId : loginInfo.loginId,
            loginPwd : loginInfo.loginPwd
        }
    })   
}

// 更新管理员
module.exports.updateAdminDao = async function(newAccountInfo){
    return await adminModel.update(newAccountInfo, {
        where : {
            loginId : newAccountInfo.loginId
        }
    })
}