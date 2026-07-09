import { useState } from "react";
import { Star, ThumbsUp, Send, Trash2 } from "lucide-react";
import { UserReview } from "@/types";
import { addReview, deleteReview } from "@/lib/storage";
import { toast } from "sonner";

interface Props {
  movieId: string;
  reviews: UserReview[];
  onReviewAdded: () => void;
}

export default function ReviewSection({
  movieId,
  reviews,
  onReviewAdded,
}: Props) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [username, setUsername] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanUsername = username.trim();
    const cleanText = text.trim();

    if (!cleanUsername || !cleanText || rating === 0) {
      toast.error("لطفاً نام، امتیاز و نظر خود را وارد کنید");
      return;
    }

    const review: UserReview = {
      id: Date.now().toString(),
      movieId,
      username: cleanUsername,
      rating,
      text: cleanText,
      date: new Date().toLocaleDateString("fa-IR"),
      likes: 0,
    };

    setLoading(true);

    const success = addReview(review);

    setLoading(false);

    //  اگر توسط banned words بلاک شد
    if (!success) {
      toast.error("نظر شما شامل کلمات غیرمجاز است");
      return;
    }

    // reset form
    setRating(0);
    setText("");
    setUsername("");
    setShowForm(false);

    onReviewAdded();
    toast.success("نظر شما ثبت شد");
  };

  const handleDelete = (reviewId: string) => {
    deleteReview(movieId, reviewId);
    onReviewAdded();
    toast.success("نظر حذف شد");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white">
          نقد و بررسی کاربران
        </h3>

        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm text-teal-400 hover:text-teal-300 transition-colors font-medium"
        >
          {showForm ? "انصراف" : "+ ثبت نظر"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-cinema-card border border-border rounded-xl p-5 space-y-4 animate-slide-up"
        >
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="نام یا نام‌مستعار"
            className="w-full bg-cinema-surface border border-border rounded-lg px-4 py-2.5 text-sm text-white"
          />

          {/* Rating */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
              <button
              aria-label="setRating"
                key={s}
                type="button"
                onClick={() => setRating(s)}
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(0)}
              >
                <Star
                  className={`w-5 h-5 ${
                    s <= (hover || rating)
                      ? "fill-teal-400 text-teal-400"
                      : "text-border"
                  }`}
                />
              </button>
            ))}
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="دیدگاه خود را بنویسید..."
            className="w-full bg-cinema-surface border border-border rounded-lg px-4 py-2.5 text-sm text-white resize-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-black font-bold rounded-lg text-sm"
          >
            <Send className="w-4 h-4" />
            {loading ? "در حال ارسال..." : "ارسال نظر"}
          </button>
        </form>
      )}

      {/* Reviews */}
      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            اولین نفری باشید که نظر می‌دهد
          </div>
        ) : (
          reviews.map((r) => (
            <div
              key={r.id}
              className="bg-cinema-card border border-border rounded-xl p-4"
            >
              {/* top */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
                    <span className="text-teal-400 font-bold text-sm">
                      {r.username?.[0] ?? "?"}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      {r.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {r.date}
                    </p>
                  </div>
                </div>

                {/* rating + delete */}
                <div className="flex items-center gap-2">
                  <Star className="w-3.5 h-3.5 fill-teal-400 text-teal-400" />
                  <span className="text-teal-400 font-bold text-sm">
                    {r.rating}/10
                  </span>

                  <button
                  aria-label="handleDelete"
                    onClick={() => handleDelete(r.id)}
                    className="text-red-400 hover:text-red-300 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* text */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {r.text}
              </p>

              {/* likes */}
              <div className="flex items-center gap-1 mt-3 text-muted-foreground">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span className="text-xs">
                  {r.likes} نفر مفید یافتند
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}