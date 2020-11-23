const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const dotenv = require('dotenv');

// Controllers
const feedRoutes = require('./controllers/feeds');
const folderRoutes = require('./controllers/folders');
const articleRoutes = require('./controllers/articles');

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

app.route('/folders/user/:id')
.get(folderRoutes.findFoldersByUser)

app.route('/articles/:id')
.get(articleRoutes.findOne)

app.get('/unread/articles', articleRoutes.unreadArticles)

app.listen(process.env.PORT, () => {
      console.log(`listening on port ${process.env.PORT}`)
});