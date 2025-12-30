
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Globe, Menu, X, Newspaper, ShieldCheck, Users, BookOpen, Download, 
  Mail, Phone, MapPin, Facebook, Twitter, Linkedin, ArrowRight,
  ChevronLeft, ChevronRight, ExternalLink, Award, Lock, MessageSquare,
  Target, UserCheck, Settings, Plus, Trash2, Edit3, Image as ImageIcon,
  Calendar, Eye, FileText, Video, Briefcase, Handshake, Truck, LogIn,
  LogOut, LayoutDashboard, FileUp, Search, Filter, ChevronDown, Tag,
  Clock, CheckCircle2, AlertCircle, Send, Radio, ScanBarcode, BarChart,
  Maximize2, Activity, LifeBuoy, AlertTriangle, Map
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
  link?: string;
  fileSize?: string;
  content_ar?: string;
  content_en?: string;
}

interface TeamMember {
  name_ar: string;
  role_ar: string;
  image: string;
}

interface Stat {
  label_ar: string;
  label_en: string;
  value: number;
  icon: React.ElementType;
}

interface ViolationRecord {
  governorate: string;
  count: number;
  lastUpdated: string;
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
    category_en: 'News',
    content_ar: 'تم خلال الورشة استعراض أحدث التقنيات في الكشف عن الصور والبيانات المزيفة...',
    content_en: 'During the workshop, the latest technologies in detecting fake images and data were reviewed...'
  }
];

