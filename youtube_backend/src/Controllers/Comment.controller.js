import mongoose from "mongoose";
import asynchandler from "../utils/asynchandler";

const getvideocomments = asynchandler(async(req,res)=>{
    const{videoid} = req.params
    const {page =1,limit = 10} = req.query

})

const addcomment = asynchandler(async(req,res)=>{

})

const updatecomment = asynchandler(async(req,res)=>{

})
const deletecomment= asynchandler(async(req,res)=>{

})
export {addcomment,updatecomment,deletecomment,getvideocomments};