var express = require('express');
var router = express.Router();
var { formatResponse, analysisToken } = require("../utils/tool")

const { loginService, updateAdminService } = require("../service/adminService");
const { ValidationError } = require('../utils/errors');

// 登录
router.post('/login', async function(req, res, next) {
    // 首先应该有一个验证码的验证
    if(req.body.captcha.toLowerCase() !== req.session.captcha.toLowerCase()){
        // 如果进入此 if，说明是有问题的，用户输入的验证码不正确
        throw new ValidationError("验证码错误");
    }

    // 假设上面的验证码已经通过了
    const result = await loginService(req.body);
    if(result.token){
        res.setHeader("authentication", result.token);
    }
    res.send(formatResponse(0, "", result.data));
});

// 恢复登录状态
router.get("/whoami", async function(req, res, next){
    // 1. 从客户端的请求拿到 token，然后解析 token，还原成有用的信息
    const token = analysisToken(req.get("Authorization"));
    // 2. 返回给客户端
    res.send(formatResponse(0, "", {
        "loginId": token.loginId,
        "name": token.name,
        "id": token.id
    }))

})

router.put("/", async function(req, res, next){
    res.send(await updateAdminService(req.body));
})

module.exports = router;