const teamMembers: TeamMember[] = [
  { name_ar: 'محمد الحريبي', role_ar: 'رئيس المؤسسة', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1470&auto=format&fit=crop' },
  { name_ar: 'مازن فارس', role_ar: 'المدير التنفيذي', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1470&auto=format&fit=crop' },
  { name_ar: 'مكين العوجري', role_ar: 'مدير وحدة المالية', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1470&auto=format&fit=crop' },
  { name_ar: 'رانيا عبدالله', role_ar: 'وحدة العمليات', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1470&auto=format&fit=crop' },
  { name_ar: 'أبرار مصطفى', role_ar: 'العلاقات العامة', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1470&auto=format&fit=crop' },
];

// --- Translations ---
const translations = {
  ar: {
    dir: 'rtl',
    lang: 'ar',
    orgName: 'بيت الصحافة',
    nav: {
      home: 'الرئيسية',
      about: 'عن المؤسسة',
      objectives: 'الأهداف',
      projects: 'مشاريعنا',
      observatory: 'مرصد الانتهاكات',
      team: 'الفريق',
      partners: 'شركاؤنا',
      contact: 'اتصل بنا',
      cms: 'لوحة التحكم',
      switch: 'English',
      logout: 'تسجيل الخروج',
      scan: 'ماسح الباركود'
    },
    auth: { login: 'تسجيل الدخول' },
    hero: {
      title: 'صحافة مهنية حرة أولويتها الإنسان',
      subtitle: 'نعمل من أجل تعزيز حرية الإعلام وخلق مساحة نقاش مهني وعملي للصحفيين في اليمن.',
    },
    about: {
      introTitle: 'من نحن',
      title: 'عن مؤسسة بيت الصحافة',
      intro: 'بيت الصحافة هي مؤسسة يمنية مستقلة غير ربحية تسعى لتعزيز الحريات الإعلامية.',
      introText: 'نعمل في بيئة معقدة لضمان استمرارية الصوت الصحفي الحر وتوفير الدعم اللازم للصحفيين في مختلف المحافظات.',
      vision: 'رؤيتنا',
      visionText: 'صحافة يمنية مهنية ومستقلة تخدم الحقيقة والإنسان.',
      mission: 'رسالتنا',
      missionText: 'الدفاع عن حقوق الصحفيين وتطوير قدراتهم المهنية في ظل التحديات الراهنة.'
    },
    observatory: {
      title: 'مرصد انتهاكات حرية الصحافة',
      subtitle: 'نظام رصد تفاعلي لتتبع وتوثيق الانتهاكات التي يتعرض لها الصحفيون في مختلف المحافظات اليمنية.',
      mapTitle: 'خارطة الانتهاكات التفاعلية',
      statsTitle: 'أرقام من الميدان',
      reportTitle: 'تبليغ عن انتهاك',
      form: {
        victimName: 'اسم الضحية',
        violationType: 'نوع الانتهاك',
        date: 'تاريخ الواقعة',
        location: 'المحافظة',
        description: 'تفاصيل الواقعة',
        evidence: 'إرفاق أدلة (صور/مستندات)',
        submit: 'إرسال البلاغ للتحقق'
      },
      legend: 'عدد الانتهاكات المرصودة'
    },
    stats: {
      title: 'الأثر بالأرقام',
      subtitle: 'نعمل بشفافية عالية لمتابعة حالة الإعلام في اليمن.'
    },
    objectives: {
      title: 'أهدافنا',
      items: [
        'إيجاد مساحات نقاش عملية ومهنية للصحفيات والصحفيين، تسهم في خلق بيئة إعلامية مهنية تحقق دور الصحافة الأساسي ورسالتها السامية.',
        'توفير حاضنة أعمال صحفية، توفر للصحفيات والصحفيين مساحات عمل مجانية وتسعى لتحسين جودة حياتهم.',
        'الدفاع عن حرية الصحافة والسعي لتطوير العمل الصحفي ودعمه، واستعادة فاعلية الصحافة وتعزيز دورها في التنمية والتنوير.',
        'تقديم صحافة مهنية متطورة تخدم الإنسان أولاً وأخيراً.',
        'الارتقاء بقدرات الصحفيات والصحفيين في مختلف المجالات الصحفية، بما يؤهلهم لتأدية رسالتهم بمهنية واستقلالية عاليتين.',
        'تفعيل القدرات التقييمية بما هي عملية موازية للإنتاج المحقق، وبما يسهم في تطوير المادة الإعلامية والمؤسسات والارتقاء بأدائها الإداري والفني.',
        'خلق آليات شراكة وتشبيك مع الجامعات لتوفير برامج التدريب الوظيفي لخريجي الإعلام وتأهيلهم.',
        'المساهمة في رصد الانتهاكات ضد الصحفيات والصحفيين في اليمن ومناصرة قضاياهم والدفاع عنهم.',
        'ربط المجتمع الصحفي اليمني بنظرائه في الدول العربية والعالم بخلق جسور تنطلق من التحديات المهنية والهموم الإنسانية المشترحة.'
      ]
    },
    cms: {
      news: 'إدارة الأخبار',
      addNews: 'إضافة خبر جديد',
      editNews: 'تعديل الخبر',
      title: 'العنوان',
      desc: 'الوصف المختصر',
      content: 'المحتوى (محرر النصوص)',
      save: 'حفظ'
    },
    scan: {
      title: 'ماسح الباركود للمنتجات',
      subtitle: 'تحقق من أسعار المنتجات المخصصة لدعم الصحفيين.',
      placeholder: 'انتظار الكاميرا...',
      close: 'إغلاق',
      result: 'سعر المنتج:'
    },
    contact: {
      address: 'اليمن - تعز',
      phone: '04-210613',
      email: 'info@phye.org',
      website: 'www.phye.org'
    },
    footer: { rights: 'جميع الحقوق محفوظة © ٢٠24 مؤسسة بيت الصحافة' }
  },
  en: {
    dir: 'ltr',
    lang: 'en',
    orgName: 'Press House',
    nav: {
      home: 'Home',
      about: 'About Us',
      objectives: 'Objectives',
      projects: 'Projects',
      observatory: 'Observatory',
      team: 'Team',
      partners: 'Partners',
      contact: 'Contact',
      cms: 'Admin',
      switch: 'العربية',
      logout: 'Logout',
      scan: 'Barcode Scanner'
    },
    auth: { login: 'Login' },
    hero: {
      title: 'Professional Press with Human Priority',
      subtitle: 'Working to enhance media freedom and create a professional debate space for journalists in Yemen.',
    },
    about: {
      introTitle: 'Who We Are',
      title: 'About Press House Foundation',
      intro: 'Press House is an independent, non-profit Yemeni foundation seeking to enhance media freedoms.',
      introText: 'We work in a complex environment to ensure the continuity of the free journalistic voice and provide the necessary support for journalists.',
      vision: 'Our Vision',
      visionText: 'Professional and independent Yemeni press serving truth and humanity.',
      mission: 'Our Mission',
      missionText: 'Defending journalists\' rights and developing their professional capabilities amidst current challenges.'
    },
    observatory: {
      title: 'Media Freedom Observatory',
      subtitle: 'An interactive monitoring system to track and document violations against journalists across Yemeni governorates.',
      mapTitle: 'Interactive Violation Map',
      statsTitle: 'Numbers from the Field',
      reportTitle: 'Report a Violation',
      form: {
        victimName: 'Victim Name',
        violationType: 'Violation Type',
        date: 'Date of Incident',
        location: 'Governorate',
        description: 'Incident Details',
        evidence: 'Attach Evidence (Images/Docs)',
        submit: 'Submit Report for Verification'
      },
      legend: 'Monitored Violations'
    },
    stats: {
      title: 'Impact in Numbers',
      subtitle: 'We operate with high transparency to monitor the media situation in Yemen.'
    },
    objectives: {
      title: 'Our Objectives',
      items: [
        'Create professional debate spaces for journalists to foster a high-standard media environment.',
        'Provide a journalism business incubator with free workspaces and quality-of-life improvements.',
        'Defend press freedom and support professional development in journalism.',
        'Deliver advanced professional journalism that serves humanity first.',
        'Upgrade journalists\' capacities in various fields for professional and independent reporting.',
        'Activate evaluative capabilities to improve media output and institutional performance.',
        'Establish partnerships with universities for vocational training of media graduates.',
        'Contribute to monitoring violations against journalists and advocating for their causes.',
        'Connect Yemeni journalists with their Arab and international peers.'
      ]
    },
    cms: {
      news: 'News Management',
      addNews: 'Add New Article',
      editNews: 'Edit Article',
      title: 'Title',
      desc: 'Short Description',
      content: 'Content (Rich Text Editor)',
      save: 'Save'
    },
    scan: {
      title: 'Product Barcode Scanner',
      subtitle: 'Check prices for products supporting journalists.',
      placeholder: 'Waiting for camera...',
      close: 'Close',
      result: 'Product Price:'
    },
    contact: {
      address: 'Yemen - Taiz',
      phone: '04-210613',
      email: 'info@phye.org',
      website: 'www.phye.org'
    },
    footer: { rights: 'All Rights Reserved © 2024 Press House Foundation' }
  }
};

const App = () => {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isCmsOpen, setIsCmsOpen] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [selectedRegion, setSelectedRegion] = useState<typeof YEMEN_REGIONS[0] | null>(null);
  
  // Admin News State
  const [editingNews, setEditingNews] = useState<Partial<Post> | null>(null);

  const t = useMemo(() => translations[lang], [lang]);

  useEffect(() => {
    document.documentElement.lang = t.lang;
    document.documentElement.dir = t.dir;
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [t]);

  const toggleLang = useCallback(() => {
    setLang(prev => (prev === 'ar' ? 'en' : 'ar'));
  }, []);

  const navItems = useMemo(() => [
    { name: t.nav.home, href: '#home' },
    { name: t.nav.about, href: '#about' },
    { name: t.nav.objectives, href: '#objectives' },
    { name: t.nav.projects, href: '#projects' },
    { name: t.nav.observatory, href: '#observatory' },
    { name: t.nav.team, href: '#team' },
    { name: t.nav.contact, href: '#contact' },
  ], [t]);

  // --- Components ---

  const BarcodeScannerModal = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
      if (showScanner) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
          .then(stream => {
            if (videoRef.current) videoRef.current.srcObject = stream;
          })
          .catch(err => console.error("Camera access denied", err));
      }
      return () => {
        if (videoRef.current && videoRef.current.srcObject) {
          (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
        }
      };
    }, [showScanner]);

    return (
      <div className="fixed inset-0 z-[110] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-in fade-in zoom-in duration-300">
        <div className="bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl relative flex flex-col items-center p-8 md:p-12">
          <button onClick={() => setShowScanner(false)} className="absolute top-8 right-8 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
            <X size={24} />
          </button>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-[#00338D] mb-2">{t.scan.title}</h2>
            <p className="text-slate-500 font-bold">{t.scan.subtitle}</p>
          </div>
          <div className="relative w-full aspect-square max-w-sm bg-black rounded-3xl overflow-hidden shadow-inner border-4 border-slate-100 group">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-0 border-2 border-dashed border-[#D4AF37] m-10 rounded-2xl animate-pulse"></div>
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)] animate-bounce"></div>
          </div>
          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="bg-slate-50 px-8 py-4 rounded-2xl flex items-center gap-4 border border-slate-100">
              <span className="font-black text-slate-400 uppercase tracking-widest text-xs">{t.scan.result}</span>
              <span className="text-2xl font-black text-[#00338D]">$0.00</span>
            </div>
            <button onClick={() => setShowScanner(false)} className="px-10 py-4 bg-[#00338D] text-white rounded-2xl font-black text-lg hover:bg-[#D4AF37] transition-all flex items-center gap-2">
              <CheckCircle2 size={20} />
              {t.scan.close}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ObservatorySection = () => (
    <section id="observatory" className="py-24 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 text-red-600 rounded-full font-black text-xs uppercase tracking-widest mb-6 border border-red-100">
            <Eye size={14} /> {lang === 'ar' ? 'البث المباشر للمرصد' : 'Live Observatory'}
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-[#00338D] mb-8">{t.observatory.title}</h2>
          <p className="text-xl text-slate-500 font-bold leading-relaxed">{t.observatory.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Interactive Map */}
          <div className="lg:col-span-7 bg-slate-50 rounded-[3rem] p-8 border border-slate-100 shadow-inner relative min-h-[500px] flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-[#00338D]">{t.observatory.mapTitle}</h3>
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-xs font-bold text-slate-400 shadow-sm border border-slate-100">
                <Map size={16} /> {lang === 'ar' ? 'خريطة اليمن' : 'Yemen Map'}
              </div>
            </div>
            
            <div className="flex-1 relative bg-white/50 rounded-2xl border border-dashed border-slate-200 overflow-hidden group">
               {/* Simplified Yemen SVG Map visualization */}
               <svg viewBox="0 0 100 100" className="w-full h-full text-slate-200 fill-current p-10 transform scale-110">
                 <path d="M10,40 L30,30 L50,35 L80,30 L90,50 L85,70 L60,85 L40,90 L20,80 L10,60 Z" className="opacity-20 hover:opacity-30 transition-opacity cursor-default" />
                 {YEMEN_REGIONS.map((region) => (
                   <g key={region.id} 
                      className="cursor-pointer group/pin" 
                      onClick={() => setSelectedRegion(region)}
                   >
                     <circle 
                        cx={region.x} 
                        cy={region.y} 
                        r={3 + (region.count / 10)} 
                        className={`fill-red-500/20 stroke-red-500 stroke-2 transition-all ${selectedRegion?.id === region.id ? 'fill-red-500 r-8' : 'hover:fill-red-500/40'}`}
                        style={{ filter: 'drop-shadow(0 0 5px rgba(239, 68, 68, 0.4))' }}
                      />
                     <circle 
                        cx={region.x} 
                        cy={region.y} 
                        r="2" 
                        className="fill-red-600 animate-pulse" 
                      />
                   </g>
                 ))}
               </svg>

               {/* Map Tooltip/Detail overlay */}
               {selectedRegion && (
                 <div className="absolute bottom-6 right-6 left-6 md:left-auto md:w-80 bg-white p-6 rounded-[2rem] shadow-2xl border border-slate-100 animate-in slide-in-from-bottom duration-300">
                    <button onClick={() => setSelectedRegion(null)} className="absolute top-4 right-4 text-slate-300 hover:text-slate-900"><X size={18}/></button>
                    <h4 className="text-xl font-black text-[#00338D] mb-1">{lang === 'ar' ? selectedRegion.name_ar : selectedRegion.name_en}</h4>
                    <p className="text-sm font-bold text-slate-400 mb-4">{lang === 'ar' ? 'إجمالي الانتهاكات المرصودة' : 'Total Monitored Violations'}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-4xl font-black text-red-600">{selectedRegion.count}</span>
                      <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-colors">
                        {lang === 'ar' ? 'عرض السجل' : 'View Logs'}
                      </button>
                    </div>
                 </div>
               )}

               <div className="absolute top-6 left-6 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    {t.observatory.legend}
                  </div>
               </div>
            </div>
          </div>

          {/* Reporting Form */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="bg-[#00338D] text-white p-10 rounded-[3rem] shadow-xl relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
              <h3 className="text-3xl font-black mb-4 relative z-10">{t.observatory.reportTitle}</h3>
              <p className="text-blue-100/70 font-bold mb-8 relative z-10 text-sm">{lang === 'ar' ? 'هل تعرضت أو شاهدت انتهاكاً؟ أبلغنا فوراً بشكل آمن وسري.' : 'Have you experienced or witnessed a violation? Report it now securely.'}</p>
              
              <form className="space-y-4 relative z-10">
                <input 
                  type="text" 
                  placeholder={t.observatory.form.victimName}
                  className="w-full px-6 py-4 rounded-2xl bg-white/10 border-white/20 text-white font-bold placeholder:text-blue-200/50 focus:bg-white/20 transition-all outline-none"
                />
                <div className="grid grid-cols-2 gap-4">
                  <select className="px-6 py-4 rounded-2xl bg-white/10 border-white/20 text-white font-bold focus:bg-white/20 outline-none appearance-none">
                    <option className="text-slate-900">{t.observatory.form.violationType}</option>
                    <option className="text-slate-900">Detention</option>
                    <option className="text-slate-900">Assault</option>
                    <option className="text-slate-900">Death Threat</option>
                  </select>
                  <input type="date" className="px-6 py-4 rounded-2xl bg-white/10 border-white/20 text-white font-bold focus:bg-white/20 outline-none" />
                </div>
                <textarea 
                  rows={3} 
                  placeholder={t.observatory.form.description}
                  className="w-full px-6 py-4 rounded-2xl bg-white/10 border-white/20 text-white font-bold placeholder:text-blue-200/50 focus:bg-white/20 outline-none resize-none"
                ></textarea>
                <div className="flex items-center justify-between p-4 border border-dashed border-white/20 rounded-2xl hover:bg-white/5 cursor-pointer">
                  <span className="text-sm font-bold text-blue-200">{t.observatory.form.evidence}</span>
                  <FileUp size={20} className="text-[#D4AF37]" />
                </div>
                <button className="w-full py-5 bg-[#D4AF37] hover:bg-white hover:text-[#00338D] text-white rounded-2xl font-black text-lg transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95">
                  <Send size={24} />
                  {t.observatory.form.submit}
                </button>
              </form>
            </div>

            <div className="grid grid-cols-2 gap-6">
               {VIOLATION_STATS.slice(0, 2).map((stat, i) => (
                 <div key={i} className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 hover:border-red-200 transition-colors">
                    <div className="w-12 h-12 bg-white text-red-600 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                      <stat.icon size={24} />
                    </div>
                    <div className="text-3xl font-black text-[#00338D] mb-1">{stat.value}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{lang === 'ar' ? stat.label_ar : stat.label_en}</div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const CMSDashboard = () => (
    <div className="fixed inset-0 bg-blue-950/95 backdrop-blur-md z-[100] flex flex-col p-4 md:p-10 animate-in fade-in duration-300 overflow-hidden">
      <div className="bg-white h-full rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl max-w-7xl mx-auto w-full">
        <header className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#00338D] rounded-xl flex items-center justify-center text-white">
              <LayoutDashboard size={20} />
            </div>
            <h2 className="text-2xl font-black text-[#00338D]">{t.nav.cms}</h2>
          </div>
          <div className="flex gap-4">
            <button onClick={() => { setIsLoggedIn(false); setIsCmsOpen(false); }} className="flex items-center gap-2 text-red-600 font-bold px-4 py-2 hover:bg-red-50 rounded-xl transition-all">
              <LogOut size={20} />
              <span className="hidden md:inline">{t.nav.logout}</span>
            </button>
            <button onClick={() => setIsCmsOpen(false)} className="p-2 bg-slate-200 hover:bg-slate-300 rounded-full transition-colors text-slate-600">
              <X size={20} />
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          <aside className="w-20 md:w-64 border-e border-slate-100 bg-white p-4 flex flex-col gap-2 transition-all">
            <button className="flex items-center gap-3 p-4 rounded-2xl bg-blue-50 text-[#00338D] font-black group">
              <Newspaper size={24} className="group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline">{t.cms.news}</span>
            </button>
            <button className="flex items-center gap-3 p-4 rounded-2xl text-slate-400 hover:bg-slate-50 hover:text-blue-950 font-black transition-all">
              <Activity size={24} />
              <span className="hidden md:inline">{lang === 'ar' ? 'إدارة الانتهاكات' : 'Violation Management'}</span>
            </button>
            <button className="flex items-center gap-3 p-4 rounded-2xl text-slate-400 hover:bg-slate-50 hover:text-blue-950 font-black transition-all">
              <Settings size={24} />
              <span className="hidden md:inline">{lang === 'ar' ? 'الإعدادات' : 'Settings'}</span>
            </button>
          </aside>

          <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50/50">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-black text-[#00338D]">{t.cms.news}</h3>
              <button 
                onClick={() => setEditingNews({ type: 'news', date: new Date().toISOString().split('T')[0] })}
                className="px-8 py-4 bg-[#00338D] text-white rounded-2xl font-black flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-900/20"
              >
                <Plus size={24} />
                <span>{t.cms.addNews}</span>
              </button>
            </div>

            <div className="grid gap-4">
              {posts.filter(p => p.type === 'news').map(news => (
                <div key={news.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between hover:shadow-xl transition-all group">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100">
                      <img src={news.image} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-[#00338D]">{lang === 'ar' ? news.title_ar : news.title_en}</h4>
                      <p className="text-slate-400 font-bold text-sm mt-1">{news.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingNews(news)} className="p-3 bg-blue-50 text-blue-900 rounded-xl hover:bg-blue-100 transition-colors">
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={() => 
                        setPosts(prev => prev.filter(p => p.id !== news.id))
                      }
                      className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      {editingNews && (
        <div className="fixed inset-0 z-[110] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl relative animate-in zoom-in duration-300">
            <button onClick={() => setEditingNews(null)} className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <X size={24} />
            </button>
            <h3 className="text-3xl font-black text-[#00338D] mb-8">
              {editingNews.id ? t.cms.editNews : t.cms.addNews}
            </h3>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t.cms.title} (AR)</label>
                  <input 
                    type="text" 
                    value={editingNews.title_ar || ''}
                    onChange={(e) => setEditingNews({...editingNews, title_ar: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{t.cms.title} (EN)</label>
                  <input 
                    type="text" 
                    value={editingNews.title_en || ''}
                    onChange={(e) => setEditingNews({...editingNews, title_en: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none font-bold" 
                  />
                </div>
              </div>
              <button 
                onClick={() => {
                  if (editingNews.id) {
                    setPosts(prev => prev.map(p => p.id === editingNews.id ? { ...p, ...editingNews } as Post : p));
                  } else {
                    const newId = 'n' + Date.now();
                    setPosts(prev => [...prev, { ...editingNews, id: newId, image: 'https://images.unsplash.com/photo-1591115765373-520b7a3d72b7?q=80&w=1470&auto=format&fit=crop', category_ar: 'أخبار', category_en: 'News' } as Post]);
                  }
                  setEditingNews(null);
                }}
                className="w-full py-5 bg-[#00338D] text-white rounded-2xl font-black text-xl hover:bg-[#D4AF37] transition-all shadow-xl shadow-blue-900/20"
              >
                {t.cms.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const StatsSection = () => (
    <section className="py-24 bg-[#00338D] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D4AF37] rounded-full blur-[100px]"></div>
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">{t.stats.title}</h2>
          <p className="text-blue-100/60 font-bold max-w-xl mx-auto">{t.stats.subtitle}</p>
          <div className="w-20 h-1.5 bg-[#D4AF37] mx-auto rounded-full mt-6"></div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {INITIAL_STATS.map((stat, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/10 p-10 rounded-[3rem] text-center group hover:bg-white/20 transition-all duration-500">
              <div className="w-20 h-20 bg-white text-[#00338D] rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-transform">
                <stat.icon size={40} />
              </div>
              <div className="text-5xl font-black text-white mb-4 tabular-nums">{stat.value.toLocaleString()}</div>
              <div className="text-blue-100/50 font-black uppercase tracking-widest text-sm">
                {lang === 'ar' ? stat.label_ar : stat.label_en}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <div className={`min-h-screen flex flex-col bg-white text-slate-900 ${lang === 'en' ? 'font-en' : 'font-ar'}`}>
      {/* Navigation */}
      <nav className={`fixed w-full z-[60] transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#00338D] rounded-xl flex items-center justify-center text-white shadow-lg">
              <Newspaper size={24} />
            </div>
            <span className={`text-xl font-black tracking-tighter ${isScrolled ? 'text-[#00338D]' : 'text-white'}`}>{t.orgName}</span>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-6 mx-8">
              {navItems.map((link) => (
                <a key={link.href} href={link.href} className={`font-bold transition-all px-2 py-1 relative group text-sm ${isScrolled ? 'text-blue-900/70' : 'text-white/70'} hover:text-[#D4AF37]`}>
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all group-hover:w-full"></span>
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowScanner(true)} className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all shadow-sm ${isScrolled ? 'border-gray-100 bg-slate-50 text-[#00338D]' : 'border-white/20 bg-white/10 text-white'} hover:bg-[#D4AF37] hover:text-white group`}>
                <ScanBarcode size={20} />
              </button>
              <button onClick={toggleLang} className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all text-xs font-black shadow-sm ${isScrolled ? 'border-gray-100 bg-white text-blue-900' : 'border-white/20 bg-white/10 text-white'}`}>
                {lang === 'ar' ? 'EN' : 'AR'}
              </button>
              <button onClick={() => isLoggedIn ? setIsCmsOpen(true) : setShowLogin(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#00338D] hover:bg-[#D4AF37] hover:text-white transition-all font-black text-sm shadow-md">
                {isLoggedIn ? <LayoutDashboard size={16} /> : <LogIn size={16} />}
                <span>{isLoggedIn ? t.nav.cms : t.auth.login}</span>
              </button>
            </div>
          </div>

          <div className="lg:hidden flex items-center gap-4">
            <button onClick={() => setShowScanner(true)} className={isScrolled ? 'text-blue-900' : 'text-white'}><ScanBarcode size={24} /></button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={isScrolled ? 'text-blue-900' : 'text-white'}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Sections */}
      <section id="home" className="relative min-h-[85vh] bg-[#00338D] overflow-hidden flex items-center pt-20">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1470&auto=format&fit=crop" className="w-full h-full object-cover opacity-20 scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#00338D] via-transparent to-transparent"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center md:text-start">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.2] mb-8">{t.hero.title}</h1>
            <p className="text-xl md:text-2xl text-blue-100/80 font-bold mb-10 max-w-2xl leading-relaxed">{t.hero.subtitle}</p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <a href="#about" className="px-8 py-4 bg-[#D4AF37] text-white rounded-xl font-black text-lg hover:scale-105 transition-all shadow-xl">{lang === 'ar' ? 'تعرف علينا' : 'Learn More'}</a>
              <a href="#observatory" className="px-8 py-4 bg-white text-[#00338D] rounded-xl font-black text-lg hover:bg-red-50 transition-all">{t.nav.observatory}</a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <div className="inline-block px-4 py-1 bg-blue-50 text-[#00338D] rounded-lg font-black text-sm uppercase tracking-widest">{t.about.introTitle}</div>
              <h2 className="text-4xl font-black text-[#00338D]">{t.about.title}</h2>
              <p className="text-xl font-bold text-gray-700 leading-relaxed bg-[#D4AF37]/10 p-6 border-s-4 border-[#D4AF37] rounded-e-xl">{t.about.intro}</p>
              <p className="text-lg text-gray-500 font-medium leading-relaxed">{t.about.introText}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 bg-slate-50 rounded-3xl border border-gray-100 hover:shadow-xl transition-all">
                <Target className="text-[#D4AF37] mb-4" size={32} />
                <h3 className="text-2xl font-black text-[#00338D] mb-4">{t.about.vision}</h3>
                <p className="font-bold text-gray-600">{t.about.visionText}</p>
              </div>
              <div className="p-8 bg-slate-50 rounded-3xl border border-gray-100 hover:shadow-xl transition-all">
                <ShieldCheck className="text-[#D4AF37] mb-4" size={32} />
                <h3 className="text-2xl font-black text-[#00338D] mb-4">{t.about.mission}</h3>
                <p className="font-bold text-gray-600">{t.about.missionText}</p>
              </div>
              <div className="md:col-span-2 p-8 bg-[#00338D] text-white rounded-3xl shadow-2xl relative overflow-hidden group">
                <Users className="text-[#D4AF37] mb-4" size={32} />
                <h3 className="text-2xl font-black mb-4">{lang === 'ar' ? 'فريقنا' : 'Our Team'}</h3>
                <p className="font-bold text-blue-100/70">{lang === 'ar' ? 'نعمل بروح الفريق الواحد من أجل قضية سامية تخدم الصحافة والإنسان.' : 'Working as one team for a noble cause serving journalism and humanity.'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats, Observatory, Objectives... */}
      <StatsSection />
      <ObservatorySection />

      <section id="objectives" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-[#00338D] mb-4">{t.objectives.title}</h2>
            <div className="w-20 h-1.5 bg-[#D4AF37] mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.objectives.items.map((obj, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex gap-4 group hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-blue-50 text-[#00338D] rounded-lg flex items-center justify-center font-black flex-shrink-0 group-hover:bg-[#00338D] group-hover:text-white transition-colors">{idx + 1}</div>
                <p className="font-bold text-gray-700 leading-relaxed text-sm">{obj}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects, Team, Contact... */}
      <section id="projects" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-4xl font-black text-[#00338D]">{t.nav.projects}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {posts.filter(p => p.type === 'project').map(project => (
              <div key={project.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="aspect-video relative overflow-hidden">
                  <img src={project.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-[#00338D]/90 rounded-lg text-white font-bold text-xs">{lang === 'ar' ? project.category_ar : project.category_en}</div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-black text-[#00338D] mb-4 line-clamp-2">{lang === 'ar' ? project.title_ar : project.title_en}</h3>
                  <p className="text-gray-500 font-bold text-sm mb-6 line-clamp-3 leading-relaxed">{lang === 'ar' ? project.desc_ar : project.desc_en}</p>
                  <button className="flex items-center gap-2 font-black text-[#D4AF37] text-sm group-hover:translate-x-1 transition-transform">{lang === 'ar' ? 'التفاصيل' : 'Details'}<ChevronRight size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-12 border-t border-white/5">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <Newspaper size={24} className="text-[#D4AF37]" />
            <span className="text-xl font-black tracking-tighter uppercase">{t.orgName}</span>
          </div>
          <p className="text-slate-500 font-bold text-sm text-center">{t.footer.rights}</p>
          <div className="flex gap-4">
             {[Facebook, Twitter, Linkedin].map((Icon, i) => (
               <a key={i} href="#" className="p-3 bg-white/5 rounded-lg hover:bg-[#D4AF37] transition-all"><Icon size={18} /></a>
             ))}
          </div>
        </div>
      </footer>

      {showLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-md rounded-3xl p-10 shadow-2xl relative">
            <button onClick={() => setShowLogin(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"><X size={24} /></button>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#00338D] text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl"><Lock size={32} /></div>
              <h3 className="text-2xl font-black text-[#00338D]">{t.auth.login}</h3>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); setShowLogin(false); setIsCmsOpen(true); }} className="space-y-4">
              <input type="text" placeholder="Username" className="w-full px-6 py-4 rounded-xl bg-slate-50 border-transparent font-bold" />
              <input type="password" placeholder="Password" className="w-full px-6 py-4 rounded-xl bg-slate-50 border-transparent font-bold" />
              <button className="w-full py-4 bg-[#00338D] text-white rounded-xl font-black text-lg">Login</button>
            </form>
          </div>
        </div>
      )}

      {showScanner && <BarcodeScannerModal />}
      {isLoggedIn && isCmsOpen && <CMSDashboard />}
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
