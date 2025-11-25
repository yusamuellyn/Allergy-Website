import mongoose from "mongoose";

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
    }
}, { timestamps: true });


const Data = mongoose.model("Data", dataSchema);

export default Data;