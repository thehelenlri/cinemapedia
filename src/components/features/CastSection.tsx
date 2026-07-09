import { CastMember } from "@/types";
import { User } from "lucide-react";

interface Props {
  cast: CastMember[];
  director: string[];
  writer: string[];
  producer: string[];
}

export default function CastSection({
  cast,
  director,
  writer,
  producer,
}: Props) {
  return (
    <div className="space-y-6">
      {/* Cast */}
      <div>
        <h3 className="text-base font-bold text-white mb-4">بازیگران اصلی</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
          {cast.map((member) => (
            <div key={member.name} className="shrink-0 w-28 text-center">
              <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-border mb-2 bg-cinema-surface">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <p className="text-xs font-semibold text-white leading-tight">
                {member.name}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                {member.character}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Crew */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <CrewGroup title="کارگردان" names={director} />
        <CrewGroup title="نویسنده" names={writer} />
        <CrewGroup title="تهیه‌کننده" names={producer} />
      </div>
    </div>
  );
}

function CrewGroup({ title, names }: { title: string; names: string[] }) {
  return (
    <div className="bg-cinema-surface rounded-xl p-4 border border-border">
      <p className="text-xs text-muted-foreground mb-2">{title}</p>
      {names.map((n) => (
        <div key={n} className="flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          <span className="text-sm font-semibold text-white">{n}</span>
        </div>
      ))}
    </div>
  );
}
