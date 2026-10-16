"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PDF_TOOLS, VIDEO_TOOLS, IMAGE_TOOLS, AUDIO_TOOLS, SOCIAL_TOOLS, MORE_TOOLS, NAV_LINKS, ToolPanel } from "../../page";

const CAT_MAP: Record<string, { title: string, emoji: string, iconBg: string, color: string, tools: string[][] }> = {
  pdf: { title: "PDF Tools", emoji: "📄", iconBg: "#fff1f1", color: "#ef4444", tools: PDF_TOOLS },
  video: { title: "Video Tools", emoji: "🎬", iconBg: "#faf5ff", color: "#a855f7", tools: VIDEO_TOOLS },
  audio: { title: "Audio Tools", emoji: "🎵", iconBg: "#fdf4ff", color: "#d946ef", tools: AUDIO_TOOLS },
  image: { title: "Image Tools", emoji: "🖼️", iconBg: "#fffbeb", color: "#f59e0b", tools: IMAGE_TOOLS },
  social: { title: "Social Media Tools", emoji: "📱", iconBg: "#eff6ff", color: "#3b82f6", tools: SOCIAL_TOOLS },
  more: { title: "More Tools", emoji: "✨", iconBg: "#f0fdf4", color: "#22c55e", tools: MORE_TOOLS },
};

export default function CategoryPage() {
  const params = useParams();
  const slug = (Array.isArray(params?.slug) ? params.slug[0] : params?.slug) || "";
  const router = useRouter();

  const [dark, setDark] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("vpdfx-theme");
    if (savedTheme === "dark") {
      setDark(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  function toggleDark() {
    setDark((previous) => {
      const next = !previous;
      document.documentElement.setAttribute("data-theme", next ? "dark" : "");
      window.localStorage.setItem("vpdfx-theme", next ? "dark" : "light");
      return next;
    });
  }

  const category = slug ? CAT_MAP[slug] : undefined;

  if (!category) {
    return <div className="p-20 text-center text-2xl font-bold">Category not found</div>;
  }

  function handleToolActivate(toolName: string) {
    router.push(`/tools?tool=${encodeURIComponent(toolName)}`);
  }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <nav className="sticky top-0 z-[100] backdrop-blur-xl border-b border-[var(--border)] transition-colors duration-300 bg-[var(--bg-card)]/85" style={{ position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 20px rgba(0,0,0,.08)" }}>
        <div className="max-w-[1280px] mx-auto flex items-center h-16 px-4 sm:px-6 gap-2 sm:gap-6 justify-between">
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-lg border border-[var(--border)] bg-[var(--bg-card2)] flex items-center justify-center text-[17px] text-[var(--text-primary)] cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>

            <a href="/" className="flex items-center gap-2 no-underline shrink-0">
              <img src={dark ? "/image-dark.png" : "/image-copy.png"} alt="VPDFX" className="h-8 sm:h-11 object-contain max-w-[120px] sm:max-w-none" />
            </a>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card2)] font-semibold px-2.5 lg:px-3 py-1.5 text-[13px] lg:text-[15px] rounded-lg transition-all whitespace-nowrap no-underline">{link.label}</a>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative hidden sm:flex items-center gap-2 bg-[var(--bg-card2)] border-[1.5px] border-[var(--border)] rounded-full px-3.5 py-1.5 w-[140px] md:w-[190px] focus-within:border-[var(--accent)]">
              <span className="text-[var(--text-muted)] text-[13px]">🔎</span>
              <input value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="Search tools..." className="border-none bg-transparent outline-none text-[13px] text-[var(--text-primary)] w-full font-inherit" />
            </div>

            <button onClick={toggleDark} title="Toggle dark mode" className="w-8 h-8 sm:w-[38px] sm:h-[38px] rounded-full border-[1.5px] border-[var(--border)] bg-[var(--bg-card)] cursor-pointer text-[14px] sm:text-[17px] flex items-center justify-center transition-all shrink-0 hover:border-[var(--accent)]">
              {dark ? "☀️" : "🌙"}
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <a href="/#login" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card2)] font-semibold text-[13px] sm:text-[14px] px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg transition-all whitespace-nowrap no-underline">Log In</a>
              <a href="/#signin" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card2)] font-semibold text-[13px] sm:text-[14px] px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg transition-all whitespace-nowrap no-underline">Sign In</a>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--border)] bg-[var(--bg-card)] px-4 py-3 shadow-xl flex flex-col gap-1 max-h-[calc(100vh-64px)] overflow-y-auto">
            <div className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider px-2 py-1">Navigation</div>
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-[var(--text-primary)] font-medium text-[15px] py-2 px-3 rounded-lg hover:bg-[var(--bg-card2)] transition-colors no-underline flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="text-[var(--text-muted)] text-[12px]">→</span>
              </a>
            ))}
          </div>
        )}
      </nav>

      <main style={{ flex: 1, padding: "40px 24px 60px", maxWidth: 1100, margin: "0 auto", width: "100%" }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
          <button
            onClick={() => router.push('/')}
            className="flex items-center justify-center w-11 h-11 text-[20px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] rounded-full transition-all border border-transparent hover:border-[var(--border)] shrink-0 mr-2"
            title="Back to Home"
          >
            ←
          </button>

          <div className="w-[60px] h-[60px] rounded-[16px] flex items-center justify-center text-[30px] shrink-0" style={{ background: category.iconBg }}>
            {category.emoji}
          </div>

          <div className="mt-2 sm:mt-0 flex-1">
            <h1 className="text-[28px] font-[900] text-[var(--text-primary)] leading-tight mb-0.5">{category.title}</h1>
            <p className="text-[15px] text-[var(--text-secondary)]">
              {slug === 'more' 
                ? "Everything you need to work with advanced document utilities in one place." 
                : `Everything you need to work with ${category.title.split(' ')[0]}s in one place.`}
            </p>
          </div>

          {slug === "image" && (
            <button
              onClick={() => router.push('/image-workflow')}
              className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-[14px] rounded-2xl shadow-lg shadow-amber-500/25 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>⚡</span>
              <span>Open Image Workflow Studio ↗</span>
            </button>
          )}
        </div>

        {slug === "image" && (
          <div className="mb-8 p-6 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border-2 border-amber-500/30 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-3xl font-black shrink-0">
                ✨
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-black text-[17px] text-[var(--text-primary)]">Separate Sequential Image Workflow</h3>
                  <span className="bg-amber-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full">New</span>
                </div>
                <p className="text-[13px] text-[var(--text-secondary)]">Chain resize, crop, rotate, remove BG, compress, and PDF export automatically in one step without repeating uploads.</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/image-workflow')}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-[13px] font-extrabold rounded-xl transition-all shadow-md hover:shadow-lg shrink-0 cursor-pointer"
            >
              Launch Studio →
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {category.tools.map(([icon, name]) => (
            <button
              key={name}
              onClick={() => handleToolActivate(name)}
              className="flex items-center gap-4 p-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:border-[rgba(79,70,229,0.3)] transition-all duration-300 text-left cursor-pointer group w-full"
            >
              <div className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-[26px] shrink-0 transition-transform group-hover:scale-110" style={{ background: category.iconBg }}>
                {icon}
              </div>
              <div className="min-w-0">
                <div className="font-bold text-[16px] text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent)] transition-colors truncate">{name}</div>
                <div className="text-[13px] text-[var(--text-secondary)] truncate">Launch this tool ↗</div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
