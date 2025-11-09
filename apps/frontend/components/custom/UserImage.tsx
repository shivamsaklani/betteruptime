import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

const UserImage = ({image,email}:{
    image?:string,
    email?:string
})=>{
      const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
    return(
        <Avatar className="h-8 w-8 ring-4 ring-background shadow-md transition-transform duration-300 group-hover:scale-105">
                  <AvatarImage
                    src={image}
                    alt="User avatar"
                  />
                  <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary to-accent text-primary-foreground">
                    {image? getInitials(email||"U") : "U"}
                  </AvatarFallback>
                </Avatar>
    )
}

export default UserImage;