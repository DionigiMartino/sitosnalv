"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import NewsComponent from "@/src/components/CategoryNews";
import "leaflet/dist/leaflet.css";
import { FiChevronLeft } from "react-icons/fi";

// Database delle regioni e province
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

const province = {
  Campania: ["Avellino", "Benevento", "Caserta", "Napoli", "Salerno"],
  Lazio: ["Frosinone", "Latina", "Rieti", "Roma", "Viterbo"],
  Lombardia: [
    "Bergamo",
    "Brescia",
    "Como",
    "Cremona",
    "Lecco",
    "Lodi",
    "Milano",
    "Monza",
    "Pavia",
    "Varese",
  ],
  // Aggiungi altre province per le regioni restanti
};

// Database delle sedi
const sediList = [
  {
    name: "Sede Roma Centro",
    address: "Via di Porta Maggiore, 9",
    cap: "00185",
    position: [41.9028, 12.4964],
    type: "Segreteria nazionale",
  },
  {
    name: "Sede Milano",
    address: "Via Roma 111",
    cap: "20019",
    position: [45.4642, 9.19],
    type: "Segreteria regionale",
  },
  {
    name: "Sede Napoli",
    address: "Via Roma 41",
    cap: "80100",
    position: [40.8518, 14.2681],
    type: "Centro Snalv",
  },
];

