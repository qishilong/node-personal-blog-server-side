const { validate } = require("validate.js");
const { addBlogDao, findBlogByPageDao, findBlogByIdDao, updateBlogDao, deleteBlogDao } = require("../dao/blogDao");
const { addBlogToType, findOneBlogTypeDao } = require("../dao/blogTypeDao");
const { deleteMessageByBlogIdDao } = require("../dao/messageDao");
const blogTypeModel = require("../dao/model/blogTypeModel");
const { ValidationError } = require("../utils/errors");
const { formatResponse, handleDataPattern, handleTOC } = require("../utils/tool");

// 扩展验证规则
validate.validators.categoryIdIsExist = async function (value) {
    const blogTypeInfo = blogTypeModel.findByPk(value);
    if (blogTypeInfo) {
        return;
    }
    return "CategoryId Is Not Exist";
}

// 添加博客
module.exports.addBlogService = async function (newBlogInfo) {
    // 首先第一个要处理的就是 TOC
    // 经过 handleTOC 函数进行处理之后，现在 newBlogInfo 里面的 TOC 目录就是我们想要的格式
    newBlogInfo = handleTOC(newBlogInfo);

    // 接下来，我们将处理好的TOC格式转为字符串
    newBlogInfo.toc = JSON.stringify(newBlogInfo.toc);

    // 初始化新文章的其他信息
    newBlogInfo.scanNumber = 0; // 阅读量初始化为 0
    newBlogInfo.commentNumber = 0; // 评论数初始化为 0 

    // 定义验证规则
    const blogRule = {
        title: {
            presence: {
                allowEmpty: false
            },
            type: "string"
        },
        description: {
            presence: {
                allowEmpty: true
            },
            type: "string"
        },
        toc: {
            presence: {
                allowEmpty: true
            },
            type: "string"
        },
        htmlContent: {
            presence: {
                allowEmpty: false
            },
            type: "string"
        },
        thumb: {
            presence: {
                allowEmpty: true
            },
            type: "string"
        },
        scanNumber: {
            presence: {
                allowEmpty: false
            },
            type: "integer"
        },
        commentNumber: {
            presence: {
                allowEmpty: false
            },
            type: "integer"
        },
        createDate: {
            presence: {
                allowEmpty: false
            },
            type: "integer"
        },
        categoryId: {
            presence: true,
            type: "integer",
            categoryIdIsExist: true
        }
    }

    // 接下来对传递过来的数据进行一个验证
    try {
        // 因为扩展的验证规则里面涉及到异步的操作，所以这里要采用异步的验证方式
        await validate.async(newBlogInfo, blogRule);
        const data = await addBlogDao(newBlogInfo); // 进行一个新增
        // 接下来还有一个工作，文章新增了，对应的文章分类也应该新增
        await addBlogToType(newBlogInfo.categoryId);
        return formatResponse(0, "", data);
    } catch (e) {
        // 验证未通过
        throw new ValidationError("数据验证失败");
    }
}

// 根据分页来查询博客
module.exports.findBlogByPageService = async function (pageInfo) {
    const data = await findBlogByPageDao(pageInfo);
    const rows = handleDataPattern(data.rows);
    // 针对 TOC 要做一个还原的操作
    rows.forEach(it => {
        it.toc = JSON.parse(it.toc);
    });
    return formatResponse(0, "", {
        "total": data.count,
        "rows": rows
    })
}

// 根据 id 获取某一篇博文
module.exports.findBlogByIdService = async function (id, auth) {
    const data = await findBlogByIdDao(id);
    // 首先需要重新处理 TOC，还原成一个数组
    data.dataValues.toc = JSON.parse(data.dataValues.toc);
    // 根据 auth 是否有值来决定浏览数是否要自增
    if (!auth) {
        data.scanNumber++;
        await data.save();
    }
    return formatResponse(0, "", data.dataValues);
}

// 修改一篇博文
module.exports.updateBlogService = async function (id, newBlogInfo) {
    // console.log("newBlogInfo>>", newBlogInfo);
    // 首先判断正文内容有没有改变，因为正文内容的改变会影响 TOC
    if (newBlogInfo.htmlContent) {
        // 进入此 if，说明文章的正文内容有所改变，需要重新处理 TOC 目录
        newBlogInfo = handleTOC(newBlogInfo);

        // 接下来，我们将处理好的TOC格式转为字符串
        newBlogInfo.toc = JSON.stringify(newBlogInfo.toc);
    }

    // 这里涉及到一个问题，就是文章分类有没有修改，如果有修改，之前的文章分类对应的文章数量要自减
    // 新的文章分类对应的文章数量要自增
    const { dataValues: oldBlogInfo } = await findBlogByIdDao(id);

    if(newBlogInfo.categoryId !== oldBlogInfo.categoryId){
        // 如果进入此 if，说明修改了此文章的分类信息，那么修改前后的文章分类对应的文章数量都需要做出修改

        // 旧的自减
        const oldBlogType = await findOneBlogTypeDao(oldBlogInfo.categoryId);
        oldBlogType.articleCount--;
        await oldBlogType.save();

        // 新的自增
        const newBlogType = await findOneBlogTypeDao(newBlogInfo.categoryId);
        newBlogType.articleCount++;
        await newBlogType.save();
    }


    const { dataValues } = await updateBlogDao(id, newBlogInfo);
    return formatResponse(0, "", dataValues);
}

// 删除一篇博文
module.exports.deleteBlogService = async function (id) {
    // 根据 id 查询到该篇文章的信息
    const data = await findBlogByIdDao(id);
    // 接下来需要根据该文章对应的分类，该分类下的文章数量自减
    const categoryInfo = await findOneBlogTypeDao(data.dataValues.categoryId);
    categoryInfo.articleCount--;
    await categoryInfo.save();
    // 之后还有一个操作，就是该文章下所对应的评论也要一并删除
    await deleteMessageByBlogIdDao(id);
    // 之后就可以删除这篇文章了
    await deleteBlogDao(id);
    return formatResponse(0, "", true);
}

