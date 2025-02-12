import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { PlusCircle, Edit, Trash2, MapPin, Search, X } from "lucide-react";
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

type TipoSede = "Ufficio Provinciale" | "Ufficio Regionale" | "Centro SNALV";

interface Sede {
  id?: string;
  tipo: TipoSede;
  regione: string;
  provincia: string;
  citta: string;
  indirizzo: string;
  email: string;
  pec: string;
  tel: string;
  cel: string;
  responsabile: string;
  coordinate?: {
    lat: string;
    lng: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const tipiSede = [
  "Ufficio Provinciale",
  "Ufficio Regionale",
  "Centro SNALV",
] as const;

const provincePerRegione = {
  Abruzzo: ["Chieti", "L'Aquila", "Pescara", "Teramo"],
  Basilicata: ["Matera", "Potenza"],
  Calabria: [
    "Catanzaro",
    "Cosenza",
    "Crotone",
    "Reggio Calabria",
    "Vibo Valentia",
  ],
  Campania: ["Avellino", "Benevento", "Caserta", "Napoli", "Salerno"],
  "Emilia-Romagna": [
    "Bologna",
    "Ferrara",
    "Forlì-Cesena",
    "Modena",
    "Parma",
    "Piacenza",
    "Ravenna",
    "Reggio Emilia",
    "Rimini",
  ],
  "Friuli-Venezia Giulia": ["Gorizia", "Pordenone", "Trieste", "Udine"],
  Lazio: ["Frosinone", "Latina", "Rieti", "Roma", "Viterbo"],
  Liguria: ["Genova", "Imperia", "La Spezia", "Savona"],
  Lombardia: [
    "Bergamo",
    "Brescia",
    "Como",
    "Cremona",
    "Lecco",
    "Lodi",
    "Mantova",
    "Milano",
    "Monza e Brianza",
    "Pavia",
    "Sondrio",
    "Varese",
  ],
  Marche: ["Ancona", "Ascoli Piceno", "Fermo", "Macerata", "Pesaro e Urbino"],
  Molise: ["Campobasso", "Isernia"],
  Piemonte: [
    "Alessandria",
    "Asti",
    "Biella",
    "Cuneo",
    "Novara",
    "Torino",
    "Verbano-Cusio-Ossola",
    "Vercelli",
  ],
  Puglia: [
    "Bari",
    "Barletta-Andria-Trani",
    "Brindisi",
    "Foggia",
    "Lecce",
    "Taranto",
  ],
  Sardegna: ["Cagliari", "Nuoro", "Oristano", "Sassari", "Sud Sardegna"],
  Sicilia: [
    "Agrigento",
    "Caltanissetta",
    "Catania",
    "Enna",
    "Messina",
    "Palermo",
    "Ragusa",
    "Siracusa",
    "Trapani",
  ],
  Toscana: [
    "Arezzo",
    "Firenze",
    "Grosseto",
    "Livorno",
    "Lucca",
    "Massa-Carrara",
    "Pisa",
    "Pistoia",
    "Prato",
    "Siena",
  ],
  "Trentino-Alto Adige": ["Bolzano", "Trento"],
  Umbria: ["Perugia", "Terni"],
  "Valle d'Aosta": ["Aosta"],
  Veneto: [
    "Belluno",
    "Padova",
    "Rovigo",
    "Treviso",
    "Venezia",
    "Verona",
    "Vicenza",
  ],
} as const;

const regioni = Object.keys(provincePerRegione);

async function getCoordinates(
  indirizzo: string,
  citta: string,
  provincia: string
) {
  const query = `${indirizzo}, ${citta}, ${provincia}, Italy`;
  const encodedQuery = encodeURIComponent(query);
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "SNALV Website",
      },
    });
    const data = await response.json();

    if (data && data[0]) {
      return {
        lat: data[0].lat,
        lng: data[0].lon,
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting coordinates:", error);
    return null;
  }
}

