var createError = require('http-errors');
var express = require('express');
var formidable = require('formidable');



const session = require('express-session')
const uuid = require('uuid/v4')

const FileStore = require('session-file-store')(session);
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');

var getlangs = require('./get-languages')

var app = express();

var app = express(),
    exphbs = require("express-handlebars");

app.engine("hbs", exphbs({
  defaultLayout: "layout",
  extname: ".hbs",
  helpers: require("./public/javascripts/helpers.js"), // same file that gets used on our client
  partialsDir: "views/partials", // same as default, I just like to be explicit
  layoutsDir: "views/layouts" // same as default, I just like to be explicit
}));
// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
// create the homepage route at '/'
app.get('/health', (req, res) => {
  const uniqueId = uuid()
  res.send(`Hit home page. Received the unique id: ${uniqueId}\n`)
})


app.use(session({
  genid: (req) => {
    console.log('Inside the session middleware')
    console.log(req.sessionID)
    return uuid() // use UUIDs for session IDs
  },
  store: new FileStore(),
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

// create the homepage route at '/'
app.get('/session', (req, res) => {
  console.log('Inside the homepage callback function')
  console.log(req.sessionID)
  res.send(`You hit home page!\n`)
});

app.post('/uploads', function(req, res) {
  var form = new formidable.IncomingForm();

  form.parse(req);
  form.on('fileBegin', function(name, file) {
    file.path = __dirname + '/uploads/excel.xlsx';
  });

  form.on('file', function(name, file) {
    console.log('Uploaded ' + file.name);

    getlangs(()=>{res.redirect("/templates");});


  });

  form.on('aborted', () => {
    console.error('Request aborted by the user');
  });

  form.on('error', (err) => {
    console.log(err);
    console.error('Error', err);
    throw err;
  });


});

app.post('/templates', function(req, res) {
  var form = new formidable.IncomingForm();

  form.parse(req);
  form.on('fileBegin', function(name, file) {
    file.path = __dirname + '/templates/template.hbs';
  });

  form.on('file', function(name, file) {
    console.log('Uploaded ' + file.name);
  });

  form.on('aborted', () => {
    console.error('Request aborted by the user');
  });

  form.on('error', (err) => {
    console.log(err);
    console.error('Error', err);
    throw err;
  });

  res.redirect("/result")
});


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
