const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const passport = require('passport');
const cors = require('cors');
const LocalStrategy = require('passport-local').Strategy;
const session = require('cookie-session');
const User = require('./models/user');

// Controllers
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
    allowedHeaders: "content-type,X-Requested-With", //Zo niet probeer: "Origin,Accept,Content-Type,X-Requested-With"
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
            domain: '.newsprint.app',
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

require('./routes')(app,passport);

app.use(async (req, res, next) => {
      res.sendStatus(404);
      next();
});

app.listen(process.env.PORT, () => {
      console.log(`listening on port ${process.env.PORT}`);
});