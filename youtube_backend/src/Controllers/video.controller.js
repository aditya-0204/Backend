import mongoose from "mongoose";
import asynchandler from "../utils/asynchandler";
import APIError from "../utils/Apierror";
import { Video } from "../Models/Video.models.js";
import APIresponse from "../utils/Apiresponse";



const getallvideo = asynchandler(async(req,res)=>{
    const {videoid} = req.params
    if(!mongoose.Types.ObjectId.isValid(videoid)){
        throw new APIError(400,"Invalid video id");
    }
    const videos = await Video.find({_id:videoid})
    .populate("owner","username email Fullname avatar")
    .sort({createdAt:-1})

    return res.status(200)
    .json(new APIresponse(200,videos,"videos fetched successfully"))
})
const publishvideo = asynchandler(async(req,res)=>{
    
})
const getvideobyid = asynchandler(async(req,res)=>{

})
const updatevideo = asynchandler(async(req,res)=>{

})
const deletevideo = asynchandler(async(req,res)=>{

})
const togglepublishstatus = asynchandler(async(req,res)=>{

})
export {
    getallvideo,getvideobyid,updatevideo,deletevideo,togglepublishstatus,publishvideo
}