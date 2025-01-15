"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";

interface ConteggiFormData {
  ragioneSociale: string;
  cellulare: string;
  dataInizio: string;
  ccnl: string;
  tipologiaContratto: string;
  straordinari: string;
  lavoratore: string;
  email: string;
  dataFine: string;
  retribuzione: string;
  orarioLavoro: string;
  oreSettimanali: string;
  files: FileList | null;
}

const ConteggiPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ConteggiFormData>({
    ragioneSociale: "",
    cellulare: "",
    dataInizio: "",
    ccnl: "",
    tipologiaContratto: "",
    straordinari: "",
    lavoratore: "",
    email: "",
    dataFine: "",
    retribuzione: "",
    orarioLavoro: "",
    oreSettimanali: "",
    files: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files) {
      setFormData((prev) => ({
        ...prev,
        files: files,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Qui andrebbe la logica di invio dei dati al backend
      console.log("Form data:", formData);

      // Simula una chiamata API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Richiesta inviata con successo!");
      // Reset form
      setFormData({
        ragioneSociale: "",
        cellulare: "",
        dataInizio: "",
        ccnl: "",
        tipologiaContratto: "",
        straordinari: "",
        lavoratore: "",
        email: "",
        dataFine: "",
        retribuzione: "",
        orarioLavoro: "",
        oreSettimanali: "",
        files: null,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Errore durante l'invio della richiesta. Riprova più tardi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-5xl">
          <Card className="shadow-lg">
            <CardContent>
              <form
                onSubmit={handleSubmit}
                className="space-y-6 bg-gray-50 p-6 sm:p-8 rounded-lg"
              >
                <h2 className="text-xl sm:text-2xl font-bold text-[#1a365d] mb-6 sm:mb-8 text-center">
                  MODULO CONTEGGI
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="text-blue-600 block text-sm font-bold mb-1">
                        Ragione sociale/Datore di lavoro
                      </label>
                      <Input
                        name="ragioneSociale"
                        value={formData.ragioneSociale}
                        onChange={handleInputChange}
                        className="w-full bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-blue-600 block text-sm font-bold mb-1">
                        Cellulare
                      </label>
                      <Input
                        name="cellulare"
                        value={formData.cellulare}
                        onChange={handleInputChange}
                        className="w-full bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-blue-600 block text-sm font-bold mb-1">
                        Data inizio rapporto lavoro
                      </label>
                      <Input
                        name="dataInizio"
                        type="date"
                        value={formData.dataInizio}
                        onChange={handleInputChange}
                        className="w-full bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-blue-600 block text-sm font-bold mb-1">
                        CCNL applicato
                        <span className="text-sm text-gray-500 block">
                          (specificare settore, qualifica e livello)
                        </span>
                      </label>
                      <Input
                        name="ccnl"
                        value={formData.ccnl}
                        onChange={handleInputChange}
                        className="w-full bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-blue-600 block text-sm font-bold mb-1">
                        Tipologia di contratto
                        <span className="text-sm text-gray-500 block">
                          (specificare se part-time o full time)
                        </span>
                      </label>
                      <Input
                        name="tipologiaContratto"
                        value={formData.tipologiaContratto}
                        onChange={handleInputChange}
                        className="w-full bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-blue-600 block text-sm font-bold mb-1">
                        Eventuali straordinari
                      </label>
                      <Input
                        name="straordinari"
                        value={formData.straordinari}
                        onChange={handleInputChange}
                        className="w-full bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-blue-600 block text-sm font-bold mb-1">
                        Lavoratore
                      </label>
                      <Input
                        name="lavoratore"
                        value={formData.lavoratore}
                        onChange={handleInputChange}
                        className="w-full bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-blue-600 block text-sm font-bold mb-1">
                        Email
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-blue-600 block text-sm font-bold mb-1">
                        Data risoluzione rapporto lavoro
                      </label>
                      <Input
                        name="dataFine"
                        type="date"
                        value={formData.dataFine}
                        onChange={handleInputChange}
                        className="w-full bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-blue-600 block text-sm font-bold mb-1">
                        Retribuzione corrisposta
                      </label>
                      <Input
                        name="retribuzione"
                        value={formData.retribuzione}
                        onChange={handleInputChange}
                        className="w-full bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-blue-600 block text-sm font-bold mb-1">
                        Orario di lavoro
                      </label>
                      <Input
                        name="orarioLavoro"
                        value={formData.orarioLavoro}
                        onChange={handleInputChange}
                        className="w-full bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-blue-600 block text-sm font-bold mb-1">
                        N° ore settimanali
                      </label>
                      <Input
                        name="oreSettimanali"
                        value={formData.oreSettimanali}
                        onChange={handleInputChange}
                        className="w-full bg-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 sm:mt-8">
                  <p className="text-sm text-gray-600 mb-4 text-center">
                    Si prega di allegare copia del contratto e delle buste paga
                    in possesso
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                    <Input
                      type="file"
                      multiple
                      name="files"
                      onChange={handleInputChange}
                      className="file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 max-w-md"
                      required
                    />
                    <span className="text-sm text-gray-500">
                      È possibile allegare più file
                    </span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    type="submit"
                    className="bg-red-500 hover:bg-red-600 text-white mt-6 sm:mt-8 px-8"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        INVIO IN CORSO...
                      </div>
                    ) : (
                      "INVIA RICHIESTA"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ConteggiPage;
