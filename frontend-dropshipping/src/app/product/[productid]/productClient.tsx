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
  const [selectedImage, setSelectedImage] = useState(product.images[0].imageUrl);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    router.push('/cart');
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setQuantity(value >= 1 ? value : 1);
  };

  return (
    <div className="container mx-auto lg:p-20 pt-20 bg-slate-100">
      <div className="flex flex-col sm:flex-row ">
        <div>
        {product.images.length > 0 && (
          <Image
            className="rounded"
            src={selectedImage}
            alt="Imagem do Produto"
            width={500}
            height={500}
          />
        )}
        <div className="flex justify-normal mt-6 space-x-4">
        {product.images.map((image, index) => (
          <div key={index} onClick={() => setSelectedImage(image.imageUrl)}>
            <Image
              className={`cursor-pointer ${selectedImage === image.imageUrl ? 'border-2 border-blue-500' : ''}`}
              src={image.imageUrl}
              alt={`Imagem ${index + 1}`}
              width={100}
              height={100}
            />
          </div>
        ))}
      </div>
      </div>
        <div className="sm:ml-10 mt-5 sm:mt-0">
          <h1 className="sm:text-2xl font-bold">{product.name}</h1>
          <p className="text-xl mt-2">R$ {formatPrice(product.price)}</p>
          <div className="mt-4">
          <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              className="border p-2 w-20 rounded-md focus:ring-2 focus:ring-purple-600 focus:outline-none appearance-none"
            />
          </div>
          <Button className="mt-6" onClick={handleAddToCart}>Adicionar ao carrinho</Button>
        </div>
      </div>


      <div className="mt-4">
        <p>{product.description}</p>
      </div>
    </div>
  );
};

function formatPrice(price: number) {
  return price.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

export default ProductClient;
