import asyncHandler from "express-async-handler";
import Data from "../models/Data.js";
import {GoogleGenerativeAI} from "@google/generative-ai";

const postGemini = asyncHandler(async (req, res) => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
        model: "gemini-robotics-er-1.5-preview"
    });
    
    const results = [];

    const allRestaurants = await Data.find({
        menuText: { $type: "string", $ne: "" },
        allergyAnalysis: { $exists: false }
    });

    console.log("Gemini input count:", allRestaurants.length);

    for (const menu of allRestaurants) {
        if (!menu.menuText){
            continue; 
        } 

        const prompt = `
Analyze the following restaurant menu for food allergy risk.

Menu:
${menu.menuText}

Respond ONLY with valid JSON:
{
  "risk_score": number between 1 and 10 with 10. Be fair and lenient.
  "top_allergies": ["allergy1", "allergy2", "allergy3"]
}
`;

    try {
        const result = await model.generateContent(prompt);
        const raw = result.response.text();

        // Use helper to parse
        const parsed = parseAllergyJSON(raw);

        await Data.updateOne(
            { place_id: menu.place_id },
            { $set: { allergyAnalysis: parsed } }
        );

        results.push({
            place_id: menu.place_id,
            name: menu.name,
            allergyAnalysis: parsed
        });

        await new Promise(r => setTimeout(r, 400));
    } catch (err) {
        console.error("Gemini error for", menu.name, ":", err);
    }
    }

    res.json({
    analyzed: results.length,
    results
    });
});

const parseAllergyJSON = (raw) => {
    try {
      // remove ```json and ``` if present
      const cleaned = raw.replace(/```json\s*/, "").replace(/```/, "");
      return JSON.parse(cleaned);
    } catch (err) {
      console.error("Failed to parse allergy JSON:", raw, err);
      return null;
    }
  };

export {postGemini};