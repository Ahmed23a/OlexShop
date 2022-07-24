const router = require("express").Router()
const { auth } = require("../../Middleware/auth")
const productController = require("./controller/productCRUD")
const productValidator = require('./product.validation')
const endPoint = require('./product.endPoint')
const validation = require("../../Middleware/validation")

// Add product 
router.post("/addProduct", auth(endPoint.addProduct),
validation(productValidator.addProduct),productController.addProduct)


// Update Product
router.put('/update/:productID',auth(endPoint.updateProduct),
validation(productValidator.updateProduct), productController.updateProduct)

// Delete Product
router.delete("/delete/:productID",auth(endPoint.deleteProduct),
validation(productValidator.deleteProduct),productController.deleteProduct)

// Soft Delete
router.patch('/softDelete/:productID',auth(endPoint.softDelete),
validation(productValidator.softDelete),productController.softDelete)


// Hide Product 
router.patch("/hide/:productID", auth(endPoint.hideProduct),
validation(productValidator.hideProduct),productController.hideProduct)


//Like unLike product 
router.patch("/likeUnLike/:productID", auth(endPoint.likeProduct),
validation(productValidator.likeProduct),productController.likeUnLikeProduct)


//Add To Wishlist 
router.patch("/wishlist/:productID", auth(endPoint.likeProduct),
validation(productValidator.likeProduct),productController.addToWishlist)







module.exports = router