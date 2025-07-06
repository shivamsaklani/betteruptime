import { ReactNode } from "react"

export default function DashLayout({children}:{
    children:ReactNode
}){
    return(
        <div>
            {children}
        </div>
    )
}