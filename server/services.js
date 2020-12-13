const Feed = require('./models/feed');
const Article = require('./models/article');
const cron = require('node-cron');


function articleScan(){
      console.log(`scanning for new articles...`)

      Feed.getNewItems()
      .then(result => {
            console.log('Scan complete.');
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

// Every hour
cron.schedule('0 * * * *', articleScan);
cron.schedule('0 * * * *', deleteOldArticles);
