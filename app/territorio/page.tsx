"use client";

import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import NewsComponent from "@/src/components/CategoryNews";
import "leaflet/dist/leaflet.css";
import { FiChevronLeft } from "react-icons/fi";
import HeroSection from "@/src/components/Hero";
import dynamic from "next/dynamic";
import { getDocs, query, collection, orderBy, where } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin } from "lucide-react";
import Link from "next/link";

const MapComponent = dynamic(() => import("@/src/components/Map"), {
  ssr: false,
  loading: () => <div className="w-full h-[500px] bg-gray-100" />,
});

const regioni = [
  "Abruzzo",
  "Basilicata",
  "Calabria",
  "Campania",
  "Emilia-Romagna",
  "Friuli-Venezia Giulia",
  "Lazio",
  "Liguria",
  "Lombardia",
  "Marche",
  "Molise",
  "Piemonte",
  "Puglia",
  "Sardegna",
  "Sicilia",
  "Toscana",
  "Trentino-Alto Adige",
  "Umbria",
  "Valle d'Aosta",
  "Veneto",
];

const province: { [key: string]: string[] } = {
  Abruzzo: ["Chieti", "L'Aquila", "Pescara", "Teramo"],
  Basilicata: ["Matera", "Potenza"],
  Calabria: [
    "Catanzaro",
    "Cosenza",
    "Crotone",
    "Reggio Calabria",
    "Vibo Valentia",
  ],
  Campania: ["Avellino", "Benevento", "Caserta", "Napoli", "Salerno"],
  "Emilia-Romagna": [
    "Bologna",
    "Ferrara",
    "Forlì-Cesena",
    "Modena",
    "Parma",
    "Piacenza",
    "Ravenna",
    "Reggio Emilia",
    "Rimini",
  ],
  "Friuli-Venezia Giulia": ["Gorizia", "Pordenone", "Trieste", "Udine"],
  Lazio: ["Frosinone", "Latina", "Rieti", "Roma", "Viterbo"],
  Liguria: ["Genova", "Imperia", "La Spezia", "Savona"],
  Lombardia: [
    "Bergamo",
    "Brescia",
    "Como",
    "Cremona",
    "Lecco",
    "Lodi",
    "Mantova",
    "Milano",
    "Monza e Brianza",
    "Pavia",
    "Sondrio",
    "Varese",
  ],
  Marche: ["Ancona", "Ascoli Piceno", "Fermo", "Macerata", "Pesaro e Urbino"],
  Molise: ["Campobasso", "Isernia"],
  Piemonte: [
    "Alessandria",
    "Asti",
    "Biella",
    "Cuneo",
    "Novara",
    "Torino",
    "Verbano-Cusio-Ossola",
    "Vercelli",
  ],
  Puglia: [
    "Bari",
    "Barletta-Andria-Trani",
    "Brindisi",
    "Foggia",
    "Lecce",
    "Taranto",
  ],
  Sardegna: ["Cagliari", "Nuoro", "Oristano", "Sassari", "Sud Sardegna"],
  Sicilia: [
    "Agrigento",
    "Caltanissetta",
    "Catania",
    "Enna",
    "Messina",
    "Palermo",
    "Ragusa",
    "Siracusa",
    "Trapani",
  ],
  Toscana: [
    "Arezzo",
    "Firenze",
    "Grosseto",
    "Livorno",
    "Lucca",
    "Massa-Carrara",
    "Pisa",
    "Pistoia",
    "Prato",
    "Siena",
  ],
  "Trentino-Alto Adige": ["Bolzano", "Trento"],
  Umbria: ["Perugia", "Terni"],
  "Valle d'Aosta": ["Aosta"],
  Veneto: [
    "Belluno",
    "Padova",
    "Rovigo",
    "Treviso",
    "Venezia",
    "Verona",
    "Vicenza",
  ],
};

