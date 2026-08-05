import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { Calendar, Clock, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

export function BlogSection() {
  const { data: blogPosts = [] } = useBlogPosts();
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(
    () => setCurrent((c) => (blogPosts.length > 0 ? (c + 1) % blogPosts.length : 0)),
    [blogPosts.length],
  );
  const prev = () =>
    setCurrent((c) => (blogPosts.length > 0 ? (c - 1 + blogPosts.length) % blogPosts.length : 0));

  // Reset index if posts change and current is out of bounds
  useEffect(() => {
    if (blogPosts.length > 0 && current >= blogPosts.length) setCurrent(0);
  }, [blogPosts.length, current]);

  useEffect(() => {
    if (paused || blogPosts.length === 0) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [paused, next, blogPosts.length]);

  const post = blogPosts[current];

  if (!post) return null;

  return (
    <section className="py-24 bg-[#FAFAFA] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-80 h-80 bg-[#CC0000]/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full border border-[#CC0000]/30 bg-[#CC0000]/10 text-[#CC0000] text-sm font-bold mb-3">
              المقالات
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              أحدث <span className="gradient-text">المقالات</span>
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden md:flex items-center gap-2 px-5 py-2.5 border border-[#E5E7EB] text-[#9CA3AF] rounded-xl text-sm font-bold hover:border-[#CC0000]/50 hover:text-white transition-all"
          >
            كل المقالات
            <ArrowLeft size={16} />
          </Link>
        </div>

        {/* Featured slider */}
        <div
          className="glass-card rounded-2xl overflow-hidden mb-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4 }}
              className="grid md:grid-cols-2 min-h-[280px]"
            >
              {/* Content */}
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-xs text-[#9CA3AF] mb-4">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#CC0000]/15 text-[#CC0000] font-semibold border border-[#CC0000]/20">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1"><Calendar size={11} /> {post.date}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-[#111827] mb-3 leading-snug">
                  {post.title}
                </h3>
                <p className="text-[#9CA3AF] text-sm leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-4">
                  <Link
                    href={`/blog/${post.id}`}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#CC0000] text-white rounded-xl font-bold text-sm hover:bg-[#AA0000] transition-colors"
                  >
                    قراءة المزيد
                  </Link>
                  <span className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
                    <Clock size={12} /> {post.readTime}
                  </span>
                </div>
              </div>

              {/* Image */}
              <div className="relative min-h-[200px] md:min-h-auto overflow-hidden">
                {post.image ? (
                  <img loading="lazy" decoding="async"
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#CC0000]/20 to-[#07070F]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-[#07070F]/60 via-transparent to-transparent" />

                {/* Slider indicators */}
                <div className="absolute bottom-4 right-4 flex gap-1.5">
                  {blogPosts.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "w-5 bg-[#CC0000]" : "w-1.5 bg-white/30"}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Prev / Next */}
          <div className="flex gap-2 p-4 border-t border-[#E5E7EB] justify-end">
            <button
              onClick={prev}
              className="w-8 h-8 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] hover:text-white hover:border-[#CC0000] transition-all"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={next}
              className="w-8 h-8 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] hover:text-white hover:border-[#CC0000] transition-all"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>

        {/* Mini cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {blogPosts.slice(0, 4).map((p, i) => (
            <Link key={p.id} href={`/blog/${p.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="glass-card rounded-xl overflow-hidden hover:border-[#CC0000]/40 transition-all duration-300 group cursor-pointer"
              >
                <div className="h-28 overflow-hidden">
                  {p.image ? (
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500" loading="lazy" />
                  ) : (
                    <div className="w-full h-full bg-[#CC0000]/15" />
                  )}
                </div>
                <div className="p-3">
                  <p className="text-[#111827] text-xs font-bold line-clamp-2 group-hover:text-[#CC0000] transition-colors">{p.title}</p>
                  <p className="text-[#9CA3AF] text-[10px] mt-1">{p.readTime}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
