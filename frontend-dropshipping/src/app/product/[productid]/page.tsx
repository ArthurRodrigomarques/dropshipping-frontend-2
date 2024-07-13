import { notFound } from 'next/navigation';
import ProductClient from './productClient';
import { api } from '@/services/api';

async function getProduct(id: string) {
  const res = await api.get(`/get-unique-product/${id}`);
  if (res.status !== 200) {
    console.error('Error fetching product:', res.statusText);
    throw new Error('Failed to fetch product');
  }
  return res.data;
}

const ProductPage = async ({ params }: { params: { productid: string } }) => {
  const product = await getProduct(params.productid).catch(() => notFound());

  if (!product) {
    return notFound();
  }

  return <ProductClient product={product} />;
};

export default ProductPage;
