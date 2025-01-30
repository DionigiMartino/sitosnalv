"use client";

import React, { useState, useEffect, useRef } from "react";
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
  GraduationCap,
  CheckCircle,
  BookmarkIcon,
  PlayIcon,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import PDFViewer from "@/src/components/PDFViewer";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useToast } from "@/hooks/use-toast";

const CourseViewer = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  // All'inizio del componente aggiungiamo gli stati necessari
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [saved, setSaved] = useState(false);
  const toast = useToast();

  // Funzione per formattare il tempo in formato mm:ss
  const getStorageKey = (courseId, lessonId) => {
    return `videoProgress_${courseId}_${lessonId}`;
  };

  // Funzione per salvare il progresso
  const handleSaveProgress = () => {
    if (videoRef.current && selectedLesson?.video) {
      const key = getStorageKey(selectedCourse.id, selectedLesson.id);
      const saveData = {
        lessonId: selectedLesson.id,
        courseId: selectedCourse.id,
        time: videoRef.current.currentTime,
        timestamp: new Date().getTime(),
      };
      localStorage.setItem(key, JSON.stringify(saveData));
      setSaved(true);
      alert(`Progresso salvato a ${formatTime(videoRef.current.currentTime)}`);
    }
  };

  // Funzione per riprendere il progresso
  const handleResumeProgress = () => {
    if (videoRef.current && selectedLesson?.video) {
      const key = getStorageKey(selectedCourse.id, selectedLesson.id);
      const savedData = localStorage.getItem(key);
      if (savedData) {
        const { time } = JSON.parse(savedData);
        videoRef.current.currentTime = time;
        videoRef.current.play();
        alert(`Video ripreso da ${formatTime(time)}`);
      }
    }
  };

  // Funzione per formattare il tempo
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Controlla se esiste un salvataggio quando cambia la lezione
  useEffect(() => {
    if (selectedLesson?.video) {
      const key = getStorageKey(selectedCourse?.id, selectedLesson?.id);
      const savedData = localStorage.getItem(key);
      setSaved(!!savedData);
    } else {
      setSaved(false);
    }
  }, [selectedLesson?.id, selectedCourse?.id]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const coursesQuery = query(
        collection(db, "courses"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(coursesQuery);
      const coursesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(coursesData);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date) => {
    if (!date) return "";
    return format(date.toDate(), "d MMMM yyyy", { locale: it });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento corsi...</p>
        </div>
      </div>
    );
  }

  if (selectedCourse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <nav className="mb-8 flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedCourse(null);
                setSelectedLesson(null);
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
                {formatDate(selectedCourse.updatedAt)}
              </div>
              <div className="h-4 w-px bg-gray-200"></div>
              <div className="flex items-center gap-1">
                <GraduationCap className="h-4 w-4" />
                {selectedCourse.lessons.length} lezioni
              </div>
            </div>
          </nav>

          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {selectedCourse.title}
          </h1>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video & Content Section */}
            <div className="lg:col-span-2 space-y-8">
              {selectedLesson ? (
                <>
                  {/* Video Player */}
                  {selectedLesson.video ? (
                    <div className="space-y-4">
                      <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl ring-1 ring-black/5">
                        <div className="aspect-video">
                          <video
                            ref={videoRef}
                            controls
                            className="absolute inset-0 w-full h-full object-cover"
                            src={selectedLesson.video.url}
                            onTimeUpdate={(e) =>
                              // @ts-ignore
                              setCurrentTime(e.target.currentTime)
                            }
                          >
                            Il tuo browser non supporta il tag video.
                          </video>
                        </div>
                      </div>

                      <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-4">
                          <Button
                            onClick={handleSaveProgress}
                            variant="outline"
                            className="hover:bg-purple-50"
                          >
                            <BookmarkIcon className="h-4 w-4 mr-2" />
                            Salva
                          </Button>

                          <Button
                            onClick={handleResumeProgress}
                            variant="outline"
                            className={`hover:bg-purple-50`}
                            disabled={!saved}
                          >
                            <PlayIcon className="h-4 w-4 mr-2" />
                            Riprendi
                          </Button>
                        </div>

                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          {saved && (
                            <>
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span>Progresso salvato</span>
                            </>
                          )}
                          <span className="px-2">•</span>
                          Tempo: {formatTime(currentTime)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center ring-1 ring-black/5">
                      <div className="text-center text-gray-500">
                        <Play className="h-20 w-20 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg">Nessun video disponibile</p>
                      </div>
                    </div>
                  )}

                  {/* Lesson Description */}
                  <div className="prose max-w-none">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                      {selectedLesson.title}
                    </h3>
                    <div className="bg-white rounded-xl p-6 shadow-sm ring-1 ring-black/5">
                      <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                        {selectedLesson.description}
                      </p>
                    </div>
                  </div>

                  {/* Materials and PDF Viewer */}
                  {selectedLesson.files?.length > 0 && (
                    <div className="space-y-6">
                      {/* PDF Viewer */}
                      {selectedPDF && (
                        <div
                          key={selectedPDF.url}
                          className="bg-white rounded-xl overflow-hidden shadow-sm ring-1 ring-black/5"
                        >
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
                      )}

                      {/* Materials List */}
                      <div className="bg-white rounded-xl p-6 shadow-sm ring-1 ring-black/5">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                          Materiali della lezione
                        </h4>
                        <div className="space-y-3">
                          {selectedLesson.files.map((file, index) => (
                            <div
                              key={file.url}
                              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                                selectedPDF?.url === file.url
                                  ? "bg-purple-50 ring-1 ring-purple-200"
                                  : "bg-gray-50 hover:bg-gray-100"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <FileText
                                  className={`h-5 w-5 ${
                                    selectedPDF?.url === file.url
                                      ? "text-purple-500"
                                      : "text-red-500"
                                  }`}
                                />
                                <div>
                                  <p
                                    className={`font-medium ${
                                      selectedPDF?.url === file.url
                                        ? "text-purple-900"
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
                                  onClick={() =>
                                    setSelectedPDF(
                                      selectedPDF?.url === file.url
                                        ? null
                                        : file
                                    )
                                  }
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  {selectedPDF?.url === file.url
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
                    </div>
                  )}
                </>
              ) : (
                <div className="prose max-w-none">
                  <div className="bg-white rounded-xl p-6 shadow-sm ring-1 ring-black/5">
                    <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                      {selectedCourse.description}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Lessons Sidebar */}
            <div className="lg:col-span-1">
              <Card className="bg-white shadow-xl rounded-2xl border-0 overflow-hidden sticky top-8">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Lezioni del corso
                  </h3>
                  <p className="text-purple-100 mt-1">
                    {selectedCourse.lessons.length} lezioni disponibili
                  </p>
                </div>
                <CardContent className="p-6">
                  <ScrollArea className="h-[calc(100vh-400px)]">
                    <div className="space-y-4">
                      {selectedCourse.lessons.map((lesson, index) => (
                        <div
                          key={lesson.id}
                          className={`group relative bg-white rounded-xl border cursor-pointer transition-all duration-200 ${
                            selectedLesson?.id === lesson.id
                              ? "border-purple-200 shadow-md bg-purple-50"
                              : "border-gray-100 hover:border-purple-200 hover:shadow-md"
                          }`}
                          onClick={() => {
                            setSelectedLesson(lesson);
                            setSelectedPDF(null);
                          }}
                        >
                          <div className="relative p-4">
                            <div className="flex flex-col gap-3">
                              {/* Video Preview */}
                              {lesson.video && (
                                <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-black">
                                  <video
                                    src={lesson.video.url}
                                    className="w-full h-full object-cover"
                                    muted
                                    preload="metadata"
                                  >
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                                      <Play className="h-8 w-8 text-white opacity-75" />
                                    </div>
                                  </video>
                                  {selectedLesson?.id !== lesson.id && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                      <Play className="h-8 w-8 text-white" />
                                    </div>
                                  )}
                                </div>
                              )}

                              <div className="flex items-start gap-4">
                                <div
                                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                    selectedLesson?.id === lesson.id
                                      ? "bg-purple-100 text-purple-700"
                                      : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4
                                    className={`font-medium truncate ${
                                      selectedLesson?.id === lesson.id
                                        ? "text-purple-900"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    {lesson.title}
                                  </h4>
                                  <div className="flex items-center gap-3 mt-2">
                                    {lesson.video && (
                                      <div className="flex items-center gap-1 text-xs">
                                        <Play className="h-3 w-3 text-blue-500" />
                                        <span className="text-gray-600">
                                          Video
                                        </span>
                                      </div>
                                    )}
                                    {lesson.files?.length > 0 && (
                                      <div className="flex items-center gap-1 text-xs">
                                        <FileText className="h-3 w-3 text-red-500" />
                                        <span className="text-gray-600">
                                          {lesson.files.length} materiali
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                {selectedLesson?.id === lesson.id && (
                                  <CheckCircle className="h-5 w-5 text-purple-500" />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
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

  // Vista lista corsi
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-4">
              Corsi & materiali didattici
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Accedi ai nostri corsi formativi e migliora le tue competenze con
              contenuti esclusivi e materiali didattici.
            </p>
          </div>

          <div className="mb-8">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Cerca corsi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 backdrop-blur-sm border-gray-200 focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                className="group relative h-full bg-white/50 backdrop-blur-sm hover:bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer transform hover:-translate-y-1"
                onClick={() => setSelectedCourse(course)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-6 relative">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1 bg-gray-100/80 rounded-full px-3 py-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(course.updatedAt)}
                      </div>
                      <div className="flex items-center gap-1 bg-gray-100/80 rounded-full px-3 py-1">
                        <BookOpen className="h-4 w-4" />
                        {course.lessons.length} lezioni
                      </div>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
                      {course.title}
                    </h2>

                    <p className="text-gray-600 line-clamp-3 mb-4 flex-grow">
                      {course.description}
                    </p>

                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      {course.lessons.some((lesson) => lesson.video) && (
                        <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full">
                          <Play className="h-4 w-4" />
                          <span className="text-xs font-medium">Video</span>
                        </div>
                      )}
                      {course.lessons.some(
                        (lesson) => lesson.files?.length > 0
                      ) && (
                        <div className="flex items-center gap-1 bg-red-50 text-red-700 px-3 py-1.5 rounded-full">
                          <FileText className="h-4 w-4" />
                          <span className="text-xs font-medium">Materiali</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredCourses.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nessun corso trovato
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

export default CourseViewer;
