const Joi = require("joi")






const addProduct = {

    body:Joi.object().required().keys({

        title: Joi.string().required().max(150),
        price: Joi.number().required(),
        description: Joi.string()

    })
}

const updateProduct = {

    body:Joi.object().required().keys({

        title: Joi.string().required().max(150),
        price: Joi.number().required(),
      

    }),
    params:Joi.object().required().keys({
        productID:Joi.string().required().max(24).min(24)
    })
}

const  deleteProduct =
{
    params:Joi.object().required().keys({
        productID:Joi.string().required().max(24).min(24)
    })
}
const  softDelete =
{
    params:Joi.object().required().keys({
        productID:Joi.string().required().max(24).min(24)
    })
}

const  hideProduct =
{
    params:Joi.object().required().keys({
        productID:Joi.string().required().max(24).min(24)
    })
}

const  likeProduct =
{
    params:Joi.object().required().keys({
        productID:Joi.string().required().max(24).min(24)
    })
}
module.exports = 
{
    addProduct,
    updateProduct,
    deleteProduct,
    softDelete,
    hideProduct,
    likeProduct
    
}