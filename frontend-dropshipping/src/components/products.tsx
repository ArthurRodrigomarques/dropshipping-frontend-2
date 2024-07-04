import axios from 'axios';
import Image from 'next/image';
import Logo from "../../public/Fizmo.png";
import Link from 'next/link';
import { Button } from './ui/button';

export async function Products() {
    try {
        const response = await axios.get("http://localhost:3333/products");
        const data = response.data;

        return (
            <div className='mt-20'>
            <Link
            href="/" 
            className='lg:grid lg:grid-cols-3  sm:grid sm:grid-cols-2 grid grid-cols-1 justify-items-center'>
                {data.map((item: any) => (
                    <ul 
                        className='pb-4'
                        key={item.id}
                    >
                        <Image
                            className="w-[90%] ml-[5%] mr-[5%]"
                            priority
                            src={Logo}
                         
                            alt="foto"
                        />
                        <li className='ml-5 w-[320px]'>{item.name}</li>
                        <li className='ml-5'>R$ {formatPrice(item.price)}</li>
                        {/* <li>{item.amount} Quantidades</li> */}
                        <Button className='ml-[5%]'>Adicionar ao carrinho</Button>
                    </ul>
                    
                ))}
            </Link>
            
            </div>
        );
    } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
        return <div>Erro ao buscar dados da API</div>;
    }
}

// Função para formatar o preço com vírgula
function formatPrice(price: any) {
    return price.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}
