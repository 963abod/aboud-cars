import Link from 'next/link'
import { MapPin, Phone, Car, ArrowLeft, ShieldCheck } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0C] text-white flex flex-col justify-between selection:bg-[#D4AF37]/30 selection:text-[#D4AF37] relative overflow-hidden">
      {/* Background subtle luxury ambiance glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none rounded-full blur-3xl" />

      {/* Top Bar / Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-[#D4AF37]/40 bg-[#16161a] flex items-center justify-center text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.15)]">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-wider text-white block leading-none font-serif">
              ABOUD CARS
            </span>
            <span className="text-xs text-[#D4AF37] tracking-widest block mt-1">
              عبود للسيارات
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
          <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>دمشق - سوريا</span>
        </div>
      </header>

      {/* Center Reserved Area for Upcoming Video Scroll (Kept empty & clean) */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center my-auto">
        {/* Reserved for upcoming video scroll */}
      </section>

      {/* Bottom CTA Section */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-10 flex flex-col items-center">
        <Link
          href="/cars"
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#16161a] text-white text-lg font-medium rounded-full border border-[#D4AF37]/40 hover:border-[#D4AF37] transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>معرض السيارات</span>
          <ArrowLeft className="w-5 h-5 text-[#D4AF37] group-hover:-translate-x-1 transition-transform duration-300" />
        </Link>
      </div>

      {/* Shared Luxury Footer */}
      <footer className="relative z-10 w-full border-t border-white/10 bg-[#070709] py-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-sm text-gray-400">
          {/* Brand Info */}
          <div className="space-y-2 text-right">
            <h2 className="text-lg font-bold text-white tracking-wider font-serif">
              ABOUD CARS <span className="text-[#D4AF37] text-sm font-sans mr-2">| عبود للسيارات</span>
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              معرض السيارات الفاخرة والأحدث في دمشق. أسلوب فاخر وتجربة شحن وبيع لا مثيل لها.
            </p>
          </div>

          {/* Location & Quick Info */}
          <div className="flex flex-col items-start md:items-center space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
              <span>دمشق - سوريا (Damascus, Syria)</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#D4AF37]" />
              <span dir="ltr">+963 900 000 000</span>
            </div>
          </div>

          {/* Copyright & Disclaimer */}
          <div className="text-right md:text-left space-y-1">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Aboud Cars. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center gap-1 text-[11px] text-[#D4AF37]/80 justify-start md:justify-end">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>فخامة لا تُضاهى، جودة مضمونة</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
