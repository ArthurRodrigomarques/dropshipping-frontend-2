'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchProducts } from '@/services/search';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    price: number;
    images: { imageUrl: string }[];
}

const SearchResults = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get('query');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (query) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const data = await fetchProducts(query);
                    const normalizedSearchTerm = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
                    const filteredData = Array.isArray(data)
                        ? data.filter(product => 
                            product.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(normalizedSearchTerm)
                        )
                        : [data];

                    setSearchResults(filteredData);
                } catch (error) {
                    console.error('Erro ao buscar produtos:', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [query]);

    if (loading) {
        return <p>Carregando...</p>;
    }

    return (
        <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8'>
            <h1 className='text-center text-2xl mt-4 mb-10'>Resultados da Busca</h1>
            {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {searchResults.map((product) => (
                        <Link href={`/product/${product.id}`} key={product.id}>
                            <ul className="group flex flex-row sm:flex-col items-center sm:items-start p-4 rounded-lg w-full border">
                            {product.images.length > 0 ? (
                            <div className="w-1/3 sm:w-full aspect-w-1 aspect-h-1 overflow-hidden rounded-lg flex-shrink-0">
                            <Image
                                className="object-cover object-center group-hover:opacity-75 w-full h-full"
                                priority
                                src={product.images[0].imageUrl}
                                alt="Imagem do Produto"
                                width={200}
                                height={200}
                            />
                                </div>
                                ) : (
                                    <div className="placeholder-image w-1/3 sm:w-full">
                                    {/* Placeholder content */}
                                    </div>
                                )}
                                    <div className="ml-4 sm:ml-0 sm:mt-4 w-full text-left sm:text-center">
                                        <li className="text-sm">{product.name}</li>
                                        <li className="mt-1 text-lg font-medium">R$ {formatPrice(product.price)}</li>
                                        </div>
                            </ul>
                        </Link>
                    ))}
                </div>
            ) : (
                <p>Nenhum resultado encontrado</p>
            )}
        </div>
    );
};

function formatPrice(price: number) {
    return price.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }
  

export default SearchResults;
