
const cheerio = require('cheerio');
const axios = require("axios");
const e = require('express');
const Feed = require('./models/feed');

async function fetchHTML(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

function cleanData(data){
  let result = data.replace(/\r?\n|\r/g, "");
  result = result.replace(/<script .*>(.*)<\/script>/g, "");
  result = result.replace(/<!--(.*?)-->/g, "");
  result = result.replace(/class=\"(.*?)\"/g, "");
  result = result.replace(/data-.*?=\".*?\"/g, "");

  return result;
}

async function buildArticle(url){
  try{
    const $ = await fetchHTML(url);

    const articleTitle = $('article').find('h1').text();
    const articleParagraphs = [];
    const articlePictures = [];
    //$.html('p').split(/<p>(.*?)<\/p>/);

    $('article').find('img').each((i,el) => {
      articlePictures.push($(el).attr('src'));
    });

    $('article').find('p').each((i,el) => {
      articleParagraphs.push($(el).text());
    });

    for(let i = 0; i < articleParagraphs.length; i++){
      if(articleParagraphs[i].length === 0){
        articleParagraphs.splice(i, 1);
      }
    }

    const article = {
      title: articleTitle,
      paragraphs: articleParagraphs,
      pictures: articlePictures
    }

    console.log(article);
  }
  catch(error){
    console.log(error);
  }
}

const snippet = `Looks like all the content of MDN is on GitHub now. That’s pretty rad. That’s been the public plan for a while.`;

async function test(url,contentSnippet){
  try{
    const $ = await fetchHTML(url);
    const test = cleanData($('body').html());

    // console.log($('body').html());
    
    const a = $('root').filter(function(i,el) {
      return $(this).text().indexOf(`Looks:`) > -1;
    }).next().text();

    console.log(a);
  }
  catch(error){

  }
}

async function a (url) {
  let Parser = require('rss-parser');
  let parser = new Parser();
  const f = await parser.parseURL(url);
  
  console.log(f);
}

a('http://feeds.nos.nl/nosnieuwsalgemeen');

//test("https://css-tricks.com/mdn-on-github/",snippet);
// buildArticle("https://hackaday.com/2020/12/27/hackaday-links-december-27-2020/");
// buildArticle("http://www.webdesignernews.com/external/some-early-observations-on-the-google-december-core-update")
// buildArticle("https://nos.nl/artikel/2374546-urker-die-inreed-op-journalist-aangehouden.html");
// buildArticle("https://tweakers.net/geek/176156/ontwikkelaar-publiceert-nintendo-64-port-van-linux-kernel.html");

