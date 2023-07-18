const { findAboutDao, updateAboutDao } = require('../dao/aboutDao');
const { formatResponse } = require("../utils/tool");

// 查询关于我
module.exports.findAboutService = async function () {
    const { url } = await findAboutDao();
    return formatResponse(0, "", url);
}


// 修改关于我
module.exports.updateAboutService = async function (newUrl) {
    const { url } = await updateAboutDao(newUrl);
    return formatResponse(0, "", url);
}