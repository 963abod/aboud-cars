import Link from 'next/link'
import {
  Car,
  MapPin,
  Phone,
  ShieldCheck,
  Calendar,
  Gauge,
  Sliders,
  Fuel,
  MessageCircle,
  ArrowRight
} from 'lucide-react'

interface CarItem {
  id: string
  name: string
  nameEn: string
  image: string
  specs: {
    year: string
    engine: string
    transmission: string
    fuel: string
  }
}

const LUXURY_CARS: CarItem[] = [
  {
    id: 'mercedes-s-class',
    name: 'مرسيدس بنز S-Class',
    nameEn: 'Mercedes-Benz S-Class S 580 4MATIC',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80',
    specs: {
      year: '2024',
      engine: '4.0L V8 Biturbo',
      transmission: 'أوتوماتيك 9-Gtronic',
      fuel: 'بنزين',
    },
  },
  {
    id: 'bmw-7-series',
    name: 'بي إم دبليو الفئة السابعة',
    nameEn: 'BMW 7 Series 760i xDrive',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80',
    specs: {
      year: '2024',
      engine: '4.4L TwinPower V8',
      transmission: 'أوتوماتيك 8 سرعات',
      fuel: 'بنزين / هجين',
    },
  },
  {
    id: 'audi-rs7',
    name: 'أودي RS7 سبورتباك',
    nameEn: 'Audi RS7 Sportback Performance',
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1000&q=80',
    specs: {
      year: '2023',
      engine: '4.0L TFSI V8',
      transmission: 'أوتوماتيك Tiptronic',
      fuel: 'بنزين',
    },
  },
  {
    id: 'porsche-panamera',
    name: 'بورش باناميرا توربو S',
    nameEn: 'Porsche Panamera Turbo S',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1000&q=80',
    specs: {
      year: '2024',
      engine: '4.0L V8 Twin-Turbo',
      transmission: 'PDK 8 سرعات',
      fuel: 'بنزين',
    },
  },
]

export default function CarsPage() {
  const getWhatsAppUrl = (carName: string) => {
    const text = encodeURIComponent(`مرحباً عبود للسيارات، أود الاستفسار عن تفاصيل سيارة ${carName}`)
    return `https://wa.me/?text=${text}`
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-400 relative overflow-x-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-full max-w-[600px] h-[400px] bg-amber-500/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between border-b border-white/10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)] group-hover:border-amber-500/50 transition-colors">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-wider text-white block leading-none font-serif">
              ABOUD CARS
            </span>
            <span className="text-xs text-amber-400 tracking-widest block mt-1">
              عبود للسيارات
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-2 text-xs text-zinc-300 hover:text-amber-400 bg-white/5 border border-white/10 hover:border-amber-500/30 px-4 py-2 rounded-full backdrop-blur-md transition-all duration-300"
        >
          <span>الرئيسية</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </header>

      {/* Hero Title Section */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8 text-right">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>أسطول السيارات الفاخرة</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold font-serif text-white tracking-wide">
          معرض السيارات <span className="text-amber-400">الفاخرة</span>
        </h1>
        <p className="text-zinc-400 text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
          تصفح مجموعتنا المختارة بعناية من أحدث السيارات العالمية في دمشق. تواصل معنا مباشرة للاستفسار والحجز.
        </p>
      </section>

      {/* Car Grid Section */}
      <section className="relative z-10 w-full max-w-7xl mx-auto my-6 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto px-4">
          {LUXURY_CARS.map((car) => (
            <div
              key={car.id}
              className="group bg-zinc-900/70 backdrop-blur-md border border-white/10 hover:border-amber-500/40 rounded-2xl transition-all duration-300 shadow-2xl flex flex-col justify-between overflow-hidden w-full"
            >
              {/* Car Image Container */}
              <div className="relative w-full overflow-hidden bg-zinc-900 rounded-t-2xl">
                <img
                  src={car.image}
                  alt={car.name}
                  className="aspect-[16/10] object-cover w-full rounded-t-2xl group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-90" />
                <div className="absolute top-4 right-4 bg-zinc-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/20 text-xs text-amber-400 font-mono">
                  {car.specs.year}
                </div>
              </div>

              {/* Car Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold font-serif text-white group-hover:text-amber-400 transition-colors duration-300">
                    {car.name}
                  </h2>
                  <p className="text-xs text-zinc-400 font-sans tracking-wide mt-1 mb-6">
                    {car.nameEn}
                  </p>

                  {/* Specs Badges Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6 text-xs text-zinc-300">
                    {/* سنة الصنع */}
                    <div className="bg-zinc-800/50 border border-white/5 rounded-xl p-2.5 text-zinc-300 flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-400">سنة الصنع</span>
                        <span className="font-semibold text-white">{car.specs.year}</span>
                      </div>
                    </div>

                    {/* سعة المحرك */}
                    <div className="bg-zinc-800/50 border border-white/5 rounded-xl p-2.5 text-zinc-300 flex items-center gap-2.5">
                      <Gauge className="w-4 h-4 text-amber-400 shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-400">سعة المحرك</span>
                        <span className="font-semibold text-white">{car.specs.engine}</span>
                      </div>
                    </div>

                    {/* ناقل الحركة */}
                    <div className="bg-zinc-800/50 border border-white/5 rounded-xl p-2.5 text-zinc-300 flex items-center gap-2.5">
                      <Sliders className="w-4 h-4 text-amber-400 shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-400">ناقل الحركة</span>
                        <span className="font-semibold text-white">{car.specs.transmission}</span>
                      </div>
                    </div>

                    {/* نوع الوقود */}
                    <div className="bg-zinc-800/50 border border-white/5 rounded-xl p-2.5 text-zinc-300 flex items-center gap-2.5">
                      <Fuel className="w-4 h-4 text-amber-400 shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[10px] text-zinc-400">نوع الوقود</span>
                        <span className="font-semibold text-white">{car.specs.fuel}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct WhatsApp Action Button */}
                <a
                  href={getWhatsAppUrl(car.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl py-3 px-4 flex items-center justify-center gap-2 transition-colors w-full text-sm group/btn"
                >
                  <MessageCircle className="w-4 h-4 fill-current group-hover/btn:scale-110 transition-transform" />
                  <span>استفسر عبر واتساب</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shared Luxury Footer */}
      <footer className="relative z-10 w-full border-t border-white/10 bg-zinc-950 py-10 px-4 sm:px-6 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-sm text-zinc-400">
          {/* Brand Info */}
          <div className="space-y-2 text-right">
            <h2 className="text-lg font-bold text-white tracking-wider font-serif">
              ABOUD CARS <span className="text-amber-400 text-sm font-sans mr-2">| عبود للسيارات</span>
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              معرض السيارات الفاخرة والأحدث في دمشق. أسلوب فاخر وتجربة شحن وبيع لا مثيل لها.
            </p>
          </div>

          {/* Location & Quick Info */}
          <div className="flex flex-col items-start md:items-center space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>دمشق - سوريا (Damascus, Syria)</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400" />
              <span dir="ltr">+963 900 000 000</span>
            </div>
          </div>

          {/* Copyright & Disclaimer */}
          <div className="text-right md:text-left space-y-1">
            <p className="text-xs text-zinc-500">
              &copy; {new Date().getFullYear()} Aboud Cars. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center gap-1 text-[11px] text-amber-400/80 justify-start md:justify-end">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>فخامة لا تُضاهى، جودة مضمونة</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
