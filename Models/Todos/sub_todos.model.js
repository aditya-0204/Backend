import mongoose from "mongoose";

const subtodoSchema = new mongoose.Schema(
    {
        content:{
            type:String, 
            required:true,
        },
        complete:{
            type:Boolean,
            default:false,
        },
        createdby:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        }
    }
    ,{timestamps:true})

export const Subtodo = mongoose.model("Subtodo",subtodoSchema)