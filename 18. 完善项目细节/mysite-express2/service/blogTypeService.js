const { validate } = require("validate.js");
const { blogCountByBlogType } = require("../dao/blogDao");
const { addBlogTypeDao, findAllBlogTypeDao, findOneBlogTypeDao, deleteBlogTypeDao, updateBlogTypeDao } = require("../dao/blogTypeDao");
const { ValidationError } = require("../utils/errors");
const { formatResponse, handleDataPattern } = require("../utils/tool");

// 新增博客分类
module.exports.addBlogTypeService = async function (newBlogTypeInfo) {
    // 数据验证规则
    const blogTypeRule = {
        name: {
            presence: {
                allowEmpty: false
            },
            type: "string"
        },
        order: {
            presence: {
                allowEmpty: false
            },
            type: "string"
        }
    }
    // 进行数据验证
    const validateResult = validate.validate(newBlogTypeInfo, blogTypeRule);
    if (!validateResult) {
        // 验证通过
        newBlogTypeInfo.articleCount = 0; // 因为是新增的文章分类，所以一开始文章数量为 0
        const data = await addBlogTypeDao(newBlogTypeInfo);
        return formatResponse(0, "", data);
    } else {
        // 数据验证失败
        throw new ValidationError("数据验证失败");
    }
}

// 查询所有博客分类
module.exports.findAllBlogTypeService = async function () {
    const data = await findAllBlogTypeDao();
    const obj = formatResponse(0, "", handleDataPattern(data));
    obj.data.sort((a,b)=>a.order - b.order);
    return obj;
}

// 获取其中一个博客分类
module.exports.findOneBlogTypeService = async function (id) {
    const {dataValues} = await findOneBlogTypeDao(id)
    return formatResponse(0, "", dataValues);
}


// 修改其中一个博客分类
module.exports.updateBlogTypeService = async function (id, blogInfo) {
    const data = await updateBlogTypeDao(id, blogInfo);
    return formatResponse(0, "", data);
}


// 删除其中一个博客分类
module.exports.deleteBlogTypeService = async function (id) {
    const count = await blogCountByBlogType(id);
    await deleteBlogTypeDao(id);
    // 这里需要返回受影响的文章的数量，写了文章模块后再回来修改
    return formatResponse(0, "", count);
}