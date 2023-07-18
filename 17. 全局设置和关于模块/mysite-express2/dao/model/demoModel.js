const { DataTypes } = require("sequelize");
const sequelize = require("../dbConnect");

// 定义数据模型
module.exports = sequelize.define("demo", {
    // 这张表拥有哪些字段
    name : {
        type : DataTypes.STRING,
        allowNull : false
    },
    url : {
        type : DataTypes.STRING,
        allowNull : false
    },
    github : {
        type : DataTypes.STRING,
        allowNull : false
    },
    description : {
        type : DataTypes.STRING,
        allowNull : false
    },
    thumb : {
        type : DataTypes.STRING,
        allowNull : false
    },
    order : {
        type : DataTypes.INTEGER,
        allowNull : false
    }
},{
    freezeTableName : true,
    createdAt : false,
    updatedAt : false
});