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
    title: "Relazioni istituzionali",
    email: "pasquale.pellegrino@snalv.it",
    image: "/img/profilepic.jpg",
  },
  {
    title: "Relazioni industriali",
    email: "giulia.puddu@snalv.it",
    image: "/img/profilepic.jpg",
  },
  {
    title: "Ufficio vertenze e conteggi",
    emails: ["info@snalv.it", "conteggi@snalv.it", "conciliazioni@snalv.it"],
    image: "/img/profilepic.jpg",
  },
  {
    title: "Organizzazione del territorio",
    email: "organizzazione@snalv.it",
    image: "/img/profilepic.jpg",
  },
  {
    title: "Amministrazione sedi",
    email: "deleghe@snalv.it",
    image: "/img/profilepic.jpg",
  },
  {
    title: "Amministrazione e contabilità",
    email: "info@snalv.it",
    image: "/img/profilepic.jpg",
  },
  {
    title: "Addetto stampa nazionale",
    email: "francesca.dibiagio@snalv.it",
    image: "/img/profilepic.jpg",
  },
  {
    title: "Ufficio comunicazione",
    image: "/img/profilepic.jpg",
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
              <div className="space-y-8">
                {technicalOffices.map((office, index) => (
                  <div key={index} className="flex gap-6 items-start">
                    <div className="w-28 h-28 md:w-32 md:h-32 relative flex-shrink-0">
                      <Image
                        src={office.image}
                        alt={office.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
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
