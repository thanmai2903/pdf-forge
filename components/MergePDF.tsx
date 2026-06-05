"use client";

import {
  useState,
  useEffect,
} from "react";

import { PDFDocument } from "pdf-lib";

export default function MergePDF() {
  const [files, setFiles] =
    useState<File[]>([]);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      setSuccess("");
    }, 4000);

    return () =>
      clearTimeout(timer);
  }, [success]);

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError("");
    }, 4000);

    return () =>
      clearTimeout(timer);
  }, [error]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;

    const newFiles =
      Array.from(
        e.target.files
      );

    setFiles((prev) => [
      ...prev,
      ...newFiles,
    ]);

    setError("");
    setSuccess("");
  };

  const removeFile = (
    index: number
  ) => {
    setFiles(
      files.filter(
        (_, i) => i !== index
      )
    );
  };

  const mergePDFs = async () => {
    setError("");
    setSuccess("");

    if (files.length < 2) {
      setError(
        "Select at least 2 PDFs to merge."
      );
      return;
    }

    try {
      setLoading(true);

      const mergedPdf =
        await PDFDocument.create();

      for (const file of files) {
        const bytes =
          await file.arrayBuffer();

        const pdf =
          await PDFDocument.load(
            bytes
          );

        const pages =
          await mergedPdf.copyPages(
            pdf,
            pdf.getPageIndices()
          );

        pages.forEach(
          (page) =>
            mergedPdf.addPage(page)
        );
      }

      const mergedBytes =
        await mergedPdf.save();

      const blob =
        new Blob(
          [
            mergedBytes.buffer as ArrayBuffer,
          ],
          {
            type:
              "application/pdf",
          }
        );

      const url =
        URL.createObjectURL(
          blob
        );

      const link =
        document.createElement(
          "a"
        );

      link.href = url;
      link.download =
        "merged.pdf";

      link.click();

      URL.revokeObjectURL(
        url
      );

      setSuccess(
        `Successfully merged ${files.length} PDFs`
      );
    } catch (err) {
      console.error(err);

      setError(
        "Failed to merge PDFs."
      );
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
      <div className="mb-8">
        <h2 className="text-3xl font-bold">
          Merge PDF
        </h2>

        <p className="text-muted-foreground mt-2">
          Combine multiple PDF
          files into one document.
        </p>
      </div>

      <div
        className="
        border-2
        border-dashed
        rounded-2xl
        p-8
        text-center
      "
      >
        <input
          type="file"
          accept=".pdf"
          multiple
          onChange={
            handleChange
          }
          className="w-full"
        />

        <p className="mt-3 text-sm text-muted-foreground">
          Upload multiple PDF
          files
        </p>
      </div>

      {files.length > 0 && (
        <div
          className="
          mt-6
          rounded-xl
          border
          p-4
          bg-muted/30
        "
        >
          <p className="font-medium">
            Selected Files:
            {" "}
            {files.length}
          </p>
        </div>
      )}

      {error && (
        <div
          className="
          mt-6
          bg-red-100
          text-red-700
          px-4
          py-3
          rounded-xl
          flex
          justify-between
          items-center
        "
        >
          <span>{error}</span>

          <button
            onClick={() =>
              setError("")
            }
          >
            ✕
          </button>
        </div>
      )}

      {success && (
        <div
          className="
          mt-6
          bg-green-100
          text-green-700
          px-4
          py-3
          rounded-xl
          flex
          justify-between
          items-center
        "
        >
          <span>
            {success}
          </span>

          <button
            onClick={() =>
              setSuccess("")
            }
          >
            ✕
          </button>
        </div>
      )}

      <button
        onClick={mergePDFs}
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
        {loading
          ? "Merging..."
          : "Merge PDFs"}
      </button>

      {files.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold mb-4">
            Files To Merge
          </h3>

          <div className="space-y-3">
            {files.map(
              (
                file,
                index
              ) => (
                <div
                  key={`${file.name}-${index}`}
                  className="
                    border
                    rounded-xl
                    p-4
                    flex
                    justify-between
                    items-center
                  "
                >
                  <div>
                    <p className="font-medium">
                      {index + 1}.{" "}
                      {file.name}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {(
                        file.size /
                        1024
                      ).toFixed(
                        1
                      )}
                      {" "}KB
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      removeFile(
                        index
                      )
                    }
                    className="
                      text-red-500
                      hover:text-red-700
                    "
                  >
                    Remove
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </section>
  );
}