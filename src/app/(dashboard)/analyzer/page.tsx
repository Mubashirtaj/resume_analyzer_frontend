"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  XCircle,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useUploadFile } from "@/service/uploadresume";
import { useRouter } from "next/navigation";

interface isSuccess {
  type: "success" | "error" | null;
}

const PDFUploadComponent: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  //   const [isPending, setisPending] = useState<boolean>(false);
  //   const [isSuccess, setisSuccess] = useState<"success" | "error" | null>(
  //     null
  //   );
  const router = useRouter();
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const { isDark, toggleTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    mutateAsync: uploadFileAsync,
    isPending,
    isSuccess,
    isError,
  } = useUploadFile();

  // Check for saved theme preference or default to light mode

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

    try {
      const result = await uploadFileAsync(file);
      console.log("Upload result:", result);

      // Redirect to /chat/:id
      if (result.id) {
        router.push(`/chat/${result.id}`);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
    }
  };

  const resetUpload = (): void => {
    setFile(null);
    setPdfPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className={`min-h-screen min-w-full max-w-full  p-4 sm:p-8 flex items-center justify-center transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-neutral-900 to-neutral-800"
          : "bg-white"
      }`}
    >
      <div className="w-full max-w-4xl">
        <div
          className={`rounded-2xl  p-6 sm:p-10 transition-colors duration-300 ${
            isDark ? "bg-neutral-800" : "bg-white"
          }`}
        >
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-full transition-all duration-300 ${
                isDark
                  ? "bg-neutral-700 hover:bg-neutral-600 text-yellow-400"
                  : "bg-neutral-200 hover:bg-neutral-300 text-indigo-600"
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-6 h-6" />
              ) : (
                <Moon className="w-6 h-6" />
              )}
            </button>
          </div>

          <h1
            className={`text-3xl font-bold mb-8 text-center transition-colors duration-300 ${
              isDark ? "text-neutral-100" : "text-neutral-800"
            }`}
          >
            PDF Upload Center
          </h1>

          {!file ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-4 border-dashed rounded-xl p-12 sm:p-20 text-center cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                isDark
                  ? "border-indigo-600 hover:border-indigo-400 hover:bg-neutral-700"
                  : "border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50"
              }`}
            >
              <Upload
                className={`w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-6 transition-colors duration-300 ${
                  isDark ? "text-indigo-400" : "text-indigo-400"
                }`}
              />
              <h2
                className={`text-2xl font-semibold mb-3 transition-colors duration-300 ${
                  isDark ? "text-neutral-200" : "text-neutral-700"
                }`}
              >
                Click to Upload PDF
              </h2>
              <p
                className={`transition-colors duration-300 ${
                  isDark ? "text-neutral-400" : "text-neutral-500"
                }`}
              >
                or drag and drop your PDF file here
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                name="resume"
                id="resume"
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div
                className={`relative rounded-xl p-8 overflow-hidden transition-colors duration-300 ${
                  isDark
                    ? "bg-gradient-to-br from-neutral-700 to-neutral-600"
                    : "bg-gradient-to-br from-neutral-100 to-neutral-200"
                }`}
              >
                {isPending && (
                  <div className="absolute inset-0 bg-indigo-500 bg-opacity-10 flex items-center justify-center z-10">
                    <div
                      className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-indigo-300 to-transparent opacity-30"
                      style={{
                        animation: "scan 2s linear infinite",
                        backgroundSize: "200% 100%",
                      }}
                    />
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-32 h-40 rounded-lg shadow-lg flex items-center justify-center border-2 overflow-hidden transition-colors duration-300 ${
                        isDark
                          ? "bg-neutral-800 border-neutral-600"
                          : "bg-white border-neutral-300"
                      }`}
                    >
                      {pdfPreview ? (
                        <iframe
                          src={`${pdfPreview}#page=1`}
                          className="w-full h-full pointer-events-none"
                          title="PDF Preview"
                        />
                      ) : (
                        <FileText
                          className={`w-16 h-16 transition-colors duration-300 ${
                            isDark ? "text-neutral-500" : "text-neutral-400"
                          }`}
                        />
                      )}
                    </div>
                    {isPending && (
                      <div
                        className={`absolute inset-0 flex items-center justify-center rounded-lg transition-colors duration-300 ${
                          isDark
                            ? "bg-neutral-800 bg-opacity-70"
                            : "bg-white bg-opacity-70"
                        }`}
                      >
                        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <h3
                      className={`text-xl font-semibold truncate mb-2 transition-colors duration-300 ${
                        isDark ? "text-neutral-100" : "text-neutral-800"
                      }`}
                    >
                      {file.name}
                    </h3>
                    <p
                      className={`mb-4 transition-colors duration-300 ${
                        isDark ? "text-neutral-300" : "text-neutral-600"
                      }`}
                    >
                      Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>

                    {isPending && (
                      <div className="space-y-2">
                        <div
                          className={`flex items-center justify-center sm:justify-start gap-2 transition-colors duration-300 ${
                            isDark ? "text-indigo-400" : "text-indigo-600"
                          }`}
                        >
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="font-medium">
                            Scanning and uploading...
                          </span>
                        </div>
                        <div
                          className={`w-full rounded-full h-2 overflow-hidden transition-colors duration-300 ${
                            isDark ? "bg-neutral-600" : "bg-neutral-300"
                          }`}
                        >
                          <div
                            className="h-full bg-indigo-600 rounded-full animate-pulse"
                            style={{ width: "70%" }}
                          />
                        </div>
                      </div>
                    )}

                    {isSuccess && (
                      <div
                        className={`flex items-center justify-center sm:justify-start gap-2 transition-colors duration-300 ${
                          isDark ? "text-green-400" : "text-green-600"
                        }`}
                      >
                        <CheckCircle className="w-6 h-6" />
                        <span className="font-medium">Upload successful!</span>
                      </div>
                    )}

                    {!isSuccess && (
                      <div
                        className={`flex items-center justify-center sm:justify-start gap-2 transition-colors duration-300 ${
                          isDark ? "text-red-400" : "text-red-600"
                        }`}
                      >
                        <XCircle className="w-6 h-6" />
                        <span className="font-medium">
                          Upload failed. Please try again.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleUpload}
                  disabled={isPending || isSuccess}
                  className="flex-1 bg-indigo-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-indigo-700 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95"
                >
                  {isPending
                    ? "Uploading..."
                    : isSuccess
                    ? "Uploaded"
                    : "Upload PDF"}
                </button>
                <button
                  onClick={resetUpload}
                  disabled={isPending}
                  className={`flex-1 sm:flex-none py-4 px-6 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ${
                    isDark
                      ? "bg-neutral-700 text-neutral-200 hover:bg-neutral-600"
                      : "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
};

export default PDFUploadComponent;
