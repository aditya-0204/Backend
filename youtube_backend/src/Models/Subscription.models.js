import mongoose, { Schema } from "mongoose";
import { User } from "./User.models";
const subscriptionschema = new Schema({
    subscriber:{
        type: Schema.Types.ObjectId, // the one who is subscribing 
        ref: "User",

    },
    Channel:{
        type: Schema.Types.ObjectId, // the one to whom subsriber is subscribing
        ref:"User"
    }
},{timestamps:true})

export const Subscription = mongoose.model("Subscription",subscriptionschema);