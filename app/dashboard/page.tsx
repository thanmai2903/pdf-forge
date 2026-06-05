"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../src/hooks/useAuth";
import { useRouter } from "next/navigation";

import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import HistoryTable from "@/components/HistoryTable";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface HistoryItem {
  id: string;
  fileName: string;
  pages: number;
  createdAt: number;
  pdfUrl?: string;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [fetching, setFetching] = useState(true);

  // 🔥 PROFILE MENU STATE
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "history"),
          where("userId", "==", user.uid)
        );

        const snap = await getDocs(q);

        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<HistoryItem, "id">),
        }));

        setHistory(data);
      } catch (error) {
        console.error(error);
      } finally {
        setFetching(false);
      }
    };

    fetchHistory();
  }, [user]);

  // close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (loading || fetching) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl">
        Loading Dashboard...
      </div>
    );
  }

  if (!user) return null;

  const totalConversions = history.length;
  const totalPDFs = history.length;
  const storageUsed = history.length * 2;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">

      {/* PROFILE CARD */}
      <div className="border rounded-3xl p-8 shadow-sm mr-20 relative">
        <div className="flex items-center gap-5">

          {/* PROFILE IMAGE */}
          <div className="relative" ref={menuRef}>
            <img
              src={user.photoURL || ""}
              alt="Profile"
              onClick={() => setOpenMenu(!openMenu)}
              className="w-20 h-20 rounded-full border cursor-pointer hover:scale-105 transition"
            />

            {/* DROPDOWN MENU */}
            {openMenu && (
              <div className="absolute left-0 mt-3 w-56 bg-white border rounded-xl shadow-lg z-50">
                <button className="w-full text-left px-4 py-3 hover:bg-gray-100">
                  👤 My Profile
                </button>

                <button className="w-full text-left px-4 py-3 hover:bg-gray-100">
                  📄 My Files
                </button>

                <button className="w-full text-left px-4 py-3 hover:bg-gray-100">
                  📊 Usage & Analytics
                </button>

                <button className="w-full text-left px-4 py-3 hover:bg-gray-100">
                  💳 Billing / Subscription
                </button>

                <button className="w-full text-left px-4 py-3 hover:bg-gray-100">
                  ⚙️ Settings
                </button>

                <hr />

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-500 hover:bg-red-50"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>

          {/* USER INFO */}
          <div>
            <h1 className="text-4xl font-bold ml-20">
              Welcome, {user.displayName}
            </h1>

            <p className="text-muted-foreground ml-20">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6 mt-10">
        <div className="rounded-2xl border p-8">
          <h3 className="text-muted-foreground">Total Conversions</h3>
          <p className="text-5xl font-bold mt-3">{totalConversions}</p>
        </div>

        <div className="rounded-2xl border p-8">
          <h3 className="text-muted-foreground">PDFs Created</h3>
          <p className="text-5xl font-bold mt-3">{totalPDFs}</p>
        </div>

        <div className="rounded-2xl border p-8">
          <h3 className="text-muted-foreground">Storage Used</h3>
          <p className="text-5xl font-bold mt-3">{storageUsed} MB</p>
        </div>
      </div>

      {/* HISTORY */}
      <HistoryTable history={history} />
    </div>
  );
}