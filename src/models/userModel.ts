import mongoose, {Schema, Document} from "mongoose";
import { Message, MessageSchema } from "./messageModel";




export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    isVerified: boolean;
    verifyCodeExpiry: Date;
    isAcceptingMessages: boolean;
    messages: Message[]
}



const UserSchema: Schema<User> = new Schema({
     username:{
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
     },

    email:{
        type: String,
        required: [true, "Username is required"],
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,"Enter a valid email"],
        unique: true
    },

    password:{
        type: String,
        required: [true, "Password is required"]
    },
    verifyCode: {
        type: String,
        required: [true, "Verify Code is required"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify Code Expiry is required"],
    },
    isAcceptingMessages:{
        type: Boolean,
        default: false
    },
    messages: [MessageSchema]
})


const UserModel =  mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User",UserSchema)

export default UserModel







