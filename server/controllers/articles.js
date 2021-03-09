const Article = require('../models/article');
const Validator = require('../validators');

module.exports.findOne = async (req,res) => {
      try{
            console.log(`GET /articles/${req.params.id}`);

            const validator = Validator.id(req.params.id);

            if(validator.error){
                res.status(400).json({error: validator.error.details[0].message});
                return;
            }

            const article = await Article.findOne(validator.value.id);

            if(article === null){
                res.sendStatus(404);
                return;
            }

            if(req.user.id !== article.user){
                res.sendStatus(401);
                return;
            }

            res.json(article);
        }
        catch(error){
            console.log(error);
            res.sendStatus(500);
        }
}
module.exports.unreadArticlesCount = async (req,res) => {
      try{
            console.log(`GET /articles/count/unread`);

            const articleCount = await Article.getCountAllUnreadArticles(req.user.id);

            if(articleCount === null){
                res.sendStatus(500);
                return;
            }

            res.json(articleCount);
      }
      catch(error){
          console.log(error);
          res.sendStatus(500);
      }
}
module.exports.unreadArticles = async (req,res) => {
    try{
        console.log(`GET /unread/articles`);
        const Joi = require('@hapi/joi');

        const offset = parseInt(req.query.offset);
        const max = parseInt(req.query.max);

        const schema = Joi.object({
            offset: Joi.number(),
            max: Joi.number()
        });

        const validator = schema.validate({offset: offset,max: max});

        if(validator.error){
            res.status(400).json({error: validator.error.details[0].message});
            return;
        }

        const articleCount = await Article.getAllUnreadArticles(req.user.id, validator.value.offset, validator.value.max);

        if(articleCount === null){
            res.sendStatus(404);
            return;
        }

        res.json(articleCount);
    }
    catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}
module.exports.setToRead = async (req,res) => {
    try{
        console.log(`GET /articles/set/read`);

        const validator = Validator.id(req.body.id);

        if(validator.error){
            res.status(400).json({error: validator.error.details[0].message});
            return;
        }

        const article = await Article.findOne(validator.value.id);

        if(article === null){
            res.sendStatus(404);
            return;
        }

        if(req.user.id !== article.user){
            res.sendStatus(401);
            return;
        }

        article.setToRead();

        res.json(article);
    }
    catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}
module.exports.setToUnread = async (req,res) => {
    try{
        console.log(`PUT /articles/set/unread`);

        const validator = Validator.id(req.body.id);

        if(validator.error){
            res.status(400).json({error: validator.error.details[0].message});
            return;
        }

        const article = await Article.findOne(validator.value.id);

        if(article === null){
            res.sendStatus(404);
            return;
        }

        if(req.user.id !== article.user){
            res.sendStatus(401);
            return;
        }

        await article.setToUnread();

        res.json(article);
    }
    catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}
module.exports.addToFavorites = async (req,res) => {
    try{
        console.log(`POST /articles/save/favorites`);

        const validator = Validator.id(req.body.id);

        if(validator.error){
            res.status(400).json({error: validator.error.details[0].message});
            return;
        }

        const article = await Article.findOne(validator.value.id);

        if(article === null){
            res.sendStatus(404);
            return;
        }

        if(req.user.id !== article.user){
            res.sendStatus(401);
            return;
        }

        article.AddToFavorites(req.user.id);

        res.json(article);
    }
    catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}
module.exports.removeFromFavorites = async (req,res) => {
    try{
        console.log(`POST /articles/remove/favorites`);

        const validator = Validator.id(req.body.id);

        if(validator.error){
            res.status(400).json({error: validator.error.details[0].message});
            return;
        }

        const article = await Article.findOne(validator.value.id);

        if(article === null){
            res.sendStatus(404);
            return;
        }

        if(req.user.id !== article.user){
            res.sendStatus(401);
            return;
        }

        article.removeFromFavorites(req.user.id);

        res.json(article);
    }
    catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}
module.exports.getFavoriteArticles = async (req,res) => {
    try{
        console.log(`GET /favorites/articles?offset=${req.query.offset}&max=${req.query.max}`);

        const Joi = require('@hapi/joi');

        const schema = Joi.object({
            offset: Joi.number().required(),
            max: Joi.number().required()
        });

        const validator = schema.validate({offset: req.query.offset,max: req.query.max});

        if(validator.error){
            res.status(400).json({error: validator.error.details});
            return;
        }

        const articles = await Article.getFavoritesLimit(req.user.id,validator.value.offset, validator.value.max);

        if(articles === null){
            res.sendStatus(500);
            return;
        }

        res.json(articles);
    }
    catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}
module.exports.getCountNewArticlesToday = async (req,res) => {
    try{
        console.log(`GET /articles/count/newtoday`);

        const articleCount = await Article.getCountNewArticlesToday(req.user.id);

        if(articleCount === null){
            res.sendStatus(500);
            return;
        }

        res.json(articleCount);
    }
    catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}
module.exports.getNewArticlesToday = async (req,res) => {
    try{
        console.log(`GET /articles/count/newtoday`);

        const Joi = require('@hapi/joi');

        const schema = Joi.object({
            offset: Joi.number().required(),
            max: Joi.number().required()
        });

        const validator = schema.validate({offset: req.query.offset,max: req.query.max});

        if(validator.error){
            res.status(400).json({error: validator.error.details});
            return;
        }

        const articles = await Article.getNewArticlesToday(req.user.id, validator.value.offset, validator.value.max);

        if(articles === null){
            res.sendStatus(500);
            return;
        }

        res.json(articles);
    }
    catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}