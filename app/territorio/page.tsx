"use client";

import { useState, useEffect, useMemo} from "react";
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

// Componente Segreterie Sindacali
const SegreterieSindacali = () => {
  const [selectedRegione, setSelectedRegione] = useState("");
  const [selectedProvincia, setSelectedProvincia] = useState("");
  const [isRegioneOpen, setIsRegioneOpen] = useState(false);
  const [isProvinciaOpen, setIsProvinciaOpen] = useState(false);
  const [sediList, setSediList] = useState<any[]>([]);

  // Usiamo gli stessi array di regioni e province del componente CentriSnalv

  useEffect(() => {
    const fetchSedi = async () => {
      try {
        const sediQuery = query(
          collection(db, "sedi"),
          where("tipo", "==", "Ufficio Provinciale")
          // si può anche usare 'in' se ci sono più tipi di uffici:
          // where("tipo", "in", ["Ufficio Provinciale", "Ufficio Regionale"])
        );
        const querySnapshot = await getDocs(sediQuery);
        const sedi = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSediList(sedi);
      } catch (error) {
        console.error("Error fetching sedi:", error);
      }
    };

    fetchSedi();
  }, []);

  const filteredSedi = useMemo(() => {
    if (!selectedRegione && !selectedProvincia) return [];

    return sediList.filter((sede) => {
      if (selectedRegione && sede.regione !== selectedRegione) return false;
      if (selectedProvincia && sede.provincia !== selectedProvincia)
        return false;
      return true;
    });
  }, [sediList, selectedRegione, selectedProvincia]);

  return (
    <div className="space-y-8">
      <h1 className="text-[#1a365d] text-4xl font-bold mb-6 md:text-5xl">
        SEGRETERIE SINDACALI
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <p className="text-gray-700 mb-6">
            Le Segreterie Sindacali Snalv Confsal rappresentano la voce
            dell&apos;Organizzazione nel territorio di riferimento. In
            particolare, le Segreterie provinciali e locali si confrontano con
            singoli rappresentanti sindacali nelle procedure sindacali
            collettive, le Segreterie regionali svolgono, invece, funzioni di
            raccordo e garantiscono l&apos;unitarietà e il coordinamento
            dell&apos;attività sindacale sul territorio.
          </p>
          <p className="text-gray-700">
            Tutte le Segreterie garantiscono agli iscritti un supporto
            sindacale, previdenziale e fiscale.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <button
              onClick={() => setIsRegioneOpen(!isRegioneOpen)}
              className={`w-full flex justify-between items-center p-3 border rounded-lg text-[#1a365d] hover:bg-blue-600 hover:text-white ${
                isRegioneOpen ? "bg-blue-600 text-white" : "bg-white"
              }`}
            >
              <span>+ Scegli la regione</span>
              <span>{selectedRegione}</span>
            </button>
            {isRegioneOpen && (
              <div className="mt-2 p-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {regioni.map((regione: any) => (
                  <button
                    key={regione}
                    onClick={() => {
                      setSelectedRegione(regione);
                      setSelectedProvincia("");
                      setIsRegioneOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                  >
                    {regione}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedRegione && (
            <div>
              <button
                onClick={() => setIsProvinciaOpen(!isProvinciaOpen)}
                className={`w-full flex justify-between items-center p-3 border rounded-lg text-[#1a365d] hover:bg-blue-600 hover:text-white ${
                  isProvinciaOpen ? "bg-blue-600 text-white" : "bg-white"
                }`}
              >
                <span>+ Scegli la provincia</span>
                <span>{selectedProvincia}</span>
              </button>
              {isProvinciaOpen && (
                <div className="mt-2 p-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {province[selectedRegione]?.map((prov: any) => (
                    <button
                      key={prov}
                      onClick={() => {
                        setSelectedProvincia(prov);
                        setIsProvinciaOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                    >
                      {prov}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedProvincia && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-bold text-[#1a365d] mb-4 md:text-2xl">
            Segreterie in {selectedProvincia} ({selectedRegione})
          </h2>
          {filteredSedi.length > 0 ? (
            <div className="space-y-4 md:grid md:grid-cols-2 md:gap-6">
              {filteredSedi.map((sede) => (
                <div
                  key={sede.id}
                  className="bg-white p-4 rounded-lg shadow-sm"
                >
                  <h3 className="font-bold text-lg mb-2">
                    {sede.tipo} {sede.citta}
                  </h3>
                  <div className="space-y-1 text-gray-600">
                    <p>📍 {sede.indirizzo}</p>
                    {sede.tel && <p>📞 {sede.tel}</p>}
                    {sede.cel && <p>📱 {sede.cel}</p>}
                    <p>✉️ {sede.email}</p>
                    {sede.pec && <p>📧 PEC: {sede.pec}</p>}
                    <p>👤 Responsabile: {sede.responsabile}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">
              Nessuna segreteria trovata in questa zona.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// Componente Centri Snalv
const CentriSnalv = () => {
  const [selectedRegione, setSelectedRegione] = useState("");
  const [selectedProvincia, setSelectedProvincia] = useState("");
  const [isRegioneOpen, setIsRegioneOpen] = useState(false);
  const [isProvinciaOpen, setIsProvinciaOpen] = useState(false);
  const [sediList, setSediList] = useState<any[]>([]);

  console.log("Centri snalv", sediList)

  

  useEffect(() => {
    const fetchSedi = async () => {
      try {
        // Prima facciamo un log di tutte le sedi per vedere i loro tipi
        const allSediQuery = query(collection(db, "sedi"));
        const snapshot = await getDocs(allSediQuery);
        console.log(
          "Tutti i tipi di sedi:",
          snapshot.docs.map((doc) => doc.data().tipo)
        );

        // Poi modifichiamo la query per includere anche 'tipo' case-insensitive
        const sediQuery = query(
          collection(db, "sedi"),
          where("tipo", "in", ["Centro Snalv", "Centro SNALV", "centro snalv"]) // includiamo varianti
        );
        const querySnapshot = await getDocs(sediQuery);
        console.log(
          "Sedi filtrate:",
          querySnapshot.docs.map((doc) => doc.data())
        );

        const sedi = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSediList(sedi);
      } catch (error) {
        console.error("Error fetching sedi:", error);
      }
    };

    fetchSedi();
  }, []);

  const filteredSedi = useMemo(() => {
    if (!selectedRegione && !selectedProvincia) return [];

    return sediList.filter((sede) => {
      if (selectedRegione && sede.regione !== selectedRegione) return false;
      if (selectedProvincia && sede.provincia !== selectedProvincia)
        return false;
      return true;
    });
  }, [sediList, selectedRegione, selectedProvincia]);

  return (
    <div className="space-y-8">
      <h1 className="text-[#1a365d] text-4xl font-bold mb-6 md:text-5xl">
        CENTRI SNALV
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <p className="text-gray-700 mb-6">
            I Centri Snalv agiscono in raccordo con le Segreterie Sindacali e
            garantiscono un supporto individuale ai lavoratori associati,
            mediante l&apos;assistenza sindacale, previdenziale e fiscale.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <button
              onClick={() => setIsRegioneOpen(!isRegioneOpen)}
              className={`w-full flex justify-between items-center p-3 border rounded-lg text-[#1a365d] hover:bg-blue-600 hover:text-white ${
                isRegioneOpen ? "bg-blue-600 text-white" : "bg-white"
              }`}
            >
              <span>+ Scegli la regione</span>
              <span>{selectedRegione}</span>
            </button>
            {isRegioneOpen && (
              <div className="mt-2 p-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {regioni.map((regione: any) => (
                  <button
                    key={regione}
                    onClick={() => {
                      setSelectedRegione(regione);
                      setSelectedProvincia("");
                      setIsRegioneOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                  >
                    {regione}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedRegione && (
            <div>
              <button
                onClick={() => setIsProvinciaOpen(!isProvinciaOpen)}
                className={`w-full flex justify-between items-center p-3 border rounded-lg text-[#1a365d] hover:bg-blue-600 hover:text-white ${
                  isProvinciaOpen ? "bg-blue-600 text-white" : "bg-white"
                }`}
              >
                <span>+ Scegli la provincia</span>
                <span>{selectedProvincia}</span>
              </button>
              {isProvinciaOpen && (
                <div className="mt-2 p-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {province[selectedRegione]?.map((prov: any) => (
                    <button
                      key={prov}
                      onClick={() => {
                        setSelectedProvincia(prov);
                        setIsProvinciaOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded"
                    >
                      {prov}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedProvincia && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-bold text-[#1a365d] mb-4 md:text-2xl">
            Centri in {selectedProvincia} ({selectedRegione})
          </h2>
          {filteredSedi.length > 0 ? (
            <div className="space-y-4 md:grid md:grid-cols-2 md:gap-6">
              {filteredSedi.map((centro: any, index: number) => (
                <div
                  key={centro.id}
                  className="bg-white p-4 rounded-lg shadow-sm"
                >
                  <h3 className="font-bold text-lg mb-2">
                    {centro.tipo} {centro.citta}
                  </h3>
                  <div className="space-y-1 text-gray-600">
                    <p>📍 {centro.indirizzo}</p>
                    {centro.tel && <p>📞 {centro.tel}</p>}
                    {centro.cel && <p>📱 {centro.cel}</p>}
                    <p>✉️ {centro.email}</p>
                    {centro.pec && <p>📧 PEC: {centro.pec}</p>}
                    <p>👤 Responsabile: {centro.responsabile}</p>
                    {centro.servizi && centro.servizi.length > 0 && (
                      <div className="mt-2">
                        <p className="font-medium text-sm text-gray-500">
                          Servizi disponibili:
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {centro.servizi.map((servizio: string, i: number) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-red-50 text-red-600 rounded-full text-sm"
                            >
                              {servizio}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">
              Nessun centro trovato in questa zona.
            </p>
          )}
        </div>
      )}
    </div>
  );
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

  console.log("Sedi", sediList)

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
    if (searchTerm.length !== 5) {
      alert("Inserisci un CAP valido (5 cifre)");
      return;
    }

    let results = sediList.filter((sede) => sede.cap === searchTerm);

    if (results.length === 0) {
      const sortedSedi = [...sediList].sort((a, b) => {
        const distanceA = Math.abs(parseInt(a.cap) - parseInt(searchTerm));
        const distanceB = Math.abs(parseInt(b.cap) - parseInt(searchTerm));
        return distanceA - distanceB;
      });

      results = [sortedSedi[0]];
      alert(
        `Nessuna sede trovata per il CAP ${searchTerm}. Mostriamo la sede più vicina.`
      );
    }

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
                  Trova la sede sindacale più vicina casa tua, in base al CAP:
                </p>
                <div className="flex gap-4 max-w-md">
                  <Input
                    type="text"
                    placeholder="Inserisci il CAP"
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(
                        e.target.value.replace(/\D/g, "").slice(0, 5)
                      )
                    }
                    maxLength={5}
                    className="flex-1"
                  />
                  <Button
                    variant="default"
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={handleSearch}
                  >
                    Cerca
                  </Button>
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
                    <h3 className="font-bold mb-2">Sedi trovate:</h3>
                    <ul className="space-y-2">
                      {searchResults.map((sede: any, index: any) => (
                        <li
                          key={index}
                          className="flex justify-between items-center p-2 hover:bg-gray-100 rounded"
                        >
                          <div>
                            <p className="font-medium">{sede.name}</p>
                            <p className="text-sm text-gray-600">
                              {sede.address} - CAP: {sede.cap}
                            </p>
                            <p className="text-sm text-gray-500">{sede.type}</p>
                          </div>
                          <Button
                            variant="link"
                            className="text-red-500"
                            onClick={() => {
                              setMapCenter(sede.position);
                              setMapZoom(15);
                            }}
                          >
                            Visualizza sulla mappa →
                          </Button>
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
                <Button
                  variant="link"
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => setActiveSection("segreterie-list")}
                >
                  Elenco completo Segreterie Sindacali
                </Button>
                <div className="h-2" />
                <Button
                  variant="link"
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => setActiveSection("centri-list")}
                >
                  Elenco completo Centri Snalv
                </Button>
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

      case "segreterie-list":
        return (
          <div className="space-y-8">
            <Button
              variant="link"
              onClick={() => setActiveSection("cerca-sede")}
              className="text-red-500 mb-4 flex items-center gap-2"
            >
              <FiChevronLeft />
              Torna alla ricerca
            </Button>
            <SegreterieSindacali />
          </div>
        );

      case "centri-list":
        return (
          <div className="space-y-8">
            <Button
              variant="link"
              onClick={() => setActiveSection("cerca-sede")}
              className="text-red-500 mb-4 flex items-center gap-2"
            >
              <FiChevronLeft />
              Torna alla ricerca
            </Button>
            <CentriSnalv />
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
