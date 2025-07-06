import Link from "next/link";

export default function Home(){
    return(
        <>
        <div className="flex h-screen w-screen">
            <div className="justify-center bg-red-300 items-center">
            <div>
            <Link href="/Dashboard">Dashboard</Link>
            </div>
            </div>
        </div>
        </>
        
    )
}