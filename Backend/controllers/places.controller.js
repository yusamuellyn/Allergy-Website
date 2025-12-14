import asyncHandler from "express-async-handler";
import axios from "axios";
import Data from "../models/Data.js";

//This method will eventually take in an address from the user and run it through the api 
const postPlaces = asyncHandler(async (req, res) => {
    const placesKey = process.env.GOOGLE_API_KEY;

    const full_address = "11 Cherry Ln, Lynbrook NY, 11563";
    
    const data = await getAllRestaurants(full_address, placesKey);

    const restaurantData = data.map(restaurant => ({
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
                        key: placesKey
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


const getAllData = asyncHandler(async (req, res) => {
    try {
        const inputData = await Data.find();
        console.log(inputData);
        return res.json(inputData);
    }catch (err) {
        return res.status(500).json({message: "Failed to get Data"});
    }
});

const getAllRestaurants = async (query, placesKey) => {
    let allResults = [];
    let hasNextPage = true;

    let params = {
        query: query,
        type: "restaurant",
        key: placesKey
    };

    while (hasNextPage) {
        const { data } = await axios.get(
            "https://maps.googleapis.com/maps/api/place/textsearch/json",
            { params }
        );

        if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
            console.error("Google API error:", data.status, data.error_message);
            break;
        }

        allResults = allResults.concat(data.results || []);

        if (data.next_page_token) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            params.pagetoken = data.next_page_token;
        } else {
            hasNextPage = false;
        }
    }

    return allResults;
};

export {postPlaces, getAllData};