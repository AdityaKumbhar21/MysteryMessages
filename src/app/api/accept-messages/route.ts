import { User } from "next-auth";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/userModel";
import { authOptions } from "../auth/[...nextauth]/options";



export async function POST(request: Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Unauthorized access"
        }, {status: 401})
    }

    const userId = user._id

    try {
        const {acceptMessage} = await request.json()
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessages: acceptMessage},
            {new: true}  
        )

        if(!updatedUser){
            return Response.json({
                    success: false,
                    message: 'Unable to find user to update message acceptance status',
                },
                { status: 404 }
            );
        }
        return Response.json({
                    success: true,
                    message: 'Accepting message status changed successfully',
                    updatedUser
                },
                { status: 200 }
            );
        
    } catch (error) {
        console.log("Updating accepting message status error:  ",error);
        return Response.json({
            success: false,
            message: "Error in Updating accepting message status"
        }, {status: 500})
    }

}


export async function GET(request: Request){
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Unauthorized access"
        }, {status: 401})
    }

    const userId = user._id

    try {
        const user = await UserModel.findById(userId)
        if(!user){
            return Response.json({
                    success: false,
                    message: 'User not found',
                },
                { status: 404 }
            );
        }

        return Response.json({
                    success: true,
                    message: 'Status fetched successfully',
                    isAcceptingMessages: user.isAcceptingMessages
                },
                { status: 200 }
            );
        
    } catch (error) {
        console.log("Error in getting accepting message status:  ",error);
        return Response.json({
            success: false,
            message: "Error in getting accepting message status"
        }, {status: 500})
    }
}