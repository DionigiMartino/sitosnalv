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

export default function TerritorioPage() {
  const [selectedRegione, setSelectedRegione] = useState("");
  const [selectedProvincia, setSelectedProvincia] = useState("");
  const [isRegioneOpen, setIsRegioneOpen] = useState(false);
  const [isProvinciaOpen, setIsProvinciaOpen] = useState(false);
  const [sediList, setSediList] = useState<any[]>([]);

  useEffect(() => {
    const fetchSedi = async () => {
      try {
        const sediQuery = query(
          collection(db, "sedi"),
          where("tipo", "in", ["Ufficio Provinciale", "Ufficio Regionale"])
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
      const matchRegione = !selectedRegione || sede.regione === selectedRegione;
      const matchProvincia =
        !selectedProvincia || sede.provincia === selectedProvincia;
      return matchRegione && matchProvincia;
    });
  }, [sediList, selectedRegione, selectedProvincia]);

  return (
    <>
      <Header />
      <HeroSection section="territorio" />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <h1 className="text-[#1a365d] text-4xl font-bold mb-6 md:text-5xl">
            SEGRETERIE SINDACALI
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <p className="text-gray-700 mb-6">
                Le Segreterie Sindacali Snalv Confsal rappresentano la voce
                dell&apos;Organizzazione nel territorio di riferimento. In
                particolare, le Segreterie provinciali e locali si confrontano
                con singoli rappresentanti sindacali nelle procedure sindacali
                collettive, le Segreterie regionali svolgono, invece, funzioni
                di raccordo e garantiscono l&apos;unitarietà e il coordinamento
                dell&apos;attività sindacale sul territorio.
              </p>
              <p className="text-gray-700">
                Tutte le Segreterie garantiscono agli iscritti un supporto
                sindacale, previdenziale e fiscale.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <span>Elenco Segreterie Sindacali (In Aggiornamento)</span>

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
                    className={`w-full flex justify-between items-center p-3 border rounded-lg text-[#1a365d] hover:bg-blue-600 hover:text-white ${
                      isProvinciaOpen ? "bg-blue-600 text-white" : "bg-white"
                    }`}
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
                        {sede.tipo.includes("Ufficio Regionale")
                          ? "Segreteria Regionale"
                          : "Segreteria Provinciale"}{" "}
                        {sede.tipo.includes("Ufficio Regionale")
                          ? sede.regione
                          : sede.provincia}
                      </h3>
                      <div className="space-y-1 text-gray-600">
                        <p>📍 {sede.indirizzo}</p>
                        {sede.tel && <p>📞 {sede.tel}</p>}
                        {sede.cel && <p>📱 {sede.cel}</p>}
                        <p>✉️ {sede.email}</p>
                        {sede.pec && <p>📧 PEC: {sede.pec}</p>}
                        <p>👤 Responsabile: {sede.responsabile}</p>
                        {sede.coordinate && (
                          <button
                            onClick={() =>
                              window.open(
                                `https://www.google.com/maps?q=${sede.coordinate.lat},${sede.coordinate.lng}`,
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
                  Nessuna segreteria trovata in questa zona.
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
