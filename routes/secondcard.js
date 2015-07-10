var express=require('express');
var mysql=require('mysql');
var path=require('path');
var fs=require('fs');

var router=express.Router();

router.get('/:user_id/:mother_id',function(request,response,next){
    //@get /secondcard
    //mother_id와 userid가 같이 넘어와서 요청해주어야 한다.

    var motherid = request.params.mother_id;
    var userid = request.params.user_id;
    
    connection.query('select * from secondcard where motherid=? and userid=?;', [motherid,userid],function(error,cursor){
                     
                     if(error!=undefined){
                            response.sendStatus(503);
                    }
                     else{//세컨드 카드가 없을경우
                         
                         if(cursor.length==0){//database의 cursor가 가리키는 곳의 길이가 0이라는 것은 일치하는 것이 없다는 것.
                             //해당 유저아이디와 motherid에 일치하는 mother card가 없다.
                             response.json({
                                "result":0
                             }); //result을 0을 리턴해준다. 이것을 받은 클라이언트는 화면 액티비티를 +버튼을 띄우게 될것이다.
                             
                         }
                         else{
                             //해당 유저아이디와 일치하는 second card가 있다.
                             response.json(cursor);
                             //일치하는 cursor행을 모두 넘겨준다.
                         }
                     }
                     
    });
});


//세컨드 카드의 사진을 유저에게 넘겨 준다
router.get('/image/my/:secondid', function(request, response, next) {

	connection.query('select * from secondcard where secondid = ?;', [ request.params.secondid], function (error, cursor) {

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

router.post('/',function(request,response,next){
    
    var title = request.body.title;  //title저장
    var files = request.files; //files 저장. files은 사진이다.
    var lon = request.body.lon;//경도
    var lat = request.body.lat;//위도
    var content = request.body.content;
    var motherid = request.body.mother_id;
    var userid = request.body.user_id;
    //카드가 추가될 때, 날짜정보가 추가된다.
    var time=request.body.time;
    
    
    if(title==undefined||lat==undefined||lon==undefined|| files == undefined || files.length < 1){
        response.sendStatus(403);
    }
   
     else{  
         connection.query('insert into secondcard(title,content,lat,lon,motherid,userid,time,path) values(?,?,?,?,?,?,?,?);',[title,content,lat,lon,motherid,userid,time,files.photo.path],function(error,info){
            if(error!=undefined)
                response.sendStatus(503);
            else{//새로받은 데이터 post 추가완료하고나면,
                
                ///마더카드에 mintime과 maxtime을 추가해주는 쿼리문,
        connection.query('select * from secondcard where motherid=? and userid=? order by time;',[motherid,userid],function(error,cursor){
     //해당 유저와 마더아이디에 일치하는 세컨카드정렬 .

            var mintime=cursor[0].time;
            
                        connection.query('update mothercard set mintime=? where motherid=? and userid=?;',            [mintime,motherid,userid],function(error,next){

            });
            
        connection.query('select * from secondcard where motherid=? and userid=? order by time desc;',[motherid,userid],function(error,cursor){
     //해당 유저와 마더아이디에 일치하는 세컨카드정렬 .
            
          var maxtime=cursor[0].time;
            
                        connection.query('update mothercard set maxtime=? where motherid=? and userid=?;',            [maxtime,motherid,userid],function(error,next){

            });
                
        });

                
                response.json({
                    "result":1
               });
            }
        )};
     }
)};
});




router.delete('/:second_id',function(resquest,response,next){
    
        connection.query('delete from secondcard where secondid = ?;',[resquest.params.second_id],function(error,info){
            if(error!=undefined)
                response.sendStatus(503);
            
            else{
                response.json({
                        "result":"delete"
                });
            }
        });
    
});



module.exports=router;
                     