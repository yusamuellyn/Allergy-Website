import asyncHandler from "express-async-handler";
import Data from "../models/Data.js";
import axios from "axios";
import { analyzeMenuAllergies } from "../services/gemini.serivce.js";
import {scrapeMenuFromWebsite} from "../services/scrape.service.js"

const getAnalyzeData = asyncHandler(async (req, res) => {
    const restaurants = await Data.find({
        website: { $ne: null },
        menuText: { $exists: false }
    });
    
    let processedCount = 0;
    const maxToProcess = 6;
    
    for (const restaurant of restaurants) {
        if (processedCount >= maxToProcess) break;
    
        const menuText = await scrapeMenuFromWebsite(restaurant.website);
        if (!menuText) continue; 
    
        await Data.updateOne(
            { place_id: restaurant.place_id },
            { $set: { menuText } }
        );
    
        processedCount++;
    }
    
   
        await new Promise(r => setTimeout(r, 300));

    const allRestaurants = await Data.find({
        menuText: { $type: "string", $ne: "" },
        allergyAnalysis: { $exists: false }
    }).limit(6);

    for (const menu of allRestaurants) {
        if (!menu.menuText) continue;

        await analyzeMenuAllergies(menu.menuText, menu.place_id, menu.name);
        await new Promise(r => setTimeout(r, 400)); // delay between API calls
    }

    res.json({ status: "done", analyzed: allRestaurants.length });
});

export {getAnalyzeData}