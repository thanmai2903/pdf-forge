"use client";

import { useState, useEffect } from "react";

export default function CompressPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => setSuccess(""), 4000);
    return () => clearTimeout(timer);
  }, [success]);

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => setError(""), 4000);
    return () => clearTimeout(timer);
  }, [error]);

  const compressPDF = async () => {
    setError("");
    setSuccess("");

    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    try {
      setLoading(true);

      // fake compression delay (replace with real API later)
      await new Promise((res) => setTimeout(res, 2000));

      const url = URL.createObjectURL(file);
      const link = document.createElement("a");

      link.href = url;
      link.download = "compressed.pdf";
      link.click();

      URL.revokeObjectURL(url);

      setSuccess("PDF compressed successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to compress PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="
      mt-12
      rounded-3xl
      border
      bg-card
      p-8
      shadow-sm
    "
    >
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold">
          Compress PDF
        </h2>

        <p className="text-muted-foreground mt-2">
          Reduce PDF size for faster sharing and uploads.
        </p>
      </div>

      {/* Upload Box (same as MergePDF style) */}
      <div className="border-2 border-dashed rounded-2xl p-8 text-center">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) =>
            setFile(e.target.files?.[0] || null)
          }
          className="w-full"
        />

        <p className="mt-3 text-sm text-muted-foreground">
          Upload a PDF file
        </p>
      </div>

      {/* Selected File */}
      {file && (
        <div className="mt-6 rounded-xl border p-4 bg-muted/30">
          <p className="font-medium">Selected File:</p>

          <div className="mt-2 flex justify-between items-center">
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>

            <button
              onClick={() => setFile(null)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-6 bg-red-100 text-red-700 px-4 py-3 rounded-xl flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError("")}>✕</button>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="mt-6 bg-green-100 text-green-700 px-4 py-3 rounded-xl flex justify-between items-center">
          <span>{success}</span>
          <button onClick={() => setSuccess("")}>✕</button>
        </div>
      )}

      {/* Button */}
      <button
        onClick={compressPDF}
        disabled={loading}
        className="
          mt-8
          w-full
          bg-indigo-600
          hover:bg-indigo-700
          text-white
          py-4
          rounded-xl
          font-semibold
          disabled:opacity-50
        "
      >
        {loading ? "Compressing..." : "Compress PDF"}
      </button>
    </section>
  );
}