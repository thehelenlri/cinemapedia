import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Play,
  Star,
  ChevronRight,
  ChevronLeft,
  Bookmark,
  BookmarkCheck,
  Info,
} from "lucide-react";
import { Movie } from "@/types";
import { toggleWatchlist, isInWatchlist } from "@/lib/storage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Props {
  movies: Movie[];
}

export default function HeroSlider({ movies }: Props) {
  const [current, setCurrent] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isInWatchlist(movies[current].id));
  }, [current, movies]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % movies.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [movies.length]);

  const movie = movies[current];

  const handleWatchlist = () => {
    const added = toggleWatchlist(movie.id);
    setSaved(added);
    toast(
      added
        ? `«${movie.titleFa}» به لیست اضافه شد`
        : `«${movie.titleFa}» از لیست حذف شد`,
      {
        icon: added ? "🔖" : "🗑️",
      },
    );
  };

  return (
    <div className="relative w-full h-[500px] sm:h-[600px] overflow-hidden">
      {/* Backdrop */}
      {movies.map((m, i) => (
        <div
          key={m.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            i === current ? "opacity-100" : "opacity-0",
          )}
        >
          <img src={m.backdrop} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-cinema-dark via-cinema-dark/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark via-transparent to-cinema-dark/30" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center">
        <div className="max-w-xl animate-slide-up" key={current}>
          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genres.slice(0, 3).map((g) => (
              <span
                key={g}
                className="text-xs px-3 py-1 rounded-full border border-teal-500/40 text-teal-400 bg-teal-500/10"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-1">
            {movie.titleFa}
          </h1>
          <p className="text-lg text-muted-foreground ltr font-light mb-4">
            {movie.titleEn}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 mr-4 mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-teal-400 text-teal-400" />
              <span className="text-teal-400 font-bold ltr text-base">
                {movie.imdb}
              </span>
            </div>
            <span className="text-white/30">|</span>
            <span>{movie.year}</span>
            <span className="text-white/30">|</span>
            <span>
              {movie.type === "series"
                ? `${movie.seasons} فصل`
                : `${movie.duration} دقیقه`}
            </span>
            <span className="px-2 py-0.5 rounded border border-border text-xs">
              {movie.ageRating}
            </span>
          </div>

          {/* Synopsis */}
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-6">
            {movie.synopsis}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3">
            <Link
              to={`/movie/${movie.id}`}
              className="flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-black font-bold rounded-xl transition-all hover:scale-105 active:scale-95"
            >
              <Info className="w-4 h-4" />
              اطلاعات کامل
            </Link>
            <a
              href={`https://www.youtube.com/watch?v=${movie.trailerYT}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/10 backdrop-blur-sm"
            >
              <Play className="w-4 h-4 fill-white" />
              تریلر
            </a>
            <button
              onClick={handleWatchlist}
              className="flex items-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all border border-white/10 backdrop-blur-sm"
            >
              {saved ? (
                <BookmarkCheck className="w-4 h-4 text-teal-400" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Dots & Arrows */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {movies.map((_, i) => (
          <button
            aria-label="dots"
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "rounded-full transition-all duration-300",
              i === current
                ? "w-6 h-2 bg-teal-400"
                : "w-2 h-2 bg-white/30 hover:bg-white/60",
            )}
          />
        ))}
      </div>

      <button
        aria-label="Next slide"
        onClick={() =>
          setCurrent((c) => (c - 1 + movies.length) % movies.length)
        }
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      <button
        aria-label="Next slide"
        onClick={() => setCurrent((c) => (c + 1) % movies.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 border border-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    </div>
  );
}
