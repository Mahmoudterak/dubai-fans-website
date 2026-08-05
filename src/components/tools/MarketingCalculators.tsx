import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, Target } from "lucide-react";

function RoasCalculator() {
  const [budget, setBudget] = useState("");
  const [sales, setSales] = useState("");
  const [cost, setCost] = useState("");

  const b = Number(budget) || 0;
  const s = Number(sales) || 0;
  const c = Number(cost) || 0;

  const roas = b > 0 ? (s / b).toFixed(2) : "0.00";
  const profit = s - b - c;
  const roi = b > 0 ? ((profit / b) * 100).toFixed(1) : "0.0";
  const numRoas = Number(roas);
  const status = numRoas > 4 ? { text: "ممتاز", color: "text-green-600 bg-green-100 border-green-200" } : numRoas >= 2 ? { text: "جيد", color: "text-yellow-600 bg-yellow-100 border-yellow-200" } : { text: "يحتاج تحسين", color: "text-red-600 bg-red-100 border-red-200" };

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E7EB]/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-[#CC0000]/10 flex items-center justify-center text-[#CC0000]">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#111827]">حاسبة العائد على الإعلانات (ROAS & ROI)</h2>
          <p className="text-[#9CA3AF] font-medium text-sm">احسب أرباحك وعائد حملاتك الإعلانية بدقة</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-[#374151] mb-2">الميزانية الإعلانية (درهم)</label>
            <input 
              type="number" 
              className="w-full rounded-2xl border-2 border-[#E5E7EB] bg-[#F3F4F6] px-5 py-3 font-bold focus:glass-card focus:outline-none focus:border-[#CC0000] focus:ring-4 focus:ring-[#CC0000]/10 transition-all text-left" 
              placeholder="مثال: 5000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#374151] mb-2">إجمالي المبيعات من الحملة (درهم)</label>
            <input 
              type="number" 
              className="w-full rounded-2xl border-2 border-[#E5E7EB] bg-[#F3F4F6] px-5 py-3 font-bold focus:glass-card focus:outline-none focus:border-[#CC0000] focus:ring-4 focus:ring-[#CC0000]/10 transition-all text-left" 
              placeholder="مثال: 25000"
              value={sales}
              onChange={(e) => setSales(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#374151] mb-2">تكلفة المنتج/الخدمة (درهم) <span className="text-[#9CA3AF] font-normal">- اختياري</span></label>
            <input 
              type="number" 
              className="w-full rounded-2xl border-2 border-[#E5E7EB] bg-[#F3F4F6] px-5 py-3 font-bold focus:glass-card focus:outline-none focus:border-[#CC0000] focus:ring-4 focus:ring-[#CC0000]/10 transition-all text-left" 
              placeholder="مثال: 8000"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-[#1E1B4B] rounded-2xl p-8 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#CC0000]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <div>
                <p className="text-[#9CA3AF] font-bold mb-1">ROAS</p>
                <div className="text-4xl font-black">{roas} <span className="text-lg text-[#F0B429]">x</span></div>
              </div>
              {b > 0 && s > 0 && (
                <div className={`px-4 py-2 rounded-xl font-bold text-sm border ${status.color}`}>
                  {status.text}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <div>
                <p className="text-[#9CA3AF] font-bold mb-1">ROI (العائد على الاستثمار)</p>
                <div className="text-2xl font-bold">{roi}%</div>
              </div>
            </div>

            <div>
              <p className="text-[#9CA3AF] font-bold mb-1">الربح الصافي</p>
              <div className={`text-2xl font-bold ${profit > 0 ? "text-green-400" : profit < 0 ? "text-red-400" : "text-white"}`}>
                {profit.toLocaleString()} درهم
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CacCalculator() {
  const [spend, setSpend] = useState("");
  const [customers, setCustomers] = useState("");
  const [aov, setAov] = useState("");
  const [frequency, setFrequency] = useState("");
  const [retention, setRetention] = useState("");

  const sp = Number(spend) || 0;
  const cu = Number(customers) || 0;
  const a = Number(aov) || 0;
  const f = Number(frequency) || 0;
  const r = Number(retention) || 0;

  const cac = cu > 0 ? (sp / cu) : 0;
  const clv = r < 100 ? (a * f * (1 / (1 - r / 100))) : 0;
  const ratio = cac > 0 ? clv / cac : 0;

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E7EB]/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-[#F0B429]/10 flex items-center justify-center text-[#F0B429]">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#111827]">حاسبة تكلفة العميل (CAC & CLV)</h2>
          <p className="text-[#9CA3AF] font-medium text-sm">كم تدفع لجلب العميل؟ وكم قيمته على المدى الطويل؟</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#9CA3AF] mb-1">الإنفاق التسويقي</label>
              <input type="number" className="w-full rounded-xl border-2 border-[#E5E7EB] bg-[#F3F4F6] px-4 py-2 font-bold focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/10 text-left" value={spend} onChange={(e) => setSpend(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#9CA3AF] mb-1">العملاء المكتسبين</label>
              <input type="number" className="w-full rounded-xl border-2 border-[#E5E7EB] bg-[#F3F4F6] px-4 py-2 font-bold focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/10 text-left" value={customers} onChange={(e) => setCustomers(e.target.value)} />
            </div>
          </div>
          <div className="border-t border-[#E5E7EB] my-4 pt-4"></div>
          <div>
            <label className="block text-xs font-bold text-[#9CA3AF] mb-1">متوسط قيمة الطلب (درهم)</label>
            <input type="number" className="w-full rounded-xl border-2 border-[#E5E7EB] bg-[#F3F4F6] px-4 py-2 font-bold focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/10 text-left" value={aov} onChange={(e) => setAov(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#9CA3AF] mb-1">مرات الشراء سنوياً</label>
              <input type="number" className="w-full rounded-xl border-2 border-[#E5E7EB] bg-[#F3F4F6] px-4 py-2 font-bold focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/10 text-left" value={frequency} onChange={(e) => setFrequency(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#9CA3AF] mb-1">معدل الاحتفاظ (%)</label>
              <input type="number" max="99" className="w-full rounded-xl border-2 border-[#E5E7EB] bg-[#F3F4F6] px-4 py-2 font-bold focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/10 text-left" value={retention} onChange={(e) => setRetention(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="bg-[#F3F4F6] rounded-2xl p-8 border border-[#E5E7EB] flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="glass-card p-4 rounded-2xl shadow-sm border border-[#E5E7EB]">
              <p className="text-[#9CA3AF] font-bold text-xs mb-1">CAC (تكلفة العميل)</p>
              <div className="text-2xl font-black text-[#111827]">{cac.toFixed(0)} <span className="text-sm font-medium">درهم</span></div>
            </div>
            <div className="glass-card p-4 rounded-2xl shadow-sm border border-[#E5E7EB]">
              <p className="text-[#9CA3AF] font-bold text-xs mb-1">CLV (قيمة العميل)</p>
              <div className="text-2xl font-black text-[#111827]">{clv.toFixed(0)} <span className="text-sm font-medium">درهم</span></div>
            </div>
          </div>
          <div className="bg-[#1E1B4B] p-5 rounded-2xl text-[#111827] flex items-center justify-between">
            <div>
              <p className="text-[#9CA3AF] font-bold text-sm mb-1">نسبة CLV : CAC</p>
              <div className="text-3xl font-black">{ratio > 0 ? `1 : ${ratio.toFixed(1)}` : '0 : 0'}</div>
            </div>
            {ratio > 3 && (
              <div className="bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg text-sm font-bold border border-green-500/30">
                نسبة مثالية ✓
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConversionCalculator() {
  const [visitors, setVisitors] = useState("");
  const [conversions, setConversions] = useState("");
  const [val, setVal] = useState("");

  const v = Number(visitors) || 0;
  const c = Number(conversions) || 0;
  const a = Number(val) || 0;

  const rate = v > 0 ? (c / v) * 100 : 0;
  const total = c * a;

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-[#E5E7EB]/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
          <Target className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#111827]">حاسبة نسبة التحويل (Conversion Rate)</h2>
          <p className="text-[#9CA3AF] font-medium text-sm">قس فعالية موقعك أو صفحة الهبوط في تحويل الزوار إلى عملاء</p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-[#9CA3AF] mb-2">عدد الزوار</label>
              <input type="number" className="w-full rounded-xl border-2 border-[#E5E7EB] bg-[#F3F4F6] px-4 py-3 font-bold focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/10 text-left" value={visitors} onChange={(e) => setVisitors(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#9CA3AF] mb-2">عدد التحويلات</label>
              <input type="number" className="w-full rounded-xl border-2 border-[#E5E7EB] bg-[#F3F4F6] px-4 py-3 font-bold focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/10 text-left" value={conversions} onChange={(e) => setConversions(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-[#9CA3AF] mb-2">متوسط قيمة التحويل الواحد <span className="text-[#9CA3AF] font-normal">- اختياري</span></label>
            <input type="number" className="w-full rounded-xl border-2 border-[#E5E7EB] bg-[#F3F4F6] px-4 py-3 font-bold focus:border-[#CC0000] focus:ring-2 focus:ring-[#CC0000]/10 text-left" value={val} onChange={(e) => setVal(e.target.value)} />
          </div>
        </div>

        <div className="bg-[#CC0000] rounded-2xl p-6 text-white flex flex-col justify-center text-center shadow-lg shadow-[#CC0000]/20">
          <p className="text-white/70 font-bold mb-2">نسبة التحويل</p>
          <div className="text-5xl font-black mb-6">{rate.toFixed(2)}%</div>
          
          <div className="glass-card/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
            <p className="text-white/70 text-xs font-bold mb-1">القيمة الإجمالية</p>
            <div className="text-xl font-bold">{total.toLocaleString()} درهم</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MarketingCalculators() {
  return (
    <div className="space-y-8">
      <RoasCalculator />
      <CacCalculator />
      <ConversionCalculator />
    </div>
  );
}
