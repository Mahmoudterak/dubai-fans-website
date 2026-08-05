import { SEOHead } from "@/components/SEOHead";
import { getRouteMeta } from "@/seo/routes-meta.mjs";

const PAGE_META = getRouteMeta("/");
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Clients } from "@/components/Clients";
import { Services } from "@/components/Services";
import { Methodology } from "@/components/Methodology";
import { PortfolioGallery } from "@/components/PortfolioGallery";
import { Portfolio } from "@/components/Portfolio";
import { Awards } from "@/components/Awards";
import { Testimonials } from "@/components/Testimonials";
import { BlogSection } from "@/components/BlogSection";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { TrustBar } from "@/components/TrustBar";
import { CaseStudiesSection } from "@/components/CaseStudiesSection";
import { StatsCounter } from "@/components/StatsCounter";
import { ProductsSection } from "@/components/ProductsSection";
import { Newsletter } from "@/components/Newsletter";
import { FinalCTA } from "@/components/FinalCTA";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-white font-sans">
      <SEOHead
        title={PAGE_META.title}
        description={PAGE_META.description}
        canonical="/"
        ogImage={PAGE_META.ogImage}
      />
      <Navbar />
      <main>
        <Hero />
        <ProductsSection />
        <StatsCounter />
        <Portfolio />
        <CaseStudiesSection />
        <Clients />
        <Services />
        <Methodology />
        <PortfolioGallery />
        <Awards />
        <TrustBar />
        <Testimonials />
        <BlogSection />
        <Newsletter />
        <About />
        <Contact />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
