import { UserReview } from "@/types";

const WATCHLIST_KEY = "cp_watchlist";
const RATINGS_KEY = "cp_ratings";
const REVIEWS_KEY = "cp_reviews";

// Banned Words

const BANNED_WORDS = ["خنگ", "بیشعور", "احمق","stupid","pathetic"];

function containsBannedWords(text: string): boolean {
  const lower = text.toLowerCase();

  return BANNED_WORDS.some((word) =>
    lower.includes(word.toLowerCase())
  );
}

function sanitizeText(text: string): string {
  let result = text;

  BANNED_WORDS.forEach((word) => {
    const regex = new RegExp(word, "gi");
    result = result.replace(regex, "***");
  });

  return result;
}

//  Watchlist

export function getWatchlist(): string[] {
  try {
    return JSON.parse(localStorage.getItem(WATCHLIST_KEY) || "[]");
  } catch {
    return [];
  }
}

export function toggleWatchlist(id: string): boolean {
  const list = getWatchlist();
  const exists = list.includes(id);

  const updated = exists
    ? list.filter((x) => x !== id)
    : [...list, id];

  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("cp:watchlist"));

  return !exists;
}

export function isInWatchlist(id: string): boolean {
  return getWatchlist().includes(id);
}

//  Ratings

export function getUserRating(movieId: string): number | null {
  try {
    const ratings = JSON.parse(
      localStorage.getItem(RATINGS_KEY) || "{}"
    );

    return ratings[movieId] ?? null;
  } catch {
    return null;
  }
}

export function setUserRating(movieId: string, rating: number): void {
  try {
    const ratings = JSON.parse(
      localStorage.getItem(RATINGS_KEY) || "{}"
    );

    ratings[movieId] = rating;

    localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));
  } catch {
    // ignore
  }
}

// Reviews

export function getReviews(movieId: string): UserReview[] {
  try {
    const all = JSON.parse(
      localStorage.getItem(REVIEWS_KEY) || "{}"
    );

    return all[movieId] || getDefaultReviews(movieId);
  } catch {
    return getDefaultReviews(movieId);
  }
}

// (boolean return)
export function addReview(review: UserReview): boolean {
  try {
    //  block banned words
    if (containsBannedWords(review.text)) {
      return false;
    }

    const all = JSON.parse(
      localStorage.getItem(REVIEWS_KEY) || "{}"
    );

    if (!all[review.movieId]) {
      all[review.movieId] = [];
    }

    // review.text = sanitizeText(review.text);

    all[review.movieId] = [review, ...all[review.movieId]];

    localStorage.setItem(REVIEWS_KEY, JSON.stringify(all));

    return true;
  } catch {
    return false;
  }
}

export function deleteReview(
  movieId: string,
  reviewId: string
): void {
  try {
    const all = JSON.parse(
      localStorage.getItem(REVIEWS_KEY) || "{}"
    );

    if (!all[movieId]) return;

    all[movieId] = all[movieId].filter(
      (r: UserReview) => r.id !== reviewId
    );

    localStorage.setItem(REVIEWS_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }
}

//  Default Reviews

function getDefaultReviews(movieId: string): UserReview[] {
  const defaults: Record<string, UserReview[]> = {
    oppenheimer: [
      {
        id: "r1",
        movieId: "oppenheimer",
        username: "دانشمند ایرانی",
        rating: 9,
        text: "یکی از بهترین فیلم‌های نولان. بازی کیلیان مورفی فراموش‌نشدنیه.",
        date: "۱۵ مرداد ۱۴۰۲",
        likes: 24,
      },
      {
        id: "r2",
        movieId: "oppenheimer",
        username: "علاقه‌مند به تاریخ",
        rating: 8,
        text: "به عنوان یک فیلم تاریخی فوق‌العاده است. کمی طولانی اما ارزشش را دارد.",
        date: "۲۰ مرداد ۱۴۰۲",
        likes: 15,
      },
    ],
    inception: [
      {
        id: "r3",
        movieId: "inception",
        username: "عاشق نولان",
        rating: 10,
        text: "شاهکار مطلق. هر بار که می‌بینم چیز جدیدی کشف می‌کنم.",
        date: "۱ فروردین ۱۴۰۲",
        likes: 41,
      },
    ],
    breakingBad: [
      {
        id: "r4",
        movieId: "breakingBad",
        username: "سریال‌باز",
        rating: 10,
        text: "بهترین سریال تاریخ تلویزیون. نقطه.",
        date: "۵ آبان ۱۴۰۲",
        likes: 67,
      },
      {
        id: "r5",
        movieId: "breakingBad",
        username: "منتقد سینما",
        rating: 9,
        text: "تحول شخصیت والتر وایت بی‌نظیره.",
        date: "۱۲ آبان ۱۴۰۲",
        likes: 32,
      },
    ],
  };

  return defaults[movieId] || [];
}
