/**
 * Clients — شريط لوغوهات العملاء الذين عملنا معهم
 * Auto-scrolling infinite marquee — no JS required (CSS animation).
 */

const LOGOS = [
  { src: "/client-malabar.png",   alt: "Malabar Gold & Diamonds", width: 140 },
  { src: "/client-herman.png",    alt: "Herman",                  width: 120 },
  { src: "/client-moneygram.png", alt: "MoneyGram",               width: 140 },
  { src: "/client-sadia.png",     alt: "Sadia",                   width: 120 },
  { src: "/client-saha.png",      alt: "SAHA",                    width: 110 },
  { src: "/client-tabby.svg",     alt: "Tabby",                   width: 110 },
  { src: "/client-takamol.svg",   alt: "Takamol",                 width: 110 },
  { src: "/client-geidea.svg",    alt: "Geidea",                  width: 130 },
  { src: "/client-space42.svg",   alt: "Space42",                 width: 120 },
  { src: "/client-logo5.svg",     alt: "Client",                  width: 130 },
];

export function Clients() {
  // Triplicate so the marquee loops seamlessly
  const items = [...LOGOS, ...LOGOS, ...LOGOS];

  return (
    <section className="py-14 bg-white border-y border-[#F3F4F6] overflow-hidden">
      <div className="container mx-auto px-6 mb-8 text-center">
        <p className="text-xs font-bold tracking-widest text-[#9CA3AF] uppercase mb-1">Trusted by</p>
        <h2 className="text-2xl md:text-3xl font-black text-[#111827] mb-2">
          عملاء <span className="text-[#CC0000]">وثقوا</span> بنا
        </h2>
        <p className="text-[#6B7280] text-sm md:text-base">
          نحن نعمل مع الشركات العالمية العملاقة والشركات الناشئة الصاعدة
        </p>
      </div>

      {/* Marquee track */}
      <div className="relative w-full">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-white to-transparent" />

        <div className="flex clients-marquee">
          {items.map((logo, i) => (
            <div
              key={i}
              className="shrink-0 mx-6 flex items-center justify-center px-6 py-3 rounded-xl bg-[#F5F5F5] border border-[#E5E7EB] grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={48}
                className="h-10 w-auto object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .clients-marquee {
          animation: clients-scroll 28s linear infinite;
          width: max-content;
        }
        .clients-marquee:hover {
          animation-play-state: paused;
        }
        @keyframes clients-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
      `}</style>
    </section>
  );
}
