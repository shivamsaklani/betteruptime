import {z} from "zod";


export const signin = z.object({
        email:z.email(),
        password: z.string().min(3,{message:"minimum length should be 3"})
});
export const userSchema  = signin.extend({
        username:z.string()
})
