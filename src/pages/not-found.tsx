import { useRoute } from "wouter";
import { AlertCircle } from "lucide-react";
import { SEOHead } from "@/components/SEOHead";

export default function NotFound() {
  const [match, params] = useRoute("/:rest*");

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#1F2A44] text-white">
      <SEOHead
        title="404 - الصفحة غير موجودة | دبي فانز"
        description="عذراً، الصفحة التي تبحث عنها غير موجودة. عُد إلى الصفحة الرئيسية لدبي فانز."
        noindex={true}
      />
      <div className="text-center p-8 bg-[#1a233a] border border-[#334E6E] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-full max-w-md">
        <div className="flex justify-center mb-6">
          <AlertCircle className="h-20 w-20 text-[#0074FF]" />
        </div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-lg text-gray-400 mb-8">
          عذراً، الصفحة التي تبحث عنها غير موجودة.
        </p>
        <a 
          href="/" 
          className="inline-block bg-[#0074FF] text-white px-8 py-3 rounded-full font-bold hover:bg-blue-600 transition-colors"
        >
          العودة للرئيسية
        </a>
      </div>
    </div>
  );
}
