const Feed = require('./models/feed');
const Article = require('./models/article');
const moment = require('moment-timezone');
const cron = require('node-cron');
const dotenv = require('dotenv');
const database = require('./database');
dotenv.config();

console.log(`${process.env.NODE_ENV} service started.`);
let jobs = [];

async function startJobs (){
      if(process.env.NODE_ENV === 'production'){
            try{
                  // Vaste tijd bijv. 12 uur
                  deleteCron(12);

                  jobs.push(scanCron(1));
                  jobs.push(scanCron(2));
                  jobs.push(scanCron(3));
                  jobs.push(scanCron(4));
            }
            catch(error){
                  console.log('Cron error')
                  console.log(error)
            }

      }
      else{
            try{
                  devTest();
            }
            catch(error){
                  console.log(error);
            }
      }
}

function getData(interval){
      return new Promise((resolve, reject) =>{
            const query = `SELECT u.id as 'user', up.article_delete_interval, up.article_scan_interval
                        FROM users u
                        JOIN user_preferences up
                        ON u.id = up.user
                        WHERE up.article_scan_interval = ?
                        `;
            database.query(query,[interval], (error, result) => {
                  if(error){
                        reject(error);
                        return;
                  }

                  resolve(result);
            });
      });
}

async function deleteCron(deleteTime){
      const data = await new Promise((resolve, reject) =>{
            const query = `SELECT u.id as 'user', up.article_delete_interval
                        FROM users u
                        JOIN user_preferences up
                        ON u.id = up.user
                        `;
            database.query(query, (error, result) => {
                  if(error){
                        reject(error);
                        return;
                  }

                  resolve(result);
            });
      });

      cron.schedule(`0 ${deleteTime} * * *`, async () => {
            console.log('--------------------------------');
            console.log(moment().format('LL HH:mm'))
            console.log(`purging of articles started`);
            console.log(`puring job queued for ${data.length} accounts`);

            for(let i = 0; i < result.length; i++){
                  const el = result[i];
                  await Article.deleteOldArticles(el.article_delete_interval, el.user);
            }
      });
}

async function scanCron(interval){
      let data = await getData(interval);

      if(interval === 1)
            interval = '*';
      else
            interval = `*/${interval}`;

      return cron.schedule(`0 ${interval} * * *`, () => {
            console.log('--------------------------------');
            console.log(moment().format('LL HH:mm'))
            console.log(`Article scan started for one hour intervals`);
            console.log(`job queued for ${data.length} accounts`);
            console.log('--------------------------------');

            for(let i = 0; i < result.length; i++){
                  const el = result[i];
                  await Feed.getNewItems(el.user);
            }
      });
}

async function devTest(){
      console.log('--------------Start Test------------------');
      console.log(moment().format('LL HH:mm'))
      const query = `SELECT u.id as 'user', up.article_delete_interval, up.article_scan_interval
                        FROM users u
                        JOIN user_preferences up
                        ON u.id = up.user`;

      database.query(query, async(error, result) => {
            if(error){
                  console.log(error);
                  return;
            }

            for(let i = 0; i < result.length; i++){
                  const el = result[i];

                  console.log(`---running for userId: ${el.user}---`);

                  console.log(`Started article scan`);
                  await Feed.getNewItems(el.user);

                  console.log(`Started article deletion`);
                  await Article.deleteOldArticles(el.article_delete_interval, el.user);
            }
            console.log('--------------End Test------------------');
      });
}


startJobs();