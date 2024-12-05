"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import { motion } from "framer-motion";
import HeroSection from "@/src/components/Hero";

const ContattiPage = () => {
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    tel: "",
    mail: "",
  });

  const [newsletter, setNewsletter] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <HeroSection section="contatti" />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1a365d]">
                Hai un problema o un dubbio riguardo al tuo rapporto di lavoro?
              </h2>
              <p className="text-gray-600">Contattaci subito!</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="NOME"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Input
                    placeholder="COGNOME"
                    value={formData.cognome}
                    onChange={(e) =>
                      setFormData({ ...formData, cognome: e.target.value })
                    }
                    className="bg-gray-50"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="TEL"
                    value={formData.tel}
                    onChange={(e) =>
                      setFormData({ ...formData, tel: e.target.value })
                    }
                    className="bg-gray-50"
                  />
                </div>
                <div>
                  <Input
                    placeholder="MAIL"
                    type="email"
                    value={formData.mail}
                    onChange={(e) =>
                      setFormData({ ...formData, mail: e.target.value })
                    }
                    className="bg-gray-50"
                  />
                </div>
              </div>
              <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                INVIA
              </Button>
            </form>

            <p className="text-center font-medium">
              UN NOSTRO OPERATORE TI CHIAMERÀ IL PRIMA POSSIBILE!
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-12">
            <div className="space-y-4">
              <h3 className="font-medium">
                Altrimenti, se preferisci, puoi contattarci ai seguenti
                recapiti:
              </h3>
              <div className="space-y-2">
                <p className="font-bold">
                  Ufficio vertenze e conteggi Segreteria Nazionale
                </p>
                <p>06.70492451</p>
                <p>345.0511636</p>
                <p>info@snalv.it</p>
              </div>
              <Button
                variant="link"
                className="text-blue-600 p-0"
                onClick={() =>
                  (window.location.href =
                    "/territorio#cerca-sede")
                }
              >
                Ufficio vertenze e conteggi sul territorio, cerca la sede più
                vicina casa tua
              </Button>
            </div>

            {/* Newsletter */}
            <div className="bg-gray-50 p-8 rounded-lg space-y-6">
              <p className="text-center">
                Nel frattempo, registrati alla nostra{" "}
                <span className="font-bold">Newsletter</span> per ricevere
                all'istante ogni nuova notizia e aggiornamenti dal mondo del
                lavoro!
              </p>
              <div className="flex gap-4">
                <Input
                  value={newsletter}
                  onChange={(e) => setNewsletter(e.target.value)}
                  placeholder="Inserisci la tua email"
                  className="bg-white"
                />
                <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800">
                  ISCRIVITI
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ContattiPage;
