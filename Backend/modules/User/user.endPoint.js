
const {roles} = require("../../Middleware/auth")
const endPoint ={

   UpdateProfile: [roles.User],
   DeletUser : [roles.Admin , roles.User],
   DeleteByAdmin : [roles.Admin],
   AddProfilePic : [roles.User , roles.Admin]
    
}

module.exports = endPoint
