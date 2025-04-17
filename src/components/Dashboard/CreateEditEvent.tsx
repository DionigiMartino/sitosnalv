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
  FileVideo,
  Trash2,
  Loader2,
  Calendar,
  MapPin,
  Youtube,
  Link,
  AlertCircle,
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
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

const CreateEditEvent = ({ existingEvent = null, onBack }) => {
  const [event, setEvent] = useState({
    title: existingEvent?.title || "",
    description: existingEvent?.description || "",
    date: existingEvent?.date
      ? format(existingEvent.date.toDate(), "yyyy-MM-dd")
      : "",
    location: existingEvent?.location || "",
    videos: existingEvent?.videos || [],
    files: existingEvent?.files || [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileUploads, setFileUploads] = useState({});
  const [urlError, setUrlError] = useState({});

  const handleEventChange = (field) => (e) => {
    const value = e.target.value;
    setEvent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddVideo = () => {
    setEvent((prev) => ({
      ...prev,
      videos: [
        ...prev.videos,
        {
          id: Date.now().toString(),
          title: "",
          description: "",
          youtubeUrl: "",
          videoId: "",
        },
      ],
    }));
  };

  const extractYoutubeId = (url) => {
    if (!url) return "";

    // Regex per estrarre l'ID da vari formati di URL YouTube
    const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
    const match = url.match(regExp);

    if (match && match[2].length === 11) {
      return match[2];
    }

    return "";
  };

  const validateYoutubeUrl = (url) => {
    if (!url) return false;

    const videoId = extractYoutubeId(url);
    if (!videoId) return false;

    return true;
  };

  const handleVideoChange = (videoId, field, value) => {
    setEvent((prev) => ({
      ...prev,
      videos: prev.videos.map((video) => {
        if (video.id === videoId) {
          if (field === "youtubeUrl") {
            const isValid = validateYoutubeUrl(value);
            setUrlError((prev) => ({
              ...prev,
              [videoId]: !isValid && value !== "",
            }));

            // Estrai e aggiorna l'ID del video YouTube
            const extractedVideoId = extractYoutubeId(value);
            return {
              ...video,
              [field]: value,
              videoId: extractedVideoId,
            };
          }
          return { ...video, [field]: value };
        }
        return video;
      }),
    }));
  };

  const handleDeleteVideo = (videoId) => {
    setEvent((prev) => ({
      ...prev,
      videos: prev.videos.filter((video) => video.id !== videoId),
    }));
    setUrlError((prev) => {
      const newErrors = { ...prev };
      delete newErrors[videoId];
      return newErrors;
    });
  };

  const handleAddFile = () => {
    setEvent((prev) => ({
      ...prev,
      files: [
        ...prev.files,
        {
          id: Date.now().toString(),
          title: "",
          file: null,
          filename: "",
          url: "",
        },
      ],
    }));
  };

  const handleFileChange = (fileId, field, value) => {
    setEvent((prev) => ({
      ...prev,
      files: prev.files.map((file) =>
        file.id === fileId ? { ...file, [field]: value } : file
      ),
    }));
  };

  const handleDeleteFile = (fileId) => {
    setEvent((prev) => ({
      ...prev,
      files: prev.files.filter((file) => file.id !== fileId),
    }));
  };

  const handleFileFileChange = (fileId, file) => {
    if (!file) return;

    handleFileChange(fileId, "file", file);
    handleFileChange(fileId, "filename", file.name);

    // Set upload progress tracking
    setFileUploads((prev) => ({
      ...prev,
      [fileId]: {
        progress: 0,
        status: "pending",
      },
    }));
  };

  const handleFileUpload = async (file, path) => {
    if (!file) return null;
    const storage = getStorage();
    const fileRef = ref(storage, `events/${path}/${file.name}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Controllo validità URL YouTube
    const hasInvalidUrls = event.videos.some((video) => urlError[video.id]);
    if (hasInvalidUrls) {
      toast({
        title: "Errore di validazione",
        description: "Uno o più URL di YouTube non sono validi",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Process files
      const processedFiles = await Promise.all(
        event.files.map(async (file) => {
          let fileData = { ...file };
          delete fileData.file; // Remove File object from data to store

          if (file.file) {
            const fileUrl = await handleFileUpload(
              file.file,
              `${file.id}/files`
            );
            fileData.url = fileUrl;
          }

          return fileData;
        })
      );

      const eventData = {
        title: event.title,
        description: event.description,
        date: event.date ? new Date(event.date) : null,
        location: event.location,
        videos: event.videos,
        files: processedFiles,
        updatedAt: serverTimestamp(),
      };

      if (existingEvent?.id) {
        await updateDoc(doc(db, "events", existingEvent.id), eventData);
      } else {
        // @ts-ignore
        eventData.createdAt = serverTimestamp();
        await addDoc(collection(db, "events"), eventData);
      }

      toast({
        title: existingEvent ? "Evento aggiornato!" : "Evento creato!",
        description: "L'operazione è stata completata con successo.",
      });
      onBack();
    } catch (error) {
      console.error("Error saving event:", error);
      toast({
        title: "Errore",
        description: "Impossibile salvare l'evento",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getYouTubeThumbnail = (videoId) => {
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="flex flex-row items-center justify-between sticky top-0 z-10 bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              {existingEvent ? "Modifica Evento" : "Nuovo Evento"}
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {existingEvent
                ? "Modifica i dettagli dell'evento"
                : "Inserisci i dettagli del nuovo evento"}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titolo dell'evento</Label>
              <Input
                id="title"
                value={event.title}
                onChange={handleEventChange("title")}
                placeholder="Inserisci il titolo dell'evento"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrizione dell'evento</Label>
              <Textarea
                id="description"
                value={event.description}
                onChange={handleEventChange("description")}
                placeholder="Inserisci la descrizione dell'evento"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Data dell'evento</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="date"
                    type="date"
                    value={event.date}
                    onChange={handleEventChange("date")}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Località</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="location"
                    value={event.location}
                    onChange={handleEventChange("location")}
                    placeholder="Inserisci la località dell'evento"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Videos Section - Modificato per YouTube */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Video dell'evento</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddVideo}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Aggiungi Video
                </Button>
              </div>

              {event.videos.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <Youtube className="h-8 w-8 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Nessun video presente
                  </p>
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleAddVideo}
                    className="mt-2"
                  >
                    Aggiungi il primo video
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {event.videos.map((video, index) => (
                    <div
                      key={video.id}
                      className="border rounded-lg p-4 bg-white shadow-sm"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium flex items-center gap-2">
                          <Youtube className="h-5 w-5 text-red-500" />
                          Video {index + 1}
                        </h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteVideo(video.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`video-title-${video.id}`}>
                            Titolo del video
                          </Label>
                          <Input
                            id={`video-title-${video.id}`}
                            value={video.title}
                            onChange={(e) =>
                              handleVideoChange(
                                video.id,
                                "title",
                                e.target.value
                              )
                            }
                            placeholder="Inserisci il titolo del video"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor={`video-description-${video.id}`}>
                            Descrizione del video
                          </Label>
                          <Textarea
                            id={`video-description-${video.id}`}
                            value={video.description}
                            onChange={(e) =>
                              handleVideoChange(
                                video.id,
                                "description",
                                e.target.value
                              )
                            }
                            placeholder="Inserisci una breve descrizione del video"
                            rows={2}
                          />
                        </div>

                        <div>
                          <Label
                            htmlFor={`video-url-${video.id}`}
                            className="flex items-center"
                          >
                            <Link className="h-4 w-4 mr-2" />
                            URL YouTube
                          </Label>
                          <div className="mt-1 relative">
                            <Input
                              id={`video-url-${video.id}`}
                              value={video.youtubeUrl}
                              onChange={(e) =>
                                handleVideoChange(
                                  video.id,
                                  "youtubeUrl",
                                  e.target.value
                                )
                              }
                              placeholder="https://www.youtube.com/watch?v=..."
                              className={
                                urlError[video.id] ? "border-red-500 pr-10" : ""
                              }
                            />
                            {urlError[video.id] && (
                              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500">
                                <AlertCircle className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          {urlError[video.id] && (
                            <p className="text-sm text-red-500 mt-1">
                              URL YouTube non valido
                            </p>
                          )}

                          {video.videoId && !urlError[video.id] && (
                            <div className="mt-3 border rounded-lg overflow-hidden">
                              <img
                                src={getYouTubeThumbnail(video.videoId)}
                                alt="Anteprima YouTube"
                                className="w-full h-40 object-cover"
                              />
                              <div className="p-3 bg-gray-50">
                                <p className="text-sm text-gray-600">
                                  Video ID: {video.videoId}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Files Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>File dell'evento</Label>
                <Button type="button" variant="outline" onClick={handleAddFile}>
                  <Plus className="h-4 w-4 mr-2" />
                  Aggiungi File
                </Button>
              </div>

              {event.files.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <FileText className="h-8 w-8 mx-auto text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Nessun file presente
                  </p>
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleAddFile}
                    className="mt-2"
                  >
                    Aggiungi il primo file
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {event.files.map((file, index) => (
                    <div
                      key={file.id}
                      className="border rounded-lg p-4 bg-white shadow-sm"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium flex items-center gap-2">
                          <FileText className="h-5 w-5 text-red-500" />
                          File {index + 1}
                        </h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFile(file.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`file-title-${file.id}`}>
                            Titolo del file
                          </Label>
                          <Input
                            id={`file-title-${file.id}`}
                            value={file.title}
                            onChange={(e) =>
                              handleFileChange(file.id, "title", e.target.value)
                            }
                            placeholder="Inserisci il titolo del file"
                            required
                          />
                        </div>

                        <div>
                          <Label>File</Label>
                          {file.url || file.file ? (
                            <div className="mt-2 p-4 bg-gray-50 rounded-lg border">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <FileText className="h-8 w-8 text-red-500" />
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {file.filename}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {file.file
                                        ? "File in attesa di caricamento"
                                        : "File già caricato"}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    handleFileChange(file.id, "file", null);
                                    handleFileChange(file.id, "filename", "");
                                    if (!file.url) {
                                      handleFileChange(file.id, "url", "");
                                    }
                                  }}
                                  className="text-red-500 hover:bg-red-50"
                                >
                                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                                  Rimuovi
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="mt-2 border-2 border-dashed rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                              onClick={() =>
                                document
                                  .getElementById(`file-upload-${file.id}`)
                                  ?.click()
                              }
                            >
                              <div className="text-center">
                                <FileText className="h-8 w-8 mx-auto text-gray-400" />
                                <p className="mt-2 text-sm font-medium text-blue-500">
                                  Carica file
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                  PDF, DOCX, PPT o altri documenti (max 50MB)
                                </p>
                                <input
                                  id={`file-upload-${file.id}`}
                                  type="file"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleFileFileChange(
                                      file.id,
                                      e.target.files?.[0]
                                    )
                                  }
                                />
                              </div>
                            </div>
                          )}
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
                    : existingEvent
                    ? "Aggiorna Evento"
                    : "Crea Evento"}
                </Button>
              </div>
            </div>
          </form>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CreateEditEvent;
