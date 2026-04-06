import asyncHandler from "express-async-handler";
import Data from "../models/Data.js";
import { analyzeMenuAllergies } from "../services/gemini.serivce.js";
import { scrapeMenuFromWebsite } from "../services/scrape.service.js";

const getAnalyzeData = asyncHandler(async (req, res) => {
    const { searchId } = req.query;
    if (!searchId || typeof searchId !== "string") {
        return res.status(400).json({ message: "searchId query parameter is required" });
    }

    const restaurants = await Data.find({
        searchId,
        website: { $ne: null },
        menuText: { $exists: false }
    });
    
    let processedCount = 0;
    const maxToProcess = 6;
    
    for (const restaurant of restaurants) {
        if (processedCount >= maxToProcess) break;

        const scraped = await scrapeMenuFromWebsite(restaurant.website);
        const menuText = scraped && scraped.trim() ? scraped : "";

        await Data.updateOne(
            { _id: restaurant._id },
            { $set: { menuText } }
        );

        processedCount++;
    }
    
   
        await new Promise(r => setTimeout(r, 300));

    const allRestaurants = await Data.find({
        searchId,
        allergyAnalysis: { $exists: false }
    }).limit(6);

    for (const menu of allRestaurants) {
        await analyzeMenuAllergies(menu.menuText, menu._id, menu.name, {
            address: menu.address
        });
        await new Promise(r => setTimeout(r, 400)); // delay between API calls
    }

    res.json({ status: "done", analyzed: allRestaurants.length });
});

export {getAnalyzeData}