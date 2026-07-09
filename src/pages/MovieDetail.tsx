import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star,
  Bookmark,
  BookmarkCheck,
  Play,
  Clock,
  Globe,
  Calendar,
  Award,
  Tv,
  Film,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  Flag,
  GitCompare,
} from "lucide-react";
import { getMovieById, getSimilar } from "@/constants/movies";
import {
  toggleWatchlist,
  isInWatchlist,
  getUserRating,
  setUserRating,
  getReviews,
} from "@/lib/storage";
import { formatDuration } from "@/lib/utils";
import ScoreBadges from "@/components/features/ScoreBadges";
import CastSection from "@/components/features/CastSection";
import ReviewSection from "@/components/features/ReviewSection";
import FilmClip from "@/components/features/FilmClip";
import SimilarMovies from "@/components/features/SimilarMovies";
import { toast } from "sonner";

export default function MovieDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movie = id ? getMovieById(id) : null;
  const [saved, setSaved] = useState(false);
  const [userRating, setUserRatingState] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviews, setReviews] = useState<ReturnType<typeof getReviews>>([]);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "info" | "cast" | "reviews" | "clip"
  >("info");

  useEffect(() => {
    if (!movie) return;
    setSaved(isInWatchlist(movie.id));
    setUserRatingState(getUserRating(movie.id));
    setReviews(getReviews(movie.id));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [movie]);

  const refreshReviews = useCallback(() => {
    if (movie) setReviews(getReviews(movie.id));
  }, [movie]);

  if (!movie) {
    return (
      <div className="pt-28 text-center">
        <p className="text-muted-foreground">اثر مورد نظر یافت نشد</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-teal-400 hover:text-teal-300"
        >
          بازگشت به صفحه اصلی
        </button>
      </div>
    );
  }

  const similar = getSimilar(movie.similarIds);

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

  const handleRating = (r: number) => {
    setUserRating(movie.id, r);
    setUserRatingState(r);
    toast.success(`امتیاز ${r}/۱۰ ثبت شد`);
  };

  const statusLabel: Record<string, string> = {
    released: "اکران شده",
    ongoing: "در حال پخش",
    ended: "پایان یافته",
    upcoming: "به زودی",
  };
  const statusColor: Record<string, string> = {
    released: "text-cyan-400 bg-cyan-400/10",
    ongoing: "text-blue-400 bg-blue-400/10",
    ended: "text-muted-foreground bg-muted",
    upcoming: "text-teal-400 bg-teal-400/10",
  };

  return (
    <div className="pt-16">
      {/* Backdrop Hero */}
      <div className="relative h-[400px] sm:h-[520px]">
        <img
          src={movie.backdrop}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cinema-dark via-cinema-dark/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark via-transparent to-cinema-dark/20" />

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full pb-8">
            <div className="flex gap-6 items-end">
              {/* Poster */}
              <div className="hidden sm:block shrink-0 w-36 h-52 rounded-xl overflow-hidden border-2 border-white/10 shadow-2xl">
                <img
                  src={movie.poster}
                  alt={movie.titleEn}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColor[movie.status]}`}
                  >
                    {statusLabel[movie.status]}
                  </span>
                  <span className="text-xs px-2 py-1 rounded border border-border text-muted-foreground">
                    {movie.ageRating}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    {movie.type === "series" ? (
                      <Tv className="w-3 h-3" />
                    ) : (
                      <Film className="w-3 h-3" />
                    )}
                    {movie.type === "series" ? "سریال" : "فیلم"}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                  {movie.titleFa}
                </h1>
                <p className="text-base text-muted-foreground ltr mt-1 mb-4">
                  {movie.titleEn} ({movie.year})
                </p>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((g) => (
                    <span
                      key={g}
                      className="text-xs px-3 py-1 rounded-full bg-white/10 text-white border border-white/10"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-cinema-card border-b border-border sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setTrailerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-black font-bold rounded-lg text-sm transition-all"
          >
            <Play className="w-4 h-4 fill-black" />
            تریلر
          </button>
          <button
            onClick={handleWatchlist}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
              saved
                ? "bg-teal-500/20 border-teal-500/50 text-teal-400"
                : "bg-cinema-surface border-border text-muted-foreground hover:text-white"
            }`}
          >
            {saved ? (
              <BookmarkCheck className="w-4 h-4" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
            {saved ? "در لیست من" : "افزودن به لیست"}
          </button>
          <Link
            to={`/compare?a=${movie.id}`}
            className="flex items-center gap-2 px-4 py-2 bg-cinema-surface border border-border text-muted-foreground hover:text-white rounded-lg text-sm transition-all"
          >
            <GitCompare className="w-4 h-4" />
            مقایسه
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="mr-auto flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            بازگشت
          </button>
        </div>
      </div>

      {/* Trailer Modal */}
      {trailerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setTrailerOpen(false)}
        >
          <div
            className="w-full max-w-3xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              aria-label="thriller "
              src={`https://www.youtube.com/embed/${movie.trailerYT}?autoplay=1&rel=0`}
              className="w-full h-full rounded-xl"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Scores */}
            <ScoreBadges
              imdb={movie.imdb}
              rottenTomatoes={movie.rottenTomatoes}
              metacritic={movie.metacritic}
              userScore={userRating}
            />

            {/* Tabs */}
            <div className="border-b border-border">
              <div className="flex gap-1 -mb-px">
                {(["info", "cast", "clip", "reviews"] as const).map((tab) => {
                  const labels = {
                    info: "اطلاعات",
                    cast: "عوامل",
                    clip: "صحنه فیلم",
                    reviews: "نقدها",
                  };
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
                        activeTab === tab
                          ? "border-teal-500 text-teal-400"
                          : "border-transparent text-muted-foreground hover:text-white"
                      }`}
                    >
                      {labels[tab]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "info" && (
              <div className="space-y-6 animate-fade-in">
                {/* Synopsis */}
                <div>
                  <h3 className="text-base font-bold text-white mb-3">
                    خلاصه داستان
                  </h3>
                  <p className="text-sm text-muted-foreground leading-[1.9]">
                    {movie.synopsis}
                  </p>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-cyan-950/30 border border-cyan-900/40 rounded-xl p-4">
                    <h4 className="font-bold text-cyan-400 mb-3 flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4" /> نقاط قوت
                    </h4>
                    <ul className="space-y-2">
                      {movie.strengths.map((s, i) => (
                        <li
                          key={i}
                          className="text-sm text-cyan-300/80 flex gap-2"
                        >
                          <span className="text-cyan-500 mt-0.5">✓</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-950/30 border border-red-900/40 rounded-xl p-4">
                    <h4 className="font-bold text-red-400 mb-3 flex items-center gap-2">
                      <ThumbsDown className="w-4 h-4" /> نقاط ضعف
                    </h4>
                    <ul className="space-y-2">
                      {movie.weaknesses.map((s, i) => (
                        <li
                          key={i}
                          className="text-sm text-red-300/80 flex gap-2"
                        >
                          <span className="text-red-500 mt-0.5">✗</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Awards */}
                {movie.awards && movie.awards.length > 0 && (
                  <div>
                    <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                      <Award className="w-4 h-4 text-teal-400" /> جوایز و
                      افتخارات
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {movie.awards.map((a) => (
                        <span
                          key={a}
                          className="text-xs px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-300"
                        >
                          🏆 {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* User Rating */}
                <div className="bg-cinema-card border border-border rounded-xl p-5">
                  <h3 className="text-base font-bold text-white mb-4">
                    امتیاز دهید
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((r) => (
                      <button
                        key={r}
                        onClick={() => handleRating(r)}
                        onMouseEnter={() => setHoverRating(r)}
                        onMouseLeave={() => setHoverRating(0)}
                        className={`w-9 h-9 rounded-lg text-sm font-bold transition-all border ${
                          r <= (hoverRating || (userRating ?? 0))
                            ? "bg-teal-500 border-teal-400 text-black scale-110"
                            : "bg-cinema-surface border-border text-muted-foreground hover:border-teal-500/50"
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                    {userRating && (
                      <span className="text-sm text-teal-400 font-bold mr-2">
                        امتیاز شما: {userRating}/۱۰
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "cast" && (
              <div className="animate-fade-in">
                <CastSection
                  cast={movie.cast}
                  director={movie.director}
                  writer={movie.writer}
                  producer={movie.producer}
                />
              </div>
            )}

            {activeTab === "clip" && (
              <div className="animate-fade-in">
                <FilmClip
                  clipYT={movie.clipYT}
                  clipTitle={movie.clipTitle}
                  movieTitle={movie.titleFa}
                />
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="animate-fade-in">
                <ReviewSection
                  movieId={movie.id}
                  reviews={reviews}
                  onReviewAdded={refreshReviews}
                />
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Poster (mobile hidden, visible on lg) */}
            <div className="hidden lg:block">
              <img
                src={movie.poster}
                alt={movie.titleEn}
                className="w-full rounded-xl border border-border"
              />
            </div>

            {/* Info Table */}
            <div className="bg-cinema-card border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <h3 className="text-sm font-bold text-white">اطلاعات اثر</h3>
              </div>
              <div className="divide-y divide-border">
                {[
                  {
                    label: "سال تولید",
                    value: movie.year,
                    icon: <Calendar className="w-3.5 h-3.5" />,
                  },
                  {
                    label: "مدت زمان",
                    value:
                      movie.type === "series"
                        ? `هر قسمت ${movie.duration} دقیقه`
                        : formatDuration(movie.duration),
                    icon: <Clock className="w-3.5 h-3.5" />,
                  },
                  {
                    label: "زبان",
                    value: movie.language,
                    icon: <Globe className="w-3.5 h-3.5" />,
                  },
                  {
                    label: "کشور سازنده",
                    value: movie.country.join("، "),
                    icon: <Flag className="w-3.5 h-3.5" />,
                  },
                  {
                    label: "استودیو",
                    value: movie.studio,
                    icon: <Film className="w-3.5 h-3.5" />,
                  },
                  {
                    label: "شبکه پخش",
                    value: movie.network,
                    icon: <Tv className="w-3.5 h-3.5" />,
                  },
                  ...(movie.type === "series"
                    ? [
                        {
                          label: "تعداد فصل",
                          value: `${movie.seasons} فصل`,
                          icon: <Star className="w-3.5 h-3.5" />,
                        },
                        {
                          label: "تعداد قسمت",
                          value: `${movie.episodes} قسمت`,
                          icon: <Star className="w-3.5 h-3.5" />,
                        },
                      ]
                    : []),
                  ...(movie.boxOffice
                    ? [
                        {
                          label: "فروش گیشه",
                          value: movie.boxOffice,
                          icon: <Award className="w-3.5 h-3.5" />,
                        },
                      ]
                    : []),
                  {
                    label: "تاریخ اکران",
                    value: movie.releaseDate,
                    icon: <Calendar className="w-3.5 h-3.5" />,
                  },
                  {
                    label: "رده سنی",
                    value: movie.ageRating,
                    icon: <Flag className="w-3.5 h-3.5" />,
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-start gap-3 px-4 py-2.5"
                  >
                    <span className="text-muted-foreground mt-0.5 shrink-0">
                      {row.icon}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0 w-24">
                      {row.label}
                    </span>
                    <span className="text-xs text-white font-medium text-left flex-1">
                      {String(row.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar */}
            <SimilarMovies movies={similar} />
          </div>
        </div>
      </div>
    </div>
  );
}
