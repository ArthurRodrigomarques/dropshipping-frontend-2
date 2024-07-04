import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";


export default function UserNav() {
    return(
        <div className="flex mt-1 ">
            
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/ArthurRodrigomarques.png" alt="@shadcn" />
                <AvatarFallback>SC</AvatarFallback>
                </Avatar>
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">tutu</p>
                <p className="text-xs leading-none text-muted-foreground">
                    test@example.com
                </p>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem>
                Perfil
                </DropdownMenuItem>
                <DropdownMenuItem>
                Configurações
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
                Sair
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <div className="mt-1 ml-1">
            Minha conta
        </div>
        </div>
    )
}