// app/lavoratori-fragili/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import CategoryNews from "@/src/components/CategoryNews";
import HeroSection from "@/src/components/Hero";
import { useRouter } from "next/navigation";

export default function LavoratoriFragiliPage() {
  const router = useRouter();

  return (
    <>
      <Header />
      <HeroSection section="lavoratori-fragili" />

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
                LAVORATORI FRAGILI
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <p className="text-gray-700 mb-6">
                    "La qualità della vita all'interno di una società si misura,
                    in buona parte, dalla capacità di includere coloro che sono
                    più deboli e bisognosi, nel rispetto effettivo della loro
                    dignità di uomini e di donne. E la maturità si raggiunge
                    quando tale inclusione non è percepita come qualcosa di
                    straordinario, ma di normale. Anche la persona con
                    disabilità e fragilità fisiche, psichiche o morali, deve
                    poter partecipare alla vita della società ed essere aiutata
                    ad attuare le sue potenzialità nelle varie dimensioni.
                    Soltanto se vengono riconosciuti i diritti dei più deboli,
                    una società può dire di essere fondata sul diritto e sulla
                    giustizia."
                  </p>

                  <p className="text-gray-700 mb-6">
                    (Papa Francesco, febbraio 2017)
                  </p>

                  <p className="text-gray-700 mb-6">
                    Sin dall'inizio della pandemia il nostro Sindacato si è
                    battuto su ogni fronte per tutelare pienamente la categoria
                    dei lavoratori fragili. Il Covid- 19 ha soltanto esasperato
                    alcune problematiche che attanagliano da sempre la
                    quotidianità dei lavoratori. Da qui nasce il nuovo comparto
                    sindacale dedicato esclusivamente ai lavoratori affetti da
                    patologie gravi, croniche o invalidanti. Il progetto
                    sindacale mira a garantire una tutela piena ed effettiva dei
                    lavoratori e dei loro familiari, con competenze specifiche e
                    settoriali. Il comparto copre tre aree di intervento:
                    sindacale, legale e previdenziale. L'obiettivo è garantire
                    sempre una risposta appropriata alle esigenze derivanti dal
                    mondo della fragilità e delle disabilità in genere.
                  </p>

                  <p className="text-gray-700 mb-6">
                    Il comparto, inoltre, ha predisposto una proposta di legge
                    che tutela i lavoratori in tutte le fasi del rapporto
                    lavorativo:
                    <br />
                    <br />
                    - inserimento occupazionale,
                    <br />
                    - gestione delle assenze e conciliazione con le esigenze di
                    cura
                    <br />
                    - re-inserimento lavorativo dopo la fase acuta della
                    patologia
                    <br />- modalità anticipata di pensionamento.
                  </p>

                  <p className="text-gray-700 mb-6">
                    Sproneremo costantemente la politica affinchè tale proposta
                    diventi presto una Legge dello Stato. Tutelare i lavoratori
                    fragili è una questione di civiltà!
                  </p>

                  <Image
                    src="/img/fragili.jpg"
                    alt="Lavoratori Fragili"
                    width={600}
                    className="rounded-md"
                    height={500}
                  />

                  <div className="space-y-4 mt-8">
                    <h2 className="text-[#1a365d] text-2xl font-bold md:text-3xl">
                      CONTATTACI
                    </h2>
                    <p>Email: sociosanitario@snalv.it</p>
                    <p>Telefono: 06.70492451</p>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="md:col-span-1">
                  <div className="bg-white p-6 rounded-lg shadow">
                    {/* Title with red bar */}
                    <div className="flex gap-4 mb-8">
                      <div className="w-1 bg-red-600 flex-shrink-0"></div>
                      <h2 className="text-xl font-bold text-[#1a365d]">
                        INIZIATIVE E DOCUMENTI
                      </h2>
                    </div>

                    {/* Links with dotted separators */}
                    <nav className="space-y-8">
                      {/* Convegno */}
                      <div className="relative flex flex-col gap-3">
                        <Link
                          href="/"
                          className="text-gray-900 hover:text-snalv-500"
                        >
                          Il Convegno del 26.07.2022!
                        </Link>
                        <div className=" h-px border-b border-dashed border-gray-300" />

                        <Link
                          href="/documents/piattaforma-fragili.pdf"
                          className="block text-gray-900 hover:text-snalv-500"
                          target="_blank"
                        >
                          Scarica la nostra piattaforma programmatica
                        </Link>
                        <div className=" h-px border-b border-dashed border-gray-300" />
                      </div>
                    </nav>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h2 className="text-[#1a365d] text-2xl font-bold mb-6 md:text-3xl">
                  NOTIZIE COMPARTO LAVORATORI FRAGILI
                </h2>
                <CategoryNews categories={["Fragili"]} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
