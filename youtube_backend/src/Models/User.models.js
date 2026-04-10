import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
    {
        username :{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true, // to enable searching field
        },
        email :{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        Fullname :{
            type: String,
            required: true,
            index: true,
            trim: true,
        },
        avatar:{
            type: String,
            required: true,
        },
        coverimage:{
            type: String,
        },
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video"

            }
        ]
    }
)

export const User = mongoose.model("User",UserSchema)