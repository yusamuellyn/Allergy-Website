import axios from "axios";
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
export const scrapeMenuFromWebsite = async (website) => {
    if (!website) return null;

    const homepageHTML = await fetchHTML(website);
    if (!homepageHTML) return null;

    const $ = cheerio.load(homepageHTML);
    const menuLink = findMenuLink($, website);

    let menuText = null;

    if (menuLink) {
        const menuHTML = await fetchHTML(menuLink);
        if (menuHTML) menuText = extractMenuText(menuHTML);
    }

    if (!menuText || menuText.length < 200) {
        menuText = extractMenuText(homepageHTML);
    }

    return menuText || null;
};