"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import Image from "next/image";
import { FiInfo, FiMapPin, FiSettings } from "react-icons/fi";
import Link from "next/link";
import ComunicatiStampa from "@/src/components/Comunicati";
import Notizie from "@/src/components/Notizie";
import { motion } from "framer-motion";
import ServiceSlider from "@/src/components/Services";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <div className="relative w-full">
        <div className="relative h-[45vh] md:h-[95vh] lg:h-[90vh] flex items-center">
          {/* Immagine di sfondo */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/img/introNew.jpg"
              alt="Sezione Hero"
              fill
              className="object-cover" // Scurito leggermente lo sfondo
              priority
            />
          </div>

          {/* Contenitore del pulsante con sfondo semi-trasparente */}
          <div className="absolute bottom-4 md:bottom-8 left-0 right-0 px-4 md:px-0 z-10">
            <Link
              href="https://iscrizione.snalv.it"
              className="block mx-auto w-fit
              bg-white/90 backdrop-blur-sm 
              text-snalv-600 
              px-8 sm:px-10 
              py-3 sm:py-4
              rounded-lg
              uppercase font-bold 
              text-sm sm:text-base md:text-lg
              hover:bg-blue-600 hover:text-white
              transition-all duration-300
              shadow-lg hover:shadow-xl
              text-center
              tracking-wide
              border-2 border-transparent hover:border-white/20
              max-w-[90%] sm:max-w-none"
            >
              <span className="drop-shadow-sm">
                Unisciti, partecipa, conta!
              </span>
            </Link>
          </div>

          {/* Overlay gradiente opzionale per migliorare la leggibilità */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-[1]"></div>
        </div>
      </div>

      {/* Features Section */}
      <ServiceSlider />

      {/* Featured Section */}
      <div className="bg-gray-100 py-16 bg-[url('/img/sfondoNews.jpg')] bg-no-repeat bg-cover bg-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <h2 className="text-5xl font-bold text-white mb-12 text-center">
            COMUNICATI STAMPA RECENTI
          </h2>
          <ComunicatiStampa categories={["In Evidenza"]} />

          <Notizie />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
