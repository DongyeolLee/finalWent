var express= require('express');
var fs = require('fs');
var ejs = require('ejs');
var mysql = require('mysql');
var body_parser = require('body-parser');
var router= express.Router();

var path = require('path');

// var userId=null;
//전역변수로 유저아이디를 선언하고, mothercard가 콜될 때마다, 초기화를 해준다.

router.get('/:user_id',function(request,response,next){ //유저아이디가 들어온다
    //이 라우터는 유저id가 get 방식으로 들어올 때마다, depth1을 최신화 해주는 부분이다.
    var userId=request.params.user_id; 
    //들어온 user_id값을 받아서, userId에 추가한다
     connection.query('select userid from userlist where userid=?;',[request.params.user_id],function(error,info){
        
        if(info.length==0){
            
         connection.query('insert into userlist(userid) values(?);',[request.params.user_id],function(error,next){
            if(error!=undefined){
                response.sendStatus(503);
            }
         });
        }
     });
    
    connection.query('select * from mothercard where userid=? order by timestamp desc;',[request.params.user_id],function(error,cursor){
    //쿼리문작성, mothercard 테이블에서, 요청받은 유저아이디와 일치하는 행을 모두 찾는다.                 
                     if(error!=undefined){//에러일경우
                            response.sendStatus(503);
                    }
                     else{ //정상적으로 userid를 찾앗을때,
                         
                         if(cursor.length==0){//database의 cursor가 가리키는 곳의 길이가 0이라는 것은 일치하는 것이 없다는 것.
                             //해당 유저아이디와 일치하는 mother card가 없다.
                             response.json({
                                "result":0
                             }); //result을 0을 리턴해준다. 이것을 받은 클라이언트는 화면 액티비티를 +버튼을 띄우게 될것이다.
                             
                         }
                         else{
                             //해당 유저아이디와 일치하는 mother card가 있다.
                             response.json(cursor);
                             //일치하는 cursor행을 모두 넘겨준다. ? : mothercard의 pk값을 넘겨줘야함.
                         }
                     }
    });
});
router.get('/image/:motherid', function(request, response, next) {

   connection.query('select * from mothercard where motherid = ?;', [ request.params.motherid], function (error, cursor) {

      if (error != undefined) {

         response.sendStatus(503);
      }
      else {
              if (cursor.length == undefined || cursor.length < 1)
                     response.sendStatus(404);
              else
                   response.sendFile(path.join(__dirname, '../', cursor[0].path));
      }
   });
});
router.delete('/:mother_id',function(resquest,response,next){
    
        connection.query('delete from secondcard where motherid = ?;',[resquest.params.mother_id],function(error,info){
            if(error!=undefined)
                response.sendStatus(503)});
    
    
         connection.query('delete from mothercard where motherid = ?;',[resquest.params.mother_id],function(error,info){
            if(error!=undefined)
                response.sendStatus(503);
                
             else{
             
             response.json({
                "result":"delete"
             });
             }
             
             
           
        });
    
});



router.post('/', function(request, response, next){
    
    //////////////클라이언트로부터 request받은 것들을 저장한다
    
    // TODO : 사용자 아이디 받아오기.
    var userId = request.body.user_id;
    var title = request.body.title;  //title저장
    var files = request.files; //files 저장. files은 사진이다.
    var lon = request.body.lon;//경도
    var lat = request.body.lat;//위도
    var address = request.body.address; //스트링 주소값

//    var userid 추가 보류. 디버깅해봐야함.
    
    //여기에 userid가 있어야함. mothercard에 대한 pk값은 줄수있지만, 어떤 유저의 것인지는 추가되야함.
    
    ///////////////////////////////////////////
    //files은 path 주소에 넣고, 경로명이다.
   
    if(title == undefined || files == undefined || files.length < 1) {
        response.sendStatus(403);
    }//아무것도없으면 403을 띄워라.
    else {//만약 ,내용이있으면,
        connection.query('insert into mothercard(title, path, lat, lon, address, userid) values(?, ?, ?, ?, ?, ?);',   [title,files.photo.path,lat,lon,address,userId],function(error,info){
            
            if(error!=undefined)
                
                response.sendStatus(503);
            
            else{
   
               response.json({
                    "result":1
               }) 

            }

 
                                 });
    };
});
                         
                         
                        
module.exports=router;