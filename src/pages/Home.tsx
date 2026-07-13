import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Flame, Star, Tv, TrendingUp } from "lucide-react";
import HeroSlider from "@/components/features/HeroSlider";
import MovieCard from "@/components/features/MovieCard";
import {
  getFeatured,
  getTopRated,
  getLatestSeries,
  MOVIES,
  GENRES,
} from "@/constants/movies";
import heroBanner from "@/assets/hero-banner.jpg";

const featured = getFeatured();
const topRated = getTopRated();
const latestSeries = getLatestSeries();

export default function Home() {
  const [activeGenre, setActiveGenre] = useState<string | null>(null);

  const filtered = activeGenre
    ? MOVIES.filter((m) => m.genres.includes(activeGenre))
    : MOVIES;

  return (
    <div className="pt-16">
      {/* Hero */}
      <HeroSlider movies={featured} />

      {/* Stats Bar */}
      <div className="bg-cinema-card border-y border-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-3 gap-4 text-center">
          {[
            { label: "فیلم و سریال", value: MOVIES.length, icon: "🎬" },
            { label: "ژانر مختلف", value: GENRES.length, icon: "🎭" },
            { label: "نقد کاربران", value: "۱۰۰+", icon: "⭐" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-xl mb-0.5">{s.icon}</div>
              <div className="text-xl font-black text-white">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-14 
"
      >
        {/* Top Rated */}
        <Section
          title="برترین آثار"
          subtitle="بر اساس امتیاز IMDb"
          icon={<Star className="w-5 h-5 text-teal-400 fill-teal-400 " />}
          linkTo="/search?sort=imdb"
        >
          <div className="flex gap-4 overflow-x-auto pb-3 ">
            {topRated.map((m) => (
              <MovieCard key={m.id} movie={m} size="md" />
            ))}
          </div>
        </Section>

        {/* Genre Filter */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">
                جستجو بر اساس ژانر
              </h2>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveGenre(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                !activeGenre
                  ? "bg-teal-500 text-black"
                  : "bg-cinema-surface border border-border text-muted-foreground hover:text-white"
              }`}
            >
              همه
            </button>
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => setActiveGenre(g === activeGenre ? null : g)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  g === activeGenre
                    ? "bg-teal-500 text-black"
                    : "bg-cinema-surface border border-border text-muted-foreground hover:text-white"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.slice(0, 10).map((m) => (
              <MovieCard key={m.id} movie={m} size="lg" />
            ))}
          </div>
          {filtered.length > 10 && (
            <div className="mt-6 text-center">
              <Link
                to="/search"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-xl text-sm text-muted-foreground hover:text-white hover:border-teal-500/50 transition-all"
              >
                مشاهده همه ({filtered.length} اثر){" "}
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Latest Series */}
        <Section
          title="جدیدترین سریال‌ها"
          subtitle="آخرین سریال‌های بین‌المللی"
          icon={<Tv className="w-5 h-5 text-blue-400" />}
          linkTo="/search?type=series"
        >
          <div className="flex gap-4 overflow-x-auto pb-3">
            {latestSeries.map((m) => (
              <MovieCard key={m.id} movie={m} size="md" />
            ))}
          </div>
        </Section>

        {/* Trending */}
        <Section
          title="پرطرفدارترین‌ها"
          subtitle="بیشترین بازدید این هفته"
          icon={<Flame className="w-5 h-5 text-orange-400" />}
          linkTo="/search"
        >
          <div className="flex gap-4 overflow-x-auto pb-3">
            {[...MOVIES]
              .sort(() => Math.random() - 0.5)
              .slice(0, 7)
              .map((m) => (
                <MovieCard key={m.id} movie={m} size="md" />
              ))}
          </div>
        </Section>

        {/* Banner */}
        <div className="relative rounded-2xl overflow-hidden h-48">
          <img src={heroBanner} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex items-center px-8">
            <div>
              <h2 className="text-2xl font-black text-white mb-2">
                لیست علاقه‌مندی خود را بسازید
              </h2>
              <p className="text-sm text-white/70 mb-4">
                آثار مورد علاقه‌تان را ذخیره و مدیریت کنید
              </p>
              <Link
                to="/watchlist"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-black font-bold rounded-xl text-sm transition-all"
              >
                رفتن به لیست من
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  subtitle,
  icon,
  linkTo,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  linkTo: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cinema-surface flex items-center justify-center border border-border">
            {icon}
          </div>
          <div>
            <h2 className="text-xl font-black text-white">{title}</h2>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <Link
          to={linkTo}
          className="flex items-center gap-1 text-sm text-teal-400 hover:text-teal-300 transition-colors"
        >
          همه <ChevronLeft className="w-4 h-4" />
        </Link>
      </div>
      {children}
    </div>
  );
}
