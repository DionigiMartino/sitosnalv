// app/struttura/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { useRouter } from "next/navigation";
import HeroSection from "@/src/components/Hero";
import {
  Building2,
  Briefcase,
  Shield,
  Users,
  ChevronRight,
} from "lucide-react";

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
    email: "info@snalv.it",
    images: ["/img/team/Daniele.jpg"],
  },
  {
    title: "Amministrazione e contabilità sedi territoriali",
    email: "deleghe@snalv.it",
    images: ["/img/team/giusy.jpg", "/img/team/Giada.jpg"],
  },
  {
    title: "Addetto stampa nazionale",
    email: "francesca.dibiagio@gmail.com",
    images: ["/img/team/Francesca.jpg"],
  },
  {
    title: "Social & comunicazione",
    images: ["/img/aicon.png"],
    email: "info@aicon.it",
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
                    active: true,
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
            <div>
              <h1 className="text-[#1a365d] text-4xl font-bold mb-6">
                LA STRUTTURA NAZIONALE
              </h1>
              <p className="text-gray-700 mb-12">
                Lo Snalv Confsal garantisce a tutti gli iscritti ed ai referenti
                sindacali un supporto puntuale e competente su ogni questione
                attinente alla tutela individuale e collettiva dei lavoratori.
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
