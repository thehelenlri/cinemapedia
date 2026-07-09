import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import MovieDetail from "@/pages/MovieDetail";
import Search from "@/pages/Search";
import Compare from "@/pages/Compare";
import Watchlist from "@/pages/Watchlist";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-cinema-dark flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster
        position="bottom-right"
        dir="rtl"
        toastOptions={{
          style: {
            background: "#0D1117",
            color: "#F5F5F5",
            border: "1px solid #1F2937",
            fontFamily: "Vazirmatn, sans-serif",
          },
        }}
      />
    </BrowserRouter>
  );
}
