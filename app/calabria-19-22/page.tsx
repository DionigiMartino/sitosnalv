"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { useRouter } from "next/navigation";

export default function MissioneMediterraneoPage() {
  const router = useRouter();

  return (
    <>
      <Header />

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
                MISSIONE MEDITERRANEO
              </h1>

              {/* Prima Tappa Section */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-[#1a365d] mb-4">
                  PRIMA TAPPA: CALABRIA
                </h2>
                <p className="text-gray-700 mb-6">
                  Il 19 Dicembre 2022 si è tenuta a Lamezia Terme la prima tappa
                  dell&apos;iniziativa &quot;Missione Mediterraneo&quot;, con un
                  focus specifico sulla Regione Calabria.
                </p>
                <p className="text-gray-700 mb-8">
                  Tra gli autorevoli relatori che hanno preso parte
                  all&apos;evento sono intervenuti: Raffaele Fitto (Ministro per
                  gli Affari Europei, il Sud, le Politiche di Coesione e il
                  PNRR), Roberto Occhiuto (Presidente Regione Calabria) e
                  rappresentanti istituzionali di tutti i livelli governativi
                  (Parlamento Europeo, Governo centrale, Giunta regionale, Enti
                  locali).
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
                    src="https://www.youtube.com/embed/b76i7CvwCos"
                    title="Relazione introduttiva"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>
              </div>

              {/* Documento Section */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#1a365d]">
                  IL DOCUMENTO PROGRAMMATICO DEL DIPARTIMENTO
                </h2>
                <div className="bg-[#1a365d] p-6 rounded-lg text-white h-fit">
                  <h3 className="text-xl font-bold mb-4">
                    &quot;VISIONE E PROGRAMMAZIONE ALL&apos;ESAME DEL PNRR E
                    DELLE POLITICHE DI COESIONE: IL DOSSIER CALABRIA&quot;
                  </h3>
                  <iframe
                    src="/docs/calabria-19-22.pdf"
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
                <Link href="https://www.youtube.com/watch?v=k5qFN0fI-IA&list=PLcWF68ueMJ3UbNfW5l3cMIaxHIMj3bKHw">
                  <Image
                    src="/img/calabria-19-22.jpg"
                    alt="Programma degli interventi"
                    width={600}
                    height={800}
                    className="mx-auto rounded-lg"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
