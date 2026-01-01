
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Globe, Menu, X, Newspaper, ShieldCheck, Users, BookOpen, Download, 
  Mail, Phone, MapPin, Facebook, Twitter, Linkedin, ArrowRight,
  ChevronLeft, ChevronRight, ExternalLink, Award, Lock, MessageSquare,
  Target, UserCheck, Settings, Plus, Trash2, Edit3, Image as ImageIcon,
  Calendar, Eye, FileText, Video, Briefcase, Handshake, Truck, LogIn,
  LogOut, LayoutDashboard, FileUp, Search, Filter, ChevronDown, Tag,
  Clock, CheckCircle2, AlertCircle, Send, Radio, BarChart,
  Maximize2, Activity, LifeBuoy, AlertTriangle, Map, Instagram, Youtube,
  Hash, ChevronUp, Layers, ListTree, TrendingUp, Sparkles, Zap
} from 'lucide-react';

// --- Types ---
type ContentType = 'news' | 'program' | 'resource' | 'opportunity' | 'video' | 'project' | 'violation';

interface Post {
  id: string;
  type: ContentType;
  title_ar: string;
  title_en: string;
  desc_ar: string;
  desc_en: string;
  date: string;
  image: string;
  category_ar: string;
  category_en: string;
}

interface Stat {
  label_ar: string;
  label_en: string;
  value: number;
  icon: React.ElementType;
}

// --- Constants ---
const INITIAL_STATS: Stat[] = [
  { label_ar: 'إجمالي التقارير', label_en: 'Total Reports', value: 1250, icon: FileText },
  { label_ar: 'توضيحات مؤكدة', label_en: 'Verified Discrepancies', value: 450, icon: CheckCircle2 },
  { label_ar: 'انتهاكات نشطة', label_en: 'Active Violations', value: 85, icon: AlertCircle },
  { label_ar: 'صحفيون متدربون', label_en: 'Trained Journalists', value: 3200, icon: Users },
];

const VIOLATION_STATS: Stat[] = [
  { label_ar: 'اعتقالات تعسفية', label_en: 'Arbitrary Detentions', value: 42, icon: Lock },
  { label_ar: 'اعتداءات جسدية', label_en: 'Physical Assaults', value: 128, icon: Activity },
  { label_ar: 'حجب وتهديد', label_en: 'Censorship & Threats', value: 215, icon: ShieldCheck },
  { label_ar: 'قتل خارج القانون', label_en: 'Extrajudicial Killings', value: 12, icon: AlertTriangle },
];

const YEMEN_REGIONS = [
  { id: 'sanaa', name_ar: 'صنعاء', name_en: 'Sana\'a', count: 45, x: 45, y: 40 },
  { id: 'aden', name_ar: 'عدن', name_en: 'Aden', count: 32, x: 50, y: 85 },
  { id: 'taiz', name_ar: 'تعز', name_en: 'Taiz', count: 68, x: 35, y: 80 },
  { id: 'marib', name_ar: 'مأرب', name_en: 'Marib', count: 24, x: 55, y: 45 },
  { id: 'hadramout', name_ar: 'حضرموت', name_en: 'Hadramout', count: 18, x: 75, y: 55 },
  { id: 'hodeidah', name_ar: 'الحديدة', name_en: 'Hodeidah', count: 37, x: 25, y: 50 },
];

const initialPosts: Post[] = [
  {
    id: 'p1',
    type: 'project',
    title_ar: 'مشروع إحياء القيم الصحفية',
    title_en: 'Reviving Journalistic Values Project',
    desc_ar: 'يهدف المشروع إلى إحياء القيم المهنية للصحافة من خلال إحياء ذكرى أعلام الصحافة في اليمن والاحتفاء بالقيم التي تمثلوها.',
    desc_en: 'Reviving professional values by honoring prominent journalists in Yemen and celebrating their ethics.',
    date: '2024-01-01',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1470&auto=format&fit=crop',
    category_ar: 'مشاريع',
    category_en: 'Projects'
  },
  {
    id: 'n1',
    type: 'news',
    title_ar: 'ورشة عمل حول التحقق من المعلومات المضللة',
    title_en: 'Workshop on Verifying Misinformation',
    desc_ar: 'عقدت مؤسسة بيت الصحافة ورشة عمل مكثفة للصحفيين حول أدوات التحقق الرقمي.',
    desc_en: 'Press House Foundation held an intensive workshop for journalists on digital verification tools.',
    date: '2024-03-20',
    image: 'https://images.unsplash.com/photo-1591115765373-520b7a3d72b7?q=80&w=1470&auto=format&fit=crop',
    category_ar: 'أخبار',
    category_en: 'News'
  }
];

