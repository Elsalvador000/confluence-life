export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center bg-white rounded-3xl shadow-xl p-10 border border-amber-200">
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

        <div className="mt-8 inline-flex items-center gap-2 text-xs font-semibold text-stone-500">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Stage 1 in progress
        </div>
      </div>
    </main>
  );
}