const mongoose = require('mongoose');
const bcrypt = require('bcrypt');



const userSchema = new mongoose.Schema({
    
    firstName:{type:String , required: true },
    lastName :String,
    email :{type: String, required: true ,unique:true },
    password:{type: String , required:true},
    profilePicture:Array,
    coverPictures:Array,
    QRCode : String,
    confirmEmail:{type:Boolean ,default :false},
    isBlocked :{type:Boolean, default:false},
    wishList: [{type: mongoose.Schema.Types.ObjectId, ref:"Product"}],
    products :[{type:mongoose.Schema.Types.ObjectId , ref:"Product"}],
    isDeleted: {type:Boolean, default:false},
    code:String,
    role:{type: String, default:"User"},
    socketID :String,
    status:{ type: String, default: 'Offline' },
    lastSeen:Date,
    
    
},{
    timestamps:true
})

userSchema.pre('findOneAndUpdate', async function(next){
    this.update( { $inc: { __v: 1 } }, next() );

})

userSchema.pre("save", async function(next){

    this.password = await bcrypt.hash(this.password, parseInt(process.env.saltRound))  
    next()
})

const userModel = mongoose.model("User", userSchema)

module.exports = userModel