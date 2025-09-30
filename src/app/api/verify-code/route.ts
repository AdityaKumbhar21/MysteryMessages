import UserModel from "@/models/userModel"
import dbConnect from "@/lib/dbConnect"

export async function POST(request: Request){
    await dbConnect()

    try {
        const {username, verifyCode} = await request.json()
        

        const user = await UserModel.findOne({username})

        if(!user){
            return Response.json({
            success: false,
            message: "User not found"
        }, {status: 400})
        }

        const isCodeValid = user.verifyCode === verifyCode
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true
            await user.save()
            return Response.json({
                success: true,
                message: "User verified successfully"
            }, {status: 200})
        }
        else if(!isCodeNotExpired){
            return Response.json({
                success: false,
                message: "Your code has expired, please sign-up again."
            }, {status: 400})
        }
        else{
            return Response.json({
                success: false,
                message: "Incorrect Code"
            }, {status: 400})
        }

        
    } catch (error) {
        console.log("Error in verifying user: ",error);
        return Response.json({
            success: false,
            message: "Error in verifying user"
        }, {status: 500})
    }
}