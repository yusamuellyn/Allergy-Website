import express from "express";
import { postPlaces } from "../controllers/allergyController.js";

const router = express.Router();

router.post("/places", postPlaces);

export default router;