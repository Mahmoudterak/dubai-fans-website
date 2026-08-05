import { lazy, Suspense } from 'react';
import { CookieBanner } from '@/components/CookieBanner';
import { FloatingChatWidget } from '@/components/FloatingChatWidget';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Redirect, Router as WouterRouter } from 'wouter';

/* ── Code-split: each page is its own JS chunk ───────────────────────── */
const Home               = lazy(() => import('@/pages/Home'));
const BlogList           = lazy(() => import('@/pages/BlogList'));
const BlogPost           = lazy(() => import('@/pages/BlogPost'));
const AdminPage          = lazy(() => import('@/pages/AdminPage'));
const AnalyzePage        = lazy(() => import('@/pages/AnalyzePage'));
const ToolsPage          = lazy(() => import('@/pages/ToolsPage'));
const PrivacyPage        = lazy(() => import('@/pages/PrivacyPage'));
const CertificatePage    = lazy(() => import('@/pages/CertificatePage'));
const SitemapPage        = lazy(() => import('@/pages/SitemapPage'));
const StorePage          = lazy(() => import('@/pages/StorePage'));
const ServicesPage       = lazy(() => import('@/pages/ServicesPage'));
const WebsiteTemplatesPage = lazy(() => import('@/pages/WebsiteTemplatesPage'));
const ServiceInquiryPage = lazy(() => import('@/pages/ServiceInquiryPage'));
const ProjectsPage       = lazy(() => import('@/pages/ProjectsPage'));
const AboutPage          = lazy(() => import('@/pages/AboutPage'));
const ContactPage        = lazy(() => import('@/pages/ContactPage'));
const TermsPage          = lazy(() => import('@/pages/TermsPage'));
const CampaignPolicyPage = lazy(() => import('@/pages/CampaignPolicyPage'));
const RefundPolicyPage   = lazy(() => import('@/pages/RefundPolicyPage'));
const FaqPage            = lazy(() => import('@/pages/FaqPage'));
const CoursesPage        = lazy(() => import('@/pages/CoursesPage'));
const CourseDetailPage    = lazy(() => import('@/pages/courses/CourseDetailPage'));
const CourseRegisterPage  = lazy(() => import('@/pages/courses/CourseRegisterPage'));
const CookiePolicyPage   = lazy(() => import('@/pages/CookiePolicyPage'));
const NotFound             = lazy(() => import('@/pages/not-found'));

const AIBusinessOSPage       = lazy(() => import('@/pages/AIBusinessOSPage'));
const AIBusinessAuditPage    = lazy(() => import('@/pages/AIBusinessAuditPage'));
const AIAuditPage            = lazy(() => import('@/pages/ai-business-os/AuditPage'));
const AIConsultantPage       = lazy(() => import('@/pages/ai-business-os/ConsultantPage'));
const AIDashboardPage        = lazy(() => import('@/pages/ai-business-os/DashboardPage'));
const AIPlannerPage          = lazy(() => import('@/pages/ai-business-os/PlannerPage'));
const AIReportsPage          = lazy(() => import('@/pages/ai-business-os/ReportsPage'));
const AIToolsPage            = lazy(() => import('@/pages/ai-business-os/AIToolsPage'));

/* ── Student portal ──────────────────────────────────────────────── */
const StudentLoginPage     = lazy(() => import('@/pages/student/StudentLoginPage'));
const StudentRegisterPage  = lazy(() => import('@/pages/student/StudentRegisterPage'));
const StudentDashboard     = lazy(() => import('@/pages/student/StudentDashboard'));
const CompanyLoginPage     = lazy(() => import('@/pages/company/CompanyLoginPage'));
const CompanyPortalPage    = lazy(() => import('@/pages/company/CompanyPortalPage'));
const CompanyReportPage    = lazy(() => import('@/pages/company/CompanyReportPage'));
const CompanyArchivePage   = lazy(() => import('@/pages/company/CompanyArchivePage'));
const CompanyUsersPage     = lazy(() => import('@/pages/company/CompanyUsersPage'));
const CompanyForgotPasswordPage = lazy(() => import('@/pages/company/CompanyForgotPasswordPage'));
const CompanyResetPasswordPage  = lazy(() => import('@/pages/company/CompanyResetPasswordPage'));

const BookDemoPage       = lazy(() => import('@/pages/BookDemoPage'));

/* ── Case study pages ────────────────────────────────────────────────── */
const SameDayDentalPage  = lazy(() => import('@/pages/projects/SameDayDentalPage'));
const HealthFactoryPage  = lazy(() => import('@/pages/projects/HealthFactoryPage'));
const MediaCoveragePage  = lazy(() => import('@/pages/projects/MediaCoveragePage'));
const AmlakOSPage        = lazy(() => import('@/pages/projects/AmlakOSPage'));
const ClinicOSPage       = lazy(() => import('@/pages/projects/ClinicOSPage'));

/* ── Keyword-specific service landing pages ──────────────────────────── */
const MetaAdsDubaiPage          = lazy(() => import('@/pages/services/MetaAdsDubaiPage'));
const GoogleAdsUAEPage          = lazy(() => import('@/pages/services/GoogleAdsUAEPage'));
const SEODubaiPage              = lazy(() => import('@/pages/services/SEODubaiPage'));
const SocialMediaManagementPage = lazy(() => import('@/pages/services/SocialMediaManagementPage'));
const WebsiteDesignDubaiPage    = lazy(() => import('@/pages/services/WebsiteDesignDubaiPage'));
const TikTokAdsUAEPage          = lazy(() => import('@/pages/services/TikTokAdsUAEPage'));
const SnapchatAdsDubaiPage      = lazy(() => import('@/pages/services/SnapchatAdsDubaiPage'));
const LinkedInAdsUAEPage        = lazy(() => import('@/pages/services/LinkedInAdsUAEPage'));
// New canonical service pages (task #100)
const PaidAdsPage               = lazy(() => import('@/pages/services/PaidAdsPage'));
const WebDesignPage             = lazy(() => import('@/pages/services/WebDesignPage'));
const SEOPage                   = lazy(() => import('@/pages/services/SEOPage'));
const GraphicDesignPage         = lazy(() => import('@/pages/services/GraphicDesignPage'));
const PhotographyPage           = lazy(() => import('@/pages/services/PhotographyPage'));
const GoogleMyBusinessPage      = lazy(() => import('@/pages/services/GoogleMyBusinessPage'));

