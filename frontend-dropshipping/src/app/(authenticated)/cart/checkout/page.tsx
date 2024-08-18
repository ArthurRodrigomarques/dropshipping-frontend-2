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
  country: string;
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
    country: '',
  });
  const [userSellerId, setUserSellerId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isNewAddress, setIsNewAddress] = useState(true); // Inicialmente assumimos que é um novo endereço

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
            setIsNewAddress(false); // Se houver um endereço, é uma atualização
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
      if (isNewAddress) {
        // Faça um POST para criar um novo endereço
        const response = await api.post(`http://localhost:3333/address`, address, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 201) {
          alert('Endereço criado com sucesso!');
          setIsEditing(false); // Desabilitar edição após salvar o endereço
          setIsNewAddress(false); // Definir como não sendo novo após salvar
        } else {
          console.error('Erro ao salvar endereço');
        }
      } else {
        // Faça um PUT para atualizar o endereço existente
        const response = await api.put(`http://localhost:3333/addresses`, { ...address, userId: user.id }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          alert('Endereço atualizado com sucesso!');
          setIsEditing(false); // Desabilitar edição após salvar o endereço
        } else {
          console.error('Erro ao salvar endereço');
        }
      }
    } catch (error) {
      console.error('Erro ao salvar endereço:', error);
    }
  };

  return (
    <div className="container mx-auto mt-20">
      <h1 className="text-center text-2xl">Dados de Endereço</h1>
      {isEditing ? (
        <form onSubmit={handleSaveAddress} className="mt-10">
          <Input
            placeholder="CEP"
            className='mb-4 w-[100%] sm:w-[50%]'
            value={address.zip}
            onChange={(e) => setAddress({ ...address, zip: e.target.value })}
            required
          />
          <Input
            placeholder="Rua"
            className='mb-4 w-[100%] sm:w-[50%]'
            value={address.street}
            onChange={(e) => setAddress({ ...address, street: e.target.value })}
            required
          />
          <Input
            placeholder="Número"
            className='mb-4 w-[100%] sm:w-[50%]'
            value={address.houseNumber}
            onChange={(e) => setAddress({ ...address, houseNumber: e.target.value })}
            required
          />
          <Input
            placeholder="Complemento"
            className='mb-4 w-[100%] sm:w-[50%]'
            value={address.complement}
            onChange={(e) => setAddress({ ...address, complement: e.target.value })}
          />
          <Input
            placeholder="Bairro"
            className='mb-4 w-[100%] sm:w-[50%]'
            value={address.neighborhood}
            onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
            required
          />
          <Input
            placeholder="Cidade"
            className='mb-4 w-[100%] sm:w-[50%]'
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
            required
          />
          <Input
            placeholder="Estado"
            className='mb-4 w-[100%] sm:w-[50%]'
            value={address.state}
            onChange={(e) => setAddress({ ...address, state: e.target.value })}
            required
          />
          <Input
            placeholder="País"
            className='mb-4 w-[100%] sm:w-[50%]'
            value={address.country}
            onChange={(e) => setAddress({ ...address, country: e.target.value })}
            required
          />

          <Button type="submit">Salvar Endereço</Button>
        </form>
      ) : (
        <div className='flex items-center justify-center mt-20'>
          <div className='text-lg'>
            <p className='mb-1'>CEP: {address.zip}</p>
            <p className='mb-1'>Rua: {address.street}, Número: {address.houseNumber}</p>
            <p className='mb-1'>Complemento: {address.complement}</p>
            <p className='mb-1'>Bairro: {address.neighborhood}</p>
            <p className='mb-1'>Cidade: {address.city}</p>
            <p className='mb-8'>Estado: {address.state}</p>
            <p className='mb-8'>País: {address.country}</p>
            <Button onClick={() => setIsEditing(true)}>Editar Endereço</Button>
          </div>
        </div>
      )}
      <form onSubmit={handleCheckout} className="mt-40 flex justify-end">
        <Button type="submit" disabled={!address.street || !address.city || !address.state || !address.zip || !address.houseNumber || !address.neighborhood}>Continuar para Pagamento</Button>
      </form>
    </div>
  );
};

export default Checkout;
