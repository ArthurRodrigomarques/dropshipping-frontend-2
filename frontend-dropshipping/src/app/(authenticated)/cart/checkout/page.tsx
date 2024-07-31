"use client";

import { useEffect, useState } from 'react';
import { useCart } from '../../../../services/CartContext';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import stripePromise from '@/lib/stripe';
import { Button } from '../../../../components/ui/button';

const Checkout = () => {
  const { cart, total } = useCart();
  const router = useRouter();

  const [userSellerId, setUserSellerId] = useState<string | null>(null);

  const seller = process.env.NEXT_PUBLIC_SELLER_ID;

  useEffect(() => {
    const fetchUserSellerId = async () => {
      try {
        // Verifique o endpoint e a resposta
        const response = await api.get(`/get-unique-user-id/${seller}`);
        // Verifique se response.data.id existe e é válido
        if (response.data?.id) {
          setUserSellerId(response.data.id);
        } else {
          console.error('ID do vendedor não encontrado na resposta da API');
        }
      } catch (error) {
        console.error('Erro ao obter ID do vendedor:', error);
      }
    };

    fetchUserSellerId();
  }, [seller]);

  const handleCheckout = async (event: React.FormEvent) => {
    event.preventDefault();

    const stripe = await stripePromise;

    if (!stripe) {
      console.error('Stripe não carregado');
      return;
    }

    if (!userSellerId) {
      console.error('ID do vendedor não disponível');
      return;
    }

    try {
      const response = await api.post('/create-checkout-session', {
        products: cart.map(item => ({ id: item.id, quantity: item.quantity })),
        userSellerId: userSellerId,
      });

      const { sessionId } = response.data;

      if (!sessionId) {
        console.error('ID da sessão não recebido');
        return;
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId,
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
      <form onSubmit={handleCheckout} className="mt-40">
        <Button type="submit">Continuar para Pagamento</Button>
      </form>
    </div>
  );
};

export default Checkout;
