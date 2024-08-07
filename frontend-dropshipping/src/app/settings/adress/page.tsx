"use client"

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useAuth } from '@/services/AuthContext';
import axios from 'axios';

type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
  houseNumber: string;
  complement: string;
  neighborhood: string;
};

export default function Address() {
  const { user, token } = useAuth();
  const [address, setAddress] = useState<Address | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user && token) {
      const fetchAddress = async () => {
        try {
          const response = await axios.get(`http://localhost:3333/addresses/${user.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setAddress(response.data);
        } catch (error) {
          console.error("Erro ao buscar endereço:", error);
        }
      };

      fetchAddress();
    }
  }, [user, token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => prevAddress ? { ...prevAddress, [name]: value } : null);
  };

  const handleUpdateAddress = async () => {
    if (user && token && address) {
      try {
        await axios.put(`http://localhost:3333/addresses`, address, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert('Endereço atualizado com sucesso!');
        setIsEditing(false);
      } catch (error) {
        console.error("Erro ao atualizar endereço:", error);
        alert('Erro ao atualizar endereço.');
      }
    }
  };

  return (
    <main>
      <div className="grid gap-6">
        <Card x-chunk="dashboard-04-chunk-1">
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
            <CardDescription>Dados do seu Endereço:</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="flex mb-5">
                <p className="mt-[6px]">Rua:</p>
                <Input
                  name="street"
                  placeholder="Rua"
                  value={address?.street || ""}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="flex mb-5">
                <p className="mt-[6px] mr-7">Número:</p>
                <Input
                  name="houseNumber"
                  placeholder="Número"
                  value={address?.houseNumber || ""}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="flex mb-5">
                <p className="mt-[6px] mr-1">Complemento:</p>
                <Input
                  name="complement"
                  placeholder="Complemento"
                  value={address?.complement || ""}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="flex mb-5">
                <p className="mt-[6px] mr-1">Bairro:</p>
                <Input
                  name="neighborhood"
                  placeholder="Bairro"
                  value={address?.neighborhood || ""}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="flex mb-5">
                <p className="mt-[6px] mr-1">Cidade:</p>
                <Input
                  name="city"
                  placeholder="Cidade"
                  value={address?.city || ""}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="flex mb-5">
                <p className="mt-[6px] mr-1">Estado:</p>
                <Input
                  name="state"
                  placeholder="Estado"
                  value={address?.state || ""}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
              <div className="flex mb-5">
                <p className="mt-[6px] mr-7">CEP:</p>
                <Input
                  name="zip"
                  placeholder="CEP"
                  value={address?.zip || ""}
                  onChange={handleInputChange}
                  readOnly={!isEditing}
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            {isEditing ? (
              <Button onClick={handleUpdateAddress}>Salvar</Button>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Mudar endereço</Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
