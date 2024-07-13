import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Admin() {
  return (
    <main className="mt-20">
        <h1 className="text-center">ADMIN</h1>
        <Link href="/"><Button>Voltar para rota / </Button></Link>
    </main>
  );
}
