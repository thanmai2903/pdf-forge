"use client";

import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/firebase";
import {
  doc,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function LoginButton() {
  const [loading, setLoading] =
    useState(false);

  const login = async () => {
    if (loading) return;

    try {
  setLoading(true);

  const result =
    await signInWithPopup(
      auth,
      provider
    );

  await setDoc(
    doc(
      db,
      "users",
      result.user.uid
    ),
    {
      uid: result.user.uid,
      email: result.user.email,
      name: result.user.displayName,
      photo: result.user.photoURL,
      createdAt: Date.now(),
    },
    {
      merge: true,
    }
  );

} catch (error: any) {
  if (
    error.code !==
    "auth/cancelled-popup-request"
  ) {
    console.error(error);
  }
} finally {
  setLoading(false);
}
};

  return (
    <button
      onClick={login}
      disabled={loading}
      className="
        bg-blue-600
        hover:bg-blue-700
        text-white
        px-6
        py-2
        rounded-lg
        disabled:opacity-50
      "
    >
      {loading
        ? "Signing In..."
        : "Login With Google"}
    </button>
  );
}