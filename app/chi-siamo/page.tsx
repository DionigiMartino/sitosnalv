// app/chi-siamo/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { useState } from "react";
import HeroSection from "@/src/components/Hero";
import { ArrowRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChiSiamoPage() {
  const [activeSection, setActiveSection] = useState("chi-siamo");
  const router = useRouter();

  const teamMembers = [
    { name: "MARIA MAMONE", image: "/img/team/mamone.jpg" },
    { name: "COSIMO NESCI", image: "/img/team/nesci.jpg" },
    { name: "GIULIA PUDDU", image: "/img/team/puddu.jpg" },
    { name: "GIUSEPPINA ADAMO", image: "/img/team/giusy.jpg" },
    { name: "BELINDA PESCOSOLIDO", image: "/img/team/belinda.jpg" },
    { name: "DANIELE PACE", image: "/img/team/daniele.jpg" },
    { name: "PASQUALE PELLEGRINO", image: "/img/team/pasquale.jpg" },
  ];

  const allMembers = [
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
  ];

  const getMemberImage = (name) => {
    const foundMember = teamMembers.find((member) => member.name === name);
    return foundMember ? foundMember.image : null;
  };

  const leaders = [
    {
      title: "Il Segretario Generale",
      name: "Dott.ssa Maria Mamone",
      imageSrc: "/img/team/mamone.jpg",
      alt: "Maria Mamone",
      additionalInfo: null,
    },
    {
      title: "Il Vice-Segretario Nazionale",
      name: "Cosimo Nesci",
      subtitle: "Consigliere CNEL",
      imageSrc: "/img/team/nesci.jpg",
      alt: "Cosimo Nesci",
      additionalInfo:
        "Consigliere presso il Consiglio Nazionale dell'Economia e del Lavoro",
    },
  ];

  const renderOrganigrammaContent = () => {
    switch (activeSection) {
      case "segretario":
        return (
          <div className="space-y-12 max-w-6xl mx-auto px-4">
            {leaders.map((leader, index) => (
              <section
                key={leader.name}
                className="bg-white shadow-lg rounded-xl overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {/* Image Column */}
                  <div
                    className={`
              relative group overflow-hidden
              ${index % 2 === 1 ? "md:order-last" : ""}
            `}
                  >
                    <img
                      src={leader.imageSrc}
                      alt={leader.alt}
                      className="w-full h-96 object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[#1a365d] opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>

                  {/* Text Column */}
                  <div className="p-8 space-y-6">
                    <h2 className="text-[#1a365d] text-3xl font-bold md:text-4xl">
                      {leader.title}
                    </h2>
                    <div className="space-y-4">
                      <h3 className="text-[#1a365d] text-2xl font-semibold">
                        {leader.name}
                      </h3>
                      {leader.subtitle && (
                        <h4 className="text-xl text-gray-700">
                          {leader.subtitle}
                        </h4>
                      )}
                    </div>

                    {leader.additionalInfo && (
                      <div className="bg-[#1a365d] bg-opacity-10 p-4 rounded-lg border-l-4 border-[#1a365d]">
                        <p className="text-[#1a365d] text-base italic">
                          <ArrowRightIcon
                            className="inline-block mr-2 text-[#1a365d]"
                            size={20}
                          />
                          {leader.additionalInfo}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            ))}
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <div
                  key={member.name}
                  className="bg-white shadow-md rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover object-top"
                  />
                  <div className="p-4 bg-[#1a365d] text-white text-center">
                    <h3 className="font-bold">{member.name}</h3>
                  </div>
                </div>
              ))}
            </div>
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {allMembers.map((name) => {
                const imageSrc = getMemberImage(name);
                return (
                  <div
                    key={name}
                    className="bg-white shadow-md rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105"
                  >
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={name}
                        className="w-full h-64 object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-64 bg-[#1a365d] bg-opacity-10 flex items-center justify-center">
                        <span className="text-[#1a365d] font-bold text-center px-4">
                          {name}
                        </span>
                      </div>
                    )}
                    <div
                      className={`p-4 ${
                        imageSrc
                          ? "bg-[#1a365d] text-white"
                          : "bg-white text-[#1a365d]"
                      } text-center`}
                    >
                      <h3 className="font-bold">{name}</h3>
                    </div>
                  </div>
                );
              })}
            </div>
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
                  Locali&quot;, disoccupati ed i pensionati.
                </p>
                <p className="text-justify">
                  Siamo diffusi su tutto il territorio nazionale con oltre{" "}
                  <strong>240</strong> sedi sindacali aperte al pubblico (
                  <Link href="/sedi">consulta qui l&apos;elenco</Link>
                  ).
                </p>
                <p className="text-justify">
                  Al 31/12/2024 lo Snalv Confsal ha superato il numero di{" "}
                  <strong>21.000</strong> iscritti al Sindacato, con oltre n.{" "}
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
                <Link href="/segreterie-sindacali" className="">
                  <Button
                    variant="ghost"
                    className="w-full my-2 justify-between bg-gray-100 hover:bg-gray-200 py-6 text-left text-wrap hover:font-bold"
                  >
                    Le Segreterie Sindacali
                  </Button>
                </Link>
                <Link href="/centri-snalv">
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
