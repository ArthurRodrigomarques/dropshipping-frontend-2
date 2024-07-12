'use client';

import Image from 'next/image';
import { useCart } from '../../../services/CartContext';
import { Button } from '../../../components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: { imageUrl: string }[];
}

const ProductClient = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    router.push('/cart');
  };

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
          <div className='mt-4'>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              className="border p-2 w-20"
            />
          </div>
          <Button className='mt-6' onClick={handleAddToCart}>Adicionar ao carrinho</Button>
        </div>
      </div>
      <div><p className='mt-4'>{product.description}</p></div>
    </div>
  );
};

function formatPrice(price: number) {
  return price.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

export default ProductClient;
