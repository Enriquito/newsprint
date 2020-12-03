const User = require('../models/User');

module.exports.login = (username, password, done) => {
      console.log(`POST /login`);
  
      User.findOneByUsername(username)
        .then(user => {
            if(user == null)
                return done(null, false); //Incorrect username or password
  
            user.validPassword(password)
            .then(result => {
                if(!result)
                    return done(null, false); //Incorrect username or password
                else{
                  return done(null, user);
                }
  
            })
            .catch(error => {
                console.log(error);
                return error;
            })
        })
        .catch(error => {
            console.log(error);
            done(error);
        })
  }
  
  module.exports.isLoggedIn = (req, res, next) => {
      if(req.user){
            next();
      }
      else{
          res.sendStatus(401);
      }
  
  }
  
  module.exports.current = (req,res) => {
      if(req.user)
          res.json(req.user);
      else
          res.sendStatus(401);
  }