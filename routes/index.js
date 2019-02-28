var express = require('express');
var formidable = require('formidable');
var router = express.Router();
var flags = require("../flags");

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index', {title: 'Upload Excel', section: 'excel', loading:false});
});

router.get('/uploads', function(req, res, next) {
  res.render('index', {title: 'Upload Excel', section: 'excel', loading:false});
});

router.get('/languages', function(req, res, next) {
  res.render('select-languages', {title: 'Langauges', section: 'lang'});
});

router.get('/templates', function(req, res, next) {
  res.render('upload-template', {title: 'Upload Template', section: 'template'});
});

router.get('/result', function(req, res, next) {
  flags(()=>{
    res.render('result', {title: 'Result', section: 'template'});
  });

});

router.get('/results/result.zip', (req, res) => res.download('./results/result.zip'))

module.exports = router;
