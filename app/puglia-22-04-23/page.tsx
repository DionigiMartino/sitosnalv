"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { useRouter } from "next/navigation";
import {
  Building2,
  Briefcase,
  Shield,
  Users,
  ChevronRight,
} from "lucide-react";

export default function Puglia() {
  const router = useRouter();

  return (
    <>
      <Header />

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
                MISSIONE MEDITERRANEO
              </h1>

              {/* Prima Tappa Section */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-[#1a365d] mb-4">
                  SECONDA TAPPA: PUGLIA
                </h2>
                <p className="text-gray-700 mb-6">
                  Il 22 aprile 2023 si è tenuta a Gravina in Puglia la seconda
                  tappa di &quot;Missione Mediterraneo&quot;, l&apos;iniziativa
                  del Dipartimento Sud della Confsal.
                </p>
                <p className="text-gray-700 mb-8">
                  Le proposte presentate dal Dipartimento hanno ricevuto il
                  plauso dei rappresentanti istituzionali coinvolti a vario
                  titolo nell&apos;attuazione del PNRR: Regione Puglia (nella
                  persona del Presidente Emiliano), ANCI Puglia (rappresentata
                  da Piero Bitetti), Commissione REGI del Parlamento Europeo
                  (on. Denis Nesci) e Deputati e Senatori pugliesi intervenuti
                  nel dibattito.
                </p>
              </div>

              {/* Video Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#1a365d]">
                  LA RELAZIONE INTRODUTTIVA DELLA COORDINATRICE NAZIONALE,
                  DOTT.SSA MARIA MAMONE
                </h2>
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/emteykV-VCQ"
                    title="Relazione introduttiva"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#1a365d]">
                  IL DOCUMENTO PROGRAMMATICO DEL DIPARTIMENTO
                </h2>
                <div className="bg-[#1a365d] p-6 rounded-lg text-white h-fit">
                  <h3 className="text-xl font-bold mb-4">
                    &quot;VISIONE E PROGRAMMAZIONE ALL&apos;ESAME DEL PNRR E
                    DELLE POLITICHE DI COESIONE: IL DOSSIER PUGLIA&quot;
                  </h3>
                  <iframe
                    src="/docs/dossier_puglia.pdf"
                    title="Relazione introduttiva"
                    allowFullScreen
                    className="rounded-lg w-full h-[100vh]"
                  ></iframe>
                </div>
              </div>

              {/* Visualizza Interventi Section */}
              <div className="space-y-4 mt-6">
                <h2 className="text-2xl font-bold text-[#1a365d] text-center">
                  VISUALIZZA TUTTI GLI INTERVENTI (Clicca sull&apos;immagine)
                </h2>
                <Link href="https://www.youtube.com/playlist?list=PLcWF68ueMJ3WIcSuHjijeGKvFqXEkQXzZ">
                  <Image
                    src="/img/puglia.png"
                    alt="Programma degli interventi"
                    width={600}
                    height={800}
                    className="mx-auto rounded-lg"
                  />
                </Link>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#1a365d]">
                  RASSEGNA STAMPA
                </h2>
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/MHcRXNX8uBI"
                    title="Relazione introduttiva"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/MJYzHWdQBhE"
                    title="Relazione introduttiva"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/mBKi6SgJ6qA"
                    title="Relazione introduttiva"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/GX57THWsezg"
                    title="Relazione introduttiva"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#1a365d]">
                  VISUALIZZA LA RASSEGNA STAMPA INTEGRALE DELL&APOS;EVENTO
                </h2>
                <div className="bg-[#1a365d] p-6 rounded-lg text-white h-fit">
                  <iframe
                    src="/docs/rassegna_stampa_puglia.pdf"
                    title="Relazione introduttiva"
                    allowFullScreen
                    className="rounded-lg w-full h-[100vh]"
                  ></iframe>
                </div>
              </div>

              {/* Documento Section */}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
