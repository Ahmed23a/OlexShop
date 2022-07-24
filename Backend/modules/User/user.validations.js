const Joi  = require("joi")



const updateProfile = {

    body:Joi.object().required().keys({
        email: Joi.string().email(),
        firstName: Joi.string().pattern(new RegExp(/[A-Z][a-zA-Z][^#&<>\"~;$^%{}?]{2,20}$/)).messages({

            'string.empty': 'please fill in u name',
            'any.required': 'please send  u name',
            'string.pattern.base': 'please enter valid name char',
        }),
        lastName: Joi.string().pattern(new RegExp(/[A-Z][a-zA-Z][^#&<>\"~;$^%{}?]{2,20}$/)).messages({

            'string.empty': 'please fill in u name',
            'any.required': 'please send  u name',
            'string.pattern.base': 'please enter valid name char',
        }),
        
    }),
    
    
}

const deleteUser = {

    params:Joi.object().required().keys({
        userID : Joi.string().required()        
    }),
    
    
}

const updatePassword = {

   
    body:Joi.object().required().keys(
        {
            newPassword: Joi.string().required().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
            cPassword: Joi.string().valid(Joi.ref('newPassword')).required()
        }
    )
    
}


module.exports = {

    updateProfile,
    deleteUser,
    updatePassword

}