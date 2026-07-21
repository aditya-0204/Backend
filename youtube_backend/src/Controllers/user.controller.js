import { User } from "../Models/User.models.js";
import asynchandler from "../utils/asynchandler.js";
import APIError from "../utils/Apierror.js";
import uploadonCloudinary from "../utils/Cloudinary.js";
import APIresponse from "../utils/Apiresponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

//  generation of access and refresh token for existed user 

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken // adding value to the object
        await user.save({ validateBeforeSave: false });
        return { refreshToken, accessToken };

    }
    catch (error) {
        console.log("Error: ", error)
        throw new APIError(500, "Something went wrong while generating access and refresh token")
    }
}

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
};

const registerUser = asynchandler(async (req, res) => {
    // step to register the user
    // get the user details from the frontend
    // validation - not empty
    // check if already exists :: user name or email
    // check for images : avatar, coverimage
    // upload to cloudnary
    // create user object - create entry in db
    // remove password and refresh token  fileds from response
    // check for user creation
    // return result
    console.log("BOdy", req.body);
    console.log("Files", req.files)

    const { fullName, email, username: username, password } = req.body
    console.log("Fullname: ", fullName);
    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new APIError(400, "All fields are mandatory");
    }
    // checking user already exist or not

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new APIError(409, "User with Email Id or Username already exist")
    }

    console.log(req.files);

    // checking for images
    const avatarlocalpath = req.files?.avatar?.[0]?.path
    const coverimagelocalpath = req.files?.coverimage?.[0]?.path

    if (!avatarlocalpath) {
        throw new APIError(400, "Avatar is required");

    }
    //upload on cloudnary
    const avatar = await uploadonCloudinary(avatarlocalpath)
    const cover = await uploadonCloudinary(coverimagelocalpath)

    if (!avatar) {
        throw new APIError(400, "Avatar is required");
    }

    // entry in database....only the user is talking to the database

    const NewUser = await User.create({
        Fullname: fullName,
        avatar: avatar.url,
        coverimage: cover?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(NewUser._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new APIError(500, "Something went Wrong while registering the user");
    }
    return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: createdUser
    });
})


// login user 

const loginUser = asynchandler(async (req, res) => {
    //req body  -> data
    //user name or email
    //find the user
    // password check
    //access and refresh token
    //send cookie
    // send successful message

    console.log("Body", req.body);


    const { email, username, password } = req.body
    if (!username && !email) {
        throw new APIError(400, "username or email is required")
    }
    // checking user on the basis of username or email 
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    //checking whether we get the user or not
    if (!user) {
        throw new APIError(400, "User does not exist");
    }

    // checking for password validation
    const ispasswordvalid = await user.ispasswordcorrect(password)

    if (!ispasswordvalid) {
        throw new APIError(401, "Invalid credentials")
    }

    const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    // sending the information to the user 

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new APIresponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged in Successfully"
            )
        )
})



//logout 

const logoutUser = asynchandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        }
    )
    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new APIresponse(200, {}, "User logout successfully."))
})


// refreshing the access token ... validity end after some times so need new access token
const RefreshtheaccessToken = asynchandler(async (req, res) => {
    const incomingrefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingrefreshToken) {
        throw new APIError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(incomingrefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new APIError(401, "Invalid refresh Token!!");
        }
        if (incomingrefreshToken != user?.refreshToken) {
            throw new APIError(401, "refresh Token is invalid or expired");
        }
        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id)
        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", newRefreshToken, cookieOptions)
            .json(
                new APIresponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access Token refreshed"
                )
            )
    } catch (error) {
        throw new APIError(401, error?.message || "Invalid Refresh Token")
    }
})

const changecurrentPassword = asynchandler(async (req, res) => {
    const { oldpassword, newpassword } = req.body
    const user = await User.findById(req.user?._id)
    const ispasswordcorrect = await user.ispasswordcorrect(oldpassword)
    if (!ispasswordcorrect) {
        throw new APIError(400, "Invalid old password");

    }
    user.password = newpassword;
    await user.save({ validateBeforeSave: false })


    return res.status(200)
        .json(new APIresponse(200, {}, "Password changed successfully"))


})



