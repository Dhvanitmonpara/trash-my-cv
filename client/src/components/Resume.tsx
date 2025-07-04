import React, { useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";
import type { IReview } from "../types/Review";

interface ResumeUploadProps {
  onReviewReceived: (review: IReview) => void;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onReviewReceived }) => {
  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      return;
    }

    setError(null);
    setFile(selectedFile);

    const blobUrl = URL.createObjectURL(selectedFile);
    setPdfUrl(blobUrl);
  };

  const handleReview = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:8000/upload-resume/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onReviewReceived(JSON.parse(response.data));
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.detail || "Failed to analyze resume.");
      } else {
        setError("Failed to analyze resume.");
        console.log(err);
      }
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  return (
    <div className="w-full max-w-xl mx-auto p-6 border-2 border-dashed border-gray-600 rounded-lg bg-zinc-900">
      <label
        htmlFor="resume-upload"
        className="flex flex-col items-center justify-center h-40 cursor-pointer text-gray-300 hover:text-gray-200"
      >
        <svg
          className="w-10 h-10 mb-2 text-gray-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 16v-4m0 0V8m0 4h4m-4 0H8m8 8H8a4 4 0 01-4-4V8a4 4 0 014-4h3m5 0h.01"
          />
        </svg>
        <p className="text-sm">Click to upload a PDF resume</p>
        <p className="text-xs text-gray-500 mt-1">Only .pdf files supported</p>
      </label>

      <input
        id="resume-upload"
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />

      {error && <p className="mt-4 text-sm text-red-600 text-center">{error}</p>}

      {pdfUrl && (
        <div className="mt-6">
          <div className="border border-gray-700 rounded-md overflow-hidden bg-black h-[500px] mb-4">
            <iframe src={pdfUrl} className="w-full h-full" title="Resume preview" />
          </div>

          <button
            onClick={handleReview}
            disabled={uploading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition duration-200"
          >
            {uploading ? "Analyzing..." : "Review Resume"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
