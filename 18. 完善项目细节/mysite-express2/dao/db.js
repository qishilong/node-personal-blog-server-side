// 该文件负责对数据库进行一个初始化操作
const sequelize = require("./dbConnect"); // 数据库连接实例

const adminModel = require("./model/adminModel"); // 数据模型
const bannerModel = require("./model/bannerModel");
const blogTypeModel = require("./model/blogTypeModel");
const blogModel = require("./model/blogModel");
const demoModel = require("./model/demoModel");
const messageModel = require("./model/messageModel");
const aboutModel = require('./model/aboutModel');
const settingModel = require("./model/settingModel");


const md5 = require("md5");

(async function () {

    // 定义模型之间的关联关系

    // 博客和博客分类之间的关联
    blogTypeModel.hasMany(blogModel, { foreignKey: 'categoryId', targetKey: "id" });
    blogModel.belongsTo(blogTypeModel, { foreignKey: 'categoryId', targetKey: "id", as: "category" });

    // 博客和博客评论之间存在关联关系
    blogModel.hasMany(messageModel, { foreignKey: 'blogId', target: 'id' });
    messageModel.belongsTo(blogModel, { foreignKey: 'blogId', target: 'id', as: "blog" });

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

    // 进行一些数据初始化
    const aboutCount = await aboutModel.count(); // 首先进行查询看有没有数据
    if (!aboutCount) {
        // 如果没有数据就进行初始化
        await aboutModel.create({
            url: "https://oss.duyiedu.com/demo-summary/网页简历/index.html"
        });
        console.log("初始化关于我数据...");
    }

    // 全局设置数据初始化
    const settingCount = await settingModel.count(); // 首先进行查询看有没有数据
    if (!settingCount) {
        // 如果没有数据就进行初始化
        await settingModel.create({
            avatar: '/static/images/avatar.jpeg',
            siteTitle: '我的个人空间',
            github: '',
            qq: '3263023350',
            qqQrCode:
                '/static/images/zuotian9652.jpg',
            weixin: 'yh777bao',
            weixinQrCode:
                '/static/images/zuotian9652.jpg',
            mail: 'duyi@gmail.com',
            icp: '黑ICP备17001719号',
            githubName: 'DuYi-Edu',
            favicon: 'http://mdrs.yuanjin.tech/Fs4CDlC6mwe_WXLMIiXcmSJLHO4f',
        });
        console.log("初始化全局设置数据...");
    }

    console.log("数据库数据已经准备完毕....");
})();