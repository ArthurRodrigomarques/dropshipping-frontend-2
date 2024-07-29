"use client";

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { fetchProducts } from '@/services/search';

interface Product {
    id: string;
    name: string;
    // Adicione outros campos necessários aqui, se houver
}

export default function InputNavigation() {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm) return;

        try {
            const data = await fetchProducts(searchTerm);

            const normalizedSearchTerm = searchTerm.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            const filteredData = Array.isArray(data)
                ? data.filter(product => 
                    product.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(normalizedSearchTerm)
                )
                : [data];

            setSearchResults(filteredData);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        }
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
            <div>
                {searchResults.length > 0 ? (
                    <ul>
                        {searchResults.map((result: Product) => (
                            <li key={result.id}>{result.name}</li>
                        ))}
                    </ul>
                ) : (
                    <p>Nenhum resultado encontrado</p>
                )}
            </div>
        </div>
    );
}
