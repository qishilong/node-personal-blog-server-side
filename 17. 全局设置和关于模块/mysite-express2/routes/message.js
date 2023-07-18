var express = require("express");
const { addMessageService, findMessageByPageService, deleteMessageService } = require("../service/messageService");
var router = express.Router();

// 添加留言或者评论
router.post("/", async function(req, res, next){
    res.send(await addMessageService(req.body));
})

// 获取留言或者评论
router.get("/", async function(req, res, next){
    res.send(await findMessageByPageService(req.query));
})

// 删除留言或者评论
router.delete("/:id", async function(req, res, next){
    res.send(await deleteMessageService(req.params.id));
})

module.exports = router;