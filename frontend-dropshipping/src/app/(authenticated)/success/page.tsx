"use client";

import { useEffect } from 'react';
import { useCart } from '../../../services/CartContext';
import { useRouter } from 'next/navigation';
import { GiConfirmed } from "react-icons/gi";

const Success = () => {
  const { clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    clearCart();

    const timeoutId = setTimeout(() => {
      router.push('/');
    }, 3000); // 10 segundos de atraso

    return () => clearTimeout(timeoutId);
  }, [clearCart, router]);

  return (
    <div className="container mx-auto mt-20">
      <div className="text-center text-primary">
        <div className="flex flex-col items-center">
          <GiConfirmed className="text-6xl mb-4" width={200} />
          <div className=''>
            <h1 className='font-bold text-2xl mb-10'>Compra efetuada com sucesso!</h1>
            <p>Os dados da compra estão em "Minhas Compras"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
