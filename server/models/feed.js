const Article = require('./articles');
const database = require('../database');

class Feed{
      constructor(){
            this.id;
            this.title;
            this.description;
            this.feedUrl;
            this.link;
            this.language;
            this.lastBuildDate; // Or pubDate
            this.articles = [];
      }

      getData(url){
            return new Promise( async (resolve, reject) => {
                  let Parser = require('rss-parser');
                  let parser = new Parser();
                  let f = null;
                  

                  try{
                        f = await parser.parseURL(url);
                        
                        this.title = f.title;
                        this.description = f.description;
                        this.feedUrl = f.feedUrl;
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
                        title: this.title,
                        description: this.description,
                        feedUrl: this.feedUrl,
                        link: this.link,
                        language: this.language,
                        lastBuildDate: this.lastBuildDate
                  };
      
                  database.query('INSERT INTO feeds SET ?', [toInsert], (error, result) => {
                        if(error)
                            reject(error);
                        
                        this.id = result.insertId
            
                        resolve(this);
                  });
            });
      }
}

module.exports = Feed;