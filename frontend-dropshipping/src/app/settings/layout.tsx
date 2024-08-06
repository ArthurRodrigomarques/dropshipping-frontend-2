import { ThemeToggle } from "@/components/themeToggle"
import UserNav from "@/components/user-nav"
import Image from "next/image"
import Link from "next/link"
import Logo from "../../../public/Fizmo.png"

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
        <div className="flex-1 flex justify-center">
          <Link href="/"><Image src={Logo} alt="Centralized Image" className="h-16 w-auto"/></Link>
        </div>
        <div>
            <UserNav/>
        </div>
        </div>
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold">Settings</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav
            className="grid gap-4 text-sm" x-chunk="dashboard-04-chunk-0"
          >
            <Link className="hover:text-primary" href="/settings/account">Minha Conta</Link>
            <Link className="hover:text-primary" href="/settings/adress">Endereço</Link>
            <Link className="hover:text-primary" href="/settings/setting">Configurações</Link>
            <Link className="hover:text-primary" href="#">Minhas Compras</Link>
          </nav>
          <div className="grid gap-6">
          {children}
          </div>
        </div>
      </main>

      </section>

    )
  }