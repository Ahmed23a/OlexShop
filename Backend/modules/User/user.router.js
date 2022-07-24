const router = require("express").Router()
const { auth } = require("../../Middleware/auth")
const validation = require("../../Middleware/validation")
const  myMulter  = require("../../services/multer")
const userController = require("./controller/updateProfile")
const endPoint = require("./user.endPoint")
const userEndPoint = require('./user.endPoint')
const userValidator = require("./user.validations")





//Update Profile
router.patch("/updateProfile",auth(userEndPoint.UpdateProfile),
validation(userValidator.updateProfile),userController.updateProfile)

//Update Password 
router.patch("/updatePassword",auth(userEndPoint.UpdateProfile),
validation(userValidator.updatePassword),userController.updatePassword)


//Delete User 
router.delete("/delete/:userID", auth(userEndPoint.DeletUser),
validation(userValidator.deleteUser), userController.deleteUser)

//Delete user by Admin
router.delete("/deleteByAdmin/:userID", auth(userEndPoint.DeleteByAdmin),
validation(userValidator.deleteUser), userController.softDeleteByAdmin)

//Add profile 
router.patch("/profilePic", myMulter.myMulter('users/profilePic',
myMulter.validationMethod.image).array('image',2),myMulter.HME,
auth(userEndPoint.AddProfilePic) ,userController.updateProfilePic)

//Add cover Pictures
router.patch("/coverPic", myMulter.myMulter('users/coverPic',
myMulter.validationMethod.image).array('image', 4),myMulter.HME,
auth(endPoint.AddProfilePic), userController.updateProfileCoverPic)


// Get users with their info 
router.get('/', userController.getUsers)

module.exports = router