"use client";

import { useState } from "react";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import UploadZone from "@/components/UploadZone";
import ImagePreview from "@/components/ImagePreview";
import PDFSettings from "@/components/PDFSettings";
import ConvertButton from "@/components/ConvertButton";
import Stats from "@/components/Stats";
import Pricing from "../components/Pricing";
import MergePDF from "@/components/MergePDF";
import SplitPDF from "@/components/SplitPDF";
import CompressPDF from "@/components/CompressPDF";
export interface ImageItem {
  file: File;
  preview: string;
  name: string;
}

export default function Home() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] =
    useState<"a4" | "letter">("a4");

  const [orientation, setOrientation] =
    useState<"p" | "l">("p");

  return (
    <>
      <Navbar />

      <Hero />

      <Stats />

      <main className="max-w-7xl mx-auto p-8">
        <Features />
        <Pricing />


        <UploadZone setFiles={setImages} />

        <MergePDF/>
        <SplitPDF />
<CompressPDF />
        {images.length > 0 && (
          <>
            <PDFSettings
              pageSize={pageSize}
              setPageSize={setPageSize}
              orientation={orientation}
              setOrientation={setOrientation}
            />

            <ImagePreview
              images={images}
              setImages={setImages}
            />

            <div className="text-center">
              <ConvertButton
                images={images}
                pageSize={pageSize}
                orientation={orientation}
              />
            </div>
          </>
        )}
      </main>
    </>
  );
}