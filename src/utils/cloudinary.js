import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filepath) => {
  try {
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    // console.log("File Path : ", filepath); // i am getting path in this field
    // if(!filepath) return null;
    const response = await cloudinary.uploader.upload(filepath, {
      resource_type: "auto",
    });
    console.log("File is uploaded on Cloudinary.", response); // this one is not being printed
    return response
  } catch (error) {
    fs.unlinkSync(filepath);
    return null;
  }
};

export {uploadOnCloudinary}