import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';

interface Product {
  id: string;
  name: string;
  price: number;
  images: { imageUrl: string }[];
}

export async function Products() {
  try {
    const response = await axios.get<Product[]>("http://localhost:3333/products");
    const products = response.data;

    return (
      <div className='bg-white'>
        <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8'>
        <h2 className="sr-only">Products</h2>
        <div className='grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8'> 
          {products.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id}>
              <ul className='group'>
                {product.images.length > 0 ? (
                  <div className='aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7'>
                  <Image  
                    className="h-full w-full object-cover object-center group-hover:opacity-75"
                    priority
                    src={product.images[0].imageUrl}
                    alt="Imagem do Produto"
                    width={400}
                    height={400}
                  />
                  </div>
                ) : (
                  <div className="placeholder-image">
                    {/* Placeholder content */}
                  </div>
                )}
                <div>
                  <li className='mt-4 text-sm text-gray-700'>{product.name}</li>
                  <li className='mt-1 text-lg font-medium text-gray-900'>R$ {formatPrice(product.price)}</li>
                </div>
              </ul>
            </Link>
          ))}
        </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Erro ao buscar dados da API:", error);
    return <div>Erro ao buscar dados da API</div>;
  }
}

function formatPrice(price: number) {
  return price.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

export default Products;
