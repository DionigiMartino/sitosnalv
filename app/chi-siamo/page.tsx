// app/chi-siamo/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { useState } from "react";
import HeroSection from "@/src/components/Hero";
import { useRouter } from "next/navigation";

export default function ChiSiamoPage() {
  const [activeSection, setActiveSection] = useState("chi-siamo");
  const router = useRouter();

  const renderOrganigrammaContent = () => {
    switch (activeSection) {
      case "segretario":
        return (
          <div className="space-y-12">
            <section>
              <h1 className="text-[#1a365d] text-4xl font-bold mb-8 md:text-5xl">
                Il Segretario Generale
              </h1>
              <h2 className="text-[#1a365d] text-2xl font-bold mb-4 md:text-3xl">
                Dott.ssa Maria Mamone
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-100 p-6">
                  <p>
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
                    sed diam nonummy nibh euismod tincidunt ut laoreet dolore
                    magna aliquam erat volutpat.
                  </p>
                </div>
                <div>
                  <Image
                    src="/img/mamone.jpg"
                    alt="Maria Mamone"
                    width={300}
                    height={300}
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-[#1a365d] text-4xl font-bold mb-8 md:text-5xl">
                Il Vice-Segretario Nazionale
              </h2>
              <h3 className="text-[#1a365d] text-2xl font-bold mb-4 md:text-3xl">
                Cosimo Nesci - consigliere CNEL
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-100 p-6">
                  <p>
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
                    sed diam nonummy nibh euismod tincidunt ut laoreet dolore
                    magna aliquam erat volutpat.
                  </p>
                </div>
                <div>
                  <Image
                    src="/img/nesci.jpg"
                    alt="Cosimo Nesci"
                    width={300}
                    height={300}
                  />
                </div>
              </div>
            </section>
          </div>
        );

      case "segreteria":
        return (
          <div>
            <h1 className="text-[#1a365d] text-4xl font-bold mb-8 md:text-5xl">
              La Segreteria nazionale
            </h1>
            <p className="mb-8">
              I componenti della Segreteria Nazionale, eletti durante
              l&apos;ultimo Congresso Nazionale SNALV/Confsal
            </p>
            <ul className="space-y-2 md:columns-2">
              {[
                "MARIA MAMONE",
                "COSIMO NESCI",
                "GIULIA PUDDU",
                "GIUSEPPINA ADAMO",
                "BELINDA PESCOSOLIDO",
                "DANIELE PACE",
                "PASQUALE PELLEGRINO",
              ].map((name) => (
                <li key={name} className="text-[#1a365d]">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        );

      case "consiglio":
        return (
          <div>
            <h1 className="text-[#1a365d] text-4xl font-bold mb-8 md:text-5xl">
              Il Consiglio Nazionale
            </h1>
            <p className="mb-8">
              I componenti del Consiglio Nazionale, eletti durante l&apos;ultimo
              Congresso Nazionale SNALV/Confsal
            </p>
            <ul className="space-y-2 md:columns-3">
              {[
                "MARIA MAMONE",
                "COSIMO NESCI",
                "GIULIA PUDDU",
                "GIUSEPPINA ADAMO",
                "BELINDA PESCOSOLIDO",
                "DANIELE PACE",
                "PASQUALE PELLEGRINO",
                "ISABELLA MAMONE",
                "VINCENZO PALDINO",
                "VALERIA SMURRA",
                "CLAUDIO ZUCCHELLI",
                "FRANCESCO FLORIO",
                "STANISLAO AULETTA",
                "FARA MANZI",
                "ANTONIO LENTO",
                "PEPPINO RUBERTO",
                "ANTONIO SANTONOCITO",
                "DANIELA MAZZOLA",
                "MARTINA DONINI",
                "FABIO LAROCCA",
                "DANIELA MARIA SERVETTI",
              ].map((name) => (
                <li key={name} className="text-[#1a365d]">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        );

      default:
        return (
          <div className="space-y-12 flex flex-col gap-12">
            <div className="space-y-6 text-gray-700 flex flex-col md:flex-row justify-between">
              <div className="w-full md:w-2/5 flex flex-col gap-6">
                <h1 className="text-[#1a365d] text-4xl font-bold mb-8 md:text-5xl">
                  CHI SIAMO
                </h1>
                <p className="text-justify">
                  Lo Snalv Confsal è un&apos;Organizzazione Sindacale libera e
                  democratica, aderente alla CONFSAL, terzo Sindacato in Italia
                  in termini di rappresentatività sindacale.
                </p>
                <p className="text-justify">
                  Il nostro Sindacato tutela i lavoratori dipendenti del settore
                  privato ed i dipendenti pubblici degli &quot;Enti
                  Locali&quot;, corsi convenzionati ed i pensionati.
                </p>
                <p className="text-justify">
                  Siamo diffusi su tutto il territorio nazionale con oltre{" "}
                  <strong>220</strong> sedi sindacali aperte al pubblico
                  (consulta qui l&apos;elenco completo)
                </p>
                <p className="text-justify">
                  Al 31/12/2024 lo Snalv Confsal ha superato il numero di{" "}
                  <strong>50.000</strong> iscritti al Sindacato, con oltre n.{" "}
                  <strong>150</strong> rappresentanze sindacali aziendali nel
                  settore privato (da RSA e RSU) e n. 51 membri RSU nel settore
                  pubblico.
                </p>
              </div>
              <iframe
                className="w-full md:w-2/4 rounded-md"
                src="https://www.youtube.com/embed/QPBVvkYdR3c"
              ></iframe>
            </div>

            <div
              className="flex flex-col md:flex-row items-center gap-6 cursor-pointer bg-gray-100 rounded-lg p-4 hover:bg-gray-200 transition-colors"
              onClick={() => router.push("/congresso")}
            >
              <Image
                src="/img/congresso.jpg"
                width={200}
                height={100}
                alt="Congresso"
              />
              <h1 className="text-3xl text-blue-600 md:w-1/3 text-center md:text-left">
                Il Congresso Nazionale del 2018
              </h1>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Header />
      <HeroSection section="chi-siamo" />

      <main className="max-w-full md:max-w-7xl px-4 mx-auto py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Menu Items */}
          <div className="">
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="py-4 border-b-2 border-red-500">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left hover:font-bold uppercase text-red-500 font-bold"
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
                  onClick={() => router.push("/tutele")}
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

            {/* Organigramma Section */}
            <div className="mt-8">
              <h2 className="text-[#1a365d] text-xl font-bold mb-4">
                ORGANIGRAMMA
              </h2>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className={`w-full justify-between bg-gray-100 hover:bg-gray-200 py-6 text-left text-wrap hover:font-bold ${
                    activeSection === "segretario" ? "bg-gray-200" : ""
                  }`}
                  onClick={() => setActiveSection("segretario")}
                >
                  Il Segretario Generale ed il Vice-Segretario Nazionale
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-between bg-gray-100 hover:bg-gray-200 py-6 text-left text-wrap hover:font-bold ${
                    activeSection === "segreteria" ? "bg-gray-200" : ""
                  }`}
                  onClick={() => setActiveSection("segreteria")}
                >
                  La Segreteria nazionale
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-between bg-gray-100 hover:bg-gray-200 py-6 text-left text-wrap hover:font-bold ${
                    activeSection === "consiglio" ? "bg-gray-200" : ""
                  }`}
                  onClick={() => setActiveSection("consiglio")}
                >
                  Il Consiglio Nazionale
                </Button>
                <Link href="/territorio#cerca-sede" className="">
                  <Button
                    variant="ghost"
                    className="w-full my-2 justify-between bg-gray-100 hover:bg-gray-200 py-6 text-left text-wrap hover:font-bold"
                  >
                    Le Segreterie Nazionali
                  </Button>
                </Link>
                <Link href="/territorio#cerca-sede">
                  <Button
                    variant="ghost"
                    className="w-full justify-between bg-gray-100 hover:bg-gray-200 py-6 text-left text-wrap hover:font-bold"
                  >
                    I Centri Snalv
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">{renderOrganigrammaContent()}</div>
        </div>
      </main>

      <Footer />
    </>
  );
}
