import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote, TrendingUp, Users, Award } from "lucide-react";

/* ── Data ─────────────────────────────────────────────────────────────── */
const reviews = [
  {
    stars: 5,
    text: "تعاملت مع mtuaefans من أجل السوشيال ميديا وأداء الإعلانات. احترافية عالية وتحليل دقيق. فريقهم متميز بإيجاد الحل المناسب دائماً. الكل يبحث عن فريق تسويق يفهم السوق الإماراتي وهذا ما وجدته هنا.",
    name: "إسلام جلال",
    initials: "إج",
    avatarColor: "#CC0000",
    title: "عميل سوشيال ميديا",
    company: "شركة متخصصة — دبي",
    service: "إدارة السوشيال ميديا",
    serviceColor: "#3B82F6",
    rating: 99,
    before: "200 متابع",
    after: "+2,800 متابع",
    metric: "نمو المتابعين",
  },
  {
    stars: 5,
    text: "تعاملنا مع mtuaefans في تسويق برامجنا التعليمية. النتائج تجاوزت التوقعات وتضاعفت التسجيلات خلال شهرين فقط. أنصح بهم بشدة لأي مؤسسة تعليمية.",
    name: "مسعود زعلوك",
    initials: "مز",
    avatarColor: "#D97706",
    title: "مؤسس مركز تعليم اللغات",
    company: "مركز تعليم اللغات — الشارقة",
    service: "إعلانات Meta",
    serviceColor: "#CC0000",
    rating: 96,
    before: "12 تسجيل / شهر",
    after: "+38 تسجيل / شهر",
    metric: "التسجيلات الشهرية",
  },
  {
    stars: 5,
    text: "شراكتنا مع دبي فانز غيّرت أداءنا في السوق. خطة التسويق المتكاملة رفعت عدد العملاء المحتملين بنسبة 280% وانخفضت تكلفة الاستفسار بشكل ملحوظ.",
    name: "فريق SMA",
    initials: "SM",
    avatarColor: "#10B981",
    title: "SMA Capital Real Estate",
    company: "SMA Capital — دبي",
    service: "تسويق عقاري متكامل",
    serviceColor: "#10B981",
    rating: 98,
    before: "25 استفسار / شهر",
    after: "+95 استفسار / شهر",
    metric: "العملاء المحتملين",
  },
  {
    stars: 5,
    text: "خدمة متميزة واحترافية عالية. الفريق يفهم احتياجات السوق الإماراتي ويقدم حلولاً مبتكرة. ساعدونا في بناء هوية رقمية قوية وزيادة مبيعاتنا بشكل ملموس.",
    name: "نورة الهاجري",
    initials: "نه",
    avatarColor: "#8B5CF6",
    title: "صاحبة مشروع تجاري",
    company: "مشروع تجاري — أبوظبي",
    service: "هوية بصرية + موقع",
    serviceColor: "#8B5CF6",
    rating: 97,
    before: "بدون هوية رقمية",
    after: "موقع + هوية كاملة",
    metric: "الحضور الرقمي",
  },
  {
    stars: 5,
    text: "أفضل وكالة تسويق تعاملت معها في الإمارات. يقدمون تقارير شفافة وواضحة، ويتابعون الأداء بشكل يومي. الحملات الإعلانية على ميتا وجوجل أعطت نتائج ممتازة فوق المتوقع.",
    name: "أحمد الجابري",
    initials: "أج",
    avatarColor: "#0EA5E9",
    title: "مدير تسويق",
    company: "شركة تجارية — دبي",
    service: "Meta & Google Ads",
    serviceColor: "#D97706",
    rating: 99,
    before: "ROAS 1.8×",
    after: "ROAS 4.6×",
    metric: "معدل العائد الإعلاني",
  },
];

const AGGREGATE = {
  ratingValue: "4.9",
  reviewCount: reviews.length,
  bestRating: "5",
};

/* ── Aggregate Rating JSON-LD injected once ───────────────────────────── */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://mtuaefans.com/#localbusiness",
  "name": "دبي فانز",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": AGGREGATE.ratingValue,
    "reviewCount": AGGREGATE.reviewCount,
    "bestRating": AGGREGATE.bestRating,
    "worstRating": "1",
  },
  "review": reviews.map((r) => ({
    "@type": "Review",
    "author": { "@type": "Person", "name": r.name },
    "reviewRating": { "@type": "Rating", "ratingValue": String(r.stars), "bestRating": "5" },
    "reviewBody": r.text,
    "name": r.service,
  })),
};

