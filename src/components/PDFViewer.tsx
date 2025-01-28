"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";

const PDFViewer = ({ url, title }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>

      <div className="h-[800px] rounded-lg overflow-hidden">
        <iframe
          src={`https://docs.google.com/viewer?url=${encodeURIComponent(
            url
          )}&embedded=true`}
          className="w-full h-full border-0"
          title={title}
        />
      </div>

      <div className="mt-4 flex justify-end">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2"
        >
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Scarica PDF
          </Button>
        </a>
      </div>
    </div>
  );
};

export default PDFViewer;
