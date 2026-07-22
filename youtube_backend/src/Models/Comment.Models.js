import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { Video } from "./Video.models";
const CommentSchema = new Schema({
    content: {
        type: String,
        required: true,

    },
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video",

    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},
    {
        timestamps: true
    }
)

CommentSchema.plugin(mongooseAggregatePaginate) // just give ability to control ki kaha se kaha tak video dene hai 
export const Comment = mongoose.model("Comment", CommentSchema)