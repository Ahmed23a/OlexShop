
const {roles} = require("../../Middleware/auth")

const endPoint ={

   addProduct: [roles.User , roles.Admin],
   updateProduct : [roles.User],
   deleteProduct :[roles.User, roles.Admin],
   softDelete : [roles.User, roles.Admin],
   hideProduct: [roles.User],
   likeProduct :[roles.User,roles.Admin]
 
}

module.exports = endPoint
