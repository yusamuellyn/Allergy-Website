import express from "express";
import allergyRoutes from "./routes/allergyRoutes.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";

dotenv.config();       
connectDB();           

const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
  }));



const port = process.env.PORT || 5000;

app.use("/api", allergyRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
