"use client";

import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 p-6">
      {/* Top bar — Sign In / Sign Up when signed out, avatar when signed in */}
      <div className="max-w-lg mx-auto flex justify-end mb-4 min-h-[44px]">
        {isLoaded && !isSignedIn && (
          <div className="flex gap-2">
            <Link
              href="/sign-in"
              className="text-sm font-semibold text-stone-700 hover:text-stone-900 px-4 py-2 rounded-full transition"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="text-sm font-semibold bg-stone-900 text-white px-4 py-2 rounded-full hover:bg-black transition"
            >
              Sign Up
            </Link>
          </div>
        )}

        {isLoaded && isSignedIn && <UserButton />}
      </div>

      {/* Main card */}
      <div className="max-w-lg mx-auto text-center bg-white rounded-3xl shadow-xl p-10 border border-amber-200">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-700">
          Lokoja · Kogi State
        </p>

        <h1 className="mt-3 text-4xl md:text-5xl font-extrabold text-stone-900">
          Confluence Life
        </h1>

        <p className="mt-4 text-stone-600 leading-relaxed">
          A 3D life game set in Lokoja — where the Niger and Benue rivers meet.
          Walk the city, hustle for work, and meet other players.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="h-2 w-20 rounded-full bg-gradient-to-r from-sky-400 to-sky-600" />
          <div className="h-2 w-20 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-700" />
          <div className="h-2 w-24 rounded-full bg-gradient-to-r from-sky-600 to-emerald-700" />
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/play"
            className="bg-stone-900 text-white font-bold py-3 rounded-full hover:bg-black transition"
          >
            ▶ Play
          </Link>

          {isLoaded && !isSignedIn && (
            <Link
              href="/sign-up"
              className="bg-amber-600 text-white font-bold py-3 rounded-full hover:bg-amber-700 transition"
            >
              Create an Account
            </Link>
          )}
        </div>

        <div className="mt-8 inline-flex items-center gap-2 text-xs font-semibold text-stone-500">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Stage 2 in progress
        </div>
      </div>
    </main>
  );
}