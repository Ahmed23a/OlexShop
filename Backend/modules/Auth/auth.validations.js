const { object, string } = require("joi")
const Joi = require("joi")


const signUp =
 {

    body: Joi.object().required().keys({
        firstName: Joi.string().required().pattern(new RegExp(/[A-Z][a-zA-Z][^#&<>\"~;$^%{}?]{2,20}$/)).messages({

            'string.empty': 'please fill in u name',
            'any.required': 'please send  u name',
            'string.pattern.base': 'please enter valid name char',
        }),
        email: Joi.string().required().email(),
        password: Joi.string().required().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
        cPassword: Joi.string().valid(Joi.ref('password')).required()

    })
}

const signIn = 
{
    body: Joi.object().required().keys({        
        email: Joi.string().required().email(),
        password: Joi.string().required().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
        })
}

const confirmEmail = 
{
    params:Joi.object().required().keys({
        token:Joi.string().required()

    })
}
const sendCode = 
{
    body:Joi.object().required().keys({
        email: Joi.string().required().email(),

    })
}

const forgetPassword =
 {

    body: Joi.object().required().keys({
        
        email: Joi.string().required().email(),
        code: Joi.string().required(),
        newPassword: Joi.string().required().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
        cPassword: Joi.string().valid(Joi.ref('newPassword')).required()

    })
}

module.exports = 
{
    signUp,
    signIn,
    confirmEmail,
    sendCode,
    forgetPassword

}