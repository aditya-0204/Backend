import mongoose, { Schema } from "mongoose";

const LikeSchema = new Schema(
    {
        Video:{
            type:Schema.Types.ObjectId,
            ref:"Video"
        },
        Comment:{
            type:Schema.Types.ObjectId,
            ref:"Comment"
        },
        Tweet:{
            type:Schema.Types.ObjectId,
            ref:"Tweet"
        },
        likedBy:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    },{
        timestamps:true
    }
)
export const Like = mongoose.model("Like",LikeSchema)