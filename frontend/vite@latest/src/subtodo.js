import mongoose from "mongoose";
const subtodo = new mongoose.Schema({

},{timestamps:true})
export const Subtodo = mongoose.model('subtodo',subtodo);