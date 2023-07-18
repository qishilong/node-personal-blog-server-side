const { findBannerDao, updateBannerDao } = require("../dao/bannerDao");
const { handleDataPattern, formatResponse } = require("../utils/tool");

module.exports.findBannerService = async function () {
    return formatResponse(0, "", handleDataPattern(await findBannerDao()));
}

module.exports.updateBannerService = async function (bannerArr) {
    const data = await updateBannerDao(bannerArr);
    return formatResponse(0, "", handleDataPattern(data));
}