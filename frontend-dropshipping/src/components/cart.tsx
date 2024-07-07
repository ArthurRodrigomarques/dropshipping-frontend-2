import { MdAddShoppingCart } from "react-icons/md";
import { Button } from "./ui/button";

export default function Cart() {
    return( 
        <Button className="flex">
            <MdAddShoppingCart />
            <p className="hidden md:block">Carrinho</p>
        </Button>
    )
}