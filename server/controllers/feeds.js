const Feed = require('../models/feed')

module.exports.findOne = async (req,res) => {
    try{
        console.log(`GET /feeds/${req.params.id}`);
        const max = parseInt(req.query.max) || 10;
        const offset = parseInt(req.query.offset) || 0;

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

        await feed.getArticles(max, offset);

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
    // const validator = Validator.NewBlockData(req.body);

    // if(validator.error){
    //     res.status(400).json({error: validator.error});
    //     return;
    // }

    try{
        const feed = new Feed();
        feed.user = req.user.id;

        await feed.getData(req.body.feedUrl);
        await feed.create();
        await feed.createArticles();
        await feed.addToFolder(req.body.folderId);

        res.status(201).json(feed);
    }
    catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}
module.exports.moveToFolder = async (req,res) => {
    console.log(`POST move/feeds/`);
    // const validator = Validator.NewBlockData(req.body);

    // if(validator.error){
    //     res.status(400).json({error: validator.error});
    //     return;
    // }

    try{
        const feed = await Feed.findOne(req.body.feedId);

        if(feed === null){
            res.sendStatus(404);
            return;
        }

        if(req.user.id !== feed.user){
            res.sendStatus(401);
            return;
        }

        await feed.moveToFolder(req.body.from, req.body.to);

        res.status(201);
    }
    catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}
module.exports.update = async (req,res) => {
    console.log(`PUT feeds/`);
    // const validator = Validator.NewBlockData(req.body);

    // if(validator.error){
    //     res.status(400).json({error: validator.error});
    //     return;
    // }

    try{
        const feed = await Feed.findOne(req.body.feed.id);

        if(feed === null){
            res.sendStatus(404);
            return;
        }

        if(req.user.id !== feed.user){
            res.sendStatus(401);
            return;
        }

        for (const [property ,value] of Object.entries(req.body.feed)){
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
    // const validator = Validator.NewBlockData(req.body);

    // if(validator.error){
    //     res.status(400).json({error: validator.error});
    //     return;
    // }

    try{
        const feed = await Feed.findOne(req.params.id);

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