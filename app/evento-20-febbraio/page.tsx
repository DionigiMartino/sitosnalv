// app/evento/page.tsx
import Header from "@/src/components/Header";
import HeroSection from "@/src/components/Hero";
import Footer from "@/src/components/Footer";
import Image from "next/image";
import Link from "next/link";

export default function EventoPage() {
  return (
    <>
      <Header />
      <HeroSection section="evento" />

      <main className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1">
          <h1 className="text-3xl  text-blue-600 font-bold mb-6">
            Evento nazionale SNALV Confsal
          </h1>

          <div className="prose max-w-none">
            <p className="mb-4">
              In data 20 febbraio si è tenuto a Roma il primo evento nazionale
              SNALV Confsal sul settore socio-sanitario-assistenziale-educativo.
            </p>

            <p className="mb-4">
              In mattinata si è svolto il panel istituzionale, con la presenza
              dei principali rappresentanti istituzionali competenti, a vario
              titolo, nell'iter di attuazione della riforma sull'assistenza agli
              anziani.
            </p>

            <p className="mb-6">
              Nel pomeriggio, dinanzi ad una rappresentanza di oltre 300
              lavoratori iscritti al Sindacato provenienti da tutta Italia, è
              stata discussa ed approvata la Piattaforma programmatica Snalv
              Confsal per il comparto.
            </p>

            {/* Download Section */}

            {/* Event Image */}
            <div className="relative w-full mb-8">
              <iframe
                src="/docs/piattaforma.pdf"
                className="object-cover rounded-lg w-full h-[60vh]"
              />
            </div>

            <p className="mb-6">
              In data 23 febbraio 2024, la Piattaforma è stata trasmessa
              formalmente a tutte le Istituzioni competenti, a vario titolo,
              nell'attuazione della riforma sull'assistenza agli anziani.
            </p>

            {/* Secretary Report Section */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-red-700 mb-4">
                LA RELAZIONE INTRODUTTIVA DEL SEGRETARIO GENERALE SNALV CONFSAL
              </h2>
              <div className="space-y-4">
                <Link
                  href="/docs/RELAZIONE_INTRODUTTIVA.pdf"
                  className="block text-blue-600 hover:underline"
                >
                  Il testo integrale (scarica QUI)
                </Link>
                <Link
                  href="/docs/SLIDE.pdf"
                  className="block text-blue-600 hover:underline"
                >
                  Slides (scarica QUI)
                </Link>
              </div>

              {/* YouTube Video */}
              <div className="mt-6 aspect-video">
                <iframe
                  className="w-full h-full rounded-lg"
                  src="https://www.youtube.com/embed/jfWLtS6uwy4"
                  title="Relazione introduttiva del Segretario"
                  allowFullScreen
                />
              </div>

              <h2 className="text-2xl font-bold text-red-700 mb-4">
                Rassegna Stampa{" "}
              </h2>

              <div className="mt-6 aspect-video">
                <iframe
                  className="w-full h-full rounded-lg"
                  src="/docs/rassegna_stampa.pdf"
                  title="Relazione introduttiva del Segretario"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:w-1/3 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            {/* Title with red bar */}
            <div className="flex gap-4 mb-6">
              <div className="w-1 bg-red-600 flex-shrink-0"></div>
              <h2 className="text-xl font-bold text-red-700">
                "Rivivi i momenti salienti dell'evento"
              </h2>
            </div>

            {/* Navigation with dotted separators */}
            <nav className="space-y-6">
              <div className="relative pb-4 border-b border-dashed border-gray-200">
                <Link
                  href="https://youtu.be/qvd_K7KxtPw?si=2dRw3oolOrsx-q4F"
                  className="block text-gray-900 hover:text-red-600 font-medium"
                  target="_blank"
                >
                  Il dibattito sindacale tra i lavoratori
                </Link>
              </div>

              <div className="relative pb-4 border-b border-dashed border-gray-200">
                <Link
                  href="https://youtu.be/grjh4sk8bJY?si=RQq4UT1rpBb0_Lfd"
                  className="block text-gray-900 hover:text-red-600 font-medium"
                  target="_blank"
                >
                  La formazione continua SNALV Confsal
                </Link>
              </div>

              <div className="relative pb-4 border-b border-dashed border-gray-200">
                <Link
                  href="https://youtu.be/4Q3Bo8Zv4J4?si=0DpFNCLgus0J4FCy"
                  className="block text-gray-900 hover:text-red-600 font-medium"
                  target="_blank"
                >
                  La sicurezza sul lavoro nelle R.S.A.
                </Link>
              </div>

              <div className="relative pb-4 border-b border-dashed border-gray-200">
                <Link
                  href="https://www.youtube.com/live/4NYe4f-1t5g?si=eMT9Rqm4ovKsJGJU"
                  className="block text-gray-900 hover:text-red-600 font-medium"
                  target="_blank"
                >
                  Diretta integrale del panel istituzionale
                </Link>
              </div>

              <div className="relative pb-4 border-b border-dashed border-gray-200">
                <Link
                  href="https://www.youtube.com/live/SGpa2pyL8Dw?si=5DIZy9un3zf1aaOq"
                  className="block text-gray-900 hover:text-red-600 font-medium"
                  target="_blank"
                >
                  Diretta integrale del panel sindacale
                </Link>
              </div>

              <div className="relative">
                <Link
                  href="https://drive.google.com/drive/folders/1IsWIFBEsgBlHbOqPDqaH9yNjRYjihz4C?usp=sharing"
                  className="block text-gray-900 hover:text-red-600 font-medium"
                  target="_blank"
                >
                  Fotogallery
                </Link>
              </div>
            </nav>
          </div>

          {/* Media Partners - unchanged */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold text-red-700 mb-4">
              MEDIA PARTNER
            </h2>
            <div className="space-y-4">
              <Image
                src="/img/1dps.png"
                alt="FPS Logo"
                width={200}
                height={100}
                className="w-auto"
              />
              <Image
                src="/img/aicon.png"
                alt="Aicon Logo"
                width={200}
                height={100}
                className="w-auto"
              />
            </div>
          </div>
        </aside>
      </main>

      <Footer />
    </>
  );
}
