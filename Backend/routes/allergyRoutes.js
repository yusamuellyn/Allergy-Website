import express from "express";
import {  getWebScrape } from "../controllers/scrape.controller.js";
import {postPlaces, getAllData} from  "../controllers/places.controller.js";
import { postGemini } from "../controllers/gemini.controller.js";
const router = express.Router();

router.post("/places", postPlaces);
router.post("/data",postGemini);
router.get("/scrape", getWebScrape);
router.get("/places", getAllData);


export default router;