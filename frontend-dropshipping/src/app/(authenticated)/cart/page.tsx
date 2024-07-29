"use client"

import { useCart } from '../../../services/CartContext';
import { Button } from '../../../components/ui/button';
import { useRouter } from 'next/navigation';
import { Card } from '../../../components/ui/card';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import Link from 'next/link';
import Image from 'next/image';

const Cart = () => {
  const { cart, removeFromCart, clearCart, total } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    router.push('/cart/checkout');
  };

  if (cart.length === 0) {
    return <div className='flex justify-center mt-40 text-2xl'>Seu carrinho está vazio.</div>;
  }

  return (
    <div className='mt-20'>
      <h1 className='text-center text-2xl'>Carrinho</h1>
      <div className='container mx-auto mt-20 flex w-[100%] md:flex-nowrap flex-wrap'>
        <Table className='md:w-[90%]'>
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
                      className="aspect-square rounded-md object-cover "
                      height={64}
                      src={item.images[0].imageUrl}
                      width={64}
                      style={{ width: 'auto', height: 'auto' }} 
                      priority
                    />
                    ) : (
                      <div className="placeholder-image">
                        {/* Placeholder content */}
                      </div>
                    )}
                    <p className='pt-5 ml-2 md:text-base'>{item.name}</p>
                  </div>
                </TableCell>
                <TableCell className='text-base pl-10'>{item.quantity}</TableCell>
                <TableCell className='text-base'>{item.price.toFixed(2)}</TableCell>
                <TableCell className='text-base'>
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
        <Card className='md:w-[40%] w-[100%] p-10 md:mt-0 mt-10'>
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
