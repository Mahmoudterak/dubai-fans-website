import { useState, useMemo } from "react";
import { SEOHead } from "@/components/SEOHead";
import { getRouteMeta } from "@/seo/routes-meta.mjs";

const PAGE_META = getRouteMeta("/blog");
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { Calendar, Clock, Search, RotateCcw } from "lucide-react";

const SORT_OPTIONS = [
  { value: "newest", label: "الأحدث أولاً" },
  { value: "oldest", label: "الأقدم أولاً" },
];

export default function BlogList() {
  const { data: blogPosts = [], isLoading, isError } = useBlogPosts();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("كل التصنيفات");
  const [sort, setSort] = useState("newest");

  const ALL_CATS = useMemo(
    () => ["كل التصنيفات", ...Array.from(new Set(blogPosts.map((p) => p.category)))],
    [blogPosts],
  );

  const filtered = useMemo(() => {
    let list = [...blogPosts];
    if (query.trim()) list = list.filter((p) => p.title.includes(query) || p.excerpt.includes(query));
    if (cat !== "كل التصنيفات") list = list.filter((p) => p.category === cat);
    if (sort === "oldest") list.reverse();
    return list;
  }, [blogPosts, query, cat, sort]);

  const reset = () => { setQuery(""); setCat("كل التصنيفات"); setSort("newest"); };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
      <SEOHead
        title={PAGE_META.title}
        description={PAGE_META.description}
        canonical="/blog"
        keywords="مدونة تسويق رقمي, مقالات سيو, نصائح سوشيال ميديا, تسويق الإمارات, مدونة دبي فانز"
        ogImage={PAGE_META.ogImage}
      />
      <Navbar />
      <main className="flex-grow pt-28">

        {/* Header */}
        <div className="bg-[#F3F4F6] border-b border-[#E5E7EB] py-14 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#CC0000]/8 rounded-full blur-[80px]" />
          <div className="container mx-auto px-6 relative z-10 text-center max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-block px-4 py-1.5 rounded-full border border-[#CC0000]/30 bg-[#CC0000]/10 text-[#CC0000] text-sm font-bold mb-4">
                النمو والمعرفة
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-[#111827] mb-4">
                مدونة <span className="gradient-text">التسويق الرقمي</span>
              </h1>
              <p className="text-[#9CA3AF] text-lg">
                تعرف على أحدث مقالاتنا وأخبارنا المهنية
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-6 pb-24">
          {/* Search + filters */}
          <div className="glass-card rounded-2xl p-5 mb-10 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث بعنوان المقال أو المحتوى..."
                className="w-full pr-10 pl-4 py-3 bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl text-[#111827] placeholder-[#6B7280] text-sm focus:border-[#CC0000]/50 focus:outline-none transition-colors"
              />
            </div>

            {/* Category */}
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="px-4 py-3 bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl text-[#111827] text-sm focus:border-[#CC0000]/50 focus:outline-none transition-colors min-w-[180px]"
            >
              {ALL_CATS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-3 bg-[#F3F4F6] border border-[#E5E7EB] rounded-xl text-[#111827] text-sm focus:border-[#CC0000]/50 focus:outline-none transition-colors min-w-[150px]"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            {/* Reset */}
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-3 border border-[#E5E7EB] rounded-xl text-[#9CA3AF] hover:text-white hover:border-[#CC0000]/50 transition-all text-sm font-semibold whitespace-nowrap"
            >
              <RotateCcw size={14} /> إعادة ضبط
            </button>
          </div>

          {/* Loading / Error states */}
          {isLoading && (
            <div className="text-center py-20 text-[#9CA3AF]">جاري تحميل المقالات...</div>
          )}
          {isError && (
            <div className="text-center py-20 text-[#CC0000]">تعذّر تحميل المقالات، يرجى المحاولة مرة أخرى.</div>
          )}

          {!isLoading && !isError && (
            <>
              {/* Results count */}
              <p className="text-[#9CA3AF] text-sm mb-6">{filtered.length} مقال</p>

              {/* Cards grid */}
              {filtered.length === 0 ? (
                <div className="text-center py-20 text-[#9CA3AF]">لا توجد نتائج مطابقة للبحث</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((post, i) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="glass-card rounded-2xl overflow-hidden group hover:border-[#CC0000]/40 transition-all duration-300 flex flex-col"
                    >
                      {/* Image */}
                      <div className="h-44 overflow-hidden relative">
                        {post.image ? (
                          <img src={post.image} alt={post.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" loading="lazy" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#CC0000]/20 to-[#07070F]" />
                        )}
                        <div className="absolute top-3 right-3">
                          <span className="px-2.5 py-1 rounded-full bg-[#CC0000]/90 text-white text-[10px] font-bold">
                            {post.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 flex flex-col flex-grow">
                        <div className="flex items-center gap-3 text-[10px] text-[#9CA3AF] mb-3">
                          <span className="flex items-center gap-1"><Calendar size={10} /> {post.date}</span>
                          <span className="flex items-center gap-1"><Clock size={10} /> {post.readTime}</span>
                        </div>
                        <h2 className="text-sm font-black text-[#111827] leading-snug mb-2 group-hover:text-[#CC0000] transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                        <p className="text-[#9CA3AF] text-xs leading-relaxed line-clamp-3 flex-grow mb-4">
                          {post.excerpt}
                        </p>
                        <Link href={`/blog/${post.id}`}>
                          <span className="text-[#CC0000] text-xs font-bold hover:underline cursor-pointer">
                            قراءة المزيد ←
                          </span>
                        </Link>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
