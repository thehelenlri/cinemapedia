import { Link } from "react-router-dom";
import { Star, Bookmark, BookmarkCheck, Tv, Film, Clock } from "lucide-react";
import { Movie } from "@/types";
import { cn, formatDuration } from "@/lib/utils";
import { useState } from "react";
import { toggleWatchlist, isInWatchlist } from "@/lib/storage";
import { toast } from "sonner";

interface Props {
  movie: Movie;
  size?: "sm" | "md" | "lg";
}

export default function MovieCard({ movie, size = "md" }: Props) {
  const [saved, setSaved] = useState(() => isInWatchlist(movie.id));

  const handleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    <Link
      to={`/movie/${movie.id}`}
      className={cn(
        "group relative block rounded-xl overflow-hidden bg-cinema-card border border-border hover:border-teal-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-teal-900/10 poster-shine cursor-grab",
        size === "sm" && "w-[140px] shrink-0",
        size === "md" && "w-[180px] shrink-0",
        size === "lg" && "w-full",
      )}
    >
      {/* Poster */}
      <div
        className={cn(
          "relative overflow-hidden",
          size === "sm" && "h-[210px]",
          size === "md" && "h-[270px]",
          size === "lg" && "h-[240px]",
        )}
      >
        <img
          src={movie.poster}
          alt={movie.titleEn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-card via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Type badge */}
        <div className="absolute top-2 right-2">
          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/70 text-white backdrop-blur-sm">
            {movie.type === "series" ? (
              <Tv className="w-2.5 h-2.5" />
            ) : (
              <Film className="w-2.5 h-2.5" />
            )}
            {movie.type === "series" ? "سریال" : "فیلم"}
          </span>
        </div>

        {/* Watchlist */}
        <button
          onClick={handleWatchlist}
          className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-teal-500"
        >
          {saved ? (
            <BookmarkCheck className="w-3.5 h-3.5 text-teal-400 group-hover/btn:text-white" />
          ) : (
            <Bookmark className="w-3.5 h-3.5 text-white" />
          )}
        </button>

        {/* IMDb score overlay on hover */}
        <div className="absolute bottom-0 inset-x-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center gap-1 justify-center">
            <Star className="w-3.5 h-3.5 fill-teal-400 text-teal-400" />
            <span className="text-sm font-bold text-white ltr">
              {movie.imdb}
            </span>
            <span className="text-xs text-white/70">IMDb</span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-2.5">
        <h3 className="font-bold text-sm text-white truncate">
          {movie.titleFa}
        </h3>
        <p className="text-[11px] text-muted-foreground ltr truncate mt-0.5">
          {movie.titleEn}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">{movie.year}</span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-teal-400 text-teal-400" />
            <span className="text-xs font-bold text-teal-400 ltr">
              {movie.imdb}
            </span>
          </div>
        </div>
        {size !== "sm" && (
          <div className="flex flex-wrap gap-1 mt-2">
            {movie.genres.slice(0, 2).map((g) => (
              <span
                key={g}
                className="text-[10px] px-1.5 py-0.5 rounded bg-cinema-surface text-muted-foreground"
              >
                {g}
              </span>
            ))}
          </div>
        )}
        {size !== "sm" && (
          <div className="flex items-center gap-1 mt-1.5">
            <Clock className="w-3 h-3 text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground">
              {formatDuration(movie.duration)}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
