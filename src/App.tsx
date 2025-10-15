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

const projects: Project[] = [
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
    description: "This site—clean, fast, accessible, dark mode.",
    tags: ["Vite", "Tailwind", "Framer Motion"]
  }
];

const experience: Experience[] = [
  {
    role: "Frontend Engineer",
    company: "Acme Inc.",
    period: "2023 — Present",
    bullets: [
      "Led migration to Vite + SWC, reducing build times by 60%.",
      "Built design system components with accessibility baked in."
    ]
  },
  {
    role: "Software Engineer",
    company: "Globex",
    period: "2021 — 2023",
    bullets: [
      "Shipped SSR dashboard with real-time analytics.",
      "Mentored 3 juniors; introduced testing culture."
    ]
  }
];

const skills: Record<string, string[]> = {
  Languages: ["TypeScript", "JavaScript", "Python", "Go"],
  Frontend: ["React", "Vite", "Next.js", "Tailwind", "Zustand"],
  Backend: ["Node.js", "Express", "tRPC", "PostgreSQL"],
  Tools: ["Git", "Vercel", "Docker", "Jest", "Playwright"]
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

function Nav() {
  const { enabled, setEnabled } = useDarkMode();

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#" className="text-lg font-semibold tracking-tight">
          YourName<span className="text-zinc-400">.dev</span>
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
        <div className="md:hidden">
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

function Hero() {
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
            Hello, I’m
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
            Your Name
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300">
            Frontend engineer crafting delightful, accessible web experiences.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#projects">
              <Button>
                View Projects <ArrowRight size={16} />
              </Button>
            </a>
            <a href="/YourName-CV.pdf" download target="_blank" rel="noreferrer">
              <GhostButton>
                Download CV <Download size={16} />
              </GhostButton>
            </a>
            <a href="mailto:you@example.com">
              <GhostButton>
                Contact Me <Mail size={16} />
              </GhostButton>
            </a>
          </div>
        </div>
        <motion.img
          {...inViewConfig}
          transition={defaultTransition}
          src="https://avatars.githubusercontent.com/u/9919?s=200&v=4"
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
          href="https://github.com/yourname"
          target="_blank"
          rel="noreferrer"
        >
          <Github size={16} /> GitHub
        </a>
        <a
          className="inline-flex items-center gap-2 hover:text-zinc-700 dark:hover:text-zinc-300"
          href="https://www.linkedin.com/in/yourname"
          target="_blank"
          rel="noreferrer"
        >
          <Linkedin size={16} /> LinkedIn
        </a>
        <a
          className="inline-flex items-center gap-2 hover:text-zinc-700 dark:hover:text-zinc-300"
          href="mailto:you@example.com"
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

function Projects() {
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

function Experience() {
  return (
    <Container id="experience">
      <h2 className="mb-6 text-2xl font-semibold tracking-tight md:text-3xl">
        Experience
      </h2>
      <div className="space-y-4">
        {experience.map((e) => (
          <Card key={e.company}>
            <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
              <div>
                <h3 className="text-lg font-semibold">
                  {e.role} · <span className="text-zinc-500">{e.company}</span>
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

function Skills() {
  const entries = useMemo(() => Object.entries(skills), []);
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

function Contact() {
  // Why: serverless `mailto` keeps MVP simple.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const mailto = useMemo(() => {
    const subject = encodeURIComponent(`Hello from ${name || "your website"}`);
    const body = encodeURIComponent(`${msg}\n\nFrom: ${name} <${email}>`);
    return `mailto:you@example.com?subject=${subject}&body=${body}`;
  }, [name, email, msg]);

  const disabled = !name || !email || !msg || !/\S+@\S+\.\S+/.test(email);

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              <a className="underline" href="mailto:you@example.com">
                you@example.com
              </a>
            </span>
          </div>
        </form>
      </Card>
    </Container>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-200 py-10 text-center text-sm text-zinc-500 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-4">
        © {new Date().getFullYear()} Your Name. Built with React & Tailwind.
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div>
      <Nav />
      <main>
        <Hero />
        <Projects />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
