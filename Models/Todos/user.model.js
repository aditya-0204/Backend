import mongoose from "mongoose"
const userSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
        },
        password:{
            type:String,
            required:[true,"Please enter your password"]
        }
    },{timestamps:true}
) // creating schema in {} the data is kept there 
export const User = mongoose.model("User",userSchema) // creating model first argument - kya model banau second argument-  kiske basis pr banau 

// "User" when go to database it will be "users" mongo db makes it plural
