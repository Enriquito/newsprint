const User = require('../models/User');

module.exports.login = (username, password, done) => {
      console.log(`POST /login`);

      User.findOneByUsername(username)
        .then(user => {
            if(user == null)
                return done(null, false); //Incorrect username

            user.validPassword(password)
            .then(result => {
                if(!result)
                    return done(null, false); //Incorrect password
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
          res.json(null);
}

module.exports.create = async (req,res) => {
    try{
        const user = new User();
        user.username = req.body.username;
        user.email = req.body.email;
        user.password = await User.createPassword(req.body.password);

        await user.create();

        res.sendStatus(201);
    }
    catch(error){
        res.sendStatus(500);
        console.log(error);
    }
}

module.exports.updatePreference = async (req, res) => {
    try{
        const user = new User();
        user.id = req.user.id;

        await user.updatePreference(req.body.articleDeleteInterval, req.body.articleScanInterval, req.body.darkmode);

        res.sendStatus(200);
    }
    catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}

module.exports.getPreference = async (req,res) => {
    try{
        const user = new User();
        user.id = req.user.id;

        const result = await user.getPreference();

        res.json(result);
    }
    catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}