const database = require('../database');

class Article{
      constructor(){
            this.id;
            this.creator;
            this.title;
            this.pubDate;
            this.content;
            this.contentSnippet;
            this.isoDate;
            this.categories = [];
      }

      create(){
            return new Promise((resolve,reject) => {
                  const toInsert = {
                        creator: this.creator,
                        title: this.title,
                        pubDate: this.pubDate,
                        content: this.content,
                        content_snippet: this.contentSnippet,
                        isoDate: this.isoDate
                  };
      
                  database.query('INSERT INTO articles SET ?', [toInsert], (error, result) => {
                        if(error)
                            reject(error);
                        
                        this.id = result.insertId
            
                        resolve(this);
                  });
            });
      }

      createCategories(){
            return new Promise((resolve,reject) => {
                  if(this.categories === 0){
                        reject(null);
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
                        if(error)
                              reject(error);
            
                        resolve();
                  });
            });
      }
}

module.exports = Article;