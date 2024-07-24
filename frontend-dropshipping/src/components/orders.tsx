import axios from "axios";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";

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
  name: string;
  phone: string | null;
  tax_exempt: string;
  tax_ids: string[];
}

interface Order {
  id: string;
  email: Email;
}

const api = process.env.ROUTE_BACKEND;

export async function Orders(params: any) {
  const response = await axios.get<Order[]>(`${api}/get-all-sessions`);
  const orders = response.data;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead className="hidden sm:table-cell">Type</TableHead>
          <TableHead className="hidden sm:table-cell">Status</TableHead>
          <TableHead className="hidden md:table-cell">Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id} className="bg-accent">
            <TableCell>
              
              <Link href={`/admin/session/${order.id}`} key={order.id}>
                {order.email.name}
              </Link>
              <div className="hidden text-sm text-muted-foreground md:inline">
                {order.email.email}
              </div>
            </TableCell>
            <TableCell className="hidden sm:table-cell">Sale</TableCell>
            <TableCell className="hidden sm:table-cell">
              <Badge className="text-xs" variant="secondary">
                Fulfilled
              </Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">2023-06-23</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
