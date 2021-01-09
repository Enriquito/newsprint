const Feed = require('../models/feed')
const Folder = require('../models/folder')
const Validator = require('../validators');

module.exports.findOne = async (req,res) => {
      try{
          console.log(`GET /feed/${req.params.id}`);

          const validator = Validator.id(req.params.id);

          if(validator.error){
              res.status(400).json({error: validator.error.details[0]});
              return;
          }

          const folder = await Folder.findOne(validator.value.id);

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

          const folders = await Folder.findAllByUser(req.user.id);

          if(folders === null){
              res.json([]);
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

        const Joi = require('@hapi/joi');

        const schema = Joi.object({
            name: Joi.string().min(2).max(15).required(),
        });

        const validator = schema.validate({name: req.body.name});

        if(validator.error){
            res.status(400).json({error: validator.error.details});
            return;
        }

        const folder = new Folder();

        folder.name = validator.value.name;
        folder.user = req.user.id;

        await folder.create();

        res.status(201).json(folder);
    }
    catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}

module.exports.update = async (req,res) => {
    try{
        console.log(`PUT /folders/`);
        const Joi = require('@hapi/joi');

        const schema = Joi.object({
            id: Joi.number().required(),
            name: Joi.string().min(2).max(15).required(),
            showOrder: Joi.number().required()
        });

        const validatorFolderData = schema.validate(req.body);

        if(validatorFolderData.error){
            res.status(400).json({error: validatorFolderData.error.details});
            return;
        }

        const folder = await Folder.findOne(validatorFolderData.value.id);

        if(folder === null){
            res.sendStatus(404);
            return;
        }

        if(req.body.showOrder === 0){
            res.sendStatus(400);
        }

        folder.name = validatorFolderData.value.name;
        folder.showOrder = validatorFolderData.value.showOrder;

        folder.update();

        res.json(folder);
    }
    catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}

module.exports.delete = async (req,res) => {
    try{
        console.log(`DELETE /folders/${req.params.id}`);

        const validator = Validator.id(req.params.id);

        if(validator.error){
            res.status(400).json({error: validator.error.details[0]});
            return;
        }

        const folder = await Folder.findOne(validator.value.id);

        if(folder === null){
            res.sendStatus(404);
            return;
        }

        await folder.getFeeds();

        for(let i = 0; i < folder.feeds.length; i++){
            const feed = folder.feeds[i];

            await feed.delete();
        }

        await folder.delete();

        res.json(folder);
    }
    catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}