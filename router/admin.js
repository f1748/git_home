const express = require("express");
const crypto = require("crypto");
const mysql = require('mysql');
const db = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"root",
    database:"fan_fan"
})

var comm = {
    md5_ext:'fdssssssss方式顶顶顶顶顶顶顶顶顶（）fffffffssd',
    md5:function(str){
        var obj = crypto.createHash("md5");
        obj.update(str);
        return obj.digest('hex');
    }
}
module.exports = function(){
    var router = express.Router();
    router.use((req,res,next)=>{
        if(!req.session['admin_id'] && req.url != '/login'){
            res.redirect('/admin/login');
        }else{
            next();
        }
    });

    router.get('/login',(req,res)=>{
        res.render('admin/login.ejs',{});
    });

    router.post('/login',(req,res)=>{
        var username = req.body.username;
       // console.log(req.body.password);
        var password = comm.md5(req.body.password+comm.md5_ext);
        db.query(`SELECT * FROM admin_table WHERE username='${username}'`,(err,data)=>{
            if(err){
                console.log(err);
                res.status(500).send("database is error").end();
            }else if(data.length == 0){
                res.status(404).send('user is error').end();
            }else if(data[0].password == password){
                req.session['admin_id'] = data[0].ID;
                res.redirect('/admin');
            }else{
                res.status(500).send("password is error").end()
            }
        })
    })

    router.get('/',(req,res)=>{
        res.render('admin/index.ejs',{});
    })

    

    router.get('/banners',(req,res)=>{
      
      switch(req.query.act){
        case "mod":
            db.query(`SELECT * FROM banners_tables WHERE ID='${req.query.id}'`,(err,mod_dat)=>{
                if(err){
                    console.log(err);
                    res.status(500).send("database error").end();
                }else if(mod_dat.length==0){
                    res.status(400).send("data not found").end();
                }else{
                        db.query(`SELECT * FROM banners_tables`,(err,banners)=>{
                            if(err){
                                console.log(err);
                                res.status(500).send('database error').end();
                            }else{

                                 res.render('admin/banners.ejs',{banners,mod_data:mod_dat[0]});
                            }

                        })
                           
                }
            })
            break;
        case "del":
            db.query(`DELETE FROM banners_tables WHERE ID='${req.query.id}'`,(err,data)=>{
                if(err){
                    console.log(err);
                    res.status(500).send('databases error').end();
                }else{
                    res.redirect("/admin/banners");
                }
            })
            break;

       default:
          db.query(`SELECT * FROM banners_tables`,(err,banners)=>{
           if(err){
               console.log(err);
               res.status(500).send('database is error').end();
           }else{
                        res.render('admin/banners.ejs',{banners});
                    }
               })
       break;
      }
        
    })

    router.post('/banners',(req,res)=>{
        var title = req.body.title;
       // console.log(title);
        var description = req.body.description;
        //console.log(description);
        var href = req.body.href;
        //console.log(href)
        if(!title || !description || !href){
            res.send('请填写完').end();
        }else{
                if(req.body.mod_id){//update
                    db.query(`UPDATE banners_tables SET \
                    title='${title}',\
                    description='${description}',\
                    href='${href}'\
                    WHERE ID=${req.body.mod_id}`,(err,data)=>{
                        if(err){
                            console.log(err);
                        }else{
                            res.redirect('/admin/banners');
                        }
                    });

                }else{//INSERT
                        db.query(`INSERT INTO banners_tables (title,description,href) \
                        VALUE('${title}',\
                        '${description}',\
                        '${href}')`,(err,data)=>{
                            if(err){
                                console.log(err);
                            }else{
                                res.redirect('/admin/banners');
                            }
                        })

                    }
            }
    })

    return router;
}