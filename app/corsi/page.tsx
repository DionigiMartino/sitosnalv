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
  Pause,
  RotateCcw,
  Rewind,
  Check,
  SquareArrowRight,
  Info,
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

interface TestAnswer {
  text: string;
  isCorrect: boolean;
}

interface TestQuestion {
  question: string;
  answers: TestAnswer[];
}

interface LessonProgress {
  currentTime: number;
  lastUpdated: Date;
  completed: boolean;
  totalDuration: number;
  title: string;
  lessonId: string;
  watchedPercentage: number;
  testCompleted?: boolean;
  testPassed?: boolean;
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
  test?: {
    questions: TestQuestion[];
  };
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [questionIndex: number]: number | null;
  }>({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testPassed, setTestPassed] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleRewind = () => {
    if (videoRef.current) {
      const newTime = Math.max(0, videoRef.current.currentTime - 5);
      videoRef.current.currentTime = newTime;
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (!videoRef.current.paused) {
        videoRef.current.play();
      }
    }
  };

  const checkAllLessonsCompleted = useCallback(() => {
    if (!selectedCourse?.lessons || !selectedCourse?.progress) return false;

    return selectedCourse.lessons.every(
      (lesson) => selectedCourse.progress[lesson.id]?.completed === true
    );
  }, [selectedCourse?.lessons, selectedCourse?.progress]);

  useEffect(() => {
    setAllLessonsCompleted(checkAllLessonsCompleted());
  }, [selectedCourse, checkAllLessonsCompleted]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

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

  const isLessonUnlocked = (lessonIndex: number) => {
    if (lessonIndex === 0) return true;

    const previousLesson = selectedCourse?.lessons[lessonIndex - 1];
    if (!previousLesson) return false;

    const previousProgress = selectedCourse?.progress?.[previousLesson.id];
    return previousProgress?.completed === true;
  };

  const calculateWatchedPercentage = (
    currentTime: number,
    duration: number
  ) => {
    if (!duration) return 0;
    return (currentTime / duration) * 100;
  };

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

  const handleTestAnswerSelect = (
    questionIndex: number,
    answerIndex: number
  ) => {
    if (testSubmitted) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerIndex,
    }));
  };

  const handleTestSubmit = async () => {
    if (!selectedLesson?.test || !selectedCourse?.id || !session?.user?.email)
      return;

    const allQuestionsAnswered = selectedLesson.test.questions.every(
      (_, index) =>
        selectedAnswers[index] !== undefined && selectedAnswers[index] !== null
    );

    if (!allQuestionsAnswered) {
      toast({
        title: "Errore",
        description: "Per favore, rispondi a tutte le domande",
        variant: "destructive",
      });
      return;
    }

    const correctAnswersCount = selectedLesson.test.questions.filter(
      (question, index) => question.answers[selectedAnswers[index]].isCorrect
    ).length;

    const passPercentage =
      (correctAnswersCount / selectedLesson.test.questions.length) * 100;
    const isPassed = passPercentage >= 60;

    setTestSubmitted(true);
    setTestPassed(isPassed);

    // Aggiorna il progresso del test nel database
    try {
      const progressRef = doc(
        db,
        "users",
        session.user.email,
        "courseProgress",
        selectedCourse.id
      );

      const currentProgress =
        selectedCourse.progress?.[selectedLesson.id] || {};

      await setDoc(
        progressRef,
        {
          lessons: {
            [selectedLesson.id]: {
              ...currentProgress,
              testCompleted: true,
              testPassed: isPassed,
            },
          },
        },
        { merge: true }
      );

      if (isPassed) {
        toast({
          title: "Test superato",
          description: `Hai risposto correttamente al ${Math.round(
            passPercentage
          )}% delle domande`,
        });
      } else {
        toast({
          title: "Test non superato",
          description: `Hai risposto correttamente al ${Math.round(
            passPercentage
          )}% delle domande. Puoi riprovare o continuare con la prossima lezione`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating test progress:", error);
      toast({
        title: "Errore",
        description: "Impossibile salvare il risultato del test",
        variant: "destructive",
      });
    }
  };

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
        description: selectedLesson.test
          ? "Puoi procedere con il test o passare alla prossima lezione"
          : "Puoi procedere con la prossima lezione",
      });

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

  const fillAndDownloadPDF = async () => {
    if (!session?.user) {
      console.error("Nessuna sessione utente trovata");
      return;
    }

    // Verifica se tutte le lezioni sono completate
    const allLessonsCompleted = selectedCourse?.lessons.every(
      (lesson) => selectedCourse.progress?.[lesson.id]?.completed
    );

    if (!allLessonsCompleted) {
      toast({
        title: "Requisiti non completati",
        description:
          "Devi completare tutte le lezioni per ottenere l'attestato",
        variant: "destructive",
      });
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
        y: 245,
        size: 22,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      // @ts-ignore
      page.drawText(session.user.luogoNascita, {
        x: 295,
        y: 212.5,
        size: 10,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      // @ts-ignore
      page.drawText(format(new Date(session.user.dataNascita), "dd/MM/yyyy"), {
        x: 450,
        y: 212.5,
        size: 14,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      page.drawText(today, {
        x: 395,
        y: 55,
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
      toast({
        title: "Errore",
        description: "Impossibile generare l'attestato",
        variant: "destructive",
      });
    }
  };

  const handleSaveProgress = async () => {
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

  useEffect(() => {
    checkSavedProgress();
  }, [selectedLesson?.id, selectedCourse?.id, session?.user?.email]);

  const getNextLesson = () => {
    if (!selectedCourse || !selectedLesson) return null;
    const currentIndex = selectedCourse.lessons.findIndex(
      (lesson) => lesson.id === selectedLesson.id
    );
    return selectedCourse.lessons[currentIndex + 1] || null;
  };

  const renderLessonTest = () => {
    if (
      !selectedLesson?.test ||
      !selectedCourse?.progress?.[selectedLesson.id]?.completed
    ) {
      return null;
    }

    return (
      <div className="bg-white rounded-xl p-6 shadow-sm ring-1 ring-black/5 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xl font-semibold text-gray-900">
            Test della Lezione
          </h4>
        </div>

        {testMode ? (
          <div className="space-y-6">
            {selectedLesson.test.questions.map((question, questionIndex) => (
              <div key={questionIndex} className="mb-6">
                <p className="text-lg font-medium text-gray-800 mb-4">
                  {question.question}
                </p>
                <div className="space-y-3">
                  {question.answers.map((answer, answerIndex) => (
                    <button
                      key={answerIndex}
                      onClick={() =>
                        handleTestAnswerSelect(questionIndex, answerIndex)
                      }
                      className={`w-full text-left p-3 rounded-lg transition-all duration-300 
                        ${
                          testSubmitted
                            ? answer.isCorrect
                              ? "bg-green-100 border-2 border-green-300"
                              : selectedAnswers[questionIndex] === answerIndex
                              ? "bg-red-100 border-2 border-red-300"
                              : "bg-gray-100"
                            : selectedAnswers[questionIndex] === answerIndex
                            ? "bg-blue-100 border-2 border-blue-300"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      disabled={testSubmitted}
                    >
                      {answer.text}
                      {testSubmitted && (
                        <span className="float-right">
                          {answer.isCorrect ? (
                            <CheckCircle className="text-green-500 inline-block" />
                          ) : selectedAnswers[questionIndex] === answerIndex ? (
                            <X className="text-red-500 inline-block" />
                          ) : null}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            {!testSubmitted ? (
              <Button
                onClick={handleTestSubmit}
                className="w-full"
                disabled={
                  Object.keys(selectedAnswers).length !==
                  selectedLesson.test.questions.length
                }
              >
                Invia Risposte
              </Button>
            ) : (
              <div className="flex justify-end gap-2">
                {!testPassed && (
                  <Button
                    onClick={() => {
                      setTestSubmitted(false);
                      setSelectedAnswers({});
                    }}
                    variant="outline"
                  >
                    Riprova
                  </Button>
                )}
                <Button onClick={() => setTestMode(false)}>
                  {testPassed ? "Continua" : "Salta il test"}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-600 mb-4">
              Hai completato la lezione! Vuoi provare il test?
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => setTestMode(true)} variant="outline">
                Inizia il Test
              </Button>
              {getNextLesson() && (
                <Button
                  onClick={() => {
                    setSelectedLesson(getNextLesson());
                    setSelectedPDF(null);
                  }}
                >
                  Prossima Lezione
                </Button>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Il test è facoltativo - puoi procedere con la prossima lezione
            </p>
          </div>
        )}
      </div>
    );
  };

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

  // ... [Il resto del codice rimane invariato fino a renderLessonItem]

  const renderLessonItem = (lesson: Lesson, index: number) => {
    const isUnlocked = isLessonUnlocked(index);
    const isCompleted = selectedCourse?.progress?.[lesson.id]?.completed;
    const hasTestAndPassed =
      lesson.test && selectedCourse?.progress?.[lesson.id]?.testPassed;

    return (
      <div
        key={lesson.id}
        className={`group relative bg-white rounded-xl border transition-all duration-200 
          ${!isUnlocked ? "opacity-75 cursor-not-allowed" : "cursor-pointer"}
          ${
            selectedLesson?.id === lesson.id
              ? "border-blue-200 shadow-md bg-blue-50"
              : "border-gray-100 hover:border-blue-200 hover:shadow-md"
          }`}
        onClick={() => {
          if (isUnlocked) {
            setSelectedLesson(lesson);
            setSelectedPDF(null);
            setTestMode(false);
            setTestSubmitted(false);
            setSelectedAnswers({});
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
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
              >
                {!isUnlocked ? <Lock className="h-4 w-4" /> : index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className={`font-medium truncate ${
                    selectedLesson?.id === lesson.id
                      ? "text-blue-900"
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
                  {lesson.test && (
                    <div className="flex items-center gap-1 text-xs">
                      <GraduationCap className="h-3 w-3 text-purple-500" />
                      <span className="text-gray-600">Test</span>
                    </div>
                  )}
                </div>
              </div>
              {isCompleted && (
                <div className="absolute top-2 right-2 flex gap-1">
                  <div className="bg-green-100 text-green-600 p-1 rounded-full">
                    <Check className="h-4 w-4" />
                  </div>
                  {hasTestAndPassed && (
                    <div className="bg-purple-100 text-purple-600 p-1 rounded-full">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                  )}
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

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Vista dettaglio corso
  if (selectedCourse) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
          <div className="max-w-7xl mx-auto px-4 py-8">
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

            <div className="flex items-center gap-1 mb-6">
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                {selectedCourse.title}
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
                      Guida ai Controlli
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-6 pt-4">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Controlli Video:
                          </h3>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>Play/Pausa: Avvia o mette in pausa il video</li>
                            <li>
                              Indietro di 5 secondi: Riavvolge il video di 5
                              secondi
                            </li>
                            <li>Riavvia: Riporta il video all'inizio</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Lezioni:
                          </h3>
                          <ul className="list-disc pl-5 space-y-2">
                            <li>Le lezioni si sbloccano in sequenza</li>
                            <li>
                              Devi completare almeno il 99% di una lezione per
                              proseguire
                            </li>
                            <li>Il progresso viene salvato automaticamente</li>
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
                {selectedLesson ? (
                  <>
                    {selectedLesson.video ? (
                      <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl ring-1 ring-black/5">
                        <div className="relative aspect-video bg-black">
                          <video
                            ref={videoRef}
                            className="absolute inset-0 w-full h-full object-cover"
                            src={selectedLesson?.video?.url}
                            onTimeUpdate={handleTimeUpdate}
                          >
                            Il tuo browser non supporta il tag video.
                          </video>

                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4">
                            <div className="flex items-center gap-4">
                              <button
                                onClick={handleRestart}
                                className="text-white hover:text-gray-200"
                                title="Ricomincia da capo"
                              >
                                <RotateCcw size={24} />
                              </button>

                              <button
                                onClick={handleRewind}
                                className="text-white hover:text-gray-200"
                                title="Indietro di 10 secondi"
                              >
                                <Rewind size={24} />
                              </button>

                              <button
                                onClick={togglePlay}
                                className="text-white hover:text-gray-200"
                                title={isPlaying ? "Pausa" : "Play"}
                              >
                                {isPlaying ? (
                                  <Pause size={24} />
                                ) : (
                                  <Play size={24} />
                                )}
                              </button>

                              <span className="text-white text-sm">
                                {formatTime(currentTime)}
                              </span>
                            </div>
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

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      {/* Barra di progresso principale */}
                      <div className="w-full h-2 bg-gray-200 mb-4">
                        <div
                          className="h-full bg-blue-500 transition-all duration-300"
                          style={{
                            width: `${Math.min(watchedPercentage, 100)}%`,
                          }}
                        />
                      </div>

                      {/* Contenitore principale */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Gruppo pulsanti */}
                        <div className="flex flex-wrap gap-2">
                          <Button
                            onClick={handleSaveProgress}
                            variant="outline"
                            className="hover:bg-blue-50 min-w-[100px]"
                          >
                            <BookmarkIcon className="h-4 w-4 mr-2" />
                            Salva
                          </Button>

                          <Button
                            onClick={handleResumeProgress}
                            variant="outline"
                            className="hover:bg-blue-50 min-w-[100px]"
                            disabled={!saved}
                          >
                            <PlayIcon className="h-4 w-4 mr-2" />
                            Riprendi
                          </Button>

                          {selectedCourse?.progress?.[selectedLesson?.id]
                            ?.completed ? (
                            <>
                              {getNextLesson() && (
                                <Button
                                  onClick={() => {
                                    setSelectedLesson(getNextLesson());
                                    setSelectedPDF(null);
                                  }}
                                  variant="outline"
                                  className="hover:bg-blue-50 text-blue-600 min-w-[140px]"
                                >
                                  <SquareArrowRight className="h-4 w-4 mr-2" />
                                  Lezione successiva
                                </Button>
                              )}
                            </>
                          ) : (
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
                            <span className="whitespace-nowrap">
                              Completamento:
                            </span>
                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 transition-all duration-300"
                                style={{
                                  width: `${Math.min(watchedPercentage, 100)}%`,
                                }}
                              />
                            </div>
                            <span className="min-w-[40px]">
                              {Math.round(watchedPercentage)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="prose max-w-none">
                      <div className="flex items-center gap-1 mb-4">
                        <h3 className="text-2xl font-semibold text-gray-900">
                          {selectedLesson.title}
                        </h3>
                      </div>

                      <div className="bg-white rounded-xl p-6 shadow-sm ring-1 ring-black/5">
                        <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                          {selectedLesson.description}
                        </p>
                      </div>
                    </div>

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
                                    ? "bg-blue-50 ring-1 ring-blue-200"
                                    : "bg-gray-50 hover:bg-gray-100"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <FileText
                                    className={`h-5 w-5 ${
                                      selectedPDF?.url === file.url
                                        ? "text-blue-500"
                                        : "text-red-500"
                                    }`}
                                  />
                                  <div>
                                    <p
                                      className={`font-medium ${
                                        selectedPDF?.url === file.url
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

                    {/* Render lesson test if available and lesson is completed */}
                    {renderLessonTest()}
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

              <div className="lg:col-span-1">
                <Card className="bg-white shadow-xl rounded-2xl border-0 overflow-hidden sticky top-8">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Lezioni del corso
                    </h3>
                    <p className="text-blue-100 mt-1">
                      {selectedCourse.lessons.length} lezioni disponibili
                    </p>
                  </div>
                  <CardContent className="p-6">
                    <ScrollArea className="h-[calc(100vh-400px)]">
                      <div className="space-y-4">
                        {selectedCourse.lessons.map((lesson, index) =>
                          renderLessonItem(lesson, index)
                        )}

                        {allLessonsCompleted && (
                          <div className="bg-white rounded-xl p-4 mt-4 border border-green-100 bg-green-50/50">
                            <div className="flex items-center gap-2 mb-4">
                              <CheckCircle className="h-6 w-6 text-green-600" />
                              <h4 className="text-lg font-semibold text-green-900">
                                Corso Completato!
                              </h4>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                              Hai completato tutte le lezioni
                            </p>
                            <Button
                              onClick={fillAndDownloadPDF}
                              variant="outline"
                              className="w-full"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Scarica Attestato
                            </Button>
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

  // Vista lista corsi
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
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
                className="pl-10 bg-white/50 backdrop-blur-sm border-gray-200 focus:border-blue-500 transition-colors"
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
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
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

                    <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
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
