"use client"

import React, { useContext } from 'react';
import { AuthContext } from '../services/AuthContext';
import { Button } from './ui/button';
import Link from 'next/link';

const ButtonAdmin = () => {
    const { user } = useContext(AuthContext);

    const isAdminOrVendor = user?.userAccess.some(access => 
        access.Access.name === 'adm' || access.Access.name === 'Vendedor'
    );

    return (
        <div>
            {isAdminOrVendor && (
                <Link href="/admin"><Button>Botão para Admin e Vendedor</Button></Link>
            )}
        </div>
    );
};

export default ButtonAdmin;
