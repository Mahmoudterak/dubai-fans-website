/**
 * TrustedBy — infinite-scroll client logo marquee
 * "عملاء وثقوا بنا" section for the home page.
 */

const clients = [
  { src: "/client-geidea.svg",    alt: "Geidea",      name: "Geidea" },
  { src: "/client-herman.png",    alt: "Herman",       name: "Herman" },
  { src: "/client-malabar.png",   alt: "Malabar",      name: "Malabar Gold" },
  { src: "/client-moneygram.png", alt: "MoneyGram",    name: "MoneyGram" },
  { src: "/client-sadia.png",     alt: "Sadia",        name: "Sadia" },
  { src: "/client-saha.png",      alt: "Saha",         name: "Saha" },
  { src: "/client-space42.svg",   alt: "Space42",      name: "Space42" },
  { src: "/client-tabby.svg",     alt: "Tabby",        name: "Tabby" },
  { src: "/client-takamol.svg",   alt: "Takamol",      name: "Takamol" },
  { src: "/client-logo5.svg",     alt: "Partner",      name: "Partner" },
  { src: "/sameday-dental-logo.jpg", alt: "SameDay Dental", name: "SameDay Dental" },
  { src: "/health-factory-logo.jpg", alt: "Health Factory", name: "Health Factory" },
];

export function TrustedBy() {
  return (
    <section className="py-16 bg-[#0A0A18] overflow-hidden" dir="rtl">
      {/* Keyframe style */}
      <style>{`
        @keyframes marquee-rtl {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-rtl 32s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Heading */}
      <div className="text-center mb-10 px-6">
        <p className="text-[#CC0000] text-xs font-bold uppercase tracking-widest mb-2">Trusted by</p>
        <h2 className="text-2xl md:text-3xl font-black text-white leading-snug">
          عملاء وثقوا بنا
        </h2>
        <p className="text-[#9CA3AF] text-sm mt-2 max-w-lg mx-auto">
          نحن نعمل مع الشركات العالمية العملاقة والشركات الناشئة الصاعدة
        </p>
      </div>

      {/* Fade masks */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10"
          style={{ background: "linear-gradient(to left, #0A0A18, transparent)" }} />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10"
          style={{ background: "linear-gradient(to right, #0A0A18, transparent)" }} />

        {/* Scrolling track — duplicate list for seamless loop */}
        <div className="marquee-track">
          {[...clients, ...clients].map((c, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center mx-6 shrink-0 group"
              style={{ width: 110 }}
            >
              <div className="w-20 h-16 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:border-[#CC0000]/40 group-hover:bg-white/10 transition-all duration-300 p-2">
                <img
                  src={c.src}
                  alt={c.alt}
                  className="max-w-full max-h-full object-contain filter brightness-75 group-hover:brightness-110 transition-all duration-300"
                  loading="lazy"
                />
              </div>
              <span className="mt-2 text-[10px] text-[#6B7280] group-hover:text-[#9CA3AF] transition-colors text-center leading-tight font-medium">
                {c.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats strip */}
      <div className="mt-12 border-t border-white/5 pt-10 flex flex-wrap justify-center gap-10 px-6">
        {[
          { num: "+500", label: "عميل راضٍ" },
          { num: "+7×",  label: "متوسط عائد الاستثمار" },
          { num: "+50",  label: "علامة تجارية ناشئة" },
          { num: "+20",  label: "شركة عالمية" },
        ].map(s => (
          <div key={s.label} className="text-center">
            <p className="text-2xl font-black text-[#CC0000]">{s.num}</p>
            <p className="text-xs text-[#9CA3AF] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
