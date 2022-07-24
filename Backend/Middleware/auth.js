const jwt = require('jsonwebtoken');
const userModel = require('../DB/model/user');

roles ={
   Admin : 'Admin',
   User : 'User',
   HR : 'HR'
}
const auth = (accessRoles)=>
{
    return async(req,res,next)=>
    {
        
        try
        {
            const headerToken = req.headers['authorization']
            if(!headerToken || headerToken == null || headerToken == undefined || !headerToken.startsWith(`${process.env.BearerToken} `))
            {
                res.status(401).json({message:"In-valid token"})
            }
            else
            {
                const token = headerToken.split(" ")[1]
                if(!token || token == null || token == undefined)
                {
                    res.status(401).json({message:"In-valid Token"})
                }
                else
                {
                    const decoded = jwt.verify(token, process.env.tokenSecret)
                    const user = await userModel.findById(decoded.id).select("email role firstName")
                    if(!user)
                    {
                        res.status(404).json({message:"In-valid user token"})
                    }
                    else
                    {                        
                        if(!accessRoles.includes(user.role))
                        {   
                            console.log(user.role);
                            res.status(401).json({message:"Not auth account"})                       
                        }
                        else
                        {
                            req.user = user
                            next()
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
}





module.exports = {
    auth,
    roles
}