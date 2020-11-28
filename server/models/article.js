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
            this.favorite = false;
            this.feedId;
            this.categories = [];
      }

      static findOne(id){
            return new Promise( async (resolve, reject) => {
                  database.query('SELECT * FROM articles WHERE id = ?', [id], async (error, result) => {
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
                        article.isoDate = f.iso_date;

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

                        resolve(article);
                  });
            });
      }

      static getCountAllUnreadArticles(){
            return new Promise((resolve, reject) => {
                  const query = `
                        SELECT COUNT(a.id) as 'unread_articles' FROM articles a
                        JOIN feeds f
                        ON f.id = a.feed
                        WHERE a.is_read = 0 AND f.user = 1
                  `;
                  database.query(query, (error, result) => {
                        if(error){
                              reject(error);
                              return;
                        }

                        if(result.length === 0){
                              resolve(null);
                              return;
                        }

                        resolve({unreadArticles: result[0].unread_articles});

                  });
            });
      }

      static getAllUnreadArticles(min,max){
            return new Promise((resolve, reject) => {


                  const query = `SELECT a.id, a.creator, a.title, a.link, a.pub_date, a.content, a.content_snippet, a.iso_date
                  FROM articles a JOIN feeds f ON f.id = a.feed
                  WHERE a.is_read = 0 AND f.user = 1 ORDER BY DATE(a.iso_date) DESC LIMIT ? OFFSET ?
                  `;
                  database.query(query,[max,min], async (error, result) => {
                        if(error){
                              reject(error);
                              return;
                        }

                        if(result.length === 0){
                              resolve(null);
                              return;
                        }

                        const articles = [];

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

                              articles.push(article);
                        }

                       resolve(articles);
                  });
            });
      }

      isFavorite(){
            return new Promise((resolve, reject) => {
                  database.query(`SELECT * FROM favorites WHERE article = ?`,[this.id], (error, result) => {
                        if(error){
                              this.favorite = false;
                              reject(error);
                              return;
                        }

                        if(result.length === 1)
                              this.favorite = true;
                        else
                              this.favorite = false;

                        resolve();
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

      setToRead(){
            return new Promise((resolve, reject) => {
                  const query = `UPDATE articles SET is_read = 1 WHERE id = ?`;

                  database.query(query,[this.id], (error, result) => {
                        if(error){
                              reject(error);
                              return;
                        }

                        resolve(this);
                  });
            });
      }

      setToUnread(){
            return new Promise((resolve, reject) => {
                  const query = `UPDATE articles SET is_read = 0 WHERE id = ?`;

                  database.query(query,[this.id], (error, result) => {
                        if(error){
                              reject(error);
                              return;
                        }

                        resolve(this);
                  });
            });
      }

      AddToFavorites(){
            return new Promise((resolve, reject) => {
                  const toInsert = {
                        user: 1,
                        article: this.id
                  };

                  database.query(`INSERT INTO favorites SET ?`,[toInsert], (error, result) => {
                        if(error){
                              console.log(error);
                              reject(error);
                              return;
                        }

                        resolve(this);
                  });
            });
      }

      removeFromFavorites(){
            return new Promise((resolve, reject) => {
                  database.query(`DELETE FROM favorites WHERE article = ?`,[this.id], (error, result) => {
                        if(error){
                              reject(error);
                              return;
                        }

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