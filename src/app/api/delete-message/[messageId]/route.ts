import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/models/userModel";


export async function DELETE(request: Request, {params}: {params: {messageId: string}}){
    await dbConnect();

    const session = await getServerSession(authOptions)
    const messageId = params.messageId
    const user: User =  session?.user as User

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Unauthorized Access"
        }, {status: 401})
    }
    
    try {
        const updatedResult = await UserModel.updateOne(
            {_id: user._id},
            {$pull: {messages : {_id: messageId}}}
        )

        if(updatedResult.modifiedCount === 0){
            return Response.json({
            success: false,
            message: "Message not found or already deleted"
        }, {status: 404})
        }

        return Response.json({
            success: true,
            message: "Message deleted successfully"
        }, {status: 201})


    } catch (error) {
        console.error('Error deleting message:', error);
        return Response.json(
        { message: 'Error deleting message', success: false },
        { status: 500 }
        )
    }
}