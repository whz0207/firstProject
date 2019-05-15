//引入express开启服务器
const express = require('express');
const expressTmp = require('express-art-template');
const cookieSession = require('cookie-session')

const router = require('./router');

//创建应用程序(服务器)
const app = express();

//配置art-template,渲染静态页面资源
app.set('view engine', 'html');
app.engine('html', expressTmp);

//配置静态资源
app.use('/node_modules',express.static('node_modules'));
app.use('/views', express.static('views'));

// 配置 cookie-session'
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}))

//添加路由
app.use(router);

//开启服务器
app.listen('3000', () => {
    console.log('running...');
})