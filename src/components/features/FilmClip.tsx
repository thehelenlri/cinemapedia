import { useState } from "react";
import { Play, Film } from "lucide-react";

interface Props {
  clipYT: string;
  clipTitle: string;
  movieTitle: string;
}

export default function FilmClip({ clipYT, clipTitle, movieTitle }: Props) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="rounded-2xl overflow-hidden border border-border bg-cinema-card">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
          <Film className="w-4 h-4 text-red-400" />
        </div>
        <div>
          <h3 className="font-bold text-white text-sm">صحنه‌ای از فیلم</h3>
          <p className="text-xs text-muted-foreground">{clipTitle}</p>
        </div>
      </div>

      <div className="relative aspect-video bg-black">
        {!playing ? (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group"
            onClick={() => setPlaying(true)}
          >
            <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-500 transition-all duration-300 group-hover:scale-110">
              <Play className="w-8 h-8 fill-white text-white mr-1" />
            </div>
            <p className="mt-4 text-white font-semibold text-sm">{clipTitle}</p>
            <p className="text-xs text-muted-foreground mt-1">{movieTitle}</p>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          </div>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${clipYT}?autoplay=1&rel=0&modestbranding=1`}
            title={clipTitle}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      <div className="px-5 py-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">منبع: YouTube</span>
        <a
          href={`https://www.youtube.com/watch?v=${clipYT}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-teal-400 hover:text-teal-300 transition-colors"
        >
          مشاهده در یوتیوب ←
        </a>
      </div>
    </div>
  );
}
