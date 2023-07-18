const { findSettingDao, updateSettingDao } = require("../dao/settingDao");
const { formatResponse } = require("../utils/tool");


// 查询全局设置
module.exports.findSettingService = async function () {
    const { dataValues } = await findSettingDao();
    return formatResponse(0, "", dataValues);
}

// 修改全局设置
module.exports.updateSettingService = async function (newSettingInfo) {
    const { dataValues } = await updateSettingDao(newSettingInfo);
    return dataValues;
}