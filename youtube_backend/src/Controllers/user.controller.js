import { User } from "../Models/User.models.js";
import asynchandler from "../utils/asynchandler.js";
import APIError from "../utils/Apierror.js";
import uploadonCloudinary from "../utils/Cloudinary.js";

//  generation of access and refresh token for existed user 

const generateAccessAndRefreshTokens = async(userId)=> {
    try{
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken // adding value to the object
        await user.save({validBeforeSave:false});
        return {refreshToken,accessToken};

    }
    catch{
        throw new APIError(500,"Something went wrong while generating access and refresh token")
    }
}

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

    console.log(req.files);
    
    // checking for images
    const avatarlocalpath  = req.files?.avatar?.[0]?.path
    const coverimagelocalpath = req.files?.coverimage?.[0]?.path

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
    return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: createdUser
});


// login user 

const loginUser = asynchandler(async (req,res)=>{
    //req body  -> data
    //user name or email
    //find the user
    // password check
    //access and refresh token
    //send cookie
    // send successful message


    const {email,userName,password} = req.body
    if(!userName || !email){
        throw new APIError(400,"username or email is required")
    }
    // checking user on the basis of username or email 
    const user = await User.findOne({
        $or:[{userName},{email}]
    })
    //checking whether we get the user or not
    if(!user){ 
        throw new APIError(400,"User does not exist");
    }

    // checking for password validation
    const ispasswordvalid = await user.ispasswordcorrect(password)

    if(!ispasswordvalid){
        throw new APIError(401,"Invalid credentials")
    }

    const {refreshToken,accessToken} = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    
    // sending the information to the user 

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new APiResponse(
            200,
            {
                user : loggedInUser,accessToken,refreshToken
            },
            "User logged in Successfully"
        )
    )
})


}  )

export default {registerUser,loginUser};
