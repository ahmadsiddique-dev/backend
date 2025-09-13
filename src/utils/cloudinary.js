import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

(async function () {
  cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
  });
});

import { v2 as cloudinary } from "cloudinary";

const uploadOnCloudinary = async (filepath) => {
  try {
    if(!filepath) return null;
    const response = await cloudinary.uploader.upload(filepath, {
      resource_type: "auto",
    });
    console.log("File is uploaded on Cloudinary.", response);
  } catch (error) {
    fs.unlinkSync(filepath);
    return null;
  }
};
