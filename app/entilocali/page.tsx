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
import { Building2, Briefcase, Shield, Users, ChevronRight } from "lucide-react";

export default function EntiLocaliPage() {
  const router = useRouter();

  return (
    <>
      <Header />
      <HeroSection section="enti-locali" />

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
                    <span className="font-bold">Telefono:</span> 350.0539435
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
