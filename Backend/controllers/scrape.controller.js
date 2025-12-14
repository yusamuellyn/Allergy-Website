import asyncHandler from "express-async-handler";
import axios from "axios";
import Data from "../models/Data.js";
import * as cheerio from "cheerio";


const fetchHTML = async (url) => {
    try {
        const { data } = await axios.get(url, {
            timeout: 10000,
            headers: { "User-Agent": "Mozilla/5.0" }
        });
        return data;
    } catch {
        return null;
    }
};
// Find menu link on homepage
const findMenuLink = ($, baseUrl) => {
    const keywords = ["menu", "our-menu", "food", "order"];
    let link = null;

    $("a").each((_, el) => {
        const text = ($(el).text() || "").toLowerCase();
        if (keywords.some(k => text.includes(k))) {
            link = $(el).attr("href");
            if (link && !link.startsWith("http")) {
                link = new URL(link, baseUrl).href;
            }
            return false; // stop iterating
        }
    });

    return link;
};

// Extract menu items from HTML
const extractMenuText = (html) => {
    const $ = cheerio.load(html);
    const textLines = $("body").text().split("\n").map(l => l.trim()).filter(Boolean);

    let menuText = "";
    for (const line of textLines) {
        if (line.match(/\$|\b(chicken|beef|pasta|salad|burger|rice|fish|steak|soup|egg|dessert|pizza|sandwich)\b/i)) {
            menuText += line + " ";
        }
    }

    return menuText.trim().slice(0, 4000);
};

// Main scraping function
const getWebScrape = asyncHandler(async (req, res) => {
    const allRestaurants = await Data.find();
    const results = [];
    const text = [];

    for (const restaurant of allRestaurants) {
        if (!restaurant.website) continue;

        let menuText = null;

        // Step 1: Fetch homepage HTML
        const homepageHTML = await fetchHTML(restaurant.website);
        if (!homepageHTML) continue;

        const $ = cheerio.load(homepageHTML);

        // Step 2: Try to find a menu link
        const menuLink = findMenuLink($, restaurant.website);

        if (menuLink) {
            const menuHTML = await fetchHTML(menuLink);
            if (menuHTML) menuText = extractMenuText(menuHTML);
        }

        // Step 3: Fallback to homepage if menu page is empty
        if ((!menuText || menuText.length < 200) && homepageHTML) {
            menuText = extractMenuText(homepageHTML);
        }

        if (!menuText) continue;

        // Step 4: Update MongoDB
        await Data.updateOne(
            { place_id: restaurant.place_id },
            { $set: { menuText } }
        );

        results.push({
            place_id: restaurant.place_id,
            name: restaurant.name
        });
        

        text.push({
            lol: menuText
        })

        // Be polite with scraping
        await new Promise(r => setTimeout(r, 300));
    }

    res.json({
        scraped: results.length,
        results,
        text
    });
});

export {getWebScrape}
  