import { useDispatch } from "react-redux";
import { Button } from "../ui/button";
import { logout } from "@/lib/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { LogOutIcon } from "lucide-react";

export default function LogoutButton(){
    const dispatch= useDispatch();
    const Router = useRouter();
    const handleLogout = () => {
        dispatch(logout())
        Router.push("/")
      }
    return(
         <Button onClick={handleLogout} className="flex w-full">
            Logout
            <LogOutIcon/>
            </Button>
    )
}