import { User } from "../Models/User.models.js";
import asynchandler from "../utils/asynchandler.js";
import APIError from "../utils/Apierror.js";
import uploadonCloudinary from "../utils/Cloudinary.js";
const registerUser = asynchandler( async(req , res)=>{
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


    const {fullName,email,username:userName,password} = req.body
    console.log("Fullname: ",fullName);
    if([fullName,email,userName,password].some((field)=> field?.trim()==="")){
        throw new APIError(400,"All fields are mandatory");
    }
    // checking user already exist or not

    const existedUser = await User.findOne({
        $or:[{ userName },{ email }]
    })
    if(existedUser){
        throw new APIError(409,"User with Email Id or Username already exist")
    }

    // checking for images
    const avatarlocalpath  = req.files?.avatar[0]?.path
    const coverimagelocalpath = req.files?.coverImage?.[0]?.path

    if(!avatarlocalpath){
        throw new APIError(400,"Avatar is required");

    }


    //upload on cloudnary
    const avatar = await uploadonCloudinary(avatarlocalpath)
    const cover = await uploadonCloudinary(coverimagelocalpath)

    if(!avatar){
        throw new APIError(400,"Avatar is required");
    }

    // entry in database....only the user is talking to the database

    const NewUser = await User.create({
        Fullname:fullName,
        avatar:avatar.url,
        coverimage: cover?.url||"",
        email,
        password,
        username:userName.toLowerCase()
    })

    const createdUser = await User.findById(NewUser._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new APIError(500,"Something went Wrong while registering the user");
    }

}  )

export default registerUser;
