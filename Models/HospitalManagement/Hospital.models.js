import mongoose from 'mongoose'
const HospitalSchema =new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        addressLine1:{
            type:String,
            required:true
        },
        addressLine1:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        pincode:{
            type:String,
            required:true
        },
        specility:[
            {
                type:String
            },
            {
                required:true
            }
        ],

},{timestamps:true})
export const Hospital =mongoose.model('Hospital',HospitalSchema)