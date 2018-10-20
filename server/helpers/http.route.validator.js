const Joi = require('joi');

module.exports = {
    validateParam: (schema, name)=>{
        return (req, res, next) => {
            console.log('req.params', req.params);
            next();
        }
    },
    schemas: {
        idSchema: Joi.object().keys({
            userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        })
    }
}