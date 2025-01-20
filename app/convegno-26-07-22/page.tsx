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
                IL 26 LUGLIO SI E&apos; TENUTO A ROMA L&apos;EVENTO DI
                PRESENTAZIONE DEL NUOVO COMPARTO SINDACALE DEDICATO AI
                LAVORATORI FRAGILI
              </h1>

              {/* Prima Tappa Section */}

              {/* Visualizza Interventi Section */}
              <div className="space-y-4 mt-6">
                <h2 className="text-2xl font-bold text-[#1a365d] text-center">
                  VISUALIZZA TUTTI GLI INTERVENTI (Clicca sull&apos;immagine)
                </h2>
                <Link href="https://www.youtube.com/watch?v=gdqsHV5stBQ&list=PLcWF68ueMJ3Xy9_9UIJCaUnJX5-IgRhXh">
                  <Image
                    src="/img/convegno.png"
                    alt="Programma degli interventi"
                    width={1000}
                    height={800}
                    className="mx-auto rounded-lg"
                  />
                </Link>
              </div>

              <h2 className="text-blue-600 my-2 font-bold">
                COMUNICATO STAMPA DI CHIUSURA
              </h2>

              <p className="text-gray-600 mb-2">
                Roma, 26 lug. (askanews) – &quot;Bisogna ripartire rivalutando
                il tema della disabilità. Creare una rete dinamica e
                collaborativa per valorizzare i lavoratori fragili nel contesto
                lavorativo e familiare&quot;. Lo dice Franco Bettoni, presidente
                Inail in apertura del convegno dedicato alla fragilità nei
                luoghi di lavoro, organizzato dal sindacato Snalv Confsal,
                evento al quale hanno partecipato rappresentanti di istituzioni,
                lavoratori e realtà associative del terzo settore. Includere,
                conciliare e tutelare i &quot;lavoratori fragili&quot; sono
                questioni irrisolte spesso a causa di una normativa fumosa, che
                gravano sulla serenità di soggetti affetti da patologie gravi,
                croniche o invalidanti. Una sfida importante per Pasquale
                Pellegrino. &quot;Oggi vogliamo muovere il primo passo verso una
                proposta organica di riforma – dice Pasquale Pellegrino
                coordinatore nazionale del comparto &quot;Lavoratori
                Fragili&quot; – Snalv Confsal – includere, conciliare e tutelare
                i lavoratori fragili e la loro dignità&quot;. &quot;Includere,
                per favorire l’inserimento lavorativo dei soggetti fragili,
                conciliare, per consentire l’equilibrio tra vita, salute, lavoro
                e infine tutelare il lavoratore con forme adeguate di
                pre-pensionamento&quot;.
              </p>

              <p className="text-gray-600 mb-2">
                Per Palma Marino Aimone, Diversity e Disability Manager SIDIMA
                (Società Italiana Disability Manager), centrale il ruolo del
                Disability management, chiave di volta per la promozione della
                cultura inclusiva. Per Marino Aimone &quot;i lavoratori fragili
                necessitano con urgenza di adeguamenti tecnici ed organizzativi.
                Bisogna sensibilizzare la cultura del tema partendo dai vertici
                aziendali&quot;. &quot;Il tema &quot;fragilità&quot; è una
                battaglia culturale e non politica. Incarnare valori originali
                del sindacato. Dal greco &quot;Syn Dike&quot; fare giustizia
                insieme&quot; – afferma nel suo intervento Maria Mamone, segr.
                naz. Snalv Confsal -. Per questo Snalv Confsal ha costituito un
                comparto sindacale &quot;ad hoc&quot;, dedicato a questa
                categoria di lavoratori, con lo scopo di creare un punto di
                riferimento, semplificare la farraginosa normativa in materia e
                implementarne la sua operatività&quot;.
              </p>

              <p className="text-gray-600 mb-2">
                E’ intervenuto Maurizio Coggiola – Vice Presidente Vicario SIML
                (Società italiana di medicina del lavoro). Per le istituzioni
                l’on. Ylenia Lucaselli membro della 5 ª Commissione (Bilancio)
                della Camera ha portato la propria esperienza di
                &quot;lavoratore fragile&quot;; e poi l’on. Luigi Augussori
                Membro della 1ª Commissione (Affari Costituzionali) del Senato e
                l’ on. Antonio Tasso Membro della 9 ª Commissione (Trasporti)
                della Camera. Confsal, prima Confederazione in Italia di
                sindacati autonomi – lotta da sempre al fianco dei
                &quot;lavoratori fragili&quot; al fine di conseguire tutele
                adeguate. Problematiche che la pandemia da Covid-19 ha
                evidenziato ed esasperato ulteriormente. &quot;Sono orgoglioso
                dell’operato dello Snalv: esempio per gli altri sindacati in
                quanto attenzione al prossimo e concretezza negli
                interventi&quot;, ha concluso il segretario generale CONFSAL
                Angelo Raffaele Margiotta.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
