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
  Calendar,
  MapPin,
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
import { format } from "date-fns";
import { it } from "date-fns/locale";

const EventList = ({ onNewEvent, onEditEvent }) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const eventsQuery = query(
        collection(db, "events"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(eventsQuery);
      const eventsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setShowDeleteDialog(true);
  };

  const deleteEvent = async () => {
    if (!eventToDelete) return;

    setIsLoading(true);
    try {
      const storage = getStorage();

      // Delete all videos if they exist
      if (eventToDelete.videos?.length > 0) {
        await Promise.all(
          eventToDelete.videos.map(async (video) => {
            if (video.url) {
              const videoRef = ref(storage, video.url);
              await deleteObject(videoRef).catch((error) => {
                console.error("Error deleting video:", error);
              });
            }
          })
        );
      }

      // Delete all files if they exist
      if (eventToDelete.files?.length > 0) {
        await Promise.all(
          eventToDelete.files.map(async (file) => {
            if (file.url) {
              const fileRef = ref(storage, file.url);
              await deleteObject(fileRef).catch((error) => {
                console.error("Error deleting file:", error);
              });
            }
          })
        );
      }

      // Delete document from Firestore
      await deleteDoc(doc(db, "events", eventToDelete.id));

      await fetchEvents();
      setShowDeleteDialog(false);
      setEventToDelete(null);
      alert("Evento eliminato con successo!");
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Errore durante l'eliminazione dell'evento");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateObj) => {
    if (!dateObj) return "";
    // Check if it's a Firebase timestamp
    if (dateObj.toDate) {
      return format(dateObj.toDate(), "d MMMM yyyy", { locale: it });
    }
    // Check if it's a string that needs to be parsed
    if (typeof dateObj === "string") {
      return format(new Date(dateObj), "d MMMM yyyy", { locale: it });
    }
    // Assume it's already a Date object
    return format(dateObj, "d MMMM yyyy", { locale: it });
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
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-indigo-50 to-blue-50">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Gestione Eventi
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Gestisci gli eventi e i relativi contenuti
            </p>
          </div>
          <Button
            onClick={onNewEvent}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Nuovo Evento
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          {events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Nessun evento presente
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Inizia creando il tuo primo evento
              </p>
              <Button onClick={onNewEvent} variant="outline" className="mt-4">
                <PlusCircle className="h-4 w-4 mr-2" />
                Crea Evento
              </Button>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead>Titolo</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Località</TableHead>
                    <TableHead>Contenuti</TableHead>
                    <TableHead>Ultima modifica</TableHead>
                    <TableHead className="w-[100px]">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">
                        {event.title}
                      </TableCell>
                      <TableCell>
                        {event.date ? formatDate(event.date) : "N/D"}
                      </TableCell>
                      <TableCell>{event.location || "N/D"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {event.videos?.length > 0 && (
                            <div className="flex items-center gap-1">
                              <FileVideo className="h-4 w-4 text-blue-500" />
                              <span>{event.videos.length} video</span>
                            </div>
                          )}
                          {event.files?.length > 0 && (
                            <div className="flex items-center gap-1 ml-2">
                              <FileText className="h-4 w-4 text-red-500" />
                              <span>{event.files.length} file</span>
                            </div>
                          )}
                          {!event.videos?.length && !event.files?.length && (
                            <span className="text-gray-500">
                              Nessun contenuto
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {event.updatedAt
                          ? format(event.updatedAt.toDate(), "dd/MM/yyyy HH:mm")
                          : "N/D"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEditEvent(event)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(event)}
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
            <p>Sei sicuro di voler eliminare questo evento?</p>
            <p className="font-medium mt-2">{eventToDelete?.title}</p>
            <p className="text-sm text-gray-500 mt-1">
              Questa azione eliminerà anche tutti i file e i video associati.
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
              onClick={deleteEvent}
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

export default EventList;
