import { loadStripe } from '@stripe/stripe-js';
import { parseCookies } from 'nookies';
import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
      const data: Product[] = await res.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const handleCheckout = async () => {
    const { auth_token: token } = parseCookies();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ products }),
      });

      const session = await response.json();

      const stripe = await stripePromise;
      const { error } = await stripe!.redirectToCheckout({
        sessionId: session.sessionId,
      });

      if (error) {
        console.error('Erro ao redirecionar para o checkout:', error);
      }
    } catch (error) {
      console.error('Erro na criação da sessão de checkout:', error);
    } finally {
      setLoading(false);
    }
  };
     
  return (
    <div>
      <h1>Produtos</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - {product.price}
          </li>
        ))}
      </ul>
      <button onClick={handleCheckout} disabled={loading}>
        {loading ? 'Carregando...' : 'Comprar Agora'}
      </button>
    </div>
  );
};

export default Checkout;
