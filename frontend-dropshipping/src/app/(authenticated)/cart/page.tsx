"use client"

import { useCart } from '../../../services/CartContext';
import { Button } from '../../../components/ui/button';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';

const Cart = () => {
  const { cart, removeFromCart, clearCart, total } = useCart();
  const router = useRouter();

  const handleCheckout = async () => {
    try {
      await api.post('/create-sale', {
        products: cart.map(item => ({ id: item.id, quantity: item.quantity })),
        userSellerId: 'vendedor-id-aqui', 
      });
      clearCart();
      router.push('/checkout-success');
    } catch (error) {
      console.error('Erro ao finalizar compra:', error);
    }
  };

  if (cart.length === 0) {
    return <div className='container mx-auto mt-20'>Seu carrinho está vazio.</div>;
  }

  return (
    <div className='container mx-auto mt-20'>
      <h1 className='text-3xl font-bold mb-6'>Carrinho de Compras</h1>
      {cart.map(item => (
        <div key={item.id} className='mb-4'>
          <h2 className='text-2xl'>{item.name}</h2>
          <p>Preço: R$ {item.price.toFixed(2)}</p>
          <p>Quantidade: {item.quantity}</p>
          <Button onClick={() => removeFromCart(item.id)}>Remover</Button>
        </div>
      ))}
      <h2 className='text-2xl font-bold mt-6'>Total: R$ {total.toFixed(2)}</h2>
      <Button className='mt-6' onClick={handleCheckout}>Finalizar Compra</Button>
    </div>
  );
};

export default Cart;
