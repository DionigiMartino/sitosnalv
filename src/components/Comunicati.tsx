"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
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
        const comunicatiQuery = query(
          collection(db, "comunicati"),
          orderBy("createdAt", "desc"),
          limit(3) // Limitiamo a 3 risultati
        );
        const querySnapshot = await getDocs(comunicatiQuery);
        const comunicatiData = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate(),
            tipo: "comunicati",
          }))
          .slice(0, 3); // Prendiamo solo i primi 3 anche dopo il filtro

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

  // Manteniamo la variante sidebar come era prima
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-8 sm:my-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {comunicati.map((comunicato, index) => (
            <motion.div
              key={comunicato.id}
              className="w-full bg-white rounded-lg shadow-sm overflow-hidden min-h-[460px] flex flex-col justify-between "
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="relative h-48 sm:h-48 md:h-64 border-b-[6px] border-blue-600 w-full">
                <Image
                  src={comunicato.coverImage || "/img/logo.jpg"}
                  alt={comunicato.title}
                  fill
                  className={`w-full ${
                    comunicato.coverImage ? "object-contain" : "object-contain"
                  }`}
                />
                <div className="absolute bottom-0 left-4 bg-blue-600 text-white px-4 font-bold py-2 text-sm">
                  {formatDate(comunicato.createdAt)}
                </div>
              </div>
              <div className="p-6 w-full">
                <p className="text-gray-800 mb-6 line-clamp-3 text-base sm:text-lg">
                  {comunicato.title}
                </p>
                <Link
                  href={`/comunicato/${comunicato.linkNews}`}
                  className="w-full flex justify-center items-center gap-2 uppercase py-4 text-center border border-snalv-200 text-snalv-600 rounded-md hover:bg-snalv-50 transition-colors font-bold"
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
