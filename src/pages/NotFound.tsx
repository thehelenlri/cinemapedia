import { Link } from "react-router-dom";
import { Film } from "lucide-react";

export default function NotFound() {
  return (
    <div className="pt-16 min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <div className="text-8xl mb-6">🎬</div>
        <h1 className="text-6xl font-black text-white mb-4">۴۰۴</h1>
        <p className="text-xl text-muted-foreground mb-2">
          این صفحه وجود ندارد
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          شاید اشتباه تایپ کرده‌اید یا صفحه حذف شده
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-black font-bold rounded-xl transition-all"
        >
          <Film className="w-4 h-4" />
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
}
