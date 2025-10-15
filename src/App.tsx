// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
// FILE: src/App.tsx

import { useEffect, useMemo, useState } from "react";
import { motion, type Transition, type HTMLMotionProps } from "framer-motion";
import {
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  Moon,
  SunMedium,
  ExternalLink,
  Link as LinkIcon,
  Download
} from "lucide-react";

type Project = {
  title: string;
  description: string;
  tags: string[];
  href?: string;
  repo?: string;
};

type Experience = {
  role: string;
  company: string;
  period: string;
  bullets: string[];
};

type HeroContent = {
  greeting: string;
  name: string;
  role: string;
  summary: string;
  avatarUrl: string;
  cvUrl: string;
};

type BrandingContent = {
  title: string;
  highlight: string;
};

type LinksContent = {
  github: string;
  linkedin: string;
  email: string;
};

type FooterContent = {
  owner: string;
};

type PortfolioContent = {
  hero: HeroContent;
  branding: BrandingContent;
  links: LinksContent;
  projects: Project[];
  experience: Experience[];
  skills: Record<string, string[]>;
  footer: FooterContent;
};

const defaultContent: PortfolioContent = {
  hero: {
    greeting: "Hello, I'm",
    name: "Your Name",
    role: "Frontend engineer",
    summary: "Frontend engineer crafting delightful, accessible web experiences.",
    avatarUrl: "https://avatars.githubusercontent.com/u/9919?s=200&v=4",
    cvUrl: "/YourName-CV.pdf"
  },
  branding: {
    title: "YourName",
    highlight: ".dev"
  },
  links: {
    github: "https://github.com/yourname",
    linkedin: "https://www.linkedin.com/in/yourname",
    email: "you@example.com"
  },
  projects: [
    {
      title: "Realtime Chat",
      description: "WebSocket chat with rooms, presence, and optimistic UI.",
      tags: ["React", "Vite", "WS", "Zustand", "Tailwind"],
      href: "#",
      repo: "#"
    },
    {
      title: "E-commerce Starter",
      description: "Cart, checkout, payments, and admin dashboard.",
      tags: ["React", "Stripe", "Prisma"],
      href: "#",
      repo: "#"
    },
    {
      title: "Portfolio Template",
      description: "This site-clean, fast, accessible, dark mode.",
      tags: ["Vite", "Tailwind", "Framer Motion"]
    }
  ],
  experience: [
    {
      role: "Frontend Engineer",
      company: "Acme Inc.",
      period: "2023 - Present",
      bullets: [
        "Led migration to Vite + SWC, reducing build times by 60%.",
        "Built design system components with accessibility baked in."
      ]
    },
    {
      role: "Software Engineer",
      company: "Globex",
      period: "2021 - 2023",
      bullets: [
        "Shipped SSR dashboard with real-time analytics.",
        "Mentored 3 juniors; introduced testing culture."
      ]
    }
  ],
  skills: {
    Languages: ["TypeScript", "JavaScript", "Python", "Go"],
    Frontend: ["React", "Vite", "Next.js", "Tailwind", "Zustand"],
    Backend: ["Node.js", "Express", "tRPC", "PostgreSQL"],
    Tools: ["Git", "Vercel", "Docker", "Jest", "Playwright"]
  },
  footer: {
    owner: "Your Name"
  }
};

const CONTENT_STORAGE_KEY = "portfolio-content-v1";
const DASHBOARD_PIN_STORAGE_KEY = "portfolio-dashboard-pin";

function cloneContent(content: PortfolioContent): PortfolioContent {
  return JSON.parse(JSON.stringify(content)) as PortfolioContent;
}

function mergeContent(partial?: Partial<PortfolioContent>): PortfolioContent {
  if (!partial) return cloneContent(defaultContent);
  const merged: PortfolioContent = {
    hero: { ...defaultContent.hero, ...(partial.hero ?? {}) },
    branding: { ...defaultContent.branding, ...(partial.branding ?? {}) },
    links: { ...defaultContent.links, ...(partial.links ?? {}) },
    projects: Array.isArray(partial.projects) ? partial.projects : defaultContent.projects,
    experience: Array.isArray(partial.experience) ? partial.experience : defaultContent.experience,
    skills: partial.skills ?? defaultContent.skills,
    footer: { ...defaultContent.footer, ...(partial.footer ?? {}) }
  };
  return cloneContent(merged);
}

