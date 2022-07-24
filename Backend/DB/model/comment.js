const mongoose = require("mongoose")


const commentSchema = new mongoose.Schema({

    body:{type:String , required:true},
    commentedBy:{type:mongoose.Schema.Types.ObjectId, ref:"User"},
    productID : {type:mongoose.Schema.Types.ObjectId, ref: "Product"},
    isDeleted: {type:Boolean, default:false},
    likes: [{type: mongoose.Schema.Types.ObjectId , ref:"User"}],
    replies: [{type:mongoose.Schema.Types.ObjectId, ref:"Comment"}]  

},
{
    timestamps:true
})


commentSchema.pre('findOneAndUpdate', async function(next){
    this.update( { $inc: { __v: 1 } }, next() );

})

const commentModel = mongoose.model("Comment" , commentSchema)



module.exports = commentModel