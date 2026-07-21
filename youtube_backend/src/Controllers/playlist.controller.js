import mongoose from "mongoose";
import asynchandler from "../utils/asynchandler";

const createPlaylist = asynchandler(async(req,res)=>{
    const {name, description} = req.body
})
const getUserplaylists = asynchandler(async(req,res)=>{
    const {userid} = req.params
})
const getplaylistbyid = asynchandler(async(req,res)=>{

})
const addvideotoPlaylist = asynchandler(async(req,res)=>{

})
const deletevideofromplaylist = asynchandler(async(req,res)=>{

})
const updateplaylist = asynchandler(async(req,res)=>{

})
const deleteplaylist = asynchandler(async(req,res)=>{

})
export {deleteplaylist,updateplaylist,deletevideofromplaylist,addvideotoPlaylist,createPlaylist,getUserplaylists,getplaylistbyid}
