"use client";

import { jsPDF } from "jspdf";
import { ImageItem } from "@/app/page";
import { db, auth }
from "@/lib/firebase";

import {
  addDoc,
  collection,
} from "firebase/firestore";

interface Props {
  images: ImageItem[];
  pageSize: "a4" | "letter";
  orientation: "p" | "l";
}

export default function ConvertButton({
  images,
  pageSize,
  orientation,
}: Props) {
  const generatePDF = async () => {
  if (!images.length) return;

  const pdf = new jsPDF({
    orientation,
    unit: "mm",
    format: pageSize,
  });

  for (let i = 0; i < images.length; i++) {
    const img = images[i];

    if (i > 0) pdf.addPage();

    const image = new Image();
    image.src = img.preview;

    await new Promise<void>((resolve) => {
      image.onload = () => {
        pdf.addImage(
          image,
          "JPEG",
          10,
          10,
          190,
          250
        );
        resolve();
      };
    });
  }

  const pdfBlob =
  pdf.output("blob");

  const formData =
  new FormData();

formData.append(
  "file",
  new File(
    [pdfBlob],
    "pdf-forge.pdf",
    {
      type:
        "application/pdf",
    }
  )
);

const response =
  await fetch(
    "/api/upload-pdf",
    {
      method: "POST",
      body: formData,
    }
  );

const data =
  await response.json();

  const user =
  auth.currentUser;

if (user) {
  await addDoc(
    collection(
      db,
      "history"
    ),
    {
      userId: user.uid,
      userName:
        user.displayName,

      fileName:
        "pdf-forge.pdf",

      pages:
        images.length,

      pdfUrl:
        data.url,

      createdAt:
        Date.now(),
    }
  );
}

// Download PDF locally
pdf.save("pdf-forge.pdf");
};

  return (
    <button
      onClick={generatePDF}
      className="
        mt-10
        bg-green-600
        hover:bg-green-700
        text-white
        px-10
        py-4
        rounded-xl
        text-lg
      "
    >
      Convert To PDF
    </button>
  );
}