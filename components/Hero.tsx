"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-32">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 opacity-20 blur-3xl" />

      <div className="relative max-w-6xl mx-auto text-center px-6">

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-7xl font-extrabold"
        >
          Convert Images
          <br />
          Into Beautiful PDFs
        </motion.h1>

        <p className="mt-8 text-xl text-muted-foreground">
          Fast, Secure, Cloud Powered PDF Toolkit
        </p>

        <button className="mt-10 bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-xl text-white flex items-center gap-2 mx-auto">
          Start Converting
          <ArrowRight size={20} />
        </button>

      </div>
    </section>
  );
}