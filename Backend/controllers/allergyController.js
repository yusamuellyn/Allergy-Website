import asyncHandler from "express-async-handler";
import axios from "axios";
import express from "express";
import Data from "../models/Data.js";
const router = express.Router();


//This method will eventually take in an address from the user and run it through the api 
const postPlaces = asyncHandler(async (req, res) => {
    const key = process.env.GOOGLE_API_KEY;

    const full_address = "5785 Cole Road, Orchard Park NY, 14127";
    
    const { data } = await axios.get(
        "https://maps.googleapis.com/maps/api/place/textsearch/json",
        {
            params: {
                query: full_address,
                type: "restaurant",
                key
            }
        }
    );

    const restaurantData = data.results.map(restaurant => ({
            "type": (restaurant.types).includes("restaurant"), 
            "place_id": restaurant.place_id
     }));

    const allData = await Promise.all(
        restaurantData.map(async (rest) => {
            const {data: detailData} = await axios.get(
                "https://maps.googleapis.com/maps/api/place/details/json",
                {
                    params: {
                        place_id: rest.place_id,
                        fields: "website,formatted_address,name",
                        key
                    }
                }
            )
            return {
                place_id: rest.place_id, 
                website: detailData.result.website,
                address : detailData.result.formatted_address,
                name: detailData.result.name
            }
        })
    );

    try {
        const savedDocs = await Data.insertMany(allData);
        return res.json({ saved: savedDocs });
    } catch (error) {
        console.error("Error saving to DB:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export {postPlaces};