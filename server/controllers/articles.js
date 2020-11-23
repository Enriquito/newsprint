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
module.exports.unreadArticles = async (req,res) => {
      try{
          console.log(`GET /articles/unrefad`);
      //     const validator = Validator.ValidateID(req.params.id);
  
      //     if(validator.error){
      //         res.status(400).json({error: validator.error.details[0].message});
      //         return;
      //     }

          const articleCount = await Article.getAllUnreadArticles();
  
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
