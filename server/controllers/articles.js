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

          const articleCount = await Article.getCountAllUnreadArticles();

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
        console.log(`GET /unread/articles/${req.params.minLimit}/${req.params.maxLimit}`);

        const articleCount = await Article.getAllUnreadArticles(parseInt(req.params.minLimit),parseInt(req.params.maxLimit));

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
            res.sendStatus(500);
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
        console.log(`GET /articles/set/read`);

        const article = await Article.findOne(req.body.id);

        if(article === null){
            res.sendStatus(500);
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

