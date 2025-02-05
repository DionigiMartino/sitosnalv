"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
  BookOpen,
  GraduationCap,
  CheckCircle,
  BookmarkIcon,
  PlayIcon,
  X,
  Lock,
  Check,
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
  setDoc,
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
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

interface LessonProgress {
  currentTime: number;
  lastUpdated: Date;
  completed: boolean;
  totalDuration: number;
  title: string;
  lessonId: string;
  watchedPercentage: number;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  video?: {
    url: string;
  };
  files?: {
    url: string;
    title: string;
    filename: string;
  }[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  createdAt: any;
  updatedAt: any;
  lessons: Lesson[];
  progress?: {
    [key: string]: LessonProgress;
  };
}

const CourseViewer = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedPDF, setSelectedPDF] = useState<{
    url: string;
    title: string;
    filename: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [saved, setSaved] = useState(false);
  const [watchedPercentage, setWatchedPercentage] = useState(0);
  const [canComplete, setCanComplete] = useState(false);
  const [allLessonsCompleted, setAllLessonsCompleted] = useState(false);

  // Funzione per verificare se tutte le lezioni sono completate
  const checkAllLessonsCompleted = useCallback(() => {
    if (!selectedCourse?.lessons || !selectedCourse?.progress) return false;

    return selectedCourse.lessons.every(
      (lesson) => selectedCourse.progress[lesson.id]?.completed === true
    );
  }, [selectedCourse?.lessons, selectedCourse?.progress]);

  // Aggiorna lo stato quando cambia il corso o il progresso
  useEffect(() => {
    setAllLessonsCompleted(checkAllLessonsCompleted());
  }, [selectedCourse, checkAllLessonsCompleted]);

  // Redirect se non autenticato
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Funzioni di utilità
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const formatDate = (date: any): string => {
    if (!date) return "";
    return format(date.toDate(), "d MMMM yyyy", { locale: it });
  };

  // Funzione per verificare se una lezione è sbloccata
  const isLessonUnlocked = (lessonIndex: number) => {
    if (lessonIndex === 0) return true;

    const previousLesson = selectedCourse?.lessons[lessonIndex - 1];
    if (!previousLesson) return false;

    const previousProgress = selectedCourse?.progress?.[previousLesson.id];
    return previousProgress?.completed === true;
  };

  // Calcolo percentuale video guardato
  const calculateWatchedPercentage = (
    currentTime: number,
    duration: number
  ) => {
    if (!duration) return 0;
    return (currentTime / duration) * 100;
  };

  // Gestione dell'aggiornamento del tempo del video
  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const percentage = calculateWatchedPercentage(
      video.currentTime,
      video.duration
    );
    setCurrentTime(video.currentTime);
    setWatchedPercentage(percentage);
    setCanComplete(percentage >= 99);
  };

  // Funzione per completare la lezione
  const handleCompleteLesson = async () => {
    if (!session?.user?.email || !selectedCourse?.id || !selectedLesson?.id)
      return;

    try {
      const progressRef = doc(
        db,
        "users",
        session.user.email,
        "courseProgress",
        selectedCourse.id
      );

      const lessonProgress: LessonProgress = {
        currentTime: videoRef.current?.currentTime || 0,
        lastUpdated: new Date(),
        completed: true,
        totalDuration: videoRef.current?.duration || 0,
        title: selectedLesson.title,
        lessonId: selectedLesson.id,
        watchedPercentage: watchedPercentage,
      };

      await setDoc(
        progressRef,
        {
          lessons: {
            [selectedLesson.id]: lessonProgress,
          },
        },
        { merge: true }
      );

      toast({
        title: "Lezione completata",
        description: "Puoi procedere con la prossima lezione",
      });

      // Aggiorna il corso selezionato con il nuovo progresso
      const updatedProgress = {
        ...selectedCourse.progress,
        [selectedLesson.id]: lessonProgress,
      };

      setSelectedCourse({
        ...selectedCourse,
        progress: updatedProgress,
      });
    } catch (error) {
      console.error("Error completing lesson:", error);
      toast({
        title: "Errore",
        description: "Impossibile completare la lezione",
        variant: "destructive",
      });
    }
  };

  // Salvataggio progresso
  const handleSaveProgress = async () => {
    if (
      !videoRef.current ||
      !selectedLesson?.video ||
      !session?.user?.email ||
      !selectedCourse?.id
    ) {
      console.log("Dati mancanti per il salvataggio:", {
        hasVideo: !!videoRef.current,
        hasLesson: !!selectedLesson?.video,
        hasUser: !!session?.user?.email,
        hasCourse: !!selectedCourse?.id,
      });
      return;
    }

    try {
      const progressRef = doc(
        db,
        "users",
        session.user.email,
        "courseProgress",
        selectedCourse.id
      );

      const lessonProgress: LessonProgress = {
        currentTime: videoRef.current.currentTime,
        lastUpdated: new Date(),
        completed:
          selectedCourse?.progress?.[selectedLesson.id]?.completed || false,
        totalDuration: videoRef.current.duration || 0,
        title: selectedLesson.title,
        lessonId: selectedLesson.id,
        watchedPercentage: watchedPercentage,
      };

      await setDoc(
        progressRef,
        {
          lessons: {
            [selectedLesson.id]: lessonProgress,
          },
        },
        { merge: true }
      );

      setSaved(true);
      toast({
        title: "Progresso salvato",
        description: `Progresso salvato a ${formatTime(
          videoRef.current.currentTime
        )}`,
      });
    } catch (error) {
      console.error("Error saving progress:", error);
      toast({
        title: "Errore",
        description: "Impossibile salvare il progresso",
        variant: "destructive",
      });
    }
  };

  // Ripresa video
  const handleResumeProgress = async () => {
    if (
      !videoRef.current ||
      !selectedLesson?.video ||
      !session?.user?.email ||
      !selectedCourse?.id
    ) {
      return;
    }

    try {
      const progressRef = doc(
        db,
        "users",
        session.user.email,
        "courseProgress",
        selectedCourse.id
      );

      const progressDoc = await getDoc(progressRef);

      if (progressDoc.exists()) {
        const data = progressDoc.data();
        const lessonProgress = data?.lessons?.[selectedLesson.id];

        if (lessonProgress?.currentTime != null) {
          videoRef.current.currentTime = lessonProgress.currentTime;
          videoRef.current.play();
          toast({
            title: "Video ripreso",
            description: `Video ripreso da ${formatTime(
              lessonProgress.currentTime
            )}`,
          });
        }
      }
    } catch (error) {
      console.error("Error resuming progress:", error);
      toast({
        title: "Errore",
        description: "Impossibile recuperare il progresso",
        variant: "destructive",
      });
    }
  };

  // Verifica progresso salvato
  const checkSavedProgress = async () => {
    if (
      !selectedLesson?.video ||
      !session?.user?.email ||
      !selectedCourse?.id
    ) {
      setSaved(false);
      return;
    }

    try {
      const progressRef = doc(
        db,
        "users",
        session.user.email,
        "courseProgress",
        selectedCourse.id
      );

      const progressDoc = await getDoc(progressRef);

      if (progressDoc.exists()) {
        const data = progressDoc.data();
        const lessonProgress = data?.lessons?.[selectedLesson.id];

        setSaved(!!lessonProgress);
        if (lessonProgress?.currentTime != null) {
          setCurrentTime(lessonProgress.currentTime);
          setWatchedPercentage(lessonProgress.watchedPercentage || 0);
          setCanComplete(lessonProgress.watchedPercentage >= 99);
        }
      } else {
        setSaved(false);
      }
    } catch (error) {
      console.error("Error checking saved progress:", error);
      setSaved(false);
    }
  };

  // Effect per controllo progresso
  useEffect(() => {
    checkSavedProgress();
  }, [selectedLesson?.id, selectedCourse?.id, session?.user?.email]);

  // Caricamento corsi
  useEffect(() => {
    const fetchCourses = async () => {
      if (!session?.user?.email) return;

      try {
        const coursesQuery = query(
          collection(db, "courses"),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(coursesQuery);
        const coursesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Course[];
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast({
          title: "Errore",
          description: "Impossibile caricare i corsi",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [session]);

  // Selezione corso
  const handleCourseSelection = async (course: Course) => {
    try {
      const progressRef = doc(
        db,
        "users",
        session?.user?.email!,
        "courseProgress",
        course.id
      );
      const progressDoc = await getDoc(progressRef);
      const progress = progressDoc.exists() ? progressDoc.data().lessons : {};

      setSelectedCourse({
        ...course,
        progress,
      });
    } catch (error) {
      console.error("Error fetching course progress:", error);
      setSelectedCourse(course);
    }
  };

  // Rendering delle lezioni nella sidebar
  const renderLessonItem = (lesson: Lesson, index: number) => {
    const isUnlocked = isLessonUnlocked(index);
    const isCompleted = selectedCourse?.progress?.[lesson.id]?.completed;

    return (
      <div
        key={lesson.id}
        className={`group relative bg-white rounded-xl border transition-all duration-200 
          ${!isUnlocked ? "opacity-75 cursor-not-allowed" : "cursor-pointer"}
          ${
            selectedLesson?.id === lesson.id
              ? "border-purple-200 shadow-md bg-purple-50"
              : "border-gray-100 hover:border-purple-200 hover:shadow-md"
          }`}
        onClick={() => {
          if (isUnlocked) {
            setSelectedLesson(lesson);
            setSelectedPDF(null);
          } else {
            toast({
              title: "Lezione bloccata",
              description:
                "Completa la lezione precedente per sbloccare questa",
              variant: "destructive",
            });
          }
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
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${
                    !isUnlocked
                      ? "bg-gray-100 text-gray-400"
                      : selectedLesson?.id === lesson.id
                      ? "bg-purple-100 text-purple-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
              >
                {!isUnlocked ? <Lock className="h-4 w-4" /> : index + 1}
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
                      <span className="text-gray-600">Video</span>
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
              {isCompleted && (
                <div className="absolute top-2 right-2">
                  <div className="bg-green-100 text-green-600 p-1 rounded-full">
                    <Check className="h-4 w-4" />
                  </div>
                </div>
              )}
            </div>
            {selectedCourse?.progress?.[lesson.id] && !isCompleted && (
              <div className="mt-2">
                <div className="h-1 w-full bg-gray-200 rounded">
                  <div
                    className="h-full bg-blue-500 rounded transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        selectedCourse.progress[lesson.id].watchedPercentage ||
                          0,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {Math.round(
                    selectedCourse.progress[lesson.id].watchedPercentage || 0
                  )}
                  % completato
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Filtraggio corsi
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("Session", session);

  async function fillAndDownloadPDF() {
    if (!session?.user) {
      console.error("Nessuna sessione utente trovata");
      return;
    }

    try {
      const pdfResponse = await fetch("/docs/attestato.pdf");
      if (!pdfResponse.ok) throw new Error("PDF non trovato");

      const pdfBlob = await pdfResponse.blob();
      const arrayBuffer = await pdfBlob.arrayBuffer();

      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const page = pdfDoc.getPages()[0];
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // @ts-ignore
      const name = `${session.user.nome} ${session.user.cognome}`;
      const today = format(new Date(), "dd/MM/yyyy");

      page.drawText(name, {
        x: 300,
        y: 245, // Posizione da aggiustare
        size: 22, // Font più grande
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      // @ts-ignore
      page.drawText(session.user.luogoNascita, {
        x: 295,
        y: 212.5, // Posizione da aggiustare
        size: 10, // Font più grande
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      // Data in basso al centro
      page.drawText(today, {
        x: 395, // Centrare orizzontalmente
        y: 55, // Posizione da aggiustare per il fondo pagina
        size: 12,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      const modifiedPdfBytes = await pdfDoc.save();
      const modifiedPdfBlob = new Blob([modifiedPdfBytes], {
        type: "application/pdf",
      });
      const url = URL.createObjectURL(modifiedPdfBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `attestato_${name.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Errore nella generazione del PDF:", error);
    }
  }

  // Rendering del video player con pulsante di completamento
  const renderVideoPlayer = () => (
    <div className="space-y-4">
      <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl ring-1 ring-black/5">
        <div className="aspect-video">
          <video
            ref={videoRef}
            controls
            className="absolute inset-0 w-full h-full object-cover"
            src={selectedLesson?.video?.url}
            onTimeUpdate={handleTimeUpdate}
          >
            Il tuo browser non supporta il tag video.
          </video>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm">
        {/* Barra di progresso principale */}
        <div className="w-full h-2 bg-gray-200 mb-4">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${Math.min(watchedPercentage, 100)}%` }}
          />
        </div>

        {/* Contenitore principale */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Gruppo pulsanti */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handleSaveProgress}
              variant="outline"
              className="hover:bg-purple-50 min-w-[100px]"
            >
              <BookmarkIcon className="h-4 w-4 mr-2" />
              Salva
            </Button>

            <Button
              onClick={handleResumeProgress}
              variant="outline"
              className="hover:bg-purple-50 min-w-[100px]"
              disabled={!saved}
            >
              <PlayIcon className="h-4 w-4 mr-2" />
              Riprendi
            </Button>

            <Button
              onClick={handleCompleteLesson}
              variant="outline"
              className={`hover:bg-green-50 min-w-[140px] ${
                !canComplete && "opacity-50 cursor-not-allowed"
              }`}
              disabled={!canComplete}
            >
              <Check className="h-4 w-4 mr-2" />
              Completa lezione
            </Button>

            {allLessonsCompleted && (
              <Button
                onClick={fillAndDownloadPDF}
                variant="outline"
                className="hover:bg-blue-50 border-blue-200 text-blue-600 hover:text-blue-700 min-w-[140px] group transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium">Attestato</span>
              </Button>
            )}
          </div>

          {/* Gruppo informazioni */}
          <div className="flex flex-wrap items-center gap-4">
            {saved && (
              <div className="flex items-center gap-2 text-sm text-gray-500 min-w-[140px]">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Progresso salvato</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-500 min-w-[200px]">
              <span className="whitespace-nowrap">Completamento:</span>
              <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${Math.min(watchedPercentage, 100)}%` }}
                />
              </div>
              <span className="min-w-[40px]">
                {Math.round(watchedPercentage)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Rendering principale
  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Vista dettaglio corso
  if (selectedCourse) {
    return (
      <>
        <Header />
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
                {allLessonsCompleted && (
                  <>
                    <div className="h-4 w-px bg-gray-200"></div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Completato
                    </div>
                  </>
                )}
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
                      renderVideoPlayer()
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
                            {selectedLesson.files.map((file) => (
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
                        {selectedCourse.lessons.map((lesson, index) =>
                          renderLessonItem(lesson, index)
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
                onClick={() => handleCourseSelection(course)}
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
