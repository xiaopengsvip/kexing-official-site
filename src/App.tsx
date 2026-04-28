import { useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import * as THREE from 'three';

type LiveData = {
  backendOk: boolean;
  backendStatus: string;
  apiRttMs: number;
  apiDocEndpoints: number;
  online: boolean;
  downlinkMbps: number;
  fps: number;
  updatedAt: string;
};

type NavigatorWithConnection = Navigator & {
  connection?: {
    downlink?: number;
  };
};

type RegionRow = {
  region: string;
  code: string;
  traffic: string;
  latencyMs: number;
  availability: string;
  load: number;
  risk: 'low' | 'medium' | 'high';
  owner: string;
};

type EventRow = {
  id: string;
  time: string;
  level: 'INFO' | 'WARN' | 'CRIT';
  source: string;
  message: string;
  endpoint: string;
};

type KpiCard = {
  label: string;
  sub: string;
  value: string;
  trend: string;
  accent: 'blue' | 'cyan' | 'violet' | 'amber';
  spark: number[];
};

type HealthItem = {
  name: string;
  value: string;
  score: number;
  state: 'stable' | 'watch' | 'risk';
};

type Lang = 'zh' | 'en';

const copy = {
  zh: {
    htmlLang: 'zh-CN', locale: 'zh-CN', brand: '柯兴全球运维中心 / 实时指挥', title: '世界运营中心数据大屏',
    subtitle: '自适应全屏版：支持一键全屏、中英文切换，桌面大屏首屏完整呈现，移动设备自动重排。',
    api: '接口', latency: '时延', fps: '帧率', full: '全屏显示', exitFull: '退出全屏', language: 'English',
    loadingTitle: '柯兴世界运营中心', loadingSub: '正在接入全球链路、接口探针与实时指挥视图', loadingStepA: '身份徽标校验', loadingStepB: '真实地球模型预热', loadingStepC: '运维探针同步', loadingStepD: '指挥大屏就绪',
    command: '运营指挥摘要', ops: '综合运行态势', opsSub: '综合运行态势评分', posture: '双活路由 · 灰度保护 · WAF 已校验 · 自愈策略已启用', shift: '当前值班组', shiftWindow: '接管窗口 08:00-20:00',
    regionTitle: '区域服务矩阵', regionSub: '分区业务承载 / SLA / 风险', region: '区域', traffic: '流量', rtt: '时延', risk: '风险',
    capacity: '容量分配', capacitySub: '计算 / 网络 / 存储', compute: '计算资源', network: '网络资源', storage: '存储资源',
    topology: '全球实时业务链路拓扑', topologySub: '真实地球模型 · 三层轨道环 · 航线飞线 · 可切换运维焦点', lastSync: '最近同步',
    feed: '运维事件流', feedSub: '真实探针数据 / 10 秒刷新', healthProbe: '真实接口健康探针', docsProbe: '真实接口目录镜像', clientProbe: '浏览器在线遥测',
    waitingProbe: '等待真实探针', waitingMessage: '正在等待首轮真实接口健康探针、接口目录镜像和浏览器在线遥测返回。',
    healthStackApi: '接口健康', docsIndex: '目录索引', networkOnline: '网络在线', clientDownlink: '客户端下行', stable: '稳定', degraded: '降级', online: '在线', offline: '离线',
    queue: '响应队列', queueSub: '事件分级与处理进度', confirmed: '已确认', processing: '处理中', review: '待复核', normal: '正常',
    services: '服务模块状态', footerSource: '数据源：v.api.allapple.top 健康探针 + 接口文档镜像 + 浏览器遥测', entry: '线上入口：https://dps.allapple.top',
    methods: '个方法', endpoints: '个端点', activeTasks: '项活跃任务', indexed: '个接口已索引', securityZero: '关键风险 0 项', degradedMode: '降级防护模式',
    kpiSessions: '全网活跃会话', kpiSessionsSub: '实时在线与会话保持', kpiThroughput: '全球业务吞吐', kpiThroughputSub: '入口带宽与跨区转发', kpiNodes: '在线边缘节点', kpiNodesSub: '全球节点与文档索引', kpiSecurity: '安全放行成功率', kpiSecuritySub: 'WAF / TLS / Bot 综合命中',
    primary: '主用链路', failover: '容灾链路', security: '安全包络', primaryPath: '北京 → 新加坡 → 法兰克福', primaryMeta: '平均 38.2ms · 低延迟优先', failoverPath: '弗吉尼亚 → 圣保罗 → 悉尼', failoverMeta: '热备待命 · 自动切换', securityPath: 'WAF / Bot / TLS 防护态势', securityMeta: '风险收敛中',
    info: '通知', warn: '关注', crit: '关键', probeOk: '返回状态', probeRtt: '端到端 RTT', probeFrom: '数据来自 v.api.allapple.top 实时健康检查。', docsMessageA: '接口文档镜像本次解析到', docsMessageB: '个方法标记，用于校验 API 目录可用性。', clientMessageA: '客户端在线状态', clientMessageB: '浏览器估算下行',
  },
  en: {
    htmlLang: 'en', locale: 'en-US', brand: 'Kexing Global Operations Center / Live Command', title: 'WORLD OPERATIONS CENTER',
    subtitle: 'Adaptive fullscreen edition: one-click fullscreen, Chinese/English switching, single-screen desktop canvas, and automatic mobile reflow.',
    api: 'API', latency: 'RTT', fps: 'FPS', full: 'Enter Fullscreen', exitFull: 'Exit Fullscreen', language: '中文',
    loadingTitle: 'Kexing World Operations', loadingSub: 'Connecting global routes, real probes, and the live command canvas', loadingStepA: 'Brand identity check', loadingStepB: 'Real Earth model warm-up', loadingStepC: 'Ops probe synchronization', loadingStepD: 'Command canvas ready',
    command: 'Operations Command Summary', ops: 'Operational Readiness', opsSub: 'Composite readiness score', posture: 'Active-active routing · Canary guard · WAF verified · Self-healing enabled', shift: 'Current Shift', shiftWindow: 'Handover window 08:00-20:00',
    regionTitle: 'Regional Service Matrix', regionSub: 'Regional load / SLA / risk', region: 'Region', traffic: 'Traffic', rtt: 'RTT', risk: 'Risk',
    capacity: 'Capacity Allocation', capacitySub: 'Compute / Network / Storage', compute: 'Compute', network: 'Network', storage: 'Storage',
    topology: 'Global Live Traffic Topology', topologySub: 'Real Earth model · Three orbital layers · Flight links · Switchable ops focus', lastSync: 'Last sync',
    feed: 'Ops Event Feed', feedSub: 'Real probe data / 10s refresh', healthProbe: 'Real API Health Probe', docsProbe: 'Real API Catalog Mirror', clientProbe: 'Browser Connectivity Telemetry',
    waitingProbe: 'Waiting for real probe', waitingMessage: 'Waiting for the first API health probe, API catalog mirror, and browser telemetry response.',
    healthStackApi: 'API Health', docsIndex: 'Catalog Index', networkOnline: 'Network Online', clientDownlink: 'Client Downlink', stable: 'Stable', degraded: 'Degraded', online: 'Online', offline: 'Offline',
    queue: 'Response Queue', queueSub: 'Severity and handling progress', confirmed: 'Confirmed', processing: 'Processing', review: 'Review', normal: 'Normal',
    services: 'Service Modules', footerSource: 'Sources: v.api.allapple.top health probe + API docs mirror + browser telemetry', entry: 'Entry: https://dps.allapple.top',
    methods: ' methods', endpoints: ' endpoints', activeTasks: ' active tasks', indexed: ' indexed APIs', securityZero: '0 critical risks', degradedMode: 'Degraded protection mode',
    kpiSessions: 'Active Sessions', kpiSessionsSub: 'Live users and session affinity', kpiThroughput: 'Global Throughput', kpiThroughputSub: 'Ingress bandwidth and cross-region forwarding', kpiNodes: 'Edge Nodes Online', kpiNodesSub: 'Global nodes and catalog index', kpiSecurity: 'Security Pass Rate', kpiSecuritySub: 'WAF / TLS / Bot composite hits',
    primary: 'Primary Route', failover: 'Failover Route', security: 'Security Envelope', primaryPath: 'Beijing → Singapore → Frankfurt', primaryMeta: 'Avg 38.2ms · low latency first', failoverPath: 'Virginia → São Paulo → Sydney', failoverMeta: 'Hot standby · auto switchover', securityPath: 'WAF / Bot / TLS protection posture', securityMeta: 'risk converging',
    info: 'INFO', warn: 'WATCH', crit: 'CRIT', probeOk: 'Returned', probeRtt: 'end-to-end RTT', probeFrom: 'from v.api.allapple.top real-time health check.', docsMessageA: 'API catalog mirror parsed', docsMessageB: ' method markers for API availability validation.', clientMessageA: 'Client connectivity is', clientMessageB: 'browser estimated downlink',
  },
} as const;

const regionNames = { zh: ['东亚', '欧洲', '北美', '南美', '非洲', '大洋洲'], en: ['East Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania'] } as const;
const riskNames = { zh: { low: '低', medium: '中', high: '高' }, en: { low: 'Low', medium: 'Medium', high: 'High' } } as const;
const nodeLabels = {
  zh: [
    { className: 'node-dot beijing', label: '北京', type: '核心' }, { className: 'node-dot singapore', label: '新加坡', type: '边缘' }, { className: 'node-dot frankfurt', label: '法兰克福', type: '中继' }, { className: 'node-dot virginia', label: '弗吉尼亚', type: '云区' }, { className: 'node-dot sao-paulo', label: '圣保罗', type: '边缘' }, { className: 'node-dot sydney', label: '悉尼', type: '边缘' },
  ],
  en: [
    { className: 'node-dot beijing', label: 'Beijing', type: 'Core' }, { className: 'node-dot singapore', label: 'Singapore', type: 'Edge' }, { className: 'node-dot frankfurt', label: 'Frankfurt', type: 'Relay' }, { className: 'node-dot virginia', label: 'Virginia', type: 'Cloud' }, { className: 'node-dot sao-paulo', label: 'São Paulo', type: 'Edge' }, { className: 'node-dot sydney', label: 'Sydney', type: 'Edge' },
  ],
} as const;

const fallbackLive: LiveData = {
  backendOk: false,
  backendStatus: '初始化中',
  apiRttMs: 0,
  apiDocEndpoints: 0,
  online: true,
  downlinkMbps: 0,
  fps: 60,
  updatedAt: '--',
};


const serviceLanes = [
  { zh: '客户会话网关', en: 'Customer Session Gateway', zhDesc: '统一接入 / 会话保持 / 灰度调度', enDesc: 'Unified ingress / session affinity / canary routing', owner: 'SRE-01', zhState: '运行中', enState: 'Running', sla: '99.996%', queue: 18 },
  { zh: '智能路由平面', en: 'AI Routing Fabric', zhDesc: '跨区选路 / 容灾切换 / 流量整形', enDesc: 'Cross-region routing / failover / shaping', owner: 'NET-02', zhState: '运行中', enState: 'Running', sla: '99.992%', queue: 7 },
  { zh: '安全控制平面', en: 'Security Control Plane', zhDesc: 'WAF 防护 / 证书巡检 / 风险闭环', enDesc: 'WAF defense / certificate patrol / risk closure', owner: 'SEC-04', zhState: '防护中', enState: 'Protected', sla: '99.989%', queue: 3 },
  { zh: '接口文档镜像', en: 'API Documentation Mirror', zhDesc: '索引同步 / 可用性探测 / 版本校验', enDesc: 'Index sync / availability probe / version check', owner: 'DEV-03', zhState: '已索引', enState: 'Indexed', sla: '99.981%', queue: 11 },
];

function formatNow(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

async function measureBackend(): Promise<{ ok: boolean; status: string; rtt: number; endpoints: number }> {
  const healthEndpoint = '/backend/health';
  const docsEndpoint = '/backend-docs/';

  const start = performance.now();
  let ok = false;
  let status = '探测中';
  let endpoints = 0;

  try {
    const healthRes = await fetch(healthEndpoint, {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
    const healthText = await healthRes.text();

    if (!healthRes.ok) {
      ok = false;
      status = `HTTP ${healthRes.status}`;
    } else {
      try {
        const parsed = JSON.parse(healthText) as { status?: string };
        ok = parsed.status === 'ok';
        status = parsed.status === 'ok' ? '正常' : parsed.status ? parsed.status : '未知';
      } catch {
        ok = false;
        status = '解析异常';
      }
    }

    const docsRes = await fetch(docsEndpoint, { cache: 'no-store' });
    const docsText = await docsRes.text();
    const methodHits = docsText.match(/\b(GET|POST|PUT|DELETE|PATCH|WS|ALL)\b/g);
    endpoints = methodHits ? methodHits.length : 0;
  } catch {
    ok = false;
    status = '不可达';
  }

  const rtt = Math.round(performance.now() - start);
  return { ok, status, rtt, endpoints };
}

function riskClass(risk: RegionRow['risk']) {
  return risk;
}

function levelLabel(level: EventRow['level'], lang: Lang) {
  if (level === 'CRIT') return copy[lang].crit;
  if (level === 'WARN') return copy[lang].warn;
  return copy[lang].info;
}

function statusLabel(status: string, lang: Lang) {
  if (lang === 'zh') return status;
  if (status === '正常') return 'OK';
  if (status === '不可达') return 'Unreachable';
  if (status === '解析异常') return 'Parse error';
  if (status === '初始化中') return 'Initializing';
  if (status === '探测中') return 'Probing';
  return status;
}

type RouteMode = 'primary' | 'failover' | 'security';

function RealEarthGlobe({ focusMode }: { focusMode: RouteMode }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return undefined;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 0.18, 5.7);

    const globeGroup = new THREE.Group();
    globeGroup.rotation.set(-0.18, -0.42, 0.05);
    scene.add(globeGroup);

    const textureLoader = new THREE.TextureLoader();
    const earthMap = textureLoader.load('/earth/earth_atmos_2048.jpg');
    const normalMap = textureLoader.load('/earth/earth_normal_2048.jpg');
    const specularMap = textureLoader.load('/earth/earth_specular_2048.jpg');
    const cloudMap = textureLoader.load('/earth/earth_clouds_1024.png');
    [earthMap, normalMap, specularMap, cloudMap].forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    });
    normalMap.colorSpace = THREE.NoColorSpace;
    specularMap.colorSpace = THREE.NoColorSpace;

    const earthGeometry = new THREE.SphereGeometry(1.64, 96, 96);
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthMap,
      normalMap,
      normalScale: new THREE.Vector2(0.18, 0.18),
      specularMap,
      specular: new THREE.Color('#5bb6ff'),
      shininess: 18,
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earth);

    const cloudGeometry = new THREE.SphereGeometry(1.675, 96, 96);
    const cloudMaterial = new THREE.MeshLambertMaterial({ map: cloudMap, transparent: true, opacity: 0.34, depthWrite: false });
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    globeGroup.add(clouds);

    const atmosphereGeometry = new THREE.SphereGeometry(1.72, 96, 96);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({ color: '#38bdf8', transparent: true, opacity: 0.13, side: THREE.BackSide, blending: THREE.AdditiveBlending });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphere);

    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(240 * 3);
    for (let i = 0; i < 240; i += 1) {
      const radius = 5.5 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: '#bae6fd', size: 0.015, transparent: true, opacity: 0.52 });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    const markerGroup = new THREE.Group();
    const markerMaterial = new THREE.MeshBasicMaterial({ color: '#67e8f9', transparent: true, opacity: 0.82 });
    const markerGeometry = new THREE.SphereGeometry(0.018, 16, 16);
    const markerPositions = [
      new THREE.Vector3(0.92, 0.56, 1.24),
      new THREE.Vector3(1.34, -0.18, 0.92),
      new THREE.Vector3(0.14, 0.74, 1.45),
      new THREE.Vector3(-1.05, 0.32, 1.15),
      new THREE.Vector3(-0.66, -0.88, 1.12),
      new THREE.Vector3(1.02, -0.94, 0.88),
    ];
    markerPositions.forEach((position) => {
      const marker = new THREE.Mesh(markerGeometry, markerMaterial.clone());
      marker.position.copy(position);
      markerGroup.add(marker);
    });
    globeGroup.add(markerGroup);

    scene.add(new THREE.AmbientLight('#6aa6c8', 0.9));
    const sunLight = new THREE.DirectionalLight('#ffffff', 2.4);
    sunLight.position.set(4.2, 2.1, 4.8);
    scene.add(sunLight);
    const rimLight = new THREE.DirectionalLight('#38bdf8', 1.2);
    rimLight.position.set(-3.8, 1.2, -2.4);
    scene.add(rimLight);

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const size = Math.max(280, Math.min(rect.width, rect.height || rect.width));
      renderer.setSize(size, size, false);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize);

    let rafId = 0;
    let pointerX = 0;
    let pointerY = 0;
    const onPointerMove = (event: PointerEvent) => {
      const rect = parent.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 0.16;
      pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 0.12;
    };
    const onPointerLeave = () => {
      pointerX = 0;
      pointerY = 0;
    };
    parent.addEventListener('pointermove', onPointerMove);
    parent.addEventListener('pointerleave', onPointerLeave);

    const clock = new THREE.Clock();
    const modeSpeed = focusMode === 'primary' ? 1 : focusMode === 'failover' ? 1.22 : 0.82;
    const modeTilt = focusMode === 'primary' ? -0.42 : focusMode === 'failover' ? -0.16 : -0.66;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      earth.rotation.y += 0.0019 * modeSpeed;
      clouds.rotation.y += 0.0028 * modeSpeed;
      clouds.rotation.x = Math.sin(elapsed * 0.7) * 0.018;
      globeGroup.rotation.y += (modeTilt + pointerX - globeGroup.rotation.y) * 0.026;
      globeGroup.rotation.x += (-0.18 - pointerY - globeGroup.rotation.x) * 0.022;
      markerGroup.children.forEach((child, index) => {
        const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        const pulse = 0.72 + Math.sin(elapsed * 2.4 + index * 0.8) * 0.28;
        child.scale.setScalar(1 + pulse * 1.6);
        material.opacity = 0.42 + pulse * 0.42;
      });
      stars.rotation.y += 0.00045;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      parent.removeEventListener('pointermove', onPointerMove);
      parent.removeEventListener('pointerleave', onPointerLeave);
      [earthMap, normalMap, specularMap, cloudMap].forEach((texture) => texture.dispose());
      earthGeometry.dispose();
      earthMaterial.dispose();
      cloudGeometry.dispose();
      cloudMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      markerGroup.children.forEach((child) => {
        const material = (child as THREE.Mesh).material as THREE.Material;
        material.dispose();
      });
      markerGeometry.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      renderer.dispose();
    };
  }, [focusMode]);

  return <canvas ref={canvasRef} className="real-earth-canvas" aria-label="真实地球三维模型，包含交互式运维链路标记" />;
}

