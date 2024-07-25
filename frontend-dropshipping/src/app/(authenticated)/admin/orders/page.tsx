import axios from 'axios';

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  userId: string;
  created_at: string;
  updated_at: string;
}

interface Metadata {
  address: Address; 
  buyerId: string;
  products: { id: string; quantity: number }[];
  userSellerId: string;
}

interface SessionDetails {
  id: string;
  email: string | null;
  name: string | null;
  phone: string | null;
  tax_exempt: string;
  tax_ids: string[] | null; 
  metadata: Metadata;
}

const api = process.env.ROUTE_BACKEND;

export async function OrderDetails() {
  try {
    const response = await axios.get<SessionDetails[]>(`${api}/get-all-sessions`);
    const orders = response.data;

    return (
      <div>
        <div className=''>
          <h2 className="sr-only">Orders</h2>
          <div className=''> 
            {orders.map((order) => {
              // Convert address string from JSON to object
              const address = order.metadata.address ? JSON.parse(order.metadata.address.userId) : null;

              return (
                <div className='m-40' key={order.id}>
                  <h1>Order ID: {order.id}</h1>
                  {address ? (
                    <div>
                    </div>
                  ) : (
                    <p>No address available</p>
                  )}
                  <p>Buyer ID: {order.metadata.buyerId}</p>
                  <p>Products: {JSON.stringify(order.metadata.products, null, 2)}</p>
                  <p>User Seller ID: {order.metadata.userSellerId}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Erro ao buscar dados da API:", error);
    return <div>Erro ao buscar dados da API</div>;
  }
}

function formatPrice(price: number) {
  return price.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

export default OrderDetails;