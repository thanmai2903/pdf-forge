"use client";

import {
  useState,
  useEffect,
} from "react";

import { PDFDocument } from "pdf-lib";

export default function SplitPDF() {
  const [file, setFile] =
    useState<File | null>(null);

  const [startPage, setStartPage] =
    useState("");

  const [endPage, setEndPage] =
    useState("");

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

    return () => clearTimeout(timer);
  }, [success]);

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [error]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selected =
      e.target.files?.[0];

    if (!selected) return;

    setFile(selected);
    setError("");
    setSuccess("");
  };

  const splitPDF = async () => {
    setError("");
    setSuccess("");

    if (!file) {
      setError(
        "Please upload a PDF file."
      );
      return;
    }

    try {
      setLoading(true);

      const bytes =
        await file.arrayBuffer();

      const pdf =
        await PDFDocument.load(
          bytes
        );

      const totalPages =
        pdf.getPageCount();

      const start =
        Number(startPage);

      const end =
        Number(endPage);

      if (
        !start ||
        !end
      ) {
        setError(
          "Enter both start and end page."
        );
        return;
      }

      if (
        start < 1 ||
        end > totalPages ||
        start > end
      ) {
        setError(
          `Pages must be between 1 and ${totalPages}`
        );
        return;
      }

      const newPdf =
        await PDFDocument.create();

      const pageIndices =
        Array.from(
          {
            length:
              end -
              start +
              1,
          },
          (_, i) =>
            start -
            1 +
            i
        );

      const copiedPages =
        await newPdf.copyPages(
          pdf,
          pageIndices
        );

      copiedPages.forEach(
        (page) =>
          newPdf.addPage(page)
      );

      const newBytes =
        await newPdf.save();

      const blob =
        new Blob(
          [
            newBytes.buffer as ArrayBuffer,
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

      link.download = `pages-${start}-${end}.pdf`;

      link.click();

      URL.revokeObjectURL(
        url
      );

      setSuccess(
        `Pages ${start}-${end} downloaded successfully`
      );
    } catch (err) {
      console.error(err);

      setError(
        "Failed to split PDF."
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
          Split PDF
        </h2>

        <p className="text-muted-foreground mt-2">
          Extract specific pages
          from your PDF.
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
          onChange={
            handleFileChange
          }
          className="w-full"
        />

        <p className="mt-3 text-sm text-muted-foreground">
          Upload one PDF file
        </p>
      </div>

      {file && (
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
            {file.name}
          </p>

          <p className="text-sm text-muted-foreground">
            {(
              file.size /
              1024
            ).toFixed(1)}
            {" "}KB
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4 mt-8">
        <input
          type="number"
          placeholder="Start Page"
          value={startPage}
          onChange={(e) =>
            setStartPage(
              e.target.value
            )
          }
          className="
            border
            rounded-xl
            p-4
          "
        />

        <input
          type="number"
          placeholder="End Page"
          value={endPage}
          onChange={(e) =>
            setEndPage(
              e.target.value
            )
          }
          className="
            border
            rounded-xl
            p-4
          "
        />
      </div>

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
        onClick={splitPDF}
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
          ? "Processing..."
          : "Split PDF"}
      </button>
    </section>
  );
}