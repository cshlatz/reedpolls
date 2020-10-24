var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

const MODULE_PATH = './application/modules/';

// view engine setup
app.set('views', path.join(__dirname, './application/views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static paths
app.use('/app', express.static(__dirname + '/application/modules/'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/data', express.static(__dirname + '/data/'));

// Third party libraries
app.use('/moment', express.static(__dirname + '/node_modules/moment/dist/'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/jquery-ui-dist', express.static(__dirname + '/node_modules/jquery-ui-dist/'));
app.use('/chart.js', express.static(__dirname + '/node_modules/chart.js/dist/'));

// Index routing
var indexRouter = require('./application/routes/index');
app.use('/', indexRouter);

// Register modules
var polls = require(MODULE_PATH + 'polls/polls')
app.use('/polls/', polls)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