const segreterieSedi: any = {
  Campania: {
    Napoli: [
      {
        nome: "Segreteria Regionale Campania",
        indirizzo: "Via Toledo 156",
        telefono: "081 1234567",
        email: "campania@snalv.it",
      },
      {
        nome: "Segreteria Provinciale Napoli",
        indirizzo: "Via Medina 40",
        telefono: "081 7654321",
        email: "napoli@snalv.it",
      },
    ],
    Salerno: [
      {
        nome: "Segreteria Provinciale Salerno",
        indirizzo: "Corso Vittorio Emanuele 45",
        telefono: "089 1234567",
        email: "salerno@snalv.it",
      },
    ],
  },
  Lazio: {
    Roma: [
      {
        nome: "Segreteria Nazionale",
        indirizzo: "Via di Porta Maggiore, 9",
        telefono: "06 70492451",
        email: "info@snalv.it",
      },
      {
        nome: "Segreteria Regionale Lazio",
        indirizzo: "Via Cavour 108",
        telefono: "06 9876543",
        email: "lazio@snalv.it",
      },
    ],
    Frosinone: [
      {
        nome: "Segreteria Provinciale Frosinone",
        indirizzo: "Via Roma 67",
        telefono: "0775 123456",
        email: "frosinone@snalv.it",
      },
    ],
  },
};

const centriSedi: any = {
  Lombardia: {
    Milano: [
      {
        nome: "Centro SNALV Milano Centro",
        indirizzo: "Corso Buenos Aires 56",
        telefono: "02 1234567",
        email: "milano.centro@snalv.it",
        servizi: ["CAF", "Patronato", "Assistenza Legale"],
      },
    ],
    Bergamo: [
      {
        nome: "Centro SNALV Bergamo",
        indirizzo: "Via XX Settembre 32",
        telefono: "035 1234567",
        email: "bergamo@snalv.it",
        servizi: ["CAF", "Patronato"],
      },
    ],
  },
  Piemonte: {
    Torino: [
      {
        nome: "Centro SNALV Torino",
        indirizzo: "Via Roma 123",
        telefono: "011 1234567",
        email: "torino@snalv.it",
        servizi: [
          "CAF",
          "Patronato",
          "Assistenza Legale",
          "Consulenza Sindacale",
        ],
      },
    ],
  },
};

