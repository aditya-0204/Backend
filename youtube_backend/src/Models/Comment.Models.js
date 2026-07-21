import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { Video } from "./Video.models";
const CommentSchema = new Schema({
    content: {
        Type: String,
        required: true,

    },
    Video: {
        Type: Schema.Types.ObjectId,
        ref: "Video",

    },
    owner: {
        Type: Schema.Types.ObjectId,
        ref: "User"
    }
},
    {
        timestamps: true
    }
)

CommentSchema.plugin(mongooseAggregatePaginate) // just give ability to control ki kaha se kaha tak video dene hai 
export const Comment = mongoose.model("Comment", CommentSchema)