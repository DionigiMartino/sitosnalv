"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import HeroSection from "@/src/components/Hero";
import Link from "next/link";
import { Phone, Mail, MapPin, Building2, ChevronRight } from "lucide-react";

const ContactSection = () => {
  const contactInfo = [
    {
      title: "Sede Segreteria Nazionale",
      details: [
        {
          label: "Indirizzo",
          value: "Via di Porta Maggiore 9, 00185 Roma (RM)",
          link: "https://maps.app.goo.gl/4gEek9Adi3J57hkx5",
          type: "address",
        },
        {
          label: "Telefono",
          value: "06.70492451",
          link: "tel:0670492451",
          type: "phone",
        },
        {
          label: "Email",
          value: "info@snalv.it",
          link: "mailto:info@snalv.it",
          type: "email",
        },
      ],
    },
    {
      title: "Ufficio Vertenze e Conteggi",
      details: [
    
        {
          label: "Mobile & Whatsapp",
          value: "345.0511636",
          link: "tel:3450511636",
          type: "phone",
        },
        {
          label: "Email",
          value: "info@snalv.it, conteggi@snalv.it, conciliazioni@snalv.it",
          link: "mailto:info@snalv.it",
          type: "email",
        },
      ],
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-[#1a365d] to-[#2a4a7f] text-white">
        <h3 className="text-xl font-bold">I Nostri Contatti</h3>
        <p className="text-gray-200 mt-2">Siamo qui per aiutarti</p>
      </div>

      <div className="divide-y divide-gray-100">
        {contactInfo.map((section, index) => (
          <div key={index} className="p-6">
            <h4 className="font-bold text-[#1a365d] text-lg mb-4">
              {section.title}
            </h4>
            <div className="space-y-3">
              {section.details.map((detail, detailIndex) => (
                <a
                  key={detailIndex}
                  href={detail.link}
                  className="flex items-center gap-3 text-gray-600 hover:text-red-500 transition-colors group"
                >
                  {detail.type === "phone" && (
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-100">
                      <Phone className="w-5 h-5 text-red-500" />
                    </div>
                  )}
                  {detail.type === "email" && (
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-100">
                      <Mail className="w-5 h-5 text-red-500" />
                    </div>
                  )}
                  {detail.type === "address" && (
                    <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-100">
                      <MapPin className="w-5 h-5 text-red-500" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{detail.label}</p>
                    <p className="text-sm">{detail.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}

        <div className="p-6 bg-gray-50">
          <h4 className="font-bold text-[#1a365d] text-lg mb-4">
            Sedi Territoriali
          </h4>
          <Link
            href="/territorio#cerca-sede"
            className="flex items-center gap-3 group hover:text-red-500 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-100">
              <Building2 className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                Trova la sede più vicina
              </p>
              <p className="text-sm text-gray-600">
                Consulta l'elenco delle sedi sul territorio
              </p>
            </div>
            <ChevronRight className="w-5 h-5 ml-auto text-gray-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

const ContattiPage = () => {
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    tel: "",
    mail: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newsletter, setNewsletter] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Aggiungi qui la logica di invio
    setTimeout(() => {
      setIsSubmitting(false);
      // Reset form o mostra messaggio di successo
    }, 2000);
  };

  return (
    <>
      <Header />
      <HeroSection section="contatti" />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid gap-16 md:grid-cols-2">
          {/* Contact Information */}
          <div>
            <ContactSection />
          </div>

          {/* Contact Form */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#1a365d] md:text-3xl">
                Hai un problema o un dubbio riguardo al tuo rapporto di lavoro?
              </h2>
              <p className="text-gray-600">Contattaci subito!</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="NOME"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  className="bg-gray-50"
                  required
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
                  required
                />
              </div>
              <div>
                <Input
                  placeholder="TEL"
                  value={formData.tel}
                  onChange={(e) =>
                    setFormData({ ...formData, tel: e.target.value })
                  }
                  className="bg-gray-50"
                  required
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
                  required
                />
              </div>
              <div>
                <Button
                  type="submit"
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "INVIO..." : "INVIA"}
                </Button>
              </div>
            </form>

            <p className="text-center font-bold text-[#1a365d]">
              UN NOSTRO OPERATORE TI CHIAMERÀ IL PRIMA POSSIBILE!
            </p>

            {/* Newsletter */}
            <div className="bg-gray-50 p-8 rounded-xl space-y-6 border-t-4 border-red-500">
              <p className="text-center text-[#1a365d]">
                Nel frattempo, registrati alla nostra{" "}
                <span className="font-bold">Newsletter</span> per ricevere
                mensilmente notizie e aggiornamenti dal mondo del lavoro!
              </p>
              <div className="flex gap-4">
                <Input
                  value={newsletter}
                  onChange={(e) => setNewsletter(e.target.value)}
                  placeholder="Inserisci la tua email"
                  type="email"
                  className="bg-white"
                />
                <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold whitespace-nowrap">
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
