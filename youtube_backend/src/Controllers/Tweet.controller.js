import mongoose, { mongo } from "mongoose";
import asynchandler from "../utils/asynchandler.js";
import APIError from "../utils/Apierror.js";
import APIresponse from "../utils/Apiresponse.js";
import mongoose from "mongoose";
import { Tweet } from "../Models/tweet.models.js";

const createTweet = asynchandler(async(req,res)=>{
    const {content} = req.body
    if(!content?.trim()){
        throw new APIError(400,"Content is required")
    }

    const tweet = await Tweet.create({
        content: content.trim(),
        owner:req.user?._id

    })
    res.status(200)
    .json(new APIresponse(200,Tweet,"Tweet created successfully"));

})


const getusertweets = asynchandler(async(req,res)=>{
    const {userid} = req.params

    if(!mongoose.Types.ObjectId.isValid(userid)){
        throw new APIError(400,"Invalid user id")
    }
    const tweets = await Tweet.find({owner:userid}).sort({createdAt:-1});

    res.status(200)
    .json(new APIresponse(200,tweets,"User tweets fetched successfully"))
})


const updateTweet = asynchandler(async(req,res)=>{
    const {tweetid} = req.params
    const {content} = req.body
    if(!mongoose.Types.ObjectId.isValid(tweetid)){
        throw new APIError(400,"Invalid Tweet id")
    }
    if(!content?.trim()){
        throw new APIError(400,"content is required")
    }

    const tweet = await Tweet.findOne({
        _id:tweetid,
        ownwer:req.user?._id
    })
    if(!tweet){
        throw new APIError(404,"Tweet not found or you are not authorized");
    }
    tweet.content = content.trim();
    await tweet.save();

    return res.status(200)
    .json(new APIresponse(200,tweet,"Tweet updated successfully"))

})
const deletetweet = asynchandler(async(req,res)=>{
    const {tweetid} = req.params
    if(!mongoose.Types.ObjectId.isValid(tweetid)){
        throw new APIError(400,"tweet id is invalid")

    }

    const tweet = await Tweet.findOne({
        _id:tweetid,
        owner:req.user?._id
    })
    if(!tweet){
        throw new APIError(401,"Tweet does not exist or you are not authorised")
    }
    await Tweet.findByIdAndDelete(tweetid);
    return res.status(200)
    .json(new APIresponse(200,{},"Tweet deleted successfully"));
})
export {createTweet,getusertweets,updateTweet,deletetweet}