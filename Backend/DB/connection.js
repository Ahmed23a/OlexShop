const mongoose = require("mongoose")


const connectDB = ()=>
{
    return mongoose.connect(process.env.DBurl)
    .then((result)=>console.log(`connected on...${ process.env.DBurl }`))
    .catch(()=>console.log("Connection failed"))
}


module.exports = connectDB