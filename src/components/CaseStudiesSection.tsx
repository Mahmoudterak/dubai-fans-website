/**
 * CaseStudiesSection — "قصص نجاح موثّقة"
 * Two compact cards linking to the detailed case-study pages.
 * Placed between TrustBar and Testimonials on the Home page.
 *
 * Uses DS Card + Badge primitives and CSS token variables for all structural
 * colors. Per-client accent colors (red / green) are product data, not
 * invented palette entries, and are scoped to the data array.
 */
import { Link } from "wouter";
import { motion } from "framer-motion";
import { TrendingUp, Users, Eye, MessageSquare, ArrowLeft, Trophy } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@workspace/dubai-fans-ds/components/ui/card";
import { Badge } from "@workspace/dubai-fans-ds/components/ui/badge";

/* ── Data ──────────────────────────────────────────────────────────────────── */

const cases = [
  {
    slug:        "/projects/sameday-dental",
    client:      "SameDay Dental",
    sector:      "طب الأسنان",
    accentColor: "var(--color-primary)",          // brand red — DS token
    headline:    "+80%",
    headlineSub: "زيادة في الاستفسارات",
    summary:     "رفعنا استفسارات عيادة أسنان في دبي بأكثر من 80% خلال 3 أشهر عبر SEO وإعلانات بحث مستهدفة.",
    stats: [
      { icon: Users,      value: "+60%", label: "زيارات فريدة"  },
      { icon: TrendingUp, value: "-50%", label: "معدل الارتداد" },
      { icon: Trophy,     value: "#1",   label: "الصفحة الأولى" },
    ],
  },
  {
    slug:        "/projects/health-factory",
    client:      "Health Factory",
    sector:      "الصحة واللياقة",
    accentColor: "var(--color-chart-2)",          // success green — DS chart token
    headline:    "7.6×",
    headlineSub: "عائد على الاستثمار (ROI)",
    summary:     "حققنا 7.6 أضعاف الاستثمار من Google Ads لمركز صحي مع 100 عميل محتمل و3 مليون ظهور.",
    stats: [
      { icon: Users,         value: "100",   label: "عميل محتمل"  },
      { icon: Eye,           value: "3M",    label: "مرة ظهور"    },
      { icon: MessageSquare, value: "22.8K", label: "درهم عائد"   },
    ],
  },
] as const;

/* ── Animation ─────────────────────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay },
  }),
};

/* ── Component ─────────────────────────────────────────────────────────────── */

export function CaseStudiesSection() {
  return (
    <section
      dir="rtl"
      className="py-20 px-4"
      style={{ background: "var(--color-background)" }}
    >
      {/* ── Header ── */}
      <motion.div
        className="text-center mb-14 max-w-2xl mx-auto"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        custom={0}
        variants={fadeUp}
      >
        <Badge
          variant="outline"
          className="mb-4 text-xs font-bold tracking-widest uppercase"
          style={{ color: "var(--color-primary)", borderColor: "var(--color-primary-border)" }}
        >
          قصص نجاح موثّقة مباشرة
        </Badge>

        <h2
          className="text-3xl sm:text-4xl font-extrabold leading-snug mt-3 mb-2"
          style={{ color: "var(--color-foreground)" }}
        >
          دراسات الحالة
        </h2>
        <p
          className="text-xl font-bold mb-3"
          style={{ color: "var(--color-primary)" }}
        >
          نتائج حقيقية لعملاء حقيقيين
        </p>
        <p style={{ color: "var(--color-muted-foreground)" }} className="text-base leading-relaxed">
          أرقام موثّقة من حملات نفّذناها لعملاء في مختلف القطاعات — لسنا نَعِد، نُثبت بالأرقام.
        </p>
      </motion.div>

      {/* ── Cards ── */}
      <div className="max-w-5xl mx-auto grid gap-6 sm:grid-cols-2">
        {cases.map((c, i) => (
          <motion.div
            key={c.slug}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            custom={i * 0.12}
            variants={fadeUp}
          >
            <Link href={c.slug}>
              <Card className="group h-full cursor-pointer overflow-hidden transition-transform duration-300 hover:-translate-y-1 flex flex-col relative">
                {/* Colored top accent bar */}
                <div
                  className="absolute top-0 right-0 left-0 h-1"
                  style={{ background: c.accentColor }}
                />

                <CardHeader className="pb-2 pt-7">
                  {/* Sector badge */}
                  <Badge
                    variant="outline"
                    className="self-start text-xs font-semibold mb-3"
                    style={{
                      color:       c.accentColor,
                      borderColor: c.accentColor,
                    }}
                  >
                    {c.sector}
                  </Badge>

                  {/* Client name */}
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--color-muted-foreground)" }}
                  >
                    {c.client}
                  </p>

                  {/* Headline metric */}
                  <div className="mt-1">
                    <span
                      className="text-5xl font-black leading-none"
                      style={{ color: c.accentColor }}
                    >
                      {c.headline}
                    </span>
                    <p
                      className="text-sm mt-1"
                      style={{ color: "var(--color-muted-foreground)" }}
                    >
                      {c.headlineSub}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="flex-1">
                  {/* Summary */}
                  <p
                    className="text-sm leading-relaxed mb-6"
                    style={{ color: "var(--color-muted-foreground)" }}
                  >
                    {c.summary}
                  </p>

                  {/* Supporting stats */}
                  <div className="grid grid-cols-3 gap-2">
                    {c.stats.map((s) => (
                      <div
                        key={s.label}
                        className="rounded-xl py-2.5 px-2 text-center"
                        style={{
                          background:  "var(--color-muted)",
                          border:      "1px solid var(--color-border)",
                        }}
                      >
                        <s.icon
                          size={14}
                          className="mx-auto mb-1"
                          style={{ color: c.accentColor }}
                        />
                        <p
                          className="text-sm font-bold leading-none"
                          style={{ color: "var(--color-foreground)" }}
                        >
                          {s.value}
                        </p>
                        <p
                          className="text-[10px] mt-0.5 leading-tight"
                          style={{ color: "var(--color-muted-foreground)" }}
                        >
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter>
                  <span
                    className="flex items-center gap-2 text-sm font-bold transition-colors duration-200"
                    style={{ color: c.accentColor }}
                  >
                    اقرأ التفاصيل
                    <ArrowLeft
                      size={15}
                      className="transition-transform duration-200 group-hover:-translate-x-1"
                    />
                  </span>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* ── All projects link ── */}
      <motion.div
        className="text-center mt-10"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        custom={0.24}
        variants={fadeUp}
      >
        <Link href="/projects">
          <span
            className="inline-flex items-center gap-2 text-sm font-semibold transition-opacity duration-200 hover:opacity-70"
            style={{ color: "var(--color-muted-foreground)" }}
          >
            عرض جميع المشاريع
            <ArrowLeft size={14} />
          </span>
        </Link>
      </motion.div>
    </section>
  );
}
