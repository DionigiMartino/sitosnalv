// app/socio-sanitario/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import CategoryNews from "@/src/components/CategoryNews";
import HeroSection from "@/src/components/Hero";
import { useRouter } from "next/navigation";
import {
  Building2,
  Briefcase,
  Shield,
  Users,
  ChevronRight,
} from "lucide-react";

export default function SocioSanitarioPage() {
  const router = useRouter();

  return (
    <>
      <Header />
      <HeroSection section="socio-sanitario" />

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
                SOCIO-SANITARIO-ASSISTENZIALE-EDUCATIVO
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <p className="text-gray-700 mb-6">
                    Lo Snalv Confsal è la federazione rappresentativa della
                    CONFSAL per il comparto
                    socio-sanitario-assistenziale-educativo. La politica, miope
                    e frammentata degli ultimi anni, sta producendo il collasso
                    del sistema, che tuttavia ancora oggi è sostenuto
                    dall'incredibile abnegazione di operatori socio sanitari,
                    infermieri, educatori professionali, terapisti e di tutte le
                    professionalità operanti all'interno delle strutture
                    accreditate.
                  </p>

                  <p className="text-gray-700 mb-6">
                    Ci sono problemi di fondo che mai nessuno ha voluto
                    affrontare e che impediscono, anche alla contrattazione
                    collettiva, di valorizzare adeguatamente le professionalità
                    del comparto. Lo Snalv Confsal, anche in considerazione
                    dell'iter attuativo della riforma sull'assistenza agli
                    anziani, ha avviato una seria e concreta discussione con
                    istituzioni e datori di lavoro per consentire il
                    miglioramento delle condizioni lavorative dei dipendenti.
                  </p>

                  <p className="text-gray-700 mb-6">
                    Nello specifico, la nostra mission si compone di tre punti
                    qualificanti: <br />
                    <br />
                    • Equiparazione degli stipendi e delle condizioni di lavoro
                    dei dipendenti delle strutture accreditate a quelle dei
                    colleghi del pubblico impiego;
                    <br />
                    <br />• Garanzia di un numero minimo di personale adeguato
                    al numero degli utenti assistiti;
                    <br />
                    <br />• Programmazione efficace del fabbisogno di personale,
                    in relazione alla crescita esponenziale della popolazione
                    anziana in Italia.
                    <br />
                    <br />
                    Su questi presupposti, i lavoratori iscritti al Sindacato
                    hanno approvato una piattaforma programmatica che prova a
                    sviscerare le comuni problematiche del personale, indagando
                    sulle cause che determinano inefficienze organizzative e
                    discriminazioni contrattuali. Il documento tenta di fornire,
                    al tempo stesso, indirizzi di politiche pubbliche da attuare
                    nel breve e medio termine.
                  </p>

                  <p className="text-gray-700 mb-6">
                    La piattaforma{" "}
                    <Link
                      className="text-snalv-500"
                      href="/docs/piattaforma.pdf"
                    >
                      (scaricabile QUI)
                    </Link>{" "}
                    è stata formalmente trasmessa a tutte le Istituzioni
                    competenti in data 23 febbraio 2024.
                  </p>

                  <Image
                    src="/img/sociosanitario.jpg"
                    alt="Socio-Sanitario"
                    width={600}
                    className="rounded-md"
                    height={500}
                  />

                  <div className="space-y-4 mt-8">
                    <h2 className="text-[#1a365d] text-2xl font-bold md:text-3xl">
                      CONTATTACI
                    </h2>
                    <p>Email: socioassistenziale@snalv.it</p>
                    <p>Telefono: 06.70492451</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-100 p-4 rounded">
                    <h3 className="font-bold mb-2 border-l-2 border-red-500 pl-3">
                      IL CCNL ANASTE 2022
                    </h3>
                    <div className="space-y-2 flex flex-col gap-2">
                      <Link href="/docs/ccnl_anaste.pdf">
                        Il Testo integrale
                      </Link>
                      <Link href="/docs/ccnl_anaste_verbale.pdf">
                        Verbale integrativo 28.04.2023
                      </Link>
                    </div>
                  </div>

                  <div className="bg-blue-900 text-white p-4 rounded flex flex-col gap-2">
                    <h3 className="font-bold mb-2 border-l-2 border-red-500 pl-3">
                      EVENTO 20 FEBBRAIO 2024 - ROMA
                    </h3>
                    <p>
                      SETTORE SOCIO SANITARIO, valorizzare il LAVORO per
                      garantire la QUALITÀ dei servizi
                    </p>
                    <Link
                      className="my-2 text-snalv-500"
                      href="/evento-20-febbraio"
                    >
                      Scopri di più
                    </Link>
                  </div>

                  <div className="bg-blue-900 text-white p-4 rounded flex flex-col gap-2">
                    <h3 className="font-bold mb-2 border-l-2 border-red-500 pl-3">
                      ASSICURAZIONE GRATUITA PER GLI ISCRITTI
                    </h3>
                    <p>
                      I lavoratori delle strutture private o accreditate possono
                      avere l&apos;Assicurazione per colpa grave totalmente
                      gratuita.
                    </p>
                    <p>
                      Se sei iscritto al Sindacato, richiedi{" "}
                      <Link
                        className="text-snalv-500"
                        href="/richiestacertificato"
                      >
                        qui
                      </Link>{" "}
                      il tuo certitficato.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h2 className="text-[#1a365d] text-2xl font-bold mb-6 md:text-3xl">
                  NOTIZIE COMPARTO SOCIOSANITARIO
                </h2>
                <CategoryNews categories={["Socio Sanitario"]} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
