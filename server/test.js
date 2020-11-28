let Parser = require('rss-parser');
let parser = new Parser();
const Feed = require('./models/feed')
const Article = require('./models/article')


async function test(){
  try{
    // const feed = await Feed.findOne(1);
    // await feed.getArticles();

    const testFeeds = [
      "https://developer.apple.com/news/rss/news.rss",
      "https://www.webdesignernews.com/rss",
      "https://blogs.windows.com/feed/",
      "http://feeds.bbci.co.uk/news/world/rss.xml",
      "http://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
      "http://www.iculture.nl/feed/",
      "http://feeds.feedburner.com/tweakers/games"
      ];

    for(let i = 0; i < testFeeds.length; i++){
      const feed = new Feed();
      await feed.getData(testFeeds[i]);
      await feed.create();
      await feed.createArticles();

      console.log(feed);
    }

    // const feed = new Feed();
    // await feed.getData('http://feeds.feedburner.com/tweakers/games');
    // await feed.create();
    // await feed.createArticles();
    // delete feed.articles
    // const feed = await Article.findOne(1);
    // console.log(feed.articles[0]);
  }
  catch(error){
    console.log(error);
  }
}

test();
