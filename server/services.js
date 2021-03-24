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

                  jobs.push(scanCron(15));
                  jobs.push(scanCron(30));
                  jobs.push(scanCron(45));
                  jobs.push(scanCron(60));
            }
            catch(error){
                  console.log('Cron error')
                  console.log(error)
            }

      }
      else{
            try{
                  // devTest();
                  delTest(1);
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
            let delteCount = 0;
            console.log('--------------------------------');
            console.log(moment().format('LL HH:mm'))
            console.log(`purging of articles started`);
            console.log(`puring job queued for ${data.length} accounts`);

            for(let i = 0; i < data.length; i++){
                  const el = data[i];
                  delteCount += await Article.deleteOldArticles(el.article_delete_interval, el.user);
            }

            console.log(`${delteCount} articles deleted.`);
      });
}

async function scanCron(interval){
    let data = await getData(interval);
    let cron = "";

    switch(interval){
        case 15:
            cron = `*/15 * * * *`;
            break;
        case 30:
            cron = `*/30 * * * *`;
            break;
        case 45:
            cron = `*/45 * * * *`;
            break;
        case 60:
            cron = `0 * * * *`;
            break;            
    }

    return cron.schedule(cron, async () => {
        console.log('--------------------------------');
        console.log(moment().format('LL HH:mm'))
        console.log(`Article scan started for ${interval} minutes intervals`);
        console.log(`job queued for ${data.length} accounts`);

        for(let i = 0; i < data.length; i++){
                const el = data[i];
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

async function delTest(deleteTime){
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

      console.log('--------------------------------');
      console.log(moment().format('LL HH:mm'))
      console.log(`purging of articles started`);
      console.log(`puring job queued for ${data.length} accounts`);

      for(let i = 0; i < data.length; i++){
            const el = data[i];
            console.log(`Delting items for user: ${el.user}`)
            await Article.deleteOldArticles(el.article_delete_interval, el.user);
      }
}


startJobs();