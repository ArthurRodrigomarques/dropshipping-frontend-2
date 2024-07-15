import Header from "@/components/header";
import InputNavigation from "@/components/input";
import {Products}  from "../components/products";
import { CarouselPrincipal } from "@/components/carousel";
import Footer from "@/components/footer";
export default function Home() {
  return (
    <main>
      <Header/>
      <InputNavigation/>
     <CarouselPrincipal/>
     <div>
      <Products/>
      </div>
      <Footer/>
    </main>
  );
}
