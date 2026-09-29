"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Refs للتحكم بالنصوص بسلاسة 60fps بدون إعادة تصيير الصفحة
  const introOverlayRef = useRef<HTMLDivElement>(null);
  const midOverlayRef = useRef<HTMLDivElement>(null);
  const outroOverlayRef = useRef<HTMLDivElement>(null);

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const totalFrames = 480;

  // تحميل الصور المسبق
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = `/frames/frame_${String(i).padStart(4, "0")}.jpg`;
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  // التحكم بالكانفاس وحركة السكرول
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || images.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const renderFrame = (index: number) => {
      const img = images[index];
      if (!img || !img.complete) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;

      if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      // تغطية كاملة ومتناسقة للموبايل والكمبيوتر (Cover)
      const hRatio = displayWidth / img.width;
      const vRatio = displayHeight / img.height;
      const ratio = Math.max(hRatio, vRatio);

      const centerShiftX = (displayWidth - img.width * ratio) / 2;
      const centerShiftY = (displayHeight - img.height * ratio) / 2;

      ctx.clearRect(0, 0, displayWidth, displayHeight);
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        centerShiftX,
        centerShiftY,
        img.width * ratio,
        img.height * ratio
      );
      ctx.restore();
    };

    let animationFrameId: number;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const totalScrollable = container.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const progress = Math.min(Math.max(-rect.top / totalScrollable, 0), 1);

      // 1. أول 15% من السكرول: شاشة البداية الثابتة والعدادات
      if (introOverlayRef.current) {
        const introOpacity = Math.max(1 - progress / 0.15, 0);
        introOverlayRef.current.style.opacity = `${introOpacity}`;
        introOverlayRef.current.style.transform = `translateY(-${(1 - introOpacity) * 40}px)`;
        introOverlayRef.current.style.pointerEvents = introOpacity > 0.1 ? "auto" : "none";
      }

      // 2. من 15% إلى 85%: يبدأ تسلسل الصور بحركة سلسة
      let frameIndex = 0;
      if (progress > 0.15 && progress < 0.85) {
        const sequenceProgress = (progress - 0.15) / 0.7;
        frameIndex = Math.min(
          Math.floor(sequenceProgress * (totalFrames - 1)),
          totalFrames - 1
        );
      } else if (progress >= 0.85) {
        frameIndex = totalFrames - 1;
      }

      // نص مميز بمنتصف السكرول
      if (midOverlayRef.current) {
        let midOpacity = 0;
        if (progress >= 0.4 && progress <= 0.6) {
          midOpacity = 1 - Math.abs(progress - 0.5) / 0.1;
        }
        midOverlayRef.current.style.opacity = `${Math.max(midOpacity, 0)}`;
        midOverlayRef.current.style.transform = `translateY(${midOpacity > 0 ? (1 - midOpacity) * 20 : 20}px)`;
      }

      // 3. آخر 15%: ظهور زر المعرض والختام
      if (outroOverlayRef.current) {
        const outroOpacity = Math.max((progress - 0.85) / 0.15, 0);
        outroOverlayRef.current.style.opacity = `${outroOpacity}`;
        outroOverlayRef.current.style.transform = `translateY(${(1 - outroOpacity) * 30}px)`;
        outroOverlayRef.current.style.pointerEvents = outroOpacity > 0.1 ? "auto" : "none";
      }

      animationFrameId = requestAnimationFrame(() => renderFrame(frameIndex));
    };

    renderFrame(0);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [images]);

  return (
    <section ref={containerRef} className="relative h-[550vh] bg-[#0A0A0C]">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* الكانفاس التفاعلي */}
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* طبقة تظليل خفيفة جداً لتحسين وضوح النصوص */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 pointer-events-none" />

        {/* 1. واجهة البداية: اسم الشركة، العدادات، والتفاصيل */}
        <div
          ref={introOverlayRef}
          className="absolute inset-0 flex flex-col items-center justify-between py-16 px-6 text-center z-10 transition-transform duration-75"
        >
          <div className="pt-8 flex flex-col items-center">
            <span className="px-3.5 py-1 rounded-full text-xs font-medium tracking-wider uppercase bg-white/10 text-neutral-300 backdrop-blur-md border border-white/10 mb-4">
              الفخامة والأداء
            </span>
            <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-lg">
              Aboud Cars
            </h1>
            <p className="mt-3 text-neutral-300 text-sm md:text-lg max-w-md">
              بوابتك نحو أقوى وأفخم السيارات العالمية بأعلى معايير الجودة
            </p>
          </div>

          {/* العدادات والإحصائيات */}
          <div className="w-full max-w-2xl grid grid-cols-3 gap-3 md:gap-6 bg-black/40 backdrop-blur-md p-4 md:p-6 rounded-2xl border border-white/10">
            <div>
              <p className="text-2xl md:text-4xl font-bold text-white tracking-tight">+200</p>
              <p className="text-[11px] md:text-sm text-neutral-400 mt-1 font-medium">سيارة فاخرة</p>
            </div>
            <div className="border-x border-white/10">
              <p className="text-2xl md:text-4xl font-bold text-amber-400 tracking-tight">95%</p>
              <p className="text-[11px] md:text-sm text-neutral-400 mt-1 font-medium">نسبة الثقة والرضا</p>
            </div>
            <div>
              <p className="text-2xl md:text-4xl font-bold text-white tracking-tight">100%</p>
              <p className="text-[11px] md:text-sm text-neutral-400 mt-1 font-medium">فحص وضمان فني</p>
            </div>
          </div>

          {/* مؤشر التمرير */}
          <div className="flex flex-col items-center gap-2 opacity-80 animate-pulse">
            <span className="text-xs text-neutral-400">مرر للأسفل لاكتشاف التفاصيل</span>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        {/* 2. نص تفاعلي بمنتصف الرحلة */}
        <div
          ref={midOverlayRef}
          style={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center text-center px-4 pointer-events-none z-10"
        >
          <div className="bg-black/40 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
            <h2 className="text-2xl md:text-5xl font-bold text-white drop-shadow-md">
              هندسة تفوق التوقعات
            </h2>
            <p className="mt-2 text-xs md:text-sm text-neutral-300">
              دقة في التفاصيل، وقوة تمنحك الثقة على الطريق
            </p>
          </div>
        </div>

        {/* 3. واجهة النهاية: زر معرض السيارات */}
        <div
          ref={outroOverlayRef}
          style={{ opacity: 0 }}
          className="absolute inset-0 flex flex-col items-center justify-end pb-20 px-6 text-center z-10 pointer-events-none"
        >
          <div className="bg-black/60 backdrop-blur-lg p-6 md:p-8 rounded-3xl border border-white/10 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              جاهز لاختيار سيارتك القادمة؟
            </h3>
            <p className="text-neutral-400 text-xs md:text-sm mb-6">
              استعرض أحدث الموديلات المتوفرة لدينا واطلب تجربة القيادة فوراً
            </p>
            <a
              href="#showroom"
              className="inline-flex items-center justify-center w-full py-3.5 px-6 rounded-xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-colors shadow-lg active:scale-95 duration-150"
            >
              دخول معرض السيارات
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
