const Excel = require('exceljs')
var fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
var workbook = new Excel.Workbook();
var file = './uploads/excel.xlsx';


function getLangs(cb) {
  workbook.xlsx.readFile(file)
  .then(function() {
    var worksheet = workbook.getWorksheet(1);

    var languages = {};
    var urls = [];
    var variableNames = [];
    var languageNames = [];

    worksheet.getColumn(1).eachCell({
      includeEmpty: false
    }, function(cell, rowNumber) {
      if (rowNumber < 2) return;
      variableNames.push(cell.value);
    });

    function updateLanguages() {
      worksheet.getRow(1).eachCell(function(cell, colNumber) {
        if (colNumber < 2) return;
        var values = [];

        worksheet.getColumn(colNumber).eachCell({
          includeEmpty: false
        }, function(cell, colNumber) {
          if (colNumber < 2) return;
          values.push(cell.value);
        });

        languages[cell.value] = createVariableObject(variableNames, values);
        languageNames[colNumber] = cell.value;
      });
    }

    function getLanguages(url){
      axios.get(url)
      .then(response => {
        const $ = cheerio.load(response.data);
        var links = $('head link[rel=alternate]');

        links.each(function(item){
          addLanguage(this.attribs.hreflang, this.attribs.href)
        })

        workbook.xlsx.writeFile(file)
        .then(function() {
          cb()
        });

      })
      .catch(error => {
        console.log(error);
      });
    }

    updateLanguages();


    languageNames.forEach(languageName => {
      if(languages[languageName].url){
        urls.push(languages[languageName].url.text);
      }
    });
    getLanguages(urls[0]);

    function addLanguage(langName, url) {
      if(languages[langName]) return;
      var newColNumber = languageNames.length;
      languageNames[newColNumber] = langName;
      worksheet.getRow(1).getCell(newColNumber).value = langName;
      worksheet.getRow(2).getCell(newColNumber).value = createUrl(url);
      updateLanguages();
    }

  });

}

function createUrl(url) {
  return {
    text: url,
    hyperlink: url
  }
}

function createVariableObject(keys, values) {
  const obj = {};
  var i = 0;
  for (const key of keys) {
    obj[key] = values[i];
    i++;
  }
  return obj
}


module.exports = getLangs;


