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

        if(req.body.displayName)
            feed.displayName = req.body.displayName

        await feed.getData(req.body.feedUrl);
        await feed.create();
        await feed.createArticles();

        if(req.body.folderId === undefined)
            await feed.addToFolder(1);
        else
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

        await feed.moveToFolder(req.body.from, req.body.to);

        res.status(201);
    }
    catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}