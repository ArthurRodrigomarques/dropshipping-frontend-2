import Image from "next/image";
import Logo from "../../public/Fizmo.png"
import { CgProfile } from "react-icons/cg";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import UserNav from "./user-nav";
import Menu from "./menu";
import Cart from "./cart";

export default function Header() {
    return(
        <div className="flex mt-1 mx-auto">
            <Menu/>
            <Image
                className="mx-auto"
                src={Logo}
                width={200}
                height={200}
                alt="Foto do autor"
                />
                <div>
                    <UserNav/>
                    <Cart/>
                </div>
        </div>
    )
}