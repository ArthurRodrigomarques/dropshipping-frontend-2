import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  images: { imageUrl: string, isMain: boolean }[];
}

const api = process.env.ROUTE_BACKEND;

export async function Products() {
  try {
    const response = await axios.get<Product[]>(`${api}/products`);
    const products = response.data;

    return (
      <div>
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Products</h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {products.map((product) => {
              const mainImage = product.images.find((image) => image.isMain);

              return (
                <Link href={`/product/${product.id}`} key={product.id}>
                  <ul className="group flex flex-row sm:flex-col items-center sm:items-start p-4 rounded-lg w-full border">
                    {mainImage ? (
                      <div className="w-1/3 sm:w-full aspect-w-1 aspect-h-1 overflow-hidden rounded-lg flex-shrink-0">
                        <Image
                          className="object-cover object-center group-hover:opacity-75 w-full h-full"
                          priority
                          src={mainImage.imageUrl}
                          alt="Imagem do Produto"
                          width={200}
                          height={200}
                        />
                      </div>
                    ) : (
                      <div className="placeholder-image w-1/3 sm:w-full">
                        {/* Placeholder content */}
                      </div>
                    )}
                    <div className="ml-4 sm:ml-0 sm:mt-4 w-full text-left sm:text-center">
                      <li className="text-sm">{product.name}</li>
                      <li className="mt-1 text-lg font-medium">R$ {formatPrice(product.price)}</li>
                    </div>
                  </ul>
                </Link>
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

export default Products;
