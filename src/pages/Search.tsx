import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, SlidersHorizontal, X } from "lucide-react";
import { MOVIES, GENRES } from "@/constants/movies";
import MovieCard from "@/components/features/MovieCard";
import { Movie } from "@/types";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [genre, setGenre] = useState(searchParams.get("genre") || "");
  const [type, setType] = useState<"" | "movie" | "series">(
    (searchParams.get("type") as "" | "movie" | "series") || "",
  );
  const [minRating, setMinRating] = useState(0);
  const [year, setYear] = useState("");
  const [sort, setSort] = useState(searchParams.get("sort") || "imdb");
  const [showFilters, setShowFilters] = useState(false);

  const years = useMemo(() => {
    const ys = [...new Set(MOVIES.map((m) => m.year))].sort((a, b) => b - a);
    return ys;
  }, []);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (query) params.q = query;
    if (genre) params.genre = genre;
    if (type) params.type = type;
    if (sort) params.sort = sort;
    setSearchParams(params, { replace: true });
  }, [query, genre, type, sort]);

  const results = useMemo(() => {
    let list = [...MOVIES];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (m) =>
          m.titleFa.includes(query) ||
          m.titleEn.toLowerCase().includes(q) ||
          m.genres.some((g) => g.includes(query)),
      );
    }
    if (genre) list = list.filter((m) => m.genres.includes(genre));
    if (type) list = list.filter((m) => m.type === type);
    if (minRating > 0) list = list.filter((m) => m.imdb >= minRating);
    if (year) list = list.filter((m) => m.year === parseInt(year));

    if (sort === "imdb") list.sort((a, b) => b.imdb - a.imdb);
    else if (sort === "year") list.sort((a, b) => b.year - a.year);
    else if (sort === "rt")
      list.sort((a, b) => b.rottenTomatoes - a.rottenTomatoes);

    return list;
  }, [query, genre, type, minRating, year, sort]);

  const clearFilters = () => {
    setQuery("");
    setGenre("");
    setType("");
    setMinRating(0);
    setYear("");
    setSort("imdb");
  };

  const hasFilters = query || genre || type || minRating > 0 || year;

  return (
    <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 pb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">جستجوی پیشرفته</h1>
        <p className="text-muted-foreground text-sm">
          {results.length} اثر یافت شد
        </p>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="نام فیلم یا سریال..."
            className="w-full bg-cinema-card border border-border rounded-xl py-3 pr-10 pl-4 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-teal-500/50 transition-colors"
          />
          {query && (
            <button
              aria-label="search for movie"
              onClick={() => setQuery("")}
              className="absolute left-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-muted-foreground hover:text-white" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
            showFilters
              ? "bg-teal-500 border-teal-400 text-black"
              : "bg-cinema-card border-border text-muted-foreground hover:text-white"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          فیلترها
        </button>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="px-4 py-3 rounded-xl border border-border text-sm text-red-400 hover:bg-red-950/30 transition-all"
          >
            پاک کردن
          </button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-cinema-card border border-border rounded-2xl p-5 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4 animate-slide-up">
          {/* Genre */}
          <div>
            <label className="text-xs text-muted-foreground block mb-2">
              ژانر
            </label>
            <select
              aria-label="genre "
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-cinema-surface border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
            >
              <option value="">همه ژانرها</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
          {/* Type */}
          <div>
            <label className="text-xs text-muted-foreground block mb-2">
              نوع
            </label>
            <select
              aria-label="type"
              value={type}
              onChange={(e) =>
                setType(e.target.value as "" | "movie" | "series")
              }
              className="w-full bg-cinema-surface border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
            >
              <option value="">همه</option>
              <option value="movie">فیلم</option>
              <option value="series">سریال</option>
            </select>
          </div>
          {/* Year */}
          <div>
            <label className="text-xs text-muted-foreground block mb-2">
              سال
            </label>
            <select
              aria-label="years to choose"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-cinema-surface border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
            >
              <option value="">همه سال‌ها</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          {/* Sort */}
          <div>
            <label className="text-xs text-muted-foreground block mb-2">
              مرتب‌سازی
            </label>
            <select
              aria-label="organize"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full bg-cinema-surface border border-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
            >
              <option value="imdb">امتیاز IMDb</option>
              <option value="year">جدیدترین</option>
              <option value="rt">Rotten Tomatoes</option>
            </select>
          </div>
          {/* Min Rating Slider */}
          <div className="col-span-2 sm:col-span-4">
            <label className="text-xs text-muted-foreground block mb-2">
              حداقل امتیاز IMDb:{" "}
              <span className="text-teal-400 font-bold">
                {minRating > 0 ? minRating : "همه"}
              </span>
            </label>
            <input
              aria-label="IMDB"
              type="range"
              min={0}
              max={9}
              step={0.5}
              value={minRating}
              onChange={(e) => setMinRating(parseFloat(e.target.value))}
              className="w-full accent-teal-500"
            />
          </div>
        </div>
      )}

      {/* Genre Quick Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setGenre("")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${!genre ? "bg-teal-500 text-black" : "bg-cinema-card border border-border text-muted-foreground hover:text-white"}`}
        >
          همه
        </button>
        {GENRES.slice(0, 8).map((g) => (
          <button
            key={g}
            onClick={() => setGenre(g === genre ? "" : g)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${g === genre ? "bg-teal-500 text-black" : "bg-cinema-card border border-border text-muted-foreground hover:text-white"}`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🎬</div>
          <p className="text-muted-foreground text-lg">نتیجه‌ای یافت نشد</p>
          <button
            onClick={clearFilters}
            className="mt-4 text-teal-400 hover:text-teal-300 text-sm transition-colors"
          >
            پاک کردن فیلترها
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.map((m) => (
            <MovieCard key={m.id} movie={m} size="lg" />
          ))}
        </div>
      )}
    </div>
  );
}
