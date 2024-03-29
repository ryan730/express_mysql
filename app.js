/**
 * Created by Rossy1 on 2018/10/22.
 */
var express = require('express');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var multer = require('multer');
var upload = multer({ dest: 'uploadFile/' });
//链接数据库
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root12345',
    database: 'ec'
});
connection.connect();
// 创建 application/x-www-form-urlencoded 编码解析(post方法)
var urlencodedParser = bodyParser.urlencoded({ extended: false })
//设置返回头
 app.all('*', function (req, res, next) {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "X-Requested-With");
     res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
     res.header("Content-Type", "application/json;charset=utf-8");
    //  res.header("Content-Type", "image/jpeg");
     next();
 });
//图片加载,存储在uploadFile下的所有图片
app.get('/uploadFile/*', function (req, res) {
    res.header("Content-Type", "image/jpeg");
    res.sendFile(__dirname + "/" + req.url);
})
//文件上传
app.post('/upload', upload.any(), function (req, res, next) {
    console.log(req.files[0]);  // 上传的文件信息
    var newFile = "./uploadFile/" + req.files[0].originalname;
    fs.readFile(req.files[0].path, function (err, data) {
        fs.writeFile(newFile, data, function (err) {
            if (err) {
                console.log("错误：", err)
            } else {
                let response = {
                    message: '上传成功',
                    filename: req.files[0].originalname
                };
                res.json(response);
            }
        });
    })
})

//登录
app.post('/login', urlencodedParser, function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var sql = `select * from login where username = '${username}' and password = '${password}'`; //sql语句
    connection.query(sql, function (err, result) {
        console.log(result)
        if (err || result.length == 0) {
            res.status(200),
                res.json("登陆失败")
        } else {
            res.status(200),
                res.json("登陆成功")
        }
    });
})

//查询
//http://localhost:8080/query
app.get('/query', function (req, res) {
    var sql = 'select * from student';
    connection.query(sql, function (err, result) {
        if (err) {
            console.log('err:', err.message);
        }
        console.log('query',result);
        res.status(200),
        res.json(result)
    });
});
//修改
//http://localhost:8080/change?SNO=1&SNAME=aaa1&SDEPT=bbb1
app.get('/change', function (req, res) {
    var SNO = req.query.SNO;
    var SNAME = req.query.SNAME;
    var SDEPT = req.query.SDEPT;
    var sql = `update student set SNAME = '${SNAME}',SDEPT = '${SDEPT}' where SNO = '${SNO}'`;
    connection.query(sql, function (err, result) {
        if (err) {
            console.log('err:', err.message);
        }
        console.log(result);
        res.status(200),
            res.json("修改成功")
    });
})
//添加
//http://localhost:8080/add?SNO=1&SNAME=aaa&SDEPT=bbb
app.get('/add', function (req, res) {
    console.log(req.query)
    var SNO = req.query.SNO;
    var SNAME = req.query.SNAME;
    var SDEPT = req.query.SDEPT;
    var sql = `insert into student values ('${SNO}','${SNAME}','${SDEPT}')`;
    connection.query(sql, function (err, result) {
        if (err) {
            console.log('err:', err.message);
        }
        console.log(result);
        res.status(200),
            res.json("添加成功")
    });
})
//删除
app.get('/delete', function (req, res) {
    console.log(req.query)
    var SNO = req.query.SNO;
    var sql = `delete from student where SNO='${SNO}'`;
    connection.query(sql, function (err, result) {
        if (err) {
            console.log('err:', err.message);
        }
        console.log(result);
        res.status(200),
            res.json("删除成功")
    });
})

// connection.end();

//配置服务端口
var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('http://', host, port);
})
