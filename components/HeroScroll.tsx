"use client";

import { useEffect, useRef } from "react";

export default function HeroScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const introOverlayRef = useRef<HTMLDivElement>(null);
  const outroOverlayRef = useRef<HTMLDivElement>(null);

  const totalFrames = 480;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const images: HTMLImageElement[] = [];
    let lastRenderedIndex = 0;

    const renderFrame = (index: number) => {
      const img = images[index];
      const targetImg =
        img && img.complete
          ? img
          : images[lastRenderedIndex] && images[lastRenderedIndex].complete
          ? images[lastRenderedIndex]
          : null;

      if (!targetImg) return;
      lastRenderedIndex = img && img.complete ? index : lastRenderedIndex;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;

      if (
        canvas.width !== displayWidth * dpr ||
        canvas.height !== displayHeight * dpr
      ) {
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      const hRatio = displayWidth / targetImg.width;
      const vRatio = displayHeight / targetImg.height;
      const ratio = Math.max(hRatio, vRatio);

      const centerShiftX = (displayWidth - targetImg.width * ratio) / 2;
      const centerShiftY = (displayHeight - targetImg.height * ratio) / 2;

      ctx.clearRect(0, 0, displayWidth, displayHeight);
      ctx.drawImage(
        targetImg,
        0,
        0,
        targetImg.width,
        targetImg.height,
        centerShiftX,
        centerShiftY,
        targetImg.width * ratio,
        targetImg.height * ratio
      );
      ctx.restore();
    };

    // تحميل الفريمات وضمان رسم أول فريم فور وصوله
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = `/frames/frame_${String(i).padStart(4, "0")}.jpg`;
      if (i === 1) {
        img.onload = () => renderFrame(0);
      }
      images.push(img);
    }

    if (images[0] && images[0].complete) {
      renderFrame(0);
    }

    let animationFrameId: number;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const totalScrollable = container.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const progress = Math.min(Math.max(-rect.top / totalScrollable, 0), 1);

      // الواجهة الأولى: تختفي مع أول 18% سكرول
      if (introOverlayRef.current) {
        const introOpacity = Math.max(1 - progress / 0.18, 0);
        introOverlayRef.current.style.opacity = `${introOpacity}`;
        introOverlayRef.current.style.transform = `translateY(-${(1 - introOpacity) * 35}px)`;
        introOverlayRef.current.style.pointerEvents =
          introOpacity > 0.05 ? "auto" : "none";
      }

      // تسلسل الفريمات: من 15% حتى 90%
      let frameIndex = 0;
      if (progress > 0.15 && progress < 0.9) {
        const sequenceProgress = (progress - 0.15) / 0.75;
        frameIndex = Math.min(
          Math.floor(sequenceProgress * (totalFrames - 1)),
          totalFrames - 1
        );
      } else if (progress >= 0.9) {
        frameIndex = totalFrames - 1;
      }

      // الواجهة الأخيرة (زر المعرض): تظهر بآخر 12%
      if (outroOverlayRef.current) {
        const outroOpacity = Math.max((progress - 0.88) / 0.12, 0);
        outroOverlayRef.current.style.opacity = `${outroOpacity}`;
        outroOverlayRef.current.style.transform = `translateY(${(1 - outroOpacity) * 25}px)`;
        outroOverlayRef.current.style.pointerEvents =
          outroOpacity > 0.05 ? "auto" : "none";
      }

      animationFrameId = requestAnimationFrame(() => renderFrame(frameIndex));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", () => {
      renderFrame(lastRenderedIndex);
      handleScroll();
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      style={{
        position: "relative",
        height: "500vh",
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
        {/* الكانفاس */}
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />

        {/* تظليل ناعم لضمان قراءة النصوص فوق ألوان السيارة */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.8) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* واجهة البداية: الاسم + العدادات مرتبة أفقياً */}
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
            transition: "opacity 0.1s ease-out, transform 0.1s ease-out",
          }}
        >
          {/* العنوان */}
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
                backgroundColor: "rgba(255, 255, 255, 0.12)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
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

          {/* بطاقة العدادات أفقياً */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              maxWidth: "440px",
              backgroundColor: "rgba(10, 10, 12, 0.65)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "18px",
              padding: "16px 10px",
              direction: "rtl",
              boxSizing: "border-box",
            }}
          >
            <div style={{ flex: 1, textAlign: "center" }}>
              <div
                style={{
                  fontSize: "1.6rem",
                  fontWeight: "bold",
                  color: "#ffffff",
                  lineHeight: 1.2,
                }}
              >
                +200
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#9ca3af",
                  marginTop: "4px",
                }}
              >
                سيارة فاخرة
              </div>
            </div>

            <div
              style={{
                width: "1px",
                height: "36px",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
              }}
            />

            <div style={{ flex: 1, textAlign: "center" }}>
              <div
                style={{
                  fontSize: "1.6rem",
                  fontWeight: "bold",
                  color: "#fbbf24",
                  lineHeight: 1.2,
                }}
              >
                95%
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#9ca3af",
                  marginTop: "4px",
                }}
              >
                نسبة الثقة والرضا
              </div>
            </div>

            <div
              style={{
                width: "1px",
                height: "36px",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
              }}
            />

            <div style={{ flex: 1, textAlign: "center" }}>
              <div
                style={{
                  fontSize: "1.6rem",
                  fontWeight: "bold",
                  color: "#ffffff",
                  lineHeight: 1.2,
                }}
              >
                100%
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "#9ca3af",
                  marginTop: "4px",
                }}
              >
                فحص وضمان فني
              </div>
            </div>
          </div>

          {/* مؤشر التمرير */}
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
            <svg
              style={{ width: "20px", height: "20px", color: "#ffffff" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>

        {/* واجهة النهاية: زر معرض السيارات */}
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
            transition: "opacity 0.15s ease-out, transform 0.15s ease-out",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(10, 10, 12, 0.75)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "24px",
              padding: "24px 20px",
              maxWidth: "400px",
              width: "100%",
              boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
              boxSizing: "border-box",
            }}
          >
            <h3
              style={{
                fontSize: "1.35rem",
                fontWeight: 700,
                color: "#fff",
                margin: "0 0 8px 0",
              }}
            >
              جاهز لاختيار سيارتك القادمة؟
            </h3>
            <p
              style={{
                fontSize: "0.85rem",
                color: "#9ca3af",
                margin: "0 0 20px 0",
              }}
            >
              استعرض أحدث الموديلات المتوفرة لدينا واطلب تجربة القيادة فوراً
            </p>
            <a
              href="#showroom"
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
              }}
            >
              <span>دخول معرض السيارات</span>
              <svg
                style={{
                  width: "18px",
                  height: "18px",
                  marginRight: "8px",
                }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
