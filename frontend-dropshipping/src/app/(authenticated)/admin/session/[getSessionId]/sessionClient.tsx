// app/admin/session/[getSessionId]/sessionClient.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // ajuste o caminho conforme necessário

interface Session {
  id: string;
  email: {
    address: {
      city: string | null;
      country: string;
      line1: string | null;
      line2: string | null;
      postal_code: string | null;
      state: string | null;
    };
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

  const handleBack = () => {
    router.back(); // Navega para a página anterior
  };

  return (
    <div className="container mx-auto lg:p-20 pt-20">
      <h1 className="text-2xl font-bold">Session Details</h1>
      <p><strong>ID:</strong> {session.id}</p>
      <p><strong>Name:</strong> {session.email.name}</p>
      <p><strong>Email:</strong> {session.email.email}</p>
      <p><strong>Address:</strong> {session.metadata.address}</p>
      <p><strong>Products:</strong> {session.metadata.products}</p>
      <Button onClick={handleBack}>Back</Button>
    </div>
  );
};

export default SessionClient;
