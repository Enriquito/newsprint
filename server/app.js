const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const session = require('cookie-session');
const User = require('./models/User')

// Controllers
const feedRoutes = require('./controllers/feeds');
const folderRoutes = require('./controllers/folders');
const articleRoutes = require('./controllers/articles');
const historyRoutes = require('./controllers/history');
const userRoutes = require('./controllers/users');

dotenv.config();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use(session({
      secret : 'averygoodsecret',
      resave : true,
      saveUninitialized : true,
      cookie: {
          secure: false,
          maxAge: 1000 * 60 * 60 * 24
        }
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(userRoutes.login));
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findOne(id)
        .then(user => {
            done(null, user);
        })
        .catch(error => {
            console.log(error);
            done(null,null);
        })
});

app.use(function (req, res, next) {
      res.setHeader('Access-Control-Allow-Origin', `${process.env.ALLOW_ORGIN}`);
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      res.setHeader('Access-Control-Allow-Credentials', true);
      next();
});

app.post('/login',passport.authenticate('local'), (req, res) => {
      if(req.user)
          res.json(req.user);
      else
          res.sendStatus(401);
  });
  app.get('/logout',userRoutes.isLoggedIn, (req, res) => {
      req.logout();
      res.sendStatus(200);
});

app.get('/user/current', userRoutes.current);

app.route('/feeds/:id')
.get(feedRoutes.findOne)

app.route('/feeds')
.post(feedRoutes.create)
.put(feedRoutes.update)

app.route('/folders/:id')
.get(folderRoutes.findOne)

app.route('/folders')
.get(folderRoutes.findFoldersByUser)
.post(folderRoutes.create)

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
.get(userRoutes.isLoggedIn, historyRoutes.getAll)
.post(userRoutes.isLoggedIn, historyRoutes.create)

app.use(async (req, res, next) => {
      res.sendStatus(404);
      next();
});


app.listen(process.env.PORT, () => {
      console.log(`listening on port ${process.env.PORT}`);
});