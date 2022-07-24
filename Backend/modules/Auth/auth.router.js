const router = require("express").Router()
const authController = require("./controller/registration")
const validation = require("../../Middleware/validation")
const authValidator = require("./auth.validations")
const { auth } = require("../../Middleware/auth")
const endPoint = require("./auth.endPoint")


//SignUp
router.post("/signup", validation(authValidator.signUp),authController.signUp)

//Confirm Email
router.get("/confirmEmail/:token", validation(authValidator.confirmEmail),authController.confirmEmail)

//Signin
router.post("/signin", validation(authValidator.signIn),authController.signin)

//SendCode
router.post("/sendCode",validation(authValidator.sendCode) , authController.sendCode)

//forget password
router.patch("/forgetPassword", validation(authValidator.forgetPassword), authController.forgetPassword)

router.patch("/signout",auth(endPoint.signOut), authController.signOut)

module.exports = router