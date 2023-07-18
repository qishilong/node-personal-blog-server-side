// 关于我

const aboutModel = require('./model/aboutModel'); // 引入模型

// 查询
module.exports.findAboutDao = async function(){
    return await aboutModel.findOne();
}

// 修改
module.exports.updateAboutDao = async function(newUrl){
    const data = await aboutModel.findOne();
    data.url = newUrl;
    await data.save();
    return data.dataValues;
}