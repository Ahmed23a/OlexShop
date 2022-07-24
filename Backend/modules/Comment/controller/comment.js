const commentModel = require("../../../DB/model/comment")
const productModel = require("../../../DB/model/product")
const userModel = require("../../../DB/model/user")
const { getIo } = require("../../../services/socket")




const addComment = async(req,res)=>
{
  try
  {
    const {productID} = req.params
    const {body} = req.body
    const findProduct = await productModel.findOne({_id : productID , isDeleted : false})
    if(!findProduct)
    {
        res.status(404).json({message:"In-valid product ID"})
    }
    else
    {
        const newComment = new commentModel({body , commentedBy : req.user._id , productID : productID })
        const savedUser = await newComment.save()        
        // getIo().emit('addcomment', [newComment])
        await productModel.findByIdAndUpdate(productID, {$push : {comments : savedUser._id}})
        res.status(201).json({message:"Added",savedUser})
    }
  }
  catch(error)
  {
    res.status(500).json({message:"Catch error",error})
  }
}

const replyOnComment = async(req,res)=>
{
    try
    {
        
        const {productID ,commentID} =  req.params
        const {body} = req.body
        const findProduct = await productModel.findOne({_id : productID , isDeleted:false , isHidden: false})
        if(!findProduct)
        {
            res.status(404).json({message:"In-valid post ID"})
        }
        else
        {
            const findComment = await commentModel.findOne({_id : commentID})
            if(!findComment)
            {   
                res.status(404).json({message:"In-valid comment ID"})
            }
            else
            {
                const newComment = new commentModel({body , commentedBy: req.user._id })
                const savedComment = await newComment.save()
                await commentModel.findByIdAndUpdate(commentID ,  { $push: { replies: savedComment._id } })
                res.status(201).json({message:"Comment added", savedComment})
            }
        }
    }
    catch(error)
    {
        res.status(500).json({message:"Catch error",error})
    }
}

const updateComment = async(req,res)=>
{
    const {productID ,commentID} =  req.params
    const {body} = req.body
    const findProduct = await productModel.findOne({_id : productID , isDeleted:false , isHidden: false})
    if(!findProduct)
    {
        res.status(404).json({message:"In-valid post ID"})
    }
    else
    {
        const findComment = await commentModel.findOne({_id : commentID , commentedBy: req.user._id})
        if(!findComment)
        {   
            res.status(404).json({message:"In-valid comment ID"})
        }
        else
        {
           
            const okay = await commentModel.findByIdAndUpdate(commentID ,{body}, {new :true})
            res.status(201).json({message:"Comment added" ,okay})
        }
    }
}

const deleteComment = async(req,res)=>
{
   try
   {
        const {productID ,commentID} = req.params       
        const findProduct = await productModel.findOne({_id : productID , isDeleted:false , isHidden: false})
        if(!findProduct)
        {
            res.status(404).json({message:"In-valid Product ID"})
        }
        else
        {
           
            const comment = await commentModel.findOne({_id : commentID , isDeleted:false })
            if(!comment)
            {                   
                res.status(404).json({message:"In-valid comment ID"})
            }
            else
            {               
               
            
                if(findProduct.createdBy.toString() == req.user._id.toString() || comment.commentedBy.toString()  == req.user._id.toString())
                {
                    await commentModel.findByIdAndUpdate(commentID, {isDeleted: true})
                    res.status(200).json({message:"Comment Deleted"})
                }
                else
                {
                    res.status(401).json({message :"Unauthorized"})
                }         
            }
        } 
    }
    catch(error)
    {
        res.status(500).json({message:"Catch error", error})
    }
}

const likeUnLikeComment = async(req,res)=>
{
    try
    {
        const id = req.user._id
        const {productID , commentID} = req.params
        const findProduct = await productModel.findById(productID) 

        if(findProduct) 
        {
            const comment = await commentModel.findById(commentID)
            if(!comment)
            {
                res.status(404).json({message:"In-valid Comment ID"})
            }
            else
            {
                if (comment.commentedBy.toString() == id.toString()) 
                {
                    res.status(401).json({mesaage: " You can't like yourself"})
                } 
                 else
                {
                    if(comment.likes.includes(id))
                    {         
                        await commentModel.updateOne({ _id: commentID },{$pull: { likes: id }})
                        res.status(200).json({message: 'Unlike Done'})
                    } 
                    else 
                    {
                        await commentModel.updateOne({ _id: commentID },{$push: { likes: id }})
                        res.status(200).json({ message: 'like Done' })
                    }
                }
            }
           
        }
        else 
        {
        res.status(404).json({ message: 'In-valid Comment ID ' })
        }
    }
    catch(error)
    {
        res.status(500).json({message:"Catch error",error})
    }
}

module.exports = 
{
    addComment,
    replyOnComment,
    updateComment,
    deleteComment,
    likeUnLikeComment
}