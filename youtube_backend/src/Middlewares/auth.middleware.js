import APIError from "../utils/Apierror.js";
import asynchandler from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";
import { User } from "../Models/User.models.js";

export const verifyJWT = asynchandler(async(req,res,next)=>{
   try {
    const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
    if(!token){
     throw new APIError(401,"Unauthorised request");
    }
    const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    if(!user){
     throw new APIError(401);
    }
    req.user = user;
    next();
   } catch (error) {
    throw new APIError(401,"INvalid access token");
   }    

})