const segreterieSedi = {
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

const centriSedi = {
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

// Componente Mappa
const MapComponent = ({ center, zoom, locations = sediList }) => {
  const customIcon = new Icon({
    iconUrl: "/img/marker.jpg",
    iconSize: [15, 20],
    iconAnchor: [12, 41],
  });

  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-md">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {locations.map((location, index) => (
          <Marker key={index} position={location.position} icon={customIcon}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">{location.name}</h3>
                <p>{location.address}</p>
                <p>CAP: {location.cap}</p>
                <p className="text-sm text-gray-600">{location.type}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

// Componente Segreterie Sindacali
const SegreterieSindacali = () => {
  const [selectedRegione, setSelectedRegione] = useState("");
  const [selectedProvincia, setSelectedProvincia] = useState("");
  const [isRegioneOpen, setIsRegioneOpen] = useState(false);
  const [isProvinciaOpen, setIsProvinciaOpen] = useState(false);

  return (
    <div className="space-y-8">
      <h1 className="text-[#1a365d] text-4xl font-bold mb-6">
        SEGRETERIE SINDACALI
      </h1>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <p className="text-gray-700 mb-6">
            Le Segreterie Sindacali Snalv Confsal rappresentano la voce
            dell'Organizzazione nel territorio di riferimento. In particolare,
            le Segreterie provinciali e locali si confrontano con singoli
            rappresentanti sindacali nelle procedure sindacali collettive, le
            Segreterie regionali svolgono, invece, funzioni di raccordo e
            garantiscono l'unitarietà e il coordinamento dell'attività sindacale
            sul territorio.
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
              className="w-full flex justify-between items-center p-3 bg-white border rounded-lg text-[#1a365d] hover:bg-gray-50"
            >
              <span>+ Scegli la regione</span>
              <span>{selectedRegione}</span>
            </button>
            {isRegioneOpen && (
              <div className="mt-2 p-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {regioni.map((regione) => (
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
                className="w-full flex justify-between items-center p-3 bg-white border rounded-lg text-[#1a365d] hover:bg-gray-50"
              >
                <span>+ Scegli la provincia</span>
                <span>{selectedProvincia}</span>
              </button>
              {isProvinciaOpen && (
                <div className="mt-2 p-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {province[selectedRegione]?.map((prov) => (
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
          <h2 className="text-xl font-bold text-[#1a365d] mb-4">
            Segreterie in {selectedProvincia} ({selectedRegione})
          </h2>
          {segreterieSedi[selectedRegione]?.[selectedProvincia] ? (
            <div className="space-y-4">
              {segreterieSedi[selectedRegione][selectedProvincia].map(
                (sede, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-sm"
                  >
                    <h3 className="font-bold text-lg mb-2">{sede.nome}</h3>
                    <div className="space-y-1 text-gray-600">
                      <p>📍 {sede.indirizzo}</p>
                      <p>📞 {sede.telefono}</p>
                      <p>✉️ {sede.email}</p>
                    </div>
                  </div>
                )
              )}
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

  return (
    <div className="space-y-8">
      <h1 className="text-[#1a365d] text-4xl font-bold mb-6">CENTRI SNALV</h1>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
          <p className="text-gray-700 mb-6">
            I Centri Snalv agiscono in raccordo con le Segreterie Sindacali e
            garantiscono un supporto individuale ai lavoratori associati,
            mediante l’assistenza sindacale, previdenziale e fiscale.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <button
              onClick={() => setIsRegioneOpen(!isRegioneOpen)}
              className="w-full flex justify-between items-center p-3 bg-white border rounded-lg text-[#1a365d] hover:bg-gray-50"
            >
              <span>+ Scegli la regione</span>
              <span>{selectedRegione}</span>
            </button>
            {isRegioneOpen && (
              <div className="mt-2 p-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {regioni.map((regione) => (
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
                className="w-full flex justify-between items-center p-3 bg-white border rounded-lg text-[#1a365d] hover:bg-gray-50"
              >
                <span>+ Scegli la provincia</span>
                <span>{selectedProvincia}</span>
              </button>
              {isProvinciaOpen && (
                <div className="mt-2 p-2 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {province[selectedRegione]?.map((prov) => (
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
          <h2 className="text-xl font-bold text-[#1a365d] mb-4">
            Centri in {selectedProvincia} ({selectedRegione})
          </h2>
          {centriSedi[selectedRegione]?.[selectedProvincia] ? (
            <div className="space-y-4">
              {centriSedi[selectedRegione][selectedProvincia].map(
                (centro, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg shadow-sm"
                  >
                    <h3 className="font-bold text-lg mb-2">{centro.nome}</h3>
                    <div className="space-y-1 text-gray-600">
                      <p>📍 {centro.indirizzo}</p>
                      <p>📞 {centro.telefono}</p>
                      <p>✉️ {centro.email}</p>
                      <div className="mt-2">
                        <p className="font-medium text-sm text-gray-500">
                          Servizi disponibili:
                        </p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {centro.servizi.map((servizio, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-red-50 text-red-600 rounded-full text-sm"
                            >
                              {servizio}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )}
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
  const [searchResults, setSearchResults] = useState([]);
  const [mapCenter, setMapCenter] = useState([41.9028, 12.4964]);
  const [mapZoom, setMapZoom] = useState(6);

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
                <h2 className="text-xl font-bold mb-4">
                  Lo Snalv Confsal è presente in:
                </h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>20 Regioni</li>
                  <li>90 Province</li>
                  <li>100 Comuni Italiani</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">
                  Le strutture si dividono in:
                </h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>20 Segreterie regionali</li>
                  <li>90 Segreterie provinciali</li>
                  <li>20 Centri Snalv</li>
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
                      {searchResults.map((sede, index) => (
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

              <MapComponent
                center={mapCenter}
                zoom={mapZoom}
                locations={searchResults.length > 0 ? searchResults : sediList}
              />

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
              <NewsComponent category="territorio" />
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
            <h1 className="text-[#1a365d] text-4xl font-bold mb-6">
              COLLABORA CON NOI
            </h1>

            <div className="text-center max-w-3xl mx-auto space-y-6">
              <h2 className="text-xl font-bold text-gray-800">
                Impegnati nel Sindacato e fornisci un supporto di qualità ai
                lavoratori del tuo territorio!
              </h2>
              <p className="text-gray-600">
                Il mondo del lavoro è in continua evoluzione e la nostra
                Organizzazione mira a sviluppare un Sindacato diverso,
                competente, adeguato alle esigenze attuali.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="max-w-3xl mx-auto space-y-6">
                <p className="text-gray-700">
                  La Segreteria Nazionale è a tua disposizione per aprire una
                  sede sindacale sul territorio: ti garantiamo un'adeguata
                  formazione, il massimo supporto operativo e l'assistenza
                  necessaria per fare i primi passi.
                </p>

                <p className="text-gray-700">
                  Inoltre, grazie alle collaborazioni di cui si avvale lo SNALV
                  CONFSAL, potrai erogare ai lavoratori, ai pensionati, ai
                  giovani ed ai disoccupati tutti i servizi di utilità sociale
                  di cui hanno bisogno:
                  <Button
                    variant="link"
                    className="text-red-500 hover:text-red-600 ml-1"
                    onClick={() => (window.location.href = "/chi-siamo#tutele")}
                  >
                    consulta qui l'elenco completo
                  </Button>
                </p>
              </div>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <span>Compila il form per essere ricontattato:</span>
                </h3>

                <form className="space-y-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome:
                      </label>
                      <Input className="w-full" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cognome:
                      </label>
                      <Input className="w-full" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Professione attuale:
                      </label>
                      <Input className="w-full" />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Luogo domicilio:
                      </label>
                      <Input className="w-full" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cel:
                      </label>
                      <Input className="w-full" type="tel" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mail:
                      </label>
                      <Input className="w-full" type="email" />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button className="bg-red-500 hover:bg-red-600 text-white px-8">
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
                      ? "border-t-2 border-red-500"
                      : "border-t border-gray-300"
                  }`}
                >
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-left ${
                      activeSection === item.id
                        ? "text-red-500"
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

          <div className="col-span-3">{renderContent()}</div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TerritorioPage;
