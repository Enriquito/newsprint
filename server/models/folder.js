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
                        user: this.user,
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
                  const query = `SELECT
                  f.id, f.user, fo.id as 'folder', f.display_name, f.title, f.description, f.icon_url, f.feed_url, f.link, f.language, f.last_build_date, f.last_scan_date,
                  (SELECT COUNT(*) FROM articles WHERE feed = f.id AND is_read = 0) as 'unread_articles'
                  FROM feeds f
                  JOIN feed_folder_assignments ffa
                  ON ffa.feed = f.id
                  JOIN folders fo
                  ON fo.id = ffa.folder
                  WHERE fo.id = ?`;

                  database.query(query,[this.id], async (error, result) => {
                        if(error){
                              reject(error);
                              return;
                        }

                        if(result.length === 0){
                              resolve(null);
                              return;
                        }

                        for(let i = 0; i < result.length; i++){
                              const f = result[i];
                              const feed = new Feed();

                              feed.id = f.id;
                              feed.folderId = f.folder;
                              feed.displayName = f.display_name;
                              feed.title = f.title;
                              feed.description = f.description;
                              feed.iconUrl = f.icon_url;
                              feed.feedUrl = f.feed_url;
                              feed.link = f.link;
                              feed.language = f.language;
                              feed.lastBuildDate = f.last_build_date;
                              feed.lastScanDate = f.last_scan_date;
                              feed.unreadArticles = f.unread_articles;

                              this.feeds.push(feed);
                        }

                        resolve();
                  });
            });
      }
}

module.exports = Folder;