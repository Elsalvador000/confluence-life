"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useSupabase } from "@/lib/useSupabase";

type Player = {
  id: string;
  name: string;
  money: number;
  energy: number;
  outfit: string;
};

export default function PlayPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const supabase = useSupabase();
  const [player, setPlayer] = useState<Player | null>(null);
  const [status, setStatus] = useState("Loading…");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    async function ensurePlayer() {
      try {
        setStatus("Checking your account…");

        // Try to load the existing player row
        const { data: existing, error: readErr } = await supabase
          .from("players")
          .select("*")
          .eq("id", user!.id)
          .maybeSingle();

        if (readErr) throw new Error(readErr.message);

        if (existing) {
          setPlayer(existing as Player);
          setStatus("");
          return;
        }

        // No row yet — create one
        setStatus("Creating your player…");

        const displayName =
          user!.fullName ||
          user!.username ||
          user!.primaryEmailAddress?.emailAddress?.split("@")[0] ||
          "New Player";

        const { data: created, error: insertErr } = await supabase
          .from("players")
          .insert({
            id: user!.id,
            name: displayName,
          })
          .select()
          .single();

        if (insertErr) throw new Error(insertErr.message);

        setPlayer(created as Player);
        setStatus("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setStatus("");
      }
    }

    ensurePlayer();
  }, [isLoaded, isSignedIn, user, supabase]);

  // Not signed in
  if (isLoaded && !isSignedIn) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center bg-white rounded-3xl shadow-xl p-10 border border-amber-200">
          <p className="text-4xl">🔒</p>
          <h1 className="mt-3 text-2xl font-bold text-stone-900">
            Please sign in first
          </h1>
          <p className="mt-4 text-stone-600">
            You need an account to play Confluence Life.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/sign-up"
              className="bg-amber-600 text-white font-bold py-3 rounded-full hover:bg-amber-700 transition"
            >
              Create an Account
            </Link>
            <Link
              href="/sign-in"
              className="bg-stone-900 text-white font-bold py-3 rounded-full hover:bg-black transition"
            >
              I already have an account
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Loading / error
  if (!isLoaded || status || !player) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center bg-white rounded-3xl shadow-xl p-10 border border-amber-200">
          {error ? (
            <>
              <p className="text-4xl">⚠️</p>
              <h1 className="mt-3 text-xl font-bold text-red-700">
                Something went wrong
              </h1>
              <p className="mt-3 text-sm text-stone-600 break-words">
                {error}
              </p>
            </>
          ) : (
            <>
              <p className="text-4xl animate-pulse">⏳</p>
              <p className="mt-3 text-stone-600">{status || "Loading…"}</p>
            </>
          )}
          <Link
            href="/"
            className="mt-6 inline-block text-sm font-semibold text-stone-600 hover:text-stone-900"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    );
  }

  // Signed in and ready
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-amber-200">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-700 text-center">
          Welcome to Lokoja
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-stone-900 text-center">
          {player.name}
        </h1>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Money
            </p>
            <p className="text-2xl font-bold text-stone-900 mt-1">
              ₦{player.money.toLocaleString()}
            </p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Energy
            </p>
            <p className="text-2xl font-bold text-stone-900 mt-1">
              {player.energy}
            </p>
          </div>
        </div>

        <div className="mt-4 bg-sky-50 rounded-xl p-4 border border-sky-200">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Outfit
          </p>
          <p className="text-lg font-semibold text-stone-900 mt-1">
            {player.outfit}
          </p>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-stone-600">
            🚧 The 3D world is coming in Stage 4.
          </p>
        </div>

        <Link
          href="/"
          className="mt-6 block text-center text-sm font-semibold text-stone-600 hover:text-stone-900"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}