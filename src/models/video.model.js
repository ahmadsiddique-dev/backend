import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const videoSchema = new mongoose.Schema({
    videoFile : {
        type : String, //cloudinary
        required : true
    },
    thumbnail : {
        type : String,
        required : true
    },
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
    },
    duration : {
        type : Number,
        required : true
    }
    ,view : {
        type : Number
    }
}, {timestamps : true })

export const video = mongoose.model("Video", videoSchema)