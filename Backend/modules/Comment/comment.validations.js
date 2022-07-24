


const Joi = require("joi")



const addComment = {

    params:Joi.object().required().keys({
        productID : Joi.string().required().max(24).min(24)       
    }),
    
   
    body:Joi.object().required().keys({
       body:Joi.string().required().max(250)
    }),
}

const addReply = {

    params:Joi.object().required().keys({
        productID : Joi.string().required().max(24).min(24),
        commentID : Joi.string().required().max(24).min(24)       
    }),
    
   
    body:Joi.object().required().keys({
       body:Joi.string().required().max(250)
    }),
}

const updateComment = {

    params:Joi.object().required().keys({
        productID : Joi.string().required().max(24).min(24),
        commentID : Joi.string().required().max(24).min(24)       
    }),
    
   
    body:Joi.object().required().keys({
       body:Joi.string().required().max(250)
    }),
}

const deleteComment = {
    params:Joi.object().required().keys({
        productID : Joi.string().required().max(24).min(24),
        commentID : Joi.string().required().max(24).min(24)       
    }),
}
const likeComment = {
    params:Joi.object().required().keys({
        productID : Joi.string().required().max(24).min(24),
        commentID : Joi.string().required().max(24).min(24)       
    }),
}


module.exports = 
{
    addComment,
    addReply,
    updateComment,
    deleteComment,
    likeComment

}