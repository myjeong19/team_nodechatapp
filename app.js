var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const layout = require('express-ejs-layouts');
require('dotenv').config();
var sequelize = require('./models/index.js').sequelize;

var session = require('express-session');
var sequelize = require('./models/index.js').sequelize;
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var channelRouter = require('./routes/channel');
var channelAPIRouter = require('./routes/channelAPI');
var memberAPIRouter = require('./routes/memberAPI');
var commonAPIRouter = require('./routes/commonAPI');

var app = express();

sequelize.sync();

//서버세션 설정
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: 'testsecret',
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 5,
    },
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layout');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);
app.set('layout extractMetas', true);

// cors 설정
// app.use(cors());
// app.use(cors({
//   methods: ["GET", "POST", "DELETE", "OPTIONS"],
//   origin: ["http://localhost:3000"],
// })
// );

app.use(layout);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/chat', channelRouter);
app.use('/api/channel', channelAPIRouter);
app.use('/api/member', memberAPIRouter);
app.use('/api/common', commonAPIRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
