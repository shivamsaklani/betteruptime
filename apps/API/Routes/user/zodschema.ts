import {z} from "zod";

export const userSchema  = z.object({
        username: z.string().min(3),
        email:z.email(),
        password: z.string().min(3,{message:"minimum length should be 3"})
});