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
      <GiConfirmed/>
      <div>
      <h1 className="text-center">Compra realizada com sucesso!</h1>
      <p className="text-center">Seu carrinho foi limpo e você será redirecionado em breve.</p>
      </div>
    </div>
  );
};

export default Success;
