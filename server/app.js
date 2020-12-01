const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const dotenv = require('dotenv');

// Controllers
const feedRoutes = require('./controllers/feeds');
const folderRoutes = require('./controllers/folders');
const articleRoutes = require('./controllers/articles');
const historyRoutes = require('./controllers/history');

dotenv.config();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use(function (req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', `${process.env.ALLOW_ORGIN}`);
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      res.setHeader('Access-Control-Allow-Credentials', true);
next();
});

app.route('/feeds/:id')
.get(feedRoutes.findOne)

app.route('/feeds')
.post(feedRoutes.create)

app.route('/folders/:id')
.get(folderRoutes.findOne)

app.route('/folders')
.get(folderRoutes.findFoldersByUser)

app.route('/articles/:id')
.get(articleRoutes.findOne)

app.get('/articles/count/unread', articleRoutes.unreadArticlesCount)
app.get('/unread/articles', articleRoutes.unreadArticles)
app.put('/articles/set/read', articleRoutes.setToRead)
app.put('/articles/set/unread', articleRoutes.setToUnread)
app.post('/articles/save/favorite', articleRoutes.addToFavorites)
app.post('/articles/remove/favorite', articleRoutes.removeFromFavorites)
app.get('/favorite/articles', articleRoutes.getFavoriteArticles)
app.post('/move/feeds', feedRoutes.moveToFolder)

app.route('/history')
.get(historyRoutes.getAll)
.post(historyRoutes.create)


app.listen(process.env.PORT, () => {
      const Feed = require('./models/feed');
      console.log(`listening on port ${process.env.PORT}`)
      console.log(`scanning for new articles...`)
      // Feed.getNewItems()
      Feed.getNewItems()
      .then(result => {
            console.log('Scan complete.');
      })
      .catch(error => {
            console.log(error);
      });
});