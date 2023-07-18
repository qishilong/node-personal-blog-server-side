const { validate } = require("validate.js");
const { ValidationError, UnknownError } = require("../utils/errors");
const fs= require("fs");
const { addMessageDao, findMessageByPageDao, deleteMessageDao } = require("../dao/messageDao");
const { findBlogByIdDao } = require("../dao/blogDao");
const { formatResponse, handleDataPattern } = require("../utils/tool");
const dir = './public/static/avatar';

/**
 * 读取一个目录下有多少个文件
 * @param {*} dir 目录地址
 */
async function readDirLength(dir){
    return new Promise((resolve)=>{
        fs.readdir(dir, (err, files)=>{
            if(err) throw new UnknownError();
            resolve(files);
        });
    })
}


// 新增评论或者留言
module.exports.addMessageService = async function(newMessage){
    // 数据验证规则
    const messageRule = {
        nickname : {
            presence : {
                allowEmpty : false
            },
            type : "string"
        },
        content : {
            presence : {
                allowEmpty : false
            },
            type : "string"
        },
        blogId : {
            type : "string"
        }
    }

    // 进行数据验证
    const validateResult = validate.validate(newMessage, messageRule);
    console.log(validateResult);
    if(!validateResult){
        newMessage.blogId = newMessage.blogId ? newMessage.blogId : null;
        newMessage.createDate = Date.now();
        // 有一个头像的地址，该头像是随机生成的
        // 读取 static 下面的 avatar 目录
        const files = await readDirLength(dir);
        // 随机摇一个文件出来
        const randomIndex = Math.floor(Math.random() * files.length);
        newMessage.avatar = '/static/avatar/' + files[randomIndex];
        // 接下来开始新增
        const data = await addMessageDao(newMessage);
        // 如果是文章的评论，那么对应文章的评论数量也要自增
        if(newMessage.blogId){
            const blogData = await findBlogByIdDao(newMessage.blogId);
            blogData.commentNumber++;
            await blogData.save();
        }
        return formatResponse(0, "", data);

    } else {
        throw new ValidationError("数据验证失败");
    }
}

// 分页获取评论获取留言
module.exports.findMessageByPageService = async function(pageInfo){
    const data = await findMessageByPageDao(pageInfo);
    const rows = handleDataPattern(data.rows);
    return formatResponse(0, "", {
        "total" : data.count,
        "rows" : rows
    })
}

// 删除留言或者评论
module.exports.deleteMessageService = async function(id){
    await deleteMessageDao(id);
    return formatResponse(0, "", true);
}