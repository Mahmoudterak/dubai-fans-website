import { useParams, Link } from "wouter";
import { buildBlogPostSchemas } from "@/seo/schemas.mjs";
import { SEOHead } from "@/components/SEOHead";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useBlogPost, useBlogPosts } from "@/hooks/useBlogPosts";
import { Calendar, Clock, ChevronRight, Share2 } from "lucide-react";

export default function BlogPost() {
  const { id } = useParams();
  const { data: post, isLoading, isError, error } = useBlogPost(id);
  const { data: allPosts = [] } = useBlogPosts();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="w-8 h-8 border-4 border-[#CC0000]/30 border-t-[#CC0000] rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !post) {
    const notFound = error?.message === "المقال غير موجود";
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] text-white">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4 text-[#111827]">
            {notFound ? "المقال غير موجود" : "تعذّر تحميل المقال"}
          </h1>
          <Link href="/blog" className="text-[#CC0000] hover:underline font-bold">
            العودة للمدونة
          </Link>
        </div>
      </div>
    );
  }

  // Related posts — same category, excluding current post, max 3
  const relatedPosts = allPosts
    .filter((p) => p.id !== id && p.category === post?.category)
    .slice(0, 3);

  // Render content: if it already contains HTML tags (as stored in DB), inject
  // directly via dangerouslySetInnerHTML. Otherwise fall back to plain-text formatter.
  const isHtmlContent = (content: string) => /<[a-z][\s\S]*>/i.test(content);

  const formatContent = (content: string) => {
    if (isHtmlContent(content)) {
      return (
        <div
          className="prose prose-lg max-w-none text-[#374151] leading-relaxed
            [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-[#111827] [&_h2]:mt-10 [&_h2]:mb-4
            [&_h3]:text-xl  [&_h3]:font-bold  [&_h3]:text-[#111827] [&_h3]:mt-8  [&_h3]:mb-3
            [&_p]:mb-5 [&_p]:leading-relaxed
            [&_ul]:mb-6 [&_ul]:space-y-2 [&_ul]:list-none [&_ul]:pr-0
            [&_ol]:mb-6 [&_ol]:space-y-2
            [&_li]:flex [&_li]:gap-2 [&_li]:text-[#374151]
            [&_strong]:font-bold [&_strong]:text-[#111827]
            [&_a]:text-[#CC0000] [&_a]:underline
            [&_hr]:my-8 [&_hr]:border-[#E5E7EB]"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }

    // Plain-text fallback for older posts
    return content.split('\n\n').map((paragraph, idx) => {
      if (paragraph.includes('\n- ') || paragraph.match(/\n\d+\. /)) {
        const lines = paragraph.split('\n');
        const title = lines[0];
        const items = lines.slice(1);
        return (
          <div key={idx} className="mb-8">
            {title && <h3 className="text-xl font-bold text-[#111827] mb-4">{title}</h3>}
            <ul className="space-y-3">
              {items.map((item, i) => {
                const text = item.replace(/^(-\s|\d+\.\s)/, '');
                return (
                  <li key={i} className="flex gap-3 text-[#374151] leading-relaxed">
                    <span className="text-[#F0B429] font-bold mt-1">•</span>
                    <span>{text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      }

      if (paragraph.includes(':')) {
        const parts = paragraph.split(':');
        return (
          <p key={idx} className="mb-6 text-[#374151] leading-relaxed text-lg">
            <strong className="text-white">{parts[0]}:</strong>{parts.slice(1).join(':')}
          </p>
        );
      }

      return (
        <p key={idx} className="mb-6 text-[#374151] leading-relaxed text-lg">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
      <SEOHead
        title={post.title}
        description={post.excerpt}
        canonical={`/blog/${post.id}`}
        ogType="article"
        ogImage={post.image ? `https://mtuaefans.com${post.image}` : undefined}
        articlePublishedTime={post.dateISO}
        keywords={`${post.category}, تسويق رقمي, دبي فانز, ${post.title}`}
        jsonLd={buildBlogPostSchemas({ id: post.id, title: post.title, excerpt: post.excerpt, image: post.image, dateISO: post.dateISO, category: post.category, content: post.content })}
      />
      <Navbar />
      <main className="flex-grow pt-28 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[#9CA3AF] hover:text-[#CC0000] transition-colors mb-8 font-semibold"
          >
            <ChevronRight size={20} />
            العودة للمقالات
          </Link>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-2xl overflow-hidden border border-[#E5E7EB]"
          >
            {/* Header / Hero */}
            <div className="h-64 sm:h-80 md:h-96 relative overflow-hidden flex items-end bg-[#F3F4F6]">
              {post.image && (
                <img loading="eager" fetchPriority="high" decoding="async"
                  src={post.image}
                  alt={post.title}
                  className="absolute inset-0 w-full h-full object-cover object-top opacity-50"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#07070F] via-[#07070F]/40 to-transparent" />

              <div className="relative z-10 p-8 md:p-12 w-full">
                <div className="flex items-center gap-4 text-xs text-[#9CA3AF] font-medium mb-4">
                  <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full">
                    <Calendar size={13} />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full">
                    <Clock size={13} />
                    {post.readTime}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-black leading-tight text-white">
                  {post.title}
                </h1>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12">
              <div className="text-[#374151] leading-relaxed">
                {formatContent(post.content)}
              </div>

              {/* Related Articles */}
              {relatedPosts.length > 0 && (
                <div className="my-10">
                  <h2 className="text-xl font-black text-[#111827] mb-6 flex items-center gap-3">
                    <span className="w-1 h-6 bg-[#CC0000] rounded-full block" />
                    مقالات قد تهمك
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {relatedPosts.map((related) => (
                      <Link
                        key={related.id}
                        href={`/blog/${related.id}`}
                        className="group block bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl overflow-hidden hover:border-[#CC0000]/30 hover:shadow-md transition-all duration-200"
                      >
                        {related.image && (
                          <div className="h-36 overflow-hidden bg-[#F3F4F6]">
                            <img
                              src={related.image}
                              alt={related.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <p className="text-[#111827] font-bold text-sm leading-snug mb-2 line-clamp-2">
                            {related.title}
                          </p>
                          <div className="flex items-center gap-3 text-[#9CA3AF] text-xs">
                            <span className="flex items-center gap-1">
                              <Clock size={11} />
                              {related.readTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={11} />
                              {related.date}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* WhatsApp CTA — shown on every blog post */}
              <div className="my-10 rounded-2xl bg-gradient-to-l from-[#25D366]/10 to-[#128C7E]/10 border border-[#25D366]/30 p-8 text-center">
                <p className="text-lg font-bold text-[#111827] mb-2">هل لديك سؤال أو تريد استشارة مجانية؟</p>
                <p className="text-[#6B7280] mb-6">تواصل مع خبراء دبي فانز مباشرةً على واتساب — نردّ خلال دقائق</p>
                <a
                  href="https://wa.me/971551981564?text=مرحباً، قرأت مقالاتكم وأريد استشارة مجانية"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20BA5C] text-white font-bold px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  تواصل معنا على واتساب
                </a>
              </div>

              <hr className="my-10 border-[#E5E7EB]" />

              <div className="flex justify-between items-center">
                <p className="text-[#111827] font-bold">شارك هذا المقال:</p>
                <div className="flex gap-4">
                  <button
                    onClick={() => navigator.share?.({ title: post.title, url: window.location.href })}
                    className="w-10 h-10 rounded-full border border-[#E5E7EB] text-[#9CA3AF] hover:bg-[#CC0000] hover:text-white hover:border-[#CC0000] flex items-center justify-center transition-all duration-300"
                  >
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
