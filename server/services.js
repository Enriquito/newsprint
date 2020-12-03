const Feed = require('./models/feed');

console.log(`scanning for new articles...`)

Feed.getNewItems()
.then(result => {
      console.log('Scan complete.');
})
.catch(error => {
      console.log(error);
});