
const {roles} = require("../../Middleware/auth")

const endPoint ={

 signOut : [roles.User]
}

module.exports = endPoint