// Componente principale TerritorioPage
const TerritorioPage = () => {
  const [activeSection, setActiveSection] = useState("cerca-sede");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any>([]);
  const [mapCenter, setMapCenter] = useState([41.9028, 12.4964]);
  const [mapZoom, setMapZoom] = useState(6);
  const [sediList, setSediList] = useState<any[]>([]);
  const [segreterieSedi, setSegreterieSedi] = useState<any>({});
  const [centriSedi, setCentriSedi] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setActiveSection(hash);
    }
    fetchSedi();
  }, []);

  console.log("Sedi", sediList);

  const fetchSedi = async () => {
    setIsLoading(true);
    try {
      const sediQuery = query(
        collection(db, "sedi"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(sediQuery);

      // Lista completa per la mappa
      const allSedi = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          name: data.tipo + " " + data.citta, // es: "Ufficio Provinciale Pisa"
          address: data.indirizzo,
          cap: data.cap || "",
          position: data.coordinate
            ? [parseFloat(data.coordinate.lat), parseFloat(data.coordinate.lng)]
            : [41.9028, 12.4964], // coordinate di default se mancanti
          type: data.tipo,
          citta: data.citta,
          regione: data.regione,
          provincia: data.provincia,
          responsabile: data.responsabile,
          telefono: data.tel || "",
          cellulare: data.cel || "",
          email: data.email,
          pec: data.pec,
        };
      });
      setSediList(allSedi);

      // Organizza segreterie per regione/provincia
      const segreterie = querySnapshot.docs
        .filter((doc) => {
          const data = doc.data();
          return data.tipo?.includes("Ufficio");
        })
        .reduce((acc, doc) => {
          const data = doc.data();
          if (!data.regione || !data.provincia) return acc;

          if (!acc[data.regione]) acc[data.regione] = {};
          if (!acc[data.regione][data.provincia])
            acc[data.regione][data.provincia] = [];

          acc[data.regione][data.provincia].push({
            nome: data.tipo + " " + data.citta,
            indirizzo: data.indirizzo,
            telefono: data.tel || "",
            cellulare: data.cel || "",
            email: data.email,
            pec: data.pec,
            responsabile: data.responsabile,
          });
          return acc;
        }, {});
      setSegreterieSedi(segreterie);

      // Organizza centri per regione/provincia
      const centri = querySnapshot.docs
        .filter((doc) => {
          const data = doc.data();
          return data.tipo === "Centro Snalv";
        })
        .reduce((acc, doc) => {
          const data = doc.data();
          if (!data.regione || !data.provincia) return acc;

          if (!acc[data.regione]) acc[data.regione] = {};
          if (!acc[data.regione][data.provincia])
            acc[data.regione][data.provincia] = [];

          acc[data.regione][data.provincia].push({
            nome: data.tipo + " " + data.citta,
            indirizzo: data.indirizzo,
            telefono: data.tel || "",
            cellulare: data.cel || "",
            email: data.email,
            pec: data.pec,
            responsabile: data.responsabile,
            servizi: data.servizi || [],
          });
          return acc;
        }, {});
      setCentriSedi(centri);
    } catch (error) {
      console.error("Error fetching sedi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setActiveSection(hash);
    }
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase().trim();

    let results = sediList.filter(
      (sede) =>
        // Aggiungiamo controlli di nullità per ogni campo
        sede?.citta?.toLowerCase()?.includes(searchTermLower) ||
        false ||
        sede?.regione?.toLowerCase()?.includes(searchTermLower) ||
        false ||
        sede?.provincia?.toLowerCase()?.includes(searchTermLower) ||
        false
    );

    setSearchResults(results);

    if (results.length > 0) {
      setMapCenter(results[0].position);
      setMapZoom(12);
    }
  };

  const handleReset = () => {
    setSearchTerm("");
    setSearchResults([]);
    setMapCenter([41.9028, 12.4964]);
    setMapZoom(6);
  };

  const openInGoogleMaps = (position: number[]) => {
    window.open(
      `https://www.google.com/maps?q=${position[0]},${position[1]}`,
      "_blank"
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case "cerca-sede":
        return (
          <div className="space-y-8">
            <h1 className="text-[#1a365d] text-4xl font-bold mb-6">
              CERCA UNA SEDE
            </h1>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4 text-blue-600">
                  Lo Snalv Confsal è presente in:
                </h2>
                <ul className="list-disc pl-5 space-y-2 ">
                  <li className="text-blue-600">20 Regioni</li>
                  <li className="text-blue-600">90 Province</li>
                  <li className="text-blue-600">100 Comuni Italiani</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4 text-blue-600">
                  Le strutture si dividono in:
                </h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li className="text-blue-600">20 Segreterie regionali</li>
                  <li className="text-blue-600">90 Segreterie provinciali</li>
                  <li className="text-blue-600">20 Centri Snalv</li>
                </ul>
              </div>

              <div className="space-y-4">
                <p className="font-medium">
                  Trova la sede sindacale più vicina casa tua:
                </p>
                <div className="flex gap-4 max-w-md">
                  <Input
                    type="text"
                    placeholder="Cerca per città, provincia o regione"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      // Ricerca automatica mentre l'utente scrive
                      if (e.target.value.length >= 2) {
                        handleSearch();
                      } else {
                        setSearchResults([]);
                      }
                    }}
                    className="flex-1"
                  />
                  {searchResults.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={handleReset}
                      className="border-red-500 text-red-500 hover:bg-red-50"
                    >
                      Reset
                    </Button>
                  )}
                </div>

                {searchResults.length > 0 && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-bold mb-2">
                      Sedi trovate: {searchResults.length}
                    </h3>
                    <ul className="space-y-4">
                      {searchResults.map((sede: any, index: number) => (
                        <li
                          key={index}
                          className="flex flex-col sm:flex-row sm:justify-between gap-4 p-4 hover:bg-gray-100 rounded-lg border border-gray-200"
                        >
                          <div className="space-y-2">
                            <div>
                              <p className="font-medium text-lg">{sede.name}</p>
                              <p className="text-gray-600">
                                {sede.responsabile}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-800">
                                {sede.address} {sede.cap && `- ${sede.cap}`}
                              </p>
                              <p className="text-sm text-gray-600">
                                {sede.citta} ({sede.provincia}), {sede.regione}
                              </p>
                            </div>
                            <div className="text-sm space-y-1">
                              {sede.telefono && <p>Tel: {sede.telefono}</p>}
                              {sede.cellulare && <p>Cell: {sede.cellulare}</p>}
                              {sede.email && <p>Email: {sede.email}</p>}
                              {sede.pec && <p>PEC: {sede.pec}</p>}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openInGoogleMaps(sede.position)}
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                            >
                              <MapPin className="h-4 w-4" />
                              Apri in Google Maps
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {activeSection === "cerca-sede" && (
                <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-md">
                  <MapComponent
                    center={mapCenter}
                    zoom={mapZoom}
                    locations={
                      searchResults.length > 0 ? searchResults : sediList
                    }
                  />
                </div>
              )}

              <div className="space-y-2 mt-8">
                <Link
                  className="text-blue-600 hover:text-blue-800"
                  href="/segreterie-sindacali"
                >
                  Elenco completo Segreterie Sindacali
                </Link>
                <div className="h-2" />
                <Link
                  className="text-blue-600 hover:text-blue-800"
                  href="/centri-snalv"
                >
                  Elenco completo Centri Snalv
                </Link>
              </div>
            </div>

            <div className="mt-16">
              <h2 className="text-xl font-bold mb-6">
                NOTIZIE E COMUNICATI STAMPA DEL TERRITORIO
              </h2>
              <NewsComponent categories={["Territorio"]} />
            </div>
          </div>
        );

      case "collabora":
        return (
          <div className="space-y-12">
            <h1 className="text-[#1a365d] text-4xl font-bold mb-6 md:text-5xl">
              COLLABORA CON NOI
            </h1>

            <div className="text-left max-w-3xl mx-auto space-y-6">
              <h2 className="text-xl font-bold text-blue-600 md:text-2xl">
                Impegnati nel Sindacato e fornisci un supporto di qualità ai
                lavoratori del tuo territorio!
              </h2>
              <p className="text-blue-600">
                Il mondo del lavoro è in continua evoluzione e la nostra
                Organizzazione mira a sviluppare un Sindacato diverso,
                competente, adeguato alle esigenze attuali.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="max-w-3xl mx-auto space-y-6">
                <p className="text-blue-600">
                  La Segreteria Nazionale è a tua disposizione per aprire una
                  sede sindacale sul territorio: ti garantiamo un&apos;adeguata
                  formazione, il massimo supporto operativo e l&apos;assistenza
                  necessaria per fare i primi passi.
                </p>
                <p className="text-blue-600">
                  Inoltre, grazie alle collaborazioni di cui si avvale lo SNALV
                  CONFSAL, potrai erogare ai lavoratori, ai pensionati, ai
                  giovani ed ai disoccupati tutti i servizi di utilità sociale
                  di cui hanno bisogno:
                  <Button
                    variant="link"
                    className="text-red-500 hover:text-red-600 ml-1"
                    onClick={() => (window.location.href = "/chi-siamo#tutele")}
                  >
                    consulta qui l&apos;elenco completo
                  </Button>
                </p>
              </div>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="bg-white p-10 rounded-xl shadow-lg border border-gray-100">
                <h3 className="text-2xl font-bold text-white mb-8 md:text-3xl bg-blue-600 p-2 rounded-md text-center">
                  Compila il form per essere ricontattato
                </h3>
                <form className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      {/* Name input */}
                      <div className="relative">
                        <input
                          type="text"
                          className="peer w-full border-b-2 border-gray-300 px-0 py-2 
                  placeholder:text-transparent focus:border-red-500 focus:outline-none"
                          placeholder="Nome"
                          required
                        />
                        <label
                          className="pointer-events-none absolute left-0 -top-3.5 text-sm 
                  text-gray-600 transition-all peer-placeholder-shown:top-2 
                  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
                  peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-red-500"
                        >
                          Nome
                        </label>
                      </div>
                      {/* Surname input */}
                      <div className="relative">
                        <input
                          type="text"
                          className="peer w-full border-b-2 border-gray-300 px-0 py-2 
                  placeholder:text-transparent focus:border-red-500 focus:outline-none"
                          placeholder="Cognome"
                          required
                        />
                        <label
                          className="pointer-events-none absolute left-0 -top-3.5 text-sm 
                  text-gray-600 transition-all peer-placeholder-shown:top-2 
                  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
                  peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-red-500"
                        >
                          Cognome
                        </label>
                      </div>
                      {/* Occupation input */}
                      <div className="relative">
                        <input
                          type="text"
                          className="peer w-full border-b-2 border-gray-300 px-0 py-2 
                  placeholder:text-transparent focus:border-red-500 focus:outline-none"
                          placeholder="Professione"
                          required
                        />
                        <label
                          className="pointer-events-none absolute left-0 -top-3.5 text-sm 
                  text-gray-600 transition-all peer-placeholder-shown:top-2 
                  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
                  peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-red-500"
                        >
                          Professione attuale
                        </label>
                      </div>
                    </div>
                    <div className="space-y-6">
                      {/* Address input */}
                      <div className="relative">
                        <input
                          type="text"
                          className="peer w-full border-b-2 border-gray-300 px-0 py-2 
                  placeholder:text-transparent focus:border-red-500 focus:outline-none"
                          placeholder="Domicilio"
                          required
                        />
                        <label
                          className="pointer-events-none absolute left-0 -top-3.5 text-sm 
                  text-gray-600 transition-all peer-placeholder-shown:top-2 
                  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
                  peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-red-500"
                        >
                          Luogo domicilio
                        </label>
                      </div>
                      {/* Phone input */}
                      <div className="relative">
                        <input
                          type="tel"
                          className="peer w-full border-b-2 border-gray-300 px-0 py-2 
                  placeholder:text-transparent focus:border-red-500 focus:outline-none"
                          placeholder="Cellulare"
                          required
                        />
                        <label
                          className="pointer-events-none absolute left-0 -top-3.5 text-sm 
                  text-gray-600 transition-all peer-placeholder-shown:top-2 
                  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
                  peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-red-500"
                        >
                          Cellulare
                        </label>
                      </div>
                      {/* Email input */}
                      <div className="relative">
                        <input
                          type="email"
                          className="peer w-full border-b-2 border-gray-300 px-0 py-2 
                  placeholder:text-transparent focus:border-red-500 focus:outline-none"
                          placeholder="Email"
                          required
                        />
                        <label
                          className="pointer-events-none absolute left-0 -top-3.5 text-sm 
                  text-gray-600 transition-all peer-placeholder-shown:top-2 
                  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
                  peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-red-500"
                        >
                          Email
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center mt-10">
                    <Button
                      type="submit"
                      className="bg-red-500 hover:bg-red-600 text-white px-12 py-3 rounded-full 
              text-lg font-medium transition-all hover:shadow-lg"
                    >
                      Invia richiesta
                    </Button>
                  </div>
                </form>
              </div>
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
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="lg:grid lg:grid-cols-4 gap-8">
          <div>
            <div className="bg-gray-100 p-4 rounded-lg">
              {[
                { id: "cerca-sede", label: "Cerca una sede" },
                { id: "collabora", label: "Collabora con noi" },
              ].map((item, index) => (
                <div
                  key={item.id}
                  className={`py-2 ${
                    index === 0
                      ? "border-b-2 border-red-500"
                      : "border-b-2 border-red-500"
                  }`}
                >
                  <Button
                    variant="ghost"
                    className={`w-full hover:font-bold justify-start text-left uppercase ${
                      activeSection === item.id
                        ? "text-red-500 font-bold"
                        : "text-gray-700"
                    }`}
                    onClick={() => {
                      setActiveSection(item.id);
                      window.history.pushState(null, "", `#${item.id}`);
                    }}
                  >
                    {item.label}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-3 mt-6 md:mt-0">{renderContent()}</div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TerritorioPage;
