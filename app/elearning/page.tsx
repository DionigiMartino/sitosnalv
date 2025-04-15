"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Video,
  BookOpen,
  ArrowRight,
  GraduationCap,
  Calendar,
} from "lucide-react";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import Link from "next/link";

const FormazionePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            Area Formazione
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mt-2">
            Benvenuto nella piattaforma e-learning dello SNALV Confsal
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Prima riga */}
          {/* Card Webinar */}
          <Link href="/webinar" className="block">
            <Card className="group cursor-pointer overflow-hidden bg-white hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                    <Video className="w-10 h-10 text-blue-600" />
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold text-blue-900 mb-4">
                      Webinar
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Partecipa ai nostri webinar interattivi o scaricare le
                      guide formative redatte dall'ufficio legislativo Snalv
                      Confsal.
                    </p>
                  </div>

                  <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    Scopri i webinar
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Card Corsi */}
          <Link href="/corsi" className="block">
            <Card className="group cursor-pointer overflow-hidden bg-white hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-red-600" />
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold text-red-900 mb-4">
                      Corsi
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Accedi ai nostri corsi strutturati: video lezioni,
                      materiale didattico completo e certificazioni
                      automatizzate.
                    </p>
                  </div>

                  <div className="flex items-center text-red-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    Esplora i corsi
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Seconda riga */}
          {/* Card Eventi - NUOVA */}
          <Link href="/eventi" className="block">
            <Card className="group cursor-pointer overflow-hidden bg-white hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                    <Calendar className="w-10 h-10 text-green-600" />
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold text-green-900 mb-4">
                      Eventi
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Rivivi i nostri eventi passati attraverso video,
                      presentazioni e materiali informativi. Accedi a tutti i
                      contenuti esclusivi.
                    </p>
                  </div>

                  <div className="flex items-center text-green-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    Visualizza gli eventi
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Card Formazione Scuola - Modificata per occupare una sola colonna */}
          <Link
            href="https://snalv.confsalformazione.com/"
            target="_blank"
            className="block"
          >
            <Card className="group cursor-pointer overflow-hidden bg-white hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center">
                    <GraduationCap className="w-10 h-10 text-purple-600" />
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold text-purple-900 mb-4">
                      Formazione Scuola
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Corsi riservati a docenti, personale ATA e responsabili
                      SNALV del comparto Scuola, in collaborazione con SNALS
                      Confsal.
                    </p>
                  </div>

                  <div className="flex items-center text-purple-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    Accedi alla piattaforma
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FormazionePage;
