import mongoose, { mongo } from "mongoose";



type ConnectionObject = {
    isConnected ?: Number
}


const connection: ConnectionObject = {}

async function dbConnect(): Promise<void>{
    if(connection.isConnected){
        console.log("Database already connected");
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI ||"", {})

        connection.isConnected = db.connections[0].readyState

        console.log("DB connected Successfully");
        
    } catch (error) {
        console.log("Database connection error", error);
        process.exit(1)
    }
}


export default dbConnect