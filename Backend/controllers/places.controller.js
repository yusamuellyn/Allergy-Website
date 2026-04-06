import asyncHandler from "express-async-handler";
import { randomUUID } from "crypto";
import Data from "../models/Data.js";
import axios from "axios";
import { getAllRestaurants } from "../services/places.service.js";

const postPlaces = asyncHandler(async (req, res) => {
    const placesKey = process.env.GOOGLE_API_KEY;
    const full_address = req.body;
    console.log("POST body:", full_address);
    const searchId = randomUUID();
  
    try {
      
      const data = await getAllRestaurants(full_address.address, placesKey);
  
      const restaurantData = data.map(restaurant => ({
        type: (restaurant.types).includes("restaurant"),
        place_id: restaurant.place_id
      }));
  
      const allData = await Promise.all(
        restaurantData.map(async rest => {
          try {
            const { data: detailData } = await axios.get(
              "https://maps.googleapis.com/maps/api/place/details/json",
              {
                params: {
                  place_id: rest.place_id,
                  fields: "website,formatted_address,name,photos",
                  key: placesKey
                }
              }
            );
            const result = detailData.result;
            let imageUrl = "";

            if (result.photos && result.photos.length > 0) {
              const photoReference = result.photos[0].photo_reference;
              // We build the URL directly. Google requires maxWidth or maxHeight.
              imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${placesKey}`;
            }

            return {
              searchId,
              place_id: rest.place_id,
              website: detailData.result.website,
              address: detailData.result.formatted_address,
              name: detailData.result.name,
              image: imageUrl
            };
          } catch (err) {
            console.error("Failed to get place details for", rest.place_id, err);
            return null; // skip failed ones
          }
        })
      );
  
      const filteredData = allData.filter(d => d && d.website).slice(0, 6);
  
      if (filteredData.length === 0) {
        return res.status(400).json({ message: "No valid restaurants found" });
      }
  
      const savedDocs = await Data.insertMany(filteredData);
      return res.json({ saved: savedDocs, searchId });
    } catch (error) {
      console.error("Error in postPlaces:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const getAllData = asyncHandler(async (req, res) => {
    try {
      const { searchId } = req.query;
      if (!searchId || typeof searchId !== "string") {
        return res.json([]);
      }
      const inputData = await Data.find({ searchId }).sort({ createdAt: 1 });
      return res.json(inputData);
    } catch (err) {
      return res.status(500).json({ message: "Failed to get Data" });
    }
  });
  

  export { postPlaces, getAllData };
  