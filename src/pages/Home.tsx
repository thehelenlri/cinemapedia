import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpLeft, ArrowLeft, Star, Sun, Moon,
  Bookmark, BookmarkCheck, Search, Film,
  X, Shuffle, Play, SlidersHorizontal
} from "lucide-react";

import {
  MOVIES,
  GENRES,
  getFeatured
} from "@/constants/movies";

import {
  getWatchlist,
  toggleWatchlist
} from "@/lib/storage";

import type { Movie } from "@/types";
import { toast } from "sonner";
import "./CinemaEditorial.css";

const featured = getFeatured();
const spotlight = featured.length ? featured : MOVIES;

const topRated = [...MOVIES]
  .sort((a,b) => b.imdb - a.imdb);

const latest = [...MOVIES]
  .sort((a,b) => b.year - a.year);

const series = latest.filter(m => m.type === "series");

function Photo({
  movie,
  wide = false
}: {
  movie: Movie;
  wide?: boolean;
}) {
  const [failed,setFailed] = useState(false);

  const src = wide ? movie.backdrop : movie.poster;

  useEffect(() => {
    setFailed(false);
  },[src]);

  return failed ? (
    <div className="ce-image-error">
      <Film size={32} strokeWidth={1}/>
      <span>{movie.titleEn}</span>
    </div>
  ) : (
    <img
      src={src}
      alt={movie.titleEn}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function Poster({
  movie,
  saved,
  onSave
}: {
  movie: Movie;
  saved: boolean;
  onSave: (id:string) => void;
}) {
  return (
    <article className="ce-poster">

      <div className="ce-poster-image">

        <Link to={`/movie/${movie.id}`}>
          <Photo movie={movie}/>

          <div className="ce-poster-hover">
            <ArrowUpLeft size={28}/>
          </div>
        </Link>

        <button
          className={`ce-save ${saved ? "saved" : ""}`}
          onClick={() => onSave(movie.id)}
          aria-pressed={saved}
          aria-label={saved ? "حذف از لیست" : "ذخیره اثر"}
        >
          {saved
            ? <BookmarkCheck size={19}/>
            : <Bookmark size={19}/>}
        </button>

      </div>

      <div className="ce-poster-caption">

        <Link to={`/movie/${movie.id}`}>
          <h3>{movie.titleFa}</h3>
        </Link>

        <span className="ce-rating" dir="ltr">
          <Star size={13} fill="currentColor"/>
          {movie.imdb.toFixed(1)}
        </span>

      </div>

      <p className="ce-en" dir="ltr">
        {movie.titleEn}
      </p>

      <div className="ce-poster-meta">
        <span>{movie.year}</span>
        <i/>
        <span>{movie.genres.slice(0,2).join(" / ")}</span>
      </div>

    </article>
  );
}

function Heading({
  index,
  title,
  english,
  link
}: {
  index:string;
  title:string;
  english:string;
  link?:string;
}) {
  return (
    <div className="ce-heading">

      <div className="ce-heading-main">

        <span className="ce-index" dir="ltr">
          {index}
        </span>

        <div>
          <span className="ce-kicker" dir="ltr">
            {english}
          </span>
          <h2>{title}</h2>
        </div>

      </div>

      {link && (
        <Link to={link} className="ce-text-link">
          مشاهده همه
          <ArrowLeft size={17}/>
        </Link>
      )}

    </div>
  );
}

export default function Home() {

  const [theme,setTheme] = useState<"day"|"night">(() => {
    try {
      return localStorage.getItem("cp_theme") === "day"
        ? "day" : "night";
    } catch {
      return "night";
    }
  });

  const [active,setActive] = useState(0);
  const [saved,setSaved] = useState<string[]>(getWatchlist);
  const [query,setQuery] = useState("");
  const [genre,setGenre] = useState("");
  const [type,setType] = useState("all");
  const [sort,setSort] = useState("latest");

  const mainMovie = spotlight[active];

  const secondary = spotlight
    .filter(m => m.id !== mainMovie.id)
    .slice(0,2);

  useEffect(() => {

    document.documentElement.dataset.cpTheme = theme;

    try {
      localStorage.setItem("cp_theme",theme);
    } catch {}

    return () => {
      
    };

  },[theme]);

  useEffect(() => {
    const sync = () => setSaved(getWatchlist());

    window.addEventListener("storage",sync);
    window.addEventListener("cp:watchlist",sync);

    return () => {
      window.removeEventListener("storage",sync);
      window.removeEventListener("cp:watchlist",sync);
    };
  },[]);

  const saveMovie = (id:string) => {
    try {

      const added = toggleWatchlist(id);

      setSaved(getWatchlist());

      window.dispatchEvent(new Event("cp:watchlist"));

      toast.success(
        added
          ? "اثر به مجموعه شما اضافه شد"
          : "اثر از مجموعه شما حذف شد"
      );

    } catch {
      toast.error("ذخیره اطلاعات ممکن نیست.");
    }
  };

  const filtered = useMemo(() => {

    const q = query.trim().toLowerCase();

    const result = MOVIES.filter(m =>
      (type === "all" || m.type === type) &&
      (!genre || m.genres.includes(genre)) &&
      (!q ||
        m.titleFa.includes(q) ||
        m.titleEn.toLowerCase().includes(q))
    );

    return result.sort((a,b) =>
      sort === "rating"
        ? b.imdb - a.imdb
        : b.year - a.year
    );

  },[query,genre,type,sort]);

  return (
    <div className={`ce-root ce-${theme}`} dir="rtl">

      <div className="ce-container">

        <header className="ce-masthead">

          <div className="ce-edition" dir="ltr">
            <span>THE CINEMA JOURNAL</span>
            <span>FILM / CULTURE / STORIES</span>
          </div>

          <button
            className="ce-theme"
            aria-label="تغییر حالت روز و شب"
            onClick={() =>
              setTheme(theme === "day" ? "night" : "day")
            }
          >
            {theme === "night"
              ? <Sun size={18}/>
              : <Moon size={18}/>}

            <span>
              {theme === "night" ? "حالت روز" : "حالت شب"}
            </span>
          </button>

        </header>

        <section className="ce-intro">

          <div>
            <span className="ce-kicker" dir="ltr">
              DISCOVER THE ART OF FILM
            </span>

            <h1>
              سینما،<br/>
              <em>فراتر از داستان.</em>
            </h1>
          </div>

          <div className="ce-intro-side">

            <p>
              از شاهکارهای ماندگار تا داستان‌های تازه؛
              دنیای فیلم و سریال را کشف کنید،
              مقایسه کنید و مجموعه شخصی خود را بسازید.
            </p>

            <Link to="/search" className="ce-text-link">
              کاوش در دنیای سینما
              <ArrowUpLeft size={20}/>
            </Link>

          </div>

        </section>

        <section className="ce-feature-grid">

          <article className="ce-feature-main">

            <Link
              to={`/movie/${mainMovie.id}`}
              className="ce-feature-image"
              key={mainMovie.id}
            >

              <Photo movie={mainMovie} wide/>

              <div className="ce-feature-shade"/>

              <div className="ce-feature-badge">
                FEATURED FILM
              </div>

              <div className="ce-feature-arrow">
                <ArrowUpLeft size={27}/>
              </div>

            </Link>

            <div className="ce-feature-info">

              <div className="ce-feature-meta">
                <span>{mainMovie.genres.join(" / ")}</span>
                <i/>
                <span>{mainMovie.year}</span>
                <span className="ce-rating" dir="ltr">
                  <Star size={15} fill="currentColor"/>
                  {mainMovie.imdb.toFixed(1)}
                </span>
              </div>

              <Link to={`/movie/${mainMovie.id}`}>
                <h2 dir="ltr">{mainMovie.titleEn}</h2>
              </Link>

              <h3>{mainMovie.titleFa}</h3>

              <p>{mainMovie.synopsis}</p>

              <div className="ce-feature-actions">

                <Link
                  className="ce-primary"
                  to={`/movie/${mainMovie.id}`}
                >
                  بررسی کامل اثر
                  <ArrowUpLeft size={18}/>
                </Link>

                {mainMovie.trailerYT && (
                  <a
                    className="ce-text-link"
                    href={`https://www.youtube.com/watch?v=${mainMovie.trailerYT}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Play size={17}/>
                    تریلر
                  </a>
                )}

                <button
                  className="ce-inline-save"
                  onClick={() => saveMovie(mainMovie.id)}
                  aria-label="ذخیره اثر"
                  aria-pressed={saved.includes(mainMovie.id)}
                >
                  {saved.includes(mainMovie.id)
                    ? <BookmarkCheck size={20}/>
                    : <Bookmark size={20}/>}
                </button>

              </div>

            </div>

          </article>

          <aside className="ce-feature-side">

            <div className="ce-aside-label">
              <span>در کانون توجه</span>
              <span dir="ltr">IN FOCUS</span>
            </div>

            {secondary.map(movie => (
              <article className="ce-mini-feature" key={movie.id}>

                <Link
                  className="ce-mini-photo"
                  to={`/movie/${movie.id}`}
                >
                  <Photo movie={movie} wide/>
                  <span>
                    <ArrowUpLeft size={20}/>
                  </span>
                </Link>

                <div className="ce-mini-info">

                  <span className="ce-kicker">
                    {movie.genres[0]} / {movie.year}
                  </span>

                  <Link to={`/movie/${movie.id}`}>
                    <h3>{movie.titleFa}</h3>
                  </Link>

                  <p dir="ltr">{movie.titleEn}</p>

                  <button
                    className="ce-text-link"
                    onClick={() => setActive(
                      spotlight.findIndex(m => m.id === movie.id)
                    )}
                  >
                    نمایش در بخش ویژه
                    <ArrowLeft size={14}/>
                  </button>

                </div>

              </article>
            ))}

          </aside>

        </section>

        <div className="ce-filmstrip">

          <span className="ce-filmstrip-label" dir="ltr">
            FEATURED SELECTION
          </span>

          <div className="ce-filmstrip-items">

            {spotlight.map((movie,index) => (
              <button
                key={movie.id}
                className={active === index ? "active" : ""}
                onClick={() => setActive(index)}
                aria-label={movie.titleFa}
                aria-pressed={active === index}
              >
                <Photo movie={movie} wide/>
                <span dir="ltr">
                  {String(index+1).padStart(2,"0")}
                </span>
              </button>
            ))}

          </div>

          <div className="ce-filmstrip-number" dir="ltr">
            {String(active+1).padStart(2,"0")}
            <small> / {String(spotlight.length).padStart(2,"0")}</small>
          </div>

        </div>

        <section className="ce-section">

          <Heading
            index="01"
            title="شاهکارهای ماندگار"
            english="THE ESSENTIAL COLLECTION"
            link="/search?sort=imdb"
          />

          <div className="ce-essentials">

            <article className="ce-big-poster">

              <Link to={`/movie/${topRated[0].id}`}>
                <Photo movie={topRated[0]}/>
              </Link>

              <div className="ce-big-poster-info">

                <span className="ce-kicker">
                  بالاترین امتیاز مجموعه
                </span>

                <strong dir="ltr">
                  {topRated[0].imdb.toFixed(1)}
                </strong>

                <Link to={`/movie/${topRated[0].id}`}>
                  <h3>{topRated[0].titleFa}</h3>
                </Link>

                <p>{topRated[0].titleEn}</p>

                <Link
                  className="ce-text-link"
                  to={`/movie/${topRated[0].id}`}
                >
                  مشاهده جزئیات
                  <ArrowUpLeft size={17}/>
                </Link>

              </div>

            </article>

            <div className="ce-ranked-list">

              {topRated.slice(1,6).map((movie,index) => (

                <Link
                  to={`/movie/${movie.id}`}
                  className="ce-ranked-row"
                  key={movie.id}
                >

                  <span className="ce-rank" dir="ltr">
                    {String(index+2).padStart(2,"0")}
                  </span>

                  <div className="ce-rank-image">
                    <Photo movie={movie}/>
                  </div>

                  <div className="ce-rank-title">
                    <h3>{movie.titleFa}</h3>
                    <p dir="ltr">{movie.titleEn}</p>
                    <small>{movie.year}</small>
                  </div>

                  <span className="ce-rating" dir="ltr">
                    <Star size={14} fill="currentColor"/>
                    {movie.imdb.toFixed(1)}
                  </span>

                  <ArrowUpLeft className="ce-row-arrow" size={18}/>

                </Link>

              ))}

            </div>

          </div>

        </section>

        <section className="ce-section">

          <Heading
            index="02"
            title="داستان‌هایی برای دنبال کردن"
            english="THE SERIES COLLECTION"
            link="/search?type=series"
          />

          <div className="ce-series-grid">

            {series.map(movie => (

              <article key={movie.id} className="ce-series">

                <Link
                  to={`/movie/${movie.id}`}
                  className="ce-series-image"
                >

                  <Photo movie={movie} wide/>

                  <span className="ce-series-tag">
                    {movie.seasons || 1} فصل
                  </span>

                </Link>

                <div className="ce-series-info">

                  <div>
                    <span className="ce-kicker">
                      {movie.genres[0]} / {movie.year}
                    </span>

                    <Link to={`/movie/${movie.id}`}>
                      <h3>{movie.titleFa}</h3>
                    </Link>

                    <p dir="ltr">{movie.titleEn}</p>
                  </div>

                  <span className="ce-rating" dir="ltr">
                    <Star size={14} fill="currentColor"/>
                    {movie.imdb.toFixed(1)}
                  </span>

                </div>

              </article>

            ))}

          </div>

        </section>

        <section className="ce-statement">

          <div className="ce-statement-image">

            {MOVIES.slice(0,5).map(movie => (
              <div key={movie.id}>
                <Photo movie={movie}/>
              </div>
            ))}

          </div>

          <div className="ce-statement-content">

            <span className="ce-kicker" dir="ltr">
              EVERY FILM HAS A STORY
            </span>

            <h2>سینمای بعدی تو کدام است؟</h2>

            <p>
              گاهی بهترین انتخاب، فیلمی است که انتظارش را ندارید.
            </p>

            <Link
              to="/search"
              className="ce-primary"
            >
              <Shuffle size={17}/>
              کشف آثار بیشتر
            </Link>

          </div>

        </section>

        <section className="ce-section ce-library">

          <Heading
            index="03"
            title="آرشیو سینماپدیا"
            english="EXPLORE THE ARCHIVE"
          />

          <div className="ce-library-toolbar">

            <div className="ce-types">

              {[
                ["all","همه آثار"],
                ["movie","فیلم‌ها"],
                ["series","سریال‌ها"]
              ].map(([key,label]) => (
                <button
                  key={key}
                  className={type === key ? "active" : ""}
                  onClick={() => setType(key)}
                >
                  {label}
                </button>
              ))}

            </div>

            <div className="ce-search">

              <Search size={18}/>

              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="جستجو در آرشیو..."
                aria-label="جستجوی آثار"
              />

              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="پاک کردن"
                >
                  <X size={16}/>
                </button>
              )}

            </div>

            <div className="ce-sort">

              <SlidersHorizontal size={17}/>

              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                aria-label="مرتب سازی"
              >
                <option value="latest">جدیدترین</option>
                <option value="rating">بالاترین امتیاز</option>
              </select>

            </div>

          </div>

          <div className="ce-genres">

            <button
              className={!genre ? "active" : ""}
              onClick={() => setGenre("")}
            >
              همه ژانرها
            </button>

            {GENRES.map(g => (
              <button
                key={g}
                className={genre === g ? "active" : ""}
                onClick={() => setGenre(genre === g ? "" : g)}
              >
                {g}
              </button>
            ))}

          </div>

          <div className="ce-results">
            <span>{filtered.length} اثر در آرشیو</span>
            <span dir="ltr">CINEMA ARCHIVE</span>
          </div>

          <div className="ce-poster-grid">

            {filtered.map(movie => (
              <Poster
                key={movie.id}
                movie={movie}
                saved={saved.includes(movie.id)}
                onSave={saveMovie}
              />
            ))}

          </div>

          {!filtered.length && (
            <div className="ce-empty">
              <Search size={35} strokeWidth={1}/>
              <h3>اثری پیدا نشد</h3>
              <button
                onClick={() => {
                  setQuery("");
                  setGenre("");
                  setType("all");
                }}
              >
                پاک کردن فیلترها
              </button>
            </div>
          )}

        </section>

        <section className="ce-personal">

          <Bookmark size={38} strokeWidth={1}/>

          <div>
            <h2>مجموعه شخصی شما</h2>
            <p>داستان‌هایی که دوست دارید دوباره به آن‌ها برگردید.</p>
          </div>

          <Link to="/watchlist" className="ce-text-link">
            لیست من ({saved.length})
            <ArrowUpLeft size={19}/>
          </Link>

        </section>

        <div className="ce-wordmark" dir="ltr">
          cinemapedia.
        </div>

        <div className="ce-end">
          <span>هنر تماشای سینما</span>
          <span dir="ltr">THE ART OF CINEMA</span>
        </div>

      </div>

    </div>
  );
}

