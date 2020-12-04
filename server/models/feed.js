const Article = require('./article');
const database = require('../database');

class Feed{
      constructor(){
            this.id;
            this.user;
            this.folderId;
            this.displayName;
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
                  const query = `SELECT
                  f.id, f.user, fo.id as 'folder', f.display_name, f.title, f.description, f.icon_url, f.feed_url, f.link, f.language, f.last_build_date, f.last_scan_date
                  FROM feeds f
                  JOIN feed_folder_assignments ffa
                  ON ffa.feed = f.id
                  JOIN folders fo
                  ON fo.id = ffa.folder
                  WHERE f.id = ?
                  `;
                  database.query(query, [id], async (error, result) => {
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
                        feed.folderId = f.folder;
                        feed.user = f.user;
                        feed.displayName = f.display_name;
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

      addToFolder(folderId){
            return new Promise((resolve,reject) => {
                  const toInsert = {
                        feed: this.id,
                        folder: folderId,
                        user: this.user
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

      getArticles(max, offset){
            return new Promise( async (resolve, reject) => {
                  database.query('SELECT * FROM articles WHERE feed = ? ORDER BY DATE(iso_date) DESC LIMIT ? OFFSET ?', [this.id, max, offset], async (error, result) => {
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
                        // console.log(url);
                        // console.log(temp);
                        // console.log('----')

                        if(temp === null)
                              this.iconUrl = null;
                        else
                              this.iconUrl = `${temp[1]+temp[2]}/favicon.ico`;

                        this.title = f.title;
                        this.description = f.description;
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
                        resolve(this);
                  }
            });
      }

      create(){
            return new Promise((resolve,reject) => {

                  const toInsert = {
                        display_name: this.displayName,
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
                              if(error.errno !== 1062){
                                    console.log(error);
                              }
                              failedInserts.push(article);
                        }
                  }

                  // console.log('Failed inserts:');
                  // console.log(failedInserts);

                  resolve();
            });
      }

      static async getNewItems(){
            // const feed = await Feed.findOne(1);
            // await feed.getData('https://developer.apple.com/news/rss/news.rss');
            // await feed.createArticles();
            return new Promise( async (resolve, reject) => {
                  database.query('SELECT id,feed_url FROM feeds', async (error, result) => {
                        if(error){
                              reject(error);
                              return;
                        }

                        for(let i = 0; i < result.length; i++){
                              const feed = await Feed.findOne(result[i].id);

                              if(feed !== null){
                                    await feed.getData(result[i].feed_url);
                                    await feed.createArticles();
                              }
                        }

                        resolve();
                  });
            });
      }

      moveToFolder(from, to){
            return new Promise((resolve, reject) => {
                  const toInsert = {
                        feed: this.id,
                        folder: to,
                        user : 1
                  }

                  const query = `DELETE FROM feed_folder_assignments WHERE feed = ? AND folder = ? AND user = ?; INSERT INTO feed_folder_assignments SET ?`;

                  database.query(query, [this.id, from, 1, toInsert], async (error, result) => {
                      if(error){
                              reject(error);
                              return;
                      }

                      resolve();
                  });
            });
      }

      update(){
            return new Promise((resolve,reject) => {
                  const toUpdate = {
                        display_name: this.displayName,
                        title: this.title,
                        description: this.description,
                        icon_url: this.iconUrl,
                        feed_url: this.feedUrl,
                        link: this.link,
                        language: this.language,
                        last_build_date: this.lastBuildDate
                  };

                  database.query('UPDATE feeds SET ? WHERE id = ?', [toUpdate, this.id], async (error, result) => {
                        if(error){
                              console.log(error);
                              reject(error);
                              return;
                        }

                        resolve(this);
                  });
            });
      }

      delete(){
            return new Promise((resolve, reject) => {
                  database.query(`DELETE FROM feeds WHERE id = ?`, [this.id], async (error, result) => {
                      if(error){
                              reject(error);
                              return;
                      }

                      resolve(this);
                  });
              });
      }
}

module.exports = Feed;