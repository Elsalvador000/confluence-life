import Link from "next/link";

export default function PlayPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center bg-white rounded-3xl shadow-xl p-10 border border-amber-200">
        <p className="text-4xl">🚧</p>
        <h1 className="mt-3 text-2xl font-bold text-stone-900">
          The 3D world isn&apos;t built yet
        </h1>
        <p className="mt-4 text-stone-600 leading-relaxed">
          We&apos;re still building the game. In a later stage this is where
          you&apos;ll walk around Lokoja, hustle for work, and meet other
          players.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block bg-stone-900 text-white font-bold px-6 py-3 rounded-full hover:bg-black transition"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}