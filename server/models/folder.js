const Feed = require('./feed');
const database = require('../database');

class Folder{
      constructor(){
            this.id;
            this.user;
            this.name;
            this.showOrder;
            this.totalUnread = 0;
            this.feeds = [];
      }

      static findOne(id){
            return new Promise( async (resolve, reject) => {
                  database.query('SELECT * FROM folders WHERE id = ?', [id], (error, result) => {
                        if(error){
                              reject(error);
                              return;
                        }

                        if(result.length === 0){
                              resolve(null);
                              return;
                        }

                        const folder = new Folder();
                        const f = result[0];

                        folder.id = f.id;
                        folder.name = f.name;
                        folder.user = f.user;
                        folder.showOrder = f.show_order;

                        resolve(folder);
                  });
            });
      }

      static findAllByUser(userId){
            return new Promise( async (resolve, reject) => {
                  const q = `SELECT fo.id, fo.name, fo.show_order FROM folders fo
                              JOIN users u
                              ON u.id = fo.user
                              WHERE u.id = ?
                        `;

                  database.query(q, [userId], async (error, result) => {
                        if(error){
                              reject(error);
                              return;
                        }

                        if(result.length === 0){
                              resolve(null);
                              return;
                        }

                        const folders = [];

                        for(let i = 0; i < result.length; i++){
                              const folder = new Folder();
                              const f = result[i];

                              folder.id = f.id;
                              folder.name = f.name;
                              folder.user = f.user;
                              folder.showOrder = f.show_order;

                              try{
                                    await folder.getFeeds();

                                    for(let i = 0; i < folder.feeds.length; i++){
                                          folder.totalUnread += folder.feeds[i].unreadArticles;
                                    }
                              }
                              catch(error){
                                    console.log(error);
                              }

                              folders.push(folder);
                        }

                        resolve(folders);
                  });
            });
      }

      create(){
            return new Promise((resolve,reject) => {
                  const toInsert = {
                        user: 1,
                        name: this.name,
                        show_order: 0,
                  };

                  database.query('INSERT INTO folders SET ?', [toInsert], (error, result) => {
                        if(error){
                              console.log(error);
                              reject(error);
                        }

                        this.id = result.insertId

                        resolve(this);
                  });
            });
      }

      getFeeds(){
            return new Promise( async (resolve, reject) => {
                  database.query("SELECT feed as 'id' FROM feed_folder_assignments WHERE folder = ?",[this.id], async (error, result) => {
                        if(error){
                              reject(error);
                              return;
                        }

                        if(result.length === 0){
                              resolve(null);
                              return;
                        }

                        for(let i = 0; i < result.length; i++){
                              const id = result[i].id;
                              let feed = null;

                              try{
                                    feed = await Feed.findOne(id);
                                    await feed.getArticles();

                                    this.feeds.push(feed);
                              }
                              catch(error){
                                    console.log(error);
                                    reject(error);
                              }
                        }

                        resolve();
                  });
            });
      }
}

module.exports = Folder;