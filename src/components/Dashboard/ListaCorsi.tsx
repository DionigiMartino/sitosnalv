import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  FileVideo,
  FileText,
  Loader2,
} from "lucide-react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { db } from "@/src/lib/firebase";

const CourseList = ({ onNewCourse, onEditCourse }) => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

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

  const handleDeleteClick = (course) => {
    setCourseToDelete(course);
    setShowDeleteDialog(true);
  };

  const deleteCourse = async () => {
    if (!courseToDelete) return;

    setIsLoading(true);
    try {
      const storage = getStorage();

      // Delete all files for each lesson
      await Promise.all(
        courseToDelete.lessons.map(async (lesson) => {
          // Delete video if exists
          if (lesson.video?.url) {
            const videoRef = ref(storage, lesson.video.url);
            await deleteObject(videoRef).catch((error) => {
              console.error("Error deleting video:", error);
            });
          }

          // Delete all lesson files
          if (lesson.files?.length > 0) {
            await Promise.all(
              lesson.files.map(async (file) => {
                if (file.url) {
                  const fileRef = ref(storage, file.url);
                  await deleteObject(fileRef).catch((error) => {
                    console.error("Error deleting file:", error);
                  });
                }
              })
            );
          }
        })
      );

      // Delete document from Firestore
      await deleteDoc(doc(db, "courses", courseToDelete.id));

      await fetchCourses();
      setShowDeleteDialog(false);
      setCourseToDelete(null);
      alert("Corso eliminato con successo!");
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Errore durante l'eliminazione del corso");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <>
      <Card className="bg-white shadow-md">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Gestione Corsi
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Gestisci i tuoi corsi e lezioni
            </p>
          </div>
          <Button
            onClick={onNewCourse}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Nuovo Corso
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Nessun corso presente
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Inizia creando il tuo primo corso
              </p>
              <Button onClick={onNewCourse} variant="outline" className="mt-4">
                <PlusCircle className="h-4 w-4 mr-2" />
                Crea Corso
              </Button>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead>Titolo</TableHead>
                    <TableHead>Lezioni</TableHead>
                    <TableHead>Ultima modifica</TableHead>
                    <TableHead className="w-[100px]">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">
                        {course.title}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{course.lessons.length} lezioni</span>
                          {course.lessons.some((lesson) => lesson.video) && (
                            <FileVideo className="h-4 w-4 text-blue-500" />
                          )}
                          {course.lessons.some(
                            (lesson) => lesson.files?.length > 0
                          ) && <FileText className="h-4 w-4 text-red-500" />}
                        </div>
                      </TableCell>
                      <TableCell>
                        {course.updatedAt
                          ?.toDate()
                          .toLocaleDateString("it-IT", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEditCourse(course)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(course)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conferma eliminazione</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Sei sicuro di voler eliminare questo corso?</p>
            <p className="font-medium mt-2">{courseToDelete?.title}</p>
            <p className="text-sm text-gray-500 mt-1">
              Questa azione eliminerà anche tutti i file associati.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isLoading}
            >
              Annulla
            </Button>
            <Button
              onClick={deleteCourse}
              disabled={isLoading}
              variant="destructive"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Eliminazione...
                </>
              ) : (
                "Elimina"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CourseList;
