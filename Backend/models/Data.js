import mongoose from "mongoose";

const allergySchema = new mongoose.Schema({
    risk_score: { type: Number },
    top_allergies: [{ type: String }]
}, { _id: false });

const dataSchema = new mongoose.Schema({
    /** Groups rows from one "Find restaurants" search so we do not return the whole collection. */
    searchId: {
        type: String,
        required: true,
        index: true
    },
    place_id: { 
        type: String, 
        required: true
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

    image: {
        type: String
    },
    allergyAnalysis: allergySchema
}, { timestamps: true });

dataSchema.index({ place_id: 1, searchId: 1 }, { unique: true });

const Data = mongoose.model("Data", dataSchema);

export default Data;