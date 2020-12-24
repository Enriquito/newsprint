const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const passport = require('passport');
const cors = require('cors');
const LocalStrategy = require('passport-local').Strategy;
const session = require('cookie-session');
const User = require('./models/user')

// Controllers
const feedRoutes = require('./controllers/feeds');
const folderRoutes = require('./controllers/folders');
const articleRoutes = require('./controllers/articles');
const historyRoutes = require('./controllers/history');
const userRoutes = require('./controllers/users');

dotenv.config();

if(process.env.NODE_ENV === 'production'){
    app.set('trust proxy', function (ip) {
        if (ip === '::ffff:127.0.0.1')          
            return true; // trusted IPs
        else
            return false;
    })
}

app.use(cors({
    origin: process.env.ALLOW_ORGIN,
    credentials: true,
    exposedHeaders: "*",
    allowedHeaders: "content-type,X-Requested-With",
    methods: ['GET','PUT','DELETE','OPTIONS', 'POST', 'PATCH']
}));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use(session({
      secret : 'averygoodsecret',
      resave : true,
      saveUninitialized : true,
      cookie: {
            path: '/',
            httpOnly: true,
            secureProxy: true,
            domain: 'newsprint.app',
            secure: true,
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

app.post('/users', userRoutes.create);
app.post('/account/request/password-reset',userRoutes.passwordResetRequest)
app.post('/account/password-reset/validate',userRoutes.validatePasswordResetToken)
app.put('/account/password-reset/', userRoutes.passwordReset)
app.route('/preferences')
.put(userRoutes.isLoggedIn,userRoutes.updatePreference)
.get(userRoutes.isLoggedIn,userRoutes.getPreference)

app.get('/user/current', userRoutes.current);

app.route('/feeds/:id')
.get(userRoutes.isLoggedIn,feedRoutes.findOne)
.delete(userRoutes.isLoggedIn,feedRoutes.delete)

app.route('/feeds')
.post(userRoutes.isLoggedIn,feedRoutes.create)
.put(userRoutes.isLoggedIn,feedRoutes.update)

app.route('/folders/:id')
.get(userRoutes.isLoggedIn,folderRoutes.findOne)
.delete(userRoutes.isLoggedIn, folderRoutes.delete);

app.route('/folders')
.get(userRoutes.isLoggedIn,folderRoutes.findFoldersByUser)
.post(userRoutes.isLoggedIn,folderRoutes.create)
.put(folderRoutes.update)

app.route('/articles/:id')
.get(userRoutes.isLoggedIn,articleRoutes.findOne)

app.get('/articles/count/unread',userRoutes.isLoggedIn, articleRoutes.unreadArticlesCount)
app.get('/unread/articles',userRoutes.isLoggedIn, articleRoutes.unreadArticles)
app.put('/articles/set/read', userRoutes.isLoggedIn,articleRoutes.setToRead)
app.put('/articles/set/unread',userRoutes.isLoggedIn, articleRoutes.setToUnread)
app.post('/articles/save/favorite',userRoutes.isLoggedIn, articleRoutes.addToFavorites)
app.post('/articles/remove/favorite',userRoutes.isLoggedIn, articleRoutes.removeFromFavorites)
app.get('/favorite/articles',userRoutes.isLoggedIn, articleRoutes.getFavoriteArticles)
app.post('/move/feeds',userRoutes.isLoggedIn, feedRoutes.moveToFolder)

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