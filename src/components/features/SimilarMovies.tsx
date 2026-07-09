import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Movie } from "@/types";

interface Props {
  movies: Movie[];
}

export default function SimilarMovies({ movies }: Props) {
  if (movies.length === 0) return null;

  return (
    <div>
      <h3 className="text-base font-bold text-white mb-4">آثار مشابه</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {movies.map((m) => (
          <Link
            key={m.id}
            to={`/movie/${m.id}`}
            className="group flex gap-3 p-3 rounded-xl bg-cinema-card border border-border hover:border-teal-500/30 transition-all"
          >
            <img
              src={m.poster}
              alt={m.titleEn}
              className="w-12 h-16 object-cover rounded shrink-0 group-hover:scale-105 transition-transform"
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {m.titleFa}
              </p>
              <p className="text-xs text-muted-foreground ltr truncate">
                {m.titleEn}
              </p>
              <div className="flex items-center gap-1 mt-1.5">
                <Star className="w-3 h-3 fill-teal-400 text-teal-400" />
                <span className="text-xs text-teal-400 font-bold ltr">
                  {m.imdb}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
