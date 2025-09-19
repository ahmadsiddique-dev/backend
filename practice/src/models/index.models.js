import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        reqired : true
    },
    password : {
        type : String,
        reqired : true
    },
    profilePic : {
        type : String
    }
    
}, {timestamps : true});

export const User = mongoose.model("User", userSchema);