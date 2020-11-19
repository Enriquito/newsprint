const Feed = require('../models/feed')

module.exports.findOne = async (req,res) => {
      try{
          console.log(`GET /feed/${req.params.id}`);
  
      //     const validator = Validator.ValidateID(req.params.id);
  
      //     if(validator.error){
      //         res.status(400).json({error: validator.error.details[0].message});
      //         return;
      //     }
  
          const feed = await Feed.findOne(req.params.id);
  
          if(feed === null){
              res.sendStatus(404);
              return;
          }
  
          res.json(feed);
      }
      catch(error){
          console.log(error);
          res.sendStatus(500);
      }
  }