const queryClient = new QueryClient();

/** Minimal skeleton shown while any page chunk loads */
function PageLoader() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center" aria-label="جارٍ التحميل…">
      <div className="w-8 h-8 rounded-full border-2 border-[#CC0000] border-t-transparent animate-spin" />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/"                              component={Home} />
        <Route path="/blog"                          component={BlogList} />
        <Route path="/blog/:id"                      component={BlogPost} />
        <Route path="/analyze"                       component={AnalyzePage} />
        <Route path="/tools"                         component={ToolsPage} />
        {/* Pricing merged into the store page */}
        <Route path="/pricing">{() => <Redirect to="/store#pricing" replace />}</Route>
        <Route path="/privacy"                       component={PrivacyPage} />
        <Route path="/certificate"                   component={CertificatePage} />
        <Route path="/sitemap"                       component={SitemapPage} />
        <Route path="/store"                         component={StorePage} />
        <Route path="/services"                      component={ServicesPage} />
        <Route path="/website-templates"             component={WebsiteTemplatesPage} />
        <Route path="/services/meta-ads-dubai"       component={MetaAdsDubaiPage} />
        <Route path="/services/google-ads-uae"       component={GoogleAdsUAEPage} />
        <Route path="/services/seo-dubai"            component={SEODubaiPage} />
        <Route path="/services/social-media-management" component={SocialMediaManagementPage} />
        <Route path="/services/website-design-dubai" component={WebsiteDesignDubaiPage} />
        <Route path="/services/tiktok-ads-uae"       component={TikTokAdsUAEPage} />
        <Route path="/services/snapchat-ads-dubai"   component={SnapchatAdsDubaiPage} />
        <Route path="/services/linkedin-ads-uae"     component={LinkedInAdsUAEPage} />
        {/* New canonical service pages */}
        <Route path="/services/paid-ads"             component={PaidAdsPage} />
        <Route path="/services/web-design"           component={WebDesignPage} />
        <Route path="/services/seo"                  component={SEOPage} />
        <Route path="/services/graphic-design"       component={GraphicDesignPage} />
        <Route path="/services/photography"          component={PhotographyPage} />
        <Route path="/services/google-my-business"   component={GoogleMyBusinessPage} />
        <Route path="/service-inquiry/:id"           component={ServiceInquiryPage} />
        <Route path="/projects"                      component={ProjectsPage} />
        <Route path="/projects/sameday-dental"       component={SameDayDentalPage} />
        <Route path="/projects/health-factory"        component={HealthFactoryPage} />
        <Route path="/projects/media-coverage"        component={MediaCoveragePage} />
        <Route path="/projects/amlak-os"             component={AmlakOSPage} />
        <Route path="/projects/clinic-os"            component={ClinicOSPage} />
        <Route path="/about"                         component={AboutPage} />
        <Route path="/contact"                       component={ContactPage} />
        <Route path="/terms"                         component={TermsPage} />
        <Route path="/campaign-policy"               component={CampaignPolicyPage} />
        <Route path="/refund-policy"                 component={RefundPolicyPage} />
        <Route path="/faq"                           component={FaqPage} />
        <Route path="/courses"                          component={CoursesPage} />
        <Route path="/courses/:slug/register"         component={CourseRegisterPage} />
        <Route path="/courses/:slug"                  component={CourseDetailPage} />
        <Route path="/cookie-policy"                 component={CookiePolicyPage} />
        <Route path="/ai-business-audit"             component={AIBusinessAuditPage} />
        <Route path="/ai-business-os"                component={AIBusinessOSPage} />
        <Route path="/ai-business-os/audit"          component={AIAuditPage} />
        <Route path="/ai-business-os/consultant"     component={AIConsultantPage} />
        <Route path="/ai-business-os/dashboard"      component={AIDashboardPage} />
        <Route path="/ai-business-os/planner"        component={AIPlannerPage} />
        <Route path="/ai-business-os/reports"        component={AIReportsPage} />
        <Route path="/ai-business-os/tools"          component={AIToolsPage} />
        <Route path="/admin"                         component={AdminPage} />
        <Route path="/admin/enrollments"             component={AdminPage} />
        {/* Student portal */}
        <Route path="/student/login"               component={StudentLoginPage} />
        <Route path="/student/register"            component={StudentRegisterPage} />
        <Route path="/student/dashboard"           component={StudentDashboard} />
        {/* Client performance portal */}
        <Route path="/company/login"                          component={CompanyLoginPage} />
        <Route path="/company/forgot-password"                component={CompanyForgotPasswordPage} />
        <Route path="/company/reset-password"                 component={CompanyResetPasswordPage} />
        <Route path="/company/:slug/report/:reportId"         component={CompanyReportPage} />
        <Route path="/company/:slug/archive"                  component={CompanyArchivePage} />
        <Route path="/company/:slug/users"                    component={CompanyUsersPage} />
        <Route path="/company/:slug"                          component={CompanyPortalPage} />
        <Route path="/book-demo"                     component={BookDemoPage} />
        <Route                                       component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
        <CookieBanner />
        <FloatingChatWidget />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
