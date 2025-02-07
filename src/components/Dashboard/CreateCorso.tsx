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
    test: existingCourse?.test || { questions: [] },
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
        },
      ],
    }));
  };

  const handleAddCourseTestQuestion = () => {
    setCourse((prev) => ({
      ...prev,
      test: {
        ...prev.test,
        questions: [
          ...(prev.test?.questions || []),
          {
            question: "",
            answers: [
              { text: "", isCorrect: false },
              { text: "", isCorrect: false },
              { text: "", isCorrect: false },
              { text: "", isCorrect: false },
            ],
          },
        ],
      },
    }));
  };

  const handleCourseTestChange = (
    questionIndex,
    field,
    value,
    answerIndex = null
  ) => {
    setCourse((prev) => {
      if (!prev.test?.questions) return prev;

      const updatedQuestions = [...prev.test.questions];

      if (field === "question") {
        updatedQuestions[questionIndex] = {
          ...updatedQuestions[questionIndex],
          question: value,
        };
      }

      if (field === "answer") {
        const updatedAnswers = [...updatedQuestions[questionIndex].answers];
        updatedAnswers[answerIndex] = {
          ...updatedAnswers[answerIndex],
          text: value,
        };
        updatedQuestions[questionIndex] = {
          ...updatedQuestions[questionIndex],
          answers: updatedAnswers,
        };
      }

      if (field === "correctAnswer") {
        const updatedAnswers = updatedQuestions[questionIndex].answers.map(
          (answer, index) => ({
            ...answer,
            isCorrect: index === answerIndex,
          })
        );
        updatedQuestions[questionIndex] = {
          ...updatedQuestions[questionIndex],
          answers: updatedAnswers,
        };
      }

      return {
        ...prev,
        test: {
          ...prev.test,
          questions: updatedQuestions,
        },
      };
    });
  };

  const handleDeleteCourseTestQuestion = (questionIndex) => {
    setCourse((prev) => ({
      ...prev,
      test: {
        ...prev.test,
        questions: prev.test.questions.filter(
          (_, index) => index !== questionIndex
        ),
      },
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
        test: course.test,
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

            {/* Sezione Test del Corso */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <Label className="flex items-center gap-2">
                  Test del Corso
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddCourseTestQuestion}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Aggiungi Domanda
                </Button>
              </div>

              {course.test?.questions?.length > 0 && (
                <div className="space-y-6">
                  {course.test.questions.map((testQuestion, questionIndex) => (
                    <div
                      key={questionIndex}
                      className="bg-white p-4 rounded-lg border relative"
                    >
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() =>
                          handleDeleteCourseTestQuestion(questionIndex)
                        }
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Domanda {questionIndex + 1}</Label>
                          <Input
                            value={testQuestion.question}
                            onChange={(e) =>
                              handleCourseTestChange(
                                questionIndex,
                                "question",
                                e.target.value
                              )
                            }
                            placeholder="Inserisci la domanda del test"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Risposte</Label>
                          {testQuestion.answers.map((answer, answerIndex) => (
                            <div
                              key={answerIndex}
                              className="flex items-center space-x-2"
                            >
                              <Input
                                value={answer.text}
                                onChange={(e) =>
                                  handleCourseTestChange(
                                    questionIndex,
                                    "answer",
                                    e.target.value,
                                    answerIndex
                                  )
                                }
                                placeholder={`Risposta ${answerIndex + 1}`}
                                className="flex-grow"
                              />
                              <Button
                                type="button"
                                variant={
                                  answer.isCorrect ? "default" : "outline"
                                }
                                size="icon"
                                onClick={() =>
                                  handleCourseTestChange(
                                    questionIndex,
                                    "correctAnswer",
                                    null,
                                    answerIndex
                                  )
                                }
                              >
                                {answer.isCorrect ? (
                                  <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                  <CheckCircle2 className="h-4 w-4 text-gray-400" />
                                )}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
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
