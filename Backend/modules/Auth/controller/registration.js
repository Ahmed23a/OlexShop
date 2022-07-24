const userModel = require("../../../DB/model/user")
const QRCode = require('qrcode')
const {sendEmail} = require("../../../services/sendEmail")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');




const signUp = async(req,res)=>
{
    try
    {
        const {firstName , email ,password} = req.body                                           
          
        let qr = await  QRCode.toDataURL(`First Name : ${firstName}, Email : ${email}`)         
        const newUser = new userModel({firstName, email, password, QRCode: qr})
        const savedUser = await newUser.save()
        const token = jwt.sign({id:savedUser._id}, process.env.emailToken, {expiresIn: 5 * 60})
        const URL = `${req.protocol}://${req.headers.host}/api/v1/auth/confirmEmail/${token}`     
        const message = `<a href=${URL}>Please click here to confirm your email</a>` 
        sendEmail(savedUser.email, message)
        res.status(201).json({message:"Done" , savedUser})

    }
   catch(error)
    {        
        if(error.keyValue?.email)
        {
            res.status(409).json({message:"Email is already exists"})
        }
        else
        {
            res.status(500).json({message:"Catch error", error})
        }
    } 
}

const confirmEmail = async(req,res)=>
{
   try 
   {
        const token = req.params.token
        if(!token || token == null || token == undefined)
        {
            res.status(400).json({message:"In-valid email token"})
        }
        else
        {
            const decoded = jwt.verify(token , process.env.emailToken)
            if(!decoded)
            {
                res.status(400).json({message:"In-valid email token"})
            }
            else
            {
                await userModel.findByIdAndUpdate(decoded.id, {confirmEmail : true})
                res.status(200).json({message:"Email is confirmed please login"})
            }
        }
   }catch(error)
   {
     res.status(500).json({message:"Catch error",error})
   }
}

const signin = async(req,res)=>
{
  try
  {
    const {email, password} = req.body
    const user = await userModel.findOne({email})
    if(!user)
    {
        res.status(404).json({message:"In-valid Email"})
    }
    else
    {   
        if(!user.confirmEmail)
        {
            res.status(400).json({message:"Please go and confirm your email"})
        }else
        {
           
            if (user.isDeleted)
            {
                res.status(404).json({message:"Your account is deleted"})                                
                return
            } 
            if(user.isBlocked)
            {
                res.status(403).json({message:"Sorry, You are Blocked"})
            }
            else
            {
                const match = await bcrypt.compare(password, user.password)
                if(!match)
                {
                    res.status(403).json({mesage:"In-valid password"})
                }
                else
                {
                    const token = jwt.sign({id: user._id, isLoggedIn :true},process.env.tokenSecret , {expiresIn: "24h"})   
                    await userModel.updateOne({ email }, { status: 'Online' })             
                    res.status(200).json({message:"Done", token: token})        
                }
            }                       
        }            
    }        
  }
  catch(error)
  {
    res.status(500).json({message:"Catch error",error})
  }
}

const signOut = async (req,res)=>
{
    const user = await userModel.findByIdAndUpdate( req.user._id, 
        {status : "Offline" , lastSeen: Date.now()}, {new:true})        
        res.status(200).json({message: 'Sign Out success', LastSeen: user.lastSeen, Status: user.status})

}


const sendCode = async(req,res)=>
{
   try
   {
        const {email} = req.body
        const user = await userModel.findOne({email})
        if(!user)
        {
            res.status(404).json({message:"In-valid email"})
        }
        else
        {
            const code = Math.floor(1000 + Math.random() * 9000);
            message = `<p>With this code you can reset your password: ${code}</p>`         
            sendEmail(user.email,message)
            await userModel.findByIdAndUpdate(user._id,{code})
            res.status(200).json({message:"Done"})
        }
   }
   catch(error)
   {
        res.status(500).json({message:"Catch error", error})
   }
}

const forgetPassword = async(req,res)=>
{
    try
    {
        const  {email , code , newPassword} = req.body
        const user = await userModel.findOne({email})
        if(!user)
        {
            res.status(404).json({message:"In-valid email"})
        }
        else
        {
            if(user.code.toString() != code.toString())
            {
                res.status(403).json({message:"In-valid code"})
            }
            else
            {
                const hashPassword = await bcrypt.hash(newPassword,parseInt(process.env.saltRound))
                await userModel.findByIdAndUpdate(user._id, {password: hashPassword , code :""})
                res.status(200).json({message:"Updated, please go and login"})
            }
        }
    }
    catch(error)
    {
        res.status(500).json({message:"Catch error",error})
    }
}



     


module.exports =
{
    signUp,
    signin,
    confirmEmail,
    sendCode,
    forgetPassword,
    signOut
    
    
}