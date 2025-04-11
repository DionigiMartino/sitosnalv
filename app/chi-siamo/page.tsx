// app/chi-siamo/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { useState } from "react";
import HeroSection from "@/src/components/Hero";
import {
  ArrowRightIcon,
  Building2,
  Briefcase,
  Shield,
  Users,
  ChevronRight,
  UserCog,
  UsersRound,
  Store,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChiSiamoPage() {
  const [activeSection, setActiveSection] = useState("chi-siamo");
  const router = useRouter();

  const teamMembers = [
    { name: "MARIA MAMONE", image: "/img/team/Mamone.jpg" },
    { name: "COSIMO NESCI", image: "/img/team/Nesci.jpg" },
    { name: "GIULIA PUDDU", image: "/img/team/Puddu.jpg" },
    { name: "GIUSEPPINA ADAMO", image: "/img/team/giusy.jpg" },
    { name: "BELINDA PESCOSOLIDO", image: "/img/team/Belinda.jpg" },
    { name: "DANIELE PACE", image: "/img/team/Daniele.jpg" },
    { name: "PASQUALE PELLEGRINO", image: "/img/team/Pasquale.jpg" },
  ];

  const allMembers = [
    { name: "MARIA MAMONE", image: "/img/team/Mamone.jpg" },
    { name: "COSIMO NESCI", image: "/img/team/Nesci.jpg" },
    { name: "GIULIA PUDDU", image: "/img/team/Puddu.jpg" },
    { name: "GIUSEPPINA ADAMO", image: "/img/team/giusy.jpg" },
    { name: "BELINDA PESCOSOLIDO", image: "/img/team/Belinda.jpg" },
    { name: "DANIELE PACE", image: "/img/team/Daniele.jpg" },
    { name: "PASQUALE PELLEGRINO", image: "/img/team/Pasquale.jpg" },
    { name: "ISABELLA MAMONE", image: "/img/team/mamone2.jpeg" },
    { name: "VINCENZO PALDINO", image: "" },
    { name: "VALERIA SMURRA", image: "" },
    { name: "CLAUDIO ZUCCHELLI", image: "" },
    { name: "FRANCESCO FLORIO", image: "/img/team/florio.jpeg" },
    { name: "STANISLAO AULETTA", image: "/img/team/auletta.jpeg" },
    { name: "FARA MANZI", image: "/img/team/manzi.jpeg" },
    { name: "ANTONIO LENTO", image: "/img/team/lento.jpeg" },
    { name: "PEPPINO RUBERTO", image: "/img/team/ruberto.jpeg" },
    { name: "ANTONIO SANTONOCITO", image: "/img/team/santonocito.jpeg" },
    { name: "DANIELA MAZZOLA", image: "/img/team/mazzola2.jpeg" },
    { name: "MARTINA DONINI", image: "/img/team/donini.jpeg" },
    { name: "FABIO LAROCCA", image: "/img/team/rocca.jpeg" },
    {
      name: "DANIELA MARIA SERVETTI",
      image: "",
    },
  ];

  const getMemberImage = (name) => {
    const foundMember = teamMembers.find((member) => member.name === name);
    return foundMember ? foundMember.image : null;
  };

  const leaders = [
    {
      title: "Il Segretario Generale",
      name: "Dott.ssa Maria Mamone",
      imageSrc: "/img/team/Mamone.jpg",
      alt: "Maria Mamone",
      additionalInfo: null,
    },
    {
      title: "Il Vice-Segretario Nazionale",
      name: "Cosimo Nesci",
      subtitle: "Consigliere CNEL",
      imageSrc: "/img/team/Nesci.jpg",
      alt: "Cosimo Nesci",
      additionalInfo: null,
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
              {allMembers.map((member) => (
                <div
                  key={member.name}
                  className="bg-white shadow-md rounded-lg overflow-hidden transform transition-all duration-300 hover:scale-105"
                >
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-64 object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-64 bg-[#1a365d] bg-opacity-10 flex items-center justify-center">
                      <span className="text-[#1a365d] font-bold text-center px-4">
                        {member.name}
                      </span>
                    </div>
                  )}
                  <div
                    className={`p-4 ${
                      member.image
                        ? "bg-[#1a365d] text-white"
                        : "bg-white text-[#1a365d]"
                    } text-center`}
                  >
                    <h3 className="font-bold">{member.name}</h3>
                  </div>
                </div>
              ))}
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
                  Locali&quot;, i disoccupati ed i pensionati.
                </p>
                <p className="text-justify">
                  Siamo diffusi su tutto il territorio nazionale con oltre{" "}
                  <strong>240</strong> sedi sindacali aperte al pubblico (
                  <Link href="/sedi">consulta qui l&apos;elenco</Link>
                  ).
                </p>
                <p className="text-justify">
                  Al 31/12/2024 lo Snalv Confsal ha superato il numero di{" "}
                  <strong>25.000</strong> iscritti al Sindacato, con oltre n.{" "}
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
            {/* First Sticky Section */}
            <div className="">
              <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                <nav className="space-y-2">
                  {[
                    {
                      title: "Chi siamo",
                      route: "/chi-siamo",
                      icon: Users,
                      active: true,
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
                          item.active
                            ? "rotate-90"
                            : "group-hover:translate-x-1"
                        }`}
                      />
                    </Button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Organigramma Section - Normal scroll */}
            <div className="mt-8">
              {" "}
              {/* Removed sticky positioning */}
              <h2 className="text-[#1a365d] text-xl font-bold mb-4">
                ORGANIGRAMMA
              </h2>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className={`w-full bg-gray-100 hover:bg-gray-200 py-6 text-left text-wrap hover:font-bold ${
                    activeSection === "segretario" ? "bg-gray-200" : ""
                  }`}
                  onClick={() => setActiveSection("segretario")}
                >
                  <div className="flex gap-3 items-center px-3">
                    <UserCog className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
                    <span>
                      Il Segretario Generale ed il Vice-Segretario Nazionale
                    </span>
                  </div>
                </Button>

                <Button
                  variant="ghost"
                  className={`w-full bg-gray-100 hover:bg-gray-200 py-6 text-left text-wrap hover:font-bold ${
                    activeSection === "segreteria" ? "bg-gray-200" : ""
                  }`}
                  onClick={() => setActiveSection("segreteria")}
                >
                  <div className="flex gap-3 items-start px-3">
                    <UsersRound className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
                    <span>La Segreteria nazionale</span>
                  </div>
                </Button>

                <Button
                  variant="ghost"
                  className={`w-full bg-gray-100 hover:bg-gray-200 py-6 text-left text-wrap hover:font-bold ${
                    activeSection === "consiglio" ? "bg-gray-200" : ""
                  }`}
                  onClick={() => setActiveSection("consiglio")}
                >
                  <div className="flex gap-3 items-start px-3">
                    <Users className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
                    <span>Il Consiglio Nazionale</span>
                  </div>
                </Button>

                <Link href="/segreterie-sindacali" className="block w-full">
                  <Button
                    variant="ghost"
                    className="w-full bg-gray-100 hover:bg-gray-200 py-6 text-left text-wrap hover:font-bold"
                  >
                    <div className="flex gap-3 items-start px-3">
                      <Building2 className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
                      <span>Le Segreterie Sindacali</span>
                    </div>
                  </Button>
                </Link>

                <Link href="/centri-snalv" className="block w-full">
                  <Button
                    variant="ghost"
                    className="w-full bg-gray-100 hover:bg-gray-200 py-6 text-left text-wrap hover:font-bold"
                  >
                    <div className="flex gap-3 items-start px-3">
                      <Store className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
                      <span>I Centri Snalv</span>
                    </div>
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
