var express=require('express');
var mysql=require('mysql');
var ejs = require('ejs');
var body_parser = require('body-parser');

var router=express.Router();
var connection=mysql.createConnection({
    'host' : 'awsrds.chw0idizaakm.us-west-2.rds.amazonaws.com',
	'user' : 'user',
	'password' : 'wlfkf330',
	'database' : 'sopt',
});

router.get('/:user_id',function(request,response,next){
    
    connection.query('select userid from userlist where userid=?;',[request.params.user_id],function(error,info){
        
        if(info.length==0){
            
         connection.query('insert into userlist(userid) values(?);',[request.params.user_id],function(error,next){
            if(error!=undefined){
                response.sendStatus(503);
            }
            else{
                response.redirect('/mothercard/'+[request.params.user_id]);
            }
         });
        }
        else{
                response.redirect('/mothercard/'+[request.params.user_id]);
        }
    });
});
module.exports=router;