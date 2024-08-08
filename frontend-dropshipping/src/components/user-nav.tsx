"use client";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/services/AuthContext";
import { useContext } from "react";
import Link from "next/link";

export default function UserNav() {
    const { user, logout } = useContext(AuthContext);
    const router = useRouter();

    return (
        <div className="flex mt-1">
            {user ? (
                <>
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
                                    <p className="text-sm font-medium leading-none">{user.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <Link href="/settings/account">
                                    <DropdownMenuItem className="cursor-pointer">
                                        Perfil  
                                    </DropdownMenuItem>
                                </Link>
                                <Link href="/settings/setting">
                                    <DropdownMenuItem className="cursor-pointer">
                                        Configurações  
                                    </DropdownMenuItem>
                                </Link>
                                <Link href="/settings/my_purchases">
                                    <DropdownMenuItem className="cursor-pointer">
                                        Minhas Compras  
                                    </DropdownMenuItem>
                                </Link>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logout}>
                                Sair
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="mt-1 ml-1 hidden md:block">
                        Minha conta
                    </div>
                </>
            ) : (
                <Button className="" onClick={() => router.push("/login")}>
                    Entrar
                </Button>
            )}
        </div>
    );
}
