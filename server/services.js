const Feed = require('./models/feed');
const Article = require('./models/article');
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
      Article.deleteOldArticles(2)
      .then(result => {
            console.log(`Rows deleted: ${result.affectedRows}`)
      })
      .catch(error => {
            console.log(error);
      });
}

if(process.env.NODE_ENV === 'production'){
      // Every hour
      cron.schedule('0 * * * *', articleScan);
      cron.schedule('0 * * * *', deleteOldArticles);
}
else{
      articleScan();
}

