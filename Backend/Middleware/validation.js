
const dataMethod = ['body','params','query']
const validation =(schema)=>
{
    return async(req,res,next)=>
    {
        const errorArr =[]
        dataMethod.forEach(key =>
        {
           if(schema[key])
           {
            const validationResult = schema[key].validate(req[key], {abortEarly:false})
            if (validationResult.error)
            {
                errorArr.push(validationResult.error.details)
            }
           }
        })
        if(errorArr.length)
        {
            res.status(400).json({message:"Validations error", error: errorArr})
        }
        else
        {
            next()
        }
        
    }
}




module.exports = validation