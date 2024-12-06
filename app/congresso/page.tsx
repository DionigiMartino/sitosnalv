import React from "react";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import Link from "next/link";

export default function Congresso() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center my-16 w-3/4 gap-12 mx-auto ">
        <h1 className="font-bold text-4xl text-blue-600">
          Il 13 e 14 Febbraio 2018 si è tenuto a Roma presso il Grand Hotel
          Palatino il 1^ Congresso Nazionale dello SNALV Confsal. Con la
          presenza di oltre cento delegati provenienti da tutto il Paese, è
          stato confermato all&apos;unanimità il mandato di Segretario Nazionale
          alla dott.ssa Maria Mamone.
        </h1>

        <iframe
          className="w-full h-[65vh] rounded-md"
          src="https://www.youtube.com/embed/BzCl6txNiKo"
        ></iframe>

        <Link className="text-center bg-blue-600 text-white font-bold rounded-md py-3 px-6 hover:opacity-50 transition-all duration-150" href="/docs/relazione.pdf">
          Relazione del Segretario Nazionale
        </Link>

        <Link className="text-center bg-blue-600 text-white font-bold rounded-md py-3 px-6 hover:opacity-50 transition-all duration-150" href="/docs/mozione.pdf">Mozione Finale</Link>
      </main>

      <Footer />
    </>
  );
}
