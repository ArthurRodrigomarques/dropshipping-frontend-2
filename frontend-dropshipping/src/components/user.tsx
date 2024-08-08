"use client";

import { AuthContext } from "@/services/AuthContext";
import { useContext } from "react";
import { Card } from "./ui/card";

export default function User() {
    const { user } = useContext(AuthContext);

    return (
        <div className="">
            {user ? (
                    <div>
                        <h1 className="text-2xl mb-6">Dados da sua conta</h1>
                            <div className="font-normal">
                                <Card className="p-6 mb-2">
                                <div>
                                    <p className="text-sm">Nome de usuário</p>
                                    <p className="text-base font-medium leading-none">{user.name}</p>
                                </div>
                                </Card>
                                <Card className="p-6">
                                    <div>
                                    <p>Email:</p> 
                                <p className="text-base leading-none text-muted-foreground"> {user.email}</p>
                                    </div>
                                </Card>
                            </div>
                    
                    </div>
            ) : (
<div>Carregando dados de usuário</div>
            )}
        </div>
    );
}