/** Why: explicitly typing `Transition` prevents `ease` from widening to `string`. */
const defaultTransition: Transition = { duration: 0.6, ease: "easeOut" };
const fastTransition: Transition = { duration: 0.4, ease: "easeOut" };

const inViewConfig = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.6 }
} as const;

function useDarkMode() {
  const [enabled, setEnabled] = useState<boolean>(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (stored) return stored === "dark";
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (enabled) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [enabled]);

  return { enabled, setEnabled };
}

function usePortfolioContent() {
  const [content, setContent] = useState<PortfolioContent>(() => {
    if (typeof window === "undefined") return cloneContent(defaultContent);
    const stored = window.localStorage.getItem(CONTENT_STORAGE_KEY);
    if (!stored) return cloneContent(defaultContent);
    try {
      const parsed = JSON.parse(stored) as Partial<PortfolioContent>;
      return mergeContent(parsed);
    } catch {
      return cloneContent(defaultContent);
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(content));
  }, [content]);

  const reset = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(CONTENT_STORAGE_KEY);
    }
    setContent(cloneContent(defaultContent));
  };

  return { content, setContent, reset };
}

function encodePin(pin: string): string {
  if (typeof window === "undefined") return pin;
  const encoder = new TextEncoder();
  const bytes = encoder.encode(pin);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return window.btoa(binary);
}

function useDashboardPin() {
  const [encodedPin, setEncodedPin] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(DASHBOARD_PIN_STORAGE_KEY);
  });

  const persist = (pin: string | null) => {
    if (typeof window === "undefined") return;
    if (pin === null) {
      window.localStorage.removeItem(DASHBOARD_PIN_STORAGE_KEY);
    } else {
      window.localStorage.setItem(DASHBOARD_PIN_STORAGE_KEY, pin);
    }
  };

  const setPin = (pin: string) => {
    const hashed = encodePin(pin);
    persist(hashed);
    setEncodedPin(hashed);
  };

  const verifyPin = (pin: string) => {
    if (!encodedPin) return false;
    return encodePin(pin) === encodedPin;
  };

  const clearPin = () => {
    persist(null);
    setEncodedPin(null);
  };

  const updatePin = (current: string, next: string) => {
    if (encodedPin && !verifyPin(current)) return false;
    setPin(next);
    return true;
  };

  return {
    hasPin: encodedPin !== null,
    verifyPin,
    setPin,
    updatePin,
    clearPin
  };
}

function Container(props: { children: React.ReactNode; id?: string }) {
  return (
    <section id={props.id} className="py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-4">{props.children}</div>
    </section>
  );
}

function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={
        "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium shadow-soft ring-1 ring-zinc-200 transition hover:-translate-y-0.5 hover:shadow " +
        "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white " +
        (props.className ?? "")
      }
    />
  );
}

function GhostButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={
        "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium ring-1 ring-inset ring-zinc-300 transition hover:-translate-y-0.5 hover:bg-zinc-50 " +
        "dark:ring-zinc-700 dark:hover:bg-zinc-900 " +
        (props.className ?? "")
      }
    />
  );
}

function Card(props: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={
        "rounded-3xl border border-zinc-200 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow " +
        "dark:border-zinc-800 dark:bg-zinc-900 " +
        (props.className ?? "")
      }
    >
      {props.children}
    </div>
  );
}

