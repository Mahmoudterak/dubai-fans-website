import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { Link } from "wouter";

/* ── Inline SVG brand logos ── */
const MetaLogo = () => (
  <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
    <path d="M3 18.5C3 13.2 6.9 8 11.6 8c2.4 0 4.3 1.2 6.4 4.3 2.1-3.1 4-4.3 6.4-4.3C29.1 8 33 13.2 33 18.5c0 3.1-.9 5.6-2.5 7.4-1.6 1.8-3.7 2.6-6 2.1-1.3-.3-2.5-1-3.6-2.2-.8-.9-1.5-2-2.2-3.2L18 21.5l-.7 1.1c-.7 1.2-1.4 2.3-2.2 3.2-1.1 1.2-2.3 1.9-3.6 2.2-2.3.5-4.4-.3-6-2.1C3.9 24.1 3 21.6 3 18.5z" fill="#0081FB"/>
    <path d="M18 22.6c-.8-1.4-1.7-2.8-2.6-3.9-1.2-1.4-2.7-2.7-4.5-2.7-2.7 0-4.9 2.3-4.9 5.8 0 1.9.5 3.4 1.5 4.4.9 1 2.2 1.4 3.6 1.1.9-.2 1.8-.7 2.7-1.7.7-.8 1.4-1.8 2-2.8l.7-1.1.7 1.1c.6 1 1.3 2 2 2.8.9 1 1.8 1.5 2.7 1.7 1.4.3 2.7-.1 3.6-1.1 1-.9 1.5-2.5 1.5-4.4 0-3.5-2.2-5.8-4.9-5.8-1.8 0-3.3 1.3-4.5 2.7-.9 1.1-1.8 2.5-2.6 3.9z" fill="#0082FB"/>
  </svg>
);

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const awards = [
  {
    client: "FATIMA LOUIS SALON",
    title: "Beauty Brand Growth Award",
    year: "2025",
    color: "#EC4899",
  },
  {
    client: "DR. AL-KHALIL",
    title: "Medical Marketing Trust Award",
    year: "2025",
    color: "#06B6D4",
  },
  {
    client: "YOUR GUIDE TRAVEL AND TOURISM",
    title: "Tourism Growth Excellence Award",
    year: "2024",
    color: "#F0B429",
  },
  {
    client: "ENGLISH ZONE INSTITUTE",
    title: "Education Growth Partner Award",
    year: "2024",
    color: "#CC0000",
  },
  {
    client: "GBSS MEDICAL CENTER - AMIREH",
    title: "Premium Healthcare Growth Award",
    year: "2026",
    color: "#10B981",
  },
];

const certifications = [
  { name: "Meta Business Partners", icon: "META" },
  { name: "Google Marketing Platform Certified", icon: "G" },
];

