"use client";

import LoginButton from "./LoginButton";
import { useAuth } from "../src/hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";

export default function Navbar() {
  const { user } = useAuth();

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b">
      <h1 className="text-xl font-bold">PDF Forge</h1>

      <div className="flex items-center gap-6">
        <a className="hover:text-indigo-500" href="#features">Features</a>
<a className="hover:text-indigo-500" href="#pricing">Pricing</a>
{user && (
  <Link
    href="/dashboard"
    className="font-medium"
  >
    Dashboard
  </Link>
)}
        {user ? (
          <div className="flex items-center gap-3">
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Logout
            </button>
            <img
              src={user.photoURL || ""}
              className="w-8 h-8 rounded-full"
            />

            
          </div>
        ) : (
          <LoginButton />
        )}
      </div>
    </nav>
  );
}