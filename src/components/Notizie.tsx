"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import Link from "next/link";

const RecentNews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsQuery = query(
          collection(db, "notizie"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(newsQuery);
        const newsData = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
          }))
          // @ts-ignore
          .filter((item) => item.categories?.includes("In Evidenza")); // Filtra solo le notizie in evidenza

        setNews(newsData);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date)
      .toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
      })
      .toUpperCase();
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 3) % news.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 3 + news.length) % news.length);
  };

  const totalSlides = Math.ceil(news.length / 3);
  const currentSlide = Math.floor(currentIndex / 3);

  if (isLoading) {
    return <div className="py-16 text-center text-white">Caricamento...</div>;
  }

  if (news.length === 0) {
    return (
      <div className="py-16 text-center text-white">
        Nessuna notizia in evidenza disponibile
      </div>
    );
  }

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
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden bg-white shadow-md">
                    <CardContent className="p-0">
                      <div className="relative h-40 sm:h-48 lg:h-56 border-b-[6px] border-blue-600">
                        <Image
                          src={item.coverImage || "/img/notizia1.jpg"} // Usa l'immagine di default se non c'è copertina
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-0 left-4 bg-blue-600 text-white px-4 font-bold py-2 text-xs sm:text-sm">
                          {formatDate(item.createdAt)}
                        </div>
                      </div>
                      <div className="p-4 sm:p-6">
                        <p className="text-gray-800 mb-4 sm:mb-6 line-clamp-3">
                          {item.title}
                        </p>
                        <Link href={`/notizia/${item.linkNews}`}
                          className="w-full  hover:bg-gray-400 font-bold uppercase bg-blue-600 p-4 rounded-md text-white"
                        >
                          leggi di più
                        </Link>
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
        {news.length > 3 && (
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
        )}
      </div>
    </div>
  );
};

export default RecentNews;
