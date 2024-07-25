'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; 
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Copy, MoreVertical, Truck } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../../../components/ui/dropdown-menu";


interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  userId: string;
  created_at: string;
  updated_at: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Session {
  id: string;
  email: {
    address: Address;
    email: string;
    name: string;
    phone: string | null;
    tax_exempt: string;
    tax_ids: string[];
  };
  metadata: {
    address: string;
    buyerId: string;
    products: string;
    userSellerId: string;
  };
}

const SessionClient = ({ session }: { session: Session }) => {
  const router = useRouter();
  const [productDetails, setProductDetails] = useState<Product[]>([]);
  // const shippingCost = 5.00;
  const taxRate = 0.04; // 8% de taxa
  const fixedtaxa = 0.39
  const handleBack = () => {
    router.back(); 
  };

  const parsedAddress: Address = JSON.parse(session.metadata.address);

  // buscar produtos
  const fetchProduct = async (productId: string) => {
    try {
      const response = await fetch(`http://localhost:3333/get-unique-product/${productId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  };

  useEffect(() => {
    const products = JSON.parse(session.metadata.products);

    const fetchAllProducts = async () => {
      const fetchedProducts = await Promise.all(products.map(async (product: { id: string; quantity: number }) => {
        const productDetail = await fetchProduct(product.id);
        return {
          ...productDetail,
          quantity: product.quantity,
        };
      }));

      setProductDetails(fetchedProducts.filter(product => product !== null));
    };

    fetchAllProducts();
  }, [session.metadata.products]);

  const calculateSubtotal = () => {
    return productDetails.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * taxRate;
  const total = subtotal - tax - fixedtaxa;

  return (
    <div className="flex justify-center items-center min-h-screen">
      <CardContent className="w-4/5 md:w-3/5 lg:w-2/5 p-6 text-sm shadow-md rounded-lg">
      <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-lg">
                    Order Oe31b70H
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Copy className="h-3 w-3" />
                      <span className="sr-only">Copy Order ID</span>
                    </Button>
                  </CardTitle>
                  <CardDescription>Date: November 23, 2023</CardDescription>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <Button size="sm" variant="outline" className="h-8 gap-1">
                    <Truck className="h-3.5 w-3.5" />
                    <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                      Track Order
                    </span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="outline" className="h-8 w-8">
                        <MoreVertical className="h-3.5 w-3.5" />
                        <span className="sr-only">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Export</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Trash</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
        <div className="grid gap-3">
          <div className="font-semibold">Detalhes do pedido</div>
          <ul className="grid gap-3">
            {productDetails.map((product) => (
              <li key={product.id} className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {product.name} x <span>{product.quantity}</span>
                </span>
                <span>${(product.price * product.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <Separator className="my-2" />
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </li>
            {/* <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>${shippingCost.toFixed(2)}</span>
            </li> */}
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>${tax.toFixed(2)}</span>
            </li>
            <li className="flex items-center justify-between font-semibold">
              <span className="text-muted-foreground">Total</span>
              <span>${total.toFixed(2)}</span>
            </li>
          </ul>
        </div>
        <Separator className="my-4" />
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-3">
            <div className="font-semibold">Informações do Comprador</div>
            <address className="grid gap-0.5 not-italic text-muted-foreground">
              <span>{session.email.name}</span>
              <span>Rua:    {parsedAddress.street}</span>
              <span>Cidade: {parsedAddress.city}</span>
              <span>Estado: {parsedAddress.state}</span>
              <span>CEP:    {parsedAddress.zip}</span>
              <span>Pais:   {parsedAddress.country}</span>
            </address>
          </div>
          <div className="grid auto-rows-max gap-3">
            <div className="font-semibold">Informações de pagamento</div>
            {/* <div className="text-muted-foreground">
              Same as shipping address
            </div> */}
          </div>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Informações do Cliente</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Cliente</dt>
              <dd>{session.email.name}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd>
                <a href={`mailto:${session.email.email}`}>{session.email.email}</a>
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Phone</dt>
              <dd>
                <a href={`tel:${session.email.phone}`}>{session.email.phone}</a>
              </dd>
            </div>
          </dl>
        </div>
        <Separator className="my-4" />
        <div className="grid gap-3">
          <div className="font-semibold">Informações de pagamento</div>
          <dl className="grid gap-3">
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-1 text-muted-foreground">
                {/* Exemplo de cartão de crédito */}
                <span>Visa</span>
              </dt>
              <dd>**** **** **** 4532</dd>
            </div>
          </dl>
        </div>
        <Button onClick={handleBack}>Back</Button>
      </CardContent>
    </div>
  );
};

export default SessionClient;
