"use client";

import { useState } from "react";
import HeroScroll from "../components/HeroScroll";

interface Car {
  id: number;
  name: string;
  category: "sale" | "rent";
  year: string;
  price: string;
  hp: string;
  speed: string;
  engine: string;
  image: string;
  badge: string;
}

const CARS_DATA: Car[] = [
  {
    id: 1,
    name: "BMW M8 Gran Coupé Competition",
    category: "sale",
    year: "2024",
    price: "$145,000",
    hp: "625 HP",
    speed: "3.2s (0-100)",
    engine: "4.4L V8 Twin-Turbo",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
    badge: "للبيع - بحالة الوكالة",
  },
  {
    id: 2,
    name: "Mercedes-AMG G63 Black Edition",
    category: "rent",
    year: "2024",
    price: "$850 / يومي",
    hp: "585 HP",
    speed: "4.5s (0-100)",
    engine: "4.0L V8 Biturbo",
    image: "https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=800&q=80",
    badge: "تأجير فاره VIP",
  },
  {
    id: 3,
    name: "Porsche 911 Turbo S",
    category: "sale",
    year: "2023",
    price: "$195,000",
    hp: "650 HP",
    speed: "2.7s (0-100)",
    engine: "3.8L Twin-Turbo",
    image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80",
    badge: "للبيع - فحص كامل",
  },
  {
    id: 4,
    name: "Range Rover SV Autobiography",
    category: "rent",
    year: "2024",
    price: "$650 / يومي",
    hp: "530 HP",
    speed: "4.6s (0-100)",
    engine: "4.4L V8",
    image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80",
    badge: "تأجير رجال أعمال VIP",
  },
  {
    id: 5,
    name: "Audi RS6 Avant Quattro",
    category: "sale",
    year: "2023",
    price: "$120,000",
    hp: "600 HP",
    speed: "3.6s (0-100)",
    engine: "4.0L V8 MHEV",
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80",
    badge: "للبيع - ضمان سنتين",
  },
  {
    id: 6,
    name: "Lamborghini Urus Performante",
    category: "rent",
    year: "2024",
    price: "$1,200 / يومي",
    hp: "666 HP",
    speed: "3.3s (0-100)",
    engine: "4.0L V8 Twin-Turbo",
    image: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80",
    badge: "تأجير رياضي سوبر VIP",
  },
];

export default function Home() {
  const [filter, setFilter] = useState<"all" | "sale" | "rent">("all");

  const filteredCars =
    filter === "all"
      ? CARS_DATA
      : CARS_DATA.filter((car) => car.category === filter);

  return (
    <main className="min-h-screen bg-[#0A0A0C] text-white selection:bg-amber-400 selection:text-black">
      {/* 1. قسم سكرول الهيرو التفاعلي */}
      <HeroScroll />

      {/* 2. قسم معرض السيارات */}
      <section
        id="showroom"
        className="relative z-20 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        style={{ direction: "rtl" }}
      >
        {/* رأس المعرض */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block px-4 py-1 rounded-full text-xs font-semibold bg-white/10 text-neutral-300 border border-white/10 mb-3">
            الأسطول المتاح
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            معرض السيارات الفاخرة
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-400">
            تصفح أحدث الموديلات المتوفرة لدينا للبيع الفوري أو خيارات التأجير الفارهة VIP بأعلى درجات الرفاهية والجاهزية.
          </p>

          {/* تبويبات التصفية */}
          <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
            <button
              onClick={() => setFilter("all")}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                filter === "all"
                  ? "bg-white text-black shadow-lg shadow-white/10"
                  : "bg-white/5 text-neutral-400 hover:text-white border border-white/10 hover:bg-white/10"
              }`}
            >
              جميع السيارات ({CARS_DATA.length})
            </button>
            <button
              onClick={() => setFilter("sale")}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                filter === "sale"
                  ? "bg-amber-400 text-black shadow-lg shadow-amber-400/20 font-bold"
                  : "bg-white/5 text-neutral-400 hover:text-white border border-white/10 hover:bg-white/10"
              }`}
            >
              سيارات للبيع
            </button>
            <button
              onClick={() => setFilter("rent")}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                filter === "rent"
                  ? "bg-sky-400 text-black shadow-lg shadow-sky-400/20 font-bold"
                  : "bg-white/5 text-neutral-400 hover:text-white border border-white/10 hover:bg-white/10"
              }`}
            >
              تأجير VIP
            </button>
          </div>
        </div>

        {/* شبكة كروت السيارات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCars.map((car) => (
            <div
              key={car.id}
              className="group bg-[#121216] rounded-2xl overflow-hidden border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-xl"
            >
              {/* صورة السيارة والبادج */}
              <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <span
                  className={`absolute top-3 right-3 text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-md border ${
                    car.category === "sale"
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      : "bg-sky-500/20 text-sky-300 border-sky-500/30"
                  }`}
                >
                  {car.badge}
                </span>
                <span className="absolute bottom-3 left-3 text-xs bg-black/70 backdrop-blur-md text-neutral-300 px-2.5 py-1 rounded-md border border-white/10">
                  موديل {car.year}
                </span>
              </div>

              {/* تفاصيل السيارة */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1">
                    {car.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 mb-4">
                    المحرك: {car.engine}
                  </p>

                  {/* شريط المواصفات */}
                  <div className="grid grid-cols-2 gap-2 py-3 border-y border-white/10 text-xs">
                    <div className="flex items-center gap-1.5 text-neutral-300">
                      <span className="text-neutral-500">القوة:</span>
                      <span className="font-semibold text-white">{car.hp}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-300">
                      <span className="text-neutral-500">التسارع:</span>
                      <span className="font-semibold text-white">{car.speed}</span>
                    </div>
                  </div>
                </div>

                {/* السعر وزر التواصل */}
                <div className="mt-5 pt-2 flex items-center justify-between">
                  <div>
                    <span className="block text-[11px] text-neutral-400">
                      {car.category === "sale" ? "السعر المطلوب" : "سعر الإيجار"}
                    </span>
                    <span className="text-lg sm:text-xl font-extrabold text-white">
                      {car.price}
                    </span>
                  </div>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `مرحباً، أود الاستفسار عن سيارة ${car.name} المعروضة في Aboud Cars.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-white text-black hover:bg-neutral-200 px-4 py-2 rounded-xl text-xs font-bold transition-transform active:scale-95"
                  >
                    <span>استفسار واتساب</span>
                    <svg
                      className="w-4 h-4 text-emerald-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.299.144.347.491 1.2.534 1.288.043.088.072.19.014.306-.058.116-.087.188-.173.289l-.26.303c-.087.087-.179.181-.077.355.101.173.451.744.968 1.205.666.594 1.228.778 1.402.865.174.087.276.073.378-.044.102-.116.434-.506.55-.679.116-.173.232-.145.39-.087s1.011.477 1.184.564.289.13.332.203c.043.072.043.42-.101.825z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. فوتر الموقع */}
      <footer
        className="border-t border-white/10 bg-[#070709] py-12 px-4 text-center text-xs text-neutral-500"
        style={{ direction: "rtl" }}
      >
        <p className="font-semibold text-neutral-300 text-sm mb-2">
          Aboud Cars — عالم الفخامة والقوة
        </p>
        <p className="mb-4">
          أفضل خدمات بيع وتأجير السيارات الرياضية والفاخرة بضمان معتمد وفحص شامل.
        </p>
        <p>© {new Date().getFullYear()} جميع الحقوق محفوظة لـ Aboud Cars.</p>
      </footer>
    </main>
  );
}
