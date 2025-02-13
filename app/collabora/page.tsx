"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import HeroSection from "@/src/components/Hero";
import Link from "next/link";

interface CollaboraFormData {
  nome: string;
  cognome: string;
  professione: string;
  domicilio: string;
  cellulare: string;
  email: string;
}

export default function CollaboraPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CollaboraFormData>({
    nome: "",
    cognome: "",
    professione: "",
    domicilio: "",
    cellulare: "",
    email: "",
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
      const response = await fetch("/api/send-collaborazione", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Errore durante l'invio della richiesta"
        );
      }

      if (result.success) {
        alert("Richiesta inviata con successo! Ti contatteremo presto.");
        // Reset del form
        setFormData({
          nome: "",
          cognome: "",
          professione: "",
          domicilio: "",
          cellulare: "",
          email: "",
        });
      }
    } catch (error) {
      console.error("Errore nell'invio del form:", error);
      alert(
        "Si è verificato un errore durante l'invio. Per favore riprova più tardi."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <HeroSection section="collabora" />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="space-y-12">
          <h1 className="text-[#1a365d] text-4xl font-bold mb-6 md:text-5xl text-center">
            COLLABORA CON NOI
          </h1>

          <div className="text-left max-w-3xl mx-auto space-y-6">
            <h2 className="text-xl font-bold text-blue-600 md:text-2xl">
              Impegnati nel Sindacato e fornisci un supporto di qualità ai
              lavoratori del tuo territorio!
            </h2>
            <p className="text-blue-600">
              Il mondo del lavoro è in continua evoluzione e la nostra
              Organizzazione mira a sviluppare un Sindacato diverso, competente,
              adeguato alle esigenze attuali.
            </p>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
            <div className="max-w-3xl mx-auto space-y-6">
              <p className="text-blue-600">
                La Segreteria Nazionale è a tua disposizione per aprire una sede
                sindacale sul territorio: ti garantiamo un&apos;adeguata
                formazione, il massimo supporto operativo e l&apos;assistenza
                necessaria per fare i primi passi.
              </p>
              <p className="text-blue-600">
                Inoltre, grazie alle collaborazioni di cui si avvale lo SNALV
                CONFSAL, potrai erogare ai lavoratori, ai pensionati, ai giovani
                ed ai disoccupati tutti i servizi di utilità sociale di cui
                hanno bisogno:
                <Link
                  className="text-red-500 hover:text-red-600 ml-1"
                  href="/servizi"
                >
                  consulta qui l&apos;elenco completo
                </Link>
              </p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-10 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-white mb-8 md:text-3xl bg-blue-600 p-2 rounded-md text-center">
                Compila il form per essere ricontattato
              </h3>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    {/* Nome input */}
                    <div className="relative">
                      <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        className="peer w-full border-b-2 border-gray-300 px-0 py-2 
                        placeholder:text-transparent focus:border-red-500 focus:outline-none"
                        placeholder="Nome"
                        required
                      />
                      <label
                        className="pointer-events-none absolute left-0 -top-3.5 text-sm 
                        text-gray-600 transition-all peer-placeholder-shown:top-2 
                        peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
                        peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-red-500"
                      >
                        Nome
                      </label>
                    </div>

                    {/* Cognome input */}
                    <div className="relative">
                      <input
                        type="text"
                        name="cognome"
                        value={formData.cognome}
                        onChange={handleInputChange}
                        className="peer w-full border-b-2 border-gray-300 px-0 py-2 
                        placeholder:text-transparent focus:border-red-500 focus:outline-none"
                        placeholder="Cognome"
                        required
                      />
                      <label
                        className="pointer-events-none absolute left-0 -top-3.5 text-sm 
                        text-gray-600 transition-all peer-placeholder-shown:top-2 
                        peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
                        peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-red-500"
                      >
                        Cognome
                      </label>
                    </div>

                    {/* Professione input */}
                    <div className="relative">
                      <input
                        type="text"
                        name="professione"
                        value={formData.professione}
                        onChange={handleInputChange}
                        className="peer w-full border-b-2 border-gray-300 px-0 py-2 
                        placeholder:text-transparent focus:border-red-500 focus:outline-none"
                        placeholder="Professione"
                        required
                      />
                      <label
                        className="pointer-events-none absolute left-0 -top-3.5 text-sm 
                        text-gray-600 transition-all peer-placeholder-shown:top-2 
                        peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
                        peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-red-500"
                      >
                        Professione attuale
                      </label>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Domicilio input */}
                    <div className="relative">
                      <input
                        type="text"
                        name="domicilio"
                        value={formData.domicilio}
                        onChange={handleInputChange}
                        className="peer w-full border-b-2 border-gray-300 px-0 py-2 
                        placeholder:text-transparent focus:border-red-500 focus:outline-none"
                        placeholder="Domicilio"
                        required
                      />
                      <label
                        className="pointer-events-none absolute left-0 -top-3.5 text-sm 
                        text-gray-600 transition-all peer-placeholder-shown:top-2 
                        peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
                        peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-red-500"
                      >
                        Luogo domicilio
                      </label>
                    </div>

                    {/* Cellulare input */}
                    <div className="relative">
                      <input
                        type="tel"
                        name="cellulare"
                        value={formData.cellulare}
                        onChange={handleInputChange}
                        className="peer w-full border-b-2 border-gray-300 px-0 py-2 
                        placeholder:text-transparent focus:border-red-500 focus:outline-none"
                        placeholder="Cellulare"
                        required
                      />
                      <label
                        className="pointer-events-none absolute left-0 -top-3.5 text-sm 
                        text-gray-600 transition-all peer-placeholder-shown:top-2 
                        peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
                        peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-red-500"
                      >
                        Cellulare
                      </label>
                    </div>

                    {/* Email input */}
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="peer w-full border-b-2 border-gray-300 px-0 py-2 
                        placeholder:text-transparent focus:border-red-500 focus:outline-none"
                        placeholder="Email"
                        required
                      />
                      <label
                        className="pointer-events-none absolute left-0 -top-3.5 text-sm 
                        text-gray-600 transition-all peer-placeholder-shown:top-2 
                        peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 
                        peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-red-500"
                      >
                        Email
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-10">
                  <Button
                    type="submit"
                    className="bg-red-500 hover:bg-red-600 text-white px-12 py-3 rounded-full 
                    text-lg font-medium transition-all hover:shadow-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Invio in corso...
                      </div>
                    ) : (
                      "Invia richiesta"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