function Nav(props: { branding: BrandingContent; onOpenDashboard: () => void }) {
  const { enabled, setEnabled } = useDarkMode();
  const { branding, onOpenDashboard } = props;

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#" className="text-lg font-semibold tracking-tight">
          {branding.title}
          <span className="text-zinc-400">{branding.highlight}</span>
        </a>
        <div className="hidden items-center gap-6 md:flex">
          <a href="#projects" className="opacity-80 hover:opacity-100">
            Projects
          </a>
          <a href="#experience" className="opacity-80 hover:opacity-100">
            Experience
          </a>
          <a href="#skills" className="opacity-80 hover:opacity-100">
            Skills
          </a>
          <a href="#contact" className="opacity-80 hover:opacity-100">
            Contact
          </a>
          <GhostButton type="button" onClick={onOpenDashboard} className="px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            Dashboard
          </GhostButton>
          <button
            aria-label="Toggle theme"
            onClick={() => setEnabled(!enabled)}
            className="rounded-full p-2 ring-1 ring-zinc-300 transition hover:bg-zinc-100 dark:ring-zinc-700 dark:hover:bg-zinc-900"
          >
            {enabled ? <SunMedium size={18} /> : <Moon size={18} />}
          </button>
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={onOpenDashboard}
            className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-semibold uppercase tracking-wide transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Dashboard
          </button>
          <button
            aria-label="Toggle theme"
            onClick={() => setEnabled(!enabled)}
            className="rounded-full p-2 ring-1 ring-zinc-300 transition hover:bg-zinc-100 dark:ring-zinc-700 dark:hover:bg-zinc-900"
          >
            {enabled ? <SunMedium size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
}

function Hero(props: { content: PortfolioContent }) {
  const { hero, links } = props.content;

  // Narrow the generic HTML motion props where needed.
  const heroMotionProps: HTMLMotionProps<"div"> = {
    ...inViewConfig,
    transition: defaultTransition
  };

  return (
    <Container id="#">
      <motion.div
        {...heroMotionProps}
        className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between"
      >
        <div className="max-w-2xl">
          <p className="mb-2 text-sm uppercase tracking-widest text-zinc-500">
            {hero.greeting}
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
            {hero.name}
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300">
            {hero.summary}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#projects">
              <Button>
                View Projects <ArrowRight size={16} />
              </Button>
            </a>
            <a href={hero.cvUrl} download target="_blank" rel="noreferrer">
              <GhostButton>
                Download CV <Download size={16} />
              </GhostButton>
            </a>
            <a href={`mailto:${links.email}`}>
              <GhostButton>
                Contact Me <Mail size={16} />
              </GhostButton>
            </a>
          </div>
        </div>
        <motion.img
          {...inViewConfig}
          transition={defaultTransition}
          src={hero.avatarUrl}
          alt="Avatar"
          className="h-28 w-28 rounded-2xl ring-1 ring-zinc-200 dark:ring-zinc-800 md:h-36 md:w-36"
        />
      </motion.div>
      <motion.div
        {...inViewConfig}
        transition={defaultTransition}
        className="mt-8 flex items-center gap-4 text-sm text-zinc-500"
      >
        <a
          className="inline-flex items-center gap-2 hover:text-zinc-700 dark:hover:text-zinc-300"
          href={links.github}
          target="_blank"
          rel="noreferrer"
        >
          <Github size={16} /> GitHub
        </a>
        <a
          className="inline-flex items-center gap-2 hover:text-zinc-700 dark:hover:text-zinc-300"
          href={links.linkedin}
          target="_blank"
          rel="noreferrer"
        >
          <Linkedin size={16} /> LinkedIn
        </a>
        <a
          className="inline-flex items-center gap-2 hover:text-zinc-700 dark:hover:text-zinc-300"
          href={`mailto:${links.email}`}
        >
          <Mail size={16} /> Email
        </a>
        <div className="p-6 m-4 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
  Tailwind is working
</div>
      </motion.div>
    </Container>
    
  );
}

function Projects(props: { projects: Project[] }) {
  const { projects } = props;

  return (
    <Container id="projects">
      <h2 className="mb-6 text-2xl font-semibold tracking-tight md:text-3xl">
        Projects
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={fastTransition}
          >
            <Card>
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <div className="flex gap-2">
                  {p.href && (
                    <a
                      href={p.href}
                      aria-label="Live link"
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full p-2 ring-1 ring-zinc-200 hover:bg-zinc-50 dark:ring-zinc-700 dark:hover:bg-zinc-800"
                      title="Live"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                  {p.repo && (
                    <a
                      href={p.repo}
                      aria-label="Repo link"
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full p-2 ring-1 ring-zinc-200 hover:bg-zinc-50 dark:ring-zinc-700 dark:hover:bg-zinc-800"
                      title="Source"
                    >
                      <LinkIcon size={16} />
                    </a>
                  )}
                </div>
              </div>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                {p.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-zinc-200 px-2.5 py-1 text-xs text-zinc-600 dark:border-zinc-700 dark:text-zinc-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Container>
  );
}

function Experience(props: { items: Experience[] }) {
  const { items } = props;
  return (
    <Container id="experience">
      <h2 className="mb-6 text-2xl font-semibold tracking-tight md:text-3xl">
        Experience
      </h2>
      <div className="space-y-4">
        {items.map((e) => (
          <Card key={e.company}>
            <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
              <div>
                <h3 className="text-lg font-semibold">
                  {e.role} - <span className="text-zinc-500">{e.company}</span>
                </h3>
                <p className="text-sm text-zinc-500">{e.period}</p>
              </div>
            </div>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
              {e.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </Container>
  );
}

function Skills(props: { skills: Record<string, string[]> }) {
  const entries = Object.entries(props.skills);
  return (
    <Container id="skills">
      <h2 className="mb-6 text-2xl font-semibold tracking-tight md:text-3xl">
        Skills
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        {entries.map(([group, items]) => (
          <Card key={group}>
            <h3 className="text-base font-semibold">{group}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {items.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700 ring-1 ring-inset ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-700"
                >
                  {s}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Container>
  );
}

function Contact(props: { email: string }) {
  // Why: serverless `mailto` keeps MVP simple.
  const [name, setName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [msg, setMsg] = useState("");
  const contactEmail = props.email;

  const mailto = useMemo(() => {
    const subject = encodeURIComponent(`Hello from ${name || "your website"}`);
    const body = encodeURIComponent(`${msg}\n\nFrom: ${name} <${senderEmail}>`);
    return `mailto:${contactEmail}?subject=${subject}&body=${body}`;
  }, [name, senderEmail, msg, contactEmail]);

  const disabled = !name || !senderEmail || !msg || !/\S+@\S+\.\S+/.test(senderEmail);

  return (
    <Container id="contact">
      <h2 className="mb-6 text-2xl font-semibold tracking-tight md:text-3xl">
        Contact
      </h2>
      <Card>
        <form
          onSubmit={(e) => {
            if (disabled) e.preventDefault();
          }}
          className="grid gap-4 md:grid-cols-2"
        >
          <div className="md:col-span-1">
            <label htmlFor="name" className="mb-2 block text-sm">
              Name
            </label>
            <input
              id="name"
              className="w-full rounded-2xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-0 transition placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-600"
              placeholder="Ada Lovelace"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="md:col-span-1">
            <label htmlFor="email" className="mb-2 block text-sm">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full rounded-2xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-0 transition placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-600"
              placeholder="ada@example.com"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="message" className="mb-2 block text-sm">
              Message
            </label>
            <textarea
              id="message"
              className="h-28 w-full resize-none rounded-2xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-0 transition placeholder:text-zinc-400 focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:border-zinc-600"
              placeholder="Tell me about your project…"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              required
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-3">
            <a
              href={disabled ? "#" : mailto}
              onClick={(e) => disabled && e.preventDefault()}
            >
              <Button aria-disabled={disabled} className={disabled ? "opacity-60" : ""}>
                Send Email <Mail size={16} />
              </Button>
            </a>
            <span className="text-xs text-zinc-500">
              Or email me directly:{" "}
              <a className="underline" href={`mailto:${contactEmail}`}>
                {contactEmail}
              </a>
            </span>
          </div>
        </form>
      </Card>
    </Container>
  );
}

type DashboardProps = {
  content: PortfolioContent;
  onChange: React.Dispatch<React.SetStateAction<PortfolioContent>>;
  onReset: () => void;
  onClose: () => void;
  onUpdatePin: (currentPin: string, nextPin: string) => boolean;
  onClearPin: (currentPin: string) => boolean;
  onLock: () => void;
  hasPin: boolean;
};

function Dashboard({
  content,
  onChange,
  onReset,
  onClose,
  onUpdatePin,
  onClearPin,
  onLock,
  hasPin
}: DashboardProps) {
  const inputClass =
    "w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-600";
  const textareaClass = `${inputClass} min-h-[120px]`;
  const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500";
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [removePinValue, setRemovePinValue] = useState("");
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [securityMessage, setSecurityMessage] = useState<string | null>(null);

  const handleHeroChange = (key: keyof HeroContent, value: string) => {
    onChange((prev) => ({
      ...prev,
      hero: { ...prev.hero, [key]: value }
    }));
  };

  const handleBrandingChange = (key: keyof BrandingContent, value: string) => {
    onChange((prev) => ({
      ...prev,
      branding: { ...prev.branding, [key]: value }
    }));
  };

  const handleLinksChange = (key: keyof LinksContent, value: string) => {
    onChange((prev) => ({
      ...prev,
      links: { ...prev.links, [key]: value }
    }));
  };

  const handleProjectField = (index: number, field: keyof Project, value: string) => {
    onChange((prev) => {
      const next = prev.projects.map((proj, i) =>
        i === index ? { ...proj, [field]: value } : proj
      );
      return { ...prev, projects: next };
    });
  };

  const handleProjectTags = (index: number, value: string) => {
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
    onChange((prev) => {
      const next = prev.projects.map((proj, i) =>
        i === index ? { ...proj, tags } : proj
      );
      return { ...prev, projects: next };
    });
  };

  const addProject = () => {
    onChange((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { title: "New Project", description: "", tags: [], href: "", repo: "" }
      ]
    }));
  };

  const removeProject = (index: number) => {
    onChange((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const handleExperienceField = (index: number, field: keyof Experience, value: string) => {
    onChange((prev) => {
      const next = prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      );
      return { ...prev, experience: next };
    });
  };

  const handleExperienceBullets = (index: number, value: string) => {
    const bullets = value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    onChange((prev) => {
      const next = prev.experience.map((exp, i) =>
        i === index ? { ...exp, bullets } : exp
      );
      return { ...prev, experience: next };
    });
  };

  const addExperience = () => {
    onChange((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { role: "New Role", company: "", period: "", bullets: [] }
      ]
    }));
  };

  const removeExperience = (index: number) => {
    onChange((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const handleSkillLabel = (currentKey: string, nextLabel: string): boolean => {
    const trimmed = nextLabel.trim();
    let updated = false;
    onChange((prev) => {
      if (!trimmed || trimmed === currentKey) return prev;
      if (Object.prototype.hasOwnProperty.call(prev.skills, trimmed)) return prev;
      const ordered = Object.entries(prev.skills);
      const nextSkills: Record<string, string[]> = {};
      for (const [key, value] of ordered) {
        if (key === currentKey) {
          nextSkills[trimmed] = value;
        } else {
          nextSkills[key] = value;
        }
      }
      updated = true;
      return { ...prev, skills: nextSkills };
    });
    return updated;
  };

  const handleSkillItems = (category: string, value: string) => {
    const items = value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
    onChange((prev) => {
      const nextSkills: Record<string, string[]> = {};
      for (const [key, val] of Object.entries(prev.skills)) {
        nextSkills[key] = key === category ? items : val;
      }
      return { ...prev, skills: nextSkills };
    });
  };

  const removeSkillCategory = (category: string) => {
    onChange((prev) => {
      const nextSkills: Record<string, string[]> = {};
      for (const [key, val] of Object.entries(prev.skills)) {
        if (key !== category) {
          nextSkills[key] = val;
        }
      }
      return { ...prev, skills: nextSkills };
    });
  };

  const addSkillCategory = () => {
    onChange((prev) => {
      const base = "New Category";
      let name = base;
      let counter = 1;
      while (Object.prototype.hasOwnProperty.call(prev.skills, name)) {
        counter += 1;
        name = `${base} ${counter}`;
      }
      return {
        ...prev,
        skills: { ...prev.skills, [name]: [] }
      };
    });
  };

  const handleFooterChange = (owner: string) => {
    onChange((prev) => ({
      ...prev,
      footer: { ...prev.footer, owner }
    }));
  };

  const skillEntries = Object.entries(content.skills);

  const handlePinSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSecurityError(null);
    setSecurityMessage(null);
    const trimmedNew = newPin.trim();
    const trimmedConfirm = confirmPin.trim();
    const trimmedCurrent = currentPin.trim();

    if (trimmedNew.length < 4) {
      setSecurityError("Choose a PIN with at least 4 characters.");
      return;
    }

    if (trimmedNew !== trimmedConfirm) {
      setSecurityError("New PINs do not match.");
      return;
    }

    const success = onUpdatePin(trimmedCurrent, trimmedNew);
    if (!success) {
      setSecurityError("Current PIN is incorrect.");
      return;
    }

    setSecurityMessage(hasPin ? "PIN updated successfully." : "PIN set successfully.");
    setCurrentPin("");
    setNewPin("");
    setConfirmPin("");
    setRemovePinValue("");
  };

  const handleRemovePin = () => {
    setSecurityError(null);
    setSecurityMessage(null);
    if (!hasPin) {
      setSecurityError("No PIN is currently set.");
      return;
    }
    const trimmed = removePinValue.trim();
    if (!trimmed) {
      setSecurityError("Enter your current PIN to remove it.");
      return;
    }
    const success = onClearPin(trimmed);
    if (!success) {
      setSecurityError("Current PIN is incorrect.");
      return;
    }
    setSecurityMessage("Dashboard PIN removed. Remember to set a new one to keep it private.");
    setCurrentPin("");
    setNewPin("");
    setConfirmPin("");
    setRemovePinValue("");
  };

  return (
    <div className="min-h-screen bg-zinc-100 pb-16 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-4 py-5 md:flex-row md:items-center">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Content Dashboard</h1>
            <p className="text-sm text-zinc-500">
              Update your portfolio copy, links, and project details. Changes persist locally.
            </p>
          </div>
          <div className="flex gap-2">
            <GhostButton type="button" onClick={onReset}>
              Reset to defaults
            </GhostButton>
            <Button type="button" onClick={onClose}>
              Preview site
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto mt-8 flex w-full max-w-6xl flex-col gap-6 px-4">
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Hero</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Greeting</label>
              <input
                className={inputClass}
                value={content.hero.greeting}
                onChange={(e) => handleHeroChange("greeting", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Role</label>
              <input
                className={inputClass}
                value={content.hero.role}
                onChange={(e) => handleHeroChange("role", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Name</label>
              <input
                className={inputClass}
                value={content.hero.name}
                onChange={(e) => handleHeroChange("name", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>CV URL</label>
              <input
                className={inputClass}
                value={content.hero.cvUrl}
                onChange={(e) => handleHeroChange("cvUrl", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Avatar URL</label>
              <input
                className={inputClass}
                value={content.hero.avatarUrl}
                onChange={(e) => handleHeroChange("avatarUrl", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Summary</label>
              <textarea
                className={textareaClass}
                value={content.hero.summary}
                onChange={(e) => handleHeroChange("summary", e.target.value)}
              />
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-lg font-semibold">Branding & Links</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Brand Title</label>
              <input
                className={inputClass}
                value={content.branding.title}
                onChange={(e) => handleBrandingChange("title", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Brand Highlight</label>
              <input
                className={inputClass}
                value={content.branding.highlight}
                onChange={(e) => handleBrandingChange("highlight", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>GitHub URL</label>
              <input
                className={inputClass}
                value={content.links.github}
                onChange={(e) => handleLinksChange("github", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>LinkedIn URL</label>
              <input
                className={inputClass}
                value={content.links.linkedin}
                onChange={(e) => handleLinksChange("linkedin", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Contact Email</label>
              <input
                className={inputClass}
                value={content.links.email}
                onChange={(e) => handleLinksChange("email", e.target.value)}
              />
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Projects</h2>
            <GhostButton type="button" onClick={addProject}>
              Add project
            </GhostButton>
          </div>
          <div className="space-y-4">
            {content.projects.map((project, index) => (
              <div key={`${project.title || "project"}-${index}`} className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                    Project {index + 1}
                  </h3>
                  <GhostButton
                    type="button"
                    onClick={() => removeProject(index)}
                    className="px-3 py-1 text-xs"
                  >
                    Remove
                  </GhostButton>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>Title</label>
                    <input
                      className={inputClass}
                      value={project.title}
                      onChange={(e) => handleProjectField(index, "title", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Tags (comma separated)</label>
                    <input
                      className={inputClass}
                      value={project.tags.join(", ")}
                      onChange={(e) => handleProjectTags(index, e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Live URL</label>
                    <input
                      className={inputClass}
                      value={project.href ?? ""}
                      onChange={(e) => handleProjectField(index, "href", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Repo URL</label>
                    <input
                      className={inputClass}
                      value={project.repo ?? ""}
                      onChange={(e) => handleProjectField(index, "repo", e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className={labelClass}>Description</label>
                  <textarea
                    className={textareaClass}
                    value={project.description}
                    onChange={(e) => handleProjectField(index, "description", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Experience</h2>
            <GhostButton type="button" onClick={addExperience}>
              Add role
            </GhostButton>
          </div>
          <div className="space-y-4">
            {content.experience.map((item, index) => (
              <div key={`${item.role || "experience"}-${index}`} className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                    Position {index + 1}
                  </h3>
                  <GhostButton
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="px-3 py-1 text-xs"
                  >
                    Remove
                  </GhostButton>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>Role</label>
                    <input
                      className={inputClass}
                      value={item.role}
                      onChange={(e) => handleExperienceField(index, "role", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Company</label>
                    <input
                      className={inputClass}
                      value={item.company}
                      onChange={(e) => handleExperienceField(index, "company", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Period</label>
                    <input
                      className={inputClass}
                      value={item.period}
                      onChange={(e) => handleExperienceField(index, "period", e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className={labelClass}>Highlights (one per line)</label>
                  <textarea
                    className={textareaClass}
                    value={item.bullets.join("\n")}
                    onChange={(e) => handleExperienceBullets(index, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Skills</h2>
            <GhostButton type="button" onClick={addSkillCategory}>
              Add category
            </GhostButton>
          </div>
          <div className="space-y-4">
            {skillEntries.map(([category, items], index) => (
              <div key={`${category}-${index}`} className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <input
                    key={`${category}-label`}
                    className={`${inputClass} mr-3`}
                    defaultValue={category}
                    onBlur={(e) => {
                      const changed = handleSkillLabel(category, e.target.value);
                      if (!changed) {
                        e.target.value = category;
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        const inputEl = e.target as HTMLInputElement;
                        const changed = handleSkillLabel(category, inputEl.value);
                        if (!changed) {
                          inputEl.value = category;
                        }
                      }
                    }}
                  />
                  <GhostButton
                    type="button"
                    onClick={() => removeSkillCategory(category)}
                    className="px-3 py-1 text-xs"
                  >
                    Remove
                  </GhostButton>
                </div>
                <div className="mt-4">
                  <label className={labelClass}>Skills (one per line)</label>
                  <textarea
                    className={textareaClass}
                    value={items.join("\n")}
                    onChange={(e) => handleSkillItems(category, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-lg font-semibold">Footer</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className={labelClass}>Owner name</label>
              <input
                className={inputClass}
                value={content.footer.owner}
                onChange={(e) => handleFooterChange(e.target.value)}
              />
            </div>
          </div>
        </Card>

        <Card className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-semibold">Security</h2>
            <GhostButton type="button" onClick={onLock}>
              Lock dashboard
            </GhostButton>
          </div>
          <p className="text-sm text-zinc-500">
            Protect your dashboard with a PIN so only you can edit this portfolio on this device.
          </p>
          {securityError && <p className="text-sm text-red-500">{securityError}</p>}
          {securityMessage && <p className="text-sm text-emerald-500">{securityMessage}</p>}
          <form onSubmit={handlePinSubmit} className="grid gap-4 md:grid-cols-2">
            {hasPin && (
              <div>
                <label className={labelClass}>Current PIN</label>
                <input
                  type="password"
                  className={inputClass}
                  value={currentPin}
                  onChange={(e) => setCurrentPin(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
            )}
            <div>
              <label className={labelClass}>New PIN</label>
              <input
                type="password"
                className={inputClass}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div>
              <label className={labelClass}>Confirm PIN</label>
              <input
                type="password"
                className={inputClass}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit">{hasPin ? "Update PIN" : "Set PIN"}</Button>
            </div>
          </form>

          {hasPin && (
            <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold">Remove PIN</p>
                <p className="text-xs text-zinc-500">
                  Enter your current PIN to remove dashboard protection.
                </p>
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <input
                  type="password"
                  className={inputClass}
                  value={removePinValue}
                  onChange={(e) => setRemovePinValue(e.target.value)}
                  placeholder="Current PIN"
                  autoComplete="off"
                />
                <GhostButton type="button" onClick={handleRemovePin}>
                  Remove PIN
                </GhostButton>
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}

type DashboardAuthProps = {
  hasPin: boolean;
  onVerify: (pin: string) => boolean;
  onCreate: (pin: string) => boolean;
  onCancel: () => void;
};

function DashboardAuthScreen({ hasPin, onVerify, onCreate, onCancel }: DashboardAuthProps) {
  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const mode = hasPin ? "enter" : "create";

  useEffect(() => {
    setPin("");
    setConfirm("");
    setError(null);
  }, [mode]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const trimmedPin = pin.trim();

    if (mode === "enter") {
      if (!trimmedPin) {
        setError("Enter your PIN to continue.");
        return;
      }
      const success = onVerify(trimmedPin);
      if (!success) {
        setError("Incorrect PIN. Try again.");
      }
      return;
    }

    const trimmedConfirm = confirm.trim();
    if (trimmedPin.length < 4) {
      setError("Choose a PIN with at least 4 characters.");
      return;
    }
    if (trimmedPin !== trimmedConfirm) {
      setError("PIN values do not match.");
      return;
    }
    const created = onCreate(trimmedPin);
    if (!created) {
      setError("Unable to save PIN. Try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <Card className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === "enter" ? "Unlock Dashboard" : "Secure Your Dashboard"}
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            {mode === "enter"
              ? "Enter the access PIN to manage your portfolio content."
              : "Set a dashboard PIN so only you can edit this portfolio on this device."}
          </p>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
              {mode === "enter" ? "PIN" : "Choose PIN"}
            </label>
            <input
              type="password"
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-600"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              autoFocus
              autoComplete={mode === "enter" ? "current-password" : "new-password"}
            />
          </div>
          {mode === "create" && (
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Confirm PIN
              </label>
              <input
                type="password"
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-600"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            <Button type="submit">
              {mode === "enter" ? "Unlock" : "Save PIN"}
            </Button>
            <GhostButton type="button" onClick={onCancel}>
              Cancel
            </GhostButton>
          </div>
        </form>
      </Card>
    </div>
  );
}

function Footer(props: { owner: string }) {
  const { owner } = props;
  return (
    <footer className="border-t border-zinc-200 py-10 text-center text-sm text-zinc-500 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-4">
        © {new Date().getFullYear()} {owner}. Built with React & Tailwind.
      </div>
    </footer>
  );
}

export default function App() {
  const { content, setContent, reset } = usePortfolioContent();
  const { hasPin, verifyPin, setPin, updatePin, clearPin } = useDashboardPin();
  const [isDashboard, setIsDashboard] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.location.hash === "#dashboard";
  });
  const [isDashboardAuthed, setIsDashboardAuthed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem("dashboard-authed") === "true";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleHashChange = () => {
      setIsDashboard(window.location.hash === "#dashboard");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isDashboardAuthed) {
      window.sessionStorage.setItem("dashboard-authed", "true");
    } else {
      window.sessionStorage.removeItem("dashboard-authed");
    }
  }, [isDashboardAuthed]);

  const openDashboard = () => {
    if (typeof window !== "undefined") {
      window.location.hash = "#dashboard";
    }
    setIsDashboard(true);
  };

  const closeDashboard = () => {
    if (typeof window !== "undefined" && window.location.hash === "#dashboard") {
      window.location.hash = "";
    }
    setIsDashboard(false);
  };

  const handleVerifyPin = (pinValue: string) => {
    if (!hasPin) return false;
    const success = verifyPin(pinValue);
    if (success) {
      setIsDashboardAuthed(true);
    }
    return success;
  };

  const handleCreatePin = (pinValue: string) => {
    setPin(pinValue);
    setIsDashboardAuthed(true);
    return true;
  };

  const handleUpdatePin = (currentPin: string, nextPin: string) => {
    const success = updatePin(currentPin, nextPin);
    if (success) {
      setIsDashboardAuthed(true);
    }
    return success;
  };

  const handleClearPin = (currentPin: string) => {
    if (hasPin && !verifyPin(currentPin)) {
      return false;
    }
    clearPin();
    return true;
  };

  const handleLock = () => {
    setIsDashboardAuthed(false);
    closeDashboard();
  };

  if (isDashboard) {
    if (!isDashboardAuthed) {
      return (
        <DashboardAuthScreen
          hasPin={hasPin}
          onVerify={handleVerifyPin}
          onCreate={handleCreatePin}
          onCancel={closeDashboard}
        />
      );
    }

    return (
      <Dashboard
        content={content}
        onChange={setContent}
        onReset={reset}
        onClose={closeDashboard}
        onUpdatePin={handleUpdatePin}
        onClearPin={handleClearPin}
        onLock={handleLock}
        hasPin={hasPin}
      />
    );
  }

  return (
    <div>
      <Nav branding={content.branding} onOpenDashboard={openDashboard} />
      <main>
        <Hero content={content} />
        <Projects projects={content.projects} />
        <Experience items={content.experience} />
        <Skills skills={content.skills} />
        <Contact email={content.links.email} />
      </main>
      <Footer owner={content.footer.owner} />
    </div>
  );
}










