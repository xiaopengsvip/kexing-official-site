import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import * as THREE from 'three';
import {
  ArrowRight,
  Bot,
  Building2,
  Cable,
  ChevronRight,
  Cloud,
  Cpu,
  Globe,
  Hotel,
  Languages,
  Menu,
  MonitorSmartphone,
  Network,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';

type Locale = 'zh' | 'en';
type NavLink = { name: string; href: string };

type SiteCopy = {
  nav: { home: string; lab3d: string; services: string; cases: string; profile: string; contact: string; cta: string; labTag: string };
  hero: {
    badge: string;
    title1: string;
    title2: string;
    desc: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: Array<{ label: string; value: string }>;
    sideDesc: string;
  };
  lab3d: {
    title: string;
    desc: string;
    badge: string;
    cards: Array<{ title: string; desc: string }>;
  };
  services: { title: string; desc: string; cta: string; items: Array<{ title: string; desc: string }> };
  cases: { title: string; items: Array<{ title: string; intro: string }> };
  process: { title: string; steps: Array<{ title: string; desc: string }> };
  faq: { title: string; items: Array<{ q: string; a: string }> };
  profile: {
    title: string;
    fieldsLeft: Array<{ label: string; value: string }>;
    fieldsRight: Array<{ label: string; value: string }>;
    tags: string[];
  };
  contact: { title: string; desc: string; domainLabel: string; business: string; backTop: string };
  footer: { company: string; code: string; skip: string };
};

const copy: Record<Locale, SiteCopy> = {
  zh: {
    nav: {
      home: '首页',
      lab3d: '3D实验',
      services: '解决方案',
      cases: '行业案例',
      profile: '企业信息',
      contact: '联系我们',
      cta: '商务咨询',
      labTag: 'Brand Motion Lab',
    },
    hero: {
      badge: '品牌官网全新升级',
      title1: '让品牌识别、',
      title2: '数字能力与业务转化协同增长',
      desc: '柯兴科技以“弱电工程 + 软件研发 + AI应用”一体化交付为核心，面向企业、园区、酒店等场景提供可持续迭代的数智化解决方案。',
      ctaPrimary: '查看解决方案',
      ctaSecondary: '浏览行业案例',
      stats: [
        { label: '公司成立', value: '2021' },
        { label: '注册资本', value: '500万' },
        { label: '交付模型', value: '工程+软件+AI' },
      ],
      sideDesc: '从品牌官网到业务系统，从智能工程到AI应用，围绕“可展示、可运营、可扩展”目标打造企业数字化底座。',
    },
    lab3d: {
      title: '3D 实验玩法（Logo 主题）',
      desc: '采用品牌 Logo 作为核心素材，构建“主图形 + 环绕粒子 + 内容卡片投影”的品牌动效系统，兼顾视觉冲击与信息表达。',
      badge: 'Experimental / WebGL + DOM',
      cards: [
        { title: 'Logo 驱动主视觉', desc: '将品牌图标转为3D核心材质，强化识别度与记忆点。' },
        { title: '粒子与轨道光环', desc: '构建环绕动效系统，让页面在停留时持续传达品牌活性。' },
        { title: 'HTML + 3D 同层表达', desc: '内容保持原生 DOM 可读性，同时获得沉浸式空间表现。' },
        { title: '可扩展发布会动效', desc: '后续可接入点击飞行、场景切换和交互式产品讲解。' },
      ],
    },
    services: {
      title: '解决方案矩阵',
      desc: '工程实施能力与软件研发能力并行，形成可复制、可持续、可运营的交付体系。',
      cta: '获取定制方案',
      items: [
        { title: '弱电与智能化工程', desc: '覆盖综合布线、安防监控、门禁对讲、机房与网络系统集成，支持设计、施工、调试、验收全流程。' },
        { title: '智慧酒店客控系统', desc: '围绕客房灯光、空调、窗帘、情景面板与后台管理联动，提升宾客体验与酒店运营效率。' },
        { title: '企业官网与系统开发', desc: '基于主流前端技术栈打造品牌官网、业务系统与数据看板，兼顾视觉表现与业务可用性。' },
        { title: 'AI 应用落地服务', desc: '提供 AI 能力接入、业务流程自动化和智能助手定制，帮助企业构建可持续智能化能力。' },
        { title: '云与数据服务', desc: '提供数据处理、云计算技术服务与系统运维支持，保障业务连续性与系统稳定运行。' },
        { title: '信息安全与合规建设', desc: '支持网络安全软件部署、信息安全设备集成与安全能力提升，强化企业数字资产防护。' },
      ],
    },
    cases: {
      title: '行业案例场景',
      items: [
        { title: '智慧酒店客控升级', intro: '完成客房灯光/温控/场景联动与后台管理系统整合，缩短运维响应时间。' },
        { title: '园区网络与安防系统集成', intro: '实现监控、门禁、网络与机房系统统一建设，提升管理效率与稳定性。' },
        { title: '品牌官网与业务展示平台', intro: '通过全新视觉体系与信息架构优化，提升品牌识别与咨询转化效率。' },
      ],
    },
    process: {
      title: '项目推进流程',
      steps: [
        { title: '需求诊断', desc: '梳理现状系统、业务目标与预算边界，形成可执行范围。' },
        { title: '方案设计', desc: '输出信息架构、技术架构、视觉方案与里程碑计划。' },
        { title: '敏捷交付', desc: '按周迭代开发与联调，持续验收，确保上线质量。' },
        { title: '运维优化', desc: '上线后提供监控、告警与持续优化支持。' },
      ],
    },
    faq: {
      title: '常见问题',
      items: [
        { q: '是否支持中英文官网？', a: '支持，当前站点已具备中英文切换和多语言内容结构。' },
        { q: '能否同时做工程与软件系统？', a: '可以，柯兴采用“弱电工程 + 软件研发 + AI应用”协同交付。' },
        { q: '项目周期一般多久？', a: '通常 2-8 周，取决于页面范围、系统联动复杂度与验收标准。' },
      ],
    },
    profile: {
      title: '企业经营信息',
      fieldsLeft: [
        { label: '企业名称', value: '柯兴科技（深圳）有限公司' },
        { label: '统一社会信用代码', value: '91440300MA5H0HLK5U' },
        { label: '成立日期', value: '2021-09-22' },
        { label: '法定代表人', value: '葛亚鹏' },
        { label: '注册资本', value: '500万元' },
      ],
      fieldsRight: [
        { label: '企业状态', value: '存续' },
        { label: '所属行业', value: '信息传输、软件和信息技术服务业' },
        { label: '注册地址', value: '深圳市罗湖区笋岗街道田心社区宝安北路3008号宝能中心E栋18层05' },
      ],
      tags: [
        '计算机系统服务',
        '信息系统集成服务',
        '人工智能应用软件开发',
        '智能控制系统集成',
        '网络与信息安全软件开发',
        '物联网技术服务',
        '云计算装备技术服务',
        '数据处理和存储支持服务',
        '数字文化创意软件开发',
        '建设工程施工（许可）',
      ],
    },
    contact: {
      title: '欢迎咨询合作',
      desc: '如果你正在规划弱电智能化、酒店客控、品牌官网或 AI 应用项目，欢迎与我们联系，我们将在 24 小时内响应。',
      domainLabel: '官网地址',
      business: '业务方向：弱电工程 / 软件开发 / AI 应用',
      backTop: '返回顶部',
    },
    footer: {
      company: '柯兴科技（深圳）有限公司',
      code: '统一社会信用代码：91440300MA5H0HLK5U',
      skip: '跳转到主要内容',
    },
  },
  en: {
    nav: {
      home: 'Home',
      lab3d: '3D Lab',
      services: 'Solutions',
      cases: 'Cases',
      profile: 'Company',
      contact: 'Contact',
      cta: 'Business Inquiry',
      labTag: 'Brand Motion Lab',
    },
    hero: {
      badge: 'Official Website Upgraded',
      title1: 'Unify brand identity,',
      title2: 'digital capability and business conversion',
      desc: 'Kexing Technology delivers integrated Low-Voltage Engineering + Software R&D + AI Applications for enterprise, campus and hospitality scenarios.',
      ctaPrimary: 'View Solutions',
      ctaSecondary: 'Explore Cases',
      stats: [
        { label: 'Founded', value: '2021' },
        { label: 'Registered Capital', value: 'RMB 5M' },
        { label: 'Delivery Model', value: 'Engineering + Software + AI' },
      ],
      sideDesc: 'From official websites to business systems, from intelligent engineering to AI applications — built for visibility, operations and scale.',
    },
    lab3d: {
      title: '3D Experience (Logo Mode)',
      desc: 'Using the brand logo as the core material, this scene combines key visual geometry, orbital particles and projected content cards.',
      badge: 'Experimental / WebGL + DOM',
      cards: [
        { title: 'Logo-driven visual center', desc: 'Transforms the brand icon into a live 3D core for stronger recognition.' },
        { title: 'Particle & orbital halo', desc: 'Builds a motion system that keeps the page alive while users browse.' },
        { title: 'HTML + 3D co-layering', desc: 'Maintains native DOM readability while adding immersive spatial expression.' },
        { title: 'Expandable launch-stage mode', desc: 'Ready for camera flights, scene transitions and interactive storytelling.' },
      ],
    },
    services: {
      title: 'Solution Matrix',
      desc: 'Engineering delivery and software R&D run in parallel to form a repeatable and scalable delivery model.',
      cta: 'Get Custom Plan',
      items: [
        { title: 'Low-voltage & intelligent engineering', desc: 'Cabling, surveillance, access control, server room and network integration from design to acceptance.' },
        { title: 'Smart hotel guest control', desc: 'Integrates lighting, HVAC, curtains and scene panels with management systems for better experience and efficiency.' },
        { title: 'Corporate websites & systems', desc: 'Builds modern websites, business systems and dashboards with both visual quality and operational usability.' },
        { title: 'AI application delivery', desc: 'Integrates AI capabilities, automation and assistants into practical business workflows.' },
        { title: 'Cloud & data services', desc: 'Provides data processing, cloud support and operations services for continuity and stability.' },
        { title: 'Security & compliance enablement', desc: 'Deploys security software and devices to strengthen enterprise digital asset protection.' },
      ],
    },
    cases: {
      title: 'Industry Cases',
      items: [
        { title: 'Smart hotel control upgrade', intro: 'Integrated room lighting, temperature and scene controls with central management to shorten response time.' },
        { title: 'Campus network & security integration', intro: 'Unified surveillance, access, network and server systems to improve stability and management efficiency.' },
        { title: 'Official brand website platform', intro: 'Improved identity consistency and inquiry conversion through upgraded visual system and information architecture.' },
      ],
    },
    process: {
      title: 'Delivery Workflow',
      steps: [
        { title: 'Discovery', desc: 'Clarify business goals, current systems and project boundaries.' },
        { title: 'Solution Design', desc: 'Define IA, technical architecture, visual system and milestones.' },
        { title: 'Agile Delivery', desc: 'Iterative development and integration with staged acceptance.' },
        { title: 'Operations Optimization', desc: 'Post-launch monitoring, alerting and continuous improvements.' },
      ],
    },
    faq: {
      title: 'Frequently Asked Questions',
      items: [
        { q: 'Do you support bilingual websites?', a: 'Yes. This website includes bilingual structure and language switching.' },
        { q: 'Can you deliver engineering and software together?', a: 'Yes. Kexing delivers low-voltage engineering, software and AI as one solution.' },
        { q: 'How long does a project usually take?', a: 'Typically 2-8 weeks depending on scope, integration complexity and acceptance standards.' },
      ],
    },
    profile: {
      title: 'Company Information',
      fieldsLeft: [
        { label: 'Company Name', value: 'Kexing Technology (Shenzhen) Co., Ltd.' },
        { label: 'Unified Social Credit Code', value: '91440300MA5H0HLK5U' },
        { label: 'Established', value: '2021-09-22' },
        { label: 'Legal Representative', value: 'Ge Yapeng' },
        { label: 'Registered Capital', value: 'RMB 5,000,000' },
      ],
      fieldsRight: [
        { label: 'Status', value: 'Active' },
        { label: 'Industry', value: 'Information Transmission, Software and IT Services' },
        { label: 'Registered Address', value: '18F-05, Building E, Baoneng Center, Baoan North Rd 3008, Luohu District, Shenzhen' },
      ],
      tags: [
        'Computer System Services',
        'System Integration',
        'AI Application Development',
        'Intelligent Control Integration',
        'Cybersecurity Software',
        'IoT Technical Services',
        'Cloud Technical Services',
        'Data Processing & Storage',
        'Digital Creative Software',
        'Construction (Licensed)',
      ],
    },
    contact: {
      title: 'Let’s Build Together',
      desc: 'Planning low-voltage intelligence, hotel control, an official website or AI applications? Contact us and we will respond within 24 hours.',
      domainLabel: 'Website',
      business: 'Business Focus: Engineering / Software / AI',
      backTop: 'Back to top',
    },
    footer: {
      company: 'Kexing Technology (Shenzhen) Co., Ltd.',
      code: 'Unified Social Credit Code: 91440300MA5H0HLK5U',
      skip: 'Skip to main content',
    },
  },
};

function LanguageSwitcher({ locale, onToggle }: { locale: Locale; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="liquid-chip inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-slate-100 hover:text-white"
      aria-label={locale === 'zh' ? '切换到英文' : 'Switch to Chinese'}
    >
      <Languages className="h-3.5 w-3.5" />
      {locale === 'zh' ? '中文 / EN' : 'EN / 中文'}
    </button>
  );
}

function Navbar({ locale, onToggle }: { locale: Locale; onToggle: () => void }) {
  const t = copy[locale];
  const [open, setOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('#home');
  const [scrollProgress, setScrollProgress] = useState(0);

  const navLinks: NavLink[] = useMemo(
    () => [
      { name: t.nav.home, href: '#home' },
      { name: t.nav.lab3d, href: '#lab3d' },
      { name: t.nav.services, href: '#services' },
      { name: t.nav.cases, href: '#cases' },
      { name: t.nav.profile, href: '#profile' },
      { name: t.nav.contact, href: '#contact' },
    ],
    [t.nav],
  );

  useEffect(() => {
    const sections = navLinks
      .map((item) => document.querySelector(item.href) as HTMLElement | null)
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveHash(`#${entry.target.id}`);
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0.12 },
    );

    sections.forEach((el) => observer.observe(el));

    const handleScroll = () => {
      const top = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? Math.min(1, top / max) : 0);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [navLinks]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="h-0.5 w-full bg-white/5">
        <motion.div className="h-full bg-[linear-gradient(90deg,#67e8f9,#7dd3fc,#93c5fd)]" style={{ transformOrigin: 'left', scaleX: scrollProgress }} />
      </div>

      <div className="mx-auto mt-3 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="liquid-panel flex h-16 items-center justify-between rounded-2xl px-3 md:h-[72px] md:px-4">
          <a href="#home" className="flex items-center gap-3" aria-label="Kexing Home">
            <img src="/logo.png" alt="柯兴科技" className="h-9 w-auto md:h-10" />
          </a>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {navLinks.map((link) => {
              const active = activeHash === link.href;
              return (
                <a key={link.href} href={link.href} aria-current={active ? 'page' : undefined} className={`liquid-nav-item px-4 py-2 text-sm transition ${active ? 'is-active' : ''}`}>
                  {link.name}
                </a>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <LanguageSwitcher locale={locale} onToggle={onToggle} />
            <a href="#lab3d" className="liquid-chip inline-flex items-center rounded-full px-3.5 py-2 text-xs font-semibold text-sky-100">
              {t.nav.labTag}
            </a>
            <a href="#contact" className="liquid-btn inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-[#041223]">
              {t.nav.cta}
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-2 text-slate-100 hover:bg-white/10 md:hidden"
            aria-label="toggle menu"
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div id="mobile-nav" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mx-auto mt-2 max-w-7xl px-4 sm:px-6 md:hidden">
            <div className="liquid-panel space-y-1 rounded-2xl p-3">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 text-slate-100 hover:bg-white/8">
                  {link.name}
                </a>
              ))}
              <div className="mt-2 px-2"><LanguageSwitcher locale={locale} onToggle={onToggle} /></div>
              <a href="#contact" onClick={() => setOpen(false)} className="liquid-btn mt-2 block rounded-xl px-4 py-3 text-center text-sm font-semibold text-[#041223]">
                {t.nav.cta}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero({ locale }: { locale: Locale }) {
  const t = copy[locale].hero;
  return (
    <section id="home" className="relative overflow-hidden pt-34 md:pt-36">
      <div className="liquid-orb liquid-orb--a" />
      <div className="liquid-orb liquid-orb--b" />
      <div className="liquid-orb liquid-orb--c" />
      <img src="/hero-liquid.svg" alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-45 mix-blend-screen" />

      <div className="relative z-10 mx-auto grid max-w-7xl gap-9 px-4 pb-18 sm:px-6 lg:grid-cols-12 lg:px-8 lg:pb-24">
        <div className="lg:col-span-7">
          <motion.span initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="liquid-chip inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-semibold tracking-widest text-cyan-100">
            <Sparkles className="h-3.5 w-3.5" /> {t.badge}
          </motion.span>

          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mt-6 text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
            {t.title1}
            <span className="mt-2 block bg-gradient-to-r from-cyan-100 via-sky-100 to-blue-200 bg-clip-text text-transparent">{t.title2}</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
            {t.desc}
          </motion.p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#services" className="liquid-btn inline-flex items-center rounded-xl px-6 py-3 text-sm font-semibold text-[#041223]">
              {t.ctaPrimary} <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <a href="#cases" className="liquid-chip inline-flex items-center rounded-xl px-6 py-3 text-sm font-semibold text-cyan-50">
              {t.ctaSecondary}
            </a>
          </div>

          <div className="mt-9 grid gap-3 sm:grid-cols-3">
            {t.stats.map((item) => (
              <div key={item.label} className="liquid-panel rounded-2xl p-4">
                <p className="text-xs text-slate-400">{item.label}</p>
                <p className="mt-1 text-lg font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="hero-brand-card liquid-panel rounded-[28px] p-4">
            <img src="/brand-poster.png" alt="柯兴科技品牌展示" loading="eager" fetchPriority="high" decoding="async" className="h-full w-full rounded-2xl object-cover" />
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-300">{t.sideDesc}</p>
        </div>
      </div>
    </section>
  );
}

function HtmlIn3DLab({ locale }: { locale: Locale }) {
  const t = copy[locale].lab3d;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    if (!canvas || !overlay) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 100);
    camera.position.set(0, 0.2, 4.6);

    const ambient = new THREE.AmbientLight(0xffffff, 0.92);
    const key = new THREE.DirectionalLight(0xa5f3fc, 1.2);
    key.position.set(2.6, 2.2, 3.2);
    const rim = new THREE.PointLight(0x60a5fa, 0.9, 12);
    rim.position.set(-2, -1, 2.5);
    scene.add(ambient, key, rim);

    const logoGroup = new THREE.Group();
    scene.add(logoGroup);

    const logoTexture = new THREE.TextureLoader().load('/favicon.png');
    logoTexture.colorSpace = THREE.SRGBColorSpace;

    const logoCoreMaterial = new THREE.MeshStandardMaterial({
      map: logoTexture,
      transparent: true,
      alphaTest: 0.1,
      emissive: new THREE.Color(0x67e8f9),
      emissiveIntensity: 0.18,
      metalness: 0.16,
      roughness: 0.3,
      side: THREE.DoubleSide,
    });

    const logoCore = new THREE.Mesh(new THREE.PlaneGeometry(1.55, 1.55), logoCoreMaterial);
    logoCore.position.set(0, 0, 0.25);
    logoGroup.add(logoCore);

    const logoBack = new THREE.Mesh(
      new THREE.PlaneGeometry(1.95, 1.95),
      new THREE.MeshBasicMaterial({
        map: logoTexture,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    logoBack.position.set(0, 0, -0.12);
    logoGroup.add(logoBack);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.55, 0.05, 24, 180),
      new THREE.MeshStandardMaterial({ color: 0x7dd3fc, emissive: 0x1d4ed8, metalness: 0.35, roughness: 0.25 }),
    );
    ring.rotation.x = Math.PI * 0.5;
    logoGroup.add(ring);

    const satellites: THREE.Sprite[] = [];
    const satelliteMaterial = new THREE.SpriteMaterial({ map: logoTexture, color: 0xe0f2fe, transparent: true, opacity: 0.85 });
    for (let i = 0; i < 16; i += 1) {
      const sprite = new THREE.Sprite(satelliteMaterial.clone());
      const radius = 1.9 + (i % 4) * 0.25;
      const angle = (i / 16) * Math.PI * 2;
      sprite.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.62, (i % 3) * 0.2 - 0.3);
      const s = 0.2 + (i % 5) * 0.03;
      sprite.scale.set(s, s, 1);
      satellites.push(sprite);
      scene.add(sprite);
    }

    const anchors = [
      { pos: new THREE.Vector3(-1.95, 1.2, 0.35), el: null as HTMLElement | null },
      { pos: new THREE.Vector3(1.95, 1.0, 0.3), el: null as HTMLElement | null },
      { pos: new THREE.Vector3(-1.65, -1.35, 0.45), el: null as HTMLElement | null },
      { pos: new THREE.Vector3(1.7, -1.2, -0.05), el: null as HTMLElement | null },
    ];

    anchors.forEach((item, index) => {
      item.el = overlay.querySelector(`[data-anchor="${index}"]`) as HTMLElement | null;
    });

    const pointer = new THREE.Vector2(0, 0);
    const handlePointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const resize = () => {
      const { clientWidth, clientHeight } = canvas;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / Math.max(clientHeight, 1);
      camera.updateProjectionMatrix();
    };
    resize();

    let raf = 0;
    const clock = new THREE.Clock();
    const run = () => {
      const elapsed = clock.getElapsedTime();

      logoGroup.rotation.y = elapsed * 0.42;
      logoGroup.rotation.x = Math.sin(elapsed * 0.6) * 0.15;
      logoGroup.position.y = Math.sin(elapsed * 0.95) * 0.12;
      ring.rotation.z = elapsed * 0.56;
      logoBack.rotation.z = -elapsed * 0.2;

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.36, 0.06);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.2 + pointer.y * 0.2, 0.06);
      camera.lookAt(0, 0, 0);

      satellites.forEach((item, index) => {
        const speed = 0.14 + (index % 5) * 0.028;
        const radius = 1.85 + (index % 4) * 0.24;
        const angle = elapsed * speed + (index / satellites.length) * Math.PI * 2;
        item.position.x = Math.cos(angle) * radius;
        item.position.y = Math.sin(angle) * (radius * 0.62);
        item.position.z = Math.sin(elapsed * 0.8 + index) * 0.35;
      });

      anchors.forEach((item) => {
        if (!item.el) return;
        const projected = item.pos.clone().project(camera);
        const x = (projected.x * 0.5 + 0.5) * canvas.clientWidth;
        const y = (-projected.y * 0.5 + 0.5) * canvas.clientHeight;
        const depth = Math.max(0, Math.min(1, 1 - projected.z * 0.4));
        item.el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${0.84 + depth * 0.24})`;
        item.el.style.opacity = projected.z > 1.05 ? '0' : '1';
      });

      renderer.render(scene, camera);
      raf = window.requestAnimationFrame(run);
    };

    raf = window.requestAnimationFrame(run);
    window.addEventListener('resize', resize);
    canvas.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointermove', handlePointerMove);
      logoCore.geometry.dispose();
      logoBack.geometry.dispose();
      ring.geometry.dispose();
      logoCoreMaterial.dispose();
      (logoBack.material as THREE.Material).dispose();
      (ring.material as THREE.Material).dispose();
      satellites.forEach((item) => item.material.dispose());
      renderer.dispose();
    };
  }, [locale]);

  return (
    <section id="lab3d" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">{t.title}</h2>
            <p className="mt-3 max-w-3xl text-slate-300">{t.desc}</p>
          </div>
          <span className="liquid-chip hidden rounded-full px-3 py-1 text-xs text-cyan-100 md:inline-block">{t.badge}</span>
        </div>

        <div className="liquid-panel rounded-3xl p-3 md:p-4">
          <div className="relative h-[470px] overflow-hidden rounded-2xl border border-cyan-200/20 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.28),rgba(4,10,28,0.96)_58%)]">
            <canvas ref={canvasRef} className="h-full w-full" aria-label="logo 3d interactive canvas" />
            <div ref={overlayRef} className="pointer-events-none absolute inset-0">
              {t.cards.map((card, index) => (
                <article key={card.title} data-anchor={index} className="liquid-panel pointer-events-auto absolute left-0 top-0 w-52 -translate-x-1/2 -translate-y-1/2 rounded-2xl p-3 shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
                  <h3 className="text-sm font-semibold text-cyan-300">{card.title}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-300">{card.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services({ locale }: { locale: Locale }) {
  const t = copy[locale].services;
  const icons = [Cable, Hotel, Globe, Bot, Cloud, ShieldCheck];

  return (
    <section id="services" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">{t.title}</h2>
            <p className="mt-4 max-w-3xl text-slate-300">{t.desc}</p>
          </div>
          <a href="#contact" className="inline-flex items-center text-sm text-cyan-200 hover:text-cyan-100">
            {t.cta} <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {t.items.map((item, index) => {
            const Icon = icons[index];
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                viewport={{ once: true, amount: 0.2 }}
                className="liquid-panel group rounded-3xl p-6 transition hover:-translate-y-1"
              >
                <div className="liquid-chip inline-flex rounded-2xl p-3 text-cyan-300"><Icon className="h-6 w-6" /></div>
                <h3 className="mt-4 text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.desc}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Cases({ locale }: { locale: Locale }) {
  const t = copy[locale].cases;
  const icons = [MonitorSmartphone, Network, Building2];

  return (
    <section id="cases" className="relative overflow-hidden border-y border-white/8 bg-black/15 py-20">
      <img src="/case-mesh.svg" alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">{t.title}</h2>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {t.items.map((item, index) => {
            const Icon = icons[index];
            return (
              <div key={item.title} className="liquid-panel rounded-3xl p-6">
                <div className="liquid-chip inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-cyan-100">
                  <Icon className="h-5 w-5" /> {locale === 'zh' ? '交付案例' : 'Case Delivery'}
                </div>
                <h3 className="mt-4 text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{item.intro}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProcessSection({ locale }: { locale: Locale }) {
  const t = copy[locale].process;

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">{t.title}</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {t.steps.map((step, index) => (
            <motion.article
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              viewport={{ once: true, amount: 0.2 }}
              className="liquid-panel rounded-2xl p-5"
            >
              <span className="liquid-chip inline-flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-xs font-bold text-cyan-100">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-300">{step.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection({ locale }: { locale: Locale }) {
  const t = copy[locale].faq;

  return (
    <section className="pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">{t.title}</h2>
        <div className="mt-8 space-y-4">
          {t.items.map((item) => (
            <details key={item.q} className="liquid-panel group rounded-2xl p-5" open>
              <summary className="cursor-pointer list-none text-base font-semibold text-slate-100">{item.q}</summary>
              <p className="mt-3 text-sm leading-7 text-slate-300">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Profile({ locale }: { locale: Locale }) {
  const t = copy[locale].profile;
  return (
    <section id="profile" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">{t.title}</h2>
        <div className="liquid-panel mt-8 grid gap-6 rounded-3xl p-6 md:grid-cols-2 md:p-8">
          <div className="space-y-3 text-sm leading-7 text-slate-300">
            {t.fieldsLeft.map((field) => (
              <p key={field.label}><span className="text-slate-400">{field.label}：</span>{field.value}</p>
            ))}
          </div>
          <div className="space-y-3 text-sm leading-7 text-slate-300">
            {t.fieldsRight.map((field) => (
              <p key={field.label}><span className="text-slate-400">{field.label}：</span>{field.value}</p>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {t.tags.map((tag) => (
            <span key={tag} className="liquid-chip rounded-full px-3 py-1 text-xs text-slate-100">{tag}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact({ locale }: { locale: Locale }) {
  const t = copy[locale].contact;
  return (
    <section id="contact" className="pb-20 pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="liquid-panel grid gap-6 rounded-3xl p-8 md:grid-cols-2 md:items-center md:p-10">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white">{t.title}</h2>
            <p className="mt-3 text-slate-200">{t.desc}</p>
          </div>
          <div className="space-y-3 text-sm text-slate-100 md:pl-8">
            <a href="https://kexing.allapple.top" className="flex items-center gap-2 hover:text-cyan-100">
              <Globe className="h-4 w-4" /> {t.domainLabel}: kexing.allapple.top
            </a>
            <p className="flex items-center gap-2"><Cpu className="h-4 w-4" /> {t.business}</p>
            <a href="#home" className="liquid-btn inline-flex items-center rounded-xl px-4 py-2 font-semibold text-[#041223]">
              {t.backTop} <ChevronRight className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ locale }: { locale: Locale }) {
  const t = copy[locale].footer;
  return (
    <footer className="border-t border-white/10 py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="柯兴科技" className="h-8 w-auto" />
          <span>© {new Date().getFullYear()} {t.company}</span>
        </div>
        <span>{t.code}</span>
      </div>
    </footer>
  );
}

export default function App() {
  const [locale, setLocale] = useState<Locale>('zh');

  useEffect(() => {
    const stored = window.localStorage.getItem('kexing-locale');
    if (stored === 'zh' || stored === 'en') {
      setLocale(stored);
      return;
    }
    const preferred = navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en';
    setLocale(preferred);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
    window.localStorage.setItem('kexing-locale', locale);
  }, [locale]);

  const t = copy[locale];

  return (
    <div className="min-h-screen text-white">
      <a href="#main-content" className="sr-only z-[60] rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        {t.footer.skip}
      </a>
      <Navbar locale={locale} onToggle={() => setLocale((v) => (v === 'zh' ? 'en' : 'zh'))} />
      <main id="main-content">
        <Hero locale={locale} />
        <HtmlIn3DLab locale={locale} />
        <Services locale={locale} />
        <Cases locale={locale} />
        <ProcessSection locale={locale} />
        <Profile locale={locale} />
        <FaqSection locale={locale} />
        <Contact locale={locale} />
      </main>
      <Footer locale={locale} />
    </div>
  );
}
