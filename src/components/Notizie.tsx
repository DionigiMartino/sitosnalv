"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const RecentNews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const news = [
    {
      date: "10 NOVEMBRE",
      text: "Lorem ipsum dolor sit amet, adipisicing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna.",
      image: "/img/notizia1.jpg",
    },
    {
      date: "10 NOVEMBRE",
      text: "Lorem ipsum dolor sit amet, adipisicing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna.",
      image: "/img/notizia1.jpg",
    },
    {
      date: "10 NOVEMBRE",
      text: "Lorem ipsum dolor sit amet, adipisicing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna.",
      image: "/img/notizia1.jpg",
    },
    {
      date: "9 NOVEMBRE",
      text: "Lorem ipsum dolor sit amet, adipisicing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna.",
      image: "/img/notizia1.jpg",
    },
    {
      date: "9 NOVEMBRE",
      text: "Lorem ipsum dolor sit amet, adipisicing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna.",
      image: "/img/notizia1.jpg",
    },
    {
      date: "9 NOVEMBRE",
      text: "Lorem ipsum dolor sit amet, adipisicing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna.",
      image: "/img/notizia1.jpg",
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 3) % news.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 3 + news.length) % news.length);
  };

  const totalSlides = Math.ceil(news.length / 3);
  const currentSlide = Math.floor(currentIndex / 3);

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <h2 className="text-5xl font-bold text-white mb-12 text-center sm:text-3xl lg:text-4xl">
          NOTIZIE RECENTI
        </h2>

        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <AnimatePresence mode="wait">
              {news.slice(currentIndex, currentIndex + 3).map((item, index) => (
                <motion.div
                  key={currentIndex + index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden bg-white shadow-md">
                    <CardContent className="p-0">
                      <div className="relative h-40 sm:h-48 lg:h-56 border-b-[6px] border-blue-600">
                        <Image
                          src={item.image}
                          alt="News"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-0 left-4 bg-blue-600 text-white px-4 font-bold py-2 text-xs sm:text-sm">
                          {item.date}
                        </div>
                      </div>
                      <div className="p-4 sm:p-6">
                        <p className="text-gray-800 mb-4 sm:mb-6 line-clamp-3">
                          {item.text}
                        </p>
                        <Button
                          variant="secondary"
                          className="w-full bg-gray-300 hover:bg-gray-400 font-bold uppercase text-blue-600"
                        >
                          leggi di più
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mt-6 sm:mt-8">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                i === currentSlide ? "bg-gray-500" : "bg-gray-300"
              }`}
              onClick={() => setCurrentIndex(i * 3)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Arrow Navigation */}
        <div className="absolute left-2 right-2 top-1/2 -translate-y-1/2 flex justify-between z-10">
          <button
            onClick={prevSlide}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentNews;