export function Awards() {
  return (
    <section className="py-24 bg-[#FAFAFA] relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-[#F0B429]/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-[#F0B429]/30 bg-[#F0B429]/10 text-[#F0B429] text-sm font-bold mb-4">
            الجوائز
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-[#111827] mb-4">
            تكريمات العملاء و<span className="gradient-text">شهادات الثقة</span>
          </h2>
          <p className="text-[#9CA3AF] text-lg">
            تكريمات حقيقية من عملاء ونظراء نجاح في الإمارات بين عامَي 2024 و2026، بعد حملات تسويقية ساهمت في رفع النتائج وتحويل الطلبات
          </p>
        </motion.div>

        {/* Awards grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-14">
          {awards.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass-card rounded-2xl p-5 text-center hover:border-[#CC0000]/40 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(124,58,237,0.1)] flex flex-col items-center"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={{ backgroundColor: `${a.color}15`, border: `1px solid ${a.color}30` }}
              >
                <Award size={22} style={{ color: a.color }} />
              </div>
              <div className="text-[8px] text-[#9CA3AF] font-bold uppercase tracking-widest mb-2 leading-tight">
                {a.client}
              </div>
              <p className="text-[#111827] font-bold text-xs leading-tight mb-2">{a.title}</p>
              <span
                className="text-[10px] font-black px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${a.color}20`, color: a.color }}
              >
                {a.year}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Certifications row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center items-center gap-6 mb-10"
        >
          <p className="text-[#9CA3AF] text-sm font-semibold w-full text-center mb-2">شراكات معتمدة</p>

          {/* Meta Business Partners */}
          <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#111827] border border-[#2A3158] shadow-lg">
            <MetaLogo />
            <div className="leading-tight">
              <div className="text-[#9CA3AF] text-[10px] font-semibold uppercase tracking-wider mb-0.5">شريك معتمد</div>
              <div className="text-white font-black text-sm">Meta Business Partners</div>
            </div>
          </div>

          {/* Google Marketing Platform */}
          <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#111827] border border-[#2A3158] shadow-lg">
            <GoogleLogo />
            <div className="leading-tight">
              <div className="text-[#9CA3AF] text-[10px] font-semibold uppercase tracking-wider mb-0.5">Google Marketing Platform</div>
              <div className="text-white font-black text-sm">Certified Partner</div>
            </div>
          </div>
        </motion.div>

        {/* International awards badges */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col items-center gap-8"
        >
          <p className="text-[#9CA3AF] text-sm font-semibold w-full text-center">تقدير دولي</p>

          {/* GSK Sensodyne Featured Award */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:border-[#CC0000]/20 transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row gap-0">
              {/* Image */}
              <div className="md:w-72 shrink-0 bg-[#8B0000]">
                <img
                  src="/award-gsk-sensodyne.webp"
                  alt="Muse Creative Awards 2023 – GSK Sensodyne"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {/* Content */}
              <div className="flex-1 p-8 flex flex-col justify-center" dir="rtl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#F0B429]/15 text-[#F0B429] text-xs font-black">
                    Muse Creative Awards 2023
                  </span>
                  <span className="inline-block px-3 py-1 rounded-full bg-[#9CA3AF]/15 text-[#6B7280] text-xs font-bold">
                    Silver Winner
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-[#111827] mb-3 leading-tight">
                  حامل تفاعلي بدون لمس من GSK Sensodyne
                </h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">
                  قمنا بتصميم وتصنيع وتركيب جناح عرض GSK Sensodyne وParodontax الحائز على جوائز في مؤتمر الإمارات الدولي لطب الأسنان ومعرض طب الأسنان العربي (AEEDC) الذي أقيم في مركز دبي التجاري العالمي في الفترة من 29 يونيو إلى 1 يوليو 2021. وقد وضعنا استراتيجية لمجموعة جديدة من الأنشطة، مع مراعاة قيود الجائحة، لخلق تجربة تفاعلية خالية من التلامس للمارة، وبالتالي إشراكهم وزيادة تذكر العلامة التجارية والتعرف عليها من خلال كل تفاعل.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#CC0000]" />
                  <span className="text-xs text-[#9CA3AF] font-semibold">AEEDC – مركز دبي التجاري العالمي، 2023</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Aqua de Fonte Featured Award */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full max-w-4xl bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:border-[#F0B429]/30 transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row gap-0">
              {/* Image */}
              <div className="md:w-72 shrink-0 bg-[#B8860B]">
                <img
                  src="/award-aqua-de-fonte.webp"
                  alt="Muse Creative Awards 2023 Gold – Aqua de Fonte"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              {/* Content */}
              <div className="flex-1 p-8 flex flex-col justify-center" dir="rtl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#F0B429]/15 text-[#F0B429] text-xs font-black">
                    Muse Creative Awards 2023
                  </span>
                  <span className="inline-block px-3 py-1 rounded-full bg-[#F0B429]/25 text-[#B8860B] text-xs font-bold">
                    🥇 Gold Winner
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-[#111827] mb-3 leading-tight">
                  استراتيجية العلامة التجارية أكوا دي فونتي
                </h3>
                <p className="text-[#6B7280] text-sm leading-relaxed">
                  ابتكرنا هوية علامة تجارية مميزة ومنعشة لأكوا دي فونتي مع إطلاق حملتنا الإبداعية "تذوق الحياة في كل قطرة". من خلال هذه الحملة، رصدنا التحدي الذي يواجه الإمارات العربية المتحدة، باعتبارها واحدة من أكبر أسواق استهلاك المياه المعبأة، حيث تتنافس أكثر من 25 علامة تجارية على الحصة الأكبر، مما يجعل دخول علامات تجارية جديدة إلى السوق أمرًا صعبًا. وقد رسّخنا مكانة أكوا دي فونتي كعلامة عصرية وشبابية وحيوية، مما خلق ميزة تنافسية رئيسية في سوق شديدة التشبع.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#F0B429]" />
                  <span className="text-xs text-[#9CA3AF] font-semibold">استراتيجية العلامة التجارية — الإمارات العربية المتحدة</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Badge row */}
          <div className="flex flex-wrap justify-center items-center gap-6">
            {[
              { src: "/award-badge1.svg", alt: "Clutch Top Agency Award", w: 72, h: 76 },
              { src: "/award-badge2.svg", alt: "International Marketing Award", w: 110, h: 82 },
              { src: "/award-badge3.svg", alt: "Global Summit Award", w: 120, h: 86 },
            ].map((badge, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-center justify-center p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm hover:shadow-md hover:border-[#CC0000]/20 transition-all duration-300"
              >
                <img
                  src={badge.src}
                  alt={badge.alt}
                  width={badge.w}
                  height={badge.h}
                  className="object-contain"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>

          {/* CTA → Projects page */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-center mt-6"
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 bg-[#111827] hover:bg-[#1F2937] text-white font-bold px-7 py-3.5 rounded-xl transition-all duration-200 shadow-md text-sm"
            >
              اكتشف كل مشاريعنا وجوائزنا
              <span className="text-[#F0B429]">←</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
