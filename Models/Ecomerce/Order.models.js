import mongoose from 'mongoose'
const OrderItemSchema = new mongoose.Schema(
    {
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required:true,
        },
        quantity:{
            type:Number,
            required:true,
        }
    },
    {timestamps:true})
const OrderSchema = new mongoose.Schema({
    OrderPrice:{
        type:Number,
        required:true,
    },
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    orderItems:{
        type:[OrderItemSchema],

    },
    address:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:["PENDING","SHIPPED","DELIVERED","CANCELLED"],
        default:"PENDING",
    }
},{timestamps:true})
export const Order = mongoose.model("Order",OrderSchema)