function BrandIntro({ t, lang }: { t: (typeof copy)[Lang]; lang: Lang }) {
  const steps = [t.loadingStepA, t.loadingStepB, t.loadingStepC, t.loadingStepD];

  return (
    <div className="brand-intro" role="status" aria-live="polite" aria-label={t.loadingTitle}>
      <div className="intro-grid" aria-hidden="true" />
      <div className="intro-orbit orbit-one" aria-hidden="true" />
      <div className="intro-orbit orbit-two" aria-hidden="true" />
      <div className="intro-card">
        <div className="intro-avatar-wrap">
          <span className="intro-ring" />
          <img src="/logo.png" alt="柯兴科技徽标" className="intro-avatar" />
          <span className="intro-scan" />
        </div>
        <div className="intro-copy">
          <span>{lang === 'zh' ? '首次加载 / 安全接入' : 'Initial Load / Secure Access'}</span>
          <strong>{t.loadingTitle}</strong>
          <p>{t.loadingSub}</p>
        </div>
        <div className="intro-progress"><i /></div>
        <div className="intro-steps">
          {steps.map((step, index) => <em key={step} style={{ animationDelay: `${0.35 + index * 0.42}s` }}>{step}</em>)}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [now, setNow] = useState(() => new Date());
  const [live, setLive] = useState<LiveData>(fallbackLive);
  const [eventLog, setEventLog] = useState<EventRow[]>([]);
  const [routeMode, setRouteMode] = useState<RouteMode>('primary');
  const [lang, setLang] = useState<Lang>(() => (window.localStorage.getItem('ops-lang') === 'en' ? 'en' : 'zh'));
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const t = copy[lang];

  const updateCursorGlow = (event: ReactPointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--cursor-x', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--cursor-y', `${event.clientY - rect.top}px`);
  };

  const toggleLanguage = () => {
    setLang((current) => {
      const next = current === 'zh' ? 'en' : 'zh';
      window.localStorage.setItem('ops-lang', next);
      return next;
    });
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  useEffect(() => {
    document.documentElement.lang = t.htmlLang;
    document.title = lang === 'zh' ? `${t.title} | 柯兴科技` : 'World Operations Center | Kexing Technology';
  }, [lang, t.htmlLang, t.title]);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowIntro(false), 3600);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let frame = 0;
    let rafId = 0;
    let prev = performance.now();

    const updateFps = (t: number) => {
      frame += 1;
      const diff = t - prev;
      if (diff >= 1000) {
        const fps = Math.round((frame * 1000) / diff);
        setLive((curr) => ({ ...curr, fps }));
        frame = 0;
        prev = t;
      }
      rafId = requestAnimationFrame(updateFps);
    };

    rafId = requestAnimationFrame(updateFps);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    let disposed = false;

    const load = async () => {
      const data = await measureBackend();
      if (disposed) return;
      const connection = (navigator as NavigatorWithConnection).connection;
      const sampledAt = new Date();
      const sampledAtText = formatNow(sampledAt);
      const browserOnline = navigator.onLine;
      const downlinkMbps = Number((connection?.downlink || 0).toFixed(1));

      setLive((curr) => ({
        ...curr,
        backendOk: data.ok,
        backendStatus: data.status,
        apiRttMs: data.rtt,
        apiDocEndpoints: data.endpoints,
        online: browserOnline,
        downlinkMbps,
        updatedAt: sampledAtText,
      }));

      setEventLog((prev) => {
        const probeSeq = sampledAt.getTime();
        const probeEvents: EventRow[] = [
          {
            id: `${probeSeq}-health`,
            time: sampledAtText,
            level: data.ok ? 'INFO' : 'CRIT',
            source: copy[lang].healthProbe,
            endpoint: '/backend/health',
            message: lang === 'zh' ? `${copy.zh.probeOk} ${data.status}，${copy.zh.probeRtt} ${data.rtt}ms，${copy.zh.probeFrom}` : `${copy.en.probeOk} ${data.status}, ${copy.en.probeRtt} ${data.rtt}ms, ${copy.en.probeFrom}`,
          },
          {
            id: `${probeSeq}-docs`,
            time: sampledAtText,
            level: data.endpoints > 0 ? 'INFO' : 'WARN',
            source: copy[lang].docsProbe,
            endpoint: '/backend-docs/',
            message: lang === 'zh' ? `${copy.zh.docsMessageA} ${data.endpoints} ${copy.zh.docsMessageB}` : `${copy.en.docsMessageA} ${data.endpoints}${copy.en.docsMessageB}`,
          },
          {
            id: `${probeSeq}-client`,
            time: sampledAtText,
            level: browserOnline ? 'INFO' : 'CRIT',
            source: copy[lang].clientProbe,
            endpoint: 'navigator.onLine / NetworkInformation',
            message: lang === 'zh' ? `${copy.zh.clientMessageA} ${browserOnline ? copy.zh.online : copy.zh.offline}，${copy.zh.clientMessageB} ${downlinkMbps || 0} Mbps。` : `${copy.en.clientMessageA} ${browserOnline ? copy.en.online : copy.en.offline}; ${copy.en.clientMessageB} ${downlinkMbps || 0} Mbps.`,
          },
        ];

        return [...probeEvents, ...prev].slice(0, 7);
      });
    };

    void load();
    const timer = window.setInterval(() => void load(), 10000);
    return () => {
      disposed = true;
      window.clearInterval(timer);
    };
  }, [lang]);

  const rotationStyle = useMemo(
    () => ({ transform: `rotate(${(now.getSeconds() / 60) * 360}deg)` }),
    [now],
  );

  const rttSafe = live.apiRttMs || 88;
  const totalSessions = 1248000 + live.apiDocEndpoints * 126 + live.fps * 90;
  const edgeNodes = 2380 + Math.round((live.downlinkMbps || 0) * 8);
  const throughput = Math.max(8.1, (live.downlinkMbps || 0) * 1.9).toFixed(1);
  const securityScore = live.backendOk ? '99.96%' : '97.84%';
  const opsScore = live.backendOk ? 96 : 72;

  const kpis: KpiCard[] = [
    { label: t.kpiSessions, sub: t.kpiSessionsSub, value: totalSessions.toLocaleString(t.locale), trend: lang === 'zh' ? '15 分钟 +12.8%' : '15 min +12.8%', accent: 'blue', spark: [36, 42, 39, 51, 56, 62, 58, 68] },
    { label: t.kpiThroughput, sub: t.kpiThroughputSub, value: `${throughput} Gbps`, trend: lang === 'zh' ? 'P95 稳定' : 'P95 stable', accent: 'cyan', spark: [22, 31, 35, 44, 41, 49, 57, 61] },
    { label: t.kpiNodes, sub: t.kpiNodesSub, value: edgeNodes.toLocaleString(t.locale), trend: `${live.apiDocEndpoints || 46}${t.indexed}`, accent: 'violet', spark: [52, 51, 54, 58, 57, 60, 63, 65] },
    { label: t.kpiSecurity, sub: t.kpiSecuritySub, value: securityScore, trend: live.backendOk ? t.securityZero : t.degradedMode, accent: 'amber', spark: [64, 64, 63, 66, 65, 67, 66, 68] },
  ];

  const regions: RegionRow[] = [
    { region: regionNames[lang][0], code: 'EAS', traffic: lang === 'zh' ? '380万/min' : '3.8M/min', latencyMs: Math.max(16, rttSafe - 36), availability: '99.997%', load: 82, risk: 'low', owner: 'CN-NOC' },
    { region: regionNames[lang][1], code: 'EUR', traffic: lang === 'zh' ? '260万/min' : '2.6M/min', latencyMs: Math.max(22, rttSafe - 18), availability: '99.994%', load: 68, risk: rttSafe > 180 ? 'medium' : 'low', owner: 'EU-SRE' },
    { region: regionNames[lang][2], code: 'NAM', traffic: lang === 'zh' ? '310万/min' : '3.1M/min', latencyMs: Math.max(20, rttSafe - 24), availability: '99.996%', load: 74, risk: 'low', owner: 'US-NET' },
    { region: regionNames[lang][3], code: 'SAM', traffic: lang === 'zh' ? '120万/min' : '1.2M/min', latencyMs: Math.max(42, rttSafe + 8), availability: '99.982%', load: 57, risk: rttSafe > 210 ? 'high' : 'medium', owner: 'BR-OPS' },
    { region: regionNames[lang][4], code: 'AFR', traffic: lang === 'zh' ? '90万/min' : '0.9M/min', latencyMs: Math.max(48, rttSafe + 12), availability: '99.978%', load: 49, risk: 'medium', owner: 'ZA-EDGE' },
    { region: regionNames[lang][5], code: 'OCE', traffic: lang === 'zh' ? '80万/min' : '0.8M/min', latencyMs: Math.max(38, rttSafe + 4), availability: '99.988%', load: 53, risk: 'low', owner: 'AU-SRE' },
  ];

  const events: EventRow[] = eventLog.length > 0 ? eventLog : [
    {
      id: 'waiting-real-probe',
      time: formatNow(now),
      level: 'WARN',
      source: t.waitingProbe,
      endpoint: '/backend/health',
      message: t.waitingMessage,
    },
  ];

  const healthStack: HealthItem[] = [
    { name: t.healthStackApi, value: live.backendOk ? t.stable : t.degraded, score: live.backendOk ? 96 : 62, state: live.backendOk ? 'stable' : 'risk' },
    { name: t.docsIndex, value: `${live.apiDocEndpoints || 46}${t.endpoints}`, score: 88, state: 'stable' },
    { name: t.networkOnline, value: live.online ? t.online : t.offline, score: live.online ? 94 : 25, state: live.online ? 'stable' : 'risk' },
    { name: t.clientDownlink, value: `${live.downlinkMbps || 0} Mbps`, score: Math.min(96, Math.max(30, (live.downlinkMbps || 5) * 9)), state: (live.downlinkMbps || 5) > 8 ? 'stable' : 'watch' },
  ];

  const responseQueue = [
    { priority: live.backendOk ? 'P3' : 'P1', text: `${t.healthProbe}: ${statusLabel(live.backendStatus, lang)}`, state: live.backendOk ? t.confirmed : t.processing },
    { priority: live.apiDocEndpoints > 0 ? 'P3' : 'P2', text: `${t.docsProbe}: ${live.apiDocEndpoints || 0}${t.methods}`, state: live.apiDocEndpoints > 0 ? t.confirmed : t.review },
    { priority: live.online ? 'P3' : 'P1', text: `${t.clientProbe}: ${live.online ? t.online : t.offline}`, state: live.online ? t.normal : t.processing },
  ];

  const routeProfiles = {
    primary: { label: t.primary, cn: t.primary, path: t.primaryPath, meta: t.primaryMeta },
    failover: { label: t.failover, cn: t.failover, path: t.failoverPath, meta: t.failoverMeta },
    security: { label: t.security, cn: t.security, path: t.securityPath, meta: `${securityScore} · ${t.securityMeta}` },
  } satisfies Record<RouteMode, { label: string; cn: string; path: string; meta: string }>;

  return (
    <main className={`ops-screen route-${routeMode} lang-${lang}`} onPointerMove={updateCursorGlow}>
      {showIntro && <BrandIntro t={t} lang={lang} />}
      <header className="ops-header">
        <div className="brand-lockup">
          <div className="brand-avatar" aria-hidden="true">
            <img src="/logo.png" alt="" />
            <span className="status-beacon" />
          </div>
          <div>
            <span className="eyebrow">{t.brand}</span>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>
        </div>
        <div className="header-actions">
          <button type="button" onClick={toggleLanguage} aria-label={lang === 'zh' ? 'Switch to English' : '切换到中文'}>{t.language}</button>
          <button type="button" onClick={() => void toggleFullscreen()} aria-label={isFullscreen ? t.exitFull : t.full}>{isFullscreen ? t.exitFull : t.full}</button>
        </div>
        <div className="header-console" aria-label={lang === 'zh' ? '实时系统状态控制台' : 'Live system status console'}>
          <span className={live.backendOk ? 'ok' : 'bad'}>{t.api} {statusLabel(live.backendStatus, lang)}</span>
          <span>{t.latency} {live.apiRttMs || 0}ms</span>
          <span>{t.fps} {live.fps}</span>
          <span>{formatNow(now)} UTC+8</span>
        </div>
      </header>

      <section className="command-strip" aria-label={t.command}>
        <div className="mission-card">
          <span>{t.ops}</span>
          <strong>{opsScore}</strong>
          <em>{t.opsSub}</em>
        </div>
        <div className="mission-radar">
          <i style={{ width: `${opsScore}%` }} />
          <span>{t.posture}</span>
        </div>
        <div className="shift-card">
          <span>{t.shift}</span>
          <strong>CN-NOC A</strong>
          <em>{t.shiftWindow}</em>
        </div>
      </section>

      <section className="kpi-grid" aria-label={lang === 'zh' ? '全球运营核心指标' : 'Global operations KPIs'}>
        {kpis.map((card) => (
          <article className={`kpi-card ${card.accent}`} key={card.label}>
            <div>
              <span>{card.label}</span>
              <strong>{card.value}</strong>
              <small>{card.sub} · {card.trend}</small>
            </div>
            <div className="sparkline" aria-hidden="true">
              {card.spark.map((height, index) => <i key={`${card.label}-${index}`} style={{ height: `${height}%` }} />)}
            </div>
          </article>
        ))}
      </section>

      <section className="main-grid">
        <aside className="panel left-stack">
          <div className="panel-title">
            <span>{t.regionTitle}</span>
            <em>{t.regionSub}</em>
          </div>
          <div className="region-table">
            <div className="thead">
              <span>{t.region}</span><span>{t.traffic}</span><span>{t.rtt}</span><span>SLA</span><span>{t.risk}</span>
            </div>
            {regions.map((row) => (
              <div key={row.code} className="trow">
                <span className="region-cell"><i />{row.region}<b>{row.code}</b></span>
                <span>{row.traffic}</span>
                <span>{row.latencyMs} ms</span>
                <span>{row.availability}</span>
                <span className={`risk ${riskClass(row.risk)}`}>{riskNames[lang][row.risk]}</span>
                <span className="owner-tag">{row.owner}</span>
                <span className="load-line"><i style={{ width: `${row.load}%` }} /></span>
              </div>
            ))}
          </div>
          <div className="section-card compact">
            <div className="section-head"><span>{t.capacity}</span><em>{t.capacitySub}</em></div>
            <div className="capacity-list">
              <p><b>{t.compute}</b><i style={{ width: '76%' }} /><span>76%</span></p>
              <p><b>{t.network}</b><i style={{ width: '64%' }} /><span>64%</span></p>
              <p><b>{t.storage}</b><i style={{ width: '58%' }} /><span>58%</span></p>
            </div>
          </div>
        </aside>

        <section className={`center-stage focus-${routeMode}`} aria-label={lang === 'zh' ? '中央实时地球链路拓扑' : 'Central live Earth link topology'}>
          <div className="stage-topline">
            <div><span>{t.topology}</span><strong>{t.topologySub}</strong></div>
            <div className="route-switcher" aria-label={lang === 'zh' ? '链路焦点切换器' : 'Route focus switcher'}>
              {(Object.keys(routeProfiles) as RouteMode[]).map((mode) => (
                <button
                  key={mode}
                  className={routeMode === mode ? 'active' : ''}
                  type="button"
                  onClick={() => setRouteMode(mode)}
                >
                  {routeProfiles[mode].cn}
                </button>
              ))}
            </div>
            <em>{t.lastSync} {live.updatedAt}</em>
          </div>
          <div className="globe-shell">
            <div className="orbital-ring ring-a" style={rotationStyle} />
            <div className="orbital-ring ring-b" />
            <div className="orbital-ring ring-c" />
            <svg className="flight-lines" viewBox="0 0 100 100" aria-hidden="true">
              <path className={`route route-1 ${routeMode === 'primary' ? 'active' : ''}`} d="M17 48 Q38 20 72 32" />
              <path className={`route route-2 ${routeMode === 'failover' ? 'active' : ''}`} d="M20 62 Q48 84 84 55" />
              <path className={`route route-3 ${routeMode === 'security' ? 'active' : ''}`} d="M30 29 Q58 50 86 43" />
              <path className="route route-4" d="M23 43 Q52 70 72 68" />
              <circle className="packet p1" cx="17" cy="48" r="1.2" />
              <circle className="packet p2" cx="20" cy="62" r="1.2" />
              <circle className="packet p3" cx="30" cy="29" r="1.2" />
            </svg>
            <div className="earth earth-real">
              <RealEarthGlobe focusMode={routeMode} />
              <div className="earth-shadow" />
              <div className="glow" />
            </div>
            {nodeLabels[lang].map((node) => (
              <span className={node.className} key={node.label}>{node.label}<b>{node.type}</b></span>
            ))}
          </div>
          <div className="route-dock">
            {(Object.keys(routeProfiles) as RouteMode[]).map((mode) => (
              <button
                key={mode}
                className={routeMode === mode ? 'active' : ''}
                type="button"
                onClick={() => setRouteMode(mode)}
              >
                <span>{routeProfiles[mode].label}</span>
                <strong>{routeProfiles[mode].path}</strong>
                <em>{routeProfiles[mode].meta}</em>
              </button>
            ))}
          </div>
        </section>

        <aside className="panel right-stack">
          <div className="panel-title">
            <span>{t.feed}</span>
            <em>{t.feedSub}</em>
          </div>
          <div className="feed" aria-live="polite">
            {events.map((item) => (
              <div key={item.id} className="feed-item">
                <span className={`level ${item.level.toLowerCase()}`}>{levelLabel(item.level, lang)}</span>
                <time>{item.time}</time>
                <strong>{item.source}</strong>
                <code>{item.endpoint}</code>
                <p>{item.message}</p>
              </div>
            ))}
          </div>
          <div className="health-stack">
            {healthStack.map((item) => (
              <div className={item.state} key={item.name}>
                <span>{item.name}</span><strong>{item.value}</strong><i style={{ width: `${item.score}%` }} />
              </div>
            ))}
          </div>
          <div className="section-card compact">
            <div className="section-head"><span>{t.queue}</span><em>{t.queueSub}</em></div>
            <ol className="response-queue">
              {responseQueue.map((item) => (
                <li key={item.text}><b>{item.priority}</b><span>{item.text}</span><em>{item.state}</em></li>
              ))}
            </ol>
          </div>
        </aside>
      </section>

      <section className="service-lanes" aria-label={t.services}>
        {serviceLanes.map((lane) => (
          <article key={lane.en}>
            <span>{lang === 'zh' ? lane.zh : lane.en}</span>
            <strong>{lang === 'zh' ? lane.zhDesc : lane.enDesc}</strong>
            <div><em>{lane.owner}</em><b>{lang === 'zh' ? lane.zhState : lane.enState}</b><small>SLA {lane.sla}</small></div>
            <p><i style={{ width: `${Math.min(94, 50 + lane.queue * 2)}%` }} /> <span>{lane.queue}{t.activeTasks}</span></p>
          </article>
        ))}
      </section>

      <footer className="ops-footer">
        <span>{t.lastSync}: {live.updatedAt}</span>
        <span>{t.footerSource}</span>
        <span>{t.entry}</span>
      </footer>
    </main>
  );
}