const Sedi = () => {
  const [sedi, setSedi] = useState<Sede[]>([]);
  const [filteredSedi, setFilteredSedi] = useState<Sede[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedSede, setSelectedSede] = useState<Sede | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [sedeToDelete, setSedeToDelete] = useState<Sede | null>(null);

  // Filter states
  const [filterRegione, setFilterRegione] = useState<string>("");
  const [filterProvincia, setFilterProvincia] = useState("");

  // Form state
  const [formData, setFormData] = useState<Sede>({
    tipo: "Ufficio Provinciale",
    regione: "",
    provincia: "",
    citta: "",
    indirizzo: "",
    email: "",
    pec: "",
    tel: "",
    cel: "",
    responsabile: "",
    coordinate: { lat: "", lng: "" },
  });

  useEffect(() => {
    fetchSedi();
  }, []);

  useEffect(() => {
    if (selectedSede) {
      setFormData(selectedSede);
    } else {
      resetForm();
    }
  }, [selectedSede]);

  // Apply filters effect
  useEffect(() => {
    let result = [...sedi];

    if (filterRegione) {
      result = result.filter(
        (sede) => sede.regione.toLowerCase() === filterRegione.toLowerCase()
      );
    }

    if (filterProvincia) {
      result = result.filter((sede) =>
        sede.provincia.toLowerCase().includes(filterProvincia.toLowerCase())
      );
    }

    setFilteredSedi(result);
  }, [sedi, filterRegione, filterProvincia]);

  const fetchSedi = async () => {
    try {
      const sediQuery = query(
        collection(db, "sedi"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(sediQuery);
      const sediData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Sede[];
      setSedi(sediData);
      setFilteredSedi(sediData);
    } catch (error) {
      console.error("Error fetching sedi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      tipo: "Ufficio Provinciale",
      regione: "",
      provincia: "",
      citta: "",
      indirizzo: "",
      email: "",
      pec: "",
      tel: "",
      cel: "",
      responsabile: "",
      coordinate: { lat: "", lng: "" },
    });
  };

  const resetFilters = () => {
    setFilterRegione("");
    setFilterProvincia("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("coordinate.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        coordinate: {
          ...prev.coordinate,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleGetCoordinates = async () => {
    if (!formData.indirizzo || !formData.citta || !formData.provincia) {
      alert(
        "Inserisci indirizzo, città e provincia per ottenere le coordinate"
      );
      return;
    }

    setIsLoading(true);
    try {
      const coords = await getCoordinates(
        formData.indirizzo,
        formData.citta,
        formData.provincia
      );

      if (coords) {
        setFormData((prev) => ({
          ...prev,
          coordinate: coords,
        }));
      } else {
        alert(
          "Non è stato possibile trovare le coordinate per questo indirizzo"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Errore durante il recupero delle coordinate");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (selectedSede?.id) {
        // Update
        const docRef = doc(db, "sedi", selectedSede.id);
        await updateDoc(docRef, {
          ...formData,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Create
        await addDoc(collection(db, "sedi"), {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      await fetchSedi();
      setShowForm(false);
      setSelectedSede(null);
      resetForm();
      alert(
        selectedSede?.id
          ? "Sede aggiornata con successo!"
          : "Sede creata con successo!"
      );
    } catch (error) {
      console.error("Error saving sede:", error);
      alert("Errore durante il salvataggio");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!sedeToDelete?.id) return;

    setIsLoading(true);
    try {
      await deleteDoc(doc(db, "sedi", sedeToDelete.id));
      await fetchSedi();
      setShowDeleteDialog(false);
      setSedeToDelete(null);
      alert("Sede eliminata con successo!");
    } catch (error) {
      console.error("Error deleting sede:", error);
      alert("Errore durante l'eliminazione");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegioneChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      regione: value,
      provincia: selectedSede?.regione === value ? prev.provincia : "",
    }));
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lista Sedi</CardTitle>
          <Button
            onClick={() => {
              setSelectedSede(null);
              setShowForm(true);
            }}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Nuova Sede
          </Button>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Filtra per Regione</Label>
                <Select value={filterRegione} onValueChange={setFilterRegione}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona regione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tutte le regioni</SelectItem>
                    {regioni.map((regione) => (
                      <SelectItem key={regione} value={regione}>
                        {regione}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Filtra per Provincia</Label>
                <div className="flex gap-2">
                  <Select
                    value={filterProvincia}
                    onValueChange={setFilterProvincia}
                    disabled={!filterRegione}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Tutte le province" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tutte le province</SelectItem>
                      {filterRegione &&
                        filterRegione !== "all" &&
                        provincePerRegione[filterRegione].map((provincia) => (
                          <SelectItem key={provincia} value={provincia}>
                            {provincia}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {(filterRegione || filterProvincia) && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={resetFilters}
                      className="shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-4">Caricamento...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Provincia</TableHead>
                  <TableHead>Città</TableHead>
                  <TableHead>Indirizzo</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>PEC</TableHead>
                  <TableHead>Tel</TableHead>
                  <TableHead>Responsabile</TableHead>
                  <TableHead>Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSedi.map((sede) => (
                  <TableRow key={sede.id}>
                    <TableCell>{sede.tipo}</TableCell>
                    <TableCell>{sede.provincia}</TableCell>
                    <TableCell>{sede.citta}</TableCell>
                    <TableCell>{sede.indirizzo}</TableCell>
                    <TableCell>{sede.email}</TableCell>
                    <TableCell>{sede.pec}</TableCell>
                    <TableCell>{sede.tel}</TableCell>
                    <TableCell>{sede.responsabile}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedSede(sede);
                          setShowForm(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSedeToDelete(sede);
                          setShowDeleteDialog(true);
                        }}
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
        <DialogContent className="min-w-3xl max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedSede ? "Modifica Sede" : "Nuova Sede"}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[600px] w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipo Sede</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value: TipoSede) =>
                      setFormData((prev) => ({ ...prev, tipo: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona tipo sede" />
                    </SelectTrigger>
                    <SelectContent>
                      {tipiSede.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Regione</Label>
                  <Select
                    value={formData.regione}
                    onValueChange={handleRegioneChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona regione" />
                    </SelectTrigger>
                    <SelectContent>
                      {regioni.map((regione) => (
                        <SelectItem key={regione} value={regione}>
                          {regione}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Provincia</Label>
                  <Select
                    value={formData.provincia}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, provincia: value }))
                    }
                    disabled={!formData.regione}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona provincia" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.regione &&
                        provincePerRegione[formData.regione].map(
                          (provincia) => (
                            <SelectItem key={provincia} value={provincia}>
                              {provincia}
                            </SelectItem>
                          )
                        )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Città</Label>
                  <Input
                    name="citta"
                    value={formData.citta}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Indirizzo</Label>
                <Input
                  name="indirizzo"
                  value={formData.indirizzo}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Latitudine</Label>
                    <Input
                      name="coordinate.lat"
                      value={formData.coordinate?.lat || ""}
                      onChange={handleInputChange}
                      type="number"
                      step="any"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Longitudine</Label>
                    <Input
                      name="coordinate.lng"
                      value={formData.coordinate?.lng || ""}
                      onChange={handleInputChange}
                      type="number"
                      step="any"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGetCoordinates}
                  disabled={
                    !formData.indirizzo ||
                    !formData.citta ||
                    !formData.provincia
                  }
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Ottieni Coordinate da Indirizzo
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>PEC</Label>
                  <Input
                    name="pec"
                    type="email"
                    value={formData.pec}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Telefono</Label>
                  <Input
                    name="tel"
                    type="tel"
                    value={formData.tel}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Cellulare</Label>
                  <Input
                    name="cel"
                    type="tel"
                    value={formData.cel}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Responsabile</Label>
                <Input
                  name="responsabile"
                  value={formData.responsabile}
                  onChange={handleInputChange}
                />
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? "Salvataggio..."
                    : selectedSede
                    ? "Aggiorna"
                    : "Salva"}
                </Button>
              </DialogFooter>
            </form>
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
            <p>Sei sicuro di voler eliminare questa sede?</p>
            <p className="text-sm text-gray-500 mt-2">
              {sedeToDelete && (
                <>
                  Stai per eliminare la sede {sedeToDelete.tipo} di{" "}
                  {sedeToDelete.citta}.
                  <br />
                  Questa azione non può essere annullata.
                </>
              )}
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setSedeToDelete(null);
              }}
              disabled={isLoading}
            >
              Annulla
            </Button>
            <Button
              onClick={handleDelete}
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

export default Sedi;
