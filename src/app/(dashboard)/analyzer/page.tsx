"use client";
import React, { useState, useRef, useEffect } from "react";
import { Upload, FileText, Loader2, CheckCircle, Sun, Moon, Sparkles } from 'lucide-react';
import { useUploadFile } from "@/service/uploadresume";
import { useRouter } from 'next/navigation';
import { useTheme } from "@/context/ThemeContext";

const PDFUploadComponent: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const router = useRouter();
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: uploadFileAsync, isPending, isSuccess } = useUploadFile();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      generatePDFPreview(selectedFile);
    } else {
      alert("Please select a PDF file");
    }
  };

  const generatePDFPreview = (file: File): void => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        setPdfPreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async (): Promise<void> => {
    if (!file) return;

    setIsAnalyzing(true);

    try {
      // Simulate analysis time for visual effect
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = await uploadFileAsync(file);
      
      setAnalysisComplete(true);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Redirect to /chat/:id
      if (result.cv.id) {
        router.push(`/chat/${result.cv.id}`);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setIsAnalyzing(false);
    }
  };

  const resetUpload = (): void => {
    setFile(null);
    setPdfPreview(null);
    setIsAnalyzing(false);
    setAnalysisComplete(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className={`min-h-screen w-full p-4 sm:p-8 flex items-center justify-center transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
          : "bg-gradient-to-br from-slate-50 via-white to-slate-50"
      }`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20 ${
          theme === "dark" ? "bg-indigo-600" : "bg-indigo-300"
        } animate-pulse`} />
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-20 ${
          theme === "dark" ? "bg-purple-600" : "bg-purple-300"
        } animate-pulse delay-1000`} />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Header with theme toggle */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className={`text-4xl font-bold mb-2 ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}>
              Upload Your CV
            </h1>
            <p className={`text-lg ${
              theme === "dark" ? "text-slate-400" : "text-slate-600"
            }`}>
              Get your resume analyzed and improved
            </p>
          </div>
          {/* <button
            onClick={toggleTheme}
            className={`p-3 rounded-full transition-all duration-300 ${
              theme === "dark"
                ? "bg-slate-800 hover:bg-slate-700 text-yellow-400"
                : "bg-slate-200 hover:bg-slate-300 text-indigo-600"
            }`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-6 h-6" />
            ) : (
              <Moon className="w-6 h-6" />
            )}
          </button> */}
        </div>

        {!file ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all duration-300 group ${
              theme === "dark"
                ? "border-indigo-500 hover:border-indigo-400 hover:bg-slate-800/50"
                : "border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50/50"
            }`}
          >
            <div className="flex justify-center mb-6">
              <div className={`p-6 rounded-2xl transition-all duration-300 group-hover:scale-110 ${
                theme === "dark"
                  ? "bg-indigo-600/20"
                  : "bg-indigo-100"
              }`}>
                <Upload className={`w-16 h-16 ${
                  theme === "dark" ? "text-indigo-400" : "text-indigo-600"
                }`} />
              </div>
            </div>
            <h2 className={`text-2xl font-bold mb-2 ${
              theme === "dark" ? "text-white" : "text-slate-900"
            }`}>
              Click to upload PDF
            </h2>
            <p className={`mb-4 ${
              theme === "dark" ? "text-slate-400" : "text-slate-600"
            }`}>
              or drag and drop your CV here
            </p>
            <p className={`text-sm ${
              theme === "dark" ? "text-slate-500" : "text-slate-500"
            }`}>
              Supported format: PDF up to 10MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className={`rounded-3xl p-8 transition-all duration-300 ${
            isAnalyzing ? "scale-105" : "scale-100"
          } ${
            theme === "dark"
              ? "bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700"
              : "bg-gradient-to-br from-white to-slate-100 border border-slate-200"
          }`}>
            <div className="space-y-6">
              {/* PDF Preview */}
              <div className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                isAnalyzing ? "border-indigo-500 shadow-2xl shadow-indigo-500/50" : "border-slate-300 dark:border-slate-600"
              }`}>
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-30 animate-pulse z-20" />
                )}
                
                <div className={`w-full h-64 flex items-center justify-center rounded-2xl ${
                  theme === "dark"
                    ? "bg-slate-700"
                    : "bg-slate-200"
                }`}>
                  {pdfPreview ? (
                    <iframe
                      src={`${pdfPreview}#page=1`}
                      className="w-full h-full pointer-events-none rounded-2xl"
                      title="PDF Preview"
                    />
                  ) : (
                    <FileText className={`w-20 h-20 ${
                      theme === "dark" ? "text-slate-500" : "text-slate-400"
                    }`} />
                  )}
                </div>

                {/* Analyzing Overlay */}
                {isAnalyzing && (
                  <div className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl backdrop-blur-sm ${
                    theme === "dark"
                      ? "bg-slate-900/80"
                      : "bg-white/80"
                  }`}>
                    {!analysisComplete ? (
                      <>
                        <Loader2 className="w-16 h-16 text-indigo-500 animate-spin mb-4" />
                        <p className={`text-lg font-semibold ${
                          theme === "dark" ? "text-white" : "text-slate-900"
                        }`}>
                          Analyzing your CV
                        </p>
                        <p className={`text-sm ${
                          theme === "dark" ? "text-slate-400" : "text-slate-600"
                        }`}>
                          Please wait...
                        </p>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
                        <p className={`text-lg font-semibold ${
                          theme === "dark" ? "text-white" : "text-slate-900"
                        }`}>
                          Analysis Complete!
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* File Info */}
              <div>
                <h3 className={`text-xl font-semibold mb-2 ${
                  theme === "dark" ? "text-white" : "text-slate-900"
                }`}>
                  {file.name}
                </h3>
                <p className={`text-sm ${
                  theme === "dark" ? "text-slate-400" : "text-slate-600"
                }`}>
                  Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              {/* Upload Button */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleUpload}
                  disabled={isAnalyzing || isSuccess}
                  className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:scale-100 flex items-center justify-center gap-2 ${
                    isAnalyzing || isSuccess
                      ? "bg-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Uploading...
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Uploaded
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Submit CV
                    </>
                  )}
                </button>
                <button
                  onClick={resetUpload}
                  disabled={isAnalyzing}
                  className={`px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-slate-700 text-slate-200 hover:bg-slate-600 disabled:opacity-50"
                      : "bg-slate-200 text-slate-700 hover:bg-slate-300 disabled:opacity-50"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFUploadComponent;
