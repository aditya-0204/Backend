import mongoose from "mongoose";
import asynchandler from "../utils/asynchandler";
import APIError from "../utils/Apierror";
import { Comment } from "../Models/Comment.Models";
import APIresponse from "../utils/Apiresponse";

const getvideocomments = asynchandler(async(req,res)=>{
    const{videoid} = req.params
    const {page =1,limit = 10} = req.query
    if(!mongoose.Types.ObjectId.isValid(videoid)){
        throw new APIError(400,"Invalid Video Id")
    }

    const comments = await Comment.find({video:videoid}).skip((page-1)*limit) // finding comments by video id and skipping 
    .limit(Number(limit))
    .sort({createdAt:-1}) // sorting comments on the basis of created at

    res.status(200)
    .json(
        new APIresponse(200,comments,"Comments fetched Successfully")
    )
})

const addcomment = asynchandler(async(req,res)=>{
   const {videoid} = req.params
   const {content} = req.body

   if(!content?.trim()){
    throw new APIError(400,"Content is required");
   }
   const comment = await Comment.create({
    content,
    video:videoid,
    owner:req.user._id,
   });

   res.status(200)
   .json(
    new APIresponse(201,comment,"comment Added successfully")
   )
})

const updatecomment = asynchandler(async(req,res)=>{
    const {commentid} = req.params
    const {content} = req.body
    const comment = await Comment.find(commentid)
    if(!comment){
        throw new APIError(404,"Comment not found");

    } 
    if(comment.owner.toString()!==req.user._id.toStrig()){
        throw new APIError(403,"You are not allowed unless you are user");
    }
    comment.content = content
    await comment.save();

    res.status(200)
    .json(
        new APIresponse(200,comment,"Comment Updated Successfully")
    )
})
const deletecomment= asynchandler(async(req,res)=>{
    const {commentid} = req.params
    const comment = await Comment.find(commentid)
    if(!comment){
        throw new APIError(404,"Comment not found")
    }
    if(comment.owner.toString()!==req.user._id.toString()){
        throw new APIError(403,"You are not allowed to delete this comment, unless you are the owner")
    }
    await Comment.findByIdAndDelete(commentid);

    res.status(200)
    .json(
        new APIresponse(200,{},"Comment deleted successfully")
    )

})
export {addcomment,updatecomment,deletecomment,getvideocomments};