const { validate } = require("validate.js");
const { findAllDemoDao, addDemoDao, updateDemoDao, deleteDemoDao } = require("../dao/demoDao");
const { ValidationError } = require("../utils/errors");
const { formatResponse, handleDataPattern } = require("../utils/tool");

// 新增项目
module.exports.addDemoService = async function (newDemoInfo) {
    // 首先需要将 description 项目描述转换为字符串
    newDemoInfo.description = JSON.stringify(newDemoInfo.description);

    // 定义验证规则
    const demoRule = {
        name: {
            presence: {
                allowEmpty: false
            },
            type: "string"
        },
        url: {
            presence: {
                allowEmpty: false
            },
            type: "string"
        },
        github: {
            presence: {
                allowEmpty: false
            },
            type: "string"
        },
        description: {
            presence: {
                allowEmpty: false
            },
            type: "string"
        },
        order: {
            presence: {
                allowEmpty: false
            },
            type: "integer"
        },
        thumb: {
            type: "string"
        }
    }

    // 进行数据验证
    const validateResult = validate.validate(newDemoInfo, demoRule);
    if (!validateResult) {
        const data = await addDemoDao(newDemoInfo);
        return formatResponse(0, "", [data]);
    } else {
        throw new ValidationError("数据验证失败");
    }
}


// 查询所有项目
module.exports.findAllDemoService = async function () {
    const data = await findAllDemoDao();
    const obj = handleDataPattern(data);
    // 接下来需要将项目描述还原成数组
    obj.forEach(item => {
        item.description = JSON.parse(item.description);
    });
    return formatResponse(0, "", obj);
}

// 修改项目
module.exports.updateDemoService = async function (id, newDemoInfo) {
    if(newDemoInfo.description){
        newDemoInfo.description = JSON.stringify(newDemoInfo.description);
    }
    const { dataValues } = await updateDemoDao(id, newDemoInfo);
    // 还原项目描述
    dataValues.description = JSON.parse(dataValues.description);
    return formatResponse(0, "", [dataValues]);
}

// 删除项目
module.exports.deleteDemoService = async function(id){
    await deleteDemoDao(id);
    return formatResponse(0, "", true);
}