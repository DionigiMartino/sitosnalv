"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import Link from "next/link";

interface CertificatoFormData {
  nome: string;
  cognome: string;
  luogoNascita: string;
  dataNascita: string;
  codiceFiscale: string;
  qualificaProfessionale: string;
  datoreLavoro: string;
  indirizzoLavoro: string;
  email?: string;
  telefono?: string;
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
    email: "",
    telefono: "",
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
      if (!formData.nome || !formData.cognome || !formData.email) {
        throw new Error("Per favore, compila tutti i campi obbligatori");
      }

      // Aggiungiamo un timeout di 30 secondi per evitare attese infinite
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        const response = await fetch("/api/sendEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Gestione specifica per errori del server
        if (!response.ok) {
          if (response.status === 504) {
            throw new Error("Il server non risponde. Riprova più tardi.");
          }

          // Tentativo di leggere la risposta come JSON
          let errorData;
          try {
            errorData = await response.json();
          } catch (jsonError) {
            // Se non è JSON, leggiamo come testo
            const textError = await response.text();
            throw new Error(
              `Errore del server: ${response.status} - ${textError.substring(
                0,
                100
              )}...`
            );
          }

          throw new Error(
            errorData.error ||
              `Errore ${response.status}: ${response.statusText}`
          );
        }

        // Gestione della risposta se tutto va bene
        let result;
        try {
          result = await response.json();
        } catch (parseError) {
          throw new Error("Impossibile leggere la risposta dal server");
        }

        if (result.success) {
          alert("Richiesta inviata con successo! Ti contatteremo presto.");
          // Reset del form
          setFormData({
            nome: "",
            cognome: "",
            luogoNascita: "",
            dataNascita: "",
            codiceFiscale: "",
            qualificaProfessionale: "",
            datoreLavoro: "",
            indirizzoLavoro: "",
            email: "",
            telefono: "",
          });
        }
      } catch (fetchError) {
        if (fetchError.name === "AbortError") {
          throw new Error(
            "La richiesta ha impiegato troppo tempo. Verifica la tua connessione e riprova."
          );
        }
        throw fetchError;
      }
    } catch (error) {
      console.error("Errore nell'invio del form:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Si è verificato un errore durante l'invio. Per favore riprova più tardi."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-5xl">
          <h2 className="text-xl sm:text-xl font-bold text-[#1a365d] mb-6 sm:mb-8 text-center">
            {" "}
            COMPARTO SOCIO-SANITARIO-ASSISTENZIALE-EDUCATIVO
            <br />
            ASSICURAZIONE COLPA GRAVE PER GLI ISCRITTI ALLO SNALV CONFSAL (
            <Link
              className="text-snalv-600"
              href="https://www.gbsapri.it/convenzioni/colpa-grave-snalv-confsal/"
            >
              qui
            </Link>{" "}
            tutti i dettagli)
          </h2>
          <h3 className="text-md sm:text-md font-bold text-[#1a365d] mb-6 sm:mb-8 text-center">
            RICHIESTA CERTIFICATO
          </h3>
          <Card className="shadow-lg">
            <CardContent>
              <form
                onSubmit={handleSubmit}
                className="space-y-6 bg-gray-50 p-6 sm:p-8 rounded-lg"
              >
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

                    <div>
                      <label className="text-blue-600 block text-sm font-bold mb-1">
                        Email di contatto
                      </label>
                      <Input
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-white"
                        required
                        type="email"
                      />
                    </div>

                    <div>
                      <label className="text-blue-600 block text-sm font-bold mb-1">
                        Telefono/Cellulare
                      </label>
                      <Input
                        name="telefono"
                        value={formData.telefono}
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
