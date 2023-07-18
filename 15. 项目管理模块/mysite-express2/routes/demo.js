var express = require("express");
const { addDemoService, findAllDemoService, updateDemoService, deleteDemoService } = require("../service/demoService");
var router = express.Router();

// 获取项目
router.get("/", async function(req, res, next){
    res.send(await findAllDemoService())
})

// 新增项目
router.post("/", async function(req, res, next){
    res.send(await addDemoService(req.body));
})

// 修改项目
router.put("/:id", async function(req, res, next){
    res.send(await updateDemoService(req.params.id, req.body));
})

// 删除项目
router.delete("/:id", async function(req, res, next){
    res.send(await deleteDemoService(req.params.id));
})

module.exports = router;