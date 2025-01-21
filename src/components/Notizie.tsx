"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import Link from "next/link";

const RecentNews = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsQuery = query(
          collection(db, "notizie"),
          orderBy("createdAt", "desc"),
          limit(3) // Limitiamo a 3 risultati
        );
        const querySnapshot = await getDocs(newsQuery);
        const newsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        }));

        setNews(newsData.slice(0, 3)); // Prendiamo solo i primi 3 anche dopo il filtro
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
        year: "numeric",
      })
      .toUpperCase();
  };

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl font-bold text-white mb-12 text-center sm:text-3xl lg:text-4xl">
          NOTIZIE RECENTI
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {news.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="min-h-[460px]"
            >
              <Card className="overflow-hidden bg-white shadow-md h-full ">
                <CardContent className="p-0 flex flex-col justify-between h-full">
                  <div className="relative h-48 sm:h-48 lg:h-56 border-b-[6px] border-blue-600">
                    <Image
                      src={item.coverImage || "/img/notizia1.jpg"}
                      alt={item.title}
                      fill
                      className="object-contain"
                    />
                    <div className="absolute bottom-0 left-4 bg-blue-600 text-white px-4 font-bold py-2 text-sm">
                      {formatDate(item.createdAt)}
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-800 mb-6 line-clamp-3 text-base sm:text-lg">
                      {item.title}
                    </p>
                    <Link
                      href={`/notizia/${item.linkNews}`}
                      className="block w-full text-center hover:bg-blue-700 font-bold uppercase bg-blue-600 p-4 rounded-md text-white transition-colors"
                    >
                      LEGGI DI PIÙ
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentNews;
