"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const ComunicatiStampa = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const comunicati = [
    {
      date: "10 NOVEMBRE",
      text: "Lorem ipsum dolor sit amet, adipisicing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
      image: "/img/notizia1.jpg",
    },
    {
      date: "8 NOVEMBRE",
      text: "Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
      image: "/img/notizia1.jpg",
    },
    {
      date: "5 NOVEMBRE",
      text: "Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat.",
      image: "/img/notizia1.jpg",
    },
    {
      date: "1 NOVEMBRE",
      text: "Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum.",
      image: "/img/notizia1.jpg",
    },
    {
      date: "28 OTTOBRE",
      text: "Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem.",
      image: "/img/notizia1.jpg",
    },
  ];

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % comunicati.length);
  const prevSlide = () =>
    setCurrentIndex(
      (prev) => (prev - 1 + comunicati.length) % comunicati.length
    );

  return (
    <div className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8 sm:my-16">
        <div className="flex flex-col gap-4 md:flex-row items-center justify-between w-full">
          {/* Comunicati Stampa Card */}

          {/* News Cards */}
          <div className="flex flex-col gap-4 md:flex-row items-center justify-between w-full">
            <AnimatePresence mode="wait">
              {[0, 3, 6].map((offset) => {
                const index = (currentIndex + offset) % comunicati.length;
                return (
                  <motion.div
                    key={`${index}-${offset}`}
                    className="bg-white rounded-lg shadow-sm overflow-hidden w-[30%]"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative h-40 sm:h-48 md:h-64 border-b-[6px] border-blue-600">
                      <Image
                        src={comunicati[index].image}
                        alt={comunicati[index].text}
                        fill
                        className="object-cover"
                      />

                      <div className="absolute bottom-0 left-4 bg-blue-600 text-white px-4 font-bold py-2 text-xs sm:text-sm">
                        {comunicati[index].date}
                      </div>
                    </div>
                    <div className="p-4 sm:p-6">
                      <p className="text-gray-800 mb-4 sm:mb-6 line-clamp-3">
                        {comunicati[index].text}
                      </p>
                      <button className="w-full uppercase py-2 text-center border border-snalv-200 text-snalv-600 rounded-md hover:bg-snalv-50 transition-colors">
                        leggi di più
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={prevSlide}
          className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-snalv-50 text-snalv-500"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-snalv-50 text-snalv-500"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ComunicatiStampa;
