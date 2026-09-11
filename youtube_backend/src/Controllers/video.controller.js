import mongoose, { get, isValidObjectId } from "mongoose";
import asynchandler from "../utils/asynchandler";
import APIError from "../utils/Apierror";
import { Video } from "../Models/Video.models.js";
import APIresponse from "../utils/Apiresponse";
import uploadonCloudinary from "../utils/Cloudinary.js";
import {v2 as cloudinary} from "cloudinary";
const getallvideo = asynchandler(async (req, res) => {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.page) || 10, 50);
    const skip = (page - 1) * limit;
    const video = await Video.find({ ispublic: true })
        .select("videofile title description thumbnail views ispublic owner duration createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
    return status(200)
        .json(new APIresponse(200, { video, page, limit, hasMore: videos.length() == limit }, "Videos fetched successfully"))

})
const publishvideo = asynchandler(async (req, res) => {
    const { title, description, duration } = req.params

    if (!title?.trim() || !description?.trim() || !duration?.trim()) {
        throw new APIError(400, "All fields are required")
    }
    if(!req.files?.videofile?.[0] ||!req.files?.thumbnail?.[0]){  // req.files because the user is sending the file which contains the videofile and thumbnail
        throw new APIError(401,"Videofile and thumbnail are required")  
    }

    const videopath = req.files?.videofiles?.[0].path
    const thumnailpath = req.files?.thumbnail?.[0].path
    
    const [videoupload, thumbnailupload ] = await Promise.all([  // we are using promise because we want to upload both simulatneously.. both doesn't depend on each other
        uploadonCloudinary(videopath),
        uploadonCloudinary(thumnailpath)
    ])


    if(!videoupload || !thumbnailupload){
        throw new APIError(400,"Failed to upload video or thumbnail")
    }
    const video = await Video.create({
        videofile:videoupload.secure_url,
        title:title.trim(),
        description:description.trim(),
        thumbnail:thumbnailupload.secure_url,
        duration:Number(duration),
        owner:req.user._id,
        ispublic:true
    })

    res.status(200)
    .json(new APIresponse(200,video,"Video published successfully"));

})
const getvideobyid = asynchandler(async (req, res) => {
    const { videoid } = req.params
    if(!mongoose.Types.ObjectId.isValid(videoid)){
        throw new APIError(400,"Invalid video id:")
    }
    const video = await Video.findById(
        {
            _id:videoid,
            ispublic:true
        }
    )
    .select("videofile thumbnail description title owner duration createAt")
    .populate("owner","username email Fullname avatar")

    if(!video){
        throw new APIError(404,"Video not found")
    }

    res.status(200)
    .json(new APIresponse(200,video,"Video fetched successfully"))
    
})


const getOwnedVideo = async(videoid,userid)=>{
    if(!mongoose.Types.ObjectId.isValid(videoid)){
        throw new APIError(400,"Invalid Video id");
    }
    const video  = await Video.findOne({
        _id:videoid,
        owner:userid
    });
    if(!video){
        throw new APIError(404,"Video does not exist")
    }
    return video;
}
const updatevideo = asynchandler(async (req, res) => {
    const {videoid} = req.params;
    const {title,description,duration} = req.body;
    const video = await getOwnedVideo(videoid,req.user._id);
    if(title!==undefined){
        const clearTitle = title.trim();
        if(!clearTitle){
            throw new APIError(400,"Title not found");
        }
        video.title = clearTitle;
    }
    if(description!==undefined){
        const clear_description = description.trim();
        if(!clear_description){
            throw new APIError(300,"description not found");
        }
        video.description = clear_description;
    }
    if(duration!==undefined){
        const number_duration = Number(duration);
        if(!number_duration){
            throw new APIError(400,"Duration must be a positive number");
        }
        video.duration = number_duration;
    }
    const thumbnail = req.files?.thumbnail?.[0];
    if(!thumbnail){
        throw new APIError(400,"thumbnail not found");
    }
    
    await video.save();
    return res.status(200).json(
        new APIresponse(200,video,'Video updated successfully')
    );
})
const deletevideo = asynchandler(async (req, res) => {
    const {videoid} = req.params;
    const video = await getOwnedVideo(videoid,req.user._id);
    await Video.findByIdAndDelete(videoid);
    return res.status(200).json(
        new APIresponse(200,{},"Video deleted successfully")
    );

})
const togglepublishstatus = asynchandler(async (req, res) => {
    const {videoid} = req.params;
    const video = await getOwnedVideo(videoid,req.user._id);
    video.ispublic = !video.ispublic;
    await video.save();
    return res.status(200).json(
        new APIresponse(
            200,
            video,
            `video is now ${video.ispublic?" public":" private"}`
        )
    )
})
export {
    getallvideo, getvideobyid, updatevideo, deletevideo, togglepublishstatus, publishvideo
}