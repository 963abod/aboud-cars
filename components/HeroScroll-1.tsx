"use client";

import { useEffect, useRef } from "react";

export default function HeroScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const introOverlayRef = useRef<HTMLDivElement>(null);
  const salesOverlayRef = useRef<HTMLDivElement>(null);
  const rentOverlayRef = useRef<HTMLDivElement>(null);
  const outroOverlayRef = useRef<HTMLDivElement>(null);

  const totalFrames = 480;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", {
      alpha: false,
      desynchronized: true,
    });
    if (!ctx) return;

    const images: Array<HTMLImageElement | null> = new Array(totalFrames).fill(null);
    const loading = new Set<number>();
    const failed = new Set<number>();

    let destroyed = false;
    let targetFrame = 0;
    let renderedFrame = -1;
    let rafId = 0;
    let resizeRafId = 0;
    let preloadTimer = 0;
    let lastPreloadFrame = -999;
    let canvasWidth = 1;
    let canvasHeight = 1;
    let dpr = 1;
    let lastProgress = -1;

    const isMobile = () => window.innerWidth < 768;

    const resizeCanvas = () => {
      if (destroyed) return;

      const rect = canvas.getBoundingClientRect();
      canvasWidth = Math.max(1, Math.round(rect.width));
      canvasHeight = Math.max(1, Math.round(rect.height));

      // Lower DPR on phones = much less GPU work while keeping the image sharp.
      const maxDpr = isMobile() ? 1.25 : 1.5;
      dpr = Math.min(window.devicePixelRatio || 1, maxDpr);

      const pixelWidth = Math.max(1, Math.round(canvasWidth * dpr));
      const pixelHeight = Math.max(1, Math.round(canvasHeight * dpr));

      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      renderedFrame = -1;
    };

    const drawImage = (img: HTMLImageElement) => {
      if (!img.complete || !img.naturalWidth || !img.naturalHeight) return;

      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      // Cover keeps the hero full-screen. On mobile, slightly reduce the crop
      // so the car remains more visible instead of becoming oversized.
      let scale = Math.max(canvasWidth / iw, canvasHeight / ih);

      if (isMobile()) {
        scale *= 0.90;
      }

      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (canvasWidth - dw) / 2;
      let dy = (canvasHeight - dh) / 2;

      if (isMobile()) {
        dy -= canvasHeight * 0.015;
      }

      ctx.fillStyle = "#0A0A0C";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    const findNearestLoaded = (wanted: number) => {
      if (images[wanted]?.complete && images[wanted]?.naturalWidth) return wanted;

      // Search close to the requested frame first. This prevents black frames
      // when the user scrolls faster than the network can load images.
      for (let distance = 1; distance <= 24; distance++) {
        const left = wanted - distance;
        const right = wanted + distance;

        if (
          left >= 0 &&
          images[left]?.complete &&
          images[left]?.naturalWidth
        ) {
          return left;
        }

        if (
          right < totalFrames &&
          images[right]?.complete &&
          images[right]?.naturalWidth
        ) {
          return right;
        }
      }

      return -1;
    };

    const renderFrame = (wanted: number) => {
      if (destroyed) return;

      const safe = Math.max(0, Math.min(totalFrames - 1, Math.round(wanted)));
      const actual = findNearestLoaded(safe);
      if (actual < 0) return;

      // Don't redraw the same frame unless resize invalidated the canvas.
      if (renderedFrame === actual) return;

      const img = images[actual];
      if (!img) return;

      drawImage(img);
      renderedFrame = actual;
    };

    const loadFrame = (index: number) => {
      if (destroyed || index < 0 || index >= totalFrames) return;
      if (images[index] || loading.has(index) || failed.has(index)) return;

      loading.add(index);
      const img = new Image();
      img.decoding = "async";

      img.onload = () => {
        loading.delete(index);
        if (destroyed) return;

        images[index] = img;

        // Draw immediately if this frame is the current target.
        if (index === targetFrame) {
          renderedFrame = -1;
          renderFrame(targetFrame);
        }
      };

      img.onerror = () => {
        loading.delete(index);
        failed.add(index);
      };

      img.src = `/frames/frame_${String(index + 1).padStart(4, "0")}.jpg`;
    };

    const preloadAround = (center: number, force = false) => {
      if (destroyed) return;

      const distance = Math.abs(center - lastPreloadFrame);
      if (!force && distance < (isMobile() ? 5 : 8)) return;
      lastPreloadFrame = center;

      const ahead = isMobile() ? 12 : 16;
      const behind = isMobile() ? 4 : 6;

      // Current frame first.
      loadFrame(center);

      // Ahead first because normal scrolling moves forward.
      for (let i = 1; i <= ahead; i++) loadFrame(center + i);
      for (let i = 1; i <= behind; i++) loadFrame(center - i);
    };

    const schedulePreload = (center: number) => {
      if (preloadTimer) return;
      preloadTimer = window.setTimeout(() => {
        preloadTimer = 0;
        preloadAround(center);
      }, 60);
    };

    const updateOverlays = (progress: number) => {
      if (introOverlayRef.current) {
        const opacity = Math.max(1 - progress / 0.14, 0);
        introOverlayRef.current.style.opacity = `${opacity}`;
        introOverlayRef.current.style.transform =
          `translate3d(0, -${(1 - opacity) * 30}px, 0)`;
        introOverlayRef.current.style.pointerEvents =
          opacity > 0.05 ? "auto" : "none";
      }

      if (salesOverlayRef.current) {
        let opacity = 0;
        if (progress >= 0.25 && progress <= 0.44) {
          opacity =
            progress < 0.34
              ? (progress - 0.25) / 0.09
              : (0.44 - progress) / 0.10;
        }
        opacity = Math.min(Math.max(opacity, 0), 1);
        salesOverlayRef.current.style.opacity = `${opacity}`;
        salesOverlayRef.current.style.transform =
          `translate3d(0, ${opacity > 0 ? (1 - opacity) * 20 : 20}px, 0)`;
      }

      if (rentOverlayRef.current) {
        let opacity = 0;
        if (progress >= 0.50 && progress <= 0.70) {
          opacity =
            progress < 0.60
              ? (progress - 0.50) / 0.10
              : (0.70 - progress) / 0.10;
        }
        opacity = Math.min(Math.max(opacity, 0), 1);
        rentOverlayRef.current.style.opacity = `${opacity}`;
        rentOverlayRef.current.style.transform =
          `translate3d(0, ${opacity > 0 ? (1 - opacity) * 20 : 20}px, 0)`;
      }

      if (outroOverlayRef.current) {
        const opacity = Math.max((progress - 0.84) / 0.16, 0);
        outroOverlayRef.current.style.opacity = `${opacity}`;
        outroOverlayRef.current.style.transform =
          `translate3d(0, ${(1 - opacity) * 25}px, 0)`;
        outroOverlayRef.current.style.pointerEvents =
          opacity > 0.05 ? "auto" : "none";
      }
    };

    const updateScroll = () => {
      if (destroyed) return;

      const rect = container.getBoundingClientRect();
      const totalScrollable = container.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const progress = Math.min(
        Math.max(-rect.top / totalScrollable, 0),
        1
      );

      // Skip tiny scroll changes. This saves work on mobile.
      if (Math.abs(progress - lastProgress) < 0.0005) return;
      lastProgress = progress;

      updateOverlays(progress);

      // Sequence uses most of the hero, while keeping a short intro/outro.
      const sequenceStart = 0.06;
      const sequenceEnd = 0.94;
      const sequenceProgress = Math.min(
        Math.max((progress - sequenceStart) / (sequenceEnd - sequenceStart), 0),
        1
      );

      targetFrame = Math.min(
        totalFrames - 1,
        Math.floor(sequenceProgress * (totalFrames - 1))
      );

      schedulePreload(targetFrame);

      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          rafId = 0;
          renderFrame(targetFrame);
        });
      }
    };

    const handleScroll = () => updateScroll();

    const handleResize = () => {
      if (resizeRafId) cancelAnimationFrame(resizeRafId);

      resizeRafId = requestAnimationFrame(() => {
        resizeRafId = 0;
        resizeCanvas();
        renderedFrame = -1;
        renderFrame(targetFrame);
        updateScroll();
      });
    };

    resizeCanvas();

    // Load a small startup batch only. The previous implementation could start
    // dozens of requests on every scroll event, which caused mobile stutter.
    const startupCount = isMobile() ? 10 : 14;
    for (let i = 0; i < startupCount; i++) loadFrame(i);

    preloadAround(0, true);
    updateScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("orientationchange", handleResize, { passive: true });

    return () => {
      destroyed = true;

      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);

      if (rafId) cancelAnimationFrame(rafId);
      if (resizeRafId) cancelAnimationFrame(resizeRafId);
      if (preloadTimer) window.clearTimeout(preloadTimer);

      images.forEach((img) => {
        if (img) {
          img.onload = null;
          img.onerror = null;
        }
      });
    };
  }, []);

  return (
    <section
      ref={containerRef}
      style={{
        position: "relative",
        // Shorter than the old 600vh. Mobile gets a shorter cinematic sequence.
        height: "300vh",
        backgroundColor: "#0A0A0C",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.85) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* INTRO */}
        <div
          ref={introOverlayRef}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "50px 16px 36px 16px",
            textAlign: "center",
            zIndex: 10,
            boxSizing: "border-box",
            willChange: "transform, opacity",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "8px",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#e5e7eb",
                backgroundColor: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.15)",
                padding: "4px 14px",
                borderRadius: "9999px",
                marginBottom: "12px",
              }}
            >
              الفخامة والأداء
            </span>
            <h1
              style={{
                fontSize: "clamp(2.2rem, 7vw, 3.8rem)",
                fontWeight: 800,
                color: "#ffffff",
                margin: 0,
                textShadow: "0 2px 10px rgba(0,0,0,0.6)",
              }}
            >
              Aboud Cars
            </h1>
            <p
              style={{
                fontSize: "clamp(0.85rem, 3.5vw, 1.05rem)",
                color: "#d1d5db",
                marginTop: "8px",
                maxWidth: "340px",
                lineHeight: 1.5,
              }}
            >
              بوابتك نحو أقوى وأفخم السيارات العالمية بأعلى معايير الجودة
            </p>
          </div>

          {/* COUNTERS */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              maxWidth: "440px",
              backgroundColor: "rgba(10,10,12,0.65)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "18px",
              padding: "16px 10px",
              direction: "rtl",
              boxSizing: "border-box",
            }}
          >
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: "1.6rem", fontWeight: "bold", color: "#ffffff", lineHeight: 1.2 }}>
                +200
              </div>
              <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "4px" }}>
                سيارة فاخرة
              </div>
            </div>

            <div style={{ width: "1px", height: "36px", backgroundColor: "rgba(255,255,255,0.15)" }} />

            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: "1.6rem", fontWeight: "bold", color: "#fbbf24", lineHeight: 1.2 }}>
                95%
              </div>
              <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "4px" }}>
                نسبة الثقة والرضا
              </div>
            </div>

            <div style={{ width: "1px", height: "36px", backgroundColor: "rgba(255,255,255,0.15)" }} />

            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: "1.6rem", fontWeight: "bold", color: "#ffffff", lineHeight: 1.2 }}>
                100%
              </div>
              <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "4px" }}>
                فحص وضمان فني
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
              color: "#9ca3af",
              fontSize: "12px",
            }}
          >
            <span>مرر للأسفل لاكتشاف التفاصيل</span>
            <svg style={{ width: "20px", height: "20px", color: "#ffffff" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        {/* SALES */}
        <div
          ref={salesOverlayRef}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 10,
            pointerEvents: "none",
            opacity: 0,
            boxSizing: "border-box",
            willChange: "transform, opacity",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(10,10,12,0.82)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "22px",
              padding: "24px 20px",
              maxWidth: "380px",
              width: "100%",
              textAlign: "center",
              direction: "rtl",
            }}
          >
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#fbbf24", letterSpacing: "1px" }}>
              مبيعات السيارات الفاخرة
            </span>
            <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#fff", margin: "8px 0 6px" }}>
              امتلك الأداء الذي تستحقه
            </h2>
            <p style={{ fontSize: "0.85rem", color: "#d1d5db", lineHeight: 1.6, margin: 0 }}>
              نوفر لك نخبة السيارات الرياضية والأوروبية بأعلى درجات الفحص الفني والضمان المعتمد، مع تسهيلات كاملة للإجراءات.
            </p>
          </div>
        </div>

        {/* RENT */}
        <div
          ref={rentOverlayRef}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 10,
            pointerEvents: "none",
            opacity: 0,
            boxSizing: "border-box",
            willChange: "transform, opacity",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(10,10,12,0.82)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "22px",
              padding: "24px 20px",
              maxWidth: "380px",
              width: "100%",
              textAlign: "center",
              direction: "rtl",
            }}
          >
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#38bdf8", letterSpacing: "1px" }}>
              خدمات التأجير الفارهة VIP
            </span>
            <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#fff", margin: "8px 0 6px" }}>
              تأجير يومي وشهري فاخر
            </h2>
            <p style={{ fontSize: "0.85rem", color: "#d1d5db", lineHeight: 1.6, margin: 0 }}>
              أسطول مخصص لرجال الأعمال والمناسبات الخاصة، تسليم فوري مع خيارات قيادة خاصة أو مع سائق محترف.
            </p>
          </div>
        </div>

        {/* OUTRO */}
        <div
          ref={outroOverlayRef}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingBottom: "60px",
            paddingLeft: "20px",
            paddingRight: "20px",
            textAlign: "center",
            zIndex: 10,
            pointerEvents: "none",
            opacity: 0,
            boxSizing: "border-box",
            willChange: "transform, opacity",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(10,10,12,0.84)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "24px",
              padding: "24px 20px",
              maxWidth: "400px",
              width: "100%",
              boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
              boxSizing: "border-box",
            }}
          >
            <h3 style={{ fontSize: "1.35rem", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>
              جاهز لاختيار سيارتك القادمة؟
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#9ca3af", margin: "0 0 20px" }}>
              استعرض أحدث الموديلات المتوفرة لدينا واطلب تجربة القيادة فوراً
            </p>

            <a
              href="#showroom"
              onClick={(e) => {
                const target = document.getElementById("showroom");
                if (target) {
                  e.preventDefault();
                  target.scrollIntoView({ behavior: "smooth" });
                }
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                padding: "14px 20px",
                borderRadius: "14px",
                backgroundColor: "#ffffff",
                color: "#000000",
                fontWeight: 700,
                fontSize: "0.95rem",
                textDecoration: "none",
                boxSizing: "border-box",
                cursor: "pointer",
              }}
            >
              <span>دخول معرض السيارات</span>
              <svg style={{ width: "18px", height: "18px", marginRight: "8px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
