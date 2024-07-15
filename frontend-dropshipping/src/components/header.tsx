import Image from "next/image";
import Logo from "../../public/Fizmo.png"
import UserNav from "./user-nav";
// import Menu from "./menu";
import Cart from "./ButtonCart";
import { ThemeToggle } from "./themeToggle";
import ButtonAdmin from "./ButtonAdmin";

import Link from "next/link"
import {
  CircleUser,
  Menu,
  Package2,
  Search,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "./ui/button";

export default function Header() {
    
    return(
        <header className="top-0 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">

          <Link href="#" className="text-foreground transition-colors hover:text-foreground">
            Pagina Principal
          </Link>
          <ButtonAdmin />
        </nav>
        <div className="flex-1 flex justify-center">
          <Image src={Logo} alt="Centralized Image" className="h-8 w-auto"/>
        </div>
        <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium">
                <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                <Link href="#" className="hover:text-foreground">
                  Dashboard
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <div className="flex space-x-5">
            <div className="mt-1">
              <ThemeToggle />
            </div>
            <div>
              <UserNav />
            </div>
            <div className="mt-1">
              <Cart />
            </div>
          </div>
        </div>
      </header>
    )
}