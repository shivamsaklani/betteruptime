"use client"
import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card"
import DeleteBox from "./DeleteBox"

export const WebsiteEdits = ({websiteid}:{
    websiteid:string
})=>{

    const [show,setshow]=useState<Boolean>(false);

    return(
        <div>
            <Card className="grid grid-rows-2">
                      <CardHeader>Danger</CardHeader>
                <CardContent className="flex justify-center">
                    <Button onClick={()=>setshow(true)} variant={"default"} className="w-full h-10 flex" >Delete Website</Button>
                </CardContent>
            </Card>
               <div className=" justify-center align-center  flex">
            {show && <DeleteBox setNo={()=>setshow(false)} websiteId={websiteid} />}
            </div>
        </div>
    )
}