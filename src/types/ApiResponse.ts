import { Message } from "@/models/messageModel"

export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessages ?: boolean;
    messages?: Array<Message>
}