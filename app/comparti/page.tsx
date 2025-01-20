// app/comparti/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import {
  Heart,
  Users,
  Home,
  MapPin,
  ArrowRight,
  Building2,
  Briefcase,
  Shield,
  ChevronRight,
} from "lucide-react";
import HeroSection from "@/src/components/Hero";
import { useRouter } from "next/navigation";

export default function CompartiPage() {
  const router = useRouter();

  const settori = [
    {
      title: "SOCIO-SANITARIO-ASSISTENZIALE-EDUCATIVO",
      description:
        "Lo Snalv è la federazione rappresentativa della CONFSAL del settore socio-sanitario-assistenziale-educativo. Scopri di più sulla nostra attività sindacale in merito!",
      image: "/img/sociosanitario_banner.jpg",
      route: "/socio-sanitario",
      icon: Heart,
    },
    {
      title: "LAVORATORI FRAGILI",
      description:
        "Lo Snalv tutela i dipendenti affetti da patologie gravi, croniche o invalidanti per la salvaguardia dei diritti e dei doveri afferenti al proprio rapporto lavorativo.",
      image: "/img/fragili_banner.jpg",
      route: "/lavoratori-fragili",
      icon: Users,
    },
    {
      title: "ENTI LOCALI",
      description:
        "Lo Snalv è presente con i propri Rappresentanti nei vari comparti dell'intera Amministrazione anche a livello regionale. Scopri di più sull'organizzazione del nostro comparto!",
      image: "/img/enti_banner.png",
      route: "/enti-locali",
      icon: Home,
    },
    {
      title: "CONFSAL SUD",
      description:
        "Il Segretario Generale SNALV Confsal ricopre il ruolo di Coordinatore Nazionale del Dipartimento Confsal dedicato al Sud Italia.",
      image: "/img/confsal_banner.jpg",
      route: "/confsal-sud",
      icon: MapPin,
    },
  ];

  return (
    <>
      <Header />
      <HeroSection section="comparti" />

      <main className="max-w-full md:max-w-7xl px-4 mx-auto py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Menu Items */}
          <div className="lg:sticky lg:top-4 lg:h-fit">
            <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
              <nav className="space-y-2">
                {[
                  {
                    title: "Chi siamo",
                    route: "/chi-siamo",
                    icon: Users,
                  },
                  {
                    title: "La struttura nazionale",
                    route: "/struttura",
                    icon: Building2,
                  },
                  {
                    title: "Tutele e servizi",
                    route: "/servizi",
                    icon: Shield,
                  },
                  {
                    title: "Comparti e CCNL",
                    route: "/comparti",
                    icon: Briefcase,
                    active: true,
                  },
                ].map((item) => (
                  <Button
                    key={item.title}
                    variant={item.active ? "default" : "ghost"}
                    className={`w-full justify-between text-left group transition-all ${
                      item.active
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => !item.active && router.push(item.route)}
                  >
                    <span className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium">{item.title}</span>
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        item.active ? "rotate-90" : "group-hover:translate-x-1"
                      }`}
                    />
                  </Button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              <h1 className="text-[#1a365d] text-4xl font-bold mb-6">
                COMPARTI e CCNL
              </h1>
              <p className="text-gray-700 mb-8">
                Al fine di garantire ai lavoratori un supporto specifico e
                competente, in relazione alle peculiarità del settore o delle
                fasce lavorative, lo SNALV Confsal ha costituito i seguenti
                Comparti sindacali:
              </p>

              {/* Lista dei comparti */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {settori.map((settore, index) => {
                  const IconComponent = settore.icon;
                  return (
                    <div
                      key={index}
                      className="relative h-96 group overflow-hidden rounded-xl"
                      style={{
                        backgroundImage: `url(${settore.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {/* Overlay scuro con gradiente */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/40 group-hover:from-black/95 group-hover:to-black/50 transition-all duration-300" />

                      {/* Icona fluttuante */}
                      <div className="absolute top-6 right-6 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>

                      {/* Contenuto */}
                      <div className="relative h-full p-6 flex flex-col justify-end">
                        <h2 className="text-xl font-bold text-white mb-3">
                          {settore.title}
                        </h2>
                        <p className="text-gray-200 mb-6 opacity-90 group-hover:opacity-100 transition-opacity">
                          {settore.description}
                        </p>
                        <Button
                          variant="outline"
                          className="w-fit bg-transparent border-white text-white hover:bg-white hover:text-black transition-colors flex items-center gap-2"
                          onClick={() => router.push(settore.route)}
                        >
                          SCOPRI DI PIÙ
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CCNL Section */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-[#1a365d] mb-6">
                  I CONTRATTI COLLETTIVI NAZIONALI DI LAVORO SOTTOSCRITTI DALLO
                  SNALV
                </h2>

                {/* CCNL Anaste */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow mb-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#1a365d] mb-3">
                      CCNL Anaste{" "}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Il Contratto Collettivo Anaste si applica ai dipendenti di
                      imprese e Enti operanti nel campo socio-sanitario-
                      assistenziale-educativo. E' stato siglato dallo Snalv
                      Confsal il 3 luglio 2017 e rinnovato in data 27 dicembre
                      2022.
                    </p>
                    <div className="space-y-2">
                      <Link
                        href="/docs/ccnl_anaste.pdf"
                        className="block text-red-500 hover:text-red-600"
                      >
                        - CCNL Anaste 2022
                      </Link>
                      <Link
                        href="/docs/ccnl_anaste_verbale.pdf"
                        className="block text-red-500 hover:text-red-600"
                      >
                        - Verbale integrativo del 28.04.2023
                      </Link>
                    </div>
                  </div>
                </div>

                {/* CCNL Organizzazioni Sindacali */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow mb-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#1a365d] mb-3">
                      CCNL Organizzazioni Sindacali{" "}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      In data 1° dicembre 2010, lo Snalv Confsal ha sottoscritto
                      il CCNL per i lavoratori dipendenti delle Organizzazioni
                      Sindacali Nazionali e Territoriali, di rappresentanza e di
                      categoria delle Associazioni anche di settore, e degli
                      Enti loro partecipati, promossi e collegati con le
                      associazioni datoriali UNSIC e ASNALI. Il Contratto
                      Collettivo è stato rinnovato, da ultimo, in data 19
                      gennaio 2023.
                    </p>
                    <div className="space-y-2">
                      <Link
                        href="/docs/ccnl_oss.pdf"
                        className="block text-red-500 hover:text-red-600"
                      >
                        CCNL OO.SS. 2023-2025
                      </Link>
                    </div>
                  </div>
                </div>

                {/* CCNL Intersettoriale */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow mb-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#1a365d] mb-3">
                      CCNL Intersettoriale Confsal-Cifa{" "}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Il CCNL Intersettoriale è rivolto ai lavorati dei seguenti
                      settori: Commercio, Terziario, Servizi, Pubblici Esercizi
                      e Turismo. E' stato siglato il 24 luglio 2013 e rinnovato,
                      da ultimo, in data 20 luglio 2020
                    </p>
                    <div className="space-y-2">
                      <Link
                        href="/docs/ccnl_inter_settoriale.pdf"
                        className="block text-red-500 hover:text-red-600"
                      >
                        CCNL Intersettoriale.pdf
                      </Link>
                    </div>
                  </div>
                </div>

                {/* CCNL Lavoro domestico */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow mb-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#1a365d] mb-3">
                      CCNL Lavoro domestico{" "}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      In data 25 Maggio 2021 è stato siglato il Contratto
                      Collettivo per il lavoro domestico, che si applica ai
                      diversi profili professionali afferenti agli assistenti
                      familiari, addetti al funzionamento della vita familiare e
                      delle convivenze familiarmente strutturate.
                    </p>
                    <div className="space-y-2">
                      <Link
                        href="/docs/ccnl_lavoro_domestico.pdf"
                        className="block text-red-500 hover:text-red-600"
                      >
                        CCNL Lavoro domestico
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
