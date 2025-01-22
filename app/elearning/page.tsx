"use client";

import React, { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";

const ComingSoonPage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  });

  return (
    <>
      <Header />
      <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        <div
          className={`max-w-2xl mx-auto px-6 py-16 relative ${
            mounted ? "animate-fade-in" : "opacity-0"
          }`}
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

          <div className="text-center space-y-12">
            {/* Elegant heading */}
            <div className="space-y-4">
              <h1 className="text-4xl font-extralight text-gray-900 tracking-[0.2em] uppercase">
                Coming Soon
              </h1>
              <div className="w-12 h-px bg-gray-200 mx-auto" />
            </div>

            {/* Main content with refined typography */}
            <div className="space-y-8">
              <p className="text-xl leading-relaxed text-gray-600 font-light tracking-wide">
                Stiamo creando la nuova piattaforma e&#8209;learning
                <br />
                riservata a lavoratori e responsabili sindacali.
              </p>
              <p className="text-xl leading-relaxed text-gray-600 font-light tracking-wide">
                Nel frattempo, per fruire dei nostri corsi,
                <br />
                puoi inviare una mail a:
              </p>
            </div>

            {/* Sophisticated email button */}
            <div className="relative inline-block group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              <a
                href="mailto:formazione@snalv.it"
                className="relative flex items-center px-8 py-4 bg-white rounded-lg leading-none"
              >
                <span className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                  <span className="text-gray-700 tracking-wide group-hover:text-gray-900 transition-colors duration-200">
                    formazione@snalv.it
                  </span>
                </span>
              </a>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/4 -left-4 w-72 h-72 bg-gray-50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
            <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-gray-50 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
        </div>

        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(20px, -20px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
          .animate-fade-in {
            animation: fade-in 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          .animate-blob {
            animation: blob 15s infinite;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </div>
      <Footer />
    </>
  );
};

export default ComingSoonPage;
