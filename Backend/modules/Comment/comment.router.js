const router = require('express').Router()
const { auth } = require('../../Middleware/auth')
const commentController = require('./controller/comment')
const commentValidator = require('./comment.validations')
const endPoint = require('./comment.endPoint')
const validation = require('../../Middleware/validation')


//Add comment

router.post("/addComment/:productID" ,auth(endPoint.addComment), 
validation(commentValidator.addComment),commentController.addComment )


//Add reply on comment

router.post("/addComment/:productID/replyOnComment/:commentID" ,auth(endPoint.addReply),
validation(commentValidator.addReply),commentController.replyOnComment)

// Update comment or reply
router.put("/update/:productID/:commentID", auth(endPoint.updateComment),
validation(commentValidator.updateComment),commentController.updateComment)


//delete comment 
router.patch("/delete/:productID/:commentID", auth(endPoint.deleteComment),
validation(commentValidator.deleteComment),commentController.deleteComment)


// like & unlike Comment
router.patch("/likeUnLike/:productID/:commentID", auth(endPoint.likeComment),
validation(commentValidator.likeComment),commentController.likeUnLikeComment)



module.exports = router