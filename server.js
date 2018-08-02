var express = require("express")
var bodyParser = require("body-parser") // 加载body-parser模块
var Cookies=require('cookies')
var app = express()

// 应用中间件
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
// 设置cookie
app.use(function (req,res,next) {
    req.cookies=new Cookies(req,res)
    console.log('cookies',typeof req.cookies.get('userInfo')) //返回 string
    //解析用户的cookie信息
    req.userInfo={};
    var cookiesUserInfo=req.cookies.get('userInfo')
    if(cookiesUserInfo){
        try{
            req.userInfo=JSON.parse(cookiesUserInfo)
        }catch(e){}
    }
    next()
})
var path = require('path')
// 统一返回方式
var resoinseData = {
    code: null,
    message: '',
    userInfo: {}
}
// 构建路由
app.get("/",function(req,res,next){
    if(req.userInfo.userName) {
        res.sendFile(path.resolve("static/index.html")) // 如果请求头中有cookie信息，则加载首页
    }else {
        res.sendFile(path.resolve("static/login.html")) // 如果请求头中没有cookie信息，则重新跳转登录页
    }  
})
app.post("/login",function(req,res,next){
    var userName = req.body.userName
    var password = req.body.password
    console.log("User name = "+ userName +",password is" + password)
    if(userName===''||password==='') {
        resoinseData.code = 1
        resoinseData.message = "用户名和密码不能为空！"
        res.json(resoinseData) // json格式返回给前端
        return
    }else {
        resoinseData.code = 200
        resoinseData.message = "登录成功！请再次刷新页面"
        resoinseData.userInfo = {
            _id:"5a40caa218013c1dd4eadcb0",
            userName:userName,
            password:password
        }
        req.cookies.set('userInfo',JSON.stringify(resoinseData.userInfo))
        res.json(resoinseData)
        return
    }
})
app.post("/loginout",function(req,res,next){
    req.cookies.set('userInfo',null)
    // res.json(resoinseData)
    res.sendFile(path.resolve("static/login.html")) // 用户登出后再次跳转登录页
})
app.listen(3000,function(){
    console.log("Started on PORT 3000")
})