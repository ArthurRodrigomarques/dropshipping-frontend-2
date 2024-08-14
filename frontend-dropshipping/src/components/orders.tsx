// src/app/orders/page.tsx
'use client';

import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { api } from '@/services/api';

interface Address {
  city: string | null;
  country: string;
  line1: string | null;
  line2: string | null;
  postal_code: string | null;
  state: string | null;
}

interface Email {
  address: Address;
  email: string;
  name: string | null;  // Permite null
  phone: string | null;
  tax_exempt: string;
  tax_ids: string[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  email: Email | null;  // Permite null
  metadata: {
    products: string;
  };
  total: number;
}

const fetchProductDetails = async (productId: string) => {
  try {
    const response = await api.get<Product>(`/get-unique-product/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch product details for ID: ${productId}`, error);
    return null;
  }
};

const calculateTotal = async (products: string) => {
  try {
    const productList: { id: string; quantity: number }[] = JSON.parse(products);

    let total = 0;

    for (const product of productList) {
      const productDetails = await fetchProductDetails(product.id);
      if (productDetails) {
        console.log(`Product price: ${productDetails.price}, quantity: ${product.quantity}`);
        total += productDetails.price * product.quantity;
      }
    }

    return total;
  } catch (error) {
    console.error("Failed to parse products:", error);
    return 0;
  }
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await api.get<Order[]>("/get-all-sessions");
      const orders = response.data;

      const ordersWithTotal = await Promise.all(
        orders.map(async (order) => {
          const total = await calculateTotal(order.metadata.products);
          return { ...order, total };
        })
      );

      setOrders(ordersWithTotal);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const intervalId = setInterval(fetchOrders, 60000); 

    return () => clearInterval(intervalId); 
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Clientes</TableHead>
          <TableHead className="hidden sm:table-cell">Tipo</TableHead>
          <TableHead className="hidden sm:table-cell">Status</TableHead>
          <TableHead className="hidden md:table-cell">Data</TableHead>
          <TableHead className="text-right">Preço</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id} className="bg-accent">
            <TableCell>
              <Link href={`/admin/session/${order.id}`} key={order.id}>
                {order.email?.name || 'Nome não disponível'}
              </Link>
              <br />
              <div className="hidden text-sm text-muted-foreground md:inline">
                {order.email?.email || 'Email não disponível'}
              </div>
            </TableCell>
            <TableCell className="hidden sm:table-cell">Venda</TableCell>
            <TableCell className="hidden sm:table-cell">
              <Badge className="text-xs" variant="secondary">
                Enviar
              </Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">25/07/2024</TableCell>
            <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default Orders;
