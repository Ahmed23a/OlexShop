const userModel = require("../../../DB/model/user")
const bcrypt = require('bcrypt');
const {sendEmail} = require("../../../services/sendEmail")
const jwt = require('jsonwebtoken');
const  fs = require("fs")
const paginate = require("../../../services/paginate")




const updateProfile = async(req,res)=>
{
    
    try
    {
       
        const { firstName, lastName, newEmail } = req.body
        await userModel.findOneAndUpdate({ email: req.user.email },{ email: newEmail, ...req.body },{ new: true })
        const id = req.user._id                                                        
        if(newEmail)
            {
               
                const emailFound = await userModel.findOne({newEmail})
                if(emailFound)
                {
                    res.status(409).json({message:"Email already exist"})
                }
                else
                {                    
                    await userModel.findByIdAndUpdate(id , {email , confirmEmail : false})    
                    const token = jwt.sign({id:id}, process.env.emailToken, {expiresIn: 5 * 60})
                    const URL = `${req.protocol}://${req.headers.host}/api/v1/auth/confirmEmail/${token}`
                    const message = `<a href=${URL}>Please click here to confirm your email</a>`     
                    sendEmail(email,message)
                    res.status(200).json({message:"Updated, please go and confirm your email"})
                }                
            }
            else
            {
                res.status(200).json({message:"Updated"})
            }
            
            
}
catch(error)
{
    res.status(500).json({message:"Catch error"})
}
}

const updatePassword = async(req,res)=>
{
    const {newPassword} =req.body
    const user = await userModel.findById(req.user._id)
    const match = await bcrypt.compare(newPassword , user.password)
       if(match)
       {
            res.status(404).json({message:"Your new password cannot be the same as your old password"})
       }
       else
       {
            const hashedPassword = await bcrypt.hash(newPassword, parseInt(process.env.saltRound))
            const ok =  await userModel.findByIdAndUpdate(req.user._id , {password : hashedPassword})
            res.status(200).json({message:"Different password", ok })
       }
}

const deleteUser = async(req,res)=>
{
 
    try
    {
        const {userID} = req.params
        const id = req.user._id
       
        const deletedUser = await userModel.findOne({_id : userID})
        if(!deletedUser)
        {
            res.status(404).json({message:"Not Found"})
        }
        else
        {   
            //Checks if the admin is asking to delete himself
            if(deletedUser._id.toString() == id.toString() && deletedUser.role == 'Admin')
            {
                const samaka = await userModel.findByIdAndDelete(userID)
                res.status(200).json({message:"Admin", samaka})

            }  // but he can't delete another admin / User can delete himself
            else if(deletedUser.role == 'User' && deletedUser._id.toString() == id.toString() )
            {
                const samaka = await userModel.findByIdAndDelete(userID)
                res.status(200).json({message:"Deleted by user", samaka})
            }
            else
            {
                res.status(401).json({message:"Unauthorized"})
            }    
        }
    }
catch(error)
    {
        res.status(500).json({message:"Catch error",error})
    }
}

const softDeleteByAdmin = async(req,res)=>
{
   try
   {
        const {userID}  = req.params   
        const findUser = await userModel.findOne({_id: userID, isDeleted:false})
        if(!findUser)
        {
            res.status(404).json({message:"In-valid ID"})
        }
        else
        {
        await userModel.findByIdAndUpdate(userID, {isDeleted: true})
            res.status(200).json({message:"Done"})
        }
   }
   catch(error)
   {
     res.status(500).json({message:"Catch error",error})
   }

}

const updateProfilePic = async (req, res) => 
{
   
    try
    {
        if (req.extensionError) 
        {
            //Unprocessable Entity
            res.status(422).json({ message: "in-valid format" })
        }
        else 
        {
            const imageUrls = []
            for (let i = 0; i < req.files.length; i++) 
            {
                imageUrls.push(`${req.destinationFile}/${req.files[i].filename}`)
            }
            const user = await userModel.findOneAndUpdate({ _id: req.user._id }, { profilePicture: imageUrls }, { new: true })
            res.status(200).json({ message: "Done", user })
        }
    }
    catch(error)
    {
        res.status(500).json({message:"catch error",error})
    }
   
}

const updateProfileCoverPic = async (req, res) =>
{  

   try
   {
        if (req.extensionError) {

            res.status(422).json({ message: "in-valid format" })
        } 
        else
        {
            const imageUrls = []
            for (let i = 0; i < req.files.length; i++) {
                imageUrls.push(`${req.destinationFile}/${req.files[i].filename}`)
            }
            const user = await userModel.findOneAndUpdate({ _id: req.user._id }, { coverPictures: imageUrls }, { new: true })
            res.json({ message: "Done", user })
        }
   }
   catch(error)
   {
        res.status(500).json({message:"Catch error",error})
   }
}


const select  = 'firstName email';
    const getUser = [        
            {
                path: 'products',
                match: { isDeleted: false },
                populate: [
                    {
                        path: 'createdBy',
                        select
                    },  {
                        path: 'wishList',
                        match: { isDeleted: false },
                            populate: [
                                {
                                    path: 'createdBy',
                                    select
                                }]
                    },{
                        path: 'likes',
                        select
            
                    },{
                        path: 'comments',
                        match: { isDeleted: false },
                        populate: [
                            {
                                path: 'commentedBy',
                                select
                            },
                            {
                                path: 'replies',
                                populate: [{
                                    path: 'commentedBy',
                                    select
                                }
                                ],
                            }
                        ]
                    }
                ]
    
            }]


        
const getUsers = async(req,res)=>
{
    try
    {
        const {page, size}= req.query;
        const {limit, skip} = paginate(page, size);
        const allUsers = await userModel.find({}).populate(getUser).limit(limit).skip(skip).select("-password")
        res.status(200).json({message: "Done", allUsers})

    }
    catch (error) {

        res.status(500).json({message:"Error", error})
    }
}
    
        

  
  



module.exports =
{
    updateProfile,
    deleteUser,
    softDeleteByAdmin,
    updateProfilePic,
    updateProfileCoverPic,
    getUsers,
    updatePassword
}