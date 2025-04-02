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
          name: data.tipo + " " + data.regione, // es: "Ufficio Provinciale Pisa"
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
            nome: data.tipo + " " + data.regione,
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
            nome: data.tipo + " " + data.regione,
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

  const transformName = (name) => {
    if (name.includes("Ufficio Provinciale")) {
      return name.replace("Ufficio Provinciale", "Segreteria Provinciale");
    }
    if (name.includes("Ufficio Regionale")) {
      return name.replace("Ufficio Regionale", "Segreteria Regionale");
    }
    return name;
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
                  <li className="text-blue-600">18 Regioni</li>
                  <li className="text-blue-600">63 Province</li>
                  <li className="text-blue-600">200 Comuni Italiani</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4 text-blue-600">
                  Le strutture si dividono in:
                </h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li className="text-blue-600">18 Segreterie regionali</li>
                  <li className="text-blue-600">58 Segreterie provinciali</li>
                  <li className="text-blue-600">190 Centri Snalv</li>
                </ul>
              </div>

              <div className="space-y-4">
                <p className="font-medium text-gray-700">
                  Trova la sede sindacale più vicina casa tua (in
                  aggiornamento):
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
                      {[...searchResults]
                        .sort((a, b) => {
                          const aIsCentro =
                            a.name?.toLowerCase()?.includes("centro snalv") ||
                            false;
                          const bIsCentro =
                            b.name?.toLowerCase()?.includes("centro snalv") ||
                            false;
                          if (aIsCentro && !bIsCentro) return 1; // Se a è un Centro e b no, a va dopo
                          if (!aIsCentro && bIsCentro) return -1; // Se b è un Centro e a no, a va prima
                          return 0;
                        })
                        .map((sede, index) => (
                          <li
                            key={index}
                            className="flex flex-col sm:flex-row sm:justify-between gap-4 p-4 hover:bg-gray-100 rounded-lg border border-gray-200"
                          >
                            <div className="space-y-2">
                              <div>
                                <p className="font-medium text-lg">
                                  {transformName(sede.name)}
                                </p>
                                <p className="text-gray-600">
                                  {sede.responsabile}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-800">
                                  {sede.address} {sede.cap && `- ${sede.cap}`}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {sede.citta} ({sede.provincia}),{" "}
                                  {sede.regione}
                                </p>
                              </div>
                              <div className="text-sm space-y-1">
                                {sede.telefono && <p>Tel: {sede.telefono}</p>}
                                {sede.cellulare && (
                                  <p>Cell: {sede.cellulare}</p>
                                )}
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
                    center={mapCenter as [number, number]}
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
                  Elenco completo Segreterie Sindacali (Elenco in Aggiornamento)
                </Link>
                <div className="h-2" />
                <Link
                  className="text-blue-600 hover:text-blue-800"
                  href="/centri-snalv"
                >
                  Elenco completo Centri Snalv (Elenco in Aggiornamento)
                </Link>
              </div>
            </div>

            <div className="mt-16">
              <h2 className="text-xl font-bold mb-6 text-blue-600">
                NOTIZIE E COMUNICATI STAMPA DEL TERRITORIO
              </h2>
              <NewsComponent categories={["Territorio"]} />
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
              {/* Cerca una sede - Button */}
              <div className="py-2 border-b-2 border-red-500">
                <Button
                  variant="ghost"
                  className={`w-full hover:font-bold justify-start text-left uppercase ${
                    activeSection === "cerca-sede"
                      ? "text-red-500 font-bold"
                      : "text-gray-700"
                  }`}
                  onClick={() => {
                    setActiveSection("cerca-sede");
                    window.history.pushState(null, "", "#cerca-sede");
                  }}
                >
                  Cerca una sede
                </Button>
              </div>

              <div className="py-2 border-b-2 border-red-500">
                <Link
                  href="/segreterie-sindacali"
                  className={`block text-sm w-full px-4 py-2 text-left uppercase hover:font-bold ${
                    activeSection === "collabora"
                      ? "text-red-500 font-bold"
                      : "text-gray-700"
                  }`}
                >
                  Le Segreterie Sindacali
                </Link>
              </div>

              <div className="py-2 border-b-2 border-red-500">
                <Link
                  href="/centri-snalv"
                  className={`block text-sm w-full px-4 py-2 text-left uppercase hover:font-bold ${
                    activeSection === "collabora"
                      ? "text-red-500 font-bold"
                      : "text-gray-700"
                  }`}
                >
                  I Centri Snalv
                </Link>
              </div>

              {/* Collabora con noi - Link */}
              <div className="py-2 border-b-2 border-red-500">
                <Link
                  href="/collabora"
                  className={`block text-sm w-full px-4 py-2 text-left uppercase hover:font-bold ${
                    activeSection === "collabora"
                      ? "text-red-500 font-bold"
                      : "text-gray-700"
                  }`}
                >
                  Collabora con noi
                </Link>
              </div>
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
