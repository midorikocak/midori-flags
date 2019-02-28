var express = require('express');
var formidable = require('formidable');
var router = express.Router();
var flags = require('../flags');
var empty = require('empty-folder');

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('add-variables',
      {title: 'Upload Variables', section: 'excel', loading: false});
});

router.get('/variables', function(req, res, next) {
  empty(__dirname + '/uploads', false, (o) => {
    if (o.error) console.error(o.error);
    //console.log(o.removed);
    //console.log(o.failed);
  });
  res.render('add-variables',
      {title: 'Upload Variables', section: 'excel', loading: false});
});

router.get('/language', function(req, res, next) {
  empty(__dirname + '/uploads', false, (o) => {
    if (o.error) console.error(o.error);
    //console.log(o.removed);
    //console.log(o.failed);
  });
  res.render('add-languages', {title: 'Upload Langauges', section: 'lang'});
});

router.get('/languages', function(req, res, next) {
  res.render('get-languages', {title: 'Get Languages Excel', section: 'lang'});
});

router.get('/template', function(req, res, next) {
  empty(__dirname + '/templates', false, (o) => {
    if (o.error) console.error(o.error);
    //console.log(o.removed);
    //console.log(o.failed);
  });
  res.render('add-template', {title: 'Upload Template', section: 'template'});
});

router.get('/result', function(req, res, next) {
  empty(__dirname + '/results', false, (o) => {
    if (o.error) console.error(o.error);
    //console.log(o.removed);
    //console.log(o.failed);
  });
  flags(() => {
    res.render('get-result', {title: 'Result', section: 'template'});
  });

});

router.get('/results/result.zip',
    (req, res) => res.download('./results/result.zip'));
router.get('/uploads/excel-withlangs.xlsx',
    (req, res) => res.download('./uploads/excel-withlangs.xlsx'));

module.exports = router;
