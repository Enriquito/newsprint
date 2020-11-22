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
        await feed.getArticles();

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

        await feed.getData(req.body.feedUrl);
        await feed.create();
        await feed.createArticles();

        res.status(201).json(feed);
    }
    catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}