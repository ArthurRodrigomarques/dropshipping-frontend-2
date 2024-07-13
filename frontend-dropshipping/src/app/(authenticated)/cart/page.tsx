"use client"

import { useCart } from '../../../services/CartContext';
import { Button } from '../../../components/ui/button';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HoverCard, HoverCardTrigger } from '@/components/ui/hover-card';
import Link from 'next/link';

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
    <div className='mt-20'>
      <h1 className='text-center'>Carrinho</h1>
      <div className='container mx-auto mt-20 flex w-[100%] md:flex-nowrap flex-wrap'>
      
    <Table className='md:w-[80%]'>
      <TableCaption>cebola</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead >Produto</TableHead>
          <TableHead >Quantidade</TableHead>
          <TableHead>Preço</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cart.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <div>
            <TableCell>{item.quantity}</TableCell>
              <p className='text-sm text-slate-500 hover:cursor-pointer underline' 
              onClick={() => removeFromCart(item.id)}>excluir</p>
            </div>
            <TableCell>{item.price.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell   colSpan={3}>Total: </TableCell>
          <TableCell className="text-right">R$ {total.toFixed(2)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
    <Card className='md:w-[40%] p-10'>
        <h2 className='text-2xl font-bold mb-5 '>Total: R$ {total.toFixed(2)}</h2>
        <div className='flex flex-col gap-4'> 
          <Button className='' onClick={handleCheckout}>Finalizar Compra</Button>
          <Button><Link href="/">Continuar Comprando</Link></Button>
        </div>
        </Card>
        </div>
    </div>
  );
};

export default Cart;
