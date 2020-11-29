const History = require('../models/history');

module.exports.getAll = async (req,res) => {
    try{
        console.log(`GET /history`);

        const arr = await History.getAll(1);

        if(arr === null){
            res.sendStatus(500);
            return;
        }

        res.json(arr);
    }
    catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}

module.exports.create = async (req,res) => {
    try{
        console.log(`POST /history`);
        const userId = 1;
        const maxHistoryRows = 25;
        const rowsInDB = await History.getHistoryItemsCount(userId);

        console.log(rowsInDB);

        if(rowsInDB === maxHistoryRows)
            await History.destroyNextInLine(userId);

        await History.create(1, req.body.article);

        res.sendStatus(201);
    }
    catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}