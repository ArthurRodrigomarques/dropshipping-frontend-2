import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"

export default function Adress() {
  
    return (
      <main>
        <div className="grid gap-6">
            <Card x-chunk="dashboard-04-chunk-1">
              <CardHeader>
                <CardTitle>Endereço</CardTitle>
                <CardDescription>
                  Dados do seu Endereço:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form>
                  <Input placeholder="Store Name" />
                </form>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button>Mudar endereço</Button>
              </CardFooter>
            </Card>
          </div>
      </main>
    );
  }
  