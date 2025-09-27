import {z} from "zod"



export const SignInSchema = z.object({
    identifiew: z.string(),
    password: z.string()
})




