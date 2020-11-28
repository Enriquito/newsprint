const Article = require('./article');
const database = require('../database');

class Feed{
      constructor(){
            this.id;
            this.user = 1;
            this.displayname = "test";
            this.iconUrl;
            this.title;
            this.description;
            this.feedUrl;
            this.link;
            this.language;
            this.lastBuildDate; // Or pubDate
            this.lastScanDate;
            this.unreadArticles = 0;
            this.articles = [];
      }

      static findOne(id){
            return new Promise( async (resolve, reject) => {
                  database.query('SELECT * FROM feeds WHERE id = ?', [id], async (error, result) => {
                        if(error){
                              console.log(error);
                              reject(error);
                              return;
                        }

                        if(result.length === 0){
                              resolve(null);
                              return;
                        }

                        const f = result[0];
                        const feed = new Feed();

                        feed.id = f.id;
                        feed.title = f.title;
                        feed.description = f.description;
                        feed.iconUrl = f.icon_url;
                        feed.feedUrl = f.feed_url;
                        feed.link = f.link;
                        feed.language = f.language;
                        feed.lastBuildDate = f.last_build_date;
                        feed.lastScanDate = f.last_scan_date;

                        try{
                              await feed.getUnreadArticles();
                        }
                        catch(error){
                              console.log(error);
                              reject(error);
                        }

                        resolve(feed);
                  });
            });
      }

      getUnreadArticles(){
            return new Promise( async (resolve, reject) => {
                  database.query(`SELECT COUNT(*) as 'unreadArticles' FROM articles WHERE feed = ? AND is_read = 0`, [this.id], (error, result) => {
                        if(error){
                              console.log(error);
                              reject(error);
                              return;
                        }

                        if(result.length === 0){
                              resolve(null);
                              return;
                        }

                        this.unreadArticles = result[0].unreadArticles;
                        resolve();
                  });
            })
      }

      addToDefaultFolder(){
            return new Promise((resolve,reject) => {
                  const toInsert = {
                        feed: this.id,
                        folder: 4,
                        user: 1
                  };

                  database.query('INSERT INTO feed_folder_assignments SET ?', [toInsert], (error, result) => {
                        if(error){
                              console.log(error);
                              reject(error);
                              return;
                        }

                        resolve();
                  });
            });
      }

      getArticles(){
            return new Promise( async (resolve, reject) => {
                  database.query('SELECT * FROM articles WHERE feed = ? ORDER BY DATE(iso_date) DESC', [this.id], async (error, result) => {
                        if(error){
                              console.log(error);
                              reject(error);
                              return;
                        }

                        if(result.length === 0){
                              resolve(null);
                              return;
                        }

                        for(let i = 0; i < result.length; i++){
                              const f = result[i];

                              const article = new Article();

                              article.id = f.id;
                              article.creator = f.creator;
                              article.title = f.title;
                              article.link = f.link;
                              article.pubDate = f.pub_date;
                              article.content = f.content;
                              article.contentSnippet = f.content_snippet;
                              article.isoDate = f.iso_date

                              try{
                                    await article.isFavorite();
                              }
                              catch(error){
                                    article.favorite = false;
                              }

                              if(f.is_read == 1)
                                    article.isRead = true;
                              else
                                    article.isRead = false;

                              this.articles.push(article);
                        }

                        resolve();
                  });
            });
      }

      getData(url){
            return new Promise( async (resolve, reject) => {
                  let Parser = require('rss-parser');
                  let parser = new Parser();
                  let f = null;


                  try{
                        f = await parser.parseURL(url);
                        const temp = f.link.match(/( |https:\/\/|http:\/\/)([A-Za-z0-9]{1,10}\.?[A-Za-z]{1,}\.?[A-Za-z]{1,})(?: |\/|$)/);

                        this.title = f.title;
                        this.description = f.description;
                        this.iconUrl = `${temp[1]+temp[2]}/favicon.ico`;
                        this.feedUrl = f.feedUrl || url;
                        this.link = f.link;
                        this.language = f.language;
                        this.lastBuildDate = f.lastBuildDate;

                        f.items.forEach(item => {
                              const article = new Article();

                              article.creator = item.creator;
                              article.title = item.title;
                              article.link = item.link;
                              article.pubDate = item.pubDate;
                              article.content = item.content;
                              article.contentSnippet = item.contentSnippet;
                              article.categories = item.categories;
                              article.isoDate = item.isoDate;

                              this.articles.push(article);
                        });

                        resolve(this);
                  }
                  catch(error){
                        console.log(error);
                        reject(null);
                  }
            });
      }

      create(){
            return new Promise((resolve,reject) => {

                  const toInsert = {
                        user: this.user,
                        title: this.title,
                        description: this.description,
                        icon_url: this.iconUrl,
                        feed_url: this.feedUrl,
                        link: this.link,
                        language: this.language,
                        last_build_date: this.lastBuildDate
                  };

                  database.query('INSERT INTO feeds SET ?', [toInsert], async (error, result) => {
                        if(error){
                              console.log(error);
                              reject(error);
                              return;
                        }

                        this.id = result.insertId

                        try{
                              await this.addToDefaultFolder();
                        }
                        catch(error){
                              reject(error);
                              return;
                        }

                        resolve(this);
                  });
            });
      }

      createArticles(){
            return new Promise(async (resolve,reject) => {
                  const failedInserts = [];

                  for(let i = 0; i < this.articles.length; i++){
                        let article = this.articles[i];
                        article.feedId = this.id;

                        try{
                              const a = await article.create();
                              this.articles[i].id = a.id;

                              await article.createCategories();
                        }
                        catch(error){
                              console.log(error);
                              failedInserts.push(article);
                        }
                  }

                  // console.log('Failed inserts:');
                  // console.log(failedInserts);

                  resolve();
            });
      }
}

module.exports = Feed;