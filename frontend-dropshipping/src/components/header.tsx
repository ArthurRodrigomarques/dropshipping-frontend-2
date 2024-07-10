import Image from "next/image";
import Logo from "../../public/Fizmo.png"
import { CgProfile } from "react-icons/cg";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import UserNav from "./user-nav";
import Menu from "./menu";
import Cart from "./ButtonCart";
import { ThemeToggle } from "./themeToggle";

export default function Header() {
    return(
        <div className="flex w-[100%] bg-secondary justify-between pt-4 pb-2 pl-20 pr-20">
            <Menu/>
            <Image
                className="md:ml-[18vw] "
                priority
                src={Logo}
                width={200}
                alt="Foto"
                />
                
                <div className="flex space-x-5">
                    <div className="mt-1">
                        <ThemeToggle/>
                    </div>
                    <div>
                        <UserNav/>
                    </div>
                    <div className="mt-1">
                        <Cart/>
                    </div>
                </div>
        </div>
    )
}