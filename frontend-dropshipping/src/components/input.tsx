import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function InputNavigation() {
    return(
        <div className="flex justify-center items-center ">
            <div className="flex w-full max-w-xl mt-4 ">
                <Input 
                    className="w-[100%]"
                    type="search" 
                    placeholder="Pesquisar Produtos"
                     />
                <Button type="submit">Pesquisar</Button>
            </div>
        </div>
    )
}