const coreBusinesses = [
  "人工智能应用软件开发",
  "信息系统集成与智能控制系统集成",
  "网络与信息安全软件开发",
  "云计算与数据处理服务",
  "数字文化创意技术与内容应用",
  "智能家庭与可穿戴设备解决方案",
];

const highlights = [
  { label: "成立时间", value: "2021-09-22" },
  { label: "注册资本", value: "500 万元" },
  { label: "统一社会信用代码", value: "91440300MA5H0HLK5U" },
  { label: "企业状态", value: "存续" },
];

export default function Home() {
  return (
    <main className="bg-slate-950 text-slate-100">
      <section className="mx-auto flex min-h-[72vh] max-w-6xl flex-col justify-center px-6 py-20 md:px-10">
        <p className="mb-4 inline-flex w-fit rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-200">
          KeXing Technology · Official Website
        </p>
        <h1 className="text-4xl font-bold leading-tight md:text-6xl">
          柯兴科技（深圳）有限公司
        </h1>
        <p className="mt-6 max-w-3xl text-lg text-slate-300 md:text-xl">
          面向企业数字化与智能化升级，提供从系统集成、软件研发到云与数据能力建设的一体化技术服务。
        </p>
        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <a
            href="#about"
            className="rounded-full bg-cyan-400 px-5 py-2 font-medium text-slate-950 transition hover:bg-cyan-300"
          >
            了解我们
          </a>
          <a
            href="#business"
            className="rounded-full border border-slate-600 px-5 py-2 font-medium transition hover:border-cyan-300 hover:text-cyan-200"
          >
            核心业务
          </a>
        </div>
      </section>

      <section id="about" className="border-t border-slate-800 bg-slate-900/70">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-14 md:grid-cols-2 md:px-10">
          <div>
            <h2 className="text-2xl font-semibold">企业信息</h2>
            <p className="mt-4 leading-8 text-slate-300">
              法定代表人：葛亚鹏
              <br />
              地址：深圳市罗湖区笋岗街道田心社区宝安北路3008号宝能中心E栋18层05
              <br />
              行业：信息传输、软件和信息技术服务业
            </p>
          </div>
          <div className="grid gap-3">
            {highlights.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4"
              >
                <p className="text-sm text-slate-400">{item.label}</p>
                <p className="mt-1 text-base font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="business" className="mx-auto max-w-6xl px-6 py-14 md:px-10">
        <h2 className="text-2xl font-semibold">核心业务方向</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coreBusinesses.map((item) => (
            <article
              key={item}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-cyan-400/60"
            >
              <p className="leading-7 text-slate-200">{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-800 bg-slate-900/70">
        <div className="mx-auto max-w-6xl px-6 py-14 md:px-10">
          <h2 className="text-2xl font-semibold">经营范围概览</h2>
          <p className="mt-4 leading-8 text-slate-300">
            一般经营项目覆盖技术服务、信息系统集成、电子产品与智能设备销售、物联网技术服务、数据处理与数字创意应用等；
            许可经营项目包含建筑智能化工程施工与设计、建设工程施工、食品销售等。
          </p>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-10 text-sm text-slate-400 md:px-10">
        <p>© {new Date().getFullYear()} 柯兴科技（深圳）有限公司</p>
        <p>域名：kexing.allapple.top</p>
      </footer>
    </main>
  );
}
