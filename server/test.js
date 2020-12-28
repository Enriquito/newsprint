
const cheerio = require('cheerio');
const axios = require("axios");

async function fetchHTML(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

function cleanData(data){
  let result = data.replace(/\r?\n|\r/g, "");
  result = result.replace(/<script .*>(.*)<\/script>/g, "");
  result = result.replace(/<!--(.*?)-->/g, "");

  return result;
}

function splitData(data){
  const split = {
    title: null,
    content: null
  };
  const $ = cheerio.load(data);

  split.title = $.html('h1');
  split.content = $.html('article');

  console.log(split);
}

async function test(url){
  try{
    const $ = await fetchHTML(url)
    let data = $.html('article');

    let result = cleanData(data);

    let a = splitData(result);

    console.log($.html());
  }
  catch(error){
    console.log(error);
  }
}

// test("https://www.bbc.co.uk/news/world-europe-55344970");
// test("https://hackaday.com/2020/12/27/hackaday-links-december-27-2020/");
// test("http://www.webdesignernews.com/external/some-early-observations-on-the-google-december-core-update")
// test("https://nos.nl/artikel/2362282-belgie-overweegt-uitstel-tweede-inenting.html");
test("https://tweakers.net/geek/176156/ontwikkelaar-publiceert-nintendo-64-port-van-linux-kernel.html");

