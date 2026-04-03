import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
        },
        email:{
            type: String,
            required:true,
            unique:true,
            lowercase:true,
        },
        password:{
            type:String,
            required:true,
            min:6,
        }

    },{timestamps:true}) // timestamps : createdat updated at
export const User = mongoose.model("User",UserSchema)
