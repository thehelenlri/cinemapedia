import { useState, useEffect } from "react";
import { Bookmark, Trash2 } from "lucide-react";
import { getWatchlist, toggleWatchlist } from "@/lib/storage";
import { getMovieById } from "@/constants/movies";
import { Movie } from "@/types";
import MovieCard from "@/components/features/MovieCard";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function Watchlist() {
  const [movies, setMovies] = useState<Movie[]>([]);

  const load = () => {
    const ids = getWatchlist();
    const list = ids.map((id) => getMovieById(id)).filter(Boolean) as Movie[];
    setMovies(list);
  };

  useEffect(() => {
    load();
  }, []);

  const removeAll = () => {
    movies.forEach((m) => toggleWatchlist(m.id));
    setMovies([]);
    toast.success("لیست پاک شد");
  };

  return (
    <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 pb-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-teal-400" />
            </div>
            <h1 className="text-3xl font-black text-white">لیست علاقه‌مندی</h1>
          </div>
          <p className="text-muted-foreground text-sm mr-13">
            {movies.length} اثر ذخیره شده
          </p>
        </div>
        {movies.length > 0 && (
          <button
            onClick={removeAll}
            className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-950/30 border border-red-900/40 rounded-lg transition-all"
          >
            <Trash2 className="w-4 h-4" />
            پاک کردن همه
          </button>
        )}
      </div>

      {movies.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-6">🎬</div>
          <h2 className="text-xl font-bold text-white mb-2">
            لیست شما خالی است
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            روی آیکون بوکمارک در کارت‌های فیلم کلیک کنید تا به لیست اضافه شوند
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-black font-bold rounded-xl text-sm transition-all"
          >
            مرور فیلم‌ها
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {movies.map((m) => (
            <div key={m.id} className="relative group/wrap">
              <MovieCard movie={m} size="lg" />
              <button
                aria-label="watching"
                onClick={() => {
                  toggleWatchlist(m.id);
                  load();
                  toast(`«${m.titleFa}» از لیست حذف شد`, { icon: "🗑️" });
                }}
                className="absolute top-2 left-2 w-7 h-7 rounded-full bg-red-600/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover/wrap:opacity-100 transition-opacity hover:bg-red-600 z-10"
              >
                <Trash2 className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
