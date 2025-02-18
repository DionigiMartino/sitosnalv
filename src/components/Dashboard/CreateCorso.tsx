import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  ArrowLeft,
  FileText,
  Trash2,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import LessonForm from "./NuovaLezione";

const CreateEditCourse = ({ existingCourse = null, onBack }) => {
  const [course, setCourse] = useState({
    title: existingCourse?.title || "",
    description: existingCourse?.description || "",
    lessons: existingCourse?.lessons || [],
    program: existingCourse?.program || null,
    instructions: existingCourse?.instructions || null, // Aggiunto il campo instructions
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCourseChange = (field) => (e) => {
    const value = e.target.value;
    setCourse((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLessonChange = (lessonId, field, value) => {
    setCourse((prev) => ({
      ...prev,
      lessons: prev.lessons.map((lesson) =>
        lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
      ),
    }));
  };

  const handleDeleteLesson = (lessonId) => {
    setCourse((prev) => ({
      ...prev,
      lessons: prev.lessons.filter((lesson) => lesson.id !== lessonId),
    }));
  };

  const handleAddLesson = () => {
    setCourse((prev) => ({
      ...prev,
      lessons: [
        ...prev.lessons,
        {
          id: Date.now(),
          title: "",
          description: "",
          video: null,
          files: [],
          test: null,
        },
      ],
    }));
  };

  const handleFileUpload = async (file, path) => {
    if (!file) return null;
    const storage = getStorage();
    const fileRef = ref(storage, `courses/${path}/${file.name}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let programData = course.program;
      if (course.program?.file) {
        const programUrl = await handleFileUpload(
          course.program.file,
          `programs/${Date.now()}`
        );
        programData = {
          url: programUrl,
          filename: course.program.filename,
        };
      }

      // Gestione del caricamento delle istruzioni
      let instructionsData = course.instructions;
      if (course.instructions?.file) {
        const instructionsUrl = await handleFileUpload(
          course.instructions.file,
          `instructions/${Date.now()}`
        );
        instructionsData = {
          url: instructionsUrl,
          filename: course.instructions.filename,
        };
      }

      const processedLessons = await Promise.all(
        course.lessons.map(async (lesson) => {
          let videoData = lesson.video;
          if (lesson.video?.file) {
            const videoUrl = await handleFileUpload(
              lesson.video.file,
              `${lesson.id}/videos`
            );
            videoData = {
              url: videoUrl,
              title: lesson.video.title,
              filename: lesson.video.filename,
            };
          }

          const processedFiles = await Promise.all(
            (lesson.files || []).map(async (file) => {
              if (file.file) {
                const fileUrl = await handleFileUpload(
                  file.file,
                  `${lesson.id}/files`
                );
                return {
                  url: fileUrl,
                  title: file.title,
                  filename: file.filename,
                };
              }
              return file;
            })
          );

          return {
            ...lesson,
            video: videoData,
            files: processedFiles,
          };
        })
      );

      const courseData = {
        title: course.title,
        description: course.description,
        lessons: processedLessons,
        program: programData,
        instructions: instructionsData, // Aggiunto al courseData
        updatedAt: serverTimestamp(),
      };

      if (existingCourse?.id) {
        await updateDoc(doc(db, "courses", existingCourse.id), courseData);
      } else {
        // @ts-ignore
        courseData.createdAt = serverTimestamp();
        await addDoc(collection(db, "courses"), courseData);
      }

      alert(existingCourse ? "Corso aggiornato!" : "Corso creato!");
      onBack();
    } catch (error) {
      console.error("Error saving course:", error);
      alert("Errore durante il salvataggio");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="flex flex-row items-center justify-between sticky top-0 z-10 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              {existingCourse ? "Modifica Corso" : "Nuovo Corso"}
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {existingCourse
                ? "Modifica i dettagli del corso"
                : "Inserisci i dettagli del nuovo corso"}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titolo del corso</Label>
              <Input
                id="title"
                value={course.title}
                onChange={handleCourseChange("title")}
                placeholder="Inserisci il titolo del corso"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrizione del corso</Label>
              <Textarea
                id="description"
                value={course.description}
                onChange={handleCourseChange("description")}
                placeholder="Inserisci la descrizione del corso"
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Programma del corso (PDF)</Label>
              <div
                className={`
                  border-2 border-dashed rounded-lg p-6 
                  ${
                    course.program
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300"
                  }
                  transition-colors duration-200 text-center
                `}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file?.type === "application/pdf") {
                    setCourse((prev) => ({
                      ...prev,
                      program: {
                        file,
                        filename: file.name,
                      },
                    }));
                  } else {
                    alert("Per favore, carica solo file PDF");
                  }
                }}
              >
                {course.program ? (
                  <div className="flex items-center justify-center gap-4">
                    <FileText className="h-8 w-8 text-purple-500" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">
                        {course.program.filename}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setCourse((prev) => ({ ...prev, program: null }))
                      }
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <FileText className="h-8 w-8 text-gray-400 mx-auto" />
                    <div className="text-center">
                      <label className="text-purple-500 hover:text-purple-700 cursor-pointer">
                        Carica programma
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setCourse((prev) => ({
                                ...prev,
                                program: {
                                  file,
                                  filename: file.name,
                                },
                              }));
                            }
                          }}
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Solo file PDF (max 10MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Nuovo campo per le istruzioni del corso */}
            <div className="space-y-2">
              <Label>Istruzioni del corso (PDF)</Label>
              <div
                className={`
                  border-2 border-dashed rounded-lg p-6 
                  ${
                    course.instructions
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300"
                  }
                  transition-colors duration-200 text-center
                `}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file?.type === "application/pdf") {
                    setCourse((prev) => ({
                      ...prev,
                      instructions: {
                        file,
                        filename: file.name,
                      },
                    }));
                  } else {
                    alert("Per favore, carica solo file PDF");
                  }
                }}
              >
                {course.instructions ? (
                  <div className="flex items-center justify-center gap-4">
                    <FileText className="h-8 w-8 text-purple-500" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">
                        {course.instructions.filename}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setCourse((prev) => ({ ...prev, instructions: null }))
                      }
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <FileText className="h-8 w-8 text-gray-400 mx-auto" />
                    <div className="text-center">
                      <label className="text-purple-500 hover:text-purple-700 cursor-pointer">
                        Carica istruzioni
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setCourse((prev) => ({
                                ...prev,
                                instructions: {
                                  file,
                                  filename: file.name,
                                },
                              }));
                            }
                          }}
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Solo file PDF (max 10MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Lezioni</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddLesson}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Aggiungi Lezione
                </Button>
              </div>

              {course.lessons.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <FileText className="h-8 w-8 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Nessuna lezione presente
                  </p>
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleAddLesson}
                    className="mt-2"
                  >
                    Aggiungi la prima lezione
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {course.lessons.map((lesson, index) => (
                    <LessonForm
                      key={lesson.id}
                      lesson={lesson}
                      index={index}
                      onLessonChange={handleLessonChange}
                      onDelete={handleDeleteLesson}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="sticky bottom-0 pt-6 pb-2 bg-white border-t mt-8">
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  disabled={isSubmitting}
                >
                  Annulla
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isSubmitting
                    ? "Salvataggio..."
                    : existingCourse
                    ? "Aggiorna Corso"
                    : "Crea Corso"}
                </Button>
              </div>
            </div>
          </form>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CreateEditCourse;