// --- Translations ---
const translations = {
  ar: {
    dir: 'rtl',
    lang: 'ar',
    orgName: 'بيت الصحافة',
    breaking: 'عاجل من المرصد',
    nav: {
      home: 'الرئيسية',
      about: 'عن المؤسسة',
      objectives: 'الأهداف',
      projects: 'مشاريعنا',
      observatory: 'مرصد الانتهاكات',
      contact: 'اتصل بنا',
      cms: 'لوحة التحكم',
      switch: 'English',
      logout: 'تسجيل الخروج'
    },
    auth: { login: 'دخول المسؤول' },
    hero: {
      tag: 'منصة الحريات الإعلامية الأولى في اليمن',
      title: 'صحافة مهنية حرة أولويتها الإنسان',
      subtitle: 'نعمل من أجل تعزيز حرية الإعلام وخلق مساحة نقاش مهني وعملي للصحفيين في اليمن، لنكون صوت من لا صوت له.',
    },
    about: {
      introTitle: 'هويتنا ورؤيتنا',
      title: 'نحن حماة الكلمة الحرة',
      intro: 'مؤسسة يمنية مستقلة تسعى لاستعادة كرامة الصحافة وحماية العاملين فيها.',
      // Added missing introText property
      introText: 'تأسست مؤسسة بيت الصحافة لتكون منبراً حراً ومستقلاً يدعم العمل الصحفي المهني في اليمن، ويوفر بيئة آمنة للإبداع والنمو المهني.',
      vision: 'رؤية طموحة',
      visionText: 'صحافة يمنية مهنية ومستقلة تخدم الحقيقة والإنسان.',
      mission: 'رسالة مقدسة',
      missionText: 'الدفاع عن حقوق الصحفيين وتطوير قدراتهم المهنية في ظل التحديات الراهنة.'
    },
    observatory: {
      title: 'مرصد انتهاكات حرية الصحافة',
      subtitle: 'نظام رصد تفاعلي لتتبع وتوثيق الانتهاكات التي يتعرض لها الصحفيون في مختلف المحافظات اليمنية.',
      mapTitle: 'غرفة عمليات الرصد التفاعلية',
      statsTitle: 'أرقام من الميدان',
      reportTitle: 'تبليغ آمن عن انتهاك',
      form: {
        victimName: 'اسم الضحية',
        violationType: 'نوع الانتهاك',
        date: 'تاريخ الواقعة',
        location: 'المحافظة',
        description: 'تفاصيل الواقعة',
        evidence: 'إرفاق أدلة (صور/مستندات)',
        submit: 'إرسال البلاغ فوراً'
      },
      legend: 'عدد الانتهاكات المرصودة'
    },
    stats: {
      title: 'الأثر والشفافية بالأرقام',
      subtitle: 'بيانات دقيقة ومحدثة تعكس حالة الحريات الإعلامية.'
    },
    objectives: {
      title: 'أهدافنا الاستراتيجية',
      items: [
        'خلق مساحات نقاش عملية ومهنية للصحفيين.',
        'توفير حاضنة أعمال ومساحات عمل مجانية.',
        'استعادة فاعلية الصحافة ودورها التنموي.',
        'الارتقاء بالقدرات المهنية والاستقلالية.',
        'بناء شراكات أكاديمية لتدريب الخريجين.',
        'مناصره قضايا الحريات والانتهاكات.'
      ]
    },
    sitemap: {
      title: 'خريطة الموقع والوصول السريع',
      sections: {
        foundation: 'المؤسسة',
        data: 'المرصد والبيانات',
        content: 'المحتوى والإنتاج',
        support: 'الدعم القانوني'
      }
    },
    contact: {
      title: 'تواصل معنا الآن',
      address: 'اليمن - تعز - شارع جمال',
      phone: '04-210613',
      email: 'info@phye.org',
      website: 'www.phye.org'
    },
    footer: {
      rights: 'جميع الحقوق محفوظة © ٢٠24 مؤسسة بيت الصحافة',
      quickLinks: 'روابط هامة',
      followUs: 'منصات التواصل',
      news: 'آخر الأخبار',
      projects: 'المشاريع',
      reports: 'التقارير'
    }
  },
  en: {
    dir: 'ltr',
    lang: 'en',
    orgName: 'Press House',
    breaking: 'Observatory Update',
    nav: {
      home: 'Home',
      about: 'About',
      objectives: 'Objectives',
      projects: 'Projects',
      observatory: 'Observatory',
      contact: 'Contact',
      cms: 'Admin',
      switch: 'العربية',
      logout: 'Logout'
    },
    auth: { login: 'Admin Login' },
    hero: {
      tag: 'Yemen\'s Premier Media Freedom Platform',
      title: 'Professional Press with Human Priority',
      subtitle: 'Enhancing media freedom and creating professional debate spaces for Yemeni journalists.',
    },
    about: {
      introTitle: 'Our Identity',
      title: 'Guardians of Free Speech',
      intro: 'Independent Yemeni foundation restoring journalistic dignity.',
      // Added missing introText property
      introText: 'Press House Foundation was established to be a free and independent platform supporting professional journalism in Yemen, providing a safe environment for creativity and professional growth.',
      vision: 'Ambitious Vision',
      visionText: 'Professional and independent Yemeni press serving truth.',
      mission: 'Sacred Mission',
      missionText: 'Defending journalists\' rights and developing their skills.'
    },
    observatory: {
      title: 'Media Freedom Observatory',
      subtitle: 'Interactive monitoring system tracking violations across Yemen.',
      mapTitle: 'Interactive Ops Room',
      statsTitle: 'Field Data',
      reportTitle: 'Secure Reporting',
      form: {
        victimName: 'Victim Name',
        violationType: 'Type',
        date: 'Date',
        location: 'Location',
        description: 'Details',
        evidence: 'Attach Evidence',
        submit: 'Report Now'
      },
      legend: 'Monitored Violations'
    },
    stats: {
      title: 'Impact in Real Numbers',
      subtitle: 'Accurate data reflecting media freedom status.'
    },
    objectives: {
      title: 'Strategic Goals',
      items: [
        'Create professional debate spaces.',
        'Provide incubators and workspaces.',
        'Restore press developmental role.',
        'Upgrade professional independence.',
        'Build academic partnerships.',
        'Advocate for freedom and rights.'
      ]
    },
    sitemap: {
      title: 'Sitemap & Quick Access',
      sections: {
        foundation: 'Foundation',
        data: 'Observatory Data',
        content: 'Media Content',
        support: 'Legal Support'
      }
    },
    contact: {
      title: 'Contact Us Now',
      address: 'Yemen - Taiz',
      phone: '04-210613',
      email: 'info@phye.org',
      website: 'www.phye.org'
    },
    footer: {
      rights: 'All Rights Reserved © 2024 Press House',
      quickLinks: 'Quick Links',
      followUs: 'Social Media',
      news: 'Latest News',
      projects: 'Projects',
      reports: 'Reports'
    }
  }
};

