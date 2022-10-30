const Joi = require('Joi')

const emailValidation = (data) => {
    const schema = Joi.object().keys({
        from: Joi.string().min(6).required().email(),
        to: Joi.string().min(6).required().email(),
        msg: Joi.string().required(),
        subject: Joi.string().required(),
        
    })

    // VALIDATE USER INPUT DATA
    return schema.validate(data)
}

module.exports = {emailValidation}