import mongoose from 'mongoose'
const todoSchema = new mongoose.Schema(
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
        },
        subtodo:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Subtodo"
            }
        ] // Array of subtodos

    },{timestamps:true}
)

export const Todo = mongoose.model("Todo",todoSchema);