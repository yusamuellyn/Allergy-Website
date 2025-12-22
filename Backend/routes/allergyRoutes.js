import express from "express";
import {  getAnalyzeData } from "../controllers/analyze.controller.js";
import {postPlaces, getAllData} from  "../controllers/places.controller.js";

const router = express.Router();

router.post("/postPlaces", postPlaces);
router.get("/analyzePlaces", getAnalyzeData );
router.get("/getAllData", getAllData);

export default router;