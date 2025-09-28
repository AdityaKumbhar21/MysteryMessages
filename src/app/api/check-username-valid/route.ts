import { z} from "zod"
import { usernameValidation } from "@/schemas/signUpSchema"
import UserModel from "@/models/userModel"
import dbConnect from "@/lib/dbConnect"


const UsernameQuerySchema = z.object({
    username: usernameValidation
})


export async function GET(request: Request){
    await dbConnect()


    try {
      const {searchParams} = new URL(request.url)
      const queryParam = {
        username: searchParams.get("username")
      }

      const result = UsernameQuerySchema.safeParse(queryParam)
      
      if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
            success: false,
            message: usernameErrors.length > 0 ? usernameErrors.join(",") : "Invalid Query Param"
        }, {status: 400})
      }

      const {username} = result.data
      const existingUserWithUsername = await UserModel.findOne({
        username,
        isVerified: true
      })

      if(existingUserWithUsername){
        return Response.json({
            success: false,
            message: "Username is already taken"
        }, {status: 400})
      }

      return Response.json({
            success: true,
            message: "Username available"
        }, {status: 200})

    } catch (error) {
        console.log("Username validation error: ",error);
        return Response.json({
            success: false,
            message: "Error checking username"
        }, {status: 500})
    }
}