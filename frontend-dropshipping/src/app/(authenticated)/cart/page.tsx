"use client";

import { useCart } from '../../../services/CartContext';
import { Button } from '../../../components/ui/button';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { Card } from '../../../components/ui/card';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import stripePromise from '@/lib/stripe';

const Cart = () => {
  const { cart, removeFromCart, clearCart, total } = useCart();
  const router = useRouter();
  const [userSellerId, setUserSellerId] = useState<string | null>(null);

  const seller = process.env.NEXT_PUBLIC_SELLER_ID

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
  }, []);

  const handleCheckout = async () => {
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

      const { error } = await stripe!.redirectToCheckout({
        sessionId: sessionId,
      });

      if (error) {
        console.error('Erro ao redirecionar para o checkout:', error);
      }
    } catch (error) {
      console.error('Erro ao finalizar compra:', error);
    }
  };

  if (cart.length === 0) {
    return <div className='container mx-auto mt-20'>Seu carrinho está vazio.</div>;
  }

  return (
    <div className='mt-20'>
      <h1 className='text-center'>Carrinho</h1>
      <div className='container mx-auto mt-20 flex w-[100%] md:flex-nowrap flex-wrap'>
        <Table className='md:w-[80%]'>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Preço</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cart.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <div className='flex'>
                    {item.images.length > 0 ? (
                      <Image
                        alt="Product image"
                        className="aspect-square rounded-md object-cover"
                        height={64}
                        src={item.images[0].imageUrl}
                        width={64}
                      />
                    ) : (
                      <div className="placeholder-image">
                        {/* Placeholder content */}
                      </div>
                    )}
                    <p className='mt-4 ml-2'>{item.name}</p>
                  </div>
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.price.toFixed(2)}</TableCell>
                <TableCell>
                  <p className='text-sm text-slate-500 hover:cursor-pointer underline'
                     onClick={() => removeFromCart(item.id)}>excluir</p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total:</TableCell>
              <TableCell className="text-right">R$ {total.toFixed(2)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <Card className='md:w-[40%] p-10'>
          <h2 className='text-2xl font-bold mb-5'>Total: R$ {total.toFixed(2)}</h2>
          <div className='flex flex-col gap-4'>
            <Button onClick={handleCheckout}>Finalizar Compra</Button>
            <Button><Link href="/">Continuar Comprando</Link></Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Cart;
