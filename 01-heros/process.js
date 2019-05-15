//引入核心模块
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');

const formidable = require('formidable');

//处理逻辑
//处理 get 请求 根目录
module.exports.getIndex = (req, res) => {
    //读取 db.json 中的数据,并且渲染到\静态页面上
    //1. 读取
    fs.readFile(path.join(__dirname, './db.json'), (err, data) => {
        if (err) return;
        let jsonData = JSON.parse(data.toString());
        //2. 将数据进行渲染
        res.render('index', jsonData);
    })
}

//处理 get 请求的 add
module.exports.getAdd = (req, res) => {
    // 渲染add页面
    res.render('add', {});
}

//处理 post 请求的 add
//--------------------------------使用第三方包 formidabel 来接收参数(推荐使用)--------------------------
module.exports.postAdd = (req, res) => {
    //1. 接收参数
    //创建对象
    let form = new formidable.IncomingForm();
    // 调用方法
    form.parse(req, (err, fileds, files) => {
        if (err) return;
        //2. 根据参数生成对象
        fileds.img = 'views/img/1.jpg';
        //3. 得到 db.json 中的数据
        fs.readFile(path.join(__dirname, './db.json'), (err1, data) => {
            let jsonData = JSON.parse(data.toString());
            // console.log(fileds); //{ name: '呜呜呜', gender: '男', img: 'views/img/1.jpg' }
            fileds.id = jsonData.heros[jsonData.heros.length - 1].id + 1;
            //4. 将新增对象添加到 db.json 的数据对象中
            jsonData.heros.push(fileds);
            //5. 重新写入
            // 转换为字符串
            let herosStr = JSON.stringify(jsonData, null, '  ');
            fs.writeFile(path.join(__dirname, './db.json'), herosStr, err2 => {
                if (err2) return;
                console.log('写入成功');
                //6. 响应结果
                res.redirect('/');
            })
        })
    })
}

//--------------------------------使用req 的 data 和end 事件接收参数 (淘汰掉)------------------------------
//处理 post 请求的 add
// module.exports.postAdd = (req, res) => {
//     //1. 接收参数
//     let parmas = '';
//     req.on('data', chunk => {
//         parmas += chunk;
//     });
//     req.on('end', () => {
//         let parmasObj = querystring.parse(decodeURI(parmas));
//         // console.log(parmasObj); //{ name: '达摩', gender: '男' }
//         //2. 根据参数生成一个对象
//         parmasObj.img = 'views/img/1.jpg';
//         //3. 得到 db.json 中的数据
//         fs.readFile(path.join(__dirname, './db.json'), (err, data) => {
//             if (err) return;
//             let jsonData = JSON.parse(data.toString());
//             // 获得 db.json 中的最后一条数据的 id
//             parmasObj.id = jsonData.heros[jsonData.heros.length - 1].id + 1;
//             //4. 将新的对象添加到db.json 对应的数据中
//             jsonData.heros.push(parmasObj);
//             // 转换为字符串
//             let herosStr = JSON.stringify(jsonData, null, '  ');
//             //5. 重新写入 db.json
//             fs.writeFile(path.join(__dirname, './db.json'), herosStr, err1 => {
//                 if (err1) return;
//                 console.log('写入成功');
//                 //6. 响应结果
//                 res.redirect('/');
//             })
//         })
//     })
// }

// 处理删除的逻辑
module.exports.getDel = (req, res) => {
    //1. 接收要删除的数据的id
    let id = req.query.id;
    //2. 读取 db.json 中的数据
    fs.readFile(path.join(__dirname, './db.json'), (err, data) => {
        if (err) return;
        let jsonData = JSON.parse(data.toString());
        //3. 从数据对象中找到 id 对应的数据
        jsonData.heros.forEach((value, index) => {
            if (value.id == id) {
                //将当前数据从数组中删除
                //4. 删除点击删除的数据
                jsonData.heros.splice(index, 1); //splice()是数组的方法,第一个参数是开始删除的下标,第二个参数是要删除的长度
                for (var i = 0; i < jsonData.heros.length; i++) {
                    jsonData.heros[i].id = i + 1;
                }
            }
        });
        //5. 重新将结果写入到 db.json 中
        let herosStr = JSON.stringify(jsonData, null, '  ');
        fs.writeFile(path.join(__dirname, './db.json'), herosStr, err1 => {
            if (err1) return;
            //6. 响应结果
            res.redirect('/');
        })
    })
}

// 处理得到修改页面的路由逻辑
module.exports.getEdit = (req, res) => {
    //1. 接受参数
    let id = req.query.id;
    //2. 得到 db.json 中的数据
    fs.readFile(path.join(__dirname, './db.json'), (err, data) => {
        if (err) return;
        let jsonData = JSON.parse(data.toString());
        let obj;
        //3. 根据 id 得到 db.json 的数据
        jsonData.heros.forEach(value => {
            if (value.id == id) {
                obj = value;
            }
        })
        //4. 将静态页面与数据进行渲染,结果返回到浏览器
        res.render('edit', obj);
    })
}

// 处理修改页面的逻辑
module.exports.postEdit = (req, res) => {
    //1. 接收参数
    //创建对象
    let form = new formidable.IncomingForm();
    // 调用方法
    form.parse(req, (err, fileds, files) => {
        if (err) return;
        //2. 根据参数生成对象
        fileds.img = 'views/img/1.jpg';
        //3. 得到 db.json 中的数据
        fs.readFile(path.join(__dirname, './db.json'), (err1, data) => {
            let jsonData = JSON.parse(data.toString());
            // console.log(fileds); //{ name: '呜呜呜', gender: '男', img: 'views/img/1.jpg' }
            //4. 将写入的数据覆盖原来的数据
            jsonData.heros.forEach(value => {
                if (fileds.id == value.id) {
                    //将 fileds.id对应数据覆盖 原有的value的数据
                    for (var key in fileds) {
                        value[key] = fileds[key];
                    }
                }
                //终止循环
                return;
            })
            //5. 重新写入
            // 转换为字符串
            let herosStr = JSON.stringify(jsonData, null, '  ');
            fs.writeFile(path.join(__dirname, './db.json'), herosStr, err2 => {
                if (err2) return;
                console.log('修改成功');
                //6. 响应结果
                res.redirect('/');
            })
        })
    })
}
