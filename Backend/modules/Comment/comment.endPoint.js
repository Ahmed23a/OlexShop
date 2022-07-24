

const {roles} = require("../../Middleware/auth")
const endPoint ={

   addComment: [roles.User,roles.Admin],
   addReply :[roles.User , roles.Admin],
   updateComment : [roles.User, roles.Admin],
   deleteComment : [roles.User, roles.Admin],
   likeComment  :[roles.User, roles.Admin]

    
}

module.exports = endPoint
