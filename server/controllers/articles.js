const Article = require('../models/article');

module.exports.findOne = async (req,res) => {
      try{
          console.log(`GET /articles/${req.params.id}`);

      //     const validator = Validator.ValidateID(req.params.id);

      //     if(validator.error){
      //         res.status(400).json({error: validator.error.details[0].message});
      //         return;
      //     }

            const article = await Article.findOne(req.params.id);

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

        const offset = parseInt(req.query.offset);
        const max = parseInt(req.query.max);

        const articleCount = await Article.getAllUnreadArticles(req.user.id, offset, max);

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
module.exports.setToRead = async (req,res) => {
    try{
        console.log(`GET /articles/set/read`);

        const article = await Article.findOne(req.body.id);

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
        console.log(`PUT /articles/set/read`);

        const article = await Article.findOne(req.body.id);

        if(article === null){
            res.sendStatus(404);
            return;
        }

        if(req.user.id !== article.user){
            res.sendStatus(401);
            return;
        }

        article.setToUnread();

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

        const article = await Article.findOne(req.body.id);

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

        const article = await Article.findOne(req.body.id);

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
        console.log(`GET /favorites/articles`);

        const articles = await Article.getFavorites(req.user.id);

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

