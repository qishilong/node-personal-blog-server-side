// 该文件负责对数据库进行一个初始化操作
const sequelize = require("./dbConnect"); // 数据库连接实例

const adminModel = require("./model/adminModel"); // 数据模型
const bannerModel = require("./model/bannerModel");


const md5 = require("md5");

(async function () {
    // 将数据模型和表进行同步
    await sequelize.sync({
        alter: true,
    })

    // 同步完成之后，有一些表是需要一些初始化数据
    // 我们需要先查询这张表有没有内容，没有内容我们才初始化数据
    const adminCount = await adminModel.count();
    if (!adminCount) {
        // 进入此 if，说明该表没有数据，我们进行一个初始化
        await adminModel.create({
            loginId: "admin",
            name: "超级管理员",
            loginPwd: md5("123456")
        })
        console.log("初始化管理员数据完毕...");
    }


    // banner 进行初始化操作
    const bannerCount = await bannerModel.count();
    if (!bannerCount) {
        await bannerModel.bulkCreate([{
            "midImg": "/static/images/bg1_mid.jpg",
            "bigImg": "/static/images/bg1_big.jpg",
            "title": "塞尔达旷野之息",
            "description": "2017年年度游戏，期待续作"
        }, {
            "midImg": "/static/images/bg2_mid.jpg",
            "bigImg": "/static/images/bg2_big.jpg",
            "title": "塞尔达四英杰",
            "description": "四英杰里面你最喜欢的又是谁呢"
        }, {
            "midImg": "/static/images/bg3_mid.jpg",
            "bigImg": "/static/images/bg3_big.jpeg",
            "title": "日本街道",
            "description": "动漫中经常出现的日本农村街道，一份独特的恬静"
        }]);
        console.log("初始化首页标语数据...");
    }

    console.log("数据库数据已经准备完毕....");
})();