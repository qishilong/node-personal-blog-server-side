const bannerModel = require("./model/bannerModel")


module.exports.findBannerDao = async function(){
    return await bannerModel.findAll();
}

module.exports.updateBannerDao = async function(bannerArr){
    // 将表的记录全部删除掉
    await bannerModel.destroy({
        truncate : true
    });
    await bannerModel.bulkCreate(bannerArr); // 批量写入数据
    return await bannerModel.findAll();
}