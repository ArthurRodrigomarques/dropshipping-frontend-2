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
      <div className='mt-20 w-[100%]'>
        <div className='flex items-center justify-center h-screen flex-wrap gap-6'>
          {products.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id}>
              <ul className='sm:w-64 w-92 sm:h-80 h-96 mb-10 border rounded-xl flex flex-col justify-between'>
                {product.images.length > 0 ? (
                  <Image  
                    className="sm:w-[90%] sm:h-[20vh] h-[30vh] sm:ml-[5%] mr-[5%] pt-3 rounded"
                    priority
                    src={product.images[0].imageUrl}
                    alt="Imagem do Produto"
                    width={400}
                    height={400}
                  />
                ) : (
                  <div className="placeholder-image">
                    {/* Placeholder content */}
                  </div>
                )}
                <div>
                  <li className='ml-5 w-[90%] text-sm mt-1'>{product.name}</li>
                  <li className='ml-5'>R$ {formatPrice(product.price)}</li>
                </div>
                <Button className='ml-[5%] w-[80%] mb-3'>Adicionar ao carrinho</Button>
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
