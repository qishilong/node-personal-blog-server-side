// 引包
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressJWT = require("express-jwt");
const md5 = require('md5');
const session = require("express-session");
const { ForbiddenError, ServiceError } = require("./utils/errors")


// 默认读取项目根目录下的 .env 环境变量文件
require("dotenv").config(); 
require("express-async-errors");
// 引入数据库连接
require("./dao/db");

// 引入路由
var adminRouter = require('./routes/admin');
var bannerRouter = require('./routes/banner');
var uploadRouter = require('./routes/upload');
var blogTypeRouter = require('./routes/blogType');
var blogRouter = require('./routes/blog');
var demoRouter = require('./routes/demo');
var messageRouter = require('./routes/message');
var aboutRouter = require('./routes/about');
var settingRouter = require('./routes/setting');
var captchaRouter = require("./routes/captcha");

// 创建服务器实例
var app = express();

app.use(session({
  secret : process.env.SESSION_SECRET,
  resave : true,
  saveUninitialized : true
}))

// 使用各种各样的中间件
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// 配置验证 token 接口
app.use(expressJWT({
  secret : md5(process.env.JWT_SECRET), // 我们所设置的秘钥
  algorithms : ['HS256'], // 新版本的 expressJWT 必须要求指定算法
}).unless({
  // 需要排除的 token 验证的路由
  path : [
    {"url" : "/api/admin/login", methods : ["POST"]},
    {"url" : "/res/captcha", methods : ["GET"]},
    {"url" : "/api/banner", methods : ["GET"]},
    {"url" : "/api/blogtype", methods : ["GET"]},
    {"url" : "/api/blog", methods : ["GET"]},
    {"url" : /\/api\/blog\/\d/, methods : ["GET"]},
    {"url" : "/api/project", methods : ["GET"]},
    {"url" : "/api/message", methods : ["GET","POST"]},
    {"url" : "/api/comment", methods : ["GET","POST"]},
    {"url" : "/api/about", methods: ['GET'] },
    {"url" : "/api/setting", methods: ['GET'] },
  ]
}))


// 使用路由中间件
app.use('/api/admin', adminRouter);
app.use('/api/banner', bannerRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/blogtype', blogTypeRouter);
app.use('/api/blog', blogRouter);
app.use('/api/project', demoRouter);
app.use('/api/message', messageRouter);
app.use('/api/comment', messageRouter);
app.use('/api/about', aboutRouter);
app.use('/api/setting', settingRouter);
app.use('/res/captcha', captchaRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// 错误处理，一旦发生了错误，就会到这里来
app.use(function(err, req, res, next) {
  console.log("err.name>>>",err.name);
  console.log("err.message>>>",err.message);
  if (err.name === 'UnauthorizedError') {
    // 说明是 token 验证错误，接下来我们来抛出我们自定义的错误
    res.send(new ForbiddenError("未登录，或者登录已经过期").toResponseJSON());
  } else if(err instanceof ServiceError){
    res.send(err.toResponseJSON());
  } else {
    res.send(new UnknownError().toResponseJSON());
  }
});

module.exports = app;
