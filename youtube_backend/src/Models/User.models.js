import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
        ],
        password:{
            type: String,
            required: [true,"Password is required"],
        },
        refreshtoken:{
            type: String,
        },

    }
    ,{
        timestamps: true,
    }
)

// User password encyption 
UserSchema.pre("save",async function (next){
    if(!this.isModified("password")){
     return next();
    }
    this.password = await bcrypt.hash(this.password,12);
    next();

})

// defining method to check whether the entered password to login is correct or not

UserSchema.methods.ispasswordcorrect = async function(password){
   return await bcrypt.compare(password,this.password)
}


export const User = mongoose.model("User",UserSchema)