/* ── Component ──────────────────────────────────────────────────────────── */
export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const next = useCallback(() => setCurrent((c) => (c + 1) % reviews.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + reviews.length) % reviews.length), []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [paused, next]);

  /* touch swipe */
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  const review = reviews[current];

  return (
    <section
      className="py-20 bg-[#F3F4F6] relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      dir="rtl"
    >
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] bg-[#CC0000]/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-[#CC0000]/30 bg-[#CC0000]/10 text-[#CC0000] text-sm font-bold mb-4">
            آراء عملائنا
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-[#111827] mb-3 leading-tight">
            نجاحهم <span className="gradient-text">يتحدث عنّا</span>
          </h2>
          <p className="text-[#6B7280] text-base">
            تقييمات حقيقية من عملاء فعليين مع نتائج موثّقة
          </p>
        </motion.div>

        {/* ── Aggregate trust bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6 mb-12"
        >
          {[
            { icon: Star,     value: `${AGGREGATE.ratingValue}/5`, label: "متوسط التقييم", color: "#F0B429" },
            { icon: Users,    value: "+1,200",                      label: "عميل راضٍ",    color: "#CC0000" },
            { icon: Award,    value: "97%",                         label: "نسبة التوصية", color: "#10B981" },
            { icon: TrendingUp, value: "+248%",                     label: "متوسط النمو", color: "#3B82F6" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 bg-white border border-[#E5E7EB] rounded-2xl px-5 py-3 shadow-sm">
              <item.icon size={17} style={{ color: item.color }} />
              <span className="font-black text-[#111827] text-sm">{item.value}</span>
              <span className="text-[#9CA3AF] text-xs">{item.label}</span>
            </div>
          ))}
        </motion.div>

        {/* ── Main slider ── */}
        <div className="max-w-3xl mx-auto mb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.38 }}
              className="glass-premium rounded-2xl overflow-hidden"
            >
              {/* Service badge header */}
              <div
                className="px-6 py-2.5 flex items-center gap-2 border-b border-[#F3F4F6]"
                style={{ backgroundColor: `${review.serviceColor}08` }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: review.serviceColor }}
                />
                <span className="text-xs font-bold" style={{ color: review.serviceColor }}>
                  {review.service}
                </span>
                <span className="text-[#D1D5DB] text-xs mx-1">—</span>
                <span className="text-xs text-[#9CA3AF]">{review.company}</span>
              </div>

              <div className="p-7">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: review.stars }).map((_, i) => (
                    <Star key={i} size={16} className="fill-[#F0B429] text-[#F0B429]" />
                  ))}
                </div>

                {/* Quote */}
                <div className="relative">
                  <Quote size={32} className="absolute -top-1 -right-1 text-[#CC0000]/8" />
                  <p className="text-[#374151] text-sm leading-relaxed mb-6 relative z-10 pr-4">
                    "{review.text}"
                  </p>
                </div>

                {/* Before / After */}
                <div className="grid grid-cols-3 gap-2 mb-6 bg-[#F9FAFB] rounded-xl p-3 border border-[#E5E7EB]">
                  <div className="text-center">
                    <div className="text-[10px] text-[#9CA3AF] font-semibold mb-1 uppercase tracking-wide">قبل</div>
                    <div className="text-xs font-bold text-[#6B7280]">{review.before}</div>
                  </div>
                  <div className="text-center flex flex-col items-center justify-center">
                    <TrendingUp size={14} className="text-[#10B981] mb-1" />
                    <div className="text-[10px] text-[#6B7280] font-semibold">{review.metric}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-[#10B981] font-semibold mb-1 uppercase tracking-wide">بعد</div>
                    <div className="text-xs font-bold text-[#10B981]">{review.after}</div>
                  </div>
                </div>

                {/* Author + Rating score */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center font-black text-white text-sm shrink-0"
                      style={{ backgroundColor: review.avatarColor }}
                    >
                      {review.initials}
                    </div>
                    <div>
                      <div className="text-[#111827] font-bold text-sm">{review.name}</div>
                      <div className="text-[#9CA3AF] text-xs">{review.title}</div>
                    </div>
                  </div>
                  <div className="text-center bg-[#CC0000]/5 border border-[#CC0000]/15 rounded-xl px-4 py-2">
                    <div className="text-2xl font-black text-[#CC0000] leading-none">{review.rating}</div>
                    <div className="text-[10px] text-[#9CA3AF]">/100</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-5">
            <button
              onClick={prev}
              aria-label="السابق"
              className="w-11 h-11 rounded-full border border-[#E5E7EB] bg-white flex items-center justify-center text-[#9CA3AF] hover:text-[#CC0000] hover:border-[#CC0000]/40 transition-all"
            >
              <ChevronRight size={18} />
            </button>
            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`تقييم ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? "w-7 bg-[#CC0000]" : "w-2 bg-[#E5E7EB] hover:bg-[#CC0000]/30"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              aria-label="التالي"
              className="w-11 h-11 rounded-full border border-[#E5E7EB] bg-white flex items-center justify-center text-[#9CA3AF] hover:text-[#CC0000] hover:border-[#CC0000]/40 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        </div>

        {/* ── All review mini-cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {reviews.map((r, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              onClick={() => setCurrent(i)}
              className={`text-right p-4 rounded-xl border transition-all duration-300 card-lift ${
                i === current
                  ? "border-[#CC0000]/40 bg-white shadow-md shadow-[#CC0000]/5"
                  : "border-[#E5E7EB] bg-white/60 hover:border-[#CC0000]/25 hover:bg-white"
              }`}
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: r.stars }).map((_, j) => (
                  <Star key={j} size={10} className="fill-[#F0B429] text-[#F0B429]" />
                ))}
              </div>
              {/* Mini avatar + name */}
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center font-black text-white text-[10px] shrink-0"
                  style={{ backgroundColor: r.avatarColor }}
                >
                  {r.initials}
                </div>
                <div>
                  <div className="text-[#111827] text-[11px] font-bold leading-tight">{r.name}</div>
                  <span
                    className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: `${r.serviceColor}15`, color: r.serviceColor }}
                  >
                    {r.service}
                  </span>
                </div>
              </div>
              {/* After stat */}
              <div className="text-[10px] text-[#10B981] font-bold">{r.after}</div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
