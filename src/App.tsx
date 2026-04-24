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
  Menu,
  MonitorSmartphone,
  Network,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';

type NavLink = { name: string; href: string };

const navLinks: NavLink[] = [
  { name: '首页', href: '#home' },
  { name: '3D实验', href: '#lab3d' },
  { name: '关于我们', href: '#about' },
  { name: '服务能力', href: '#services' },
  { name: '案例场景', href: '#cases' },
  { name: '经营信息', href: '#profile' },
  { name: '联系我们', href: '#contact' },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeHash, setActiveHash] = useState('#home');

  useEffect(() => {
    const sections = navLinks
      .map((item) => document.querySelector(item.href) as HTMLElement | null)
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHash(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0.1 },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-emerald-300/15 bg-[#03150f]/86 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#home" className="flex items-center gap-3" aria-label="柯兴科技首页">
          <img src="/logo.png" alt="柯兴科技" className="h-10 w-auto md:h-11" />
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="主导航">
          {navLinks.map((link) => {
            const active = activeHash === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-full px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 ${
                  active
                    ? 'bg-emerald-400/20 text-emerald-100 shadow-[0_0_0_1px_rgba(110,231,183,0.25)]'
                    : 'text-slate-200/90 hover:bg-emerald-500/12 hover:text-emerald-50'
                }`}
              >
                {link.name}
              </a>
            );
          })}
          <a
            href="#contact"
            className="ml-2 inline-flex items-center rounded-full bg-gradient-to-r from-emerald-400 to-green-300 px-4 py-2 text-sm font-semibold text-[#042116] transition hover:brightness-105"
          >
            商务咨询
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-slate-100 hover:bg-emerald-300/10 md:hidden"
          aria-label="切换菜单"
          aria-expanded={open}
          aria-controls="mobile-nav"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-emerald-200/15 bg-[#03150f]/95 md:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-slate-100 hover:bg-emerald-300/10"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-32 md:pt-40">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-400/20 blur-[90px]" />
        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-emerald-200/10 blur-[110px]" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-12 lg:px-8 lg:pb-28">
        <div className="lg:col-span-7">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-200/10 px-4 py-1 text-xs font-semibold tracking-widest text-emerald-100"
          >
            <Sparkles className="h-3.5 w-3.5" /> 数智化系统解决方案
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-4xl font-black leading-tight tracking-tight text-white md:text-6xl"
          >
            柯兴科技
            <span className="mt-2 block bg-gradient-to-r from-emerald-200 via-green-200 to-emerald-400 bg-clip-text text-transparent">
              一站式智慧工程与软件服务
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg"
          >
            面向企业与园区场景，提供弱电系统集成、智慧酒店客控、品牌官网开发、AI 应用开发与长期运维，帮助客户快速完成数字化升级。
          </motion.p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#services"
              className="inline-flex items-center rounded-xl bg-gradient-to-r from-emerald-300 to-green-300 px-6 py-3 text-sm font-semibold text-[#032116] transition hover:brightness-105"
            >
              查看服务能力 <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <a
              href="#cases"
              className="inline-flex items-center rounded-xl border border-emerald-200/30 px-6 py-3 text-sm font-semibold text-emerald-50 transition hover:bg-emerald-300/10"
            >
              查看案例场景
            </a>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-3xl border border-emerald-200/20 bg-white/5 p-4 backdrop-blur-xl">
            <img
              src="/brand-poster.png"
              alt="柯兴科技品牌展示"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="h-full w-full rounded-2xl object-cover"
            />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {[
              { label: '成立时间', value: '2021' },
              { label: '注册资本', value: '500万' },
              { label: '服务方向', value: '弱电+软件+AI' },
              { label: '服务状态', value: '持续运营' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-emerald-200/15 bg-[#072019]/75 p-4">
                <p className="text-xs text-slate-400">{item.label}</p>
                <p className="mt-1 text-lg font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HtmlIn3DLab() {
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

    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    const key = new THREE.DirectionalLight(0x9dfce2, 1.15);
    key.position.set(2.6, 2.2, 3.2);
    const rim = new THREE.PointLight(0x22d3ee, 0.8, 12);
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
      emissive: new THREE.Color(0x35f5bf),
      emissiveIntensity: 0.22,
      metalness: 0.12,
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
        opacity: 0.24,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    logoBack.position.set(0, 0, -0.12);
    logoGroup.add(logoBack);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.55, 0.05, 24, 180),
      new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x0c7a58, metalness: 0.35, roughness: 0.25 }),
    );
    ring.rotation.x = Math.PI * 0.5;
    logoGroup.add(ring);

    const satellites: THREE.Sprite[] = [];
    const satelliteMaterial = new THREE.SpriteMaterial({ map: logoTexture, color: 0xd1fae5, transparent: true, opacity: 0.85 });
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
      const t = clock.getElapsedTime();

      logoGroup.rotation.y = t * 0.42;
      logoGroup.rotation.x = Math.sin(t * 0.6) * 0.15;
      logoGroup.position.y = Math.sin(t * 0.95) * 0.12;
      ring.rotation.z = t * 0.56;
      logoBack.rotation.z = -t * 0.2;

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.36, 0.06);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 0.2 + pointer.y * 0.2, 0.06);
      camera.lookAt(0, 0, 0);

      satellites.forEach((item, index) => {
        const speed = 0.14 + (index % 5) * 0.028;
        const radius = 1.85 + (index % 4) * 0.24;
        const a = t * speed + (index / satellites.length) * Math.PI * 2;
        item.position.x = Math.cos(a) * radius;
        item.position.y = Math.sin(a) * (radius * 0.62);
        item.position.z = Math.sin(t * 0.8 + index) * 0.35;
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
      satellites.forEach((item) => {
        item.material.dispose();
      });
      renderer.dispose();
    };
  }, []);

  const labCards = [
    { title: 'Logo 驱动 3D 主体', desc: '以品牌纯图标为主视觉，构建旋转核心体与多层发光背板。' },
    { title: '品牌粒子环绕', desc: '使用 Logo 精灵作为轨道粒子，形成具辨识度的品牌宇宙动效。' },
    { title: 'DOM 与 3D 同步', desc: '信息卡保持原生 HTML 可读性，同时跟随 3D 空间锚点运动。' },
    { title: '可继续扩展', desc: '可增加点击飞行、Logo 变形、WebGPU 材质与发布会级互动。' },
  ];

  return (
    <section id="lab3d" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">3D 实验玩法（Logo 主题）</h2>
            <p className="mt-3 max-w-3xl text-slate-300">
              采用你的品牌 Logo 作为 3D 设计核心：中轴主 Logo + 环绕粒子 + HTML 信息层，让“品牌识别”直接成为互动体验本身。
            </p>
          </div>
          <span className="hidden rounded-full border border-emerald-300/40 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-100 md:inline-block">
            Brand Motion Lab
          </span>
        </div>

        <div className="rounded-3xl border border-emerald-200/15 bg-[#041712]/75 p-3 md:p-4">
          <div className="relative h-[460px] overflow-hidden rounded-2xl border border-emerald-200/20 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.26),rgba(2,17,14,0.96)_58%)]">
            <canvas ref={canvasRef} className="h-full w-full" aria-label="Logo主题3D交互演示画布" />
            <div ref={overlayRef} className="pointer-events-none absolute inset-0">
              {labCards.map((card, index) => (
                <article
                  key={card.title}
                  data-anchor={index}
                  className="pointer-events-auto absolute left-0 top-0 w-48 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-emerald-200/20 bg-[#04120f]/84 p-3 shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur"
                >
                  <h3 className="text-sm font-semibold text-emerald-300">{card.title}</h3>
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

function About() {
  return (
    <section id="about" className="border-y border-emerald-100/10 bg-emerald-950/[0.14] py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-7">
          <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">聚焦智慧工程与软件服务的一体化交付团队</h2>
          <p className="mt-5 leading-8 text-slate-300">
            柯兴科技（深圳）有限公司成立于 2021 年，围绕企业数字化建设提供“咨询规划、方案设计、工程实施、系统开发、持续运维”全流程服务，兼顾落地效率与长期稳定性。
          </p>
          <p className="mt-4 leading-8 text-slate-300">
            我们坚持以业务目标为导向，通过弱电智能化、客控系统、品牌官网与 AI 能力融合，帮助客户提升运营效率、降低维护成本并强化品牌展示能力。
          </p>
        </div>

        <div className="lg:col-span-5">
          <img
            src="/brand-alt.png"
            alt="柯兴科技品牌视觉"
            loading="lazy"
            decoding="async"
            className="h-full w-full rounded-3xl border border-emerald-200/20 object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function Services() {
  const services = useMemo(
    () => [
      {
        icon: <Cable className="h-6 w-6" />,
        title: '弱电与智能化工程',
        desc: '覆盖综合布线、安防监控、门禁对讲、机房与网络系统集成，支持设计、施工、调试、验收全流程。',
      },
      {
        icon: <Hotel className="h-6 w-6" />,
        title: '智慧酒店客控系统',
        desc: '围绕客房灯光、空调、窗帘、情景面板与后台管理联动，提升宾客体验与酒店运营效率。',
      },
      {
        icon: <Globe className="h-6 w-6" />,
        title: '企业官网与系统开发',
        desc: '基于主流前端技术栈打造品牌官网、业务系统与数据看板，兼顾视觉表现与业务可用性。',
      },
      {
        icon: <Bot className="h-6 w-6" />,
        title: 'AI 应用落地服务',
        desc: '提供 AI 能力接入、业务流程自动化和智能助手定制，帮助企业构建可持续的智能化能力。',
      },
      {
        icon: <Cloud className="h-6 w-6" />,
        title: '云与数据服务',
        desc: '提供数据处理、云计算技术服务与系统运维支持，保障业务连续性与系统稳定运行。',
      },
      {
        icon: <ShieldCheck className="h-6 w-6" />,
        title: '信息安全与合规建设',
        desc: '支持网络安全软件部署、信息安全设备集成与安全能力提升，强化企业数字资产防护。',
      },
    ],
    [],
  );

  return (
    <section id="services" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">服务能力</h2>
        <p className="mt-4 max-w-3xl text-slate-300">以工程实施能力为底座，以软件研发能力为引擎，形成可复制、可持续、可运营的交付体系。</p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((item) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group rounded-3xl border border-emerald-100/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-emerald-300/40 hover:bg-emerald-300/[0.06]"
            >
              <div className="inline-flex rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-emerald-300">{item.icon}</div>
              <h3 className="mt-4 text-xl font-bold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{item.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cases() {
  const data = [
    {
      title: '智慧酒店客控升级',
      intro: '完成客房灯光/温控/场景联动与后台管理系统整合，缩短运维响应时间。',
      icon: <MonitorSmartphone className="h-5 w-5" />,
    },
    {
      title: '园区网络与安防系统集成',
      intro: '实现监控、门禁、网络与机房系统统一建设，提升管理效率与稳定性。',
      icon: <Network className="h-5 w-5" />,
    },
    {
      title: '品牌官网与业务展示平台',
      intro: '通过全新视觉体系与信息架构优化，提升品牌识别与咨询转化效率。',
      icon: <Building2 className="h-5 w-5" />,
    },
  ];

  return (
    <section id="cases" className="border-y border-emerald-100/8 bg-emerald-950/[0.16] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">案例场景</h2>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {data.map((item) => (
            <div key={item.title} className="rounded-3xl border border-emerald-200/15 bg-[#07211b]/80 p-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/35 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-100">
                {item.icon} 项目场景
              </div>
              <h3 className="mt-4 text-xl font-bold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{item.intro}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Profile() {
  const tags = [
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
  ];

  return (
    <section id="profile" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">企业经营信息</h2>
        <div className="mt-8 grid gap-6 rounded-3xl border border-emerald-200/15 bg-emerald-950/[0.18] p-6 md:grid-cols-2 md:p-8">
          <div className="space-y-3 text-sm leading-7 text-slate-300">
            <p><span className="text-slate-400">企业名称：</span>柯兴科技（深圳）有限公司</p>
            <p><span className="text-slate-400">统一社会信用代码：</span>91440300MA5H0HLK5U</p>
            <p><span className="text-slate-400">成立日期：</span>2021-09-22</p>
            <p><span className="text-slate-400">法定代表人：</span>葛亚鹏</p>
            <p><span className="text-slate-400">注册资本：</span>500万元</p>
          </div>
          <div className="space-y-3 text-sm leading-7 text-slate-300">
            <p><span className="text-slate-400">企业状态：</span>存续</p>
            <p><span className="text-slate-400">所属行业：</span>信息传输、软件和信息技术服务业</p>
            <p>
              <span className="text-slate-400">注册地址：</span>
              深圳市罗湖区笋岗街道田心社区宝安北路3008号宝能中心E栋18层05
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full border border-emerald-200/20 bg-[#072018] px-3 py-1 text-xs text-slate-200">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="pb-20 pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-3xl border border-emerald-300/35 bg-gradient-to-r from-emerald-500/14 to-green-300/10 p-8 md:grid-cols-2 md:items-center md:p-10">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white">欢迎咨询合作</h2>
            <p className="mt-3 text-slate-200">
              如果你正在规划弱电智能化、酒店客控、品牌官网或 AI 应用项目，欢迎与我们联系，我们将在 24 小时内响应。
            </p>
          </div>
          <div className="space-y-3 text-sm text-slate-100 md:pl-8">
            <a href="https://kexing.allapple.top" className="flex items-center gap-2">
              <Globe className="h-4 w-4" /> kexing.allapple.top
            </a>
            <p className="flex items-center gap-2"><Cpu className="h-4 w-4" /> 业务方向：弱电工程 / 软件开发 / AI 应用</p>
            <a href="#home" className="inline-flex items-center rounded-xl bg-white px-4 py-2 font-semibold text-slate-900">
              返回顶部 <ChevronRight className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-emerald-200/15 py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="柯兴科技" className="h-8 w-auto" />
          <span>© {new Date().getFullYear()} 柯兴科技（深圳）有限公司</span>
        </div>
        <span>统一社会信用代码：91440300MA5H0HLK5U</span>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen text-white">
      <a
        href="#main-content"
        className="sr-only z-[60] rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-slate-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        跳转到主要内容
      </a>
      <Navbar />
      <main id="main-content">
        <Hero />
        <HtmlIn3DLab />
        <About />
        <Services />
        <Cases />
        <Profile />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
