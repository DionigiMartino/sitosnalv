"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  FiInfo,
  FiSettings,
  FiMapPin,
  FiHeart,
  FiUsers,
  FiHome,
  FiDollarSign,
  FiUserPlus,
  FiPhone,
} from "react-icons/fi";
import { useState } from "react";
import Link from "next/link";

const ServiceSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const services = [
    {
      title: "CHI SIAMO",
      description: "Scopri la nostra storia e i nostri valori",
      icon: FiInfo,
      href: "/chi-siamo",
      buttonText: "Scopri di più",
    },
    {
      title: "SERVIZI",
      description: "Esplora tutti i servizi disponibili",
      icon: FiSettings,
      href: "/servizi",
      buttonText: "Vedi i servizi",
    },
    {
      title: "LE NOSTRE SEDI",
      description: "Trova la sede più vicina a te",
      icon: FiMapPin,
      href: "/sedi",
      buttonText: "Trova sede",
    },
    {
      title: "COMPARTO SOCIO-SANITARIO",
      description: "Informazioni per il settore sanitario",
      icon: FiHeart,
      href: "/sociosanitario",
      buttonText: "Scopri di più",
    },
    {
      title: "COMPARTO FRAGILI",
      description: "Supporto per le categorie fragili",
      icon: FiUsers,
      href: "/fragili",
      buttonText: "Maggiori info",
    },
    {
      title: "COMPARTO ENTI LOCALI",
      description: "Servizi per gli enti locali",
      icon: FiHome,
      href: "/entilocali",
      buttonText: "Dettagli",
    },
    {
      title: "VERSAMENTI DELEGHE",
      description: "Gestione versamenti e deleghe",
      icon: FiDollarSign,
      href: "/versamenti",
      buttonText: "Gestisci",
    },
    {
      title: "COLLABORAZIONI",
      description: "Opportunità di collaborazione",
      icon: FiUserPlus,
      href: "/collaborazioni",
      buttonText: "Collabora",
    },
    {
      title: "CONTATTI",
      description: "Come raggiungerci",
      icon: FiPhone,
      href: "/contatti",
      buttonText: "Contattaci",
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 3) % services.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 3 + services.length) % services.length);
  };

  return (
    <div className="w-3/4 mx-auto px-4 my-24 relative z-10">
      <div className="grid grid-cols-3 gap-8">
        <AnimatePresence mode="wait">
          {services
            .slice(currentIndex, currentIndex + 3)
            .map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                >
                  <Link href={service.href} className="relative">
                    <div
                      className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-red-100 
                    flex items-center justify-center border-4 border-white z-20 hover:bg-red-200 transition-colors
                    "
                    >
                      <Icon className="w-16 h-16 text-red-500" />
                    </div>
                    <Card className="pt-24 pb-8 h-full border-2 border-dashed border-red-500 hover:border-solid transition-all">
                      <CardContent className="text-center flex flex-col h-full justify-between">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 mb-6">
                          {service.description}
                        </p>
                        <Button
                          variant="outline"
                          className="w-full text-red-500 border-red-500 hover:bg-red-50"
                        >
                          {service.buttonText}
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <Button
          onClick={prevSlide}
          className="w-10 h-10 rounded-full bg-white shadow-md hover:bg-gray-50"
        >
          <ChevronLeft className="w-6 h-6 text-red-500" />
        </Button>
        <Button
          onClick={nextSlide}
          className="w-10 h-10 rounded-full bg-white shadow-md hover:bg-gray-50"
        >
          <ChevronRight className="w-6 h-6 text-red-500" />
        </Button>
      </div>
    </div>
  );
};

export default ServiceSlider;
