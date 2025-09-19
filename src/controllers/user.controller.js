import { ApiError } from "../utils/apierror.js";
import { asynchandler } from "../utils/asynchandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"

const userRegister = asynchandler(async (req, res) => {
  const { fullname, username, email, password } = req.body;
  console.log(email, username);

  // Validating Empty Fields
  if (
    [fullname, username, email, password].some((field) => field?.trim === "")
  ) {
    throw new ApiError(400, "All field are required");
  }

  // Check user already Existance
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email and username already exists.");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar First is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  console.log("Avatar Local path : ", avatar);
  if (!avatar) {
    throw new ApiError(400, "Avatar second is required");
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating user.");
  }
  // Sending Response
  res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered successfuly."));
});

const genrateAccessAndRefereshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating Referesh & access token."
    );
  }
};

const loginUser = asynchandler(async (req, res) => {
  console.log("Body data : ", req.body);
  const { email, password, username } = req.body;

  // if(!(username || password)) you can also use that one.
  if (!(username || password)) {
    throw new ApiError(400, "Username or password is required.");
  }
  
  const user = await User.findOne({
    $or: [{ username, email }],
  });

  if (!user) {
    throw new ApiError(404, "User doesn't exist.");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Credentials.");
  }

  const { accessToken, refreshToken } = await genrateAccessAndRefereshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In successfully."
      )
    );

    
})

const logOutUser = asynchandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {refreshToken : undefined}
        }, 
        {
            new : true
        }
    )
    const options = {
    httpOnly: true,
    secure: true,
  };

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User logged out."))
});

try {
  const refreshAccessToken = asynchandler(async (req, res) => {
    const incommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
  
    if (!incommingRefreshToken) {
      throw new ApiError(401, "Unauthorized Request")
    }
  
    const decodedToken = jwt.verify(incommingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
    const user = await User.findById(decodedToken?._id)
    if (!user) {
      throw new ApiError(401, "Invalid Token")
    }
  
    if (incommingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired and used.")
    }
  
    const options = {
      httpOnly : true,
      secure : true
    }
    const {accessToken, newRefreshToken} = genrateAccessAndRefereshToken(user._id)
  
    return res 
    .status(200)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", newRefreshToken)
    .json(new ApiResponse (
      200,
      {accessToken, refreshToken : newRefreshToken},
      "Access Token Refreshed"
    ))
  })
} catch (error) {
  throw new ApiError(401, "Invalid Refresh Token")
}

const changeCurrentPassword = asynchandler(async (req, res) => {
  const {oldPassword, newPassword} = req.body
  const user = await User.findById(req.user?._id)
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Password is incorrect.")
  }

  user.password = newPassword;
  await user.save({validateBeforeSave : false})

  return res 
  .status(200)
  .json(new ApiResponse(200, {}, "password change successfully"))
})

const getCurrentUser = asynchandler(async (req, res) => {
  return res
  .status(200)
  .json(200, req.user, "User fetched Successfully.")
})

const updataAccountDetails = asynchandler(async (req, res) => {
  const {fullName, email} = await req.body

  if(!(email || fullName)) {
    throw new ApiError(400, "All fields are required.")
  }

  User.findByIdAndUpdate(
    req.user?._id,
  {
    $set : {
      fullName, 
      email
    }
  },
  {new : true}
).select("-password")

return res
.status(200) 
.json(new ApiResponse(200, "Credentials has been saved successfully"))
})

const updateUserAvatar = asynchandler(async (req,res) => {
  const avatarLocalPath = req?.File.path

  if(!avatarLocalPath) {
    throw(new ApiError(400, "Avatar file is missing."))
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath)

  if(!avatar.url) {
    throw(new ApiError(400, "API Error."))
  }

  const res = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set : {
        avatar : avatar.url
      },
    }, 
    {new : true}
  )
  return res
  .status(200) 
  .json(new ApiResponse(200, "Cover Image updated successfully."))

})

export { userRegister, loginUser, logOutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updataAccountDetails, updateUserAvatar };