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
            database.query(`SELECT article FROM article_history WHERE user = ?`, [userId], async (error, result) => {
                if(error){
                      reject(error);
                      return;
                }

                if(result === null){
                    reject(null);
                    return;
                }

                const articles = [];

                if(result.length > 0){
                    for(let i = 0; i < result.length; i++){
                        const article = await Article.findOne(result[i].article);

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