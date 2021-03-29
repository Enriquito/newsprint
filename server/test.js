
const cheerio = require('cheerio');
const axios = require("axios");
const e = require('express');

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

function splitData(data){
  const split = {
    title: null,
    content: null
  };

  const $ = cheerio.load(data);

  split.title = cleanData($.html('h1'));
  split.content = cleanData($.html('article'));

  return split;
}

async function buildArticle(url){
  try{
    const $ = await fetchHTML(url);

    console.log(cleanData($.html('h1')).split(/<h1>(.*?)<\/h1>/));
    const articleTitle = $.html('h1').split(/<h1>(.*?)<\/h1>/);
    const articleParagraphs = $.html('p').split(/<p>(.*?)<\/p>/);
    const articlePictures = [];

    $('article').find('img').each((i,el) => {
      articlePictures.push($(el).attr('src'));
    });

    for(let i = 0; i < articleParagraphs.length; i++){
      if(articleParagraphs[i].length === 0){
        articleParagraphs.splice(i, 1);
      }
    }

    const article = {
      title: articleTitle[1],
      paragraphs: articleParagraphs,
      pictures: articlePictures
    }

    console.log(article);
  }
  catch(error){
    console.log(error);
  }
}

async function test(url){
  buildArticle(url);
}

test("https://www.bbc.co.uk/news/world-europe-55344970");
// test("https://hackaday.com/2020/12/27/hackaday-links-december-27-2020/");
// test("http://www.webdesignernews.com/external/some-early-observations-on-the-google-december-core-update")
// test("https://nos.nl/artikel/2374546-urker-die-inreed-op-journalist-aangehouden.html");
// test("https://tweakers.net/geek/176156/ontwikkelaar-publiceert-nintendo-64-port-van-linux-kernel.html");

