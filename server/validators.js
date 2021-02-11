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
        displayName: Joi.string().allow(null),
        title: Joi.string(),
        description: Joi.string(),
        iconUrl: Joi.string(),
        link: Joi.string(),
        language: Joi.string(),
        lastBuildDate: Joi.string(),
        lastScanDate: Joi.string(),
        folderId: Joi.number().required()
    });

    return schema.validate(data);
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
module.exports.createUser = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(2).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required()
    });

    return schema.validate({username: data.username,password: data.password,email: data.email});
}
module.exports.updateUserPreferences = (data) => {
    const schema = Joi.object({
        articleDeleteInterval: Joi.number().required(),
        articleScanInterval: Joi.number().required(),
        setArticlesReadOnNextPage: Joi.boolean().required(),
        darkmode: Joi.number().required()
    });

    return schema.validate({
        articleDeleteInterval: data.articleDeleteInterval,
        articleScanInterval: data.articleScanInterval,
        setArticlesReadOnNextPage: data.setArticlesReadOnNextPage,
        darkmode: data.darkmode
    });
}
module.exports.login = (username, password) => {
    const schema = Joi.object({
        username: Joi.string().min(2).max(30).required(),
        password: Joi.string().min(8).required()
    });

    return schema.validate({
        username: username,
        password: password
    });
}
module.exports.moveFolder = (data) => {
    const schema = Joi.object({
        feedId: Joi.number().required(),
        from: Joi.number().required(),
        to: Joi.number().required()
    });

    return schema.validate({
        feedId: data.feedId,
        from: data.from,
        to: data.to
    });
}