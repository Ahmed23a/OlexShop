const mongoose = require("mongoose")




const productSchema = new mongoose.Schema({

    title  :{type:String , required:true},
    description:String,
    price: {type:Number , required:true},
    likes: [{type: mongoose.Schema.Types.ObjectId , ref:"User"}],
    createdBy :{type: mongoose.Schema.Types.ObjectId , ref:"User"},
    hiddenBy :{type: mongoose.Schema.Types.ObjectId , ref:"User"},
    isHidden: {type:Boolean, default:false},
    isDeleted: {type:Boolean, default:false},
    comments :[{type:mongoose.Schema.Types.ObjectId , ref:"Comment"}],
    wishList : [{type:mongoose.Schema.Types.ObjectId, ref:"User"}],
    QRcode : String


},{
    timestamps:true
})

productSchema.pre('findOneAndUpdate', async function(next){
    this.update( { $inc: { __v: 1 } }, next() );

})

const productModel = mongoose.model("Product", productSchema)

module.exports = productModel
