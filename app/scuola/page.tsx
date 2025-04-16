"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import CategoryNews from "@/src/components/CategoryNews";
import HeroSection from "@/src/components/Hero";
import { useRouter } from "next/navigation";
import {
  Building2,
  Briefcase,
  Shield,
  Users,
  ChevronRight,
  Upload,
  Send,
  Mail,
} from "lucide-react";
import { useState } from "react";

export default function ScuolaPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    area: "",
    message: "",
    file: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      file: e.target.files[0] || null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(false);
    setSubmitSuccess(false);

    try {
      // Create FormData for file uploads
      const formDataToSend = new FormData();

      // Add form fields to FormData
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("area", formData.area);
      formDataToSend.append("message", formData.message);

      // Add file if present (using the same field name as your API expects)
      if (formData.file) {
        formDataToSend.append("files", formData.file);
      }

      // Send to API route
      const response = await fetch("/api/send-scuola", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || "Network response was not ok");
      }

      setSubmitSuccess(true);
      setFormData({
        name: "",
        phone: "",
        email: "",
        area: "",
        message: "",
        file: null,
      });

      // Reset file input
      const fileInput: any = document.getElementById("file-upload");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <HeroSection section="scuola" />

      <main className="max-w-full md:max-w-7xl px-4 mx-auto py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Menu Items */}
          <div className="lg:sticky lg:top-4 lg:h-fit">
            <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
              <nav className="space-y-2">
                {[
                  {
                    title: "Chi siamo",
                    route: "/chi-siamo",
                    icon: Users,
                  },
                  {
                    title: "La struttura nazionale",
                    route: "/struttura",
                    icon: Building2,
                  },
                  {
                    title: "Tutele e servizi",
                    route: "/servizi",
                    icon: Shield,
                  },
                  {
                    title: "Comparti e CCNL",
                    route: "/comparti",
                    icon: Briefcase,
                    active: true,
                  },
                ].map((item) => (
                  <Button
                    key={item.title}
                    variant={item.active ? "default" : "ghost"}
                    className={`w-full justify-between text-left group transition-all ${
                      item.active
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => !item.active && router.push(item.route)}
                  >
                    <span className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span className="font-medium">{item.title}</span>
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        item.active ? "rotate-90" : "group-hover:translate-x-1"
                      }`}
                    />
                  </Button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              <h1 className="text-[#1a365d] text-4xl font-bold mb-6 md:text-5xl">
                ISTRUZIONE E RICERCA
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <p className="text-gray-700 mb-6">
                    Lo Snalv Confsal ha istituito un comparto sindacale per
                    assistere i dipendenti pubblici del settore Istruzione &
                    Ricerca. Il comparto si rivolge ai docenti ed al personale
                    ATA e garantisce assistenza diretta ai lavoratori iscritti
                    mediante i due Coordinatori Nazionali:
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 my-8">
                    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="bg-red-100 p-3 rounded-full">
                          <Users className="h-6 w-6 text-red-500" />
                        </div>
                        <h3 className="text-xl font-semibold">Personale ATA</h3>
                      </div>
                      <p className="mb-2">
                        <span className="font-medium">
                          Coordinatore Nazionale:
                        </span>{" "}
                        Stanislao Auletta
                      </p>
                      <p className="flex items-center text-blue-600 hover:underline">
                        <Mail className="h-4 w-4 mr-2" />
                        <a href="mailto:ata@snalv.it">ata@snalv.it</a>
                      </p>
                    </div>

                    <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <Users className="h-6 w-6 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-semibold">
                          Personale DOCENTI
                        </h3>
                      </div>
                      <p className="mb-2">
                        <span className="font-medium">
                          Coordinatore Nazionale:
                        </span>{" "}
                        Vincenzo Calvo
                      </p>
                      <p className="flex items-center text-blue-600 hover:underline">
                        <Mail className="h-4 w-4 mr-2" />
                        <a href="mailto:docenti@snalv.it">docenti@snalv.it</a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 my-6">
                    <a
                      href="https://www.facebook.com/snalvconfsalistruzionericerca/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#1877F2] hover:bg-blue-700"
                    >
                      <svg
                        className="w-6 h-6 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Facebook
                    </a>
                    <a
                      href="https://www.instagram.com/snalvconfsal_istruzionericerca?igsh=MXZhY2NlM2Fhc24wdQ%3D%3D&utm_source=qr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600"
                    >
                      <svg
                        className="w-6 h-6 mr-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Instagram
                    </a>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="md:col-span-1 space-y-6">
                  {/* Documenti Section */}
                  <div className="bg-white p-6 rounded-lg shadow">
                    {/* Title with red bar */}
                    <div className="flex gap-4 mb-8">
                      <div className="w-1 bg-red-600 flex-shrink-0"></div>
                      <h2 className="text-xl font-bold text-[#1a365d]">
                        DOCUMENTI
                      </h2>
                    </div>

                    {/* Lista documenti */}
                    <div className="relative pb-6">
                      <div className="space-y-4">
                        <div className="text-gray-900">
                          <Link
                            href="/docs/ccnl_scuola.pdf"
                            className="hover:text-blue-600 transition-colors duration-75"
                          >
                            Contratto Collettivo Nazionale di Lavoro
                          </Link>
                        </div>
                        <div className="border-b border-dashed border-gray-300"></div>
                        <div className="text-gray-900">
                          <Link
                            href="/docs/mobilita_2025_2028.pdf"
                            className="hover:text-blue-600 transition-colors duration-75"
                          >
                            Mobilità 2025/2028: Contratto integrativo
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contatti Section */}
                  <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex gap-4 mb-8">
                      <div className="w-1 bg-red-600 flex-shrink-0"></div>
                      <h2 className="text-xl font-bold text-[#1a365d]">
                        CONTATTI
                      </h2>
                    </div>

                    <div className="space-y-4">
                      <div className="text-gray-900">
                        <a
                          href="mailto:ata@snalv.it"
                          className="flex items-center hover:text-blue-600 transition-colors duration-75"
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Personale ATA: ata@snalv.it
                        </a>
                      </div>
                      <div className="border-b border-dashed border-gray-300"></div>
                      <div className="text-gray-900">
                        <a
                          href="mailto:docenti@snalv.it"
                          className="flex items-center hover:text-blue-600 transition-colors duration-75"
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Personale DOCENTI: docenti@snalv.it
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 mb-10">
                <h2 className="text-2xl font-bold text-[#1a365d] mb-6">
                  Hai bisogno di supporto? Contatta i nostri Coordinatori
                  Nazionali
                </h2>

                {submitSuccess && (
                  <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
                    La tua richiesta è stata inviata con successo. Ti
                    contatteremo al più presto.
                  </div>
                )}

                {submitError && (
                  <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                    Si è verificato un errore nell'invio del modulo. Per favore,
                    riprova più tardi o contattaci direttamente via email.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        NOME E COGNOME:
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        CEL:
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        MAIL:
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="area"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Seleziona l'area di tuo interesse:
                    </label>
                    <select
                      id="area"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Seleziona un'opzione</option>
                      <option value="ATA">ATA</option>
                      <option value="DOCENTI">DOCENTI</option>
                      <option value="ALTRO">ALTRO</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Quesito:
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    ></textarea>
                  </div>

                  <div>
                    <label
                      htmlFor="file-upload"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Allega file:
                    </label>
                    <div className="flex items-center">
                      <label className="flex items-center px-4 py-2 bg-white text-blue-500 rounded-lg shadow-sm border border-blue-200 cursor-pointer hover:bg-blue-50">
                        <Upload className="h-5 w-5 mr-2" />
                        <span>Scegli file</span>
                        <input
                          id="file-upload"
                          name="file"
                          type="file"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      <span className="ml-3 text-sm text-gray-500">
                        {formData.file
                          ? formData.file.name
                          : "Nessun file selezionato"}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md font-medium flex items-center"
                    >
                      {isSubmitting ? (
                        <>Invio in corso...</>
                      ) : (
                        <>
                          INVIA! <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>

              <div className="mt-12">
                <h2 className="text-[#1a365d] text-2xl font-bold mb-6 md:text-3xl">
                  NOTIZIE SETTORE SCUOLA
                </h2>
                <CategoryNews categories={["Scuola"]} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
