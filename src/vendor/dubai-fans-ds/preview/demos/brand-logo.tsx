import { tokens } from '../../generated/tokens';

// Logo asset paths (relative to the public/ dir served by Vite)
const LOGO_512 = new URL('../../../docs/references/logos/logo-512.png', import.meta.url).href;
const LOGO_180 = new URL('../../../docs/references/logos/logo-180.png', import.meta.url).href;

export function BrandLogoDemo() {
  const red = tokens.color.light.primary;
  const gold = tokens.color.light.accent;
  const bg = tokens.color.light.background;
  const border = tokens.color.light.border;
  const fg = tokens.color.light.foreground;
  const muted = tokens.color.light.mutedForeground;

  return (
    <div style={{ fontFamily: 'Cairo, sans-serif', color: fg, direction: 'rtl', padding: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        العلامة التجارية
      </h1>
      <p style={{ color: muted, marginBottom: '2.5rem', fontSize: '0.9rem' }}>
        الشعار الرسمي لدبي فانز — بنسخه وأحجامه وحالات الاستخدام المختلفة.
      </p>

      {/* On-brand preview row */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
        {/* Red background */}
        <div style={{
          background: `linear-gradient(135deg, ${red}, #AA0000)`,
          borderRadius: '1rem',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          minWidth: '200px',
        }}>
          <img src={LOGO_512} alt="Dubai Fans logo" style={{ width: 80, height: 80, borderRadius: '1rem' }} />
          <span style={{ color: '#fff', fontSize: '0.8rem', opacity: 0.8 }}>خلفية حمراء</span>
        </div>

        {/* White background */}
        <div style={{
          background: '#FFFFFF',
          border: `1px solid ${border}`,
          borderRadius: '1rem',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          minWidth: '200px',
        }}>
          <img src={LOGO_512} alt="Dubai Fans logo" style={{ width: 80, height: 80, borderRadius: '1rem' }} />
          <span style={{ color: muted, fontSize: '0.8rem' }}>خلفية بيضاء</span>
        </div>

        {/* Off-white background (app bg) */}
        <div style={{
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: '1rem',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          minWidth: '200px',
        }}>
          <img src={LOGO_512} alt="Dubai Fans logo" style={{ width: 80, height: 80, borderRadius: '1rem' }} />
          <span style={{ color: muted, fontSize: '0.8rem' }}>خلفية التطبيق</span>
        </div>

        {/* Dark background */}
        <div style={{
          background: '#111827',
          borderRadius: '1rem',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          minWidth: '200px',
        }}>
          <img src={LOGO_512} alt="Dubai Fans logo" style={{ width: 80, height: 80, borderRadius: '1rem' }} />
          <span style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>خلفية داكنة</span>
        </div>
      </div>

      {/* Size variants */}
      <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>الأحجام المتاحة</h2>
      <div style={{
        background: '#fff',
        border: `1px solid ${border}`,
        borderRadius: '0.75rem',
        padding: '1.5rem',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '2rem',
        flexWrap: 'wrap',
        marginBottom: '2.5rem',
      }}>
        {[{ size: 16, label: '16 px — Favicon' }, { size: 32, label: '32 px — Browser tab' }, { size: 48, label: '48 px — App list' }, { size: 80, label: '80 px — UI header' }, { size: 120, label: '120 px — Onboarding' }].map(({ size, label }) => (
          <div key={size} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <img src={LOGO_512} alt="" style={{ width: size, height: size, borderRadius: size * 0.15 }} />
            <span style={{ fontSize: '0.7rem', color: muted, whiteSpace: 'nowrap' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Usage rules */}
      <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>قواعد الاستخدام</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
        {[
          { icon: '✅', color: '#10B981', title: 'استخدام صحيح', items: ['الشعار على خلفية صلبة (أحمر، أبيض، رمادي فاتح، داكن)', 'نسبة الأبعاد ثابتة — لا تمديد أو تقليص غير متناسب', 'مساحة فارغة بمقدار حجم الأيقونة من كل جانب'] },
          { icon: '❌', color: '#EF4444', title: 'تجنّب', items: ['وضع الشعار على خلفيات مزدحمة أو صور', 'تغيير ألوان الشعار', 'استخدام نسخة أصغر من 16×16 px'] },
        ].map(({ icon, color, title, items }) => (
          <div key={title} style={{ background: '#fff', border: `1px solid ${border}`, borderRadius: '0.75rem', padding: '1.25rem' }}>
            <div style={{ fontWeight: 700, marginBottom: '0.75rem', color }}>
              {icon} {title}
            </div>
            <ul style={{ margin: 0, paddingRight: '1.25rem', color: fg, fontSize: '0.85rem', lineHeight: 1.8 }}>
              {items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>

      {/* Color palette row */}
      <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: '2rem 0 1rem' }}>ألوان العلامة التجارية</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {[
          { hex: red,      label: 'الأحمر الأساسي', code: '#CC0000' },
          { hex: '#AA0000', label: 'أحمر داكن',       code: '#AA0000' },
          { hex: gold,     label: 'الذهبي',           code: '#D97706' },
          { hex: '#92400E', label: 'ذهبي داكن',        code: '#92400E' },
          { hex: '#111827', label: 'النص الأساسي',     code: '#111827' },
          { hex: '#FAFAFA', label: 'الخلفية',          code: '#FAFAFA', dark: true },
        ].map(({ hex, label, code, dark }) => (
          <div key={code} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
            <div style={{
              width: 56, height: 56,
              borderRadius: '0.75rem',
              background: hex,
              border: dark ? `1px solid ${border}` : undefined,
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            }} />
            <span style={{ fontSize: '0.7rem', color: fg, fontWeight: 600, textAlign: 'center' }}>{label}</span>
            <code style={{ fontSize: '0.65rem', color: muted }}>{code}</code>
          </div>
        ))}
      </div>
    </div>
  );
}
