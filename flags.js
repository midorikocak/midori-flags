var handlebars = require('handlebars');
var fs = require('fs');
var JSZip = require('jszip');
var zip = new JSZip();
var results = zip.folder("results");
const Excel = require('exceljs');
var workbook = new Excel.Workbook();

function getValues(colNumber, worksheet) {
  var cols = [];
  worksheet.getColumn(colNumber).
      eachCell({includeEmpty: false}, function(cell, colNumber) {
        if (colNumber < 2) return;
        cols.push(cell.value);
      });
  return cols;
}

function compileLanguage(filename, languageCode, languageData) {
  var data = fs.readFileSync('./templates/template.hbs');
  var source = data.toString();
  // call the render function
  renderToFile(source, languageData, filename + '-' + languageCode +
      '.html');

}

// this will be called after the file is read
function renderToFile(source, data, filename) {
  var template = handlebars.compile(source);
  results.file(filename, template(data));
  // fs.writeFile(filename, template(data), function(err) {
  //   if (err) {
  //     return console.log(err);
  //   }
  //   console.log('The file was saved!');
  // });
}

function createVariableObject(keys, values) {
  const obj = {};
  var i = 0;
  for (const key of keys) {
    obj[key] = values[i];
    i++;
  }

  return obj;
}

module.exports = function(cb) {

  workbook.xlsx.readFile('./uploads/excel-withlangs.xlsx').then(function() {
    var worksheet = workbook.getWorksheet(1);
    var languages = [];
    var variableNames = [];
    var languageNames = [];

    worksheet.getColumn(1).
        eachCell({includeEmpty: false}, function(cell, rowNumber) {
          if (rowNumber < 2) return;
          variableNames.push(cell.value);
        });
    worksheet.getRow(1).eachCell(function(cell, colNumber) {
      if (colNumber < 2) return;
      languages[cell.value] = createVariableObject(variableNames,
          getValues(colNumber, worksheet));
      languageNames.push(cell.value);
    });

    for (var i = 0; i < languageNames.length; i++) {

      compileLanguage('template', languageNames[i],
          languages[languageNames[i]]);
      if (i === languageNames.length -1) {
        zip.file("README.txt", "Files are located at results folder.\n");
        zip.generateNodeStream({type: 'nodebuffer', streamFiles: true}).
            pipe(fs.createWriteStream('./results/result.zip')).
            on('finish', function() {
              // JSZip generates a readable stream with a "end" event,
              // but is piped here in a writable stream which emits a "finish" event.
              console.log('out.zip written.');
              cb()
            });
      }
    }
  });
};

