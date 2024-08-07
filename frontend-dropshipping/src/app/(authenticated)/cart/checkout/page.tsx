"use client";

import { useEffect, useState } from 'react';
import { useCart } from '../../../../services/CartContext';
import { useAuth } from '../../../../services/AuthContext';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';
import stripePromise from '@/lib/stripe';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';

type Address = {
  id?: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  houseNumber: string;
  complement: string;
  neighborhood: string;
};

const Checkout = () => {
  const { cart } = useCart();
  const { user, token } = useAuth();
  const router = useRouter();

  const [address, setAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    zip: '',
    houseNumber: '',
    complement: '',
    neighborhood: '',
  });
  const [userSellerId, setUserSellerId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const seller = process.env.NEXT_PUBLIC_SELLER_ID;

  useEffect(() => {
    const fetchUserSellerId = async () => {
      try {
        const response = await api.get(`/get-unique-user-id/${seller}`);
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

  useEffect(() => {
    const fetchAddress = async () => {
      if (user && token) {
        try {
          const response = await api.get(`http://localhost:3333/addresses/${user.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.data) {
            setAddress(response.data);
          } else {
            setIsEditing(true); // Se não houver endereço, permitir a edição
          }
        } catch (error) {
          console.error('Erro ao buscar endereço:', error);
          setIsEditing(true); // Em caso de erro, permitir a edição
        }
      }
    };

    fetchAddress();
  }, [user, token]);

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

    if (!address) {
      console.error('Endereço não disponível');
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

  const handleSaveAddress = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!user || !token || !address) {
      console.error('Usuário ou endereço não disponível');
      return;
    }

    try {
      let response;
      if (address.id) {
        // Fazer um PUT para atualizar o endereço existente
        response = await api.put(`/addresses`, address, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Fazer um POST para criar um novo endereço
        response = await api.post(`/address`, address, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      if (response.status === 200 || response.status === 201) {
        setIsEditing(false); // Desabilitar edição após salvar o endereço
      } else {
        console.error('Erro ao salvar endereço');
      }
    } catch (error) {
      console.error('Erro ao salvar endereço:', error);
    }
  };

  return (
    <div className="container mx-auto mt-20">
      <h1 className="text-center">Dados do Cliente</h1>
      {isEditing ? (
        <form onSubmit={handleSaveAddress} className="mt-40">
          <Input
            placeholder="Rua"
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
            required
          />
          <Input
            placeholder="Número"
            value={address.houseNumber}
            onChange={(e) => setAddress({ ...address, houseNumber: e.target.value })}
            required
          />
          <Input
            placeholder="Complemento"
            value={address.complement}
            onChange={(e) => setAddress({ ...address, complement: e.target.value })}
          />
          <Input
            placeholder="Bairro"
            value={address.neighborhood}
            onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
            required
          />
          <Input
            placeholder="Cidade"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            required
          />
          <Input
            placeholder="Estado"
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
            required
          />
          <Input
            placeholder="CEP"
            value={address.zip}
            onChange={(e) => setAddress({ ...address, zip: e.target.value })}
            required
          />
          <Button type="submit">Salvar Endereço</Button>
        </form>
      ) : (
        <div>
          <p>Rua: {address.street}, {address.houseNumber}</p>
          <p>Complemento: {address.complement}</p>
          <p>Bairro: {address.neighborhood}</p>
          <p>Cidade: {address.city}</p>
          <p>Estado: {address.state}</p>
          <p>CEP: {address.zip}</p>
          <Button onClick={() => setIsEditing(true)}>Editar Endereço</Button>
        </div>
      )}
      <form onSubmit={handleCheckout} className="mt-40">
        <Button type="submit" disabled={!address.street || !address.city || !address.state || !address.zip || !address.houseNumber || !address.neighborhood}>Continuar para Pagamento</Button>
      </form>
    </div>
  );
};

export default Checkout;
