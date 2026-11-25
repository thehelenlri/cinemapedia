import { useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Search, Trash2, ArrowUpLeft } from "lucide-react";
import { MOVIES } from "@/constants/movies";
import { toggleWatchlist } from "@/lib/storage";
import {
  EditorialHeader, EditorialPoster, useCollection
} from "@/components/features/Editorial";
import { toast } from "sonner";

export default function Watchlist() {

  const { ids, toggle } = useCollection();

  const [query,setQuery] = useState("");
  const [type,setType] = useState("all");
  const [sort,setSort] = useState("saved");
  const [confirm,setConfirm] = useState(false);

  const movies = MOVIES
    .filter(m => ids.includes(m.id))
    .sort((a,b) => ids.indexOf(b.id)-ids.indexOf(a.id));

  const results = movies.filter(m =>
    (type === "all" || m.type === type) &&
    (m.titleFa.includes(query) ||
      m.titleEn.toLowerCase().includes(query.toLowerCase()))
  ).sort((a,b) => {

    if (sort === "rating") return b.imdb-a.imdb;
    if (sort === "year") return b.year-a.year;

    return 0;

  });

  const clear = () => {

    try {
      [...ids].forEach(id => toggleWatchlist(id));

      window.dispatchEvent(new Event("cp:watchlist"));

      setConfirm(false);

      toast.success("مجموعه پاک شد");
    } catch {
      toast.error("پاک کردن مجموعه ممکن نیست");
    }

  };

  return (
    <div className="ed-page">

      <EditorialHeader
        index="03"
        english="MY PERSONAL COLLECTION"
        title="لیست علاقه‌مندی"
        description="مجموعه‌ای از داستان‌هایی که برای شما ارزش تماشا دارند."
      />

      <div className="ed-collection-summary">

        <Bookmark size={40} strokeWidth={1}/>

        <div>
          <strong>{movies.length}</strong>
          <span>اثر ذخیره شده</span>
        </div>

        <div>
          <strong>{movies.filter(m=>m.type==="movie").length}</strong>
          <span>فیلم سینمایی</span>
        </div>

        <div>
          <strong>{movies.filter(m=>m.type==="series").length}</strong>
          <span>سریال</span>
        </div>

      </div>

      {movies.length ? (
        <>

          <div className="ed-library-tools">

            <div className="ed-tabs">

              {[
                ["all","همه"],
                ["movie","فیلم‌ها"],
                ["series","سریال‌ها"]
              ].map(([key,label])=>(
                <button
                  key={key}
                  className={type===key?"active":""}
                  onClick={()=>setType(key)}
                >
                  {label}
                </button>
              ))}

            </div>

            <div className="ed-mini-search">
              <Search size={18}/>
              <input
                placeholder="جستجو در مجموعه..."
                value={query}
                aria-label="جستجوی مجموعه"
                onChange={e=>setQuery(e.target.value)}
              />
            </div>

            <select
              value={sort}
              aria-label="مرتب سازی"
              onChange={e=>setSort(e.target.value)}
            >
              <option value="saved">آخرین ذخیره شده</option>
              <option value="rating">بالاترین امتیاز</option>
              <option value="year">سال انتشار</option>
            </select>

            <button
              className="ed-delete"
              onClick={()=>setConfirm(true)}
            >
              <Trash2 size={16}/>
              پاک کردن همه
            </button>

          </div>

          <div className="ed-results-toolbar">
            {results.length} اثر
          </div>

          <div className="ed-grid">

            {results.map(movie=>(
              <EditorialPoster
                key={movie.id}
                movie={movie}
                saved
                onSave={()=>toggle(movie.id)}
              />
            ))}

          </div>

          {!results.length && (
            <div className="ed-empty">
              <Search size={35}/>
              <h2>اثری با این مشخصات پیدا نشد</h2>
              <button
                className="ed-outline"
                onClick={()=>{setQuery("");setType("all");}}
              >
                نمایش همه
              </button>
            </div>
          )}

        </>
      ) : (
        <div className="ed-empty ed-empty-library">

          <Bookmark size={64} strokeWidth={.8}/>

          <h2>مجموعه شما هنوز خالی است.</h2>

          <p>از میان آثار سینماپدیا، فیلم بعدی خود را انتخاب کنید.</p>

          <Link to="/search" className="ed-primary">
            کشف فیلم و سریال
            <ArrowUpLeft size={18}/>
          </Link>

        </div>
      )}

      {confirm && (
        <div
          className="ed-modal"
          onClick={()=>setConfirm(false)}
        >
          <div
            className="ed-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="تایید حذف مجموعه"
            onClick={e=>e.stopPropagation()}
          >

            <h2>تمام آثار حذف شوند؟</h2>

            <p>این کار لیست علاقه‌مندی شما را خالی می‌کند.</p>

            <div>
              <button className="ed-outline" onClick={()=>setConfirm(false)}>
                انصراف
              </button>

              <button className="ed-delete" onClick={clear}>
                حذف همه
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