const getcurrentUser = asynchandler(async (req, res) => {
    return res
        .status(200)
        .json(new APIresponse(200, req.user, "Current User fetched successfully"))
})

const updateAccountDetails = asynchandler(async (req, res) => {
    const { fullName, email } = req.body

    if (!fullName || !email) {
        throw new APIError(400, "All the fields are required");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                Fullname: fullName,
                email: email
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(new APIresponse(200, user, "Account details updated Successfully"))
})


const updateAvatar = asynchandler(async (req, res) => {
    const avatarlocalpath = req.file?.path
    if (!avatarlocalpath) {
        throw new APIError(400, "Avatar file is missing");
    }
    const avatar = await uploadonCloudinary(avatarlocalpath)

    if (!avatar.url) {
        throw new APIError(400, "Error while uploading on avatar")
    }
    const user = await User.findByIdAndDelete(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(
            new APIresponse(200, user, "avatar Image updated successfully")
        )
})

const updateUserCoverImage = asynchandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path
    if (!coverImageLocalPath) {
        throw new APIError(400, "coverImage is missing");
    }
    const coverimage = await uploadonCloudinary(coverImageLocalPath)
    if (!coverimage.url) {
        throw new APIError(400, "Error while uploading on coverImage")
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverimage: coverimage.url
            }
        }, {
        new: true
    }
    ).select("-password")

    return res.status(200)
        .json(
            new APIresponse(200,
                user, "Cover Image updated Successfully"
            )
        )

})

const getUserChannelprofile = asynchandler(async (req, res) => {
    const { username } = req.params
    if (!username?.trim()) {
        throw new APIError(400, "User name is missing");
    }
    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",// becomes lowercase and becomes plural
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscriberscount: {
                    $size: "$subscribers" // counts the total count of subscribers
                },
                channelsSubsribedTo: {
                    $size: "$subscribedTo" // counts the total count of 
                },
                issubscribed: {
                    $cond: {
                        if: {
                            $in: [req.user?._id, "$subscribers.subscriber"]
                        },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                Fullname: 1,
                username: 1,
                channelsSubsribedTo: 1,
                subscriberscount: 1,
                issubscribed: 1,
                avatar: 1,
                email: 1,
                coverimage: 1,
            }
        }
    ])
    if (!channel?.length) {
        throw new APIError(404, "channel does not exist")
    }

    return res
        .status(200)
        .json(
            new APIresponse(200, channel[0], "User channel fetched successfully")
        )
})
 // note: -
//  match -> a guard that asks who is you ? are you aditya
//  lookup -> it looks for aditya's document like watch history watch history only contains the video id not the exact name of the video
// from -> go to the video room
// localField -> which field of the current user should be read
// foreignField -> compare with the field , if equal bring that
// as ->  after finding that where should I keep that
// project  -> the fields you want to know(specific)

const getwatchhistory = asynchandler(async(req,res)=>{
    const user  = await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(req.user._id) // mongoose will not work , aggregation code will directly go
            }
        },
        {
            $lookup:{
            from:"videos",
            localField:"watchHistory",
            foreignField:"_id",
            as:"WatchHistory",
            pipeline:[
                {
                    $lookup:{
                        from:"users",
                        localField:"owner",
                        foreignField:"_id",
                        as:"owner",
                        pipeline:[
                            {
                                $project:{
                                    fullName:1,
                                    username:1,
                                    avatar:1,
                                }
                            },
                            {
                                $addFields:{
                                    owner:{
                                        $first:"$owner"// give the owner name as first field
                                    }
                                }
                            }
                        ]
                    }
                }
            ]

        }}
    ])

    return res
    .status(200)
    .json(
        new APIresponse(200,user[0].watchHistory,"watch history fetched successfully")
    )
})
export { loginUser, registerUser, logoutUser, RefreshtheaccessToken, changecurrentPassword, getcurrentUser, updateAccountDetails, updateAvatar, updateUserCoverImage,getUserChannelprofile, getwatchhistory };
