import mongoose from "mongoose";

const allergySchema = new mongoose.Schema({
    risk_score: { type: Number },
    top_allergies: [{ type: String }]
}, { _id: false });

const dataSchema = new mongoose.Schema({
    place_id: { 
        type: String, 
        required: true, 
        unique: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    address: { 
        type: String 
    },
    website: { 
        type: String 
    },
    type: { 
        type: Boolean 
    },

    menuText: {
        type: String
    },
    allergyAnalysis: allergySchema
}, { timestamps: true });


const Data = mongoose.model("Data", dataSchema);

export default Data;