// app/comparti/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { FiHeart, FiUsers, FiHome, FiMapPin } from "react-icons/fi";
import HeroSection from "@/src/components/Hero";
import { useRouter } from "next/navigation";

export default function CompartiPage() {
  const router = useRouter();

  return (
    <>
      <Header />
      <HeroSection section="comparti" />

      <main className="max-w-full md:max-w-7xl px-4 mx-auto py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Menu Items */}
          <div className="">
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="py-4 border-b-2 border-red-500">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left hover:font-bold uppercase text-gray-700"
                  onClick={() => router.push("/chi-siamo")}
                >
                  Chi siamo
                </Button>
              </div>
              <div className="py-4 border-b-2 border-red-500">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left hover:font-bold uppercase text-gray-700"
                  onClick={() => router.push("/struttura")}
                >
                  La struttura nazionale
                </Button>
              </div>
              <div className="py-4 border-b-2 border-red-500">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left hover:font-bold uppercase text-gray-700"
                  onClick={() => router.push("/servizi")}
                >
                  Tutele e servizi
                </Button>
              </div>
              <div className="py-4 border-b-2 border-red-500">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left hover:font-bold uppercase text-red-500 font-bold"
                >
                  Comparti e CCNL
                </Button>
              </div>
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
              <div className="grid gap-6">
                {/* SOCIO-SANITARIO */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-[#1a365d] mb-3">
                        SOCIO-SANITARIO-ASSISTENZIALE-EDUCATIVO
                      </h2>
                      <p className="text-gray-600 mb-4">
                        Lo Snalv è la federazione rappresentativa della CONFSAL
                        del settore socio-sanitario-assistenziale-educativo.
                        Scopri di più sulla nostra attività sindacale in merito!
                      </p>
                      <div className="flex items-center">
                        <Button
                          onClick={() => router.push("/socio-sanitario")}
                          className="flex items-center space-x-2 text-red-500 hover:text-red-600 transition-colors"
                          variant="link"
                        >
                          <span>SCOPRI DI PIÙ</span>
                          <span>→</span>
                        </Button>
                      </div>
                    </div>
                    <div className="ml-6">
                      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                        <FiHeart className="w-8 h-8 text-red-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* LAVORATORI FRAGILI */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-[#1a365d] mb-3">
                        LAVORATORI FRAGILI
                      </h2>
                      <p className="text-gray-600 mb-4">
                        Lo Snalv tutela i dipendenti affetti da patologie gravi,
                        croniche o invalidanti per la salvaguardia dei diritti e
                        dei doveri afferenti al proprio rapporto lavorativo.
                      </p>
                      <div className="flex items-center">
                        <Button
                          onClick={() => router.push("/lavoratori-fragili")}
                          className="flex items-center space-x-2 text-red-500 hover:text-red-600 transition-colors"
                          variant="link"
                        >
                          <span>SCOPRI DI PIÙ</span>
                          <span>→</span>
                        </Button>
                      </div>
                    </div>
                    <div className="ml-6">
                      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                        <FiUsers className="w-8 h-8 text-red-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ENTI LOCALI */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-[#1a365d] mb-3">
                        ENTI LOCALI
                      </h2>
                      <p className="text-gray-600 mb-4">
                        Lo Snalv è presente con i propri Rappresentanti nei vari
                        comparti dell&apos;intera Amministrazione anche a
                        livello regionale. Scopri di più
                        sull&apos;organizzazione del nostro comparto!
                      </p>
                      <div className="flex items-center">
                        <Button
                          onClick={() => router.push("/enti-locali")}
                          className="flex items-center space-x-2 text-red-500 hover:text-red-600 transition-colors"
                          variant="link"
                        >
                          <span>SCOPRI DI PIÙ</span>
                          <span>→</span>
                        </Button>
                      </div>
                    </div>
                    <div className="ml-6">
                      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                        <FiHome className="w-8 h-8 text-red-500" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* CONFSAL SUD */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-[#1a365d] mb-3">
                        CONFSAL SUD
                      </h2>
                      <p className="text-gray-600 mb-4">
                        Il Segretario Generale SNALV Confsal ricopre il ruolo di
                        Coordinatore Nazionale del Dipartimento Confsal dedicato
                        al Sud Italia.
                      </p>
                      <div className="flex items-center">
                        <Button
                          onClick={() => router.push("/confsal-sud")}
                          className="flex items-center space-x-2 text-red-500 hover:text-red-600 transition-colors"
                          variant="link"
                        >
                          <span>SCOPRI DI PIÙ</span>
                          <span>→</span>
                        </Button>
                      </div>
                    </div>
                    <div className="ml-6">
                      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                        <FiMapPin className="w-8 h-8 text-red-500" />
                      </div>
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
