// app/admin/session/[getSessionId]/page.tsx
import { notFound } from 'next/navigation';
import SessionClient from './sessionClient';
import { api } from '@/services/api';

async function getSession(id: string) {
  try {
    const res = await api.get(`/session/${id}`);
    if (res.status !== 200) {
      throw new Error('Failed to fetch session');
    }
    return res.data;
  } catch (error) {
    console.error('Error fetching session:', error);
    throw error;
  }
}

const SessionPage = async ({ params }: { params: { getSessionId: string } }) => {
  const session = await getSession(params.getSessionId).catch(() => notFound());

  if (!session) {
    return notFound();
  }

  return <SessionClient session={session} />;
};

export default SessionPage;
