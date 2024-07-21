"use client"

import { useState } from 'react';
import { useCart } from '../../../../services/CartContext';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import stripePromise from '@/lib/stripe';
import { Button } from '../../../../components/ui/button';

const Checkout = () => {
  const { cart, total } = useCart();
  const router = useRouter();

  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const stripe = await stripePromise;

    if (!stripe) {
      console.error('Stripe não carregado');
      return;
    }

    try {
      const response = await api.post('/create-checkout-session', {
        products: cart.map(item => ({ id: item.id, quantity: item.quantity })),
        customerInfo,
      });

      const { sessionId } = response.data;

      if (!sessionId) {
        console.error('ID da sessão não recebido');
        return;
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        console.error('Erro ao redirecionar para o checkout:', error);
      }
    } catch (error) {
      console.error('Erro ao finalizar compra:', error);
    }
  };

  return (
    <div className="container mx-auto mt-20">
      <h1 className="text-center">Dados do Cliente</h1>
      <form onSubmit={handleSubmit} className="mt-10">
        <div>
          <label>
            Nome:
            <input
              type="text"
              name="name"
              value={customerInfo.name}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={customerInfo.email}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Endereço:
            <input
              type="text"
              name="address"
              value={customerInfo.address}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <Button type="submit">Continuar para Pagamento</Button>
      </form>
    </div>
  );
};

export default Checkout;
