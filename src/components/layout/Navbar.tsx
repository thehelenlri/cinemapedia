import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Bookmark, GitCompare, Film, X, Menu } from "lucide-react";
import { MOVIES } from "@/constants/movies";
import { getWatchlist } from "@/lib/storage";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<typeof MOVIES>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [watchCount, setWatchCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setWatchCount(getWatchlist().length);
  }, [location]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const q = query.toLowerCase();
    setSuggestions(
      MOVIES.filter(
        (m) => m.titleFa.includes(query) || m.titleEn.toLowerCase().includes(q),
      ).slice(0, 5),
    );
  }, [query]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setSuggestions([]);
    }
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-cinema-dark/90 backdrop-blur-lg border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-600 flex items-center justify-center">
            <Film className="w-4 h-4 text-black" />
          </div>
          <span className="font-bold text-lg text-white hidden sm:block">
            سینما<span className="text-gradient">پدیا</span>
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1 relative" ref={dropdownRef}>
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی فیلم یا سریال..."
              className="w-full bg-cinema-surface border border-border rounded-xl py-2 pr-10 pl-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-teal-500/60 focus:bg-cinema-card transition-all"
            />
            {query && (
              <button
                aria-label="clear search"
                type="button"
                onClick={() => {
                  setQuery("");
                  setSuggestions([]);
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground hover:text-white transition-colors" />
              </button>
            )}
          </form>
          {suggestions.length > 0 && (
            <div className="absolute top-full right-0 left-0 mt-1 bg-cinema-card border border-border rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
              {suggestions.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    navigate(`/movie/${m.id}`);
                    setQuery("");
                    setSuggestions([]);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-cinema-surface transition-colors text-right"
                >
                  <img
                    src={m.poster}
                    alt={m.titleEn}
                    className="w-9 h-12 object-cover rounded"
                  />
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">
                      {m.titleFa}
                    </p>
                    <p className="text-xs text-muted-foreground ltr">
                      {m.titleEn} • {m.year}
                    </p>
                  </div>
                  <span className="mr-auto text-xs text-teal-400 font-bold ltr">
                    {m.imdb}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            to="/search"
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-white rounded-lg hover:bg-cinema-surface transition-all"
          >
            <Search className="w-4 h-4" />
            جستجو
          </Link>
          <Link
            to="/compare"
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-white rounded-lg hover:bg-cinema-surface transition-all"
          >
            <GitCompare className="w-4 h-4" />
            مقایسه
          </Link>
          <Link
            to="/watchlist"
            className="relative flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-white rounded-lg hover:bg-cinema-surface transition-all"
          >
            <Bookmark className="w-4 h-4" />
            لیست من
            {watchCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-teal-500 text-black text-[10px] font-bold flex items-center justify-center">
                {watchCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile menu */}
        <button
          aria-label="Toggle menu"
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-cinema-card animate-slide-up">
          <div className="flex flex-col p-4 gap-1">
            <Link
              to="/search"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-foreground hover:bg-cinema-surface rounded-lg"
            >
              <Search className="w-4 h-4" /> جستجوی پیشرفته
            </Link>
            <Link
              to="/compare"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-foreground hover:bg-cinema-surface rounded-lg"
            >
              <GitCompare className="w-4 h-4" /> مقایسه آثار
            </Link>
            <Link
              to="/watchlist"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-foreground hover:bg-cinema-surface rounded-lg"
            >
              <Bookmark className="w-4 h-4" /> لیست علاقه‌مندی ({watchCount})
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
