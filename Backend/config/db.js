import mongoose from "mongoose";


const connectDB = async () =>  {
    try{
        await mongoose.connect(process.env.MONGO_URI); 

        console.log("MONGOOB CONNECTED SUCCESSLLY!");
    } catch (error){
        console.error("Error connecting to MONGOOB", error);
        process.exit(1) //exit with failure 
    }
};

export default connectDB;