const App = () => {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isCmsOpen, setIsCmsOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [selectedRegion, setSelectedRegion] = useState<typeof YEMEN_REGIONS[0] | null>(null);

  const t = useMemo(() => translations[lang], [lang]);

  useEffect(() => {
    document.documentElement.lang = t.lang;
    document.documentElement.dir = t.dir;
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [t]);

  const toggleLang = useCallback(() => setLang(prev => (prev === 'ar' ? 'en' : 'ar')), []);

  const navItems = useMemo(() => [
    { name: t.nav.home, href: '#home', icon: Globe },
    { name: t.nav.about, href: '#about', icon: Users },
    { name: t.nav.projects, href: '#projects', icon: Briefcase },
    { name: t.nav.observatory, href: '#observatory', icon: Eye },
    { name: t.nav.contact, href: '#contact', icon: Mail },
  ], [t]);

  // --- Components ---

  const BreakingTicker = () => (
    <div className="bg-[#D4AF37] text-[#00338D] py-3 overflow-hidden whitespace-nowrap relative z-20 shadow-lg border-b border-[#00338D]/10">
      <div className="container mx-auto px-6 flex items-center">
        <div className="flex items-center gap-2 bg-[#00338D] text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest mr-4">
          <TrendingUp size={14} /> {t.breaking}
        </div>
        <div className="flex animate-marquee gap-10 font-bold text-sm">
          <span>• {lang === 'ar' ? 'رصد ٣ انتهاكات جديدة في محافظة تعز خلال الـ ٢٤ ساعة الماضية' : '3 new violations recorded in Taiz in the last 24 hours'}</span>
          <span>• {lang === 'ar' ? 'إطلاق تقرير حرية الصحافة السنوي لعام ٢٠٢٣' : '2023 Annual Press Freedom Report Launched'}</span>
          <span>• {lang === 'ar' ? 'بدء ورشة عمل "السلامة المهنية للصحفيين" في مأرب' : 'Professional Safety Workshop for Journalists started in Marib'}</span>
          <span>• {lang === 'ar' ? 'تضامن واسع مع الصحفيين المعتقلين في السجون' : 'Massive solidarity with journalists in detentions'}</span>
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );

  const ObservatorySection = () => (
    <section id="observatory" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute -left-20 top-0 w-80 h-80 bg-red-50 rounded-full blur-[120px] opacity-40"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-red-50 text-red-600 rounded-2xl font-black text-xs uppercase tracking-[0.2em] mb-6 border border-red-100 shadow-sm animate-pulse">
            <Radio size={14} /> {lang === 'ar' ? 'مباشر: مركز الرصد' : 'Live: Monitoring Center'}
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-[#00338D] mb-8 leading-tight tracking-tighter">{t.observatory.title}</h2>
          <p className="text-xl text-slate-500 font-bold leading-relaxed">{t.observatory.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 bg-white rounded-[4rem] p-6 md:p-12 border border-slate-100 shadow-[0_50px_100px_rgba(0,0,0,0.08)] relative min-h-[600px] flex flex-col group">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-black text-[#00338D] flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#D4AF37] shadow-inner">
                  <Map size={24} />
                </div>
                {t.observatory.mapTitle}
              </h3>
              <div className="px-5 py-2.5 bg-green-50 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border border-green-100">
                System Active
              </div>
            </div>
            
            <div className="flex-1 relative bg-slate-50 rounded-[3rem] border border-slate-200/50 overflow-hidden shadow-inner p-10">
               <svg viewBox="0 0 100 100" className="w-full h-full text-slate-300 fill-current transform scale-125 filter drop-shadow-2xl">
                 <path d="M10,40 L30,30 L50,35 L80,30 L90,50 L85,70 L60,85 L40,90 L20,80 L10,60 Z" className="opacity-30 hover:opacity-50 transition-opacity cursor-default" />
                 {YEMEN_REGIONS.map((region) => (
                   <g key={region.id} className="cursor-pointer group/pin" onClick={() => setSelectedRegion(region)}>
                     <circle cx={region.x} cy={region.y} r={4 + (region.count / 10)} className={`fill-red-500/20 stroke-red-500 stroke-2 transition-all duration-500 ${selectedRegion?.id === region.id ? 'fill-red-600 r-10 scale-150' : 'group-hover/pin:fill-red-500/40'}`} />
                     <circle cx={region.x} cy={region.y} r="3" className="fill-red-600 animate-ping" />
                     <circle cx={region.x} cy={region.y} r="2" className="fill-red-700" />
                   </g>
                 ))}
               </svg>

               {selectedRegion && (
                 <div className="absolute bottom-10 right-10 left-10 md:left-auto md:w-96 bg-white/95 backdrop-blur-xl p-10 rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.2)] border border-slate-100 animate-in zoom-in-95 duration-500">
                    <button onClick={() => setSelectedRegion(null)} className="absolute top-8 right-8 p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20}/></button>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center text-2xl shadow-sm">
                        <Activity size={28} />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-[#00338D]">{lang === 'ar' ? selectedRegion.name_ar : selectedRegion.name_en}</h4>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Governorate Status</span>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="flex justify-between items-end border-b border-slate-100 pb-4">
                        <div className="text-5xl font-black text-red-600 tracking-tighter">{selectedRegion.count}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Cases</div>
                      </div>
                      <button className="w-full py-5 bg-[#00338D] text-white rounded-2xl font-black text-sm hover:bg-[#D4AF37] transition-all flex items-center justify-center gap-3 active:scale-95">
                        {lang === 'ar' ? 'عرض السجل الكامل' : 'View Full Logs'} <ArrowRight size={18} className={lang === 'ar' ? 'rotate-180' : ''} />
                      </button>
                    </div>
                 </div>
               )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-[#00338D] text-white p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group border border-white/10">
              <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-[#D4AF37]/20 transition-colors">
                <AlertTriangle size={150} />
              </div>
              <h3 className="text-3xl font-black mb-6 relative z-10 flex items-center gap-4">
                <Zap className="text-[#D4AF37]" size={32} />
                {t.observatory.reportTitle}
              </h3>
              <p className="text-blue-100/70 font-bold mb-10 relative z-10 leading-relaxed text-sm">{lang === 'ar' ? 'بلاغك محمي بنظام تشفير كامل لضمان سلامتك.' : 'Secure encrypted reporting system.'}</p>
              
              <form className="space-y-6 relative z-10">
                <input type="text" placeholder={t.observatory.form.victimName} className="w-full px-8 py-6 rounded-3xl bg-white/10 border-none text-white font-bold placeholder:text-blue-200/40 focus:bg-white/15 transition-all outline-none" />
                <div className="grid grid-cols-1 gap-4">
                    <select className="w-full px-8 py-6 rounded-3xl bg-white/10 border-none text-white font-bold focus:bg-white/15 outline-none appearance-none">
                      <option className="text-slate-900">{t.observatory.form.violationType}</option>
                      <option className="text-slate-900">Physical Assault</option>
                      <option className="text-slate-900">Arbitrary Arrest</option>
                      <option className="text-slate-900">Censorship</option>
                    </select>
                </div>
                <button className="w-full py-6 bg-[#D4AF37] hover:bg-white hover:text-[#00338D] text-white rounded-[2rem] font-black text-xl transition-all shadow-xl flex items-center justify-center gap-4 active:scale-95 group/btn">
                  <Send size={24} className="group-hover/btn:translate-x-1 transition-transform" />
                  {t.observatory.form.submit}
                </button>
              </form>
            </div>

            <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200/50">
               <h4 className="text-lg font-black text-[#00338D] mb-8 uppercase tracking-widest">{lang === 'ar' ? 'إحصائيات فورية' : 'Quick Stats'}</h4>
               <div className="space-y-6">
                 {VIOLATION_STATS.slice(0, 3).map((stat, i) => (
                   <div key={i} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-sm group-hover:rotate-12 transition-transform">
                          <stat.icon size={22} />
                        </div>
                        <span className="font-bold text-slate-600 text-sm">{lang === 'ar' ? stat.label_ar : stat.label_en}</span>
                      </div>
                      <span className="text-2xl font-black text-[#00338D]">{stat.value}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className={`min-h-screen flex flex-col bg-white text-slate-900 overflow-x-hidden ${lang === 'en' ? 'font-en' : 'font-ar'}`}>
      
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-[#00338D]/5 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[150px]"></div>
      </div>

      <nav className={`fixed w-full z-[60] transition-all duration-700 ${isScrolled ? 'bg-white/90 backdrop-blur-2xl shadow-2xl py-3 border-b border-slate-100' : 'bg-transparent py-8'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-5 group cursor-pointer">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all duration-700 transform ${isScrolled ? 'bg-[#00338D] rotate-0 scale-90' : 'bg-white/10 rotate-[15deg] group-hover:rotate-0 border border-white/20'}`}>
              <Newspaper size={28} />
            </div>
            <div className="flex flex-col">
              <span className={`text-3xl font-black tracking-tighter transition-colors ${isScrolled ? 'text-[#00338D]' : 'text-white'}`}>{t.orgName}</span>
              <div className="flex items-center gap-1.5 mt-1">
                <div className={`w-2 h-2 rounded-full animate-pulse ${isScrolled ? 'bg-[#D4AF37]' : 'bg-white'}`}></div>
                <span className={`text-[10px] font-black uppercase tracking-[0.5em] transition-colors ${isScrolled ? 'text-slate-400' : 'text-white/60'}`}>Press Integrity</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 mx-8 bg-slate-900/5 backdrop-blur-md p-2 rounded-3xl border border-white/10">
              {navItems.map((link) => (
                <a key={link.href} href={link.href} className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 group ${isScrolled ? 'text-blue-900 hover:bg-white hover:shadow-xl' : 'text-white hover:bg-white/20'}`}>
                  <link.icon size={16} className="group-hover:scale-110 transition-transform text-[#D4AF37]" />
                  {link.name}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={toggleLang} className={`px-5 py-3 rounded-2xl border-2 transition-all text-xs font-black tracking-widest shadow-sm ${isScrolled ? 'border-slate-100 bg-white text-blue-950 hover:bg-slate-50' : 'border-white/20 bg-white/10 text-white hover:bg-white/20'}`}>
                {lang === 'ar' ? 'ENGLISH' : 'العربية'}
              </button>
              <button onClick={() => isLoggedIn ? setIsCmsOpen(true) : setShowLogin(true)} className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#D4AF37] text-[#00338D] hover:bg-white hover:shadow-2xl hover:scale-105 transition-all font-black text-sm active:scale-95 shadow-lg">
                {isLoggedIn ? <LayoutDashboard size={18} /> : <Lock size={18} />}
                <span>{isLoggedIn ? t.nav.cms : t.auth.login}</span>
              </button>
            </div>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`lg:hidden p-4 rounded-2xl ${isScrolled ? 'text-[#00338D] bg-slate-50' : 'text-white bg-white/10'}`}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Modern Hero Section */}
      <section id="home" className="relative min-h-screen bg-[#00338D] overflow-hidden flex flex-col justify-center">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover opacity-15 scale-110 blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#00338D]/80 via-[#00338D] to-white"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 pt-20">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 text-[#D4AF37] font-black text-xs uppercase tracking-[0.3em] mb-12 shadow-2xl animate-fade-in-down">
              <Sparkles size={16} /> {t.hero.tag}
            </div>
            <h1 className="text-6xl md:text-9xl font-black text-white leading-[0.95] mb-12 tracking-tighter drop-shadow-2xl">
              {t.hero.title.split(' ').map((word, i) => (
                <span key={i} className={i === 2 || i === 3 ? 'text-[#D4AF37] relative inline-block' : ''}>
                    {word} 
                    {i === 2 && <div className="absolute -bottom-2 left-0 w-full h-4 bg-white/5 -z-10 blur-md"></div>}
                    &nbsp;
                </span>
              ))}
            </h1>
            <p className="text-xl md:text-4xl text-blue-100/70 font-bold mb-16 max-w-3xl leading-relaxed animate-fade-in-up">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-8 items-center">
              <a href="#observatory" className="px-14 py-7 bg-[#D4AF37] text-[#00338D] rounded-[2rem] font-black text-2xl hover:bg-white hover:shadow-[0_20px_60px_rgba(212,175,55,0.4)] transition-all flex items-center gap-5 group shadow-xl">
                {t.nav.observatory} <ArrowRight className={`group-hover:translate-x-2 transition-transform ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </a>
              <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                      <div key={i} className="w-14 h-14 rounded-2xl border-4 border-[#00338D] overflow-hidden bg-slate-200">
                          <img src={`https://i.pravatar.cc/150?u=${i}`} className="w-full h-full object-cover" />
                      </div>
                  ))}
                  <div className="w-14 h-14 rounded-2xl border-4 border-[#00338D] bg-white text-[#00338D] flex items-center justify-center font-black text-xs">
                      +3k
                  </div>
              </div>
              <span className="text-white/50 font-bold text-sm tracking-widest">{lang === 'ar' ? 'انضم لشبكتنا الصحفية' : 'Join our network'}</span>
            </div>
          </div>
        </div>
      </section>

      <BreakingTicker />

      {/* Pillars Section */}
      <section className="py-24 bg-white relative">
          <div className="container mx-auto px-6">
              <div className="grid md:grid-cols-3 gap-10">
                  {[
                      { icon: ShieldCheck, title_ar: 'حماية وحصانة', title_en: 'Protection', desc_ar: 'نقف سداً منيعاً أمام الانتهاكات التي تستهدف الأقلام الحرة.', desc_en: 'Standing against all violations.' },
                      { icon: BookOpen, title_ar: 'بناء وتطوير', title_en: 'Development', desc_ar: 'برامج تدريبية احترافية تواكب أحدث المعايير العالمية.', desc_en: 'Advanced training programs.' },
                      { icon: Handshake, title_ar: 'تشبيك ومناصرة', title_en: 'Advocacy', desc_ar: 'بناء جسور التواصل مع المجتمع الصحفي الدولي.', desc_en: 'Connecting with global media.' }
                  ].map((pillar, i) => (
                      <div key={i} className="group p-12 bg-slate-50 rounded-[4rem] hover:bg-[#00338D] transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_50px_80px_rgba(0,51,141,0.2)] border border-slate-100">
                          <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-[#00338D] mb-10 group-hover:bg-[#D4AF37] group-hover:rotate-[15deg] transition-all duration-500 shadow-xl">
                              <pillar.icon size={40} />
                          </div>
                          <h3 className="text-3xl font-black text-[#00338D] mb-6 group-hover:text-white transition-colors">
                              {lang === 'ar' ? pillar.title_ar : pillar.title_en}
                          </h3>
                          <p className="text-slate-500 font-bold leading-relaxed group-hover:text-blue-100/70 transition-colors">
                              {lang === 'ar' ? pillar.desc_ar : pillar.desc_en}
                          </p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black text-[#00338D] mb-6 tracking-tighter">{t.stats.title}</h2>
            <p className="text-xl text-slate-500 font-bold max-w-2xl mx-auto">{t.stats.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {INITIAL_STATS.map((stat, idx) => (
              <div key={idx} className="bg-white p-12 rounded-[4rem] text-center group hover:shadow-2xl transition-all border border-slate-100 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-slate-50 rounded-full group-hover:bg-[#D4AF37]/10 transition-colors -z-0"></div>
                <div className="w-20 h-20 bg-slate-50 text-[#00338D] rounded-[2rem] flex items-center justify-center mx-auto mb-8 group-hover:bg-[#00338D] group-hover:text-white transition-all shadow-inner relative z-10">
                  <stat.icon size={36} />
                </div>
                <div className="text-6xl font-black text-[#00338D] mb-4 tracking-tighter tabular-nums relative z-10">
                    {stat.value.toLocaleString()}
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 group-hover:text-[#D4AF37] transition-colors relative z-10">
                  {lang === 'ar' ? stat.label_ar : stat.label_en}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="aspect-[4/5] rounded-[5rem] overflow-hidden shadow-[0_80px_100px_rgba(0,0,0,0.1)] border-[16px] border-slate-50">
                <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-16 -right-16 bg-[#00338D] p-12 rounded-[4rem] shadow-2xl border border-white/10 max-w-sm">
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-14 h-14 bg-[#D4AF37] text-[#00338D] rounded-3xl flex items-center justify-center shadow-lg">
                    <CheckCircle2 size={28} />
                  </div>
                  <span className="font-black text-3xl text-white">Trust</span>
                </div>
                <p className="text-sm font-bold text-blue-100/60 leading-relaxed">
                    {lang === 'ar' ? 'نلتزم بأعلى معايير النزاهة والحيادية في كل تقاريرنا وبياناتنا الميدانية.' : 'Committed to the highest standards of integrity and neutrality in all reports.'}
                </p>
              </div>
            </div>
            
            <div className="space-y-12 order-1 lg:order-2">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50 text-[#00338D] rounded-2xl font-black text-xs uppercase tracking-widest border border-blue-100">
                  <Users size={16} /> {t.about.introTitle}
                </div>
                <h2 className="text-5xl md:text-7xl font-black text-[#00338D] leading-[1.1] tracking-tighter">{t.about.title}</h2>
                <p className="text-2xl font-bold text-slate-600 leading-relaxed italic border-l-8 border-[#D4AF37] pl-8">
                  "{t.about.intro}"
                </p>
                <p className="text-xl text-slate-500 font-medium leading-relaxed">
                  {t.about.introText}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="p-10 bg-slate-50 rounded-[3.5rem] border border-slate-100 hover:shadow-2xl transition-all">
                  <Target className="text-[#D4AF37] mb-8" size={48} />
                  <h3 className="text-2xl font-black text-[#00338D] mb-4">{t.about.vision}</h3>
                  <p className="font-bold text-slate-500 leading-relaxed text-sm">{t.about.visionText}</p>
                </div>
                <div className="p-10 bg-[#00338D] text-white rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                  <ShieldCheck className="text-[#D4AF37] mb-8 relative z-10" size={48} />
                  <h3 className="text-2xl font-black mb-4 relative z-10">{t.about.mission}</h3>
                  <p className="font-bold text-blue-100/70 leading-relaxed text-sm relative z-10">{t.about.missionText}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ObservatorySection />

      {/* Magazine Style Projects */}
      <section id="projects" className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-7xl font-black text-[#00338D] mb-6 tracking-tighter">{t.nav.projects}</h2>
              <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Transforming the media landscape through innovation</p>
            </div>
            <button className="flex items-center gap-4 px-10 py-5 bg-slate-50 hover:bg-[#D4AF37] hover:text-white text-[#00338D] font-black rounded-3xl transition-all shadow-sm">
              {lang === 'ar' ? 'استعراض الأرشيف' : 'Browse Archive'} <Layers size={22} />
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
            {posts.filter(p => p.type === 'project').map(project => (
              <div key={project.id} className="group cursor-pointer">
                <div className="aspect-[16/11] relative overflow-hidden rounded-[4rem] mb-10 shadow-2xl">
                  <img src={project.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#00338D]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                      <span className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl text-[#00338D] text-[10px] font-black uppercase tracking-widest">{project.date}</span>
                      <div className="w-12 h-12 bg-[#D4AF37] rounded-xl flex items-center justify-center text-[#00338D] shadow-lg">
                          <ArrowRight size={20} className={lang === 'ar' ? 'rotate-180' : ''} />
                      </div>
                  </div>
                </div>
                <div className="px-4">
                  <div className="inline-block text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                      {lang === 'ar' ? project.category_ar : project.category_en}
                  </div>
                  <h3 className="text-3xl font-black text-[#00338D] mb-6 group-hover:text-[#D4AF37] transition-colors line-clamp-2 leading-tight">
                      {lang === 'ar' ? project.title_ar : project.title_en}
                  </h3>
                  <p className="text-slate-500 font-bold leading-relaxed line-clamp-3">
                      {lang === 'ar' ? project.desc_ar : project.desc_en}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer & Sitemap */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            {[
              { 
                title: t.sitemap.sections.foundation, 
                links: [t.nav.home, t.nav.about, t.nav.objectives, t.nav.contact],
                icon: Users, color: 'text-blue-600'
              },
              { 
                title: t.sitemap.sections.data, 
                links: [t.observatory.mapTitle, t.observatory.statsTitle, t.observatory.reportTitle],
                icon: Activity, color: 'text-red-600'
              },
              { 
                title: t.sitemap.sections.content, 
                links: [t.nav.projects, t.footer.news, t.footer.reports, 'Training Hub'],
                icon: BookOpen, color: 'text-amber-600'
              },
              { 
                title: t.sitemap.sections.support, 
                links: ['Legal Clinic', 'Safety Protocols', 'Grants'],
                icon: ShieldCheck, color: 'text-green-600'
              }
            ].map((section, idx) => (
              <div key={idx} className="space-y-8">
                <h3 className={`text-xl font-black flex items-center gap-3 uppercase tracking-widest ${section.color}`}>
                  <section.icon size={22} />
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link, lidx) => (
                    <li key={lidx}>
                      <a href="#" className="text-slate-500 hover:text-[#00338D] font-bold text-sm flex items-center gap-3 group transition-all">
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full group-hover:w-4 group-hover:bg-[#D4AF37] transition-all"></div>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-[#001D4D] text-white pt-32 pb-16 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
            <div className="space-y-10">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-[#D4AF37] rounded-3xl flex items-center justify-center text-[#00338D] shadow-2xl shadow-[#D4AF37]/20">
                  <Newspaper size={32} />
                </div>
                <div className="flex flex-col">
                  <span className="text-4xl font-black tracking-tighter">{t.orgName}</span>
                  <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.5em]">Yemen Foundation</span>
                </div>
              </div>
              <p className="text-blue-100/50 font-bold leading-relaxed">
                {lang === 'ar' ? 'مؤسسة يمنية رائدة تسعى لتمكين الصحفيين وحماية الحريات الإعلامية وفق أسمى المعايير المهنية.' : 'Leading Yemeni foundation empowering journalists and protecting media freedom.'}
              </p>
              <div className="flex gap-4">
                 {[Facebook, Twitter, Instagram, Youtube, Linkedin].map((Icon, i) => (
                   <a key={i} href="#" className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-[#D4AF37] hover:text-[#00338D] hover:shadow-2xl hover:-translate-y-2 transition-all">
                     <Icon size={20} />
                   </a>
                 ))}
              </div>
            </div>

            <div className="space-y-10">
              <h4 className="text-xl font-black text-[#D4AF37] uppercase tracking-widest">{t.footer.quickLinks}</h4>
              <ul className="space-y-5">
                {navItems.map((item, i) => (
                  <li key={i}>
                    <a href={item.href} className="text-blue-100/60 hover:text-white font-bold transition-colors flex items-center gap-4 group text-sm">
                      <ChevronRight size={16} className={`text-[#D4AF37]/50 group-hover:text-[#D4AF37] transition-all ${lang === 'ar' ? 'rotate-180' : ''}`} />
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-10">
              <h4 className="text-xl font-black text-[#D4AF37] uppercase tracking-widest">{t.footer.reports}</h4>
              <ul className="space-y-5">
                {[
                  { title: 'Press Freedom 2024', size: '2.4 MB' },
                  { title: 'Violation Summary Q1', size: '1.8 MB' },
                  { title: 'Training Guidelines', size: '3.1 MB' }
                ].map((doc, i) => (
                  <li key={i}>
                    <a href="#" className="flex items-center gap-5 group p-2 -m-2 rounded-2xl hover:bg-white/5 transition-all">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:text-[#00338D] transition-all">
                        <Download size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{doc.title}</div>
                        <div className="text-[10px] font-black text-blue-100/30 uppercase tracking-widest">PDF • {doc.size}</div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-10">
              <h4 className="text-xl font-black text-[#D4AF37] uppercase tracking-widest">{t.contact.title}</h4>
              <ul className="space-y-8">
                <li className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0">
                    <MapPin size={22} className="text-[#D4AF37]" />
                  </div>
                  <span className="text-blue-100/70 font-bold text-sm leading-relaxed">{t.contact.address}</span>
                </li>
                <li className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0">
                    <Phone size={22} className="text-[#D4AF37]" />
                  </div>
                  <span className="text-blue-100/70 font-bold text-sm tracking-widest" dir="ltr">{t.contact.phone}</span>
                </li>
                <li className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0">
                    <Mail size={22} className="text-[#D4AF37]" />
                  </div>
                  <span className="text-blue-100/70 font-bold text-sm">{t.contact.email}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-16 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-10">
            <p className="text-blue-100/30 font-bold text-xs">{t.footer.rights}</p>
            <div className="flex flex-wrap justify-center gap-8">
              {['Privacy Policy', 'Terms of Service', 'Ethical Code', 'Sitemap'].map((link, i) => (
                <a key={i} href="#" className="text-[10px] font-black text-blue-100/30 hover:text-[#D4AF37] uppercase tracking-[0.2em] transition-all">{link}</a>
              ))}
            </div>
            <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
                <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Global Server 01</span>
            </div>
          </div>
        </div>

        {isScrolled && (
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-12 right-12 w-16 h-16 bg-[#D4AF37] text-[#00338D] rounded-[1.5rem] shadow-2xl flex items-center justify-center hover:-translate-y-3 transition-all z-[70] group active:scale-90"
          >
            <ChevronUp size={32} className="group-hover:scale-125 transition-transform" />
          </button>
        )}
      </footer>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-white w-full max-w-lg rounded-[4rem] p-16 shadow-[0_100px_200px_rgba(0,0,0,0.4)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#00338D] to-[#D4AF37]"></div>
            <button onClick={() => setShowLogin(false)} className="absolute top-10 right-10 p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X size={28} /></button>
            <div className="text-center mb-12">
              <div className="w-24 h-24 bg-[#00338D] text-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[#00338D]/30"><Lock size={40} /></div>
              <h3 className="text-4xl font-black text-[#00338D] tracking-tighter">{t.auth.login}</h3>
              <p className="text-slate-400 font-bold mt-2 uppercase tracking-widest text-[10px]">Secure Gateway Access</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); setShowLogin(false); setIsCmsOpen(true); }} className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-4">Identification</label>
                <input type="text" placeholder="Admin Username" className="w-full px-8 py-6 rounded-3xl bg-slate-50 border-none font-bold focus:ring-4 focus:ring-[#00338D]/5 outline-none transition-all" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-4">Security Key</label>
                <input type="password" placeholder="••••••••" className="w-full px-8 py-6 rounded-3xl bg-slate-50 border-none font-bold focus:ring-4 focus:ring-[#00338D]/5 outline-none transition-all" />
              </div>
              <button className="w-full py-7 bg-[#00338D] text-white rounded-[2rem] font-black text-xl hover:bg-[#D4AF37] hover:text-[#00338D] transition-all shadow-2xl active:scale-95">
                Authenticate Access
              </button>
            </form>
          </div>
        </div>
      )}

      {isLoggedIn && isCmsOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center p-10 font-bold">
           <div className="text-center space-y-8">
              <LayoutDashboard size={80} className="mx-auto text-[#00338D]" />
              <h2 className="text-3xl">Admin Dashboard Active</h2>
              <button onClick={() => setIsCmsOpen(false)} className="px-10 py-4 bg-slate-100 rounded-2xl">Close</button>
           </div>
        </div>
      )}
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
