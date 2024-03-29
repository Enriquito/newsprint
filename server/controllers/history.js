const History = require('../models/history');
const Validator = require('../validators');

module.exports.getAll = async (req,res) => {
    try{
        console.log(`GET /history`);

        const arr = await History.getAll(req.user.id);

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

module.exports.getLimit = async (req,res) => {
    try{
        console.log(`GET /history`);

        const Joi = require('@hapi/joi');

        const schema = Joi.object({
            offset: Joi.number().required(),
            max: Joi.number().required()
        });

        const validator = schema.validate({offset: req.query.offset,max: req.query.max});

        if(validator.error){
            res.status(400).json({error: validator.error.details});
            return;
        }

        const arr = await History.getLimit(req.user.id, validator.value.offset, validator.value.max);

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
        const maxHistoryRows = 25;
        const rowsInDB = await History.getHistoryItemsCount(req.user.id);

        const validator = Validator.id(req.body.id);

        if(validator.error){
            res.status(400).json({error: validator.error.details[0]});
            return;
        }

        if(rowsInDB === maxHistoryRows)
            await History.destroyNextInLine(req.user.id);

        await History.create(req.user.id, validator.value.id);

        res.sendStatus(201);
    }
    catch(error){
        console.log(error);
        res.sendStatus(500);
    }
}