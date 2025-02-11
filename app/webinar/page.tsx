"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Calendar,
  Clock,
  ChevronLeft,
  Download,
  Play,
  Eye,
  Search,
  BookOpen,
} from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import PDFViewer from "@/src/components/PDFViewer";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const WebinarViewer = () => {
  const [webinars, setWebinars] = useState([]);
  const [selectedWebinar, setSelectedWebinar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [save, setSave] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    fetchWebinars();
  }, []);

  const fetchWebinars = async () => {
    try {
      const webinarQuery = query(
        collection(db, "webinars"),
        orderBy("date", "desc")
      );
      const querySnapshot = await getDocs(webinarQuery);
      const webinarData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
      }));
      setWebinars(webinarData);
    } catch (error) {
      console.error("Error fetching webinars:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredWebinars = webinars.filter((webinar) =>
    webinar.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date) => {
    if (!date) return "";
    return format(date, "d MMMM yyyy", { locale: it });
  };

  const formatTime = (date) => {
    if (!date) return "";
    return format(date, "HH:mm", { locale: it });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento webinar...</p>
        </div>
      </div>
    );
  }

  if (selectedWebinar) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <nav className="mb-8 flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedWebinar(null);
                setSelectedPDF(null);
              }}
              className="hover:bg-white/50 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Torna alla lista
            </Button>
            <div className="h-6 w-px bg-gray-200"></div>
            <div className="flex items-center gap-4 text-gray-600 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(selectedWebinar.date)}
              </div>
              <div className="h-4 w-px bg-gray-200"></div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatTime(selectedWebinar.date)}
              </div>
            </div>
          </nav>

          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {selectedWebinar.title}
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {selectedWebinar.video?.url ? (
                <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl ring-1 ring-black/5">
                  <div className="aspect-video">
                    <video
                      controls
                      className="absolute inset-0 w-full h-full object-cover"
                      src={selectedWebinar.video.url}
                      poster={selectedWebinar.video.thumbnail}
                    >
                      Il tuo browser non supporta il tag video.
                    </video>
                  </div>
                </div>
              ) : (
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center ring-1 ring-black/5">
                  <div className="text-center text-gray-500 p-6">
                    <Play className="h-20 w-20 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg">Nessuna registrazione disponibile</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Questo webinar non include una registrazione video
                    </p>
                  </div>
                </div>
              )}

              <div className="prose max-w-none">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Descrizione del webinar
                </h3>
                <div className="bg-white rounded-xl p-6 shadow-sm ring-1 ring-black/5">
                  <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                    {selectedWebinar.description ||
                      "Nessuna descrizione disponibile"}
                  </p>
                </div>
              </div>

              {selectedPDF && (
                <PDFViewer url={selectedPDF.url} title={selectedPDF.title} />
              )}
            </div>

            <div className="lg:col-span-1">
              <Card className="bg-white shadow-xl rounded-2xl border-0 overflow-hidden sticky top-8">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Materiali didattici
                  </h3>
                  <p className="text-blue-100 mt-1">
                    {selectedWebinar.pdfs?.length > 0
                      ? "Accedi ai contenuti del corso"
                      : "Nessun materiale disponibile"}
                  </p>
                </div>
                <CardContent className="p-6">
                  <ScrollArea className="h-[calc(100vh-400px)]">
                    <div className="space-y-4">
                      {selectedWebinar.pdfs?.length > 0 ? (
                        selectedWebinar.pdfs.map((pdf, index) => (
                          <div
                            key={index}
                            className="group relative bg-white rounded-xl border cursor-pointer border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200"
                            onClick={() => setSelectedPDF(pdf)}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                            <div className="relative p-4">
                              <div className="flex items-start gap-4">
                                <div className="bg-red-50 p-2 rounded-lg">
                                  <FileText className="h-6 w-6 text-red-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-gray-900 truncate">
                                    {pdf.title || pdf.filename}
                                  </h4>
                                  <p className="text-sm text-gray-500 truncate">
                                    {pdf.filename}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedPDF(pdf)}
                                    className={`text-blue-600 hover:text-blue-700 hover:bg-blue-50 ${
                                      selectedPDF?.url === pdf.url
                                        ? "bg-blue-50"
                                        : ""
                                    }`}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <a
                                    href={pdf.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 px-4">
                          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <p className="text-gray-600 font-medium">
                            Nessun materiale disponibile
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Non sono presenti materiali didattici per questo
                            webinar
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
              Webinar & guide operative
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Esplora i nostri webinar formativi e accedi a contenuti esclusivi
              e materiali didattici.
            </p>
          </div>

          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Cerca webinar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 backdrop-blur-sm border-gray-200 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWebinars.map((webinar) => (
              <Card
                key={webinar.id}
                className="group relative h-full bg-white/50 backdrop-blur-sm hover:bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer transform hover:-translate-y-1"
                onClick={() => setSelectedWebinar(webinar)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-6 relative">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1 bg-gray-100/80 rounded-full px-3 py-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(webinar.date)}
                      </div>
                      <div className="flex items-center gap-1 bg-gray-100/80 rounded-full px-3 py-1">
                        <Clock className="h-4 w-4" />
                        {formatTime(webinar.date)}
                      </div>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {webinar.title}
                    </h2>

                    <p className="text-gray-600 line-clamp-3 mb-4 flex-grow">
                      {webinar.description || "Nessuna descrizione disponibile"}
                    </p>

                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      {webinar.video?.url && (
                        <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full">
                          <Play className="h-4 w-4" />
                          <span className="text-xs font-medium">Video</span>
                        </div>
                      )}
                      {webinar.pdfs?.length > 0 && (
                        <div className="flex items-center gap-1 bg-red-50 text-red-700 px-3 py-1.5 rounded-full">
                          <FileText className="h-4 w-4" />
                          <span className="text-xs font-medium">
                            {webinar.pdfs.length} PDF
                          </span>
                        </div>
                      )}
                      {!webinar.video?.url && !webinar.pdfs?.length && (
                        <div className="flex items-center gap-1 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full">
                          <FileText className="h-4 w-4" />
                          <span className="text-xs font-medium">
                            Solo descrizione
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredWebinars.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nessun webinar trovato
                </h3>
                <p className="text-gray-600">
                  Prova a modificare i criteri di ricerca
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default WebinarViewer;
