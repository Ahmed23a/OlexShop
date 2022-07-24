const productModel = require("../../../DB/model/product")
const  QRCode = require('qrcode')
const userModel = require("../../../DB/model/user")
const {  getIo, socketEvents, initIO } = require('../../../services/socket');

const addProduct = async(req,res) =>
 {
   try
   {
        const id = req.user._id
        const {title , price , description} = req.body

        let qr = await  QRCode.toDataURL(`Title: ${title}, Price: ${price}, CreatedBy: ${id}`)
      

        const product = new productModel({title ,description , price ,createdBy : id , QRcode: qr})
        const savedProduct = await product.save()   

           
        const user = await userModel.findByIdAndUpdate(id, {$push : {products : savedProduct._id}})
        getIo().emit(socketEvents.addProduct, [product])                     
        res.status(202).json({message:"Done" , savedProduct})
        
   }
   catch(error)
   {
     res.status(500).json({message:"Catch error",error})
   }
    
}

const updateProduct = async(req,res)=>
{
    try
    {
        const id = req.user._id
        const {productID} = req.params
        const {title, price} = req.body

        const findProduct =  await productModel.findOneAndUpdate({_id : productID , createdBy: id}, {title, price}, {new:true})
        if(!findProduct)
        {   
            res.status(401).json({message:"In-valid ID product"})
        }
        else
        {
            res.status(200).json({message:"Updated" , findProduct })
        }
    }
    catch(error)
    {
        res.status(500).json({message:"Catch error"})
    }
}

const deleteProduct = async(req,res)=>
{
   
    try
    {
        const id = req.user._id
        const  {productID} = req.params
        const product =  await productModel.findOne({_id :productID , isDeleted: false })
        
        if(!product)
        {
            res.status(404).json({message:"product not found"})
        }
        else
        {
            const user = await userModel.findById(id)             
            if(product.createdBy.toString() == id.toString() )
            {
                const samaka = await productModel.findByIdAndDelete(productID)
                res.status(200).json({message:"User", samaka})

            }  
            else if(user.role == "Admin" )
            {
                const samaka = await productModel.findByIdAndDelete(productID)
                res.status(200).json({message:"Deleted by Admin", samaka})
            }
            else
            {
                res.status(401).json({message:"Unauthorized"})
            }   
        }
    }catch(error)
    {
        res.status(500).json({message:"Catch error",error})
    }
}

const softDelete = async(req,res)=>
{
    try
    {
        const id = req.user._id
        const  {productID} = req.params
        const product =  await productModel.findOne({_id :productID , isDeleted: false })
        
        if(!product)
        {
            res.status(404).json({message:"product not found"})
        }
        else
        {
            const user = await userModel.findById(id)             
            if(product.createdBy.toString() == id.toString() )
            {
                const samaka = await productModel.findByIdAndUpdate(productID, { isDeleted: true})
                res.status(200).json({message:"User", samaka})

            }  
            else if(user.role == "Admin" )
            {
                const samaka = await productModel.findByIdAndUpdate(productID, { isDeleted: true})
                res.status(200).json({message:"Deleted by Admin", samaka})
            }
            else
            {
                res.status(401).json({message:"Unauthorized"})
            }   
        }
    }catch(error)
    {
        res.status(500).json({message:"Catch error",error})
    }
}

const hideProduct = async(req,res)=>
{
   try
   {
     
    const {productID}  = req.params  
       
    const findProduct = await productModel.findOne({_id: productID, isHidden:false , isDeleted : false})
    if(!findProduct)
    {
        res.status(404).json({message:"In-valid ID"})
    }
    else
    {
        await productModel.findByIdAndUpdate(productID, {isHidden: true , hiddenBy: req.user._id})
        res.status(200).json({message:"Done"})
    }
   }
   catch(error)
   {
        res.status(500).json({message:"Catch error"})
   }
}

const likeUnLikeProduct = async(req,res)=>
{
    try
    {
        const id = req.user._id
        const {productID} = req.params
        const findProduct = await productModel.findById(productID) 

        if(findProduct) 
        {
        if (findProduct.createdBy.toString() == id.toString()) 
        {
            res.status(401).json({mesaage: " You can't like yourself"})
        } 
        else
        {
                if(findProduct.likes.includes(id))
                {         
                    await productModel.updateOne({ _id: productID },{$pull: { likes: id }})
                    res.status(200).json({message: 'Unlike Done'})
                } 
                else 
                {
                await productModel.updateOne({ _id: productID },{$push: { likes: id }})
                res.status(200).json({ message: 'like Done' })
                }
            }
        }
        else 
        {
        res.status(404).json({ message: 'In-valid Product ID ' })
        }
    }
    catch(error)
    {
        res.status(500).json({message:"Catch error",error})
    }
}


const addToWishlist = async(req,res)=>
{
    try
    {
        const id = req.user._id
        const {productID} = req.params
        const findProduct = await productModel.findById(productID) 

        if(findProduct) 
        {
        if (findProduct.createdBy.toString() == id.toString()) 
        {
            res.status(401).json({mesaage: "You can't wishlist your product"})
        } 
        else
        {
                if(findProduct.wishList.includes(id))
                {         
                    
                    res.status(401).json({message: 'The product is already in your wishlist'})
                } 
                else 
                {
                    await userModel.updateOne({ _id: id },{$push: { wishList: productID }})
                    res.status(200).json({ message: 'product is added to the wishlist ' })
                }
            }
        }
        else 
        {
            res.status(404).json({ message: 'In-valid Product ID ' })
        }
    }
    catch(error)
    {
        res.status(500).json({message:"Catch error",error})
    }
}

module.exports = 
{
    addProduct,
    updateProduct,
    deleteProduct,
    softDelete,
    hideProduct,
    likeUnLikeProduct,
    addToWishlist
}