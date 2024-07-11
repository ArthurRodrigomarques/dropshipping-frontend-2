// app/products/[productid]/page.tsx

import axios from 'axios';
import Image from 'next/image';
import { Button } from '../../../components/ui/button';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: { imageUrl: string }[];
}

async function getProduct(id: string): Promise<Product> {
  const res = await axios.get<Product>(`http://localhost:3333/get-unique-product/${id}`);
  if (res.status !== 200) {
    console.error('Error fetching product:', res.statusText);
    throw new Error('Failed to fetch product');
  }
  return res.data;
}

const ProductPage = async ({ params }: { params: { productid: string } }) => {
  try {
    const product = await getProduct(params.productid);

    return (
      <div className='container mx-auto mt-20'>
        <div className='flex flex-col sm:flex-row'>
          {product.images.length > 0 && (
            <Image
              className="rounded"
              src={product.images[0].imageUrl}
              alt="Imagem do Produto"
              width={500}
              height={500}
            />
          )}
          <div className='sm:ml-10 mt-5 sm:mt-0'>
            <h1 className='text-3xl font-bold'>{product.name}</h1>
            <p className='text-xl mt-2'>R$ {formatPrice(product.price)}</p>
            <Button className='mt-6'>Adicionar ao carrinho</Button>
          </div>
        </div>
        <div><p className='mt-4'>{product.description}</p></div>
      </div>
    );
  } catch (error) {
    console.error('Erro ao buscar dados do produto:', error);
    return <div>Erro ao buscar dados do produto</div>;
  }
};

function formatPrice(price: number) {
  return price.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

export default ProductPage;
