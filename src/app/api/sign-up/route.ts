import UserModel from "@/models/userModel";
import dbConnect from "@/lib/dbConnect";
import { sendVerficationEmail } from "@/utils/sendVerficationEmail";
import bcrypt from "bcrypt"



export async function POST(request: Request) {
    try {
        await dbConnect()

        const {username, email, password} = await request.json()

    } catch (error) {
        console.error("Error in signup route: ", error);
        return Response.json({
            success: false,
            messages: "Error registering user"
        },{
            status:500
        })
        
    }


}