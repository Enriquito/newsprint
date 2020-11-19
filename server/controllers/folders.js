const Feed = require('../models/feed')
const Folder = require('../models/folder')

module.exports.findOne = async (req,res) => {
      try{
          console.log(`GET /feed/${req.params.id}`);
  
      //     const validator = Validator.ValidateID(req.params.id);
  
      //     if(validator.error){
      //         res.status(400).json({error: validator.error.details[0].message});
      //         return;
      //     }
  
          const folder = await Folder.findOne(req.params.id);
  
          if(folder === null){
              res.sendStatus(404);
              return;
          }

          await folder.getFeeds();
  
          res.json(folder);
      }
      catch(error){
          console.log(error);
          res.sendStatus(500);
      }
}
module.exports.findFoldersByUser = async (req,res) => {
      try{
          console.log(`GET /folders/user/${req.params.id}`);
  
      //     const validator = Validator.ValidateID(req.params.id);
  
      //     if(validator.error){
      //         res.status(400).json({error: validator.error.details[0].message});
      //         return;
      //     }
  
          const folders = await Folder.findAllByUser(req.params.id);
  
          if(folders === null){
              res.sendStatus(404);
              return;
          }
  
          res.json(folders);
      }
      catch(error){
          console.log(error);
          res.sendStatus(500);
      }
}