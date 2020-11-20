const database = require('../database');

class Article{
      constructor(){
            this.id;
            this.creator;
            this.title;
            this.link;
            this.pubDate;
            this.content;
            this.contentSnippet;
            this.isoDate;
            this.isRead;
            this.feedId;
            this.categories = [];
      }

      static findOne(id){
            return new Promise( async (resolve, reject) => {
                  database.query('SELECT * FROM articles WHERE id = ?', [id], (error, result) => {
                        if(error){
                              reject(error);
                              return;
                        }

                        if(result.length === 0){
                              resolve(null);
                              return;
                        }

                        const f = result[0];
                        const article = new Article();

                        article.id = f.id;
                        article.creator = f.creator;
                        article.title = f.title;
                        article.link = f.link;
                        article.pubDate = f.pub_date;
                        article.content = f.content;
                        article.contentSnippet = f.content_snippet;
                        article.isoDate = f.iso_date

                        if(f.is_read == 1)
                              article.isRead = true;
                        else
                              article.isRead = false;

                        resolve(feed);
                  });
            });
      }

      create(){
            return new Promise((resolve,reject) => {
                  const toInsert = {
                        feed: this.feedId,
                        creator: this.creator,
                        link: this.link,
                        title: this.title,
                        pub_date: this.pubDate,
                        content: this.content,
                        content_snippet: this.contentSnippet,
                        iso_date: this.isoDate
                  };

                  database.query('INSERT INTO articles SET ?', [toInsert], (error, result) => {
                        if(error){
                              console.log(error);
                              reject(error);
                        }

                        this.id = result.insertId

                        resolve(this);
                  });
            });
      }

      createCategories(){
            return new Promise((resolve,reject) => {
                  if(this.categories === 0 || this.categories === undefined){
                        resolve();
                        return;
                  }

                  const toInsert = [];
                  this.categories.forEach(cat => {
                        toInsert.push({
                              article: this.id,
                              category: cat
                        });
                  })

                  database.query('INSERT INTO article_categories SET ?', toInsert, (error, result) => {
                        if(error){
                              reject(error);
                              return;
                        }


                        resolve();
                  });
            });
      }
}

module.exports = Article;