import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import Data from "../models/Data.js";

const parseAllergyJSON = (raw) => {
    try {
        const cleaned = raw.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
        return JSON.parse(cleaned);
    } catch {
        return null;
    }
};

const normalizeAnalysis = (parsed) => {
    if (!parsed || typeof parsed.risk_score !== "number" || !Array.isArray(parsed.top_allergies)) {
        return null;
    }
    const risk = Math.min(100, Math.max(1, Math.round(parsed.risk_score)));
    const top_allergies = parsed.top_allergies
        .filter((a) => typeof a === "string" && a.trim())
        .map((a) => a.trim().toLowerCase())
        .slice(0, 8);
    return { risk_score: risk, top_allergies };
};

/** When Gemini fails or returns unusable JSON — still show something in the UI. */
const fallbackAnalysis = (name) => ({
    risk_score: 72,
    top_allergies: [
        "unknown — verify with staff",
        "menu unavailable online",
        name ? `limited data: ${name.slice(0, 40)}` : "limited data"
    ]
});

const buildPrompt = (menuText, name, address) => {
    const hasMenu = Boolean(menuText && menuText.trim().length > 0);
    const locationLine = address ? `Location (approximate): ${address}` : "";

    if (hasMenu) {
        return `
You are analyzing restaurant menus for food allergy risk.

risk_score is an integer from 1 to 100:
- Higher values mean GREATER danger for people with food allergies (more caution needed).
- Lower values mean relatively lower concern based on the menu.

Base your analysis primarily on the provided menu text.

Consider:
- Common allergens (gluten, dairy, soy, eggs, shellfish, peanuts, tree nuts, sesame)
- Fried, battered, breaded, or shared-fryer items
- Sauces, marinades, dressings (hidden allergens)
- Menu complexity and lack of allergen labeling or allergy-friendly options

Do not assume accommodations unless the menu states them. Default to cautious judgments.

Restaurant: ${name || "Unknown"}
${locationLine}

Menu:
${menuText}

Return JSON only: risk_score and top_allergies (most relevant strings, typically 1–3 items).
`;
    }

    return `
No menu text could be scraped from the website. You must still output valid JSON.

Use ONLY the restaurant name and optional location to infer likely cuisine style and typical allergen exposure.
Be conservative: without a menu, assume higher uncertainty and typical restaurant cross-contact risk.

risk_score is an integer from 1 to 100:
- Higher values mean GREATER danger or uncertainty for people with food allergies.

Restaurant name: ${name || "Unknown restaurant"}
${locationLine}

Infer cautiously (e.g. pizza → gluten/dairy; sushi → fish/soy/sesame; diner → eggs/dairy/gluten).
Do not invent specific menu items. Acknowledge limited information in top_allergies phrasing if needed.

Return JSON only: risk_score and top_allergies (1–3 short strings).
`;
};

export const analyzeMenuAllergies = async (menuText, dataDocId, name, options = {}) => {
    const { address } = options;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: SchemaType.OBJECT,
                properties: {
                    risk_score: {
                        type: SchemaType.INTEGER,
                        description:
                            "Allergy risk level from 1 (lowest concern) to 100 (severe concern for people with food allergies)."
                    },
                    top_allergies: {
                        type: SchemaType.ARRAY,
                        items: { type: SchemaType.STRING },
                        description: "Up to three most relevant allergens or risk factors implied by the menu."
                    }
                },
                required: ["risk_score", "top_allergies"]
            },
            temperature: 0.3
        }
    });

    const prompt = buildPrompt(menuText, name, address);

    try {
        const result = await model.generateContent(prompt);
        const raw = result.response.text();
        const parsed = parseAllergyJSON(raw);
        let analysis = normalizeAnalysis(parsed);
        if (!analysis) {
            analysis = fallbackAnalysis(name);
        }

        await Data.updateOne(
            { _id: dataDocId },
            { $set: { allergyAnalysis: analysis } }
        );

        await new Promise(r => setTimeout(r, 400));

        return analysis;

    } catch (err) {
        console.error("Gemini error for", name || String(dataDocId), ":", err);
        const analysis = fallbackAnalysis(name);
        try {
            await Data.updateOne(
                { _id: dataDocId },
                { $set: { allergyAnalysis: analysis } }
            );
        } catch (dbErr) {
            console.error("Failed to save fallback allergy analysis:", dbErr);
        }
        return analysis;
    }
};
