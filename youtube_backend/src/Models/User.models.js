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
                type: mongoose.Schema.Types.ObjectId,
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
    if(!this.isModified("password")){ // prebuild isModified to check whether it is modified or not 
     return ; // in modern mongoose the next is not needed 
    }
    this.password = await bcrypt.hash(this.password,12);
    // next();

})

// defining method to check whether the entered password to login is correct or not

UserSchema.methods.ispasswordcorrect = async function(password){ // when the request is waiting for the response
   return await bcrypt.compare(password,this.password) // await when the response is taking time 
}

UserSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username : this.username,
        Fullname: this.Fullname
    
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }

) // sign method to generate tokens;
}
UserSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
    
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

export const User = mongoose.model("User",UserSchema)
