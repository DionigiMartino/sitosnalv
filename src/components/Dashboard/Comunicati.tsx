import { useState, useEffect } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Image,
  Link,
  Bold,
  Underline,
  Italic,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
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
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

const News = () => {
  // Stati per la lista
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Stati per il form
  const [showForm, setShowForm] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState(null);

  // Stati per i campi del form
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [linkNews, setLinkNews] = useState("");
  const [isDuplicateLink, setIsDuplicateLink] = useState(false);

  // Modifica l'useEffect esistente per impostare lo stato di duplicazione
  useEffect(() => {
    const linkExists = news.some((item) => item.linkNews === linkNews);
    setIsDuplicateLink(linkExists);
  }, [news, linkNews]);

  const availableCategories = [
    "Fragili",
    "Socio Sanitario",
    "Enti Locali",
    "Dipartimento SUD",
    "Servizi",
    "In Evidenza",
    "Territorio",
  ];

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    if (selectedNews) {
      setTitle(selectedNews.title || "");
      setContent(selectedNews.content || "");
      setLinkNews(selectedNews.linkNews || "");
      setSelectedCategories(selectedNews.categories || []); // Aggiorna per usare l'array
      setImages(selectedNews.images || []);
      setCoverImage(selectedNews.coverImage || "");
    } else {
      resetForm();
    }
  }, [selectedNews]);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setLinkNews("");
    setSelectedCategories([]); // Reset categorie multiple
    setImages([]);
    setLinkUrl("");
    setLinkText("");
    setCoverImage("");
  };

  const fetchNews = async () => {
    try {
      const newsQuery = query(
        collection(db, "comunicati"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(newsQuery);
      const newsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      }));
      setNews(newsData);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `comunicati/cover/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setCoverImage(url);
    } catch (error) {
      console.error("Error uploading cover image:", error);
      alert("Errore durante il caricamento della copertina");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setIsLoading(true);

    try {
      const storage = getStorage();
      const uploadPromises = files.map(async (file) => {
        // @ts-ignore
        const storageRef = ref(storage, `comunicati/${file.name}`);
        // @ts-ignore

        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
      });

      const urls = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...urls]);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const insertLink = () => {
    if (!linkUrl || !linkText) return;

    const textarea = document.querySelector("textarea");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const linkMarkdown = `[${linkText}](${linkUrl})`;
    const newContent =
      content.substring(0, start) + linkMarkdown + content.substring(end);
    setContent(newContent);

    setLinkUrl("");
    setLinkText("");
    setIsLinkDialogOpen(false);
  };

  const handleTextFormat = (format) => {
    const textarea = document.querySelector("textarea");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let formattedText = "";
    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`;
        break;
      case "italic":
        formattedText = `*${selectedText}*`;
        break;
      case "underline":
        formattedText = `__${selectedText}__`;
        break;
      default:
        formattedText = selectedText;
    }

    const newContent =
      content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
  };

  useEffect(() => {
    if (news.some((item) => item.linkNews === linkNews)) {
      console.log("Link trovato");
    } else {
      console.log("Non trovato");
    }
  }, [news, linkNews]); // Array di dipendenze

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = {
      title,
      content,
      linkNews,
      categories: selectedCategories, // Usa l'array di categorie
      images,
      tipo: "comunicato",
      coverImage,
      updatedAt: serverTimestamp(),
    };

    try {
      if (selectedNews?.id) {
        const docRef = doc(db, "comunicati", selectedNews.id);
        await updateDoc(docRef, data);
      } else {
        // @ts-ignore
        data.createdAt = serverTimestamp();
        await addDoc(collection(db, "comunicati"), data);
      }

      await fetchNews();
      resetForm();
      setShowForm(false);
      setSelectedNews(null);
      alert(
        selectedNews?.id
          ? "Comunicato aggiornata con successo!"
          : "Comunicato creata con successo!"
      );
    } catch (error) {
      console.error("Error saving document:", error);
      alert("Errore durante il salvataggio");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (newsItem) => {
    setNewsToDelete(newsItem);
    setShowDeleteDialog(true);
  };

  const deleteNews = async () => {
    if (!newsToDelete) return;

    setIsLoading(true);
    try {
      // Elimina il documento da Firestore
      await deleteDoc(doc(db, "comunicati", newsToDelete.id));

      // Elimina la copertina se esiste
      if (newsToDelete.coverImage) {
        const storage = getStorage();
        const coverPath = decodeURIComponent(
          newsToDelete.coverImage.split("/o/")[1].split("?")[0]
        );
        const coverRef = ref(storage, coverPath);
        await deleteObject(coverRef);
      }

      // Elimina le altre immagini
      if (newsToDelete.images?.length > 0) {
        const storage = getStorage();
        const deletePromises = newsToDelete.images.map(async (imageUrl) => {
          const imagePath = decodeURIComponent(
            imageUrl.split("/o/")[1].split("?")[0]
          );
          const imageRef = ref(storage, imagePath);
          return deleteObject(imageRef);
        });
        await Promise.all(deletePromises);
      }

      await fetchNews();
      setShowDeleteDialog(false);
      setNewsToDelete(null);
      alert("Comunicato eliminato con successo!");
    } catch (error) {
      console.error("Error deleting news:", error);
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lista Comunicati</CardTitle>
          <Button
            onClick={() => {
              setSelectedNews(null);
              setIsViewMode(false);
              setShowForm(true);
            }}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Nuova Comunicato
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Caricamento...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Titolo</TableHead>
                  <TableHead>Link Comunicato</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {news.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{formatDate(item.createdAt)}</TableCell>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{item.linkNews}</TableCell>
                    <TableCell>{item.categories?.join(", ") || ""}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedNews(item);
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
                          setSelectedNews(item);
                          setIsViewMode(false);
                          setShowForm(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteClick(item)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-6xl">
          <ScrollArea className="h-[600px]">
            <DialogHeader>
              <DialogTitle>
                {isViewMode
                  ? "Visualizza Comunicato"
                  : selectedNews
                  ? "Modifica Comunicato"
                  : "Nuovo Comunicato"}
              </DialogTitle>
            </DialogHeader>
            {isViewMode ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">{selectedNews?.title}</h2>
                <div className="flex gap-4 text-sm text-gray-500">
                  <div>Link Comunicato: {selectedNews?.linkNews}</div>
                  <div>Categoria: {selectedNews?.category}</div>
                  <div>Data: {formatDate(selectedNews?.createdAt)}</div>
                </div>

                {/* Visualizzazione copertina */}
                {selectedNews?.coverImage && (
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                    <img
                      src={selectedNews.coverImage}
                      alt="Copertina"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="prose max-w-none whitespace-pre-wrap">
                  {selectedNews?.content}
                </div>

                {/* Visualizzazione altre immagini */}
                {selectedNews?.images?.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedNews.images.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Image ${index + 1}`}
                          className="rounded-lg w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="opacity-0 group-hover:opacity-100 bg-white text-black px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300"
                          >
                            Vedi immagine
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
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
                  <Label htmlFor="linkNews">Link Comunicato</Label>
                  <Input
                    id="linkNews"
                    value={linkNews}
                    onChange={(e) => setLinkNews(e.target.value)}
                    className={`${
                      isDuplicateLink
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    required
                  />

                  {isDuplicateLink && (
                    <p className="text-red-500 text-sm mt-1">
                      Questo link esiste già in un altro comunicato.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Categorie</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {availableCategories.map((cat) => (
                      <div key={cat} className="flex items-center space-x-2">
                        <Checkbox
                          id={cat}
                          checked={selectedCategories.includes(cat)}
                          onCheckedChange={(checked) => {
                            setSelectedCategories((prev) =>
                              checked
                                ? [...prev, cat]
                                : prev.filter((c) => c !== cat)
                            );
                          }}
                        />
                        <label
                          htmlFor={cat}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {cat}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sezione Copertina */}
                <div className="space-y-2">
                  <Label>Immagine di Copertina</Label>
                  <div className="space-y-4">
                    {coverImage && (
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                        <img
                          src={coverImage}
                          alt="Cover Preview"
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => setCoverImage("")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          document.getElementById("cover-upload").click()
                        }
                        disabled={isLoading}
                      >
                        <Image className="h-4 w-4 mr-2" />
                        {coverImage ? "Cambia Copertina" : "Carica Copertina"}
                      </Button>
                      <input
                        id="cover-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Label>Testo</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleTextFormat("bold")}
                      >
                        <Bold className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleTextFormat("italic")}
                      >
                        <Italic className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleTextFormat("underline")}
                      >
                        <Underline className="h-4 w-4" />
                      </Button>
                      <Dialog
                        open={isLinkDialogOpen}
                        onOpenChange={setIsLinkDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button type="button" variant="outline" size="icon">
                            <Link className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Inserisci Link</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Testo da visualizzare</Label>
                              <Input
                                value={linkText}
                                onChange={(e) => setLinkText(e.target.value)}
                                placeholder="es: Google"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>URL</Label>
                              <Input
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                placeholder="es: https://www.google.com"
                              />
                            </div>
                            <Button
                              type="button"
                              onClick={insertLink}
                              className="w-full"
                            >
                              Inserisci Link
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Altre Immagini</Label>
                  <div className="flex flex-wrap gap-4">
                    {images.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Uploaded ${index + 1}`}
                          className="w-24 h-24 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() =>
                            setImages(images.filter((_, i) => i !== index))
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("image-upload").click()
                      }
                      disabled={isLoading}
                    >
                      <Image className="h-4 w-4 mr-2" />
                      Carica Immagini
                    </Button>
                    <input
                      id="image-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? "Salvataggio..."
                    : selectedNews
                    ? "Aggiorna"
                    : "Salva"}
                </Button>
              </form>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conferma eliminazione</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Sei sicuro di voler eliminare questo Comunicato?</p>
            <p className="text-sm text-gray-500 mt-2">
              Questa azione non può essere annullata. Verranno eliminati
              permanentemente:
            </p>
            <ul className="list-disc list-inside mt-2 text-sm text-gray-500">
              <li>Il Comunicato "{newsToDelete?.title}"</li>
              <li>Tutte le immagini associate</li>
            </ul>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setNewsToDelete(null);
              }}
              disabled={isLoading}
            >
              Annulla
            </Button>
            <Button
              onClick={deleteNews}
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

export default News;
