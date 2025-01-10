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
}

const NewsComponent = ({ categories, currentLink }: Props) => {
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
            tipo: "notizia",
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

        setNews(newsData);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
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
    setCurrentIndex((prev) => (prev + 6 >= news.length ? 0 : prev + 6));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev - 6 < 0 ? Math.max(0, news.length - 6) : prev - 6
    );
  };

  if (isLoading) {
    return <div className="text-center py-8">Caricamento...</div>;
  }

  if (news.length === 0) {
    return null;
  }

  const visibleNews = news.slice(currentIndex, currentIndex + 6);

  return (
    <div className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {visibleNews.map((item, index) => (
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
                      className={`${item.coverImage ? "object-cover" : "object-contain"}`}
                    />
                    <div className="absolute bottom-0 left-4 bg-blue-600 text-white px-3 py-2 text-sm font-bold">
                      {formatDate(item.createdAt)}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-800 mb-4 line-clamp-2">
                      {item.title}
                    </p>
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

      {news.length > 6 && (
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
