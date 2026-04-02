import mongoose from "mongoose";

const todoschema = new mongoose.Schema({
    content:{
        type:String,
        required:true,

    },
    complete:{
        type:Boolean,
        default:false,
    },
    cretaedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},{timestamps:true})

export const todo= mongoose.model('Todo',todoschema)//----> in mongodb it is named as todos
