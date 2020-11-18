let Parser = require('rss-parser');
let parser = new Parser();

(async () => {

    let feed = await parser.parseURL('https://blogs.windows.com/feed/');
    delete feed.items;
    console.log(feed);

    // feed.items.forEach(item => {
    //   console.log(item);
    // });

    // console.log(feed.items[0]);

  })();