import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  FileVideo,
  FileText,
  Loader2,
  Download,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";

const Webinar = () => {
  const [webinars, setWebinars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [webinarToDelete, setWebinarToDelete] = useState(null);
  const [selectedWebinar, setSelectedWebinar] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [pdfs, setPdfs] = useState([]); // Array of {file, title, url}
  const [uploadProgress, setUploadProgress] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [dragActiveVideo, setDragActiveVideo] = useState(false);

  useEffect(() => {
    fetchWebinars();
  }, []);

  const fetchWebinars = async () => {
    try {
      const webinarQuery = query(
        collection(db, "webinars"),
        orderBy("createdAt", "desc")
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

  const handleVideoUpload = async (file) => {
    if (!file) return null;

    const storage = getStorage();
    const fileRef = ref(storage, `webinars/videos/${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    return url;
  };

  const handlePdfUpload = async (file) => {
    if (!file) return null;

    const storage = getStorage();
    const fileRef = ref(storage, `webinars/pdfs/${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    return url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadProgress(true);

    try {
      let videoData = null;
      if (video) {
        const url = await handleVideoUpload(video);
        videoData = {
          url,
          title: videoTitle,
        };
      }

      const data = {
        title,
        date: new Date(date),
        description,
        video: videoData || selectedWebinar?.video,
        pdfs: [...pdfs],
        updatedAt: serverTimestamp(),
        createdAt: selectedWebinar?.createdAt || serverTimestamp(),
      };

      if (selectedWebinar?.id) {
        const docRef = doc(db, "webinars", selectedWebinar.id);
        await updateDoc(docRef, data);
      } else {
        await addDoc(collection(db, "webinars"), data);
      }

      await fetchWebinars();
      resetForm();
      setShowForm(false);
      alert(selectedWebinar?.id ? "Webinar aggiornato!" : "Webinar creato!");
    } catch (error) {
      console.error("Error saving webinar:", error);
      alert("Errore durante il salvataggio");
    } finally {
      setUploadProgress(false);
    }
  };

  const handlePdfAdd = async (file) => {
    try {
      setUploadProgress(true);
      const url = await handlePdfUpload(file);
      setPdfs((prev) => [
        ...prev,
        {
          url,
          title: "",
          filename: file.name,
        },
      ]);
    } catch (error) {
      console.error("Error uploading PDF:", error);
      alert("Errore durante il caricamento del PDF");
    } finally {
      setUploadProgress(false);
    }
  };

  const updatePdfTitle = (index, title) => {
    setPdfs((prev) =>
      prev.map((pdf, i) => (i === index ? { ...pdf, title } : pdf))
    );
  };

  const removePdf = (index) => {
    setPdfs((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setTitle("");
    setDate("");
    setDescription("");
    setVideo(null);
    setVideoUrl("");
    setVideoTitle("");
    setPdfs([]);
    setSelectedWebinar(null);
  };

  const handleDeleteClick = (webinar) => {
    setWebinarToDelete(webinar);
    setShowDeleteDialog(true);
  };

  const deleteWebinar = async () => {
    if (!webinarToDelete) return;

    setIsLoading(true);
    try {
      // Delete video if exists
      if (webinarToDelete.video?.url) {
        const storage = getStorage();
        const videoRef = ref(storage, webinarToDelete.video.url);
        await deleteObject(videoRef);
      }

      // Delete PDFs if exist
      if (webinarToDelete.pdfs?.length > 0) {
        const storage = getStorage();
        await Promise.all(
          webinarToDelete.pdfs.map(async (pdf) => {
            const pdfRef = ref(storage, pdf.url);
            await deleteObject(pdfRef);
          })
        );
      }

      await deleteDoc(doc(db, "webinars", webinarToDelete.id));
      await fetchWebinars();
      setShowDeleteDialog(false);
      setWebinarToDelete(null);
      alert("Webinar eliminato!");
    } catch (error) {
      console.error("Error deleting webinar:", error);
      alert("Errore durante l'eliminazione");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <>
      <Card className="bg-white shadow-md">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Gestione Webinar
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Gestisci i tuoi webinar e materiali formativi
            </p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Nuovo Webinar
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-lg border border-gray-100 overflow-hidden">
            <Table className="border-collapse">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Titolo</TableHead>
                  <TableHead>Materiali</TableHead>
                  <TableHead>Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webinars.map((webinar) => (
                  <TableRow key={webinar.id}>
                    <TableCell>{formatDate(webinar.date)}</TableCell>
                    <TableCell>{webinar.title}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {webinar.video && (
                          <FileVideo className="h-4 w-4 text-blue-500" />
                        )}
                        {webinar.pdfs?.length > 0 && (
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-red-500" />
                            <span className="text-sm ml-1">
                              ({webinar.pdfs.length})
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedWebinar(webinar);
                          setIsViewMode(true);
                          setShowForm(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedWebinar(webinar);
                          setIsViewMode(false);
                          setShowForm(true);
                          setTitle(webinar.title);
                          setDate(webinar.date.toISOString().slice(0, 16));
                          setDescription(webinar.description);
                          setVideoTitle(webinar.video?.title || "");
                          setVideoUrl(webinar.video?.url || "");
                          setPdfs(webinar.pdfs || []);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteClick(webinar)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl">
          <ScrollArea className="max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>
                {isViewMode
                  ? "Visualizza Webinar"
                  : selectedWebinar
                  ? "Modifica Webinar"
                  : "Nuovo Webinar"}
              </DialogTitle>
            </DialogHeader>

            {isViewMode ? (
              <div className="space-y-6 p-4">
                <div>
                  <h3 className="text-2xl font-bold">
                    {selectedWebinar?.title}
                  </h3>
                  <p className="text-gray-500">
                    {formatDate(selectedWebinar?.date)}
                  </p>
                </div>

                <div className="prose max-w-none">
                  {selectedWebinar?.description}
                </div>

                {selectedWebinar?.video && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Video</h4>
                    <div className="flex items-center gap-2">
                      <FileVideo className="h-4 w-4 text-blue-500" />
                      <span>{selectedWebinar.video.title}</span>
                      <a
                        href={selectedWebinar.video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Guarda
                      </a>
                    </div>
                  </div>
                )}

                {selectedWebinar?.pdfs?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Materiali PDF</h4>
                    <div className="space-y-2">
                      {selectedWebinar.pdfs.map((pdf, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-red-500" />
                          <span>{pdf.title || pdf.filename}</span>
                          <a
                            href={pdf.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-700"
                          >
                            Scarica
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 p-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titolo</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrizione</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Video del Webinar</Label>
                  <div
                    className={`
                      border-2 border-dashed rounded-lg p-6 
                      ${
                        dragActiveVideo
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      }
                      transition-colors duration-200 text-center
                      ${videoUrl || video ? "border-green-500 bg-green-50" : ""}
                    `}
                    onDragEnter={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragActiveVideo(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragActiveVideo(false);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragActiveVideo(false);

                      const file = e.dataTransfer.files[0];
                      if (!file?.type.startsWith("video/")) {
                        alert("Per favore, carica solo file video");
                        return;
                      }
                      setVideo(file);
                    }}
                  >
                    {videoUrl || video ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center">
                          <div className="bg-white p-4 rounded-lg shadow-sm w-full max-w-md">
                            <div className="flex items-center gap-3">
                              <FileVideo className="h-8 w-8 text-blue-500" />
                              <div className="flex-1">
                                <Input
                                  placeholder="Titolo del video"
                                  value={videoTitle}
                                  onChange={(e) =>
                                    setVideoTitle(e.target.value)
                                  }
                                  className="border-0 border-b focus:ring-0"
                                  required
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  {video?.name || "Video caricato"}
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setVideo(null);
                                  setVideoUrl("");
                                  setVideoTitle("");
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <FileVideo className="h-12 w-12 text-gray-400" />
                          <div className="space-y-2 text-center">
                            <p className="text-sm text-gray-600">
                              Trascina il video qui o{" "}
                              <label className="text-blue-500 hover:text-blue-700 cursor-pointer">
                                selezionalo dal tuo computer
                                <input
                                  type="file"
                                  accept="video/*"
                                  className="hidden"
                                  onChange={(e) => setVideo(e.target.files[0])}
                                />
                              </label>
                            </p>
                            <p className="text-xs text-gray-500">
                              Formati supportati: MP4, WebM, MOV (max 500MB)
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Materiali PDF</Label>
                  <div
                    className={`
                      border-2 border-dashed rounded-lg p-6 
                      ${
                        dragActive
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      }
                      transition-colors duration-200 text-center
                    `}
                    onDragEnter={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragActive(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragActive(false);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragActive(false);

                      const files = Array.from(e.dataTransfer.files).filter(
                        (file) => file.type === "application/pdf"
                      );

                      if (files.length === 0) {
                        alert("Per favore, carica solo file PDF");
                        return;
                      }

                      setUploadProgress(true);
                      try {
                        await Promise.all(files.map(handlePdfAdd));
                      } catch (error) {
                        console.error("Error uploading PDFs:", error);
                        alert("Errore durante il caricamento di alcuni PDF");
                      } finally {
                        setUploadProgress(false);
                      }
                    }}
                  >
                    <div className="space-y-4">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FileText className="h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          Trascina i file PDF qui o{" "}
                          <label className="text-blue-500 hover:text-blue-700 cursor-pointer">
                            selezionali dal tuo computer
                            <input
                              type="file"
                              multiple
                              accept=".pdf"
                              className="hidden"
                              onChange={async (e) => {
                                const files = Array.from(e.target.files);
                                setUploadProgress(true);
                                try {
                                  await Promise.all(files.map(handlePdfAdd));
                                } catch (error) {
                                  console.error("Error uploading PDFs:", error);
                                  alert(
                                    "Errore durante il caricamento di alcuni PDF"
                                  );
                                } finally {
                                  setUploadProgress(false);
                                }
                              }}
                            />
                          </label>
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF (max 10MB per file)
                        </p>
                      </div>

                      {uploadProgress && (
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                          <span className="ml-2 text-sm text-gray-600">
                            Caricamento in corso...
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Lista dei PDF caricati */}
                  <div className="mt-4 space-y-2">
                    {pdfs.map((pdf, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg"
                      >
                        <FileText className="h-4 w-4 text-red-500 flex-shrink-0" />
                        <Input
                          placeholder="Titolo del PDF"
                          value={pdf.title}
                          onChange={(e) =>
                            updatePdfTitle(index, e.target.value)
                          }
                          required
                        />
                        <p className="text-xs text-gray-500 truncate flex-shrink-0">
                          {pdf.filename}
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removePdf(index)}
                          className="flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <DialogFooter>
                  <Button type="submit" disabled={uploadProgress}>
                    {uploadProgress && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {uploadProgress
                      ? "Caricamento..."
                      : selectedWebinar
                      ? "Aggiorna"
                      : "Crea"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conferma eliminazione</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Sei sicuro di voler eliminare questo webinar?</p>
            <p className="font-medium mt-2">{webinarToDelete?.title}</p>
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
              onClick={deleteWebinar}
              disabled={isLoading}
              variant="destructive"
            >
              {isLoading ? "Eliminazione..." : "Elimina"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Webinar;
