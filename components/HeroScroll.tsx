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

    const images: (HTMLImageElement | null)[] = new Array(totalFrames).fill(
      null
    );

    let currentFrame = 0;
    let renderedFrame = -1;
    let targetFrame = 0;

    let rafId = 0;
    let resizeRafId = 0;
    let destroyed = false;

    let canvasWidth = 0;
    let canvasHeight = 0;
    let dpr = 1;

    // ------------------------------------------------------------
    // Canvas sizing
    // ------------------------------------------------------------

    const resizeCanvas = () => {
      if (destroyed) return;

      const rect = canvas.getBoundingClientRect();

      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));

      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvasWidth = width;
      canvasHeight = height;

      const pixelWidth = Math.round(width * dpr);
      const pixelHeight = Math.round(height * dpr);

      if (
        canvas.width !== pixelWidth ||
        canvas.height !== pixelHeight
      ) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }

      // الرسم بوحدة CSS pixels
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      renderedFrame = -1;
    };

    // ------------------------------------------------------------
    // Draw image - responsive cover
    // ------------------------------------------------------------

    const drawImageCover = (img: HTMLImageElement) => {
      if (!img.naturalWidth || !img.naturalHeight) return;

      const imageWidth = img.naturalWidth;
      const imageHeight = img.naturalHeight;

      const scale = Math.max(
        canvasWidth / imageWidth,
        canvasHeight / imageHeight
      );

      const drawWidth = imageWidth * scale;
      const drawHeight = imageHeight * scale;

      let offsetX = (canvasWidth - drawWidth) / 2;
      let offsetY = (canvasHeight - drawHeight) / 2;

      /*
       * على الهاتف نرفع الصورة قليلًا للأعلى.
       * هذا يحافظ على السيارة داخل الكادر بدل قص الجزء المهم منها.
       */
      if (canvasWidth < 768) {
        offsetY -= canvasHeight * 0.02;
      }

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      ctx.drawImage(
        img,
        offsetX,
        offsetY,
        drawWidth,
        drawHeight
      );
    };

    // ------------------------------------------------------------
    // Render frame
    // ------------------------------------------------------------

    const renderFrame = (index: number) => {
      if (destroyed) return;

      const safeIndex = Math.max(
        0,
        Math.min(totalFrames - 1, Math.round(index))
      );

      const img = images[safeIndex];

      if (!img || !img.complete || !img.naturalWidth) {
        return;
      }

      if (renderedFrame === safeIndex) return;

      drawImageCover(img);

      renderedFrame = safeIndex;
      currentFrame = safeIndex;
    };

    // ------------------------------------------------------------
    // Image loading
    // ------------------------------------------------------------

    const loadFrame = (index: number) => {
      if (destroyed) return;
      if (index < 0 || index >= totalFrames) return;
      if (images[index]) return;

      const img = new Image();

      img.decoding = "async";
      img.src = `/frames/frame_${String(index + 1).padStart(4, "0")}.jpg`;

      img.onload = () => {
        if (destroyed) return;

        images[index] = img;

        if (index === 0) {
          resizeCanvas();
          renderFrame(0);
        }

        // إذا هذا هو الفريم المطلوب حاليًا
        if (index === targetFrame) {
          renderFrame(index);
        }
      };

      img.onerror = () => {
        images[index] = null;
      };

      images[index] = img;
    };

    // ------------------------------------------------------------
    // Smart preloading
    // ------------------------------------------------------------

    const preloadAround = (frame: number) => {
      const range = window.innerWidth < 768 ? 12 : 20;

      // الفريم الحالي أولاً
      loadFrame(frame);

      // تحميل قريب من الفريم الحالي
      for (let i = 1; i <= range; i++) {
        loadFrame(frame + i);
        loadFrame(frame - i);
      }
    };

    // أول فريمات فقط عند البداية
    for (let i = 0; i < (window.innerWidth < 768 ? 12 : 20); i++) {
      loadFrame(i);
    }

    // ------------------------------------------------------------
    // Scroll overlays
    // ------------------------------------------------------------

    const updateOverlays = (progress: number) => {
      // Intro
      if (introOverlayRef.current) {
        const introOpacity = Math.max(1 - progress / 0.15, 0);

        introOverlayRef.current.style.opacity = `${introOpacity}`;

        introOverlayRef.current.style.transform =
          `translate3d(0, -${(1 - introOpacity) * 30}px, 0)`;

        introOverlayRef.current.style.pointerEvents =
          introOpacity > 0.05 ? "auto" : "none";
      }

      // Sales
      if (salesOverlayRef.current) {
        let op = 0;

        if (progress >= 0.22 && progress <= 0.45) {
          op =
            progress < 0.33
              ? (progress - 0.22) / 0.11
              : (0.45 - progress) / 0.12;
        }

        op = Math.min(Math.max(op, 0), 1);

        salesOverlayRef.current.style.opacity = `${op}`;

        salesOverlayRef.current.style.transform =
          `translate3d(0, ${op > 0 ? (1 - op) * 20 : 20}px, 0)`;
      }

      // Rent
      if (rentOverlayRef.current) {
        let op = 0;

        if (progress >= 0.5 && progress <= 0.73) {
          op =
            progress < 0.61
              ? (progress - 0.5) / 0.11
              : (0.73 - progress) / 0.12;
        }

        op = Math.min(Math.max(op, 0), 1);

        rentOverlayRef.current.style.opacity = `${op}`;

        rentOverlayRef.current.style.transform =
          `translate3d(0, ${op > 0 ? (1 - op) * 20 : 20}px, 0)`;
      }

      // Outro
      if (outroOverlayRef.current) {
        const outroOpacity = Math.max(
          (progress - 0.86) / 0.14,
          0
        );

        outroOverlayRef.current.style.opacity =
          `${outroOpacity}`;

        outroOverlayRef.current.style.transform =
          `translate3d(0, ${(1 - outroOpacity) * 25}px, 0)`;

        outroOverlayRef.current.style.pointerEvents =
          outroOpacity > 0.05 ? "auto" : "none";
      }
    };

    // ------------------------------------------------------------
    // Scroll calculation
    // ------------------------------------------------------------

    const updateScroll = () => {
      if (destroyed) return;

      const rect = container.getBoundingClientRect();

      const totalScrollable =
        container.offsetHeight - window.innerHeight;

      if (totalScrollable <= 0) return;

      const progress = Math.min(
        Math.max(-rect.top / totalScrollable, 0),
        1
      );

      updateOverlays(progress);

      let frameIndex = 0;

      if (progress > 0.12 && progress < 0.88) {
        const sequenceProgress =
          (progress - 0.12) / 0.76;

        frameIndex = Math.min(
          Math.floor(
            sequenceProgress * (totalFrames - 1)
          ),
          totalFrames - 1
        );
      } else if (progress >= 0.88) {
        frameIndex = totalFrames - 1;
      }

      targetFrame = frameIndex;

      /*
       * تحميل ذكي حول المكان الذي وصل إليه المستخدم.
       */
      preloadAround(frameIndex);

      /*
       * لا نرسم عشرات المرات أثناء نفس frame.
       */
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          rafId = 0;

          if (targetFrame !== currentFrame) {
            renderFrame(targetFrame);
          }
        });
      }
    };

    // ------------------------------------------------------------
    // Scroll listener
    // ------------------------------------------------------------

    const handleScroll = () => {
      updateScroll();
    };

    // ------------------------------------------------------------
    // Resize
    // ------------------------------------------------------------

    const handleResize = () => {
      if (resizeRafId) {
        cancelAnimationFrame(resizeRafId);
      }

      resizeRafId = requestAnimationFrame(() => {
        resizeCanvas();
        renderFrame(currentFrame);
        updateScroll();
      });
    };

    resizeCanvas();

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      handleResize,
      { passive: true }
    );

    /*
     * orientationchange مهم جدًا للموبايل.
     */
    window.addEventListener(
      "orientationchange",
      handleResize,
      { passive: true }
    );

    // أول تحديث
    updateScroll();

    // ------------------------------------------------------------
    // Cleanup
    // ------------------------------------------------------------

    return () => {
      destroyed = true;

      window.removeEventListener(
        "scroll",
        handleScroll
      );

      window.removeEventListener(
        "resize",
        handleResize
      );

      window.removeEventListener(
        "orientationchange",
        handleResize
      );

      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      if (resizeRafId) {
        cancelAnimationFrame(resizeRafId);
      }

      // إلغاء تحميل الصور غير الضرورية
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
        height: "600vh",
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
                backgroundColor:
                  "rgba(255,255,255,0.12)",
                border:
                  "1px solid rgba(255,255,255,0.15)",
                padding: "4px 14px",
                borderRadius: "9999px",
                marginBottom: "12px",
              }}
            >
              الفخامة والأداء
            </span>

            <h1
              style={{
                fontSize:
                  "clamp(2.2rem, 7vw, 3.8rem)",
                fontWeight: 800,
                color: "#ffffff",
                margin: 0,
                textShadow:
                  "0 2px 10px rgba(0,0,0,0.6)",
              }}
            >
              Aboud Cars
            </h1>

            <p
              style={{
                fontSize:
                  "clamp(0.85rem, 3.5vw, 1.05rem)",
                color: "#d1d5db",
                marginTop: "8px",
                maxWidth: "340px",
                lineHeight: 1.5,
              }}
            >
              بوابتك نحو أقوى وأفخم السيارات العالمية بأعلى
              معايير الجودة
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
              backgroundColor:
                "rgba(10,10,12,0.65)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border:
                "1px solid rgba(255,255,255,0.12)",
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
                backgroundColor:
                  "rgba(255,255,255,0.15)",
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
                backgroundColor:
                  "rgba(255,255,255,0.15)",
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
              style={{
                width: "20px",
                height: "20px",
                color: "#ffffff",
              }}
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
              backgroundColor:
                "rgba(10,10,12,0.72)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border:
                "1px solid rgba(255,255,255,0.12)",
              borderRadius: "22px",
              padding: "24px 20px",
              maxWidth: "380px",
              width: "100%",
              textAlign: "center",
              direction: "rtl",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#fbbf24",
                letterSpacing: "1px",
              }}
            >
              مبيعات السيارات الفاخرة
            </span>

            <h2
              style={{
                fontSize: "1.45rem",
                fontWeight: 800,
                color: "#fff",
                margin: "8px 0 6px",
              }}
            >
              امتلك الأداء الذي تستحقه
            </h2>

            <p
              style={{
                fontSize: "0.85rem",
                color: "#d1d5db",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              نوفر لك نخبة السيارات الرياضية والأوروبية بأعلى
              درجات الفحص الفني والضمان المعتمد، مع تسهيلات
              كاملة للإجراءات.
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
              backgroundColor:
                "rgba(10,10,12,0.72)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border:
                "1px solid rgba(255,255,255,0.12)",
              borderRadius: "22px",
              padding: "24px 20px",
              maxWidth: "380px",
              width: "100%",
              textAlign: "center",
              direction: "rtl",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#38bdf8",
                letterSpacing: "1px",
              }}
            >
              خدمات التأجير الفارهة VIP
                          </span>

            <h2
              style={{
                fontSize: "1.45rem",
                fontWeight: 800,
                color: "#fff",
                margin: "8px 0 6px",
              }}
            >
              تأجير يومي وشهري فاخر
            </h2>

            <p
              style={{
                fontSize: "0.85rem",
                color: "#d1d5db",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              أسطول مخصص لرجال الأعمال والمناسبات الخاصة،
              تسليم فوري مع خيارات قيادة خاصة أو مع سائق محترف.
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
              backgroundColor:
                "rgba(10,10,12,0.78)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border:
                "1px solid rgba(255,255,255,0.15)",
              borderRadius: "24px",
              padding: "24px 20px",
              maxWidth: "400px",
              width: "100%",
              boxShadow:
                "0 20px 40px rgba(0,0,0,0.6)",
              boxSizing: "border-box",
            }}
          >
            <h3
              style={{
                fontSize: "1.35rem",
                fontWeight: 700,
                color: "#fff",
                margin: "0 0 8px",
              }}
            >
              جاهز لاختيار سيارتك القادمة؟
            </h3>

            <p
              style={{
                fontSize: "0.85rem",
                color: "#9ca3af",
                margin: "0 0 20px",
              }}
            >
              استعرض أحدث الموديلات المتوفرة لدينا واطلب تجربة
              القيادة فوراً
            </p>

            <a
              href="#showroom"
              onClick={(e) => {
                const target =
                  document.getElementById("showroom");

                if (target) {
                  e.preventDefault();

                  target.scrollIntoView({
                    behavior: "smooth",
                  });
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
                  d="M14 5l7 7m0 0-7 7m7-7H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
