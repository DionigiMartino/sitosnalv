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
import CategoryNews from "@/src/components/CategoryNews";
import HeroSection from "@/src/components/Hero";
import { useRouter } from "next/navigation";
import {
  Shield,
  Heart,
  Briefcase,
  HandHeart,
  CircleDollarSign,
  Compass,
  Gift,
  BadgePercent,
  ChevronRight,
  BarChart,
  FileText,
  Users,
  Building2,
  ScrollText,
  Scale,
  GraduationCap,
  MapPin,
  Newspaper,
} from "lucide-react";
import { useState } from "react";

export default function TutelePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("tutela-sindacale");

  const servicesAccordionItems = [
    {
      value: "tutela-sindacale",
      title:
        "TUTELA SINDACALE DEI LAVORATORI, DEI DISOCCUPATI E DEI PENSIONATI",
      icon: Shield,
      color: "blue",
      content: (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-blue-600 mb-2">
                  • Consulenza ed eventuale avvio vertenza per:
                </h4>
                <p className="text-gray-600">
                  Controllo buste paga, regolarità contratto di assunzione;
                  applicazione CCNL; livello di inquadramento; livello di
                  retribuzione; turni lavorativi; lavoro nero o irregolare;
                  cambiamento di mansioni; trasferimenti, trasferte e indennità
                  di viaggio; recupero crediti retributivi; licenziamenti o
                  provvedimenti disciplinari; erogazione del T.F.R.; gestione
                  delle assenze, permessi, malattia; maternità e paternità;
                  gestione congedi ordinari e straordinari; aspettative; tutela
                  della fragilità e delle patologie gravi; ecc.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <BarChart className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-blue-600 mb-2">
                  • Conteggi differenze retributive
                </h4>
                <p className="text-gray-600 mb-4">
                  Il servizio consente il calcolo analitico delle differenze
                  retributive maturate dai lavoratori, con riferimento a
                  qualsiasi elemento retributivo previsto dal Contratto
                  Collettivo applicato. L'Ufficio Vertenze elabora Documento
                  tecnico avente valore probatorio anche in sede giudiziale.
                </p>
                <Link
                  href="/modulo-conteggi"
                  className="text-red-500 hover:text-red-600 py-2"
                >
                  → clicca qui per richiedere un preventivo!
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-blue-600 mb-2">
                  • Dimissioni telematiche:
                </h4>
                <p className="text-gray-600">
                  Assistenza e supporto in fase di recesso dal proprio rapporto
                  di lavoro, mediante l'invio delle dimissioni in modalità
                  telematica. I nostri esperti sono in grado di individuare i
                  termini di preavviso, la tipologia più consona di recesso del
                  contratto (tra dimissioni volontarie, per giusta causa o con
                  risoluzione consensuale) con relative procedure ed
                  adempimenti.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Scale className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-blue-600 mb-2">
                  • Conciliazioni sindacali:
                </h4>
                <p className="text-gray-600">
                  L'Ufficio Vertenze fornisce ad iscritti e Conciliatori
                  Sindacali il massimo supporto in fase di redazione e stipula
                  degli accordi transattivi in sede protetta, al fine di
                  garantire un'assistenza piena ed effettiva ai lavoratori.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-blue-600 mb-2">
                  • Tutela collettiva dei lavoratori:
                </h4>
                <p className="text-gray-600">
                  Lo Snalv Confsal è sempre al fianco delle proprie
                  Rappresentanze Sindacali Aziendali per ogni procedura a
                  carattere collettivo, nonché per la redazione e la stipula di
                  accordi aziendali o di secondo livello in qualsiasi materia
                  (introduzione premi di risultato o welfare aziendale,
                  riduzione o sospensione dell'attività lavorativa con
                  conseguente ricorso ad ammortizzatori sociali, crisi
                  aziendali, trasferimento d'azienda o ramo d'azienda; cessione
                  dei contratti di lavoro; cambio di appalto, procedure di
                  licenziamento collettivo; ecc.).
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Scale className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-blue-600 mb-2">
                  • Assistenza legale:
                </h4>
                <p className="text-gray-600">
                  Qualora fallisca ogni tentativo stragiudiziale, lo Snalv
                  Confsal garantisce ai lavoratori che ne fanno richiesta
                  un'assistenza legale agevolata, grazie a qualificati Avvocati
                  in convenzione, che garantiscono agli iscritti una prima
                  consulenza gratuita ed un eventuale successivo compenso basato
                  sui minimi tabellari.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <HandHeart className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-blue-600 mb-2">
                  • Tutela dei disoccupati ed invio domande di prestazioni di
                  sostegno al reddito:
                </h4>
                <p className="text-gray-600">
                  I lavoratori in disoccupazione o in cassa integrazione possono
                  contare sull'aiuto di esperti in tema di ammortizzatori
                  sociali. Oltre all'invio delle domande di disoccupazione
                  (NASPI e DIS-COLL), il Sindacato garantisce assistenza
                  operativa anche per accedere alle prestazioni di sostegno al
                  reddito in caso di sospensione momentanea della propria
                  attività lavorativa (CIGO, CIGS, FIS, ecc.).
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-blue-600 mb-2">
                  • Tutela dei pensionati:
                </h4>
                <p className="text-gray-600">
                  Grazie alla collaborazione con UNIPE – Unione Pensionati, lo
                  Snalv può garantire un'assistenza a 360 gradi di tutti i
                  pensionati, sia del settore pubblico che del settore privato.
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      value: "tutela-previdenziale",
      title: "TUTELA PREVIDENZIALE",
      icon: Heart,
      color: "green",
      content: (
        <div className="space-y-6">
          <p className="text-gray-600">
            Grazie alla convenzione col Patronato EPAS, lo Snalv Confsal
            garantisce gratuitamente ai propri iscritti tutti i servizi
            assistenziali e previdenziali di cui hanno bisogno, come ad esempio:
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <CircleDollarSign className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-blue-600 mb-2">
                    • PRESTAZIONI DI SOSTEGNO AL REDDITO
                  </h4>
                  <p className="text-gray-600">
                    NASPI/DIS-COLL, INDENNITÀ DI DISCONTINUITÀ rivolta ai
                    lavoratori dello spettacolo, ISCRO - Indennità Straordinaria
                    di Continuità Reddituale e Operativa
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <Heart className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-blue-600 mb-2">
                    • PENSIONE E PREVIDENZA
                  </h4>
                  <p className="text-gray-600">
                    Inoltro domanda di pensione di Vecchiaia, Pensione
                    Anticipata, Ape sociale, Opzione donna e quota 103.
                    Ricostituzione e ricongiunzione dei contributi,
                    accreditamento contributi figurativi. Richiesta estratto
                    contributivo ed estratto contributivo certificato
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <HandHeart className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-blue-600 mb-2">
                    • INVALIDITÀ E DISABILITÀ
                  </h4>
                  <p className="text-gray-600">
                    Richiesta di assegno ordinario di invalidità, invio domanda
                    pensione di inabilità, invio domanda di invalidità civile e
                    accertamento sanitario, indennità di frequenza, indennità di
                    accompagno, richiesta permessi 104, congedo straordinario
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <Users className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-blue-600 mb-2">
                    • MATERNITÀ/PATERNITÀ
                  </h4>
                  <p className="text-gray-600">
                    Inoltro richiesta di indennità di maternità e paternità
                    obbligatoria, anticipata e flessibile. Inoltro domanda di
                    indennità di congedo parentale. Richiesta bonus asilo nido,
                    bonus mamme premio alla nascita, contributi per genitori
                    disoccupati o monoreddito con figli disabili. Assegno unico.
                    Permessi allattamento. Assegno per congedo matrimoniale
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <CircleDollarSign className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-blue-600 mb-2">
                  • Altri servizi:
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-green-500" />
                    <span>
                      ASSEGNO DI INCLUSIONE (Inoltro domanda di assegno di
                      inclusione)
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-green-500" />
                    <span>
                      ASSEGNO INTEGRATIVO (Richiesta assegno integrativo per
                      lavoratore in mobilità)
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-green-500" />
                    <span>
                      RICORSI E RIESAMI (Assistenza per ricorsi e riesami
                      online)
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-green-500" />
                    <span>
                      BONUS UNA TANTUM (Bonus psicologo, bonus mamme, bonus
                      asilo nido, ecc.)
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      value: "tutela-fiscale",
      title: "TUTELA FISCALE",
      icon: CircleDollarSign,
      color: "yellow",
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 mb-4">
            Grazie alla convenzione col CAF ITALIA, lo Snalv Confsal garantisce
            gratuitamente ai propri iscritti tutti i servizi fiscali di cui
            hanno bisogno, come ad esempio:
          </p>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-yellow-100 hover:shadow-md transition-shadow">
            <ul className="grid gap-4 md:grid-cols-2">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-1 text-yellow-500 flex-shrink-0" />
                <div>
                  <span className="font-bold text-gray-900">ISEE</span>
                  <p className="text-sm text-gray-600">
                    Indicatore della situazione economica equivalente,
                    necessario per alcune tipologie di prestazioni
                    assistenziali, universitarie, sociosanitarie
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-1 text-yellow-500 flex-shrink-0" />
                <div>
                  <span className="font-bold text-gray-900">
                    730/ REDDITI PF/ 730 congiunto
                  </span>
                  <p className="text-sm text-gray-600">
                    Dichiarazione dei redditi
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-1 text-yellow-500 flex-shrink-0" />
                <div>
                  <span className="font-bold text-gray-900">RED</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-1 text-yellow-500 flex-shrink-0" />
                <div>
                  <span className="font-bold text-gray-900">IMU E TASI</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-1 text-yellow-500 flex-shrink-0" />
                <div>
                  <span className="font-bold text-gray-900">SUCCESSIONI</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-1 text-yellow-500 flex-shrink-0" />
                <div>
                  <span className="font-bold text-gray-900">LOCAZIONI</span>
                  <p className="text-sm text-gray-600">
                    Invio registrazione contratti. Supporto per stesura
                    contratti di locazione e comodato d'uso mediante il
                    Sindacato Europeo Inquilini e Assegnatari – SEIASS
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-1 text-yellow-500 flex-shrink-0" />
                <div>
                  <span className="font-bold text-gray-900">
                    VISURE CATASTALI
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-1 text-yellow-500 flex-shrink-0" />
                <div>
                  <span className="font-bold text-gray-900">
                    VISURE CAMERALI
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-1 text-yellow-500 flex-shrink-0" />
                <div>
                  <span className="font-bold text-gray-900">EAS</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 mt-1 text-yellow-500 flex-shrink-0" />
                <div>
                  <span className="font-bold text-gray-900">
                    ICRIC- ICLAV-ACCAS/PS
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      value: "orientamento",
      title: "ORIENTAMENTO LAVORATIVO",
      icon: Compass,
      color: "purple",
      content: (
        <div className="space-y-6">
          <p className="text-gray-600 mb-4">
            Grazie alla collaborazione con l'Ente di formazione INFAP e con le
            Agenzie di lavoro in convenzione, l'iscritto Snalv può contare su un
            aiuto professionale per orientarsi meglio nel mondo del lavoro.
            Nello specifico, ti supportiamo:
          </p>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg mt-1">
                  <Briefcase className="w-5 h-5 text-purple-500" />
                </div>
                <p className="text-gray-600">
                  nella ricerca di un lavoro o di un percorso formativo,
                  accedendo ad iniziative a carattere nazionale, regionale e
                  anche europeo
                </p>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg mt-1">
                  <FileText className="w-5 h-5 text-purple-500" />
                </div>
                <p className="text-gray-600">
                  nel reperire tutte le informazioni sui progetti finanziati
                </p>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg mt-1">
                  <Users className="w-5 h-5 text-purple-500" />
                </div>
                <p className="text-gray-600">
                  nel definire meglio le tue competenze, il tuo profilo
                  lavorativo ed il background professionale
                </p>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg mt-1">
                  <Compass className="w-5 h-5 text-purple-500" />
                </div>
                <p className="text-gray-600">
                  nell'affrontare l'uscita da un'azienda, sia essa causata da un
                  licenziamento o da una risoluzione consensuale, con
                  l'obiettivo di ricollocarti il prima possibile!
                </p>
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      value: "altri-servizi",
      title: "ALTRI SERVIZI IN CONVENZIONE",
      icon: Gift,
      color: "red",
      content: (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-50 rounded-lg">
                <Users className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-blue-600 mb-2">
                  • Assistenza e tutela dei consumatori
                </h4>
                <p className="text-gray-600">
                  L'U.Di.Con. - Unione per la Difesa dei Consumatori - tutela a
                  360 gradi i diritti dei cittadini, quali consumatori e utenti,
                  offrendo un'assistenza completa in molteplici settori: dalla
                  sfera giuridica a quella economica, dalla sfera sanitaria a
                  quella previdenziale e fiscale. Consulta il sito
                  www.udicon.org
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-50 rounded-lg">
                <Building2 className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-blue-600 mb-2">
                  • Assistenza e tutela degli inquilini
                </h4>
                <p className="text-gray-600">
                  SEIASS – Sindacato Europeo Inquilini e Assegnatari lavora
                  incessantemente per garantire che gli inquilini abbiano
                  accesso a alloggi sicuri, dignitosi e a prezzi equi, fornendo
                  una consulenza completa per tutte le tipologie di locazioni,
                  nonché erogando servizi per gli utenti dell'edilizia pubblica.
                  Consulta il sito www.seiass.it
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      value: "agevolazioni",
      title: "AGEVOLAZIONI, SCONTI ED OFFERTE ESCLUSIVE PER GLI ISCRITTI",
      icon: BadgePercent,
      color: "orange",
      content: (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-orange-50 rounded-lg">
                <Shield className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-blue-600 mb-2">
                  • Assicurazione gratuita per i dipendenti delle strutture
                  socio-sanitarie-assistenziali-educative
                </h4>
                <p className="text-gray-600">
                  I lavoratori del comparto iscritti al Sindacato hanno diritto
                  ad una polizza per colpa grave totalmente gratuita. L'estratto
                  della polizza e le garanzie ivi contenute sono consultabili
                  sul sito dedicato:
                  https://www.gbsapri.it/convenzioni/colpa-grave-snalv-confsal/.
                  Tramite il medesimo link, i lavoratori che ne hanno diritto
                  possono richiedere un certificato della propria polizza.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-100 hover:shadow-md transition-shadow">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 rounded-lg mt-1">
                  <GraduationCap className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <span className="font-bold text-gray-900">
                    Università PEGASO
                  </span>
                  <p className="text-sm text-gray-600">
                    Sconti sulle iscrizioni universitarie
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 rounded-lg mt-1">
                  <Building2 className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <span className="font-bold text-gray-900">IBL Banca</span>
                  <p className="text-sm text-gray-600">
                    Condizioni agevolate per apertura conto corrente, richieste
                    di prestiti, finanziamenti e cessioni del quinto
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 rounded-lg mt-1">
                  <CircleDollarSign className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <span className="font-bold text-gray-900">AGOS</span>
                  <p className="text-sm text-gray-600">
                    Prestiti a condizioni vantaggiose
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 rounded-lg mt-1">
                  <BadgePercent className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <span className="font-bold text-gray-900">USI CARD</span>
                  <p className="text-sm text-gray-600">
                    Gli iscritti allo Snalv Confsal di Roma e Provincia possono
                    richiedere il rilascio gratuito dell'USI Card! Per maggiori
                    informazioni contatta il nostro ufficio di riferimento:
                    351.63.46219 - ilcentrocittadino@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-50 rounded-lg mt-1">
                  <MapPin className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <span className="font-bold text-gray-900">
                    CONVENZIONI CON PARTNER LOCALI
                  </span>
                  <p className="text-sm text-gray-600">
                    Consulta la tua sede di riferimento sul territorio, per
                    verificare ulteriori sconti ed agevolazioni a cui puoi
                    accedere in qualità di "Iscritto SNALV"!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      <Header />
      <HeroSection section="tutele" />

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
                    active: true,
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
            <div className="space-y-8">
              {/* Header section */}
              <div className="bg-gradient-to-br from-[#1a365d] to-[#2a4a7f] rounded-2xl p-8 text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  TUTELE E SERVIZI
                </h1>
                <p className="text-gray-200 text-lg">
                  Gli iscritti al Sindacato godono di un'assistenza a 360° sulla
                  propria vita lavorativa, anche in materia fiscale e
                  previdenziale. Inoltre, possono beneficiare di numerose
                  offerte e agevolazioni grazie ai partner in convenzione.
                </p>
              </div>

              {/* Services Grid */}

              {/* Accordion Content */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <Accordion
                  type="single"
                  collapsible
                  className="divide-y divide-gray-100"
                  value={activeTab}
                  onValueChange={setActiveTab}
                >
                  {servicesAccordionItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <AccordionItem
                        value={item.value}
                        key={item.value}
                        className="px-6 py-4"
                      >
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-4">
                            <div
                              className={`p-2 rounded-lg bg-${item.color}-50`}
                            >
                              <IconComponent
                                className={`w-6 h-6 text-${item.color}-500`}
                              />
                            </div>
                            <span className="text-lg font-semibold text-blue-600">
                              {item.title}
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4">
                          {item.content}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>

              {/* News Section */}
              <div className="mt-12 bg-gray-50 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-[#1a365d] mb-6 flex items-center gap-2">
                  <Newspaper className="w-6 h-6 text-red-500" />
                  SERVIZI, CONVENZIONI ED AGEVOLAZIONI
                </h2>
                <CategoryNews categories={["Servizi"]} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
