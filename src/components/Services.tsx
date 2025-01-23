"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

const ServiceSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const services = [
    {
      title: "CHI SIAMO",
      description: "Scopri la nostra storia e i nostri valori",
      image: "/icon/chisiamo.jpg",
      href: "/chi-siamo",
      buttonText: "Scopri di più",
    },
    {
      title: "SERVIZI",
      description: "Esplora tutti i servizi disponibili",
      image: "/icon/servizi.jpg",
      href: "/servizi",
      buttonText: "Vedi i servizi",
    },
    {
      title: "LE NOSTRE SEDI",
      description: "Trova la sede più vicina a te",
      image: "/icon/sedi.jpg",
      href: "/territorio#cerca-sede",
      buttonText: "Trova sede",
    },
    {
      title: "COMPARTO SOCIO-SANITARIO",
      description: "Informazioni per il settore sanitario",
      image: "/icon/locali.jpg", // Assumo che questa sia l'immagine corretta
      href: "/sociosanitario",
      buttonText: "Scopri di più",
    },
    {
      title: "COMPARTO FRAGILI",
      description: "Supporto per le categorie fragili",
      image: "/icon/fragili.jpg",
      href: "/fragili",
      buttonText: "Scopri di più",
    },
    {
      title: "COMPARTO ENTI LOCALI",
      description: "Assistenza per i dipendenti pubblici",
      image: "/icon/enti.jpg",
      href: "/entilocali",
      buttonText: "Scopri di più",
    },
    {
      title: "VERSAMENTI DELEGHE",
      description: "Gestione versamenti e deleghe",
      image: "/icon/versamenti.jpg",
      href: "https://iscrizione.snalv.it/aziende",
      buttonText: "Gestisci",
    },
    {
      title: "COLLABORAZIONI",
      description: "Opportunità di collaborazione",
      image: "/icon/collaborazioni.jpg",
      href: "/collabora",
      buttonText: "Collabora",
    },
    {
      title: "CONTATTI",
      description: "Come raggiungerci",
      image: "/icon/contatti.jpg",
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
    <div className="w-full md:w-3/4 mx-auto px-4 my-24 relative z-10 ">
      <div className="flex flex-col md:flex-row gap-16 md:gap-8 justify-between auto-rows-fr">
        <AnimatePresence mode="wait">
          {services
            .slice(currentIndex, currentIndex + 3)
            .map((service, idx) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="flex w-full md:w-1/3 justify-center"
              >
                <div className="relative w-full max-w-lg">
                  <Link href={service.href} className="block h-full">
                    <div
                      className="absolute left-1/2 -translate-x-1/2 -top-12 md:-top-16 w-24 h-24 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center z-20 overflow-hidden"
                      style={{
                        boxShadow: `4px 5px 0px #de041b`,
                      }}
                    >
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <Card className="pt-16 md:pt-20 pb-8 h-full border-[5px] border-dashed border-snalv-600 hover:border-solid transition-all">
                      <CardContent className="text-center flex flex-col h-full justify-between px-4">
                        <h3 className="text-lg md:text-xl font-bold text-blue-600 mb-2 xs:text-base sm:text-lg">
                          {service.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 xs:text-xs sm:text-sm">
                          {service.description}
                        </p>
                        <Button
                          variant="outline"
                          className="w-full text-snalv-600 border border-snalv-600 hover:bg-snalv-50 text-sm"
                        >
                          {service.buttonText}
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </motion.div>
            ))}
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <Button
          onClick={prevSlide}
          className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white shadow-md hover:bg-gray-50"
        >
          <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-snalv-600" />
        </Button>
        <Button
          onClick={nextSlide}
          className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white shadow-md hover:bg-gray-50"
        >
          <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-snalv-600" />
        </Button>
      </div>
    </div>
  );
};

export default ServiceSlider;
