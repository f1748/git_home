const express = require("express");
const static = require("express-static");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const consolidate = require("consolidate");
const cookieSession = require("cookie-session");
var routery = require("./router/admin.js");
var server = express();

//bodyParser
server.use(bodyParser.urlencoded());

//multer；
server.use(multer({dest:"upload"}).any());

//cookie
var arr = [];
for(var i = 0;i<100000;i++){
    arr.push('fskeys_'+Math.random());
}
//session
server.use(cookieSession({
    name:'keys_fan',
    keys:arr,
    maxAge:20*3600*1000
}))
ggt
//module
server.set("view engine","html");
server.set("views",'template');
server.engine("html",consolidate.ejs);

//router
server.use('/admin',routery());


server.listen(8080);
