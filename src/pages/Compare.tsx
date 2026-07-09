import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { GitCompare, Plus, Star, X } from "lucide-react";
import { MOVIES, getMovieById } from "@/constants/movies";
import { Movie } from "@/types";
import { formatDuration } from "@/lib/utils";

function MovieSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = MOVIES.filter(
    (m) =>
      !query ||
      m.titleFa.includes(query) ||
      m.titleEn.toLowerCase().includes(query.toLowerCase()),
  );

  const selected = value ? getMovieById(value) : null;

  return (
    <div className="relative">
      {selected ? (
        <div className="bg-cinema-card border border-teal-500/30 rounded-2xl overflow-hidden">
          <div className="relative h-48">
            <img
              src={selected.backdrop}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cinema-card to-transparent" />
            <button
              aria-label="compare"
              onClick={() => onChange("")}
              className="absolute top-3 left-3 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-red-600 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="p-4 flex gap-4 items-end -mt-8 relative z-10">
            <img
              src={selected.poster}
              alt=""
              className="w-16 h-24 rounded-lg object-cover border border-border shrink-0"
            />
            <div>
              <h3 className="text-lg font-black text-white">
                {selected.titleFa}
              </h3>
              <p className="text-sm text-muted-foreground ltr">
                {selected.titleEn}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <Star className="w-4 h-4 fill-teal-400 text-teal-400" />
                <span className="text-teal-400 font-bold">{selected.imdb}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <button
            onClick={() => setOpen(true)}
            className="w-full h-48 bg-cinema-card border-2 border-dashed border-border hover:border-teal-500/50 rounded-2xl flex flex-col items-center justify-center gap-3 text-muted-foreground hover:text-white transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-cinema-surface group-hover:bg-teal-500/20 flex items-center justify-center transition-colors">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium">انتخاب فیلم یا سریال</span>
          </button>
          {open && (
            <div className="absolute top-full mt-2 inset-x-0 bg-cinema-card border border-border rounded-xl shadow-2xl z-20 overflow-hidden">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="جستجو..."
                className="w-full bg-transparent border-b border-border px-4 py-3 text-sm text-white placeholder:text-muted-foreground focus:outline-none"
              />
              <div className="max-h-64 overflow-y-auto">
                {filtered.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      onChange(m.id);
                      setOpen(false);
                      setQuery("");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-cinema-surface transition-colors text-right"
                  >
                    <img
                      src={m.poster}
                      alt=""
                      className="w-8 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="text-sm font-medium text-white">
                        {m.titleFa}
                      </p>
                      <p className="text-xs text-muted-foreground ltr">
                        {m.titleEn} • {m.year}
                      </p>
                    </div>
                    <span className="mr-auto text-xs text-teal-400 font-bold ltr">
                      {m.imdb}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface CompareRow {
  label: string;
  a: string | number;
  b: string | number;
  better?: "a" | "b" | "equal";
}

function getCompareRows(a: Movie, b: Movie): CompareRow[] {
  const imdbBetter = a.imdb > b.imdb ? "a" : a.imdb < b.imdb ? "b" : "equal";
  const rtBetter =
    a.rottenTomatoes > b.rottenTomatoes
      ? "a"
      : a.rottenTomatoes < b.rottenTomatoes
        ? "b"
        : "equal";
  const mcBetter =
    a.metacritic > b.metacritic
      ? "a"
      : a.metacritic < b.metacritic
        ? "b"
        : "equal";

  return [
    {
      label: "نوع",
      a: a.type === "movie" ? "فیلم" : "سریال",
      b: b.type === "movie" ? "فیلم" : "سریال",
    },
    { label: "سال", a: a.year, b: b.year },
    {
      label: "امتیاز IMDb",
      a: `${a.imdb}/10`,
      b: `${b.imdb}/10`,
      better: imdbBetter,
    },
    {
      label: "Rotten Tomatoes",
      a: `${a.rottenTomatoes}%`,
      b: `${b.rottenTomatoes}%`,
      better: rtBetter,
    },
    {
      label: "Metacritic",
      a: `${a.metacritic}/100`,
      b: `${b.metacritic}/100`,
      better: mcBetter,
    },
    {
      label: "مدت زمان",
      a: formatDuration(a.duration),
      b: formatDuration(b.duration),
    },
    { label: "ژانر", a: a.genres.join("، "), b: b.genres.join("، ") },
    { label: "کشور", a: a.country.join("، "), b: b.country.join("، ") },
    { label: "زبان", a: a.language, b: b.language },
    { label: "رده سنی", a: a.ageRating, b: b.ageRating },
    { label: "کارگردان", a: a.director.join("، "), b: b.director.join("، ") },
    { label: "شبکه پخش", a: a.network, b: b.network },
    ...(a.boxOffice || b.boxOffice
      ? [{ label: "فروش گیشه", a: a.boxOffice || "—", b: b.boxOffice || "—" }]
      : []),
    {
      label: "تعداد جوایز",
      a: `${a.awards?.length ?? 0} جایزه`,
      b: `${b.awards?.length ?? 0} جایزه`,
    },
  ];
}

export default function Compare() {
  const [searchParams] = useSearchParams();
  const [aId, setAId] = useState(searchParams.get("a") || "");
  const [bId, setBId] = useState(searchParams.get("b") || "");

  const movieA = aId ? getMovieById(aId) : null;
  const movieB = bId ? getMovieById(bId) : null;

  return (
    <div className="pt-24 max-w-5xl mx-auto px-4 sm:px-6 pb-16">
      <div className="mb-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-teal-500/20 flex items-center justify-center mx-auto mb-3">
          <GitCompare className="w-6 h-6 text-teal-400" />
        </div>
        <h1 className="text-3xl font-black text-white mb-2">مقایسه آثار</h1>
        <p className="text-muted-foreground text-sm">
          دو فیلم یا سریال را کنار هم مقایسه کنید
        </p>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <MovieSelector value={aId} onChange={setAId} />
        <MovieSelector value={bId} onChange={setBId} />
      </div>

      {/* Comparison Table */}
      {movieA && movieB ? (
        <div className="bg-cinema-card border border-border rounded-2xl overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="grid grid-cols-3 border-b border-border">
            <div className="px-4 py-3 text-center">
              <p className="text-sm font-bold text-white">{movieA.titleFa}</p>
            </div>
            <div className="px-4 py-3 text-center border-x border-border">
              <p className="text-xs text-muted-foreground">مقایسه</p>
            </div>
            <div className="px-4 py-3 text-center">
              <p className="text-sm font-bold text-white">{movieB.titleFa}</p>
            </div>
          </div>

          {getCompareRows(movieA, movieB).map((row, i) => (
            <div
              key={row.label}
              className={`grid grid-cols-3 items-center border-b border-border/50 ${i % 2 === 0 ? "bg-cinema-surface/30" : ""}`}
            >
              <div
                className={`px-4 py-3 text-center text-sm ${row.better === "a" ? "text-cyan-400 font-bold" : "text-muted-foreground"}`}
              >
                {row.a}
              </div>
              <div className="px-4 py-3 text-center border-x border-border/50">
                <span className="text-xs font-semibold text-white/60">
                  {row.label}
                </span>
              </div>
              <div
                className={`px-4 py-3 text-center text-sm ${row.better === "b" ? "text-cyan-400 font-bold" : "text-muted-foreground"}`}
              >
                {row.b}
              </div>
            </div>
          ))}

          {/* Winner */}
          {(() => {
            const aScore =
              movieA.imdb * 10 +
              movieA.rottenTomatoes / 10 +
              movieA.metacritic / 10;
            const bScore =
              movieB.imdb * 10 +
              movieB.rottenTomatoes / 10 +
              movieB.metacritic / 10;
            const winner =
              aScore > bScore ? movieA : aScore < bScore ? movieB : null;
            return winner ? (
              <div className="p-6 text-center bg-gradient-to-r from-teal-500/5 via-teal-500/10 to-teal-500/5">
                <p className="text-sm text-muted-foreground mb-1">
                  بر اساس میانگین امتیازات، برنده این مقایسه:
                </p>
                <p className="text-xl font-black text-teal-400">
                  🏆 {winner.titleFa}
                </p>
                <Link
                  to={`/movie/${winner.id}`}
                  className="text-sm text-teal-400/70 hover:text-teal-400 mt-2 inline-block transition-colors"
                >
                  مشاهده صفحه کامل ←
                </Link>
              </div>
            ) : (
              <div className="p-6 text-center">
                <p className="text-teal-400 font-bold">
                  🤝 این دو اثر امتیاز مساوی دارند!
                </p>
              </div>
            );
          })()}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">دو اثر را انتخاب کنید تا مقایسه شروع شود</p>
        </div>
      )}
    </div>
  );
}
