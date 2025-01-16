// app/enti-locali/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import CategoryNews from "@/src/components/CategoryNews";
import HeroSection from "@/src/components/Hero";
import { useRouter } from "next/navigation";

export default function EntiLocaliPage() {
  const router = useRouter();

  return (
    <>
      <Header />
      <HeroSection section="enti-locali" />

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
                  Comparti specifici
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              <h1 className="text-[#1a365d] text-4xl font-bold mb-6 md:text-5xl">
                ENTI LOCALI
              </h1>
              <p className="mb-8">
                Lo Snalv Confsal è impegnato nella tutela dei dipendenti
                pubblici delle &quot;Funzioni Locali&quot;
              </p>

              <div>
                <h2 className="text-xl text-blue-600 font-bold mb-4 md:text-2xl">
                  Il Sindacato rappresenta, in particolare, le lavoratrici e i
                  lavoratori dei seguenti ENTI:
                </h2>
                <ul className="list-none ps-0 pl-5 space-y-2 md:columns-2">
                  <li className="h-[90px] flex items-center justify-start rounded-md border-2 border-blue-600 p-2 text-blue-600 font-bold">
                    Regioni a statuto ordinario e degli Enti pubblici non
                    economici dalle stesse dipendenti
                  </li>
                  <li className="h-[90px] flex items-center justify-start rounded-md border-2 border-blue-600 p-2 text-blue-600 font-bold">
                    Province, Città metropolitane, Enti di area vasta, Liberi
                    consorzi comunali di cui alla legge 4 agosto 2015, n. 15
                    della regione Sicilia
                  </li>
                  <li className="h-[90px] flex items-center justify-start rounded-md border-2 border-blue-600 p-2 text-blue-600 font-bold">
                    Comuni
                  </li>
                  <li className="h-[90px] flex items-center justify-start rounded-md border-2 border-blue-600 p-2 text-blue-600 font-bold">
                    Comuni montani
                  </li>
                  <li className="h-[90px] flex items-center justify-start rounded-md border-2 border-blue-600 p-2 text-blue-600 font-bold">
                    ex Istituti autonomi per le case popolari comunque
                    denominati
                  </li>
                  <li className="h-[90px] flex items-center justify-start rounded-md border-2 border-blue-600 p-2 text-blue-600 font-bold">
                    Consorzi e associazioni, incluse le Unioni di Comuni
                  </li>
                  <li className="h-[90px] flex items-center justify-start rounded-md border-2 border-blue-600 p-2 text-blue-600 font-bold">
                    Aziende pubbliche di servizi alla persona (ex IPAB), che
                    svolgono prevalentemente funzioni assistenziali
                  </li>
                  <li className="h-[90px] flex items-center justify-start rounded-md border-2 border-blue-600 p-2 text-blue-600 font-bold">
                    Università agrarie ed associazioni agrarie dipendenti dagli
                    enti locali
                  </li>
                  <li className="h-[90px] flex items-center justify-start rounded-md border-2 border-blue-600 p-2 text-blue-600 font-bold">
                    Camere di commercio, industria, artigianato e agricoltura
                  </li>
                  <li className="h-[90px] flex items-center justify-start rounded-md border-2 border-blue-600 p-2 text-blue-600 font-bold">
                    Autorità di bacino, ai sensi della legge 21 ottobre 1994, n.
                    584
                  </li>
                </ul>
              </div>

              <Image
                src="/img/entilocali.jpg"
                alt="Enti Locali"
                width={600}
                height={500}
                className="rounded-md"
              />

              <div className="bg-gray-100 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4 md:text-2xl text-blue-600">
                  CONTATTACI
                </h2>
                <div className="space-y-2">
                  <p>
                    <span className="font-bold">Coordinatore nazionale:</span>{" "}
                    avv. Massimo Arena
                  </p>
                  <p>
                    <span className="font-bold">Email:</span>{" "}
                    entilocali@snalv.it - snalventilocali@pec.it
                  </p>
                  <p>
                    <span className="font-bold">Telefono:</span> 380.5252867
                  </p>
                </div>
              </div>

              <div className="mt-12">
                <h2 className="text-[#1a365d] text-2xl font-bold mb-6 md:text-3xl">
                  NOTIZIE COMPARTO ENTI LOCALI
                </h2>
                <CategoryNews categories={["Enti Locali"]} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
