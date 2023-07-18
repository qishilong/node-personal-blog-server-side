const blogModel = require("./model/blogModel");
const messageModel = require("./model/messageModel");
const { Op } = require("sequelize");

// 添加留言或者评论
module.exports.addMessageDao = async function(newMessage){
    const { dataValues } = await messageModel.create(newMessage);
    return dataValues;
}

// 分页获取留言或者评论
module.exports.findMessageByPageDao = async function(pageInfo){
    // 这里需要根据 blogId 来区分情况
    // 如果有 blogId，说明是获取对应 blogId 的文章评论，如果没有，说明是获取留言
    if(pageInfo.blogid){
        // 这边又分为两种情况，获取所有的文章评论，还有一种就是获取对应文章的评论
        if(pageInfo.blogid === "all"){
            // 返回所有评论
            return await messageModel.findAndCountAll({
                offset : (pageInfo.page * 1 - 1) * pageInfo.limit,
                limit : pageInfo.limit * 1,
                where : {
                    blogId : {
                        [Op.ne] : null
                    }
                },
                include : [
                    {
                        model : blogModel,
                        as : 'blog'
                    }
                ]
            })
        } else {
            // 返回对应文章的评论
            return await messageModel.findAndCountAll({
                offset : (pageInfo.page * 1 - 1) * pageInfo.limit,
                limit : pageInfo.limit * 1,
                where : {
                    blogId : pageInfo.blogid * 1
                },
                order : [
                    ["createDate", "DESC"]
                ]
            })
        }
    } else {
        // 获取留言
        return await messageModel.findAndCountAll({
            offset : (pageInfo.page * 1 - 1) * pageInfo.limit,
            limit : pageInfo.limit * 1,
            where : {
                blogId : null
            },
            order : [
                ["createDate", "DESC"]
            ]
        })
    }
}

// 删除留言或者评论（传入的 id 是 message 表的 id）（主键）
module.exports.deleteMessageDao = async function(id){
    return await messageModel.destroy({
        where : {
            id
        }
    })
}

// 删除评论（传入的 id 是 message 表中的 blogId）
module.exports.deleteMessageByBlogIdDao = async function(blogId){
    return await messageModel.destroy({
        where : {
            blogId
        }
    })
}