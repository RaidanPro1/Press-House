
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Globe, Menu, X, Newspaper, ShieldCheck, Users, BookOpen, Download, 
  Mail, Phone, MapPin, Facebook, Twitter, Linkedin, ArrowRight,
  ChevronLeft, ChevronRight, ExternalLink, Award, Lock, MessageSquare,
  Target, UserCheck, Settings, Plus, Trash2, Edit3, Image as ImageIcon,
  Calendar, Eye, FileText, Video, Briefcase, Handshake, Truck, LogIn,
  LogOut, LayoutDashboard, FileUp, Search, Filter, ChevronDown, Tag,
  Clock, CheckCircle2, AlertCircle, Send, Radio
} from 'lucide-react';

// --- Types ---
type ContentType = 'news' | 'program' | 'resource' | 'opportunity' | 'video' | 'project';

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
}

interface TeamMember {
  name_ar: string;
  role_ar: string;
  image: string;
}

// --- Initial Data ---
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
    id: 'p2',
    type: 'project',
    title_ar: 'مشروع دقة لمكافحة فوضى المعلومات',
    title_en: 'Daqqa Project for Fact-Checking',
    desc_ar: 'يهدف إلى الحد من انتشار المعلومات المضللة وتزويد الصحفيين بالمهارات اللازمة للتحقق من المعلومات عبر الإنترنت.',
    desc_en: 'Reducing misinformation and equipping journalists with OSINT and fact-checking skills.',
    date: '2024-02-15',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1472&auto=format&fit=crop',
    category_ar: 'مشاريع',
    category_en: 'Projects'
  },
  {
    id: 'p3',
    type: 'project',
    title_ar: 'مشروع الصحافة مفتوحة المصدر',
    title_en: 'Open Source Journalism Project',
    desc_ar: 'تعزيز قدرات الصحفيين في التحقيقات مفتوحة المصدر واستخدام المصادر المفتوحة في الصحافة.',
    desc_en: 'Enhancing investigative skills through Open Source Intelligence (OSINT) training.',
    date: '2024-03-10',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1470&auto=format&fit=crop',
    category_ar: 'تدريب',
    category_en: 'Training'
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
      team: 'الفريق',
      partners: 'شركاؤنا',
      contact: 'اتصل بنا',
      cms: 'لوحة التحكم',
      switch: 'English',
      logout: 'تسجيل الخروج'
    },
    auth: { login: 'تسجيل الدخول' },
    hero: {
      title: 'صحافة مهنية حرة أولويتها الإنسان',
      subtitle: 'نعمل من أجل تعزيز حرية الإعلام وخلق مساحة نقاش مهني وعملي للصحفيين في اليمن.',
    },
    about: {
      title: 'مؤسسة بيت الصحافة',
      intro: 'مؤسسة مجتمع مدني تهدف إلى تعزيز حرية الإعلام وخلق مساحة نقاش مهني وعملي للصحفيين والصحفيات، وتبني قضاياهم والعمل على تطوير ودعم الصحافة في اليمن بما يضمن وجود صحافة من أجل الإنسان أولاً وأخيراً.',
      introTitle: 'مقدمة',
      introText: 'في ظل الوضع القائم في اليمن والحرب المستمرة، عاشت الصحافة تأثيرات كل هذه الظروف وواجهتها، وانتكست كثيراً بسببها، خاصة في ظل الحاجة الماسة لتعزيز وإسناد نقابة الصحفيين اليمنيين، وموسمية دور منظمات المجتمع المدني، والافتقار لوجود مساحات نقاش دائمة للصحفيين والصحفيات، وغياب العمل على تطوير ودعم الصحافة وضعف برامج التدريب والتأهيل.',
      vision: 'الرؤية',
      visionText: 'صحافة مهنية حرة أولويتها الإنسان.',
      mission: 'الرسالة',
      missionText: 'أن تصبح بيت الصحافة المؤسسة الأولى في تعزيز حرية الصحافة وحمل مطالبها والدفاع عن استحقاقاتها وحضورها وتعزز دورها في الدفاع عن الإنسان أولاً وأخيراً.',
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
        'ربط المجتمع الصحفي اليمني بنظرائه في الدول العربية والعالم بخلق جسور تنطلق من التحديات المهنية والهموم الإنسانية المشتركة.'
      ]
    },
    contact: {
      address: 'اليمن - تعز',
      phone: '04-210613',
      email: 'info@phye.org',
      website: 'www.phye.org'
    },
    footer: { rights: 'جميع الحقوق محفوظة © ٢٠٢٤ مؤسسة بيت الصحافة' }
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
      team: 'Team',
      partners: 'Partners',
      contact: 'Contact',
      cms: 'Admin',
      switch: 'العربية',
      logout: 'Logout'
    },
    auth: { login: 'Login' },
    hero: {
      title: 'Professional Press with Human Priority',
      subtitle: 'Working to enhance media freedom and create a professional debate space for journalists in Yemen.',
    },
    about: {
      title: 'Press House Foundation',
      intro: 'A civil society organization aiming to enhance media freedom and create professional discussion spaces for journalists, advocating for their issues and supporting Yemeni journalism to ensure "human-first" media.',
      introTitle: 'Introduction',
      introText: 'Under the ongoing war in Yemen, journalism has faced severe setbacks. There is an urgent need to support the Yemeni Journalists Syndicate and move beyond the seasonal roles of NGOs by creating permanent discussion spaces and robust training programs.',
      vision: 'Vision',
      visionText: 'Free professional journalism with human priority.',
      mission: 'Mission',
      missionText: 'To become the leading institution in promoting press freedom, defending its rights, and strengthening its role in human advocacy.',
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
    { name: t.nav.team, href: '#team' },
    { name: t.nav.partners, href: '#partners' },
    { name: t.nav.contact, href: '#contact' },
  ], [t]);

  // Color constants based on logo
  const colors = {
    blue: '#00338D', // Deep blue from logo
    gold: '#D4AF37', // Gold/Yellow from logo
    bgLight: '#F8FAFC'
  };

  return (
    <div className={`min-h-screen flex flex-col bg-white text-slate-900 ${lang === 'en' ? 'font-en' : 'font-ar'}`}>
      
      {/* Navigation */}
      <nav className={`fixed w-full z-[60] transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center h-16">
          
          {/* Logo - Always on the side based on direction */}
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg overflow-hidden"
              style={{ backgroundColor: colors.blue }}
            >
              <img src="https://phye.org/images/logo.png" alt="PH" className="w-8 h-8 object-contain brightness-200" onError={(e) => (e.currentTarget.style.display='none')} />
              {!document.querySelector('img[alt="PH"]') && <Newspaper size={24} />}
            </div>
            <span className={`text-xl font-black tracking-tighter ${isScrolled ? 'text-[#00338D]' : 'text-white'}`}>
              {t.orgName}
            </span>
          </div>

          {/* Desktop Links - Reordered for RTL/LTR correctly */}
          <div className={`hidden lg:flex items-center gap-6 ${t.dir === 'rtl' ? 'flex-row' : 'flex-row'}`}>
            <div className="flex items-center gap-6 mx-8">
              {navItems.map((link) => (
                <a 
                  key={link.href} 
                  href={link.href} 
                  className={`font-bold transition-all px-2 py-1 relative group text-sm ${isScrolled ? 'text-blue-900/70' : 'text-white/70'} hover:text-[#D4AF37]`}
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#D4AF37] transition-all group-hover:w-full"></span>
                </a>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              <button onClick={toggleLang} className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all text-xs font-black shadow-sm ${isScrolled ? 'border-gray-100 bg-white text-blue-900' : 'border-white/20 bg-white/10 text-white'}`}>
                {lang === 'ar' ? 'EN' : 'AR'}
              </button>
              <button 
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#00338D] hover:bg-[#D4AF37] hover:text-white transition-all font-black text-sm border border-transparent shadow-md"
              >
                <LogIn size={16} />
                <span>{t.auth.login}</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={isScrolled ? 'text-blue-900' : 'text-white'}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-2xl p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
            {navItems.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className="font-bold text-blue-900 p-2 border-b border-gray-50">{link.name}</a>
            ))}
            <div className="flex gap-4 pt-4">
              <button onClick={toggleLang} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold">{t.nav.switch}</button>
              <button onClick={() => setShowLogin(true)} className="flex-1 py-3 bg-blue-900 text-white rounded-xl font-bold">{t.auth.login}</button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-[85vh] bg-[#00338D] overflow-hidden flex items-center pt-20">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1470&auto=format&fit=crop" className="w-full h-full object-cover opacity-20 scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#00338D] via-transparent to-transparent"></div>
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center md:text-start">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.2] mb-8">
              {t.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100/80 font-bold mb-10 max-w-2xl leading-relaxed">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <a href="#about" className="px-8 py-4 bg-[#D4AF37] text-white rounded-xl font-black text-lg hover:scale-105 transition-all shadow-xl">
                {lang === 'ar' ? 'تعرف علينا' : 'Learn More'}
              </a>
              <a href="#projects" className="px-8 py-4 border-2 border-white/20 text-white rounded-xl font-black text-lg hover:bg-white/10 transition-all">
                {t.nav.projects}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - From PDF Intro */}
      <section id="about" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <div className="inline-block px-4 py-1 bg-blue-50 text-[#00338D] rounded-lg font-black text-sm uppercase tracking-widest">{t.about.introTitle}</div>
              <h2 className="text-4xl font-black text-[#00338D]">{t.about.title}</h2>
              <p className="text-xl font-bold text-gray-700 leading-relaxed bg-[#D4AF37]/10 p-6 border-s-4 border-[#D4AF37] rounded-e-xl">
                {t.about.intro}
              </p>
              <p className="text-lg text-gray-500 font-medium leading-relaxed">
                {t.about.introText}
              </p>
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
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform"></div>
                <Users className="text-[#D4AF37] mb-4" size={32} />
                <h3 className="text-2xl font-black mb-4">{lang === 'ar' ? 'فريقنا' : 'Our Team'}</h3>
                <p className="font-bold text-blue-100/70">
                  {lang === 'ar' ? 'نعمل بروح الفريق الواحد من أجل قضية سامية تخدم الصحافة والإنسان.' : 'Working as one team for a noble cause serving journalism and humanity.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives Section - Detailed from PDF */}
      <section id="objectives" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-[#00338D] mb-4">{t.objectives.title}</h2>
            <div className="w-20 h-1.5 bg-[#D4AF37] mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.objectives.items.map((obj, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex gap-4 group hover:shadow-md transition-all">
                <div className="w-10 h-10 bg-blue-50 text-[#00338D] rounded-lg flex items-center justify-center font-black flex-shrink-0 group-hover:bg-[#00338D] group-hover:text-white transition-colors">
                  {idx + 1}
                </div>
                <p className="font-bold text-gray-700 leading-relaxed text-sm">
                  {obj}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects/Programs Section */}
      <section id="projects" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-4xl font-black text-[#00338D]">{t.nav.projects}</h2>
            <button className="text-[#D4AF37] font-black flex items-center gap-2 hover:gap-3 transition-all">
              {lang === 'ar' ? 'جميع المشاريع' : 'All Projects'}
              <ArrowRight size={20} />
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {initialPosts.map(project => (
              <div key={project.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="aspect-video relative overflow-hidden">
                  <img src={project.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-[#00338D]/90 backdrop-blur-md rounded-lg text-white font-bold text-xs">
                    {project.category_ar}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-black text-[#00338D] mb-4 line-clamp-2">
                    {lang === 'ar' ? project.title_ar : project.title_en}
                  </h3>
                  <p className="text-gray-500 font-bold text-sm mb-6 line-clamp-3 leading-relaxed">
                    {lang === 'ar' ? project.desc_ar : project.desc_en}
                  </p>
                  <button className="flex items-center gap-2 font-black text-[#D4AF37] text-sm group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1">
                    {lang === 'ar' ? 'التفاصيل' : 'Details'}
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-[#00338D] mb-4">{t.nav.team}</h2>
            <div className="w-20 h-1.5 bg-[#D4AF37] mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="text-center group">
                <div className="w-40 h-40 mx-auto rounded-2xl overflow-hidden mb-4 border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-500">
                  <img src={member.image} className="w-full h-full object-cover" />
                </div>
                <h4 className="text-lg font-black text-blue-950">{member.name_ar}</h4>
                <p className="text-sm font-bold text-[#D4AF37]">{member.role_ar}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-[#00338D] mb-4">{t.nav.partners}</h2>
            <div className="w-20 h-1.5 bg-[#D4AF37] mx-auto rounded-full"></div>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60">
             {['قرار', 'أرنيادا', 'يوب يوب', 'وهج الشباب', 'ألف'].map((partner, i) => (
               <div key={i} className="flex flex-col items-center gap-3 grayscale hover:grayscale-0 transition-all">
                  <Handshake size={48} className="text-[#00338D]" />
                  <span className="font-black text-blue-900">{partner}</span>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-5xl font-black mb-8">{t.nav.contact}</h2>
              <p className="text-xl text-slate-400 font-bold mb-12">
                {lang === 'ar' ? 'نحن هنا للإجابة على تساؤلاتكم ودعمكم المهني.' : 'We are here to answer your questions and support you.'}
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[#D4AF37]">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h5 className="font-black text-slate-300 text-xs uppercase tracking-widest">{lang === 'ar' ? 'المقر' : 'Location'}</h5>
                    <p className="font-bold">{t.contact.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[#D4AF37]">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h5 className="font-black text-slate-300 text-xs uppercase tracking-widest">{lang === 'ar' ? 'الهاتف' : 'Phone'}</h5>
                    <p className="font-bold">{t.contact.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[#D4AF37]">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h5 className="font-black text-slate-300 text-xs uppercase tracking-widest">{lang === 'ar' ? 'البريد' : 'Email'}</h5>
                    <p className="font-bold">{t.contact.email}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl">
              <form className="space-y-6">
                <input 
                  type="text" 
                  placeholder={lang === 'ar' ? 'الاسم الكامل' : 'Full Name'} 
                  className="w-full px-6 py-4 rounded-xl bg-slate-50 border-transparent focus:ring-2 focus:ring-[#D4AF37] font-bold text-slate-900" 
                />
                <input 
                  type="email" 
                  placeholder={lang === 'ar' ? 'البريد الإلكتروني' : 'Email'} 
                  className="w-full px-6 py-4 rounded-xl bg-slate-50 border-transparent focus:ring-2 focus:ring-[#D4AF37] font-bold text-slate-900" 
                />
                <textarea 
                  rows={4} 
                  placeholder={lang === 'ar' ? 'كيف يمكننا مساعدتك؟' : 'How can we help?'} 
                  className="w-full px-6 py-4 rounded-xl bg-slate-50 border-transparent focus:ring-2 focus:ring-[#D4AF37] font-bold text-slate-900 resize-none"
                ></textarea>
                <button className="w-full py-4 bg-[#00338D] hover:bg-[#D4AF37] text-white rounded-xl font-black text-lg transition-all shadow-lg flex items-center justify-center gap-3">
                  <Send size={20} />
                  {lang === 'ar' ? 'إرسال الرسالة' : 'Send Message'}
                </button>
              </form>
            </div>
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
          <p className="text-slate-500 font-bold text-sm text-center">
            {t.footer.rights}
          </p>
          <div className="flex gap-4">
             {[Facebook, Twitter, Linkedin].map((Icon, i) => (
               <a key={i} href="#" className="p-3 bg-white/5 rounded-lg hover:bg-[#D4AF37] transition-all"><Icon size={18} /></a>
             ))}
          </div>
        </div>
      </footer>

      {showLogin && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-3xl p-10 shadow-2xl relative">
            <button onClick={() => setShowLogin(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors"><X size={24} /></button>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#00338D] text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-900/20">
                <Lock size={32} />
              </div>
              <h3 className="text-2xl font-black text-[#00338D]">{t.auth.login}</h3>
            </div>
            <form className="space-y-4">
              <input type="text" placeholder="Username" className="w-full px-6 py-4 rounded-xl bg-slate-50 border-transparent font-bold" />
              <input type="password" placeholder="Password" className="w-full px-6 py-4 rounded-xl bg-slate-50 border-transparent font-bold" />
              <button className="w-full py-4 bg-[#00338D] text-white rounded-xl font-black text-lg shadow-xl shadow-blue-900/10">
                {t.auth.login}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
