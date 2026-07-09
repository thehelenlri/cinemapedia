import { Link } from "react-router-dom";
import { Film, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-cinema-card mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center">
                <Film className="w-4 h-4 text-black" />
              </div>
              <span className="font-bold text-lg text-white">سینماپدیا</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              جامع‌ترین پایگاه اطلاعاتی فیلم و سریال با نقد، امتیاز و تحلیل
              تخصصی.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">
              دسترسی سریع
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  صفحه اصلی
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  className="hover:text-white transition-colors"
                >
                  جستجوی پیشرفته
                </Link>
              </li>
              <li>
                <Link
                  to="/compare"
                  className="hover:text-white transition-colors"
                >
                  مقایسه آثار
                </Link>
              </li>
              <li>
                <Link
                  to="/watchlist"
                  className="hover:text-white transition-colors"
                >
                  لیست علاقه‌مندی
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">ژانرها</h3>
            <div className="flex flex-wrap gap-2">
              {["درام", "اکشن", "علمی‌تخیلی", "جنایی", "ترسناک", "کمدی"].map(
                (g) => (
                  <Link
                    key={g}
                    to={`/search?genre=${g}`}
                    className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:border-teal-500/50 hover:text-teal-400 transition-colors"
                  >
                    {g}
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
