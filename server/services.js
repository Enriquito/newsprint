const Feed = require('./models/feed');
const Article = require('./models/article');
const moment = require('moment-timezone');
const cron = require('node-cron');
const dotenv = require('dotenv');
dotenv.config();


function articleScan(){
      console.log(`scanning for new articles...`)

      Feed.getNewItems()
      .then(result => {
            console.log(`Scan complete. ${result.affectedRows} new rows added`);
      })
      .catch(error => {
            console.log(error);
      });
}
function deleteOldArticles(){
      Article.deleteOldArticles(4)
      .then(result => {
            console.log(`Rows deleted: ${result.affectedRows}`)
      })
      .catch(error => {
            console.log(error);
      });
}

if(process.env.NODE_ENV === 'production'){
      console.log('--------------------------------');
      console.log(moment().format('LL HH:MM'))
      // Every hour
      cron.schedule('0 * * * *', articleScan);
      cron.schedule('0 * * * *', deleteOldArticles);
}
else{
      console.log('--------------------------------');
      console.log(moment().format('LL HH:MM'))
      articleScan();
      deleteOldArticles();
}

