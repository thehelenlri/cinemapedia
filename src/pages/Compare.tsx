import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { ArrowLeftRight, Search, X } from "lucide-react";
import { MOVIES, getMovieById } from "@/constants/movies";
import type { Movie } from "@/types";
import { formatDuration } from "@/lib/utils";
import {
  EditorialHeader, EditorialImage
} from "@/components/features/Editorial";

function Selector({
  movie, exclude, onChange
}: {
  movie: Movie | null | undefined;
  exclude: string;
  onChange: (id:string) => void;
}) {

  const [query,setQuery] = useState("");

  const choices = MOVIES.filter(m =>
    m.id !== exclude &&
    (m.titleFa.includes(query) ||
      m.titleEn.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="ed-selector">

      {movie ? (
        <>
          <div className="ed-compare-backdrop">
            <EditorialImage src={movie.backdrop} title={movie.titleEn}/>
          </div>

          <button
            className="ed-selector-remove"
            onClick={() => onChange("")}
            aria-label="حذف انتخاب"
          >
            <X size={20}/>
          </button>

          <div className="ed-selected">

            <Link to={`/movie/${movie.id}`}>
              <EditorialImage src={movie.poster} title={movie.titleEn}/>
            </Link>

            <div>
              <span className="ed-kicker">SELECTED TITLE</span>
              <h2>{movie.titleFa}</h2>
              <p dir="ltr">{movie.titleEn}</p>
              <span>{movie.year} / {movie.genres[0]}</span>
              <strong dir="ltr">{movie.imdb.toFixed(1)}</strong>
            </div>

          </div>
        </>
      ) : (
        <div className="ed-selector-empty">

          <h2>انتخاب یک اثر</h2>

          <div className="ed-mini-search">
            <Search size={17}/>
            <input
              placeholder="نام فیلم یا سریال..."
              value={query}
              aria-label="جستجوی اثر برای مقایسه"
              onChange={e => setQuery(e.target.value)}
            />
          </div>

          <div className="ed-choice-list">

            {choices.map(m => (
              <button
                key={m.id}
                onClick={() => {
                  onChange(m.id);
                  setQuery("");
                }}
              >
                <EditorialImage src={m.poster} title={m.titleEn}/>

                <div>
                  <strong>{m.titleFa}</strong>
                  <small dir="ltr">{m.titleEn}</small>
                </div>

                <span className="ed-rating">{m.imdb}</span>
              </button>
            ))}

            {!choices.length && <p>اثری یافت نشد.</p>}

          </div>

        </div>
      )}

    </div>
  );
}

export default function Compare() {

  const [params,setParams] = useSearchParams();

  const aId = params.get("a") || "";
  const bId = params.get("b") || "";

  const a = getMovieById(aId);
  const b = getMovieById(bId);

  const choose = (key:string,id:string) => {

    const next = new URLSearchParams(params);

    if (id) next.set(key,id);
    else next.delete(key);

    if (next.get("a") === next.get("b")) {
      next.delete(key === "a" ? "b" : "a");
    }

    setParams(next,{replace:true});

  };

  const metrics = a && b ? [
    {label:"IMDb",a:a.imdb,b:b.imdb,max:10},
    {label:"Rotten Tomatoes",a:a.rottenTomatoes,b:b.rottenTomatoes,max:100},
    {label:"Metacritic",a:a.metacritic,b:b.metacritic,max:100},
  ] : [];

  const mean = (m:Movie) =>
    (m.imdb*10+m.rottenTomatoes+m.metacritic)/3;

  const rows = a && b ? [
    ["نوع اثر",a.type === "movie" ? "فیلم":"سریال",b.type === "movie" ? "فیلم":"سریال"],
    ["سال انتشار",a.year,b.year],
    ["ژانر",a.genres.join("، "),b.genres.join("، ")],
    ["مدت زمان",formatDuration(a.duration),formatDuration(b.duration)],
    ["تعداد فصل",a.seasons ?? "-",b.seasons ?? "-"],
    ["تعداد قسمت",a.episodes ?? "-",b.episodes ?? "-"],
    ["کشور",a.country.join("، "),b.country.join("، ")],
    ["زبان",a.language,b.language],
    ["رده سنی",a.ageRating,b.ageRating],
    ["کارگردان",a.director.join("، "),b.director.join("، ")],
    ["نویسنده",a.writer.join("، "),b.writer.join("، ")],
    ["استودیو",a.studio,b.studio],
    ["شبکه پخش",a.network,b.network],
    ["فروش گیشه",a.boxOffice || "-",b.boxOffice || "-"],
    ["جوایز ثبت شده",a.awards?.length ?? 0,b.awards?.length ?? 0],
  ] : [];

  return (
    <div className="ed-page">

      <EditorialHeader
        index="02"
        english="SIDE BY SIDE"
        title="مقایسه آثار"
        description="دو داستان متفاوت؛ یک نگاه دقیق‌تر به دنیای سینما."
      />

      <div className="ed-compare-grid">

        <Selector
          movie={a}
          exclude={bId}
          onChange={id => choose("a",id)}
        />

        <div className="ed-versus">

          <strong>VS</strong>

          <button
            onClick={() => setParams({a:bId,b:aId})}
            aria-label="جابجایی آثار"
            disabled={!a || !b}
          >
            <ArrowLeftRight size={20}/>
          </button>

        </div>

        <Selector
          movie={b}
          exclude={aId}
          onChange={id => choose("b",id)}
        />

      </div>

      {a && b && a.id !== b.id ? (

        <>

          <section className="ed-block">

            <span className="ed-kicker">CRITICAL RATINGS</span>
            <h2>نگاهی به امتیازها</h2>

            <div className="ed-metrics">

              {metrics.map(metric => (

                <div className="ed-metric" key={metric.label}>

                  <h3>{metric.label}</h3>

                  <div className="ed-bar-label">
                    <span>{a.titleFa}</span>
                    <strong>{metric.a}/{metric.max}</strong>
                  </div>

                  <div className="ed-bar">
                    <span style={{width:`${metric.a/metric.max*100}%`}}/>
                  </div>

                  <div className="ed-bar-label">
                    <span>{b.titleFa}</span>
                    <strong>{metric.b}/{metric.max}</strong>
                  </div>

                  <div className="ed-bar alternate">
                    <span style={{width:`${metric.b/metric.max*100}%`}}/>
                  </div>

                </div>

              ))}

            </div>

          </section>

          <section className="ed-block">

            <span className="ed-kicker">THE DETAILS</span>
            <h2>مقایسه مشخصات</h2>

            <div className="ed-table-wrap">

              <table className="ed-table">

                <thead>
                  <tr>
                    <th>مشخصات</th>
                    <th>{a.titleFa}</th>
                    <th>{b.titleFa}</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map(([label,av,bv]) => (
                    <tr key={label}>
                      <th>{label}</th>
                      <td>{av}</td>
                      <td>{bv}</td>
                    </tr>
                  ))}
                </tbody>

              </table>

            </div>

          </section>

          <div className="ed-verdict">

            <span className="ed-kicker">
              COMPARISON SUMMARY
            </span>

            <h2>
              {mean(a) === mean(b)
                ? "امتیاز ترکیبی برابر است"
                : `امتیاز ترکیبی بالاتر: ${
                    mean(a)>mean(b) ? a.titleFa : b.titleFa
                  }`}
            </h2>

            <p>
              {a.titleFa}: {mean(a).toFixed(1)} از ۱۰۰
              {" | "}
              {b.titleFa}: {mean(b).toFixed(1)} از ۱۰۰
            </p>

            <small>
              میانگین ساده سه امتیاز ثبت شده؛
              این نتیجه به معنای برتری مطلق یک اثر نیست.
            </small>

          </div>

        </>

      ) : (

        <div className="ed-empty">
          <ArrowLeftRight size={42} strokeWidth={1}/>
          <h2>دو اثر متفاوت انتخاب کنید</h2>
          <p>مقایسه امتیازها و مشخصات در این بخش نمایش داده می‌شود.</p>
        </div>

      )}

    </div>
  );
}
