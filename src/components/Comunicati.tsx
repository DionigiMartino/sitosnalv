"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";

interface Props {
  categories: string[];
  currentLink?: string;
  variant?: string;
}

const ComunicatiStampa = ({
  categories,
  currentLink,
  variant = "default",
}: Props) => {
  const [comunicati, setComunicati] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComunicati = async () => {
      try {
        // Creiamo un timestamp per la data corrente
        const now = Timestamp.fromDate(new Date());

        // Query modificata per prendere solo i comunicati con data <= now
        const comunicatiQuery = query(
          collection(db, "comunicati"),
          where("createdAt", "<=", now), // Filtro per data
          orderBy("createdAt", "desc"),
          limit(3)
        );

        const querySnapshot = await getDocs(comunicatiQuery);
        const comunicatiData = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            tipo: "comunicati",
          }))
          .filter((comunicato) => {
            // Doppio controllo sulle date per sicurezza
            if (!comunicato.createdAt) return true;
            const comunicatoDate = new Date(comunicato.createdAt);
            const currentDate = new Date();
            return comunicatoDate <= currentDate;
          })
          .slice(0, 3);

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
        year: "numeric",
      })
      .toUpperCase();
  };

  if (isLoading) {
    return <div className="text-center py-8">Caricamento...</div>;
  }

  if (comunicati.length === 0) {
    return null;
  }

  // Variante sidebar
  if (variant === "sidebar") {
    return (
      <div className="space-y-4">
        {comunicati.map((comunicato) => (
          <Link
            key={comunicato.id}
            href={`/comunicato/${comunicato.linkNews}`}
            className="group block"
          >
            <div className="flex gap-4 items-start">
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={comunicato.coverImage || "/img/logo.jpg"}
                  alt={comunicato.title}
                  fill
                  className={`rounded-lg ${
                    comunicato.coverImage ? "object-cover" : "object-contain"
                  }`}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-400 mb-1">
                  {formatDate(comunicato.createdAt)}
                </p>
                <h3 className="text-sm font-medium line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {comunicato.title}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  // Versione default con griglia
  return (
    <div className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 md:my-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {comunicati.map((comunicato, index) => (
            <motion.div
              key={comunicato.id}
              className="w-full bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="relative border-b-[4px] md:border-b-[6px] border-blue-600">
                <Image
                  src={comunicato.coverImage || "/img/logo.jpg"}
                  alt={comunicato.title}
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
                <div className="absolute bottom-0 left-0 md:left-4 bg-blue-600 text-white px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm font-bold">
                  {formatDate(comunicato.createdAt)}
                </div>
              </div>
              <div className="p-4 md:p-6 flex flex-col flex-grow">
                <p className="text-gray-800 mb-4 md:mb-6 line-clamp-3 text-sm md:text-base lg:text-lg font-medium">
                  {comunicato.title}
                </p>
                <Link
                  href={`/comunicato/${comunicato.linkNews}`}
                  className="mt-auto w-full flex justify-center items-center gap-2 uppercase py-3 md:py-4 text-center border border-snalv-200 text-snalv-600 rounded-md hover:bg-snalv-50 transition-colors font-bold text-sm md:text-base"
                >
                  LEGGI DI PIÙ
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComunicatiStampa;
