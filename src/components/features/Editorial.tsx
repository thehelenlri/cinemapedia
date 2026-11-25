import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sun, Moon, Bookmark, BookmarkCheck,
  Star, Film, ArrowUpLeft, ArrowRight
} from "lucide-react";
import type { Movie } from "@/types";
import { getWatchlist, toggleWatchlist } from "@/lib/storage";
import { toast } from "sonner";

export function useCollection() {
  const [ids, setIds] = useState<string[]>(getWatchlist);

  useEffect(() => {
    const sync = () => setIds(getWatchlist());
    window.addEventListener("cp:watchlist", sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener("cp:watchlist", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = (id: string) => {
    try {
      const added = toggleWatchlist(id);
      setIds(getWatchlist());
      window.dispatchEvent(new Event("cp:watchlist"));

      toast.success(
        added ? "به مجموعه اضافه شد" : "از مجموعه حذف شد"
      );
    } catch {
      toast.error("ذخیره اطلاعات ممکن نیست");
    }
  };

  return { ids, toggle };
}

export function ThemeButton() {
  const [day, setDay] = useState(
    () => localStorage.getItem("cp_theme") === "day"
  );

  const change = () => {
    const next = !day;
    setDay(next);
    localStorage.setItem("cp_theme", next ? "day" : "night");
    document.documentElement.dataset.cpTheme =
      next ? "day" : "night";
  };

  return (
    <button
      className="ed-theme"
      onClick={change}
      aria-label="تغییر حالت روز و شب"
    >
      {day ? <Moon size={18}/> : <Sun size={18}/>}
      {day ? "حالت شب" : "حالت روز"}
    </button>
  );
}

export function EditorialHeader({
  title, english, description, index
}: {
  title: string;
  english: string;
  description: string;
  index: string;
}) {
  return (
    <header className="ed-header">

      <div className="ed-masthead">
        <Link to="/">
          <ArrowRight size={17}/>
          سینماپدیا
        </Link>
        <span dir="ltr">THE CINEMA JOURNAL / {index}</span>
        <ThemeButton/>
      </div>

      <div className="ed-heading">
        <div>
          <span className="ed-kicker" dir="ltr">
            {english}
          </span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        <span className="ed-page-number" dir="ltr">
          {index}
        </span>
      </div>

    </header>
  );
}

export function EditorialImage({
  src, title
}: {
  src: string;
  title: string;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => setFailed(false), [src]);

  return failed ? (
    <div className="ed-image-fallback">
      <Film size={30} strokeWidth={1}/>
      <span>{title}</span>
    </div>
  ) : (
    <img
      src={src}
      alt={title}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

export function EditorialPoster({
  movie, saved, onSave
}: {
  movie: Movie;
  saved: boolean;
  onSave: () => void;
}) {
  return (
    <article className="ed-poster">

      <div className="ed-poster-media">

        <Link
          to={`/movie/${movie.id}`}
          aria-label={movie.titleFa}
        >
          <EditorialImage
            src={movie.poster}
            title={movie.titleEn}
          />

          <span className="ed-poster-hover">
            <ArrowUpLeft size={28}/>
          </span>
        </Link>

        <span className="ed-media-type">
          {movie.type === "movie" ? "فیلم" : "سریال"}
        </span>

        <button
          className={`ed-bookmark ${saved ? "saved" : ""}`}
          onClick={onSave}
          aria-pressed={saved}
          aria-label={saved ? "حذف اثر" : "ذخیره اثر"}
        >
          {saved
            ? <BookmarkCheck size={19}/>
            : <Bookmark size={19}/>}
        </button>

      </div>

      <div className="ed-poster-title">
        <Link to={`/movie/${movie.id}`}>
          <h3>{movie.titleFa}</h3>
        </Link>
        <span className="ed-rating" dir="ltr">
          <Star size={13} fill="currentColor"/>
          {movie.imdb.toFixed(1)}
        </span>
      </div>

      <p className="ed-english" dir="ltr">
        {movie.titleEn}
      </p>

      <div className="ed-poster-meta">
        {movie.year}
        <i/>
        {movie.genres.slice(0, 2).join(" / ")}
      </div>

    </article>
  );
}
