// components/Products.tsx

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
      <div className='mt-20'>
        <div className='lg:grid lg:grid-cols-3 sm:grid sm:grid-cols-2 grid grid-cols-1 justify-items-center'>
          {products.map((product) => (
            <Link href="/" key={product.id}>
              <ul className='pb-4'>
                {product.images.length > 0 ? (
                  <Image
                    className="sm:w-[90%] sm:h-[20vh] h-[30vh] sm:ml-[5%] mr-[5%]"
                    priority
                    src={product.images[0].imageUrl}
                    alt="Imagem do Produto"
                    width={400}
                    height={400}
                  />
                ) : (
                  <div className="placeholder-image">

                  </div>
                )}
                <li className='ml-5 w-[320px]'>{product.name}</li>
                <li className='ml-5'>R$ {formatPrice(product.price)}</li>
                <Button className='ml-[5%]'>Adicionar ao carrinho</Button>
              </ul>
            </Link>
          ))}
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
