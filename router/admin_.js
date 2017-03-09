const express = require("express");
const crypto = require("crypto");
const mysql = require("mysql");
var db = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"root",
    database:"fan_fan"
})

module.exports = function(){
    var common = {
        MD5_SUFFIX:'fsdfsdfsdfsdfsdf(返利)',
        md5:function(str){
            var obj = crypto.createHash("md5");
            obj.update("str");
            return obj.digest("hex");
        }
    
    }
    var router = express.Router();
    router.use((req,res,next)=>{
        if(!req.session['admin_id'] && req.url != "/login"){
            res.redirect('/admin/login');
        }else{
            next();
        }
    })
    router.get('/login',(rq,res)=>{
            res.render('admin/login.ejs',{});
        });


        //post  admin

    router.post('/login',(req,res)=>{
            var username = req.body.username;
        
            var password = common.md5(req.body.password+common.MD5_SUFFIX);
         console.log(password);
           db.query(`SELECT * FROM admin_table WHERE username='${username}'`,(err,data)=>{
                if(err){
                    console.log(err);
                    res.status(500).send("database error").end();
                }else if(data.length==0){
                    res.status(404).send("user error").end();

                }else{
                   console.log(data[0].password);
                }
                
            })
    })
        
    
    return router;
}