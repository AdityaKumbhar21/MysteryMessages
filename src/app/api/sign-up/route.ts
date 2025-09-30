import UserModel from "@/models/userModel";
import dbConnect from "@/lib/dbConnect";
import { sendVerficationEmail } from "@/utils/sendVerficationEmail";
import bcrypt from "bcrypt"



export async function POST(request: Request) {
    try {
        await dbConnect()

        const {username, email, password} = await request.json()

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if(existingUserVerifiedByUsername){
            return Response.json({
            success: false,
            messages: "Username is already taken"
            },{
                status:401
            })
        }

        const verifyCode = Math.floor(100000 + Math.random()*900000).toString()
        const existingUserByEmail = await UserModel.findOne({email})

        if(existingUserByEmail){

            if(existingUserByEmail.isVerified){
                return Response.json({
                success: false,
                messages: "Email already exists"
                },{
                    status:401
                })
            }

            else{
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                const expiryDate = new Date()
                expiryDate.setHours(expiryDate.getHours() + 1)
                existingUserByEmail.verifyCodeExpiry = expiryDate
                await existingUserByEmail.save()
                
            }
        }

        else{
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                isVerified: false,
                verifyCodeExpiry: expiryDate,
                isAcceptingMessages: true,
                messages: []
            })

            await newUser.save()

        }


        //send verification email
        const verificationEmail = await sendVerficationEmail(email, username, verifyCode)

        if(!verificationEmail.success){
            return Response.json({
            success: false,
            messages: verificationEmail.message
            },{
                status:500
            })
        }

        return Response.json({
            success: true,
            messages: "User registered succesfully. Verify your email"
            },{
                status:201
            })
        


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