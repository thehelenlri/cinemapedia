import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, X, SlidersHorizontal } from "lucide-react";
import { MOVIES, GENRES } from "@/constants/movies";
import {
  EditorialHeader, EditorialPoster, useCollection
} from "@/components/features/Editorial";

export default function Search() {

  const [params, setParams] = useSearchParams();
  const { ids, toggle } = useCollection();

  const query = params.get("q") || "";
  const genre = params.get("genre") || "";
  const type = params.get("type") || "";
  const year = params.get("year") || "";
  const sort = params.get("sort") || "imdb";
  const minRating = Math.max(
    0, Math.min(10, Number(params.get("rating")) || 0)
  );

  const years = [...new Set(MOVIES.map(m => m.year))]
    .sort((a,b) => b-a);

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);

    if (value) next.set(key, value);
    else next.delete(key);

    setParams(next, { replace: true });
  };

  const results = MOVIES.filter(m => {

    const q = query.trim().toLowerCase();

    return (
      (!q ||
        m.titleFa.includes(q) ||
        m.titleEn.toLowerCase().includes(q) ||
        m.genres.some(g => g.includes(q))
      ) &&
      (!genre || m.genres.includes(genre)) &&
      (!type || m.type === type) &&
      (!year || m.year === Number(year)) &&
      m.imdb >= minRating
    );

  }).sort((a,b) => {

    if (sort === "year") return b.year-a.year;
    if (sort === "rt") return b.rottenTomatoes-a.rottenTomatoes;
    if (sort === "mc") return b.metacritic-a.metacritic;
    if (sort === "title") return a.titleFa.localeCompare(b.titleFa,"fa");

    return b.imdb-a.imdb;

  });

  return (
    <div className="ed-page">

      <EditorialHeader
        index="01"
        english="THE CINEMA ARCHIVE"
        title="جستجوی پیشرفته"
        description="داستان بعدی خود را در میان فیلم‌ها و سریال‌ها پیدا کنید."
      />

      <div className="ed-search-large">

        <SearchIcon size={26} strokeWidth={1.5}/>

        <input
          value={query}
          onChange={e => update("q",e.target.value)}
          placeholder="نام فیلم، سریال یا ژانر..."
          aria-label="جستجوی فیلم و سریال"
        />

        {query && (
          <button
            onClick={() => update("q","")}
            aria-label="پاک کردن جستجو"
          >
            <X size={21}/>
          </button>
        )}

      </div>

      <div className="ed-search-layout">

        <aside className="ed-filters">

          <div className="ed-filter-heading">
            <SlidersHorizontal size={19}/>
            <h2>فیلتر آثار</h2>
          </div>

          <label>
            نوع اثر
            <select
              value={type}
              onChange={e => update("type",e.target.value)}
            >
              <option value="">همه آثار</option>
              <option value="movie">فیلم سینمایی</option>
              <option value="series">سریال</option>
            </select>
          </label>

          <label>
            سال انتشار
            <select
              value={year}
              onChange={e => update("year",e.target.value)}
            >
              <option value="">تمام سال‌ها</option>
              {years.map(y => <option key={y}>{y}</option>)}
            </select>
          </label>

          <label>
            حداقل امتیاز IMDb
            <strong className="ed-range-value">
              {minRating.toFixed(1)} / 10
            </strong>

            <input
              type="range"
              min="0"
              max="10"
              step=".5"
              value={minRating}
              onChange={e => update("rating",e.target.value)}
            />
          </label>

          <div className="ed-filter-genres">

            <h3>ژانر</h3>

            {["",...GENRES].map(g => (
              <button
                key={g}
                className={genre === g ? "active" : ""}
                onClick={() => update("genre",g)}
                aria-pressed={genre === g}
              >
                <span>{g || "همه ژانرها"}</span>
                <span>
                  {g
                    ? MOVIES.filter(m => m.genres.includes(g)).length
                    : MOVIES.length}
                </span>
              </button>
            ))}

          </div>

          <button
            className="ed-outline"
            onClick={() => setParams({}, {replace:true})}
          >
            بازنشانی فیلترها
          </button>

        </aside>

        <section className="ed-search-results">

          <div className="ed-results-toolbar">

            <span>
              <strong>{results.length}</strong> اثر یافت شد
            </span>

            <select
              value={sort}
              aria-label="مرتب سازی"
              onChange={e => update("sort",e.target.value)}
            >
              <option value="imdb">امتیاز IMDb</option>
              <option value="year">جدیدترین آثار</option>
              <option value="rt">Rotten Tomatoes</option>
              <option value="mc">Metacritic</option>
              <option value="title">نام اثر</option>
            </select>

          </div>

          <div className="ed-grid ed-search-grid">
            {results.map(movie => (
              <EditorialPoster
                key={movie.id}
                movie={movie}
                saved={ids.includes(movie.id)}
                onSave={() => toggle(movie.id)}
              />
            ))}
          </div>

          {!results.length && (
            <div className="ed-empty">
              <SearchIcon size={42} strokeWidth={1}/>
              <h2>اثری پیدا نشد</h2>
              <p>عبارت جستجو یا فیلترها را تغییر دهید.</p>
              <button
                className="ed-primary"
                onClick={() => setParams({})}
              >
                نمایش همه آثار
              </button>
            </div>
          )}

        </section>

      </div>

    </div>
  );
}
