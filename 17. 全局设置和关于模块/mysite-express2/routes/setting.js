var express = require("express");
const { findSettingService, updateSettingService } = require("../service/settingService");
var router = express.Router();

// 获取全局设置
router.get("/", async function(req, res, next){
    res.send(await findSettingService());
})

// 更新全局设置
router.put("/", async function(req, res, next){
    res.send(await updateSettingService(req.body));
})

module.exports = router;