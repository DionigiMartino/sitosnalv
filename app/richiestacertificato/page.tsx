"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";

interface CertificatoFormData {
  nome: string;
  cognome: string;
  luogoNascita: string;
  dataNascita: string;
  codiceFiscale: string;
  qualificaProfessionale: string;
  datoreLavoro: string;
  indirizzoLavoro: string;
}

const CertificatoPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CertificatoFormData>({
    nome: "",
    cognome: "",
    luogoNascita: "",
    dataNascita: "",
    codiceFiscale: "",
    qualificaProfessionale: "",
    datoreLavoro: "",
    indirizzoLavoro: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        nome: "",
        cognome: "",
        luogoNascita: "",
        dataNascita: "",
        codiceFiscale: "",
        qualificaProfessionale: "",
        datoreLavoro: "",
        indirizzoLavoro: "",
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
                  RICHIESTA CERTIFICATO
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="text-blue-600 block text-sm font-bold mb-1">
                        Nome
                      </label>
                      <Input
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        className="w-full bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-blue-600 block text-sm font-bold mb-1">
                        Cognome
                      </label>
                      <Input
                        name="cognome"
                        value={formData.cognome}
                        onChange={handleInputChange}
                        className="w-full bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-blue-600 block text-sm font-bold mb-1">
                        Luogo di nascita
                      </label>
                      <Input
                        name="luogoNascita"
                        value={formData.luogoNascita}
                        onChange={handleInputChange}
                        className="w-full bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-blue-600 block text-sm font-bold mb-1">
                        Data di nascita
                      </label>
                      <Input
                        name="dataNascita"
                        type="date"
                        value={formData.dataNascita}
                        onChange={handleInputChange}
                        className="w-full bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-blue-600 block text-sm font-bold mb-1">
                        Codice Fiscale
                      </label>
                      <Input
                        name="codiceFiscale"
                        value={formData.codiceFiscale}
                        onChange={handleInputChange}
                        className="w-full bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-blue-600 block text-sm font-bold mb-1">
                        Qualifica professionale
                      </label>
                      <Input
                        name="qualificaProfessionale"
                        value={formData.qualificaProfessionale}
                        onChange={handleInputChange}
                        className="w-full bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-blue-600 block text-sm font-bold mb-1">
                        Datore di Lavoro
                      </label>
                      <Input
                        name="datoreLavoro"
                        value={formData.datoreLavoro}
                        onChange={handleInputChange}
                        className="w-full bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-blue-600 block text-sm font-bold mb-1">
                        Indirizzo sede di lavoro
                      </label>
                      <Input
                        name="indirizzoLavoro"
                        value={formData.indirizzoLavoro}
                        onChange={handleInputChange}
                        className="w-full bg-white"
                        required
                      />
                    </div>
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

export default CertificatoPage;
