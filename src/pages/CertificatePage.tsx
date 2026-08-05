import { SEOHead } from "@/components/SEOHead";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShieldCheck } from "lucide-react";

export default function CertificatePage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans">
      <SEOHead
        title="شهادة الأمان والثقة | دبي فانز"
        description="شهادة الأمان الرقمي لوكالة دبي فانز للتسويق الرقمي — بياناتك وخصوصيتك في أمان تام."
        canonical="/certificate"
      />
      <Navbar />

      <main className="flex-grow pt-28 pb-20 flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center">
          {/* Header */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-600 text-sm font-bold mb-6">
            <ShieldCheck size={16} />
            شهادة موثّقة
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-[#111827] mb-3">
            شهادة الأمان والثقة
          </h1>
          <p className="text-[#6B7280] mb-10 text-sm leading-relaxed">
            وكالة دبي فانز للتسويق الرقمي معتمدة ومؤمَّنة — بياناتك وخصوصيتك في أمان تام.
          </p>

          {/* Authorization certificate — main */}
          <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-xl p-6 mb-4">
            <img
              src="/cert-authorization.webp"
              alt="Certificate of Authorization — دبي فانز"
              className="w-full max-w-sm mx-auto h-auto object-contain rounded-xl"
              loading="eager"
            />
          </div>

          {/* Security badge */}
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm px-8 py-4 flex items-center gap-4">
              <img
                src="/security-certificate.webp"
                alt="شهادة الأمان الرقمي"
                className="h-12 w-auto object-contain"
                loading="lazy"
              />
              <div className="text-right">
                <div className="text-sm font-black text-[#111827]">موقع موثوق وآمن</div>
                <div className="text-xs text-[#9CA3AF] mt-0.5">Secure & Verified Agency</div>
              </div>
            </div>
          </div>

          {/* Trust details */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            {[
              { label: "SSL مشفّر", sub: "HTTPS 256-bit" },
              { label: "بيانات آمنة", sub: "GDPR Compliant" },
              { label: "دفع موثوق", sub: "PCI DSS Ready" },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#E5E7EB] py-4 px-3 shadow-sm">
                <div className="text-sm font-black text-[#111827]">{item.label}</div>
                <div className="text-xs text-[#9CA3AF] mt-1">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
