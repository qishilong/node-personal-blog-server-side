const demoModel = require("./model/demoModel")

// 新增项目
module.exports.addDemoDao = async function (newDemoInfo) {
    const { dataValues } = await demoModel.create(newDemoInfo);
    return dataValues;
}


// 查询所有的项目
module.exports.findAllDemoDao = async function () {
    return await demoModel.findAll();
}

// 修改项目
module.exports.updateDemoDao = async function(id, newDemoInfo){
    await demoModel.update(newDemoInfo, {
        where : {
            id
        }
    });
    return await demoModel.findByPk(id);
}

// 删除项目
module.exports.deleteDemoDao = async function(id){
    return await demoModel.destroy({
        where : {
            id
        }
    })
}