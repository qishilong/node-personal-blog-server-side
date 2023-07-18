const { DataTypes } = require('sequelize');
const sequelize = require('../dbConnect');

// 定义数据模型
module.exports = sequelize.define('about', {
    // 在这里定义模型属性
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    // 这是其他模型参数
    freezeTableName: true,
    createdAt: false, // 如果不填 false，可以使用字符值重新命名
    updatedAt: false,
});