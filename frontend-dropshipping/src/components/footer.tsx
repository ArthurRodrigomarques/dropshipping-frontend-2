import { MdAddShoppingCart } from "react-icons/md";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/Fizmo.png"
import { FaWhatsapp } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { AiOutlineFacebook } from "react-icons/ai";

const style = {
    fontSize: '2em',
  };

export default function Footer() {
    return( 
        <div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 p-16 bg-primary text-white">
                <div>
                <Image
                    className=""
                    priority
                    src={Logo}
                    width={200}
                    alt="Foto"
                    />
                </div>
                <div className="flex flex-col">
                    <h1 className="mb-3 font-bold">NOSSAS POLÍTICAS</h1>

                    <Link className="hover:text-black mb-3" href="/">Contato</Link>
                    <Link className="hover:text-black mb-3" href="/policies/aboutUs">Quem somos</Link>
                    <Link className="hover:text-black mb-3" href="/policies/shippingAndDelivery">Envios e Prazos</Link>
                    {/* <Link className="hover:text-black mb-3" href="/">Trocas e devoluções</Link> */}
                    <Link className="hover:text-black mb-3" href="/policies/privacypolicy">Politica de privacidade</Link>
                </div>
                <div className="sm:mb-5">
                    <h1 className="mb-5 font-bold">CENTRAL DE ATENDIMENTO</h1>
                    <p className="mb-2">Atendimento: seg. á sáb. 07h ás 22h</p>
                    <p className="mb-2">Contato: &#40;13&#41; 99190-8771</p>
                    <p>Email: mizustoreoficial@gmail.com</p>
                </div>
                <div className="sm:mb-5">
                    <h1 className="font-bold">REDES SOCIAS</h1>
                    <div className="flex gap-2" style={style}>
                        <Link href="/"><FaWhatsapp className="hover:text-secondary" /></Link>
                        <Link href="/"><FaInstagram className="hover:text-secondary"/></Link>
                        <Link href="/"><AiOutlineFacebook className="hover:text-secondary"/></Link>
                    </div>

                </div>
                <div>
                    <h1 className="font-bold">FORMA DE PAGAMENTOS</h1>
                </div>
            </div>
            <div>
            <h3 className="text-center mt-3 mb-3">&copy; 2024 Tetudos e cia | Todos os direitos reservados.</h3>
            </div>
        </div>
    )
}