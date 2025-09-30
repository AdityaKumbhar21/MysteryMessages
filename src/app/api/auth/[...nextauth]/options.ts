import CredentialsProvider from "next-auth/providers/credentials"
import { NextAuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/userModel";
import bcrypt from "bcrypt"



export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {
            identifier: {type: "text"},
            password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any>{
                await dbConnect()

                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {email: credentials.identifier},
                            {username: credentials.identifier},
                        ]
                    })

                    if(!user){
                        throw new Error("User does not exist")
                    }

                    if(!user.isVerified){
                        throw new Error("Verify your email before login")
                    }

                    const checkPassword = await bcrypt.compare(credentials.password, user.password)

                    if(!checkPassword){
                        throw new Error("Incorrect Password")
                    }
                    return user
                } catch (err: any) {
                    throw new Error(err)
                }
            }
        })
    ],
    callbacks:{
        async session({ session, user, token }) {
            if(token){
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username
            }
            return session
        },
        async jwt({ token, user }) {
            if(user){
                token._id = user._id;
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username
            }
            return token
        }
    },
    pages:{
        signIn: "/sign-in"
    },
    session:{
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,

}