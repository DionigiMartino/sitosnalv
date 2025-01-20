// app/struttura/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { useRouter } from "next/navigation";
import HeroSection from "@/src/components/Hero";

const technicalOffices = [
  {
    title: "Ufficio vertenze e conteggi",
    emails: ["info@snalv.it", "conteggi@snalv.it", "conciliazioni@snalv.it"],
    images: [
      "/img/team/Belinda.jpg",
      "/img/team/Gaia.jpg",
      "/img/team/Giorgio.jpg",
    ],
  },
  {
    title: "Relazioni industriali",
    email: "giulia.puddu@snalv.it",
    images: ["/img/team/Puddu.jpg"],
  },
  {
    title: "Relazioni istituzionali",
    email: "pasquale.pellegrino@snalv.it",
    images: ["/img/team/Pasquale.jpg"],
  },
  {
    title: "Organizzazione del territorio",
    email: "organizzazione@snalv.it",
    images: ["/img/team/Puddu.jpg", "/img/team/Pasquale.jpg"],
  },
  {
    title: "Amministrazione e contabilità sede nazionale",
    email: "deleghe@snalv.it",
    images: ["/img/team/Giusy.jpg", "/img/team/Giada.jpg"],
  },
  {
    title: "Amministrazione e contabilità sedi territoriali",
    email: "info@snalv.it",
    images: ["/img/team/Daniele.jpg"],
  },
  {
    title: "Addetto stampa nazionale",
    email: "francesca.dibiagio@gmail.com",
    images: ["/img/team/Francesca.jpg"],
  },
  {
    title: "Social & comunicazione",
    images: ["/img/aicon.png"],
    type: "icon",
  },
];

export default function StrutturaPage() {
  const router = useRouter();

  return (
    <>
      <Header />
      <HeroSection section="struttura" />

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
                  className="w-full justify-start text-left hover:font-bold uppercase text-red-500 font-bold"
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
            <div>
              <h1 className="text-[#1a365d] text-4xl font-bold mb-6">
                LA STRUTTURA NAZIONALE
              </h1>
              <p className="text-gray-700 mb-12">
                Lo Snalv Confsal garantisce a tutti gli iscritti ed ai referenti
                sindacali un supporto puntuale e competente su ogni questione
                attinenti alla tutela individuale e collettiva dei lavoratori.
              </p>

              <h2 className="text-[#1a365d] text-2xl font-bold mb-8">
                GLI UFFICI TECNICI DI SUPPORTO
              </h2>
              <p className="mb-8">
                Gli uffici tecnici di supporto, collocati presso la sede della
                Segreteria Nazionale, sono così suddivisi:
              </p>
              <div className="space-y-12">
                {technicalOffices.map((office, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 pb-8 last:border-b-0"
                  >
                    <div className="mb-4">
                      <div className="flex items-center gap-1 mb-2">
                        <Image
                          src="/icon/struttura.jpg"
                          alt=""
                          width={15}
                          height={15}
                        />
                        <h3 className="text-[#1a365d] font-semibold">
                          {office.title}
                        </h3>
                      </div>
                      {office.email && (
                        <p className="text-gray-600">{office.email}</p>
                      )}
                      {office.emails &&
                        office.emails.map((email, idx) => (
                          <p key={idx} className="text-gray-600">
                            {email}
                          </p>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {office.images.map((image, imageIndex) => (
                        <div
                          key={imageIndex}
                          className="relative aspect-square"
                        >
                          <Image
                            src={image}
                            alt={`${office.title} - Immagine ${imageIndex + 1}`}
                            fill
                            className={` rounded-lg ${
                              office?.type === "icon"
                                ? "object-contain"
                                : "object-cover"
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
