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

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  email: Email;
  metadata: {
    products: string; 
  };
}

const api = process.env.ROUTE_BACKEND;

const fetchProductDetails = async (productId: string) => {
  try {
    const response = await axios.get<Product>(`${api}/get-unique-product/${productId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch product details for ID: ${productId}`, error);
    return null;
  }
};

export async function Orders(params: any) {
  const response = await axios.get<Order[]>(`${api}/get-all-sessions`);
  const orders = response.data;

  const calculateTotal = async (products: string) => {
    try {
      const productList: { id: string; quantity: number }[] = JSON.parse(products);

      let total = 0;

      for (const product of productList) {
        const productDetails = await fetchProductDetails(product.id);
        if (productDetails) {
          console.log(`Product price: ${productDetails.price}, quantity: ${product.quantity}`);
          total += productDetails.price * product.quantity;
        }
      }

      return total;
    } catch (error) {
      console.error("Failed to parse products:", error);
      return 0;
    }
  };

  const ordersWithTotal = await Promise.all(
    orders.map(async (order) => {
      const total = await calculateTotal(order.metadata.products);
      return { ...order, total };
    })
  );

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
        {ordersWithTotal.map((order) => (
          <TableRow key={order.id} className="bg-accent">
            <TableCell>
              <Link href={`/admin/session/${order.id}`} key={order.id}>
                {order.email.name}
              </Link>
              <br />
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
            <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
