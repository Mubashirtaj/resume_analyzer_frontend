"use client";
import { useFetchData } from "@/service/Get_data";
import React, { useState, useEffect, useRef } from "react";

type ViewProps = {
  id: string;
};

const View: React.FC<ViewProps> = ({ id }) => {
 
  const [editableHTML, setEditableHTML] = useState<string>("");
  const editorRef = useRef<HTMLDivElement>(null);
  const editorRef1 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data?.improvedText) {
      setEditableHTML(data.improvedText);
    }
  }, [data]);

  // 📝 Download as HTML file
  const handleDownload = () => {
    const blob = new Blob([editableHTML], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "resume.html";
    link.click();
  };

  // 🧾 Download as PDF file (using browser print)
const handlePDF = () => {
  if (!editorRef1.current) return;

  const printContents = editorRef1.current.innerHTML;

  const iframe = document.createElement("iframe");
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) return;

  doc.open();
  doc.write(`
    <html>
      <head>
        <title>Resume</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.3.3/dist/tailwind.min.css" rel="stylesheet">
        <style>
          body { padding: 20px; }
          .prose { max-width: 100%; }
        </style>
      </head>
      <body>${printContents}</body>
    </html>
  `);
  doc.close();

  iframe.contentWindow?.focus();
  iframe.contentWindow?.print();

  document.body.removeChild(iframe);
};


  if (isLoading) return <p>Loading CV...</p>;
  if (error) return <p>Error loading CV.</p>;

  return (
    <div className="p-4">
      <div className="flex justify-end gap-2 mb-3">
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download HTML
        </button>
        <button
          onClick={handlePDF}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Download PDF
        </button>
      </div>

      {/* Editable CV Area */}
      <div className="page h-[1200px] overflow-hidden" ref={editorRef1}>
          <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => setEditableHTML(e.currentTarget.innerHTML)}
        className=""
        dangerouslySetInnerHTML={{ __html: editableHTML }}
      />
  </div>
    
    </div>
  );
};

export default View;
