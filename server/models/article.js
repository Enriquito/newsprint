const database = require('../database');

class Article{
      constructor(){
            this.id;
            this.user;
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
            this.feed;
            this.categories = [];
      }

      static findOne(id){
            return new Promise( async (resolve, reject) => {
                  const query = `SELECT a.id, a.feed, f.user ,a.creator, a.title,  a.link, a.pub_date, a.content, a.content_snippet, a.iso_date, a.is_read FROM articles a
                  JOIN feeds f
                  ON a.feed = f.id
                  WHERE a.id = ?`;

                  database.query(query, [id], async (error, result) => {
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
                        article.user = f.user;
                        article.creator = f.creator;
                        article.title = f.title;
                        article.link = f.link;
                        article.pubDate = f.pub_date;
                        article.content = f.content;
                        article.contentSnippet = f.content_snippet;
                        article.isoDate = f.iso_date;


                        try{
                              // article.feed = await Feed.findOne(f.feed);
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

      static getCountAllUnreadArticles(userId){
            return new Promise((resolve, reject) => {
                  const query = `
                        SELECT COUNT(a.id) as 'unread_articles' FROM articles a
                        JOIN feeds f
                        ON f.id = a.feed
                        WHERE a.is_read = 0 AND f.user = ?
                  `;
                  database.query(query,[userId], (error, result) => {
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

      static getCountNewArticlesToday(userId){
            return new Promise((resolve, reject) => {
                  const query = `SELECT COUNT(a.id) as 'new_articles' 
                  FROM articles a 
                  JOIN feeds f 
                  ON f.id = a.feed
                  WHERE a.is_read = 0 
                  AND f.hide_in_new_list = 0
                  AND f.user = ? 
                  AND DATE(a.iso_date) = DATE(NOW())`;

                  database.query(query,[userId], async (error, result) => {
                        if(error){
                              reject(error);
                              return;
                        }

                        if(result.length === 0){
                              reject();
                              return;
                        }

                       resolve({newArticleCount: result[0].new_articles});
                  });
            });
      }

      static getNewArticlesToday(userId,offset,max){
            return new Promise((resolve, reject) => {
                  const query = `SELECT DISTINCT
                  a.id, a.feed, a.title, a.link, a.pub_date, a.content, a.content_snippet, a.iso_date, a.is_read, fe.icon_url,
                  CASE WHEN fe.display_name IS NOT NULL THEN fe.display_name ELSE fe.title END as 'display_name',
                  fe.id as 'feed_id', CASE WHEN f.article IS NOT NULL THEN 1 ELSE 0 END as 'favorite'
                  FROM articles a
                  LEFT JOIN favorites f
                  ON a.id = f.article
                  LEFT JOIN users u
                  ON u.id = f.user
                  LEFT JOIN feeds fe
                  ON fe.id = a.feed
                  WHERE a.is_read = 0
                  AND fe.user = ? AND DATE(a.iso_date) = DATE(NOW()) AND a.is_read = 0
                  ORDER BY a.iso_date DESC LIMIT ? OFFSET ?
                  `;

                  database.query(query,[userId,max,offset], async (error, result) => {
                        if(error){
                              reject(error);
                              return;
                        }

                        if(result.length === 0){
                              resolve([]);
                              return;
                        }

                        const articles = [];
                        const Feed = require('./feed');

                        for(let i = 0; i < result.length; i++){
                              const f = result[i];

                              const article = new Article();
                              const feed = new Feed();

                              feed.iconUrl = f.icon_url;
                              feed.displayName = f.display_name;
                              feed.id = f.feed;

                              article.id = f.id;
                              article.creator = f.creator;
                              article.title = f.title;
                              article.link = f.link;
                              article.pubDate = f.pub_date;
                              article.content = f.content;
                              article.contentSnippet = f.content_snippet;
                              article.isoDate = f.iso_date
                              article.favorite = f.favorite;
                              article.feed = feed;

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

      static getAllUnreadArticles(userId, min,max){
            return new Promise((resolve, reject) => {
                  const query = `SELECT DISTINCT
                        a.id, a.feed, a.title, a.link, a.pub_date, a.content, a.content_snippet, a.iso_date, a.is_read, fe.icon_url,
                        CASE WHEN fe.display_name IS NOT NULL THEN fe.display_name ELSE fe.title END as 'display_name', fe.hide_in_new_list,
                        fe.id as 'feed_id', CASE WHEN f.article IS NOT NULL THEN 1 ELSE 0 END as 'favorite'
                        FROM articles a
                        LEFT JOIN favorites f
                        ON a.id = f.article
                        LEFT JOIN users u
                        ON u.id = f.user
                        LEFT JOIN feeds fe
                        ON fe.id = a.feed
                        WHERE a.is_read = 0
                        AND fe.user = ?
                        AND fe.hide_in_new_list = 0
                        ORDER BY a.iso_date DESC LIMIT ? OFFSET ?
                  `;

                  database.query(query,[userId,max,min], async (error, result) => {
                        if(error){
                              reject(error);
                              return;
                        }

                        if(result.length === 0){
                              resolve([]);
                              return;
                        }

                        const articles = [];
                        const Feed = require('./feed');

                        for(let i = 0; i < result.length; i++){
                              const f = result[i];

                              const article = new Article();
                              const feed = new Feed();

                              feed.iconUrl = f.icon_url;
                              feed.displayName = f.display_name;
                              feed.id = f.feed;

                              article.id = f.id;
                              article.creator = f.creator;
                              article.title = f.title;
                              article.link = f.link;
                              article.pubDate = f.pub_date;
                              article.content = f.content;
                              article.contentSnippet = f.content_snippet;
                              article.isoDate = f.iso_date
                              article.favorite = f.favorite;
                              article.feed = feed;

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
                  if(this.isoDate == null || this.link == null || this.title == null){
                        reject();
                        return;
                  }
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
                        if(error)
                              reject(error);

                        if(result){
                              this.id = result.insertId
                              resolve(this);
                        }
                        else
                              reject();
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

                  database.query(query,[this.id, this.id, this.user], (error, result) => {
                        if(error){
                              reject(error);
                              return;
                        }

                        resolve(this);
                  });
            });
      }

      AddToFavorites(userId){
            return new Promise((resolve, reject) => {
                  const toInsert = {
                        user: userId,
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

      removeFromFavorites(userId){
            return new Promise((resolve, reject) => {
                  database.query(`DELETE FROM favorites WHERE article = ? AND user = ?`,[this.id, userId], (error, result) => {
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

      static getFavoritesLimit(userId,offset,max){
            return new Promise((resolve,reject) => {
                  const query = `
                        SELECT
                        a.id, a.feed, a.title, a.link, a.pub_date, a.content, a.content_snippet, a.iso_date, a.is_read, fe.icon_url, fe.display_name, fe.title as 'feedTitle',
                        CASE WHEN f.article IS NOT NULL THEN 1 ELSE 0 END as 'favorite'
                        FROM articles a
                        LEFT JOIN favorites f
                        ON a.id = f.article
                        LEFT JOIN feeds fe
                        ON fe.id = a.feed
                        WHERE f.user = ?
                        ORDER BY DATE(f.created) DESC LIMIT ? OFFSET ?
                        `;

                  database.query(query,[userId,max,offset], (error, result) => {
                        if(error){
                              reject(error);
                              return;
                        }

                        const articles = [];

                        for(let i = 0; i < result.length; i++){
                              const f = result[i];
                              const Feed = require('./feed');

                              const feed = new Feed();

                              feed.iconUrl = f.icon_url;
                              feed.displayName = f.display_name;
                              feed.id = f.feed;
                              feed.title = f.feedTitle

                              const article = new Article();

                              article.id = f.id;
                              article.creator = f.creator;
                              article.title = f.title;
                              article.link = f.link;
                              article.pubDate = f.pub_date;
                              article.content = f.content;
                              article.contentSnippet = f.content_snippet;
                              article.isoDate = f.iso_date
                              article.favorite = true;
                              article.feed = feed;


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

      static deleteOldArticles(months,userID){
            return new Promise((resolve, reject) => {
                  const query = `
                                    DELETE a.*
                                    FROM feeds fe
                                    JOIN articles a
                                    ON a.feed = fe.id
                                    LEFT JOIN favorites f
                                    ON a.id = f.article
                                    WHERE iso_date <= NOW() - INTERVAL ? MONTH
                                    AND f.article IS NULL
                                    AND fe.user = ?
                              `;

                  database.query(query,[months,userID], (error, result) => {
                        if(error){
                              reject(error);
                              return;
                        }

                        resolve(result);
                  });
            });
      }
}

module.exports = Article;