"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Input } from './ui/input';

export default function InputNavigation() {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const router = useRouter();

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm) return;

        router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
    };

    return (
        <div className="flex justify-center items-center">
            <div className="flex w-full max-w-xl mt-4">
                <form onSubmit={handleSearchSubmit} className="flex w-full">
                    <Input
                        className="w-[100%]"
                        type="search"
                        placeholder="Pesquisar Produtos"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <Button type="submit">Pesquisar</Button>
                </form>
            </div>
        </div>
    );
}
