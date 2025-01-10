"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/src/lib/firebase";

const ComunicatiStampa = ({ category }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [comunicati, setComunicati] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComunicati = async () => {
      try {
        const comunicatiQuery = query(
          collection(db, "notizie"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(comunicatiQuery);
        const comunicatiData = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
          }))
          // @ts-ignore
          .filter((item) => item.categories?.includes(category)); // Filtra per la categoria passata come prop

        setComunicati(comunicatiData);
      } catch (error) {
        console.error("Error fetching comunicati:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComunicati();
  }, [category]);

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date)
      .toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
      })
      .toUpperCase();
  };

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % comunicati.length);

  const prevSlide = () =>
    setCurrentIndex(
      (prev) => (prev - 1 + comunicati.length) % comunicati.length
    );

  if (isLoading) {
    return <div className="text-center py-8">Caricamento...</div>;
  }

  if (comunicati.length === 0) {
    return (
      <div className="text-center py-8">
        Nessun comunicato disponibile per questa categoria
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8 sm:my-16">
        <div className="flex flex-col gap-4 md:flex-row items-center justify-between w-full">
          <div className="flex flex-col gap-4 md:flex-row items-center justify-between w-full">
            <AnimatePresence mode="wait">
              {[0, 1, 2].map((offset) => {
                const index = (currentIndex + offset) % comunicati.length;
                const comunicato = comunicati[index];

                return (
                  <motion.div
                    key={`${comunicato.id}-${offset}`}
                    className="bg-white rounded-lg shadow-sm overflow-hidden w-full md:w-[30%]"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative h-40 sm:h-48 md:h-64 border-b-[6px] border-blue-600">
                      <Image
                        src={comunicato.coverImage || "/img/notizia1.jpg"}
                        alt={comunicato.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-4 bg-blue-600 text-white px-4 font-bold py-2 text-xs sm:text-sm">
                        {formatDate(comunicato.createdAt)}
                      </div>
                    </div>
                    <div className="p-4 sm:p-6">
                      <p className="text-gray-800 mb-4 sm:mb-6 line-clamp-3">
                        {comunicato.title}
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

      {comunicati.length > 3 && (
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
      )}
    </div>
  );
};

export default ComunicatiStampa;
