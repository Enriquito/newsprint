let Parser = require('rss-parser');
let parser = new Parser();
const Feed = require('./models/feed')
const Article = require('./models/article')


async function test(){
  try{
    const feed = new Feed();
    await feed.getData('https://www.webdesignernews.com/rss');

    await feed.create();
    await feed.createArticles();
    delete feed.articles
    // const feed = await Article.findOne(1);
    console.log(feed);
  }
  catch(error){
    console.log(error);
  }
}

test();
