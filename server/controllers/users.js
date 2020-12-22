const User = require('../models/User');
const Validator = require('../validators');

module.exports.login = (username, password, done) => {
      console.log(`POST /login`);

        const Joi = require('@hapi/joi');

        const schema = Joi.object({
            username: Joi.string().min(2).required(),
            password: Joi.string().min(8).required()
        });

        const validator = schema.validate({username: username,password: password});

        if(validator.error){
            res.status(400).json({error: validator.error.details[0].message});
            return;
        }

        User.findOneByUsername(validator.value.username)
        .then(user => {
            if(user == null)
                return done(null, false); //Incorrect username

            user.validPassword(validator.value.password)
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
        const Joi = require('@hapi/joi');

        const schema = Joi.object({
            username: Joi.string().min(2).required(),
            email: Joi.string().email.required(),
            password: Joi.string().min(8).required()
        });

        const validator = schema.validate({username: username,password: password});

        if(validator.error){
            res.status(400).json({error: validator.error.details[0].message});
            return;
        }

        const user = new User();
        user.username = validator.value.username;
        user.email = validator.value.email;
        user.password = await User.createPassword(validator.value.password);

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

        const Joi = require('@hapi/joi');

        const schema = Joi.object({
            articleDeleteInterval: Joi.number().required(),
            articleScanInterval: Joi.number().required(),
            darkmode: Joi.number().required()
        });

        const validator = schema.validate({
            articleDeleteInterval: req.body.articleDeleteInterval,
            articleScanInterval: req.body.articleScanInterval,
            darkmode: req.body.darkmode
        });

        if(validator.error){
            res.status(400).json({error: validator.error});
            return;
        }

        await user.updatePreference(validator.value.articleDeleteInterval, validator.value.articleScanInterval, validator.value.darkmode);

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

module.exports.passwordResetRequest = async (req,res) => {
    try{
        const validator = Validator.email(req.body.email);

        if(validator.error){
            res.status(400).json({error: validator.error[0].message});
            return;
        }

        const user = await User.findOneByEmail(validator.value.email);

        if(user == null){
            res.sendStatus(404);
            return;
        }

        const token = await user.registerPasswordReset();
        const Mailer = require('../models/Mailer');
        const mailer = new Mailer();
        const {passwordResetMail} = require('../mail/templates');

        mailer.send({
            to: user.email,
            subject: "Password reset - Newsprint",
            plainText: `Hi, ${user.username}There was a requested to change your password. If you did not make this request, 
                        just ignor this email. Otherwise please open the link to change your password.
                        https://beta.newsprint.app/#/account/password-reset/token/${token}
                        `,
            html: passwordResetMail(user.username, `https://beta.newsprint.app/#/account/password-reset/token/${token}`)
        }); 

        res.sendStatus(200);
    }
    catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}

module.exports.passwordReset = async (req,res) => {
    try{
        const validator = Validator.email(req.body.email);

        if(validator.error){
            res.status(400).json({error: validator.error[0].message});
            return;
        }

        const user = await User.findOneByEmail(validator.value.email);

        if(user == null){
            res.sendStatus(404);
            return;
        }

        const result = await user.checkToken(req.body.token);

        if(result !== null){
            await user.updatePassword(req.body.password);
            await user.setTokenToUsed(req.body.token);
            res.sendStatus(200);
        }
        else{
            res.sendStatus(401)
        }
            

    }
    catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}

module.exports.validatePasswordResetToken = async (req,res) => {
    try{
        const validator = Validator.email(req.body.email);

        if(validator.error){
            res.status(400).json({error: validator.error[0].message});
            return;
        }

        const user = await User.findOneByEmail(validator.value.email);

        if(user === null){
            res.sendStatus(404);
            return;
        }

        const validatorToken = Validator.token(req.body.token);

        if(validatorToken.error){
            res.status(400).json({error: validatorToken.error[0].message});
            return;
        }

        const result = await user.checkToken(validatorToken.value.token);

        if(result){
            res.sendStatus(200);
        }
        else
            res.sendStatus(401)
        
    }
    catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}