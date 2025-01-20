// app/confsal-sud/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import CategoryNews from "@/src/components/CategoryNews";
import HeroSection from "@/src/components/Hero";
import { useRouter } from "next/navigation";

export default function ConfsalSudPage() {
  const router = useRouter();

  return (
    <>
      <Header />
      <HeroSection section="confsal-sud" />

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
                  className="w-full justify-start text-left hover:font-bold uppercase text-gray-700"
                  onClick={() => router.push("/comparti")}
                >
                  Comparti e CCNL
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              <h1 className="text-[#1a365d] text-4xl font-bold mb-6 md:text-5xl">
                CONFSAL SUD
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <p className="text-gray-700 mb-6">
                    La CONFSAL - prima Organizzazione italiana dei Sindacati
                    Autonomi per numero di lavoratori iscritti - ha costituito
                    un proprio Dipartimento dedicato al Sud del nostro Paese.
                  </p>

                  <p className="text-gray-700 mb-6">
                    L'obiettivo del Dipartimento è analizzare ed approfondire i
                    divari di cittadinanza che caratterizzano tante aree del
                    Mezzogiorno, al fine di elaborare proposte concrete da
                    presentare alle istituzioni competenti. A tal proposito, il
                    Dipartimento ha promosso l'iniziativa "Missione
                    Mediterraneo": trattasi di un ciclo di seminari da svolgersi
                    nelle diverse Regioni del Sud, che mira a focalizzare la
                    discussione sulle potenzialità di sviluppo dei territori in
                    relazione alla congiuntura economica del momento.
                  </p>

                  <p className="text-gray-700 mb-6">
                    Siamo fermamente convinti che il confronto e il raccordo tra
                    Rappresentanti europei, Amministrazioni centrali e locali,
                    Parti sociali potranno favorire una programmazione analitica
                    ed efficace delle risorse comunitarie ancorata ai reali
                    fabbisogni dei territori.
                  </p>

                  <p className="text-gray-600 text-base mb-6">
                    In quest&apos;ottica, il Dipartimento intende mettere in
                    rete rappresentanti delle Istituzioni, imprese, lavoratori,
                    giovani e disoccupati, Università e ricerca, parti sociali
                    impegnate a vario titolo nella promozione e nello sviluppo
                    del territorio.
                  </p>

                  <Image
                    src="/img/confsal.jpeg"
                    alt="Confsal Sud"
                    width={600}
                    className="rounded-md"
                    height={500}
                  />
                </div>

                {/* Sidebar */}
                <div className="md:col-span-1 space-y-6">
                  {/* Missione Mediterraneo Section */}
                  <div className="bg-white p-6 rounded-lg shadow">
                    {/* Title with red bar */}
                    <div className="flex gap-4 mb-8">
                      <div className="w-1 bg-red-600 flex-shrink-0"></div>
                      <h2 className="text-xl font-bold text-[#1a365d]">
                        MISSIONE MEDITERRANEO
                      </h2>
                    </div>

                    {/* Prossimi eventi */}
                    <div className="relative pb-6">
                      <div className="space-y-4">
                        <div className="text-gray-900">
                          <Link
                            href="/calabria-19-22"
                            className="hover:text-blue-600 transition-colors duration-75"
                          >
                            1° TAPPA: REGIONE SICILIA - Catania, 19/12/2022
                          </Link>
                        </div>
                        <div className="border-b border-dashed border-gray-300"></div>
                        <div className="text-gray-900">
                          <Link
                            href="/puglia-22-04-23"
                            className="hover:text-blue-600 transition-colors duration-75"
                          >
                            2° TAPPA: REGIONE PUGLIA - Gravina in Puglia,
                            22/04/2023
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Iniziative in corso */}

                  {/* Documenti e materiali */}
                </div>
              </div>

              <div className="mt-12">
                <h2 className="text-[#1a365d] text-2xl font-bold mb-6 md:text-3xl">
                  NOTIZIE DIPARTIMENTO SUD
                </h2>
                <CategoryNews categories={["Dipartimento SUD"]} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
