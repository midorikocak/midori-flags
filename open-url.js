const axios = require('axios');
const cheerio = require('cheerio');
//const $ = cheerio.load('<h2 class="title">Hello world</h2>')

axios.get('https://www.c-and-a.com/it/it/shop/jeans-1061278/0')
  .then(response => {
    const $ = cheerio.load(response.data);
    var links = $('head link[rel=alternate]');
    
    links.each(function(item){
      //console.log(this.attribs.href)
      console.log(this.attribs.hreflang)
    })
  })
  .catch(error => {
    console.log(error);
  });

var sheet = workbook.addWorksheet('My Sheet');

//$('h2.title').text('Hello there!')
//$('h2').addClass('welcome')