const { validate } = require("validate.js");
const { addBlogDao, findBlogByPageDao } = require("../dao/blogDao");
const { addBlogToType } = require("../dao/blogTypeDao");
const blogTypeModel = require("../dao/model/blogTypeModel");
const { ValidationError } = require("../utils/errors");
const { formatResponse, handleDataPattern } = require("../utils/tool");

// 扩展验证规则
validate.validators.categoryIdIsExist = async function(value){
    const blogTypeInfo = blogTypeModel.findByPk(value);
    if(blogTypeInfo){
        return;
    }
    return "CategoryId Is Not Exist";
}

// 添加博客
module.exports.addBlogService = async function(newBlogInfo){

    // 首先第一个要处理的就是 TOC
    // 这个我们放在下一节课

    // 接下来，我们将处理好的TOC格式转为字符串
    newBlogInfo.toc = JSON.stringify('["a":"b"]');

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
    try{
        // 因为扩展的验证规则里面涉及到异步的操作，所以这里要采用异步的验证方式
        await validate.async(newBlogInfo, blogRule);
        const data = await addBlogDao(newBlogInfo); // 进行一个新增
        // 接下来还有一个工作，文章新增了，对应的文章分类也应该新增
        await addBlogToType(newBlogInfo.categoryId);
        return formatResponse(0, "", data);
    } catch(e){
        // 验证未通过
        throw new ValidationError("数据验证失败");
    }
}

// 根据分页来查询博客
module.exports.findBlogByPageService = async function(pageInfo){
    const data = await findBlogByPageDao(pageInfo);
    const rows = handleDataPattern(data.rows);
    // 针对 TOC 要做一个还原的操作
    rows.forEach(it=>{
        it.toc = JSON.parse(it.toc);
    });
    return formatResponse(0, "", {
        "total" : data.count,
        "rows" : rows
    })
}