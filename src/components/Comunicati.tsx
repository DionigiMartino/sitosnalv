"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/src/lib/firebase";

interface Props {
  categories: string[];
  currentLink?: string;
}

const ComunicatiStampa = ({ categories, currentLink }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [comunicati, setComunicati] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComunicati = async () => {
      try {
        const comunicatiQuery = query(
          collection(db, "comunicati"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(comunicatiQuery);
        const comunicatiData = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            tipo: "comunicati",
          }))
          .filter((item) => {
            const hasMatchingCategory = categories.some((category) =>
              // @ts-ignore
              item.categories?.includes(category)
            );
            // @ts-ignore
            const isNotCurrent = !currentLink || item.linkNews !== currentLink;
            return hasMatchingCategory && isNotCurrent;
          });

        setComunicati(comunicatiData);
      } catch (error) {
        console.error("Error fetching comunicati:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComunicati();
  }, [categories, currentLink]);

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
    setCurrentIndex((prev) => (prev + 6 >= comunicati.length ? 0 : prev + 6));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev - 6 < 0 ? Math.max(0, comunicati.length - 6) : prev - 6
    );
  };

  if (isLoading) {
    return <div className="text-center py-8">Caricamento...</div>;
  }

  if (comunicati.length === 0) {
    return null;
  }

  // Slice per mostrare 6 elementi alla volta
  const visibleComunicati = comunicati.slice(currentIndex, currentIndex + 6);

  return (
    <div className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8 sm:my-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="wait">
            {visibleComunicati.map((comunicato, index) => (
              <motion.div
                key={comunicato.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link href={`/comunicato/${comunicato.linkNews}`}>
                  <div className="relative h-40 sm:h-48 md:h-64 border-b-[6px] border-blue-600">
                    <Image
                      src={comunicato.coverImage || "/img/logo.jpg"}
                      alt={comunicato.title}
                      fill
                      className={
                        comunicato.coverImage
                          ? "object-cover"
                          : "object-contain"
                      }
                    />
                    <div className="absolute bottom-0 left-4 bg-blue-600 text-white px-4 font-bold py-2 text-xs sm:text-sm">
                      {formatDate(comunicato.createdAt)}
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <p className="text-gray-800 mb-4 sm:mb-6 line-clamp-3">
                      {comunicato.title}
                    </p>
                    <div className="w-full uppercase py-2 text-center border border-snalv-200 text-snalv-600 rounded-md hover:bg-snalv-50 transition-colors">
                      leggi di più
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {comunicati.length > 6 && (
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
