import {z} from "zod"


export const usernameValidation = z.string()
    .min(3, { message: "Username must be at least 3 characters long." })
    .max(20, { message: "Username cannot be longer than 20 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, { message: "Username must contain only letters, numbers, and underscores." })


export const SignUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
            message: "Password must include at least one uppercase, one lowercase, one number, and one special character."
        }),
})