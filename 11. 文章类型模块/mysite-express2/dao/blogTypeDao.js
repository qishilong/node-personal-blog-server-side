const blogTypeModel = require("./model/blogTypeModel")

// 添加博客分类
module.exports.addBlogTypeDao = async function(newBlogTypeInfo){
    const {dataValues} = await blogTypeModel.create(newBlogTypeInfo);
    return dataValues;
}

// 获取所有的博客分类
module.exports.findAllBlogTypeDao = async function(){
    return await blogTypeModel.findAll();
}

// 获取其中一个博客分类
module.exports.findOneBlogTypeDao = async function(id){
    const {dataValues} = await blogTypeModel.findByPk(id);
    return dataValues;
}

// 修改一个博客分类
module.exports.updateBlogTypeDao = async function(id, blogTypeInfo){
    await blogTypeModel.update(blogTypeInfo, {
        where : {
            id
        }
    })
    const { dataValues } = await blogTypeModel.findByPk(id);
    return dataValues;
}


// 删除一个博客分类
module.exports.deleteBlogTypeDao = async function(id){
    return await blogTypeModel.destroy({
        where : {
            id
        }
    });
}