const Joi = require('@hapi/joi');

module.exports.id = (id) =>{
    const schema = Joi.object({
        id: Joi.number()
    });

    console.log(id);

    return schema.validate({id: id});
}
module.exports.addFeed = (data) => {
    const schema = Joi.object({
        feedUrl: Joi.string().required(),
        folderId: Joi.number().required()
    });

    return schema.validate({feedUrl: data.feedUrl, folderId: data.folderId});
}
module.exports.updateFeed = (data) => {
    const schema = Joi.object({
        id: Joi.number().required(),
        displayName: Joi.string(),
        title: Joi.string(),
        description: Joi.string(),
        iconUrl: Joi.string(),
        link: Joi.string(),
        language: Joi.string(),
        lastBuildDate: Joi.string(),
        lastScanDate: Joi.string(),
        folderId: Joi.number()
    });

    return schema.validate({
        id: data.id,
        displayName: data.displayName,
        title: data.title,
        description: data.description, 
        iconUrl: data.iconUrl,
        link: data.link, 
        language: data.language,
        lastBuildDate: data.lastBuildDate,
        lastScanDate: data.lastScanDate,
        folderId: data.folderId
    });
}
module.exports.email = (email) => {
    const schema = Joi.object({
        email: Joi.string().email().required()
    });

    return schema.validate({email: email});
}
module.exports.token = (token) => {
    const schema = Joi.object({
        token: Joi.string().required()
    });

    return schema.validate({token: token});
}