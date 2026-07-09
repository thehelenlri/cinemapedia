import { Star } from "lucide-react";
import { getMetacriticColor } from "@/lib/utils";

interface Props {
  imdb: number;
  rottenTomatoes: number;
  metacritic: number;
  userScore?: number | null;
}

export default function ScoreBadges({
  imdb,
  rottenTomatoes,
  metacritic,
  userScore,
}: Props) {
  const rtFresh = rottenTomatoes >= 60;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {/* IMDb */}
      <div className="glass-card rounded-xl p-4 text-center">
        <div className="text-xs text-muted-foreground mb-1 font-en ltr">
          IMDb
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <Star className="w-5 h-5 fill-teal-400 text-teal-400" />
          <span className="text-2xl font-black text-teal-400 ltr">{imdb}</span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">از ۱۰</div>
      </div>

      {/* Rotten Tomatoes */}
      <div className="glass-card rounded-xl p-4 text-center">
        <div className="text-xs text-muted-foreground mb-1 ltr font-en">
          Rotten Tomatoes
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <span className="text-xl">{rtFresh ? "🍅" : "🤢"}</span>
          <span
            className={`text-2xl font-black ltr ${rtFresh ? "text-red-400" : "text-cyan-500"}`}
          >
            {rottenTomatoes}%
          </span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {rtFresh ? "تازه" : "گندیده"}
        </div>
      </div>

      {/* Metacritic */}
      <div className="glass-card rounded-xl p-4 text-center">
        <div className="text-xs text-muted-foreground mb-1 ltr font-en">
          Metacritic
        </div>
        <div className="flex items-center justify-center gap-2">
          <div
            className={`w-10 h-10 rounded-lg ${getMetacriticColor(metacritic)} flex items-center justify-center`}
          >
            <span className="text-base font-black text-white ltr">
              {metacritic}
            </span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-1">از ۱۰۰</div>
      </div>

      {/* User Score */}
      <div className="glass-card rounded-xl p-4 text-center">
        <div className="text-xs text-muted-foreground mb-1">امتیاز شما</div>
        {userScore != null ? (
          <>
            <div className="flex items-center justify-center gap-0.5 mb-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${s <= Math.round(userScore / 2) ? "fill-teal-400 text-teal-400" : "text-border"}`}
                />
              ))}
            </div>
            <span className="text-2xl font-black text-cyan-400 ltr">
              {userScore}
            </span>
            <div className="text-xs text-muted-foreground mt-1">از ۱۰</div>
          </>
        ) : (
          <div className="text-muted-foreground text-sm mt-2">ثبت نشده</div>
        )}
      </div>
    </div>
  );
}
