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
      image: "/img/sede.jpg",
    },
    {
      date: "8 NOVEMBRE",
      text: "Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
      image: "/img/sede.jpg",
    },
    {
      date: "5 NOVEMBRE",
      text: "Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat.",
      image: "/img/sede.jpg",
    },
    {
      date: "1 NOVEMBRE",
      text: "Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum.",
      image: "/img/sede.jpg",
    },
    {
      date: "28 OTTOBRE",
      text: "Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem.",
      image: "/img/sede.jpg",
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
      <div className="max-w-7xl mx-auto px-4 my-16">
        <div className="grid grid-cols-3 gap-8">
          {/* Comunicati Stampa Card */}
          <div className="bg-snalv-500 rounded-lg h-[500px] flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute w-40 h-40 rounded-full border-2 border-white/20 -top-10 -left-10" />
              <div className="absolute w-48 h-48 rounded-full border-2 border-white/20 bottom-10 right-10" />
              <div className="absolute w-32 h-32 rounded-full border-2 border-white/20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <h2 className="text-white text-5xl font-bold tracking-wide text-center z-10 px-6">
              COMUNICATI STAMPA
            </h2>
          </div>

          {/* News Cards */}
          <AnimatePresence mode="wait">
            {[0, 1].map((offset) => {
              const index = (currentIndex + offset) % comunicati.length;
              return (
                <motion.div
                  key={`${index}-${offset}`}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-64">
                    <Image
                      src={comunicati[index].image}
                      alt={comunicati[index].text}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-sm font-medium text-snalv-600 mb-4">
                      {comunicati[index].date}
                    </div>
                    <p className="text-gray-800 mb-6">
                      {comunicati[index].text}
                    </p>
                    <button className="w-full uppercase py-2 text-center border border-snalv-200 text-snalv-600 rounded-md hover:bg-snalv-50 transition-colors">
                      scopri di più
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
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
