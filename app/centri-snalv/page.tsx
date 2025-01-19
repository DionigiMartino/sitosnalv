"use client";

import { useState, useEffect, useMemo } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { MapPin } from "lucide-react";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import HeroSection from "@/src/components/Hero";

// Dati statici per regioni e province
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
  Abruzzo: ["L'Aquila", "Chieti", "Pescara", "Teramo"],
  Basilicata: ["Potenza", "Matera"],
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

export default function CentriSnalv() {
  const [selectedRegione, setSelectedRegione] = useState("");
  const [selectedProvincia, setSelectedProvincia] = useState("");
  const [isRegioneOpen, setIsRegioneOpen] = useState(false);
  const [isProvinciaOpen, setIsProvinciaOpen] = useState(false);
  const [sediList, setSediList] = useState<any[]>([]);

  console.log("Centri snalv", sediList);

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
    <>
      <Header />
      <HeroSection section="territorio" />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <h1 className="text-[#1a365d] text-4xl font-bold mb-6 md:text-5xl">
            CENTRI SNALV
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <p className="text-gray-700 mb-6">
                I Centri Snalv agiscono in raccordo con le Segreterie Sindacali
                e garantiscono un supporto individuale ai lavoratori associati,
                mediante l&apos;assistenza sindacale, previdenziale e fiscale.
              </p>
            </div>

            <div className="space-y-4">
              <span>Elenco Centri Snalv (In Aggiornamento)</span>

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
                              {centro.servizi.map(
                                (servizio: string, i: number) => (
                                  <span
                                    key={i}
                                    className="px-2 py-1 bg-red-50 text-red-600 rounded-full text-sm"
                                  >
                                    {servizio}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}
                        {centro.coordinate && (
                          <button
                            onClick={() =>
                              window.open(
                                `https://www.google.com/maps?q=${centro.coordinate.lat},${centro.coordinate.lng}`,
                                "_blank"
                              )
                            }
                            className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2 text-sm transition-colors"
                          >
                            <MapPin className="h-4 w-4" />
                            Apri in Google Maps
                          </button>
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
      </main>
      <Footer />
    </>
  );
}
