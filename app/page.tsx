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
      <div className="relative md:min-h-[80vh] min-h-[40vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/img/introNew.jpg"
            alt="Sezione Hero"
            fill
            className="object-cover brightness-100"
            priority
          />
        </div>

        <Link
          href="/iscrizione"
          className="bg-white text-snalv-600 px-8 py-2 rounded-md uppercase font-bold text-lg hover:bg-blue-600 transition-colors absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          Unisciti, partecipa, conta!
        </Link>
      </div>

      {/* Features Section */}
      <ServiceSlider />

      {/* Featured Section */}
      <div className="bg-gray-100 py-16 bg-[url('/img/sfondoNews.jpg')] bg-no-repeat bg-cover bg-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <h2 className="text-5xl font-bold text-white mb-12 text-center">
            IN EVIDENZA
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
