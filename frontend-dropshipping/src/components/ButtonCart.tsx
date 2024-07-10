import { MdAddShoppingCart } from "react-icons/md";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Cart() {
    return( 
        <Link href="/cart">
        <Button className="flex">
            <MdAddShoppingCart />
            <p className="hidden md:block">Carrinho</p>
        </Button>
        </Link>
    )
}