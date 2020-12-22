const Feed = require('../models/feed');
const Validator = require('../validators');

module.exports.findOne = async (req,res) => {
    try{
        console.log(`GET /feeds/${req.params.id}`);
        const Joi = require('@hapi/joi');
        const max = parseInt(req.query.max) || 10;
        const offset = parseInt(req.query.offset) || 0;

        const schema = Joi.object({
            offset: Joi.number(),
            max: Joi.number()
        });

        const validatorOM = schema.validate({offset: offset,max: max});
        const validator = Validator.id(req.params.id);

        if(validator.error){
            res.status(400).json({error: validator.error.details[0].message});
            return;
        }

        const feed = await Feed.findOne(validator.value.id);

        if(feed === null){
            res.sendStatus(404);
            return;
        }

        await feed.getArticles(validatorOM.value.max, validatorOM.value.offset);

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
module.exports.create = async (req,res) => {
    console.log(`POST feeds/`);

    const validator = Validator.addFeed(req.body);

    if(validator.error){
        res.status(400).json({error: validator.error});
        return;
    }

    try{
        const feed = new Feed();
        feed.user = req.user.id;

        await feed.getData(validator.value.feedUrl);
        await feed.create();
        await feed.createArticles();
        await feed.addToFolder(validator.value.folderId);

        res.status(201).json(feed);
    }
    catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}
module.exports.moveToFolder = async (req,res) => {
    console.log(`POST move/feeds/`);
    const Joi = require('@hapi/joi');

    const schema = Joi.object({
        feedId: Joi.number().required(),
        from: Joi.number().required(),
        to: Joi.number().required()
    });

    const validator = schema.validate({
        feedId: req.body.feedId,
        from: req.body.from,
        to: req.body.to
    });

    if(validator.error){
        res.status(400).json({error: validator.error});
        return;
    }

    try{
        const feed = await Feed.findOne(validator.value.feedId);

        if(feed === null){
            res.sendStatus(404);
            return;
        }

        if(req.user.id !== feed.user){
            res.sendStatus(401);
            return;
        }

        await feed.moveToFolder(validator.value.from, validator.value.to, req.user.id);

        res.status(201);
    }
    catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}
module.exports.update = async (req,res) => {
    console.log(`PUT feeds/`);
    const validator = Validator.updateFeed(req.body.feed);

    if(validator.error){
        res.status(400).json({error: validator.error});
        return;
    }

    try{
        const feed = await Feed.findOne(validator.value.id);

        if(feed === null){
            res.sendStatus(404);
            return;
        }

        if(req.user.id !== feed.user){
            res.sendStatus(401);
            return;
        }

        for (const [property ,value] of Object.entries(validator.value)){
            switch(property){
                case "displayName" :
                    feed.displayName = value;
                    break;
                case "title" :
                    feed.title = value;
                    break;
                case "description" :
                    feed.description = value;
                    break;
                case "iconUrl" :
                    feed.iconUrl = value;
                    break;
                case "feedUrl" :
                    feed.feedUrl = value;
                    break;
                case "link" :
                    feed.link = value;
                    break;
                case "language" :
                    feed.language = value;
                    break;
                case "lastBuildDate" :
                    feed.lastBuildDate = value;
                    break;
                case "lastScanDate:" :
                    feed.lastScanDate = value;
                    break;
                case "folderId:" :{
                    if(feed.folderId !== value){
                        await feed.moveToFolder(feed.folderId, value);
                        feed.folderId = value;
                    }
                    break;
                }
            }
        }

        const result = await feed.update();

        if(result === null){
            res.sendStatus(400);
            return;
        }

        res.json(result);
    }
    catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}
module.exports.delete = async (req,res) => {
    console.log(`DELETE /delete`);
    
    const validator = Validator.id(req.params.id);

    if(validator.error){
        res.status(400).json({error: validator.error.details[0].message});
        return;
    }

    try{
        const feed = await Feed.findOne(validator.value.id);

        if(feed === null){
            res.sendStatus(404);
            return;
        }

        if(req.user.id !== feed.user){
            res.sendStatus(401);
            return;
        }

        await feed.delete();

        res.status(200).json(feed);
    }
    catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}