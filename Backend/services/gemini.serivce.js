import { GoogleGenerativeAI } from "@google/generative-ai";
import Data from "../models/Data.js";

const parseAllergyJSON = (raw) => {
    try {
        const cleaned = raw.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
        return JSON.parse(cleaned);
    } catch {
        return null;
    }
};

export const analyzeMenuAllergies = async (menuText, place_id, name) => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash"
    });

    const prompt = `
Analyze the following restaurant menu for food allergy risk. If you dont have the menu go off the name and place_id. 

Menu:
${menuText}

Respond ONLY with valid JSON:
{
  "risk_score": number between 1 and 100 with 100 meaning the safest. Be fair and lenient.
  "top_allergies": ["allergy1", "allergy2", "allergy3"]
}
`;

    try {
        const result = await model.generateContent(prompt);

        // <<< FIX HERE >>>
        const raw = await result.response.text();
        console.log(raw);
        const parsed = parseAllergyJSON(raw);

        if (parsed) {
            await Data.updateOne(
                { place_id },
                { $set: { allergyAnalysis: parsed } }
            );
        }

        await new Promise(r => setTimeout(r, 400));

        return parsed;

    } catch (err) {
        console.error("Gemini error for", name || place_id, ":", err);
        return null;
    }
};
