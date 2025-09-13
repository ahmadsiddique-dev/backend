import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        lowercase : true
    },
    fullName : {
        type : String,
        required : true,
        unique : true,
        lowercase : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true
    },
    avatar : {
        type : String,
        required : true,
    }, 
    coverImage : {
        type : String
    }, 
    watchHistory : {
        type : Schema.Types.ObjectId,
        ref : "video"
    }, 
    password : {
        type : String,
        required : [true, 'this is required']
    }, 
    refreshtoken : {
        type : String
    }
}, {timestamps : true})

userSchema.pre("save", async function (next) {
    if (this.password.isModified("password")) return(next());
    this.password = bcrypt.hash(this.password, "10");
    next();
})

userSchema.methods.isPasswordCorrect = async function () {
    bcrypt.compare(password, this.password)
}

userSchema.methods.userRefreshToken = async function () {
    jwt.sign({
        _id : this._id,
        username : this.username
    })
}
export const User = mongoose.model("User", userSchema)