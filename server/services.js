const Feed = require('./models/feed');
const Article = require('./models/article');
const moment = require('moment-timezone');
const cron = require('node-cron');
const dotenv = require('dotenv');
const database = require('./database');
dotenv.config();

console.log(`${process.env.NODE_ENV} service started.`);

if(process.env.NODE_ENV === 'production'){
      const query = `SELECT u.id as 'user', up.article_delete_interval, up.article_scan_interval, up.darkmode
                        FROM users u
                        JOIN user_preferences up
                        ON u.id = up.user`;
      let data = null;

      database.query(query, (error, result) => {
            if(error){
                  console.log(error);
                  return;
            }
            data = result;

            const one = [];
            const two = [];
            const three = [];
            const four = [];

            data.forEach(el => {
                  switch(el.article_scan_interval){
                        case 1:
                              one.push(el);
                        break
                        case 2:
                              two.push(el);
                        break;
                        case 3:
                              three.push(el);
                        break;
                        case 4:
                              four.push(el);
                        break;
                  }
            });

            cron.schedule('0 12 * * *', () => {
                  console.log('--------------------------------');
                  console.log(moment().format('LL HH:MM'))
                  console.log(`purging of articles started`);
                  console.log(`puring job queued for ${data.length} accounts`);

                  data.forEach(async el => {
                        await Article.deleteOldArticles(el.article_delete_interval, el.user);
                  });
            });

            // Every hour
            cron.schedule('0 * * * *', () => {
                  console.log('--------------------------------');
                  console.log(moment().format('LL HH:MM'))
                  console.log(`Article scan started for one hour intervals`);
                  console.log(`job queued for ${one.length} accounts`);

                  one.forEach(async el => {
                        await Feed.getNewItems(el.user);
                  });

                  console.log(`runned: ${one.length} jobs`)
            });

            cron.schedule('0 */2 * * *', () => {
                  console.log('--------------------------------');
                  console.log(moment().format('LL HH:MM'))
                  console.log(`Article scan started for one hour intervals`);
                  console.log(`job queued for ${two.length} accounts`);

                  two.forEach(async el => {
                        await Feed.getNewItems(el.user);
                  });

                  console.log(`runned: ${two.length} jobs`)
            });

            cron.schedule('0 */3 * * *', () => {
                  console.log('--------------------------------');
                  console.log(moment().format('LL HH:MM'))
                  console.log(`Article scan started for one hour intervals`);
                  console.log(`job queued for ${three.length} accounts`);

                  three.forEach(async el => {
                        await Feed.getNewItems(el.user);
                  })

                  console.log(`runned: ${three.length} jobs`)
            });

            cron.schedule('0 */4 * * *', () => {
                  console.log('--------------------------------');
                  console.log(moment().format('LL HH:MM'))
                  console.log(`Article scan started for one hour intervals`);
                  console.log(`job queued for ${four.length} accounts`);

                  four.forEach(async el => {
                        await Feed.getNewItems(el.user);
                  })

                  console.log(`runned: ${four.length} jobs`)
            });
      });

}
else{
      console.log('--------------------------------');
      console.log(moment().format('LL HH:MM'))
      const query = `SELECT u.id as 'user', up.article_delete_interval, up.article_scan_interval, up.darkmode
                        FROM users u
                        JOIN user_preferences up
                        ON u.id = up.user`;
      const data = null;

      database.query(query, (error, result) => {
            if(error){
                  console.log(error);
                  return;
            }

            result.forEach(el => {
                  articleScan(el.user);
                  deleteOldArticles(el.article_delete_interval, el.user);
            })
      });


}

