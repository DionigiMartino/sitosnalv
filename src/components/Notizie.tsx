"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  limit,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import Link from "next/link";

const RecentNews = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const now = new Date();

        // Creiamo una query che prende solo le notizie con data minore o uguale a now
        const newsQuery = query(
          collection(db, "notizie"),
          where("createdAt", "<=", now),
          orderBy("createdAt", "desc"),
          limit(3)
        );

        const querySnapshot = await getDocs(newsQuery);
        const newsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        }));

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
    <div className="py-8 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 md:mb-12 text-center">
          NOTIZIE RECENTI
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {news.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="relative border-b-[4px] md:border-b-[6px] border-blue-600">
                    <Image
                      src={item.coverImage || "/img/notizia1.jpg"}
                      alt={item.title}
                      width={800}
                      height={600}
                      className="w-full h-auto"
                    />
                    <div className="absolute bottom-0 left-0 md:left-4 bg-blue-600 text-white px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm font-bold">
                      {formatDate(item.createdAt)}
                    </div>
                  </div>
                  <div className="p-4 md:p-6 flex flex-col flex-grow">
                    <p className="text-gray-800 mb-4 md:mb-6 line-clamp-3 text-sm md:text-base lg:text-lg font-medium">
                      {item.title}
                    </p>
                    <Link
                      href={`/notizia/${item.linkNews}`}
                      className="mt-auto block w-full text-center font-bold uppercase bg-blue-600 px-3 md:px-4 py-3 md:py-4 rounded-md text-white text-sm md:text-base transition-all hover:bg-blue-700 hover:shadow-md"
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
