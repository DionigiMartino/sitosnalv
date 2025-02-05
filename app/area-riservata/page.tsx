"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Video, BookOpen, ArrowRight } from "lucide-react";
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
            Scegli il percorso formativo più adatto alle tue esigenze
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
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
                      Partecipa ai nostri webinar live interattivi. Apprendi da
                      esperti del settore e interagisci in tempo reale con
                      domande e discussioni.
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
                      Accedi ai nostri corsi strutturati. Materiale didattico
                      completo, esercitazioni pratiche e certificazioni
                      riconosciute.
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FormazionePage;
