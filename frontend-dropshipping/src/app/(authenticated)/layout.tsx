import { ThemeToggle } from "@/components/themeToggle"
import UserNav from "@/components/user-nav"
import { AuthProvider } from "@/services/AuthContext"
import Logo from "../../../public/Fizmo.png"
import Link from "next/link"
import Image from "next/image"
export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (

      <section className="min-h-screen flex flex-col" >
        <div className="flex w-[100%] bg-secondary justify-between pt-4 pb-2 pl-20 pr-20">
        <div>
          <ThemeToggle/>
        </div>
        <div>
        <Link href="/"><Image src={Logo} alt="Centralized Image" className="h-16 w-auto"/></Link>
        </div>
        <div>
            <UserNav/>
        </div>
        </div>
        {children}
      </section>

    )
  }