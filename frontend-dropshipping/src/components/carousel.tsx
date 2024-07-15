'use client';

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function CarouselPrincipal() {
  const plugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  return (
    <div className="w-full h-full flex justify-center items-center overflow-hidden">
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="flex w-full h-full">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="flex-shrink-0 w-full h-full flex items-center justify-center "
            >
              <div className="p-4 w-full h-full flex items-center justify-center ">
                <Card className="w-full sm:h-[500px] h-60 bg-slate-400">
                  <CardContent className="flex items-center justify-center p-6 w-full h-full">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 text-black text-4xl z-10">
          &#10094;
        </CarouselPrevious>
        <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 text-black text-4xl z-10">
          &#10095;
        </CarouselNext>
      </Carousel>
    </div>
  );
}
