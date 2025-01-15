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
import { useState, useEffect } from "react";
import { FiHeart, FiUsers, FiHome, FiMapPin } from "react-icons/fi";
import CategoryNews from "@/src/components/CategoryNews";
import HeroSection from "@/src/components/Hero";
import { useRouter } from "next/navigation";

const ChiSiamoPage = () => {
  const [activeSection, setActiveSection] = useState("chi-siamo");
  const [showConteggiForm, setShowConteggiForm] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const updateSection = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        setActiveSection(hash);
      }
    };

    updateSection();

    const handleClick = (e) => {
      const target = e.target.closest("a");
      if (target && target.hash) {
        // Controlla se il link punta alla stessa pagina
        const currentPath = window.location.pathname;
        const targetPath = target.pathname;

        // Se siamo nella stessa pagina, gestisci solo il cambio di hash
        if (currentPath === targetPath) {
          e.preventDefault();
          const hash = target.hash.slice(1);
          setActiveSection(hash);
          window.history.pushState(null, "", `#${hash}`);
        }
        // Altrimenti, lascia che la navigazione proceda normalmente
      }
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("hashchange", updateSection);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("hashchange", updateSection);
    };
  }, []);

  const menuItems = [
    {
      id: "chi-siamo",
      label: "Chi siamo",
      hero: { title: "Chi Siamo", bg: "/img/chisiamo.jpg" },
    },
    {
      id: "struttura",
      label: "La struttura nazionale",
      hero: { title: "Struttura Nazionale", bg: "/img/struttura.jpg" },
    },
    {
      id: "tutele",
      label: "Tutele e servizi",
      hero: { title: "Tutele e Servizi", bg: "/img/tutele.jpg" },
    },
    {
      id: "comparti",
      label: "Comparti specifici",
      hero: { title: "Comparti Specifici", bg: "/img/comparti.jpg" },
    },
  ];

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
            <Button
              variant="link"
              onClick={() => setShowConteggiForm(true)}
              className="text-red-500 hover:text-red-600 py-2"
            >
              → clicca qui per richiedere un preventivo!
            </Button>
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
  ];

  const organigrammaItems = [
    {
      id: "segretario",
      label: "Il Segretario Generale ed il Vice-Segretario Nazionale",
    },
    { id: "segreteria", label: "La Segreteria nazionale" },
    { id: "consiglio", label: "Il Consiglio Nazionale" },
  ];

  const ConteggiForm = () => (
    <form className="space-y-6 bg-gray-50 p-6 sm:p-8 rounded-lg">
      <h2 className="text-xl sm:text-2xl font-bold text-[#1a365d] mb-6 sm:mb-8">
        MODULO CONTEGGI
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
        <div className="space-y-4">
          <div>
            <label className="text-blue-600 block text-sm font-bold mb-1">
              Ragione sociale/Datore di lavoro
            </label>
            <Input className="w-full bg-white" />
          </div>

          <div>
            <label className="text-blue-600 block text-sm font-bold mb-1">
              Cellulare
            </label>
            <Input className="w-full bg-white" />
          </div>

          <div>
            <label className="text-blue-600 block text-sm font-bold mb-1">
              Data inizio rapporto lavoro
            </label>
            <Input type="date" className="w-full bg-white" />
          </div>

          <div>
            <label className="text-blue-600 block text-sm font-bold mb-1">
              CCNL applicato
              <span className="text-sm text-gray-500 block">
                (specificare settore, qualifica e livello)
              </span>
            </label>
            <Input className="w-full bg-white" />
          </div>

          <div>
            <label className="text-blue-600 block text-sm font-bold mb-1">
              Tipologia di contratto
              <span className="text-sm text-gray-500 block">
                (specificare se part-time o full time)
              </span>
            </label>
            <Input className="w-full bg-white" />
          </div>

          <div>
            <label className="text-blue-600 block text-sm font-bold mb-1">
              Eventuali straordinari
            </label>
            <Input className="w-full bg-white" />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-blue-600 block text-sm font-bold mb-1">
              Lavoratore
            </label>
            <Input className="w-full bg-white" />
          </div>

          <div>
            <label className="text-blue-600 block text-sm font-bold mb-1">
              Email
            </label>
            <Input type="email" className="w-full bg-white" />
          </div>

          <div>
            <label className="text-blue-600 block text-sm font-bold mb-1">
              Data risoluzione rapporto lavoro
            </label>
            <Input type="date" className="w-full bg-white" />
          </div>

          <div>
            <label className="text-blue-600 block text-sm font-bold mb-1">
              Retribuzione corrisposta
            </label>
            <Input className="w-full bg-white" />
          </div>

          <div>
            <label className="text-blue-600 block text-sm font-bold mb-1">
              Orario di lavoro
            </label>
            <Input className="w-full bg-white" />
          </div>

          <div>
            <label className="text-blue-600 block text-sm font-bold mb-1">
              N° ore settimanali
            </label>
            <Input className="w-full bg-white" />
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mt-8">
        <p className="text-sm text-gray-600 mb-4">
          Si prega di allegare copia del contratto e delle buste paga in
          possesso
        </p>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="file"
            multiple
            className="border-dashed border-red-500 border-2 rounded-lg p-4 text-center text-sm text-gray-500 hover:border-red-600 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            id="fileUpload"
          />
          <span className="text-sm text-gray-500">
            È possibile allegare più file
          </span>
        </div>
      </div>

      <Button className="bg-red-500 hover:bg-red-600 text-white mt-6 sm:mt-8">
        INVIA RICHIESTA
      </Button>
    </form>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "chi-siamo":
        return (
          <div className="space-y-12 flex flex-col gap-12">
            <div className="space-y-6 text-gray-700 flex flex-col md:flex-row justify-between">
              <div className="w-full md:w-2/5 flex flex-col gap-6">
                <h1 className="text-[#1a365d] text-4xl font-bold mb-8 md:text-5xl ">
                  CHI SIAMO
                </h1>
                <p className="text-justify">
                  Lo Snalv Confsal è un&apos;Organizzazione Sindacale libera e
                  democratica, aderente alla CONFSAL, terzo Sindacato in Italia
                  in termini di rappresentatività sindacale.
                </p>
                <p className="text-justify">
                  Il nostro Sindacato tutela i lavoratori dipendenti del settore
                  privato ed i dipendenti pubblici degli &quot;Enti
                  Locali&quot;, corsi convenzionati ed i pensionati.
                </p>
                <p className="text-justify">
                  Siamo diffusi su tutto il territorio nazionale con oltre{" "}
                  <strong>220</strong> sedi sindacali aperte al pubblico
                  (consulta qui l&apos;elenco completo)
                </p>
                <p className="text-justify">
                  Al 31/12/2024 lo Snalv Confsal ha superato il numero di{" "}
                  <strong>50.000</strong> iscritti al Sindacato, con oltre n.{" "}
                  <strong>150</strong> rappresentanze sindacali aziendali nel
                  settore privato (da RSA e RSU) e n. 51 membri RSU nel settore
                  pubblico.
                </p>
              </div>
              <iframe
                className="w-full md:w-2/4 rounded-md"
                src="https://www.youtube.com/embed/QPBVvkYdR3c"
              ></iframe>
            </div>

            <div
              className="flex flex-col md:flex-row items-center gap-6 cursor-pointer bg-gray-100 rounded-lg p-4 hover:bg-gray-200 transition-colors"
              onClick={() => router.push("/congresso")}
            >
              <Image
                src="/img/congresso.jpg"
                width={200}
                height={100}
                alt="Congresso"
              />

              <h1 className="text-3xl text-blue-600 md:w-1/3 text-center md:text-left">
                Il Congresso Nazionale del 2018
              </h1>
            </div>
          </div>
        );

      case "segretario":
        return (
          <div className="space-y-12">
            <section>
              <h1 className="text-[#1a365d] text-4xl font-bold mb-8 md:text-5xl">
                Il Segretario Generale
              </h1>
              <h2 className="text-[#1a365d] text-2xl font-bold mb-4 md:text-3xl">
                Dott.ssa Maria Mamone
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-100 p-6">
                  <p>
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
                    sed diam nonummy nibh euismod tincidunt ut laoreet dolore
                    magna aliquam erat volutpat.
                  </p>
                </div>
                <div>
                  <Image
                    src="/img/mamone.jpg"
                    alt="Maria Mamone"
                    width={300}
                    height={300}
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-[#1a365d] text-4xl font-bold mb-8 md:text-5xl">
                Il Vice-Segretario Nazionale
              </h2>
              <h3 className="text-[#1a365d] text-2xl font-bold mb-4 md:text-3xl">
                Cosimo Nesci - consigliere CNEL
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-100 p-6">
                  <p>
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit,
                    sed diam nonummy nibh euismod tincidunt ut laoreet dolore
                    magna aliquam erat volutpat.
                  </p>
                </div>
                <div>
                  <Image
                    src="/img/nesci.jpg"
                    alt="Cosimo Nesci"
                    width={300}
                    height={300}
                  />
                </div>
              </div>
            </section>
          </div>
        );

      case "segreteria":
        return (
          <div>
            <h1 className="text-[#1a365d] text-4xl font-bold mb-8 md:text-5xl">
              La Segreteria nazionale
            </h1>
            <p className="mb-8">
              I componenti della Segreteria Nazionale, eletti durante
              l&apos;ultimo Congresso Nazionale SNALV/Confsal
            </p>
            <ul className="space-y-2 md:columns-2">
              {[
                "MARIA MAMONE",
                "COSIMO NESCI",
                "GIULIA PUDDU",
                "GIUSEPPINA ADAMO",
                "BELINDA PESCOSOLIDO",
                "DANIELE PACE",
                "PASQUALE PELLEGRINO",
              ].map((name) => (
                <li key={name} className="text-[#1a365d]">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        );

      case "consiglio":
        return (
          <div>
            <h1 className="text-[#1a365d] text-4xl font-bold mb-8 md:text-5xl">
              Il Consiglio Nazionale
            </h1>
            <p className="mb-8">
              I componenti del Consiglio Nazionale, eletti durante l&apos;ultimo
              Congresso Nazionale SNALV/Confsal
            </p>
            <ul className="space-y-2 md:columns-3">
              {[
                "MARIA MAMONE",
                "COSIMO NESCI",
                "GIULIA PUDDU",
                "GIUSEPPINA ADAMO",
                "BELINDA PESCOSOLIDO",
                "DANIELE PACE",
                "PASQUALE PELLEGRINO",
                "ISABELLA MAMONE",
                "VINCENZO PALDINO",
                "VALERIA SMURRA",
                "CLAUDIO ZUCCHELLI",
                "FRANCESCO FLORIO",
                "STANISLAO AULETTA",
                "FARA MANZI",
                "ANTONIO LENTO",
                "PEPPINO RUBERTO",
                "ANTONIO SANTONOCITO",
                "DANIELA MAZZOLA",
                "MARTINA DONINI",
                "FABIO LAROCCA",
                "DANIELA MARIA SERVETTI",
              ].map((name) => (
                <li key={name} className="text-[#1a365d]">
                  {name}
                </li>
              ))}
            </ul>
          </div>
        );

      case "struttura":
        return (
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
        );

      case "tutele":
        return (
          <div>
            <h1 className="text-[#1a365d] text-4xl font-bold mb-6 md:text-5xl">
              TUTELE E SERVIZI
            </h1>
            <p className="mb-8">
              Gli iscritti al Sindacato godono di un&apos;assistenza a 360°
              sulla propria vita lavorativa, anche in materia fiscale e
              previdenziale. Inoltre, possono beneficiare di numerose offerte e
              agevolazioni grazie ai partner in convenzione.
            </p>

            {showConteggiForm ? (
              <ConteggiForm />
            ) : (
              <>
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
              </>
            )}
          </div>
        );

      case "comparti":
        return (
          <div className="space-y-8">
            <h1 className="text-[#1a365d] text-4xl font-bold mb-6">
              COMPARTI SPECIFICI
            </h1>
            <p className="text-gray-700 mb-8">
              Al fine di garantire ai lavoratori un supporto specifico e
              competente, in relazione alle peculiarità del settore o delle
              fasce lavorative, lo SNALV Confsal ha costituito i seguenti
              Comparti sindacali:
            </p>

            {/* Lista dei comparti */}
            <div className="grid gap-6">
              {/* SOCIO-SANITARIO */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-[#1a365d] mb-3">
                      SOCIO-SANITARIO-ASSISTENZIALE-EDUCATIVO
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Lo Snalv è la federazione rappresentativa della CONFSAL
                      del settore socio-sanitario-assistenziale-educativo.
                      Scopri di più sulla nostra attività sindacale in merito!
                    </p>
                    <div className="flex items-center">
                      <Button
                        onClick={() => setActiveSection("socio-sanitario")}
                        className="flex items-center space-x-2 text-red-500 hover:text-red-600 transition-colors"
                        variant="link"
                      >
                        <span>SCOPRI DI PIÙ</span>
                        <span>→</span>
                      </Button>
                    </div>
                  </div>
                  <div className="ml-6">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                      <FiHeart className="w-8 h-8 text-red-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* LAVORATORI FRAGILI */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-[#1a365d] mb-3">
                      LAVORATORI FRAGILI
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Lo Snalv tutela i dipendenti affetti da patologie gravi,
                      croniche o invalidanti per la salvaguardia dei diritti e
                      dei doveri afferenti al proprio rapporto lavorativo.
                    </p>
                    <div className="flex items-center">
                      <Button
                        onClick={() => setActiveSection("lavoratori-fragili")}
                        className="flex items-center space-x-2 text-red-500 hover:text-red-600 transition-colors"
                        variant="link"
                      >
                        <span>SCOPRI DI PIÙ</span>
                        <span>→</span>
                      </Button>
                    </div>
                  </div>
                  <div className="ml-6">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                      <FiUsers className="w-8 h-8 text-red-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* ENTI LOCALI */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-[#1a365d] mb-3">
                      ENTI LOCALI
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Lo Snalv è presente con i propri Rappresentanti nei vari
                      comparti dell&apos;intera Amministrazione anche a livello
                      regionale. Scopri di più sull&apos;organizzazione del
                      nostro comparto!
                    </p>
                    <div className="flex items-center">
                      <Button
                        onClick={() => setActiveSection("enti-locali")}
                        className="flex items-center space-x-2 text-red-500 hover:text-red-600 transition-colors"
                        variant="link"
                      >
                        <span>SCOPRI DI PIÙ</span>
                        <span>→</span>
                      </Button>
                    </div>
                  </div>
                  <div className="ml-6">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                      <FiHome className="w-8 h-8 text-red-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* CONFSAL SUD */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-[#1a365d] mb-3">
                      CONFSAL SUD
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Il Segretario Generale SNALV Confsal ricopre il ruolo di
                      Coordinatore Nazionale del Dipartimento Confsal dedicato
                      al Sud Italia.
                    </p>
                    <div className="flex items-center">
                      <Button
                        onClick={() => setActiveSection("confsal-sud")}
                        className="flex items-center space-x-2 text-red-500 hover:text-red-600 transition-colors"
                        variant="link"
                      >
                        <span>SCOPRI DI PIÙ</span>
                        <span>→</span>
                      </Button>
                    </div>
                  </div>
                  <div className="ml-6">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                      <FiMapPin className="w-8 h-8 text-red-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "socio-sanitario":
        return (
          <div className="space-y-8">
            <h1 className="text-[#1a365d] text-4xl font-bold mb-6 md:text-5xl">
              SOCIO-SANITARIO-ASSISTENZIALE-EDUCATIVO
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <p className="text-gray-700 mb-6">
                  Lo Snalv Confsal è la federazione rappresentativa della
                  CONFSAL per il comparto
                  socio-sanitario-assistenziale-educativo. La politica, miope e
                  frammentata degli ultimi anni, sta producendo il collasso del
                  sistema, che tuttavia ancora oggi è sostenuto dall’incredibile
                  abnegazione di operatori socio sanitari, infermieri, educatori
                  professionali, terapisti e di tutte le professionalità
                  operanti all’interno delle strutture accreditate.
                </p>

                <p className="text-gray-700 mb-6">
                  Ci sono problemi di fondo che mai nessuno ha voluto affrontare
                  e che impediscono, anche alla contrattazione collettiva, di
                  valorizzare adeguatamente le professionalità del comparto. Lo
                  Snalv Confsal, anche in considerazione dell’iter attuativo
                  della riforma sull’assistenza agli anziani, ha avviato una
                  seria e concreta discussione con istituzioni e datori di
                  lavoro per consentire il miglioramento delle condizioni
                  lavorative dei dipendenti.
                </p>

                <p className="text-gray-700 mb-6">
                  Nello specifico, la nostra mission si compone di tre punti
                  qualificanti: • Equiparazione degli stipendi e delle
                  condizioni di lavoro dei dipendenti delle strutture
                  accreditate a quelle dei colleghi del pubblico impiego; •
                  Garanzia di un numero minimo di personale adeguato al numero
                  degli utenti assistiti; • Programmazione efficace del
                  fabbisogno di personale, in relazione alla crescita
                  esponenziale della popolazione anziana in Italia. Su questi
                  presupposti, i lavoratori iscritti al Sindacato hanno
                  approvato una piattaforma programmatica che prova a sviscerare
                  le comuni problematiche del personale, indagando sulle cause
                  che determinano inefficienze organizzative e discriminazioni
                  contrattuali. Il documento tenta di fornire, al tempo stesso,
                  indirizzi di politiche pubbliche da attuare nel breve e medio
                  termine.
                </p>

                <Image
                  src="/img/sociosanitario.jpg"
                  alt="Socio-Sanitario"
                  width={600}
                  className="rounded-md"
                  height={500}
                />

                <div className="space-y-4 mt-8">
                  <h2 className="text-[#1a365d] text-2xl font-bold md:text-3xl">
                    CONTATTACI
                  </h2>
                  <p>Email: sociosanitario@snalv.it</p>
                  <p>Telefono: 06.70492451</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded">
                  <h3 className="font-bold mb-2 border-l-2 border-red-500 pl-3">
                    IL CCNL ANASTE 2022
                  </h3>
                  <div className="space-y-2">
                    <Button variant="link">Il Testo integrale</Button>
                    <Button variant="link">
                      Verbale integrativo 28.04.2023
                    </Button>
                    <Button variant="link">Scheda di approfondimento</Button>
                  </div>
                </div>

                <div className="bg-blue-900 text-white p-4 rounded">
                  <h3 className="font-bold mb-2 border-l-2 border-red-500 pl-3">
                    EVENTO 20 FEBBRAIO 2024 - ROMA
                  </h3>
                  <p>
                    SETTORE SOCIO SANITARIO, valorizzare il LAVORO per garantire
                    la QUALITÀ dei servizi
                  </p>
                </div>

                <div className="bg-blue-900 text-white p-4 rounded">
                  <h3 className="font-bold mb-2 border-l-2 border-red-500 pl-3">
                    ASSICURAZIONE GRATUITA PER GLI ISCRITTI
                  </h3>
                  <p>
                    I lavoratori delle strutture
                    socio-sanitarie-assistenziali-educative possono avere
                    l&apos;assicurazione per colpa grave totalmente gratuita se
                    sei iscritto al sindacato
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-[#1a365d] text-2xl font-bold mb-6 md:text-3xl">
                NOTIZIE COMPARTO SOCIOSANITARIO
              </h2>
              <CategoryNews categories={["Socio Sanitario"]} />
            </div>
          </div>
        );

      case "lavoratori-fragili":
        return (
          <div className="space-y-8">
            <h1 className="text-[#1a365d] text-4xl font-bold mb-6 md:text-5xl">
              LAVORATORI FRAGILI
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <p className="text-gray-700 mb-6">
                  "La qualità della vita all’interno di una società si misura,
                  in buona parte, dalla capacità di includere coloro che sono
                  più deboli e bisognosi, nel rispetto effettivo della loro
                  dignità di uomini e di donne. E la maturità si raggiunge
                  quando tale inclusione non è percepita come qualcosa di
                  straordinario, ma di normale. Anche la persona con disabilità
                  e fragilità fisiche, psichiche o morali, deve poter
                  partecipare alla vita della società ed essere aiutata ad
                  attuare le sue potenzialità nelle varie dimensioni. Soltanto
                  se vengono riconosciuti i diritti dei più deboli, una società
                  può dire di essere fondata sul diritto e sulla giustizia.”
                </p>

                <p className="text-gray-700 mb-6">
                  (Papa Francesco, febbraio 2017)
                </p>

                <p className="text-gray-700 mb-6">
                  Sin dall’inizio della pandemia il nostro Sindacato si è
                  battuto su ogni fronte per tutelare pienamente la categoria
                  dei lavoratori fragili. Il Covid- 19 ha soltanto esasperato
                  alcune problematiche che attanagliano da sempre la
                  quotidianità dei lavoratori. Da qui nasce il nuovo comparto
                  sindacale dedicato esclusivamente ai lavoratori affetti da
                  patologie gravi, croniche o invalidanti. Il progetto sindacale
                  mira a garantire una tutela piena ed effettiva dei lavoratori
                  e dei loro familiari, con competenze specifiche e settoriali.
                  Il comparto copre tre aree di intervento: sindacale, legale e
                  previdenziale. L'obiettivo è garantire sempre una risposta
                  appropriata alle esigenze derivanti dal mondo della fragilità
                  e delle disabilità in genere.
                </p>

                <p className="text-gray-700 mb-6">
                  Il comparto, inoltre, ha predisposto una proposta di legge che
                  tutela i lavoratori in tutte le fasi del rapporto lavorativo:
                  <br />
                  <br />
                  - inserimento occupazionale,
                  <br />
                  - gestione delle assenze e conciliazione con le esigenze di
                  cura
                  <br />
                  - re-inserimento lavorativo dopo la fase acuta della patologia
                  <br />- modalità anticipata di pensionamento.
                </p>

                <p className="text-gray-700 mb-6">
                  Sproneremo costantemente la politica affinchè tale proposta
                  diventi presto una Legge dello Stato. Tutelare i lavoratori
                  fragili è una questione di civiltà!
                </p>

                <Image
                  src="/img/fragili.jpg"
                  alt="Lavoratori Fragili"
                  width={600}
                  className="rounded-md"
                  height={500}
                />

                <div className="space-y-4 mt-8">
                  <h2 className="text-[#1a365d] text-2xl font-bold md:text-3xl">
                    CONTATTACI
                  </h2>
                  <p>Email: sociosanitario@snalv.it</p>
                  <p>Telefono: 06.70492451</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-[#1a365d] text-2xl font-bold mb-6 md:text-3xl">
                NOTIZIE COMPARTO LAVORATORI FRAGILI
              </h2>
              <CategoryNews categories={["Fragili"]} />
            </div>
          </div>
        );

      case "enti-locali":
        return (
          <div className="space-y-8">
            <h1 className="text-[#1a365d] text-4xl font-bold mb-6 md:text-5xl">
              ENTI LOCALI
            </h1>
            <p className="mb-8">
              Lo Snalv Confsal è impegnato nella tutela dei dipendenti pubblici
              delle &quot;Funzioni Locali&quot;
            </p>

            <div>
              <h2 className="text-xl text-blue-600 font-bold mb-4 md:text-2xl">
                Il Sindacato rappresenta, in particolare, le lavoratrici e i
                lavoratori dei seguenti ENTI:
              </h2>
              <ul className="list-none ps-0 pl-5 space-y-2 md:columns-2">
                <li className="h-[90px] flex items-center justify-start rounded-md border-2 border-blue-600 p-2 text-blue-600 font-bold">
                  Regioni a statuto ordinario e degli Enti pubblici non
                  economici dalle stesse dipendenti
                </li>
                <li className="h-[90px] flex items-center justify-start rounded-md border-2 border-blue-600 p-2 text-blue-600 font-bold">
                  Province, Città metropolitane, Enti di area vasta, Liberi
                  consorzi comunali di cui alla legge 4 agosto 2015, n. 15 della
                  regione Sicilia
                </li>
                <li className="h-[90px] flex items-center justify-start rounded-md border-2 border-blue-600 p-2 text-blue-600 font-bold">
                  Comuni
                </li>
                <li className="h-[90px] flex items-center justify-start rounded-md border-2 border-blue-600 p-2 text-blue-600 font-bold">
                  Comuni montani
                </li>
                <li className="h-[90px] flex items-center justify-start rounded-md border-2 border-blue-600 p-2 text-blue-600 font-bold">
                  ex Istituti autonomi per le case popolari comunque denominati
                </li>
                <li className="h-[90px] flex items-center justify-start rounded-md border-2 border-blue-600 p-2 text-blue-600 font-bold">
                  Consorzi e associazioni, incluse le Unioni di Comuni
                </li>
                <li className="h-[90px] flex items-center justify-start rounded-md border-2 border-blue-600 p-2 text-blue-600 font-bold">
                  Aziende pubbliche di servizi alla persona (ex IPAB), che
                  svolgono prevalentemente funzioni assistenziali
                </li>
                <li className="h-[90px] flex items-center justify-start rounded-md border-2 border-blue-600 p-2 text-blue-600 font-bold">
                  Università agrarie ed associazioni agrarie dipendenti dagli
                  enti locali
                </li>
                <li className="h-[90px] flex items-center justify-start rounded-md border-2 border-blue-600 p-2 text-blue-600 font-bold">
                  Camere di commercio, industria, artigianato e agricoltura
                </li>
                <li className="h-[90px] flex items-center justify-start rounded-md border-2 border-blue-600 p-2 text-blue-600 font-bold">
                  Autorità di bacino, ai sensi della legge 21 ottobre 1994, n.
                  584
                </li>
              </ul>
            </div>

            <Image
              src="/img/entilocali.jpg"
              alt="Enti Locali"
              width={600}
              height={500}
              className="rounded-md"
            />

            <div className="bg-gray-100 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4 md:text-2xl text-blue-600">
                CONTATTACI
              </h2>
              <div className="space-y-2">
                <p>
                  <span className="font-bold">Coordinatore nazionale:</span>{" "}
                  avv. Massimo Arena
                </p>
                <p>
                  <span className="font-bold">Email:</span> entilocali@snalv.it
                  - snalventilocali@pec.it
                </p>
                <p>
                  <span className="font-bold">Telefono:</span> 380.5252867
                </p>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-[#1a365d] text-2xl font-bold mb-6 md:text-3xl">
                NOTIZIE COMPARTO ENTI LOCALI
              </h2>
              <CategoryNews categories={["Enti Locali"]} />
            </div>
          </div>
        );

      case "confsal-sud":
        return (
          <div className="space-y-8">
            <h1 className="text-[#1a365d] text-4xl font-bold mb-6 md:text-5xl">
              CONFSAL SUD
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <p className="text-gray-700 mb-6">
                  La CONFSAL - prima Organizzazione italiana dei Sindacati
                  Autonomi per numero di lavoratori iscritti - ha costituito un
                  proprio Dipartimento dedicato al Sud del nostro Paese.
                  L'obiettivo del Dipartimento è analizzare ed approfondire i
                  divari di cittadinanza che caratterizzano tante aree del
                  Mezzogiorno, al fine di elaborare proposte concrete da
                  presentare alle istituzioni competenti. A tal proposito, il
                  Dipartimento ha promosso l'iniziativa "Missione Mediterraneo":
                  trattasi di un ciclo di seminari da svolgersi nelle diverse
                  Regioni del Sud, che mira a focalizzare la discussione sulle
                  potenzialità di sviluppo dei territori in relazione alla
                  congiuntura economica del momento.
                </p>

                <p className="text-gray-700 mb-6">
                  Siamo fermamente convinti che il confronto e il raccordo tra
                  Rappresentanti europei, Amministrazioni centrali e locali,
                  Parti sociali potranno favortre una programmazione analitica
                  ed efficace delle risorse comunitarie ancorata ai reali
                  fabbisogni dei territori. In quest'ottica, il Dipartimento
                  intende mettere in rete rappresentanti delle Istituzioni,
                  imprese, lavoratori, giovani e disoccupati, Università e
                  ricerca, parti sociali impegnate a vario titolo nella
                  promozione e nello svlluppo del territorio.
                </p>

                <Image
                  src="/img/confsal.jpeg"
                  alt="Confsal Sud"
                  width={600}
                  className="rounded-md"
                  height={500}
                />

                <div className="space-y-4 mt-8">
                  <h2 className="text-[#1a365d] text-2xl font-bold md:text-3xl">
                    CONTATTACI
                  </h2>
                  {/* Contatti */}
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-[#1a365d] text-2xl font-bold mb-6 md:text-3xl">
                NOTIZIE DIPARTIMENTO SUD
              </h2>
              <CategoryNews categories={["Dipartimento SUD"]} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <HeroSection section={activeSection} />

      <main className="max-w-full md:max-w-7xl px-4 mx-auto py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Menu Items */}
          <div className="">
            <div className="bg-gray-100 p-4 rounded-lg">
              {menuItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`py-4 ${
                    index === 0
                      ? "border-b-2 border-red-500"
                      : "border-b-2 border-red-500"
                  }`}
                >
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-left hover:font-bold uppercase ${
                      activeSection === item.id
                        ? "text-red-500 font-bold"
                        : "text-gray-700"
                    }`}
                    onClick={() => setActiveSection(item.id)}
                  >
                    {item.label}
                  </Button>
                </div>
              ))}
            </div>

            {/* Organigramma Section */}
            {(activeSection === "chi-siamo" ||
              activeSection === "segretario" ||
              activeSection === "segreteria" ||
              activeSection === "consiglio") && (
              <div className="mt-8">
                <h2 className="text-[#1a365d] text-xl font-bold mb-4">
                  ORGANIGRAMMA
                </h2>
                <div className="space-y-2">
                  {organigrammaItems.map((item) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className={`w-full justify-between bg-gray-100 hover:bg-gray-200 py-6 text-left text-wrap hover:font-bold ${
                        activeSection === item.id ? "bg-gray-200" : ""
                      }`}
                      onClick={() => setActiveSection(item.id)}
                    >
                      {item.label}
                    </Button>
                  ))}
                  <Link href="/territorio#cerca-sede" passHref className="">
                    <Button
                      variant="ghost"
                      className={`w-full my-2 justify-between bg-gray-100 hover:bg-gray-200 py-6 text-left text-wrap hover:font-bold`}
                    >
                      Le Segreterie Nazionali
                    </Button>
                  </Link>
                  <Link href="/territorio#cerca-sede" passHref>
                    <Button
                      variant="ghost"
                      className={`w-full justify-between bg-gray-100 hover:bg-gray-200 py-6 text-left text-wrap hover:font-bold`}
                    >
                      I Centri Snalv
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Render Content */}
          <div className="lg:col-span-3">{renderContent()}</div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ChiSiamoPage;
