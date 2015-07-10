var express = require('express');

var path = require('path');

var logger = require('morgan');
var bodyParser = require('body-parser');
var multer=require('multer');


//var userlist=require('./routes/userlist');
var mothercard=require('./routes/mothercard');
var secondcard=require('./routes/secondcard');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
//app.use('/userlist',userlist);

app.use(multer({
    
    dest:'./mothercard/',
    rename: function (fieldname, filename) { return "image_" + Date.now() + "." + filename.split('.').pop(); }
}));


app.use(multer({
    
    dest:'./secondcard/',
    rename: function (fieldname, filename) { return "image_" + Date.now() + "." + filename.split('.').pop(); }
}));


app.use('/mothercard',mothercard);

app.use('/secondcard',secondcard);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status||500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status||500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
