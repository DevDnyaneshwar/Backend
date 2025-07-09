import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    city:{
        type:String,
        required:true
    },
    district:{
        type:String,
        required:true
    },
    zipcode:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    rent:{
        type:Number,
        required:true
    },
    propertyType:{
        enum:['house','apartment', 'pg','commercial', 'villa'],
    },
    noOfBedroom:{
        type:Number,
        required:true
    },
    image:{
        type:[String]
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }
},
{timestamps:true}
)


export const Property = mongoose.model("property", propertySchema)