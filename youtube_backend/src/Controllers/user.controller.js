import asynchandler from "../utils/asynchandler.js";
import APIError from "../utils/Apierror.js";
import { User } from "../Models/User.models.js";
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


    const {fullName,email,userName,password} = req.body
    console.log("Fullname: ",fullName);
    if([fullName,email,userName,password].some((field)=> field?.trim()==="")){
        throw new APIError(400,"All fields are mandatory");
    }
    // checking user already exist or not

    const existedUser = User.findOne({
        $or:[{ userName },{ email }]
    })
    if(existedUser){
        throw new APIError(409,"User with Email Id or Username already exist")
    }

    // checking for images
    const avatarlocalpath  = req.files?.avatar[0]?.path
    const coverimagelocalpath = req.files?.coverImage[0].path

    if(!avatarlocalpath){
        throw new APIError(400,"Avatar is required");

    }

    //upload on cloudnary

}  )

export default registerUser;
