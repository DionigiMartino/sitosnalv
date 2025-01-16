// app/tutele/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import Link from "next/link";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { useState } from "react";
import CategoryNews from "@/src/components/CategoryNews";
import HeroSection from "@/src/components/Hero";
import { useRouter } from "next/navigation";

export default function TutelePage() {
  const [showConteggiForm, setShowConteggiForm] = useState(false);
  const router = useRouter();

  const servicesAccordionItems = [
    {
      value: "tutela-sindacale",
      title:
        "TUTELA SINDACALE DEI LAVORATORI, DEI DISOCCUPATI E DEI PENSIONATI",
      content: (
        <div className="space-y-6">
          <div className="border-2 p-2 rounded-md border-blue-600">
            <h4 className="font-bold mb-2">
              • Consulenza ed eventuale avvio vertenza per:
            </h4>
            <p>
              controllo buste paga, regolarità contratto di assunzione;
              applicazione CCNL; livello di inquadramento; livello di
              retribuzione; turni lavorativi; lavoro nero o irregolare;
              cambiamento di mansioni; trasferimenti, trasferte e indennità di
              viaggio; recupero crediti retributivi; licenziamenti o
              provvedimenti disciplinari; erogazione del T.F.R.; gestione delle
              assenze, permessi, malattia; maternità e paternità; gestione
              congedi ordinari e straordinari; aspettative; tutela della
              fragilità e delle patologie gravi; ecc.
            </p>
          </div>

          <div className="border-2 p-2 rounded-md border-blue-600">
            <h4 className="font-bold mb-2">
              • Conteggi differenze retributive
            </h4>
            <Link
              href="/modulo-conteggi"
              className="text-red-500 hover:text-red-600 py-2"
            >
              → clicca qui per richiedere un preventivo!
            </Link>
            <p>
              Il servizio consente il calcolo analitico delle differenze
              retributive maturate dai lavoratori, con riferimento a qualsiasi
              elemento retributivo previsto dal Contratto Collettivo applicato.
              L&apos;Ufficio Vertenze elabora Documento tecnico avente valore
              probatorio anche in sede giudiziale.
            </p>
          </div>

          <div className="border-2 p-2 rounded-md border-blue-600">
            <h4 className="font-bold mb-2">• Dimissioni telematiche:</h4>
            <p>
              Assistenza e supporto in fase di recesso dal proprio rapporto di
              lavoro, mediante l&apos;invio delle dimissioni in modalità
              telematica. I nostri esperti sono in grado di individuare i
              termini di preavviso, la tipologia più consona di recesso del
              contratto (tra dimissioni volontarie, per giusta causa o con
              risoluzione consensuale) con relative procedure ed adempimenti.
            </p>
          </div>

          <div className="border-2 p-2 rounded-md border-blue-600">
            <h4 className="font-bold mb-2">• Conciliazioni sindacali:</h4>
            <p>
              L&apos;Ufficio Vertenze fornisce ad iscritti e Conciliatori
              Sindacali il massimo supporto in fase di redazione e stipula degli
              accordi transattivi in sede protetta, al fine di garantire
              un&apos;assistenza piena ed effettiva ai lavoratori.
            </p>
          </div>

          <div className="border-2 p-2 rounded-md border-blue-600">
            <h4 className="font-bold mb-2">
              • Tutela collettiva dei lavoratori:
            </h4>
            <p>
              Lo Snalv Confsal è sempre al fianco delle proprie Rappresentanze
              Sindacali Aziendali per ogni procedura a carattere collettivo,
              nonché per la redazione e la stipula di accordi aziendali o di
              secondo livello in qualsiasi materia (introduzione premi di
              risultato o welfare aziendale, riduzione o sospensione
              dell&apos;attività lavorativa con conseguente ricorso ad
              ammortizzatori sociali, crisi aziendali, trasferimento
              d&apos;azienda o ramo d&apos;azienda; cessione dei contratti di
              lavoro; cambio di appalto, procedure di licenziamento collettivo;
              ecc.).
            </p>
          </div>

          <div className="border-2 p-2 rounded-md border-blue-600">
            <h4 className="font-bold mb-2">• Assistenza legale:</h4>
            <p>
              Qualora fallisca ogni tentativo stragiudiziale, lo Snalv Confsal
              garantisce ai lavoratori che ne fanno richiesta un&apos;assistenza
              legale agevolata, grazie a qualificati Avvocati in convenzione,
              che garantiscono agli iscritti una prima consulenza gratuita ed un
              eventuale successivo compenso basato sui minimi tabellari.
            </p>
          </div>

          <div className="border-2 p-2 rounded-md border-blue-600">
            <h4 className="font-bold mb-2">
              • Tutela dei disoccupati ed invio domande di prestazioni di
              sostegno al reddito:
            </h4>
            <p>
              i lavoratori in disoccupazione o in cassa integrazione possono
              contare sull&apos;aiuto di esperti in tema di ammortizzatori
              sociali. Oltre all&apos;invio delle domande di disoccupazione
              (NASPI e DIS-COLL), il Sindacato garantisce assistenza operativa
              anche per accedere alle prestazioni di sostegno al reddito in caso
              di sospensione momentanea della propria attività lavorativa (CIGO,
              CIGS, FIS, ecc.).
            </p>
          </div>

          <div className="border-2 p-2 rounded-md border-blue-600">
            <h4 className="font-bold mb-2">• Tutela dei pensionati:</h4>
            <p>
              Grazie alla collaborazione con UNIPE – Unione Pensionati, lo Snalv
              può garantire un&apos;assistenza a 360 gradi di tutti i
              pensionati, sia del settore pubblico che del settore privato.
            </p>
          </div>
        </div>
      ),
    },
    {
      value: "tutela-previdenziale",
      title: "TUTELA PREVIDENZIALE",
      content: (
        <div className="space-y-6">
          <p>
            Grazie alla convenzione col Patronato EPAS, lo Snalv Confsal
            garantisce gratuitamente ai propri iscritti tutti i servizi
            assistenziali e previdenziali di cui hanno bisogno, come ad esempio:
          </p>

          <div className="space-y-4">
            <div className="border-2 p-2 rounded-md border-blue-600">
              <h4 className="font-bold mb-2">
                • PRESTAZIONI DI SOSTEGNO AL REDDITO
              </h4>
              <p>
                NASPI/DIS-COLL, INDENNITA&apos; DI DISCONTINUITA&apos; rivolta
                ai lavoratori dello spettacolo, ISCRO - Indennità Straordinaria
                di Continuità Reddituale e Operativa
              </p>
            </div>

            <div className="border-2 p-2 rounded-md border-blue-600">
              <h4 className="font-bold mb-2">• PENSIONE E PREVIDENZA</h4>
              <p>
                Inoltro domanda di pensione di Vecchiaia, Pensione Anticipata,
                Ape sociale, Opzione donna e quota 103. Ricostituzione e
                ricongiunzione dei contributi, accreditamento contributi
                figurativi. Richiesta estratto contributivo ed estratto
                contributivo certificato
              </p>
            </div>

            <div className="border-2 p-2 rounded-md border-blue-600">
              <h4 className="font-bold mb-2">• INVALIDITÀ E DISABILITÀ</h4>
              <p>
                Richiesta di assegno ordinario di invalidità, invio domanda
                pensione di inabilità, invio domanda di invalidità civile e
                accertamento sanitario, indennità di frequenza, indennità di
                accompagno, richiesta permessi 104, congedo straordinario
              </p>
            </div>

            <div className="border-2 p-2 rounded-md border-blue-600">
              <h4 className="font-bold mb-2">• MATERNITÀ/PATERNITÀ</h4>
              <p>
                Inoltro richiesta di indennità di maternità e paternità
                obbligatoria, anticipata e flessibile. Inoltro domanda di
                indennità di congedo parentale. Richiesta bonus asilo nido,
                bonus mamme premio alla nascita, contributi per genitori
                disoccupati o monoreddito con figli disabili. Assegno unico.
                Permessi allattamento. Assegno per congedo matrimoniale
              </p>
            </div>

            <div className="border-2 p-2 rounded-md border-blue-600">
              <h4 className="font-bold">• Altri servizi:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  ASSEGNO DI INCLUSIONE (Inoltro domanda di assegno di
                  inclusione)
                </li>
                <li>
                  ASSEGNO INTEGRATIVO (Richiesta assegno integrativo per
                  lavoratore in mobilità)
                </li>
                <li>
                  RICORSI E RIESAMI (Assistenza per ricorsi e riesami online)
                </li>
                <li>
                  BONUS UNA TANTUM (Bonus psicologo, bonus mamme, bonus asilo
                  nido, ecc.)
                </li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      value: "tutela-fiscale",
      title: "TUTELA FISCALE",
      content: (
        <div className="space-y-6">
          <p>
            Grazie alla convenzione col CAF ITALIA, lo Snalv Confsal garantisce
            gratuitamente ai propri iscritti tutti i servizi fiscali di cui
            hanno bisogno, come ad esempio:
          </p>

          <ul className="list-disc pl-5 space-y-2 rounded-md border-2 border-blue-600 p-2">
            <li>
              <span className="font-bold">ISEE</span> (Indicatore della
              situazione economica equivalente, necessario per alcune tipologie
              di prestazioni assistenziali, universitarie, sociosanitarie)
            </li>
            <li>
              <span className="font-bold">730/ REDDITI PF/ 730 congiunto</span>{" "}
              (Dichiarazione dei redditi)
            </li>
            <li>
              <span className="font-bold">RED</span>
            </li>
            <li>
              <span className="font-bold">IMU E TASI</span>
            </li>
            <li>
              <span className="font-bold">SUCCESSIONI</span>
            </li>
            <li>
              <span className="font-bold">LOCAZIONI</span> (Invio registrazione
              contratti. Supporto per stesura contratti di locazione e comodato
              d&apos;uso mediante il Sindacato Europeo Inquilini e Assegnatari –
              SEIASS)
            </li>
            <li>
              <span className="font-bold">VISURE CATASTALI</span>
            </li>
            <li>
              <span className="font-bold">VISURE CAMERALI</span>
            </li>
            <li>
              <span className="font-bold">EAS</span>
            </li>
            <li>
              <span className="font-bold">ICRIC- ICLAV-ACCAS/PS</span>
            </li>
          </ul>
        </div>
      ),
    },
    {
      value: "orientamento",
      title: "ORIENTAMENTO LAVORATIVO",
      content: (
        <div className="space-y-6">
          <p>
            Grazie alla collaborazione con l&apos;Ente di formazione INFAP e con
            le Agenzie di lavoro in convenzione, l&apos;iscritto Snalv può
            contare su un aiuto professionale per orientarsi meglio nel mondo
            del lavoro. Nello specifico, ti supportiamo:
          </p>

          <ul className="list-disc pl-5 space-y-2 rounded-md border-2 border-blue-600 p-2">
            <li>
              nella ricerca di un lavoro o di un percorso formativo, accedendo
              ad iniziative a carattere nazionale, regionale e anche europeo;
            </li>
            <li>nel reperire tutte le informazioni sui progetti finanziati;</li>
            <li>
              nel definire meglio le tue competenze, il tuo profilo lavorativo
              ed il background professionale;
            </li>
            <li>
              nell&apos;affrontare l&apos;uscita da un&apos;azienda, sia essa
              causata da un licenziamento o da una risoluzione consensuale, con
              l&apos;obiettivo di ricollocarti il prima possibile!
            </li>
          </ul>
        </div>
      ),
    },
    {
      value: "altri-servizi",
      title: "ALTRI SERVIZI IN CONVENZIONE",
      content: (
        <div className="space-y-6">
          <div className="border-2 p-2 rounded-md border-blue-600">
            <h4 className="font-bold mb-2">
              • Assistenza e tutela dei consumatori
            </h4>
            <p>
              L&apos;U.Di.Con. - Unione per la Difesa dei Consumatori - tutela a
              360 gradi i diritti dei cittadini, quali consumatori e utenti,
              offrendo un&apos;assistenza completa in molteplici settori: dalla
              sfera giuridica a quella economica, dalla sfera sanitaria a quella
              previdenziale e fiscale. Consulta il sito www.udicon.org
            </p>
          </div>

          <div className="border-2 p-2 rounded-md border-blue-600">
            <h4 className="font-bold mb-2">
              • Assistenza e tutela degli inquilini
            </h4>
            <p>
              SEIASS – Sindacato Europeo Inquilini e Assegnatari lavora
              incessantemente per garantire che gli inquilini abbiano accesso a
              alloggi sicuri, dignitosi e a prezzi equi, fornendo una consulenza
              completa per tutte le tipologie di locazioni, nonché erogando
              servizi per gli utenti dell&apos;edilizia pubblica. Consulta il
              sito www.seiass.it
            </p>
          </div>
        </div>
      ),
    },
    {
      value: "agevolazioni",
      title: "AGEVOLAZIONI, SCONTI ED OFFERTE ESCLUSIVE PER GLI ISCRITTI",
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-bold mb-2">
              • Assicurazione gratuita per i dipendenti delle strutture
              socio-sanitarie-assistenziali-educative
            </h4>
            <p>
              I lavoratori del comparto iscritti al Sindacato hanno diritto ad
              una polizza per colpa grave totalmente gratuita. L&apos;estratto
              della polizza e le garanzie ivi contenute sono consultabili sul
              sito dedicato:
              https://www.gbsapri.it/convenzioni/colpa-grave-snalv-confsal/.
              Tramite il medesimo link, i lavoratori che ne hanno diritto
              possono richiedere un certificato della propria polizza.
            </p>
          </div>

          <ul className="list-disc pl-5 space-y-2 rounded-md border-2 border-blue-600 p-2">
            <li>
              <span className="font-bold">Università PEGASO</span> (sconti sulle
              iscrizioni universitarie)
            </li>
            <li>
              <span className="font-bold">IBL Banca</span> (Condizioni agevolate
              per apertura conto corrente, richieste di prestiti, finanziamenti
              e cessioni del quinto)
            </li>
            <li>
              <span className="font-bold">AGOS</span> (Prestiti a condizioni
              vantaggiose)
            </li>
            <li>
              <span className="font-bold">USI CARD</span> (Gli iscritti allo
              Snalv Confsal di Roma e Provincia possono richiedere il rilascio
              gratuito dell&apos;USI Card! Per maggiori informazioni contatta il
              nostro ufficio di riferimento: 351.63.46219 -
              ilcentrocittadino@gmail.com)
            </li>
            <li>
              <span className="font-bold">CONVENZIONI CON PARTNER LOCALI</span>{" "}
              (Consulta la tua sede di riferimento sul territorio, per
              verificare ulteriori sconti ed agevolazioni a cui puoi accedere in
              qualità di &quot;Iscritto SNALV&quot; !)
            </li>
          </ul>
        </div>
      ),
    },
    // ... altri accordion items ...
  ];

  return (
    <>
      <Header />
      <HeroSection section="tutele" />

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
                  className="w-full justify-start text-left hover:font-bold uppercase text-red-500 font-bold"
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
            <div>
              <h1 className="text-[#1a365d] text-4xl font-bold mb-6 md:text-5xl">
                TUTELE E SERVIZI
              </h1>
              <p className="mb-8">
                Gli iscritti al Sindacato godono di un&apos;assistenza a 360°
                sulla propria vita lavorativa, anche in materia fiscale e
                previdenziale. Inoltre, possono beneficiare di numerose offerte
                e agevolazioni grazie ai partner in convenzione.
              </p>

              <div>
                <Accordion type="single" collapsible className="mb-12">
                  {servicesAccordionItems.map((item) => (
                    <AccordionItem value={item.value} key={item.value}>
                      <AccordionTrigger className="text-[#1a365d] hover:text-[#1a365d]">
                        {item.title}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-700">
                        {item.content}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                <div className="mt-12">
                  <h2 className="text-[#1a365d] text-2xl font-bold">
                    SERVIZI, CONVENZIONI ED AGEVOLAZIONI
                  </h2>
                  <CategoryNews categories={["Servizi"]} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
