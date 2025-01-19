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

export default function SocioSanitarioPage() {
  const router = useRouter();

  return (
    <>
      <Header />
      <HeroSection section="socio-sanitario" />

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
                    <div className="space-y-2">
                      <Button variant="link">Il Testo integrale</Button>
                      <Button variant="link">
                        Verbale integrativo 28.04.2023
                      </Button>
                      <Button variant="link">Scheda di approfondimento</Button>
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
                    <Link className="my-2 text-snalv-500" href="/eventi">
                      Scopri di più
                    </Link>
                  </div>

                  <div className="bg-blue-900 text-white p-4 rounded flex flex-col gap-2">
                    <h3 className="font-bold mb-2 border-l-2 border-red-500 pl-3">
                      ASSICURAZIONE GRATUITA PER GLI ISCRITTI
                    </h3>
                    <p>
                      I lavoratori delle strutture
                      socio-sanitarie-assistenziali-educative possono avere
                      l&apos;assicurazione per colpa grave totalmente gratuita
                      se sei iscritto al sindacato
                    </p>
                    <Link
                      className="text-snalv-500"
                      href="https://www.gbsapri.it/convenzioni/colpa-grave-snalv-confsal"
                    >
                      Scopri di più
                    </Link>
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
