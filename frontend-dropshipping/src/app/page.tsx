import Header from "@/components/header";
import InputNavigation from "@/components/input";
import {Products}  from "../components/products";
import { CarouselPrincipal } from "@/components/carousel";
export default function Home() {
  return (
    <main className="">
      <Header/>
      <InputNavigation/>
     <CarouselPrincipal/>
      <Products/>
    </main>
  );
}
