"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  categories: string[];
  currentLink?: string;
  variant?: string;
}

interface NewsItem {
  id: string;
  title: string;
  coverImage?: string;
  linkNews: string;
  categories?: string[];
  createdAt: Date;
  tipo: "notizia" | "comunicato";
}

const NewsComponent = ({
  categories,
  currentLink,
  variant = "default",
}: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [combinedItems, setCombinedItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Fetch notizie
        const newsQuery = query(
          collection(db, "notizie"),
          orderBy("createdAt", "desc")
        );
        const newsSnapshot = await getDocs(newsQuery);
        const newsData = newsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          tipo: "notizia" as const,
        }));

        // Fetch comunicati
        const comunicatiQuery = query(
          collection(db, "comunicati"),
          orderBy("createdAt", "desc")
        );
        const comunicatiSnapshot = await getDocs(comunicatiQuery);
        const comunicatiData = comunicatiSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          tipo: "comunicato" as const,
        }));

        // Data e ora attuali per filtrare per data di pubblicazione
        const now = new Date();

        // Combine and filter both arrays
        const allItems = [...newsData, ...comunicatiData]
          .filter((item) => {
            // Filtro per categoria
            const hasMatchingCategory = categories.some((category) =>
              // @ts-ignore
              item.categories?.includes(category)
            );

            // Filtro per evitare di mostrare l'elemento corrente
            // @ts-ignore
            const isNotCurrent = !currentLink || item.linkNews !== currentLink;

            // Filtro per mostrare solo elementi con data <= data attuale
            const isPublishable =
              !item.createdAt || item.createdAt.getTime() <= now.getTime();

            return hasMatchingCategory && isNotCurrent && isPublishable;
          })
          // Sort combined results by date
          .sort((a, b) => {
            if (!a.createdAt || !b.createdAt) return 0;
            return b.createdAt.getTime() - a.createdAt.getTime();
          });
        // @ts-ignore
        setCombinedItems(allItems);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [categories, currentLink]);

  const formatDate = (date: Date) => {
    if (!date) return "";
    return new Date(date)
      .toLocaleDateString("it-IT", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      .toUpperCase();
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev + 6 >= combinedItems.length ? 0 : prev + 6
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev - 6 < 0 ? Math.max(0, combinedItems.length - 6) : prev - 6
    );
  };

  if (isLoading) {
    return <div className="text-center py-8">Caricamento...</div>;
  }

  if (combinedItems.length === 0) {
    return null;
  }

  const visibleItems = combinedItems.slice(currentIndex, currentIndex + 6);

  if (variant === "sidebar") {
    return (
      <div className="space-y-4">
        {combinedItems.slice(0, 3).map((item) => (
          <Link
            key={item.id}
            href={`/${item.tipo}/${item.linkNews}`}
            className="group block"
          >
            <div className="flex gap-4 items-start">
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={item.coverImage || "/img/logo.jpg"}
                  alt={item.title}
                  fill
                  className={`rounded-lg ${
                    item.coverImage ? "object-cover" : "object-contain"
                  }`}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-400 mb-1">
                  {formatDate(item.createdAt)}
                </p>
                <h3 className="text-sm font-medium line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <span className="text-xs text-gray-500 mt-1 capitalize">
                  {item.tipo}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {visibleItems.map((item, index) => (
              <motion.div
                key={item.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link href={`/${item.tipo}/${item.linkNews}`}>
                  <div className="relative h-48 md:h-56 border-b-[6px] border-blue-600">
                    <Image
                      src={item.coverImage || "/img/logo.jpg"}
                      alt={item.title}
                      fill
                      className={`${
                        item.coverImage ? "object-cover" : "object-contain"
                      }`}
                    />
                    <div className="absolute bottom-0 left-4 bg-blue-600 text-white px-3 py-2 text-sm font-bold">
                      {formatDate(item.createdAt)}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-gray-800 line-clamp-2 flex-1">
                        {item.title}
                      </p>
                      <span className="text-xs text-gray-500 ml-2 capitalize">
                        {item.tipo}
                      </span>
                    </div>
                    <div className="w-full py-2 text-center border border-snalv-200 text-snalv-600 rounded-md hover:bg-snalv-50 transition-colors uppercase">
                      leggi di più
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {combinedItems.length > 6 && (
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

export default NewsComponent;
