import { motion } from "framer-motion";

const galleryItems = [
  { src: "/portfolio-timeline.webp",     label: "مسيرتنا من 2004 إلى 2024",                  tag: "تاريخنا",        color: "#6366F1" },
  { src: "/portfolio-gulf-paints.webp",  label: "أصباغ الخليج — Muse Gold Winner 2022",        tag: "جوائز",          color: "#F0B429" },
  { src: "/portfolio-saha.webp",         label: "صحة — تصميم تغليف المنتجات",                  tag: "تصميم تغليف",    color: "#10B981" },
  { src: "/portfolio-sundent.webp",      label: "Sundent & HairMax — حملة الصيدليات",           tag: "حملات تسويقية",  color: "#CC0000" },
  { src: "/portfolio-social-media.webp", label: "إدارة وسائل التواصل الاجتماعي",               tag: "سوشيال ميديا",   color: "#8B5CF6" },
  { src: "/portfolio-work6.webp",        label: "The Watch House — حملات موسمية",              tag: "إعلانات موسمية", color: "#F59E0B" },
  { src: "/portfolio-work7.webp",        label: "GJEPC / IJEX — معرض المجوهرات في دبي",        tag: "تسويق فعاليات",  color: "#D97706" },
  { src: "/portfolio-work8.webp",        label: "GSK Sensodyne — مواد AR التفاعلية",           tag: "واقع معزز",      color: "#06B6D4" },
  { src: "/portfolio-work9.webp",        label: "آراء العملاء — Client Testimonials",          tag: "تجربة العملاء",  color: "#EC4899" },
];

export function PortfolioGallery() {
  return (
    <section className="py-20 bg-[#FAFAFA]" dir="rtl">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block bg-[#CC0000]/10 text-[#CC0000] text-sm font-bold px-4 py-1.5 rounded-full mb-4">
            معرض الأعمال
          </span>
          <h2 className="text-2xl md:text-4xl font-black text-[#111827] mb-3">
            لقطات من <span className="text-[#CC0000]">أعمالنا الإبداعية</span>
          </h2>
          <p className="text-[#6B7280] text-base max-w-xl mx-auto">
            تصميم العلامات التجارية، التغليف، الحملات الإعلانية، والتسويق الرقمي
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {galleryItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group card-premium card-lift rounded-2xl overflow-hidden"
            >
              <div className="relative overflow-hidden h-52 bg-[#F8F8F8]">
                <img
                  src={item.src}
                  alt={item.label}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span
                  className="absolute top-3 right-3 text-white text-xs font-bold px-3 py-1 rounded-full"
                  style={{ backgroundColor: item.color }}
                >
                  {item.tag}
                </span>
              </div>
              <div className="px-5 py-4">
                <p className="text-[#111827] font-bold text-sm leading-snug text-right">{item.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
