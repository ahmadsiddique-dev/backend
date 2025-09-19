import { Router } from "express";
import { app } from "../index.js";
import multer from "multer";
import { v2 as cloudinary} from "cloudinary";

// cld lines
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

const userRouter = Router();
const upload = multer({dest : "uploads/"})

// const response = await cloudinary.uploader.upload(filepath, {
//       resource_type: "auto",
//     });
//     console.log("File is uploaded on Cloudinary.", response);
userRouter
.post("/asia",upload.single("avatar"), async(req, res) => {
    const avatarLocalPath = req.file?.path;
    if(avatarLocalPath) { 
        const response = await cloudinary.uploader.upload(avatarLocalPath, {
       resource_type: "auto",
     });
     console.log("Response : ", response);
    }
    console.log("did you get : ", avatarLocalPath);
    res.json({
        upload : "profile-pic"
    })
})
.get("/asia", (req, res) => {
  res.json({
    status: "This is a nice province.",
  });
})


export { userRouter };














// import { Router } from "express";
// import multer from "multer";
// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";

// // Cloudinary config
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const userRouter = Router();
// const upload = multer({ dest: "uploads/" }); // store temp locally first

// userRouter
//   .post("/asia", upload.single("avatar"), async (req, res) => {
//     try {
//       // Multer saves file path in req.file
//       const avatarLocalPath = req.file?.path;

//       if (!avatarLocalPath) {
//         return res.status(400).json({ error: "No file uploaded" });
//       }

//       // Upload file to Cloudinary
//       const response = await cloudinary.uploader.upload(avatarLocalPath, {
//         resource_type: "auto", // auto-detect file type (image, video, etc.)
//         folder: "profiles",    // optional: store inside folder in Cloudinary
//       });

//       // Remove local file after upload
//       fs.unlinkSync(avatarLocalPath);

//       res.json({
//         message: "File uploaded successfully",
//         cloudinaryUrl: response.secure_url, // direct link to uploaded file
//       });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: "Upload failed" });
//     }
//   })
//   .get("/asia", (req, res) => {
//     res.json({
//       status: "This is a nice province.",
//     });
//   });

// export { userRouter };
