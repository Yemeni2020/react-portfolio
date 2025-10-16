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
  Download,
  Frame
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
    name: "Osama Shujaa Aldeen",
    role: "Software Engineer",
    summary: "Software engineer crafting delightful, accessible web experiences.",
    avatarUrl: "https://avatars.githubusercontent.com/u/9919?s=200&v=4",
    cvUrl: "./public/CV.pdf"
  },
  branding: {
    title: "Osama Shujaa Aldeen",
    highlight: ".dev"
  },
  links: {
    github: "https://github.com/Yemeni2020",
    linkedin: "https://www.linkedin.com/in/osama-shujaa-aldeen/",
    email: "Osama_shujaa_aldeen@hotmail.com"
  },
  projects: [
    {
      title: "Ecommerce Platform",
      description: "Full-featured online store with real-time inventory.",
      tags: ["React", "Vite", "Laravel", "MySQL", "Tailwind"],
      href: "https://Realsilk.sa",
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
    Languages: ["TypeScript", "JavaScript", "Python", "Go", "SQL", "PHP", "Laravel","C#","Analysis and Design"],
    Frontend: ["React", "Vite", "Next.js", "Tailwind", "Zustand","redux","Vue.js"],
    Backend: ["Node.js", "Express", "tRPC", "PostgreSQL"],
    DevOps: ["Docker", "Kubernetes", "AWS"],
    Frameworks: ["React", "Next.js", "Express", "Laravel", "WordPress", "Salah"],
    Tools: ["Git", "Vercel", "Docker", "Jest", "Playwright"]
  },
  footer: {
    owner: "Osama Shujaa Aldeen"
  }
};

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

function Nav(props: { branding: BrandingContent }) {
  const { enabled, setEnabled } = useDarkMode();
  const { branding } = props;

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
        {/* <div className="p-6 m-4 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
  Tailwind is working
</div> */}
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
              placeholder="Tell me about your project."
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
  const content = defaultContent;

  return (
    <div>
      <Nav branding={content.branding} />
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
