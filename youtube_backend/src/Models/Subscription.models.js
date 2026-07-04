import mongoose, { Schema } from "mongoose";
import { User } from "./User.models";
const subscriptionschema = new Schema({
    subscriber:{
        type: Schema.Types.ObjectId,
        ref: "User",

    },
    Channel:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const Subscription = mongoose.model("Subscription",subscriptionschema);