"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/services/AuthContext';
import { api } from '@/services/api';
import { Card, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  images: { imageUrl: string, isMain: boolean }[];
}

interface Session {
  id: string;
  email: string;
  metadata: {
    address: string;
    buyerId: string;
    products: string;
    userSellerId: string;
  };
  total?: number;
  detailedProducts?: Product[];
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
    const detailedProducts: Product[] = [];

    for (const product of productList) {
      const productDetails = await fetchProductDetails(product.id);
      if (productDetails) {
        detailedProducts.push({ ...productDetails, quantity: product.quantity });
        total += productDetails.price * product.quantity;
      }
    }

    return { total, detailedProducts };
  } catch (error) {
    console.error('Failed to parse products:', error);
    return { total: 0, detailedProducts: [] };
  }
};

const MinhasCompras: React.FC = () => {
  const { user, token } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserSessions = async () => {
    try {
      const response = await api.get<Session[]>(`/get-user-sessions/${user?.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sessions = response.data;

      const sessionsWithDetails = await Promise.all(
        sessions.map(async (session) => {
          const { total, detailedProducts } = await calculateTotal(session.metadata.products);
          return { ...session, total, detailedProducts };
        })
      );

      setSessions(sessionsWithDetails);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch user sessions:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchUserSessions();
    } else {
      setLoading(false);
    }
  }, [user, token]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="minhas-compras">
      <h1 className="text-2xl mb-4">Compras</h1>
      {sessions.length === 0 ? (
        <p>Você não possui compras.</p>
      ) : (
        sessions.map((session) => (
          <Card key={session.id} className="order-card mb-10">
            <CardHeader>
              <h2>Pedido ID: {session.id}</h2>
              <p>Email: {session.email}</p>
              <p>Total: ${session.total?.toFixed(2)}</p>
            </CardHeader>
            <Card>
              {session.detailedProducts?.map((product) => {
                const mainImage = product.images.find((image) => image.isMain);
                return (
                  <div key={product.id} className="product-item flex justify-between items-center mb-4 p-2">
                    <div className="flex items-center">
                      {mainImage ? (
                        <Image
                          className="object-cover object-center group-hover:opacity-75 h-full"
                          priority
                          src={mainImage.imageUrl}
                          alt="Imagem do Produto"
                          width={100}
                          height={100}
                        />
                      ) : (
                        <div className="placeholder-image">Sem Imagem</div>
                      )}
                      <div className="ml-4">
                        <p>{product.name}</p>
                        <p>{product.quantity} Unidade </p>
                      </div>
                    </div>
                    <div className="actions">
                      <Link href={`/compra/${session.id}`}>
                        <Button>Ver compra</Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </Card>
          </Card>
        ))
      )}
    </div>
  );
};

export default MinhasCompras;
