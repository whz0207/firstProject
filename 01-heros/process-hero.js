//引入formidable第三方包处理post请求
const formidable = require('formidable');

//引入db.js
const db = require('./db');


// 处理得到登录页面
exports.getLogin = (req, res) => {
    // 响应登录页面
    res.render('login', {})
}

// 处理 login 提交的参数
exports.postLogin = (req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields) => {
        if (fields.uname === 'admin' && fields.pwd === '8888') {
            //将用户信息用 session 存起来
            req.session.obj = {
                uname: fields.uname,
                pwd: fields.pwd
            }
            //跳转到首页
            res.send('<script>alert("用户信息保存成功!");window.location="/"</script>');
        } else {
            //返回登录页面
            res.send('<script>alert("用户信息保存失败!");window.location="/login"</script>');
        }
    })
}

//将数据转移到 mysql 后的逻辑处理
exports.getIndex = (req, res) => {
    //1.获取数据
    //创建 sql
    let sql = 'SELECT * FROM hero';
    db.query(sql, (result) => {
        //2.渲染页面
        res.render('index', {
            heros: result
        })
    })
}
//得到新增页面
//处理 get 请求的 add
exports.getAdd = (req, res) => {
    // 渲染add页面
    res.render('add', {});
}

//处理新增提交数据
exports.postAdd = (req, res) => {
    //1. 接收数据
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fileds) => {
        if (err) return;
        fileds.img = 'views/img/2.jpg';
        //2. 将数据保存到 mysql 中
        let sql = `INSERT INTO hero (name,gender,img) VALUES ('${fileds.name}','${fileds.gender}','${fileds.img}')`;
        db.query(sql, (result) => {
            if (result.affectedRows >= 1) {
                res.redirect('/');
            }
        })
    })
}

// 处理删除数据逻辑
exports.getDel = (req, res) => {
    //1. 接收 id
    let id = req.query.id;
    //2. 根据 id 去数据库中删除数据
    let sql = `DELETE FROM hero WHERE id = ${id}`;
    db.query(sql, result => {
        res.redirect('/');
    })
}

//得到修改页面
exports.getEdit = (req, res) => {
    //1.接收id参数
    let id = req.query.id;
    //2.根据id到mysql中获取数据
    let sql = `SELECT * FROM hero WHERE id = ${id}`;
    db.query(sql, result => {
        //3.响应渲染edit页面
        res.render('edit', result[0]); //拿到第一个数据
    })
}

//处理修改逻辑
exports.postEdit = (req, res) => {
    //1.接收post参数: id name gender
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fileds) => {
        if (err) return;
        //2. 根据数据进行修改
        let sql = `UPDATE hero SET name = '${fileds.name}',gender='${fileds.gender}' WHERE id = ${fileds.id}`
        db.query(sql, result => {
            if(result.affectedRows >= 1) {
                res.redirect('/');
            }
        })
    })
}

//处理错误页面的逻辑
module.exports.get404 = (err,req,res) => {
    //1. 将错误信息保存到 日志文件中
    //2. 响应一个 404页面回浏览器
    res.render('404', {});
}