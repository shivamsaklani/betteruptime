import type React from "react"
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex justify-center mt-5 max-w-full">
        {children}
    </div>
  )
}
