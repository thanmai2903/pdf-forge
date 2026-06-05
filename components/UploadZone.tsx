"use client";

import { useDropzone } from "react-dropzone";
import { useState, useEffect } from "react";

interface UploadItem {
  file: File;
  preview: string;
  name: string;
}

interface UploadZoneProps {
  setFiles: React.Dispatch<React.SetStateAction<UploadItem[]>>;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  maxSizeMB?: number;
}

export default function UploadZone({
  accept = { "application/pdf": [] }, // default PDF for your SaaS tools
  multiple = true,
  maxSizeMB = 50,
}: UploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState("");
const [files, setFiles] = useState<UploadItem[]>([]);
  const onDrop = (acceptedFiles: File[]) => {
    setError("");

    const validFiles: UploadItem[] = [];

    for (const file of acceptedFiles) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File ${file.name} exceeds ${maxSizeMB}MB limit`);
        continue;
      }

      validFiles.push({
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
      });
    }

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const {
    getRootProps,
    getInputProps,
  } = useDropzone({
    accept,
    multiple,
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  // cleanup previews (important for memory leaks)
  useEffect(() => {
  return () => {
    // only cleanup memory, NO state update
    files.forEach((file) => {
      URL.revokeObjectURL(file.preview);
    });
  };
}, [files]);
const removeFile = (name: string) => {
  setFiles((prev) => {
    const target = prev.find((f) => f.name === name);

    if (target) {
      URL.revokeObjectURL(target.preview);
    }

    return prev.filter((f) => f.name !== name);
  });
};

  return (
    <div
      {...getRootProps()}
      className={`
        mt-12
        border-2
        border-dashed
        rounded-3xl
        p-16
        text-center
        cursor-pointer
        transition
        bg-card
        shadow-sm

        ${
          isDragActive
            ? "border-indigo-500 bg-indigo-50"
            : "border-gray-300 hover:border-indigo-400"
        }
      `}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center justify-center gap-2">
        <h2 className="text-3xl font-bold">
          {isDragActive ? "Drop files here" : "Upload Files"}
        </h2>

        <p className="text-muted-foreground">
          Drag & drop your files or click to browse
        </p>

        <p className="text-xs text-gray-500 mt-2">
          Supported: PDF • Max {maxSizeMB}MB
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-6 bg-red-100 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}
    </div>
  );
}