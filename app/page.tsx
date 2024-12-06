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
      <div className="relative min-h-[80vh] flex items-center">
        <div className="absolute inset-0 z-0 border-b-[8px] border-red-200">
          <Image
            src="/img/Home.jpg"
            alt="Sezione Hero"
            fill
            className="object-cover brightness-75"
            priority
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
          <div className="ml-auto max-w-2xl text-white">
            <motion.h1
              className="text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Lorem Ipsum
            </motion.h1>
            <motion.p
              className="text-xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button
                size="lg"
                className="text-lg px-8 bg-white text-blue-900 font-bold hover:bg-gray-100"
              >
                ISCRIVITI
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <ServiceSlider />

      {/* Featured Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
          <h2 className="text-5xl font-bold text-[#1a365d] mb-12 text-center">
            IN EVIDENZA
          </h2>
          <ComunicatiStampa />

          <Notizie />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HomePage;
