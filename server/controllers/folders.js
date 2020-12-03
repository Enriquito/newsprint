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
          console.log(`GET /folders/`);

      //     const validator = Validator.ValidateID(req.params.id);

      //     if(validator.error){
      //         res.status(400).json({error: validator.error.details[0].message});
      //         return;
      //     }

          const folders = await Folder.findAllByUser(req.user.id);

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

module.exports.create = async (req,res) => {
    console.log(`POST /folders/`);
    try{


    //     const validator = Validator.ValidateID(req.params.id);

    //     if(validator.error){
    //         res.status(400).json({error: validator.error.details[0].message});
    //         return;
    //     }

        const folder = new Folder();

        folder.name = req.body.name;
        folder.user = req.user.id;

        await folder.create();

        res.status(201).json(folder);
    }
    catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}