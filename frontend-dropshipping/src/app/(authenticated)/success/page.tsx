"use client"

import { useRouter } from "next/navigation";

export default function Success() {
    const router = useRouter();
  return (
    <main className="text-center mt-20">
             <h1>Pagamento concluído com sucesso!</h1>
             <p>ID da sessão:</p>
    </main>
  );
}
