//路由判断: 用来设置路由
const express = require('express');

const process = require('./process-hero');

const router = express.Router();

// 处理登录
router.get('/login', (req, res) => {
    process.getLogin(req, res)
})

router.post('/login', (req, res) => {
    process.postLogin(req, res)
})

// 使用中间件进行登录判断
router.use((req, res, next) => {
    // 当请求根目录时，判断是否存在 session
    if (req.session.obj && req.session.obj.uname) {
        next()
    } else {
        res.send(`<script>alert('您还没有登录');window.location='/login'</script>`)
    }
})

//设置路由
router.get('/', (req, res) => {
    // throw new Error() // 在程序中手动抛出一个错误
    process.getIndex(req, res);
})

//处理得到新页面
router.get('/add', (req, res) => {
    process.getAdd(req, res);
})

//处理提交数据的逻辑
router.post('/add', (req, res) => {
    process.postAdd(req, res);
})

//处理删除路由 del?id=1
router.get('/del', (req, res) => {
    process.getDel(req, res);
})

// 处理得到修改页面的路由
router.get('/edit', (req, res) => {
    process.getEdit(req, res)
})

//处理修改数据的逻辑
router.post('/edit', (req, res) => {
    process.postEdit(req, res);
});

// 处理错误的中间件
router.use((err, req, res, next) => {
    process.get404(err, req, res)
})

//暴露路由
module.exports = router;