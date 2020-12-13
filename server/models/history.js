const Article = require('./article');
const database = require('../database');

class History{
    static getHistoryItemsCount(userId){
        return new Promise((resolve, reject) => {
            database.query(`SELECT COUNT(user) as 'history_items_count' FROM article_history WHERE user = ?`, [userId], async (error, result) => {
                if(error){
                      reject(error);
                      return;
                }

                if(result.length === 1)
                    resolve(result[0].history_items_count);
                else
                    resolve(null);
            });
        });
    }

    static getAll(userId){
        return new Promise((resolve, reject) => {
            const query = `SELECT
            a.id, a.feed, a.title, a.link, a.pub_date, a.content, a.content_snippet, a.iso_date, a.is_read, fe.icon_url,
            CASE WHEN fe.display_name IS NOT NULL THEN fe.display_name ELSE fe.title END as 'display_name'
            FROM articles a
            LEFT JOIN favorites f
            ON a.id = f.article
            LEFT JOIN users u
            ON u.id = f.user
            LEFT JOIN feeds fe
            ON fe.id = a.feed
            JOIN article_history ah
            ON ah.article = a.id
            WHERE fe.user = ${userId}
            ORDER BY ah.created DESC`;

            database.query(query, [userId], async (error, result) => {
                if(error){
                      reject(error);
                      return;
                }

                if(result === null){
                    reject(null);
                    return;
                }

                const Feed = require('./feed');
                const articles = [];

                if(result.length > 0){
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

                        if(article !== null){
                            articles.push(article);
                        }
                    }

                    resolve(articles);
                }
                else{
                    resolve([]);
                }
            });
        });
    }

    static create(user, article){
        return new Promise((resolve, reject) => {
            const toInsert = {
                user: user,
                article: article
            };

            database.query('INSERT INTO article_history SET ?', [toInsert], async (error, result) => {
                if(error){
                      reject(error);
                      return;
                }

                resolve();
            });
        });
    }

    static destory(user, article){
        return new Promise((resolve, reject) => {
            database.query('DELETE FROM article_history WHERE user = ? AND article = ?', [user, article], async (error, result) => {
                if(error){
                      reject(error);
                      return;
                }

                resolve();
            });
        });
    }

    static destroyNextInLine(user){
        return new Promise((resolve, reject) => {
            const query = `SELECT @user:= user, @article:= article FROM article_history WHERE user = ? ORDER BY created ASC LIMIT 1;DELETE FROM article_history WHERE user = @user AND article= @article`;

            database.query(query, [user], async (error, result) => {
                if(error){
                        reject(error);
                        return;
                }

                resolve();
            });
        });
    }
}

module.exports = History;