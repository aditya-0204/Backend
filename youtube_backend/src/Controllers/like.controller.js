import mongoose from "mongoose";
import asynchandler from "../utils/asynchandler";
import { Like } from "../Models/like.models";
import APIError from "../utils/Apierror";

const togglevideolike = asynchandler(async(req,res)=>{
    const {videoid} = req.params
    const video = await Like.findById(videoid)
    if(!video){
        throw new APIError(400,"video is not available")

    } 

})
const toggletweetlike= asynchandler(async(req,res)=>{

})
const togglecommentlike = asynchandler(async(req,res)=>{

})
const getlikedvideo = asynchandler(async(req,res)=>{

})
export {togglecommentlike,toggletweetlike,togglevideolike,getlikedvideo}