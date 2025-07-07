import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim:true,
        index:true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim:true
    },
    fullname: {
        type: String,
        required: true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,  //Cloudinary url
        required: true
    },
    coverimage:{
      type:String  //cloudinary url  
    }, 
    watchHistory:[
        {
            type: Schema.type.ObjectId,
            ref: "video"
        }
    ],
    password:{
        type:String,
        required: true
    },
    refresh:{
        type:String,
    }
},{timestamps:true}
)

userSchema.pre("save", async function(next){

    if(!this.isModified("password")) return next();

    this.password = bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
    {
        _id: this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname 
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPAIRY
    }
)

}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
    {
        _id: this._ids 
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPAIRY
    }
)
}

export const User = mongoose.model("User", userSchema)