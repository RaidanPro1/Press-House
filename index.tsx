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
  Maximize2, Activity, LifeBuoy, AlertTriangle, Map, Bold, Italic, List, Link as LinkIcon, Upload,
  Star, Heart, Lightbulb, Link2, Loader2, ShieldAlert
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
  name_en: string;
  role_ar: string;
  role_en: string;
  image: string;
}

interface Stat {
  label_ar: string;
  label_en: string;
  value: number;
  icon: React.ElementType;
}

// --- Constants ---
const AUTH_KEY = 'ph_admin_session';
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'password123' // In a real app, this would be handled by a secure backend
};

const INITIAL_STATS: Stat[] = [
  { label_ar: 'إجمالي التقارير', label_en: 'Total Reports', value: 1250, icon: FileText },
  { label_ar: 'توضيحات مؤكدة', label_en: 'Verified Discrepancies', value: 450, icon: CheckCircle2 },
  { label_ar: 'انتهاكات نشطة', label_en: 'Active Violations', value: 85, icon: AlertCircle },
  { label_ar: 'صحفيون متدربون', label_en: 'Trained Journalists', value: 3200, icon: Users },
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

for (let i = 2; i <= 6; i++) {
  initialPosts.push({
    id: `n${i}`,
    type: 'news',
    title_ar: `تغطية خاصة: حالة الحريات في اليمن رقم ${i}`,
    title_en: `Special Coverage: Press Freedom in Yemen #${i}`,
    desc_ar: `تحليل شامل للوضع الراهن للصحافة في المحافظات اليمنية.`,
    desc_en: `Comprehensive analysis of the current state of press in Yemeni governorates.`,
    date: '2024-05-15',
    image: `https://picsum.photos/seed/press${i}/800/600`,
    category_ar: 'أخبار',
    category_en: 'News'
  });
}

const teamMembers: TeamMember[] = [
  { name_ar: 'محمد الحريبي', name_en: 'Mohammed Al-Huraibi', role_ar: 'رئيس المؤسسة', role_en: 'Chairman', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=300' },
  { name_ar: 'مازن فارس', name_en: 'Mazen Fares', role_ar: 'المدير التنفيذي', role_en: 'Executive Director', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300' },
  { name_ar: 'مكين العوجري', name_en: 'Makin Al-Awjari', role_ar: 'مدير وحدة المالية', role_en: 'Finance Manager', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300' },
  { name_ar: 'رانيا عبدالله', name_en: 'Rania Abdullah', role_ar: 'وحدة العمليات', role_en: 'Operations Unit', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300' },
  { name_ar: 'أبرار مصطفى', name_en: 'Abrar Mustafa', role_ar: 'العلاقات العامة', role_en: 'Public Relations', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=300' },
];

const translations = {
  ar: {
    dir: 'rtl', lang: 'ar', orgName: 'بيت الصحافة',
    nav: { home: 'الرئيسية', about: 'عن المؤسسة', objectives: 'الأهداف', projects: 'مشاريعنا', observatory: 'مرصد الانتهاكات', team: 'الفريق', contact: 'اتصل بنا', cms: 'لوحة التحكم', switch: 'English', logout: 'تسجيل الخروج' },
    auth: { login: 'تسجيل الدخول', username: 'اسم المستخدم', password: 'كلمة المرور', error: 'خطأ في البيانات، يرجى المحاولة مرة أخرى', loggingIn: 'جاري تسجيل الدخول...', rememberMe: 'تذكرني' },
    hero: { title: 'صحافة مهنية حرة أولويتها الإنسان', subtitle: 'نعمل من أجل تعزيز حرية الإعلام وخلق مساحة نقاش مهني وعملي للصحفيين في اليمن.' },
    about: { introTitle: 'من نحن', title: 'بيت الصحافة: صوت الحقيقة', intro: 'بيت الصحافة هي مؤسسة يمنية مستقلة غير ربحية تسعى لتعزيز الحريات الإعلامية.', introText: 'نعمل في بيئة معقدة لضمان استمرارية الصوت الصحفي الحر وتوفير الدعم اللازم للصحفيين في مختلف المحافظات.', vision: 'رؤيتنا', visionText: 'صحافة يمنية مهنية ومستقلة تخدم الحقيقة والإنسان.', mission: 'رسالتنا', missionText: 'الدفاع عن حقوق الصحفيين وتطوير قدراتهم المهنية في ظل التحديات الراهنة.' },
    observatory: { title: 'مرصد انتهاكات حرية الصحافة', subtitle: 'نظام رصد تفاعلي لتتبع وتوثيق الانتهاكات التي يتعرض لها الصحفيون في اليمن.', mapTitle: 'خارطة الانتهاكات التفاعلية', statsTitle: 'أرقام من الميدان', reportTitle: 'تبليغ عن انتهاك', form: { victimName: 'اسم الضحية', violationType: 'نوع الانتهاك', date: 'تاريخ الواقعة', location: 'المحافظة', description: 'تفاصيل الواقعة', evidence: 'إرفاق أدلة', submit: 'إرسال البلاغ' }, legend: 'عدد الانتهاكات المرصودة' },
    stats: { title: 'الأثر بالأرقام', subtitle: 'نعمل بشفافية عالية لمتابعة حالة الإعلام في اليمن.' },
    objectives: { title: 'أهدافنا الاستراتيجية', subtitle: 'نسعى لتحقيق بيئة إعلامية آمنة ومهنية من خلال العمل على عدة محاور.', items: [
      { title: 'تمكين الصحفيين', desc: 'إيجاد مساحات نقاش عملية ومهنية للصحفيات والصحفيين، تسهم في خلق بيئة إعلامية مهنية.' },
      { title: 'حاضنة أعمال', desc: 'توفير حاضنة أعمال صحفية، توفر للصحفيات والصحفيين مساحات عمل مجانية.' },
      { title: 'الدفاع عن الحريات', desc: 'الدفاع عن حرية الصحافة والسعي لتطوير العمل الصحفي ودعمه، واستعادة فاعلية الصحافة.' },
      { title: 'التطوير المهني', desc: 'الارتقاء بقدرات الصحفيات والصحفيين في مختلف المجالات الصحفية بمهنية واستقلالية.' },
      { title: 'الشراكات الأكاديمية', desc: 'خلق آليات شراكة وتشبيك مع الجامعات لتوفير برامج التدريب الوظيفي لخريجي الإعلام.' },
      { title: 'الرصد والمناصرة', desc: 'المساهمة في رصد الانتهاكات ضد الصحفيات والصحفيين في اليمن ومناصرة قضاياهم.' }
    ]},
    team: { title: 'فريقنا المهني', subtitle: 'نخبة من الكفاءات العاملة في سبيل حرية الإعلام.' },
    cms: { news: 'إدارة الأخبار', addNews: 'إضافة خبر جديد', save: 'حفظ', search: 'بحث في الأخبار...', pagination: { prev: 'السابق', next: 'التالي', page: 'صفحة' }, imageUpload: 'رفع صورة الخبر' },
    footer: { rights: 'جميع الحقوق محفوظة © ٢٠26 مؤسسة بيت الصحافة' }
  },
  en: {
    dir: 'ltr', lang: 'en', orgName: 'Press House',
    nav: { home: 'Home', about: 'About', objectives: 'Objectives', projects: 'Projects', observatory: 'Observatory', team: 'Team', contact: 'Contact', cms: 'Admin', switch: 'العربية', logout: 'Logout' },
    auth: { login: 'Login', username: 'Username', password: 'Password', error: 'Invalid credentials, please try again', loggingIn: 'Logging in...', rememberMe: 'Remember Me' },
    hero: { title: 'Professional Press with Human Priority', subtitle: 'Working to enhance media freedom and create a professional debate space for journalists in Yemen.' },
    about: { introTitle: 'Who We Are', title: 'Press House: The Voice of Truth', intro: 'Press House is an independent, non-profit Yemeni foundation seeking to enhance media freedoms.', introText: 'We work in a complex environment to ensure the continuity of free journalistic voice and provide support.', vision: 'Our Vision', visionText: 'Professional and independent Yemeni press serving truth and humanity.', mission: 'Our Mission', missionText: 'Defending journalists\' rights and developing their professional capabilities.' },
    observatory: { title: 'Press Freedom Observatory', subtitle: 'Interactive monitoring system to track violations against journalists in Yemen.', mapTitle: 'Interactive Violation Map', statsTitle: 'Field Statistics', reportTitle: 'Report Violation', form: { victimName: 'Victim Name', violationType: 'Violation Type', date: 'Date', location: 'Location', description: 'Details', evidence: 'Attach Evidence', submit: 'Submit Report' }, legend: 'Monitored Violations' },
    stats: { title: 'Impact in Numbers', subtitle: 'We operate with high transparency to monitor Yemen\'s media situation.' },
    objectives: { title: 'Strategic Objectives', subtitle: 'We strive to achieve a safe and professional media environment.', items: [
      { title: 'Journalist Empowerment', desc: 'Creating professional debate spaces for journalists to foster a high-standard media environment.' },
      { title: 'Media Incubator', desc: 'Providing a journalism business incubator with free workspaces and support.' },
      { title: 'Freedom Defense', desc: 'Defending press freedom and supporting development in the journalism sector.' },
      { title: 'Professional Growth', desc: 'Upgrading journalists\' capacities for professional and independent reporting.' },
      { title: 'Academic Partnerships', desc: 'Establishing partnerships with universities for vocational training of media graduates.' },
      { title: 'Monitoring & Advocacy', desc: 'Contributing to monitoring violations and advocating for journalists\' causes.' }
    ]},
    team: { title: 'Our Professional Team', subtitle: 'Elite specialists dedicated to media freedom.' },
    cms: { news: 'News Management', addNews: 'Add Article', save: 'Save', search: 'Search news...', pagination: { prev: 'Prev', next: 'Next', page: 'Page' }, imageUpload: 'Upload Image' },
    footer: { rights: 'All Rights Reserved © 2026 Press House Foundation' }
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
  
  // Auth States
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState(false);

  // CMS State
  const [editingNews, setEditingNews] = useState<Partial<Post> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const t = useMemo(() => translations[lang], [lang]);

  useEffect(() => {
    // Check for existing session on mount
    const savedSession = localStorage.getItem(AUTH_KEY);
    if (savedSession === 'true') {
      setIsLoggedIn(true);
    }

    document.documentElement.lang = t.lang;
    document.documentElement.dir = t.dir;
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [t]);

  const toggleLang = useCallback(() => setLang(prev => (prev === 'ar' ? 'en' : 'ar')), []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError(false);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (loginForm.username === ADMIN_CREDENTIALS.username && loginForm.password === ADMIN_CREDENTIALS.password) {
      setIsLoggedIn(true);
      localStorage.setItem(AUTH_KEY, 'true');
      setShowLogin(false);
      setIsCmsOpen(true);
      setLoginForm({ username: '', password: '' });
    } else {
      setAuthError(true);
    }
    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem(AUTH_KEY);
    setIsCmsOpen(false);
    setIsMenuOpen(false);
  };

  const navItems = useMemo(() => [
    { name: t.nav.home, href: '#home' },
    { name: t.nav.about, href: '#about' },
    { name: t.nav.objectives, href: '#objectives' },
    { name: t.nav.observatory, href: '#observatory' },
    { name: t.nav.projects, href: '#projects' },
    { name: t.nav.team, href: '#team' },
    { name: t.nav.contact, href: '#contact' },
  ], [t]);

  // --- Components ---

  const CMSDashboard = () => (
    <div className="fixed inset-0 bg-blue-950/95 backdrop-blur-md z-[100] flex flex-col p-4 md:p-10 animate-in fade-in duration-300">
      <div className="bg-white h-full rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl max-w-7xl mx-auto w-full">
        <header className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-4">
            <LayoutDashboard size={20} className="text-[#00338D]" />
            <h2 className="text-2xl font-black text-[#00338D]">{t.nav.cms}</h2>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold flex items-center gap-2 hover:bg-red-100 transition-colors"
            >
              <LogOut size={18} />
              <span>{t.nav.logout}</span>
            </button>
            <button onClick={() => setIsCmsOpen(false)} className="p-2 bg-slate-200 hover:bg-slate-300 rounded-full transition-colors"><X size={20} /></button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-10">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-3xl font-black text-[#00338D]">{t.cms.news}</h3>
            <button onClick={() => setEditingNews({ type: 'news', date: new Date().toISOString().split('T')[0] })} className="px-8 py-4 bg-[#00338D] text-white rounded-2xl font-black shadow-xl">+ {t.cms.addNews}</button>
          </div>
          <div className="grid gap-4">
            {posts.filter(p => p.type === 'news').map(n => (
              <div key={n.id} className="bg-slate-50 p-6 rounded-3xl flex justify-between items-center border border-slate-100 group">
                <div className="flex items-center gap-4">
                  <img src={n.image} className="w-12 h-12 rounded-xl object-cover" />
                  <span className="font-bold text-[#00338D]">{lang === 'ar' ? n.title_ar : n.title_en}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditingNews(n)} className="p-2 bg-blue-100 text-[#00338D] rounded-lg"><Edit3 size={18} /></button>
                  <button onClick={() => setPosts(posts.filter(p => p.id !== n.id))} className="p-2 bg-red-100 text-red-600 rounded-lg"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen flex flex-col bg-white text-slate-900 ${lang === 'en' ? 'font-en' : 'font-ar'}`} dir={t.dir}>
      <nav className={`fixed w-full z-[60] transition-all duration-300 ${isScrolled ? 'bg-white shadow-xl py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00338D] rounded-xl flex items-center justify-center text-white shadow-lg"><Newspaper size={20} /></div>
            <span className={`text-xl font-black ${isScrolled ? 'text-[#00338D]' : 'text-white'}`}>{t.orgName}</span>
          </div>
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className={`font-bold transition-all text-sm ${isScrolled ? 'text-blue-900/70' : 'text-white/70'} hover:text-[#D4AF37]`}>{item.name}</a>
            ))}
            <button onClick={toggleLang} className={`w-10 h-10 rounded-xl border flex items-center justify-center font-black text-xs ${isScrolled ? 'border-slate-200 text-blue-900' : 'border-white/20 text-white'}`}>{lang === 'ar' ? 'EN' : 'AR'}</button>
            <button onClick={() => isLoggedIn ? setIsCmsOpen(true) : setShowLogin(true)} className="px-6 py-2.5 rounded-xl bg-[#D4AF37] text-white font-black text-sm shadow-md hover:scale-105 transition-transform">
              {isLoggedIn ? <div className="flex items-center gap-2"><LayoutDashboard size={16} /> {t.nav.cms}</div> : <div className="flex items-center gap-2"><LogIn size={16} /> {t.auth.login}</div>}
            </button>
          </div>
          <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X className={isScrolled ? 'text-[#00338D]' : 'text-white'} /> : <Menu className={isScrolled ? 'text-[#00338D]' : 'text-white'} />}</button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-white z-[70] p-10 flex flex-col animate-in slide-in-from-top duration-300">
            <div className="flex justify-between items-center mb-10">
              <span className="text-2xl font-black text-[#00338D]">{t.orgName}</span>
              <button onClick={() => setIsMenuOpen(false)}><X size={32}/></button>
            </div>
            <div className="flex flex-col gap-6 mb-10">
              {navItems.map(item => (
                <a key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)} className="text-2xl font-black text-slate-800">{item.name}</a>
              ))}
            </div>
            <div className="mt-auto space-y-4">
              <button onClick={toggleLang} className="w-full py-4 bg-slate-50 rounded-2xl font-black text-lg">{lang === 'ar' ? 'Switch to English' : 'تحويل للعربية'}</button>
              {isLoggedIn ? (
                <>
                  <button onClick={() => { setIsCmsOpen(true); setIsMenuOpen(false); }} className="w-full py-4 bg-[#00338D] text-white rounded-2xl font-black text-lg">{t.nav.cms}</button>
                  <button onClick={handleLogout} className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-black text-lg">{t.nav.logout}</button>
                </>
              ) : (
                <button onClick={() => { setShowLogin(true); setIsMenuOpen(false); }} className="w-full py-4 bg-[#D4AF37] text-white rounded-2xl font-black text-lg">{t.auth.login}</button>
              )}
            </div>
          </div>
        )}
      </nav>

      <section id="home" className="relative h-screen bg-[#00338D] overflow-hidden flex items-center">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1585829365234-781fcdb4c8ef?q=80&w=1470&auto=format&fit=crop" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#00338D]/50 to-[#00338D]"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
            <div className="w-20 h-1.5 bg-[#D4AF37] mb-8 rounded-full"></div>
            <h1 className="text-5xl md:text-8xl font-black text-white leading-tight mb-8">{t.hero.title}</h1>
            <p className="text-xl md:text-2xl text-blue-100/80 font-bold mb-12 max-w-2xl leading-relaxed">{t.hero.subtitle}</p>
            <div className="flex gap-4">
              <a href="#about" className="px-10 py-5 bg-[#D4AF37] text-white rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-2xl">{lang === 'ar' ? 'تعرف علينا' : 'Discover More'}</a>
              <a href="#observatory" className="px-10 py-5 bg-white text-[#00338D] rounded-2xl font-black text-lg hover:bg-slate-50 transition-all">{t.nav.observatory}</a>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 2: Impact Quick Stats --- */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {INITIAL_STATS.map((stat, idx) => (
              <div key={idx} className="bg-white p-10 rounded-[3rem] text-center border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 bg-blue-50 text-[#00338D] rounded-2xl flex items-center justify-center mx-auto mb-6"><stat.icon size={32} /></div>
                <div className="text-5xl font-black text-[#00338D] mb-2">{stat.value.toLocaleString()}</div>
                <div className="text-xs font-black uppercase tracking-widest text-slate-400">{lang === 'ar' ? stat.label_ar : stat.label_en}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Section 3: About Deep Dive --- */}
      <section id="about" className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-50 rounded-full blur-[120px] -z-10 translate-x-1/2"></div>
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-[#00338D] rounded-full font-black text-xs uppercase tracking-widest">{t.about.introTitle}</div>
              <h2 className="text-4xl md:text-6xl font-black text-[#00338D] leading-tight">{t.about.title}</h2>
              <p className="text-xl font-bold text-slate-600 leading-relaxed border-s-8 border-[#D4AF37] ps-8">{t.about.intro}</p>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">{t.about.introText}</p>
              <div className="grid grid-cols-2 gap-8">
                <div className="p-8 bg-slate-50 rounded-3xl group">
                  <Target className="text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform" size={32} />
                  <h4 className="text-xl font-black text-[#00338D] mb-2">{t.about.vision}</h4>
                  <p className="text-sm font-bold text-slate-500">{t.about.visionText}</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-3xl group">
                  <ShieldCheck className="text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform" size={32} />
                  <h4 className="text-xl font-black text-[#00338D] mb-2">{t.about.mission}</h4>
                  <p className="text-sm font-bold text-slate-500">{t.about.missionText}</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-[#D4AF37]/10 rounded-[4rem] rotate-3 -z-10"></div>
              <img src="https://images.unsplash.com/photo-1591115765373-520b7a3d72b7?q=80&w=1470&auto=format&fit=crop" className="w-full rounded-[4rem] shadow-2xl" />
              <div className="absolute bottom-10 left-10 bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex items-center gap-4">
                 <div className="w-12 h-12 bg-[#00338D] rounded-full flex items-center justify-center text-white font-black">7+</div>
                 <div>
                    <div className="font-black text-[#00338D] text-sm">{lang === 'ar' ? 'أعوام من العطاء' : 'Years of Service'}</div>
                    <div className="text-xs font-bold text-slate-400">{lang === 'ar' ? 'منذ التأسيس' : 'Since Foundation'}</div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 4: Strategic Objectives (Cards) --- */}
      <section id="objectives" className="py-32 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-24 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-[#00338D] mb-6">{t.objectives.title}</h2>
            <p className="text-lg font-bold text-slate-400">{t.objectives.subtitle}</p>
            <div className="w-20 h-1.5 bg-[#D4AF37] mx-auto rounded-full mt-8"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {t.objectives.items.map((item, idx) => (
              <div key={idx} className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full opacity-40 -z-10 group-hover:bg-[#D4AF37]/10 transition-colors"></div>
                <div className="w-14 h-14 bg-[#00338D] text-white rounded-2xl flex items-center justify-center font-black text-xl mb-8 group-hover:rotate-12 transition-transform">{idx + 1}</div>
                <h3 className="text-2xl font-black text-[#00338D] mb-6">{item.title}</h3>
                <p className="text-slate-500 font-bold leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Section 5: Observatory --- */}
      <section id="observatory" className="py-32 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-50 text-red-600 rounded-full font-black text-xs uppercase tracking-widest mb-6 border border-red-100">
              <Eye size={14} /> {lang === 'ar' ? 'البث المباشر للمرصد' : 'Live Observatory'}
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-[#00338D] mb-8">{t.observatory.title}</h2>
            <p className="text-xl text-slate-500 font-bold leading-relaxed">{t.observatory.subtitle}</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 bg-slate-50 rounded-[4rem] p-10 border border-slate-100 relative min-h-[500px] flex flex-col group overflow-hidden">
              <div className="flex justify-between items-center mb-8 relative z-10">
                <h3 className="text-2xl font-black text-[#00338D]">{t.observatory.mapTitle}</h3>
                <Map size={24} className="text-slate-300" />
              </div>
              <div className="flex-1 relative bg-white rounded-3xl border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full text-slate-200 fill-current p-12">
                  <path d="M10,40 L30,30 L50,35 L80,30 L90,50 L85,70 L60,85 L40,90 L20,80 L10,60 Z" className="opacity-10" />
                  {YEMEN_REGIONS.map((region) => (
                    <g key={region.id} className="cursor-pointer group/pin" onClick={() => setSelectedRegion(region)}>
                      <circle cx={region.x} cy={region.y} r={3 + region.count / 15} className={`fill-red-500/20 stroke-red-500 stroke-2 transition-all ${selectedRegion?.id === region.id ? 'fill-red-500 r-8' : 'hover:fill-red-500/40'}`} />
                      <circle cx={region.x} cy={region.y} r="2" className="fill-red-600" />
                    </g>
                  ))}
                </svg>
                {selectedRegion && (
                  <div className="absolute bottom-8 right-8 left-8 md:left-auto md:w-80 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 animate-in slide-in-from-bottom duration-300">
                     <button onClick={() => setSelectedRegion(null)} className="absolute top-4 right-4 text-slate-300 hover:text-slate-900"><X size={18}/></button>
                     <h4 className="text-xl font-black text-[#00338D] mb-1">{lang === 'ar' ? selectedRegion.name_ar : selectedRegion.name_en}</h4>
                     <p className="text-sm font-bold text-slate-400 mb-4">{lang === 'ar' ? 'انتهاكات مرصودة' : 'Monitored Violations'}</p>
                     <span className="text-5xl font-black text-red-600">{selectedRegion.count}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-[#00338D] text-white p-12 rounded-[4rem] shadow-2xl relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                <h3 className="text-3xl font-black mb-10">{t.observatory.reportTitle}</h3>
                <form className="space-y-6">
                  <input type="text" placeholder={t.observatory.form.victimName} className="w-full px-8 py-5 rounded-2xl bg-white/10 border-white/20 text-white font-bold outline-none focus:bg-white/20 transition-all" />
                  <div className="grid grid-cols-2 gap-4">
                    <select className="px-8 py-5 rounded-2xl bg-white/10 border-white/20 text-white font-bold outline-none appearance-none">
                      <option className="text-slate-950">{t.observatory.form.violationType}</option>
                    </select>
                    <input type="date" className="px-8 py-5 rounded-2xl bg-white/10 border-white/20 text-white font-bold outline-none" />
                  </div>
                  <textarea rows={4} placeholder={t.observatory.form.description} className="w-full px-8 py-5 rounded-2xl bg-white/10 border-white/20 text-white font-bold outline-none focus:bg-white/20 resize-none"></textarea>
                  <button className="w-full py-6 bg-[#D4AF37] hover:bg-white hover:text-[#00338D] text-white rounded-[2rem] font-black text-xl transition-all flex items-center justify-center gap-3">
                    <Send size={24} /> {t.observatory.form.submit}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 6: Projects --- */}
      <section id="projects" className="py-32 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-20 gap-8">
            <div className="max-w-xl text-center md:text-start">
              <h2 className="text-4xl md:text-6xl font-black text-[#00338D] mb-6">{t.nav.projects}</h2>
              <p className="text-lg font-bold text-slate-400 leading-relaxed">{lang === 'ar' ? 'مبادراتنا العملية لتغيير واقع الصحافة في اليمن.' : 'Our practical initiatives to change the journalism reality in Yemen.'}</p>
            </div>
            <a href="#" className="flex items-center gap-2 font-black text-[#D4AF37] hover:gap-4 transition-all">
               {lang === 'ar' ? 'شاهد كل المشاريع' : 'View all projects'} <ArrowRight size={20} />
            </a>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {posts.filter(p => p.type === 'project').map(proj => (
              <div key={proj.id} className="bg-white rounded-[4rem] overflow-hidden border border-slate-100 shadow-sm group hover:shadow-2xl transition-all duration-700">
                <div className="aspect-video relative overflow-hidden">
                  <img src={proj.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute top-8 left-8 bg-[#00338D]/90 text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest">{lang === 'ar' ? proj.category_ar : proj.category_en}</div>
                </div>
                <div className="p-12">
                  <h3 className="text-2xl font-black text-[#00338D] mb-6 line-clamp-1">{lang === 'ar' ? proj.title_ar : proj.title_en}</h3>
                  <p className="text-slate-500 font-bold mb-10 line-clamp-2 leading-relaxed">{lang === 'ar' ? proj.desc_ar : proj.desc_en}</p>
                  <button className="flex items-center gap-2 font-black text-[#D4AF37] hover:translate-x-2 transition-transform">{lang === 'ar' ? 'استعراض المشروع' : 'View Project'} <ChevronRight size={18}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Section 7: Team --- */}
      <section id="team" className="py-32 bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-[#00338D] mb-6">{t.team.title}</h2>
            <p className="text-lg font-bold text-slate-400">{t.team.subtitle}</p>
            <div className="w-20 h-1.5 bg-[#D4AF37] mx-auto rounded-full mt-8"></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
            {teamMembers.map((member, i) => (
              <div key={i} className="group cursor-default">
                <div className="aspect-square rounded-[3rem] overflow-hidden mb-6 relative border-4 border-slate-50 group-hover:border-[#D4AF37] transition-all duration-500">
                  <img src={member.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#00338D]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-6">
                    <div className="flex gap-4 text-white">
                      <Facebook size={18} className="cursor-pointer hover:text-[#D4AF37]" />
                      <Twitter size={18} className="cursor-pointer hover:text-[#D4AF37]" />
                    </div>
                  </div>
                </div>
                <h4 className="text-lg font-black text-[#00338D] mb-1">{lang === 'ar' ? member.name_ar : member.name_en}</h4>
                <div className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">{lang === 'ar' ? member.role_ar : member.role_en}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Footer & Final CTA --- */}
      <section className="py-24 bg-[#00338D] text-white">
        <div className="container mx-auto px-6 text-center">
           <h2 className="text-3xl md:text-5xl font-black mb-8">{lang === 'ar' ? 'كن جزءاً من مسيرة الحرية' : 'Join the Freedom Movement'}</h2>
           <p className="text-xl text-blue-100/60 mb-12 max-w-2xl mx-auto font-bold">{lang === 'ar' ? 'تواصل معنا اليوم للمساهمة في دعم الصحافة اليمنية وتطوير قدرات كوادرها.' : 'Connect with us today to contribute to supporting Yemeni press and developing its staff.'}</p>
           <div className="flex flex-wrap justify-center gap-6">
              <a href="mailto:info@phye.org" className="flex items-center gap-3 px-10 py-5 bg-white text-[#00338D] rounded-2xl font-black text-lg hover:bg-slate-50 transition-all"><Mail size={24}/> {t.contact.email}</a>
              <a href="tel:04210613" className="flex items-center gap-3 px-10 py-5 bg-white/10 text-white border border-white/20 rounded-2xl font-black text-lg hover:bg-white/20 transition-all"><Phone size={24}/> {t.contact.phone}</a>
           </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-white py-12 border-t border-white/5">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <Newspaper size={24} className="text-[#D4AF37]" />
            <span className="text-xl font-black tracking-tighter uppercase">{t.orgName}</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-slate-500 font-bold text-sm text-center">{t.footer.rights}</p>
            <a href="https://raidan.pro" target="_blank" rel="noopener noreferrer" className="text-xs font-black tracking-widest text-[#D4AF37] hover:text-white transition-colors">Powered By RaidanPro</a>
          </div>
          <div className="flex gap-4">
             {[Facebook, Twitter, Linkedin].map((Icon, i) => (
               <a key={i} href="#" className="p-3 bg-white/5 rounded-lg hover:bg-[#D4AF37] transition-all"><Icon size={18} /></a>
             ))}
          </div>
        </div>
      </footer>

      {/* --- Robust Login Modal --- */}
      {showLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[3rem] p-10 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Visual Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10"></div>
            
            <button 
              onClick={() => { setShowLogin(false); setAuthError(false); }} 
              className="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors"
              disabled={isLoggingIn}
            >
              <X size={28} />
            </button>

            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-[#00338D] text-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-900/40 relative">
                <Lock size={36} />
                {isLoggingIn && (
                  <div className="absolute inset-0 bg-[#00338D] rounded-[2rem] flex items-center justify-center">
                    <Loader2 size={36} className="animate-spin text-[#D4AF37]" />
                  </div>
                )}
              </div>
              <h3 className="text-3xl font-black text-[#00338D] mb-2">{t.auth.login}</h3>
              <p className="text-slate-400 font-bold text-sm">{lang === 'ar' ? 'يرجى إدخال بيانات الاعتماد للوصول للوحة التحكم' : 'Please enter credentials to access dashboard'}</p>
            </div>

            {authError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in slide-in-from-top-2 duration-200">
                <ShieldAlert size={20} />
                <span className="text-sm font-bold">{t.auth.error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ps-2">{t.auth.username}</label>
                <div className="relative group">
                  <UserCheck size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#00338D] transition-colors" />
                  <input 
                    type="text" 
                    required
                    disabled={isLoggingIn}
                    placeholder="e.g. admin"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                    className="w-full pl-14 pr-8 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#00338D]/20 focus:bg-white font-bold outline-none transition-all placeholder:text-slate-300" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ps-2">{t.auth.password}</label>
                <div className="relative group">
                  <Lock size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#00338D] transition-colors" />
                  <input 
                    type="password" 
                    required
                    disabled={isLoggingIn}
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                    className="w-full pl-14 pr-8 py-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#00338D]/20 focus:bg-white font-bold outline-none transition-all placeholder:text-slate-300" 
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 ps-2">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded accent-[#00338D]" />
                <label htmlFor="remember" className="text-sm font-bold text-slate-500">{t.auth.rememberMe}</label>
              </div>

              <button 
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-5 bg-[#00338D] text-white rounded-[2rem] font-black text-xl shadow-xl shadow-blue-900/20 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    <span>{t.auth.loggingIn}</span>
                  </>
                ) : (
                  <>
                    <LogIn size={24} />
                    <span>{t.auth.login}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {isLoggedIn && isCmsOpen && <CMSDashboard />}
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);