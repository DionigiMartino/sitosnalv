"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const PDFViewer = ({ url, title }) => {
  // Creiamo un URL sicuro per l'iframe
  const getSecureUrl = () => {
    // Se l'URL è già un blob o un URL di Google Drive, lo usiamo direttamente
    if (url.startsWith("blob:") || url.includes("drive.google.com")) {
      return url;
    }
    // Altrimenti, usiamo Google Docs Viewer
    return `https://docs.google.com/viewer?url=${encodeURIComponent(
      url
    )}&embedded=true`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <a href={url} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Scarica PDF
          </Button>
        </a>
      </div>

      <div className="relative min-h-[800px] rounded-lg overflow-hidden bg-gray-50">
        <iframe
          src={getSecureUrl()}
          className="w-full h-full absolute inset-0 border-0"
          title={title}
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default PDFViewer;
