"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Calendar,
  Clock,
  ChevronLeft,
  Download,
  Play,
  Eye,
  Search,
  Pause,
  RotateCcw,
  Rewind,
  MapPin,
  Info,
  X,
  Youtube,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import PDFViewer from "@/src/components/PDFViewer";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface EventVideo {
  id: string;
  title: string;
  description: string;
  youtubeUrl?: string;
  videoId?: string;
  url?: string; // per compatibilità con eventi esistenti
}

interface EventFile {
  id: string;
  title: string;
  filename: string;
  url: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: any;
  location: string;
  createdAt: any;
  updatedAt: any;
  videos: EventVideo[];
  files: EventFile[];
}

const EventViewer = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<EventVideo | null>(null);
  const [selectedPDF, setSelectedPDF] = useState<EventFile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const youtubePlayerRef = useRef<HTMLIFrameElement | null>(null);
  const [youtubeError, setYoutubeError] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const formatDate = (date: any): string => {
    if (!date) return "";
    if (date.toDate) {
      return format(date.toDate(), "d MMMM yyyy", { locale: it });
    }
    if (typeof date === "string") {
      return format(new Date(date), "d MMMM yyyy", { locale: it });
    }
    return format(date, "d MMMM yyyy", { locale: it });
  };

  // Funzione per generare l'URL di incorporamento di YouTube
  const getYoutubeEmbedUrl = (videoId: string) => {
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
  };

  // Funzione per controllare se un video è di YouTube o caricato direttamente
  const isYoutubeVideo = (video: EventVideo) => {
    return !!video.videoId;
  };

  // Funzione per generare la miniatura di YouTube
  const getYouTubeThumbnail = (videoId: string) => {
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      if (!session?.user?.email) return;

      try {
        const eventsQuery = query(
          collection(db, "events"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(eventsQuery);
        const eventsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Event[];
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast({
          title: "Errore",
          description: "Impossibile caricare gli eventi",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [session]);

  const handleVideoError = () => {
    setYoutubeError(true);
    toast({
      title: "Errore di caricamento",
      description: "Il video di YouTube non è disponibile o è privato",
      variant: "destructive",
    });
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Vista dettaglio evento
  if (selectedEvent) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <nav className="mb-8 flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedEvent(null);
                  setSelectedVideo(null);
                  setSelectedPDF(null);
                  setYoutubeError(false);
                }}
                className="hover:bg-white/50 transition-colors"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Torna alla lista
              </Button>
              <div className="h-6 w-px bg-gray-200"></div>
              <div className="flex items-center gap-4 text-gray-600 text-sm">
                {selectedEvent.date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(selectedEvent.date)}
                  </div>
                )}
                {selectedEvent.location && (
                  <>
                    <div className="h-4 w-px bg-gray-200"></div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {selectedEvent.location}
                    </div>
                  </>
                )}
                <div className="h-4 w-px bg-gray-200"></div>
                <div className="flex items-center gap-1">
                  <Youtube className="h-4 w-4" />
                  {selectedEvent.videos.length} video
                </div>
                {selectedEvent.files.length > 0 && (
                  <>
                    <div className="h-4 w-px bg-gray-200"></div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {selectedEvent.files.length} file
                    </div>
                  </>
                )}
              </div>
            </nav>

            <div className="flex items-center gap-1 mb-6">
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                {selectedEvent.title}
              </h1>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gray-100"
                    title="Informazioni sui controlli"
                  >
                    <Info className="h-5 w-5 text-gray-500" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-2xl bg-gradient-to-br from-white to-gray-50">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl font-bold text-blue-900 text-center pb-4 border-b">
                      Guida agli Eventi
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-6 pt-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Visualizzazione Video:
                          </h3>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>I video sono incorporati da YouTube</li>
                            <li>
                              Puoi utilizzare i controlli standard di YouTube
                              per la riproduzione
                            </li>
                            <li>
                              Alcuni video potrebbero essere privati e non
                              disponibili
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Navigazione:
                          </h3>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>
                              Puoi accedere a qualsiasi video dell'evento in
                              qualsiasi momento
                            </li>
                            <li>
                              I file allegati possono essere visualizzati o
                              scaricati
                            </li>
                          </ul>
                        </div>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="sm:justify-center">
                    <AlertDialogCancel className="bg-white hover:bg-gray-100 border-gray-200">
                      Chiudi
                    </AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {selectedVideo ? (
                  <>
                    <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl ring-1 ring-black/5">
                      <div className="relative aspect-video bg-black">
                        {isYoutubeVideo(selectedVideo) ? (
                          <>
                            {youtubeError ? (
                              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
                                <AlertTriangle className="h-12 w-12 text-amber-500 mb-2" />
                                <h3 className="text-lg font-medium text-gray-900">
                                  Impossibile caricare il video
                                </h3>
                                <p className="text-gray-600 max-w-md mx-auto mt-2">
                                  Il video potrebbe essere privato, rimosso o
                                  non disponibile.
                                </p>
                              </div>
                            ) : (
                              <iframe
                                ref={youtubePlayerRef}
                                src={getYoutubeEmbedUrl(selectedVideo.videoId)}
                                className="absolute inset-0 w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                onError={handleVideoError}
                              ></iframe>
                            )}
                          </>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
                            <AlertCircle className="h-12 w-12 text-gray-400 mb-2" />
                            <h3 className="text-lg font-medium text-gray-900">
                              Formato video non supportato
                            </h3>
                            <p className="text-gray-600 max-w-md mx-auto mt-2">
                              Questo video è in un formato obsoleto e non può
                              essere visualizzato.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="prose max-w-none">
                      <div className="flex items-center gap-1 mb-4">
                        <h3 className="text-2xl font-semibold text-gray-900">
                          {selectedVideo.title}
                        </h3>
                      </div>

                      {selectedVideo.description && (
                        <div className="bg-white rounded-xl p-6 shadow-sm ring-1 ring-black/5">
                          <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                            {selectedVideo.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                ) : selectedPDF ? (
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm ring-1 ring-black/5">
                    <div className="p-4 border-b flex items-center justify-between bg-gray-50">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-red-500" />
                        <h4 className="font-medium text-gray-900">
                          {selectedPDF.title || selectedPDF.filename}
                        </h4>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPDF(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <PDFViewer
                      key={selectedPDF.url}
                      url={selectedPDF.url}
                      title={selectedPDF.title}
                    />
                  </div>
                ) : (
                  <div className="prose max-w-none">
                    <div className="bg-white rounded-xl p-6 shadow-sm ring-1 ring-black/5">
                      <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                        {selectedEvent.description}
                      </p>
                    </div>

                    {/* Event info card */}
                    <div className="bg-white rounded-xl p-6 shadow-sm ring-1 ring-black/5 mt-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Informazioni sull'evento
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {selectedEvent.date && (
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-50 rounded-full">
                              <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">
                                Data
                              </p>
                              <p className="text-gray-900">
                                {formatDate(selectedEvent.date)}
                              </p>
                            </div>
                          </div>
                        )}

                        {selectedEvent.location && (
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-green-50 rounded-full">
                              <MapPin className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">
                                Località
                              </p>
                              <p className="text-gray-900">
                                {selectedEvent.location}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-1">
                <Card className="bg-white shadow-xl rounded-2xl border-0 overflow-hidden sticky top-8">
                  <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Contenuti dell'evento
                    </h3>
                    <p className="text-blue-100 mt-1">
                      {selectedEvent.videos.length} video,{" "}
                      {selectedEvent.files.length} file
                    </p>
                  </div>
                  <CardContent className="p-6">
                    <ScrollArea className="h-[calc(100vh-400px)]">
                      <div className="space-y-6">
                        {selectedEvent.videos.length > 0 && (
                          <div className="space-y-4">
                            <h4 className="font-medium text-gray-900 flex items-center gap-2">
                              <Youtube className="h-4 w-4 text-red-500" />
                              Video
                            </h4>
                            <div className="space-y-3">
                              {selectedEvent.videos.map((video) => (
                                <div
                                  key={video.id}
                                  className={`group relative bg-white rounded-xl border transition-all duration-200 cursor-pointer
                                  ${
                                    selectedVideo?.id === video.id
                                      ? "border-blue-200 shadow-md bg-blue-50"
                                      : "border-gray-100 hover:border-blue-200 hover:shadow-md"
                                  }`}
                                  onClick={() => {
                                    setSelectedVideo(video);
                                    setSelectedPDF(null);
                                    setYoutubeError(false);
                                  }}
                                >
                                  <div className="relative p-4">
                                    <div className="flex flex-col gap-3">
                                      <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black">
                                        {isYoutubeVideo(video) ? (
                                          <img
                                            src={getYouTubeThumbnail(
                                              video.videoId
                                            )}
                                            alt={video.title}
                                            className="absolute w-full h-full object-cover"
                                          />
                                        ) : (
                                          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                                            <Youtube className="h-10 w-10 text-gray-400" />
                                          </div>
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                                          <Play className="h-10 w-10 text-white" />
                                        </div>
                                      </div>

                                      <h5
                                        className={`font-medium ${
                                          selectedVideo?.id === video.id
                                            ? "text-blue-900"
                                            : "text-gray-900"
                                        }`}
                                      >
                                        {video.title}
                                      </h5>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedEvent.files.length > 0 && (
                          <div className="space-y-4">
                            <h4 className="font-medium text-gray-900 flex items-center gap-2">
                              <FileText className="h-4 w-4 text-red-500" />
                              File
                            </h4>
                            <div className="space-y-3">
                              {selectedEvent.files.map((file) => (
                                <div
                                  key={file.id}
                                  className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                                    selectedPDF?.id === file.id
                                      ? "bg-blue-50 ring-1 ring-blue-200"
                                      : "bg-gray-50 hover:bg-gray-100"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <FileText
                                      className={`h-5 w-5 ${
                                        selectedPDF?.id === file.id
                                          ? "text-blue-500"
                                          : "text-red-500"
                                      }`}
                                    />
                                    <div>
                                      <p
                                        className={`font-medium ${
                                          selectedPDF?.id === file.id
                                            ? "text-blue-900"
                                            : "text-gray-900"
                                        }`}
                                      >
                                        {file.title}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {file.filename}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setSelectedPDF(
                                          selectedPDF?.id === file.id
                                            ? null
                                            : file
                                        );
                                        setSelectedVideo(null);
                                      }}
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      {selectedPDF?.id === file.id
                                        ? "Nascondi"
                                        : "Visualizza"}
                                    </Button>
                                    <a
                                      href={file.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <Button variant="ghost" size="sm">
                                        <Download className="h-4 w-4 mr-2" />
                                        Scarica
                                      </Button>
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </div>
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
        <Footer />
      </>
    );
  }

  // Vista lista eventi
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600 mb-4">
              Eventi
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Scopri i nostri eventi passati e accedi a tutti i relativi
              contenuti multimediali
            </p>
          </div>

          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Cerca eventi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 backdrop-blur-sm border-gray-200 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card
                key={event.id}
                className="group relative h-full bg-white/50 backdrop-blur-sm hover:bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer transform hover:-translate-y-1"
                onClick={() => setSelectedEvent(event)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-6 relative">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      {event.date && (
                        <div className="flex items-center gap-1 bg-gray-100/80 rounded-full px-3 py-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(event.date)}
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center gap-1 bg-gray-100/80 rounded-full px-3 py-1">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                      )}
                    </div>

                    <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {event.title}
                    </h2>

                    <p className="text-gray-600 line-clamp-3 mb-4 flex-grow">
                      {event.description}
                    </p>

                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      {event.videos.length > 0 && (
                        <div className="flex items-center gap-1 bg-red-50 text-red-700 px-3 py-1.5 rounded-full">
                          <Youtube className="h-4 w-4" />
                          <span className="text-xs font-medium">
                            {event.videos.length} video
                          </span>
                        </div>
                      )}
                      {event.files.length > 0 && (
                        <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full">
                          <FileText className="h-4 w-4" />
                          <span className="text-xs font-medium">
                            {event.files.length} file
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredEvents.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nessun evento trovato
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

export default EventViewer;
