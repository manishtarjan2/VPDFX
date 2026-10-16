"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, Sun, Moon, ShieldCheck, Zap, Sparkles, SlidersHorizontal, ArrowRight, X, Menu } from "lucide-react";

type Tab = "link" | "upload" | "search";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "PDF", href: "/category/pdf" },
  { label: "Canva", href: "/editor" },
  { label: "Video", href: "/category/video" },
  { label: "Audio", href: "/category/audio" },
  { label: "Image", href: "/category/image" },
  { label: "Social", href: "/category/social" },
  { label: "More", href: "/category/more" },
];

export const PDF_TOOLS = [
  ["📄", "PDF to Word"],
  ["📝", "Word to PDF"],
  ["📑", "PDF to Text"],
  ["📝", "Text to PDF"],
  ["🔀", "Merge PDF"],
  ["✂️", "Split PDF"],
  ["🔄", "Rotate PDF"],
  ["💧", "Watermark PDF"],
  ["🗜️", "Compress PDF"],
  ["✍️", "Sign PDF"],
  ["🔢", "Add Page Numbers"],
  ["🧠", "OCR PDF"],
];

export const VIDEO_TOOLS = [
  ["🎵", "Video to MP3"],
  ["🎬", "Video to MP4"],
  ["🗜️", "Compress Video"],
  ["✂️", "Trim Video"],
  ["📐", "Resize Video"],
  ["🔄", "Change Format"],
  ["🖼️", "Extract Frames"],
  ["🎞️", "Video to GIF"],
  ["📏", "Change Resolution"],
  ["🔀", "Merge Videos"],
];

export const IMAGE_TOOLS = [
  ["🖼️", "JPG to PNG"],
  ["🖼️", "PNG to JPG"],
  ["🧩", "WebP to JPG"],
  ["📐", "Resize Image"],
  ["🗜️", "Compress Image"],
  ["✂️", "Crop Image"],
  ["🎨", "Edit Image"],
  ["🔄", "Rotate Image"],
  ["🧹", "Remove BG"],
  ["📄", "Image to PDF"],
  ["🔤", "Image to Text"],
];

export const SOCIAL_TOOLS = [
  ["🎥", "YouTube"],
  ["💼", "LinkedIn"],
  ["📸", "Instagram"],
  ["📌", "Pinterest"],
  ["👥", "Facebook"],
  ["🤖", "Reddit"],
  ["🎵", "TikTok"],
  ["👻", "Snapchat"],
  ["🐦", "Twitter (X)"],
  ["✨", "More Platforms"],
];

export const AUDIO_TOOLS = [
  ["🎵", "Audio to MP3"],
  ["✂️", "Trim Audio"],
  ["🔊", "Volume Booster"],
];

export const MORE_TOOLS = [
  ["📝", "Word to PDF"],
  ["📊", "Excel to PDF"],
  ["🔒", "Protect PDF"],
  ["🖍️", "Edit PDF"],
];

const FLOATERS = [
  { emoji: "📄", bg: "#fff1f1", size: 72, top: "2%", left: "28%", dur: "4.1s", delay: "0s", cls: "animate-[floatA_4s_ease-in-out_infinite]" },
  { emoji: "🎬", bg: "#fff0f5", size: 60, top: "10%", left: "72%", dur: "5.2s", delay: "0.6s", cls: "animate-[floatB_5s_ease-in-out_infinite]" },
  { emoji: "🎵", bg: "#f0f0f0", size: 56, top: "4%", left: "2%", dur: "3.8s", delay: "1.1s", cls: "animate-[floatA_4s_ease-in-out_infinite]" },
  { emoji: "🖼️", bg: "#eff6ff", size: 64, top: "55%", left: "5%", dur: "4.6s", delay: "0.3s", cls: "animate-[floatB_5s_ease-in-out_infinite]" },
  { emoji: "📱", bg: "#f5f5f5", size: 58, top: "62%", left: "62%", dur: "4.9s", delay: "0.8s", cls: "animate-[floatA_4s_ease-in-out_infinite]" },
];

const FEATURES = [
  { emoji: "⚡", label: "No Installation", sub: "Web Based" },
  { emoji: "📱", label: "Works on All Devices", sub: "Mobile, Tablet, Desktop" },
  { emoji: "✨", label: "High Quality Output", sub: "Best Conversion Quality" },
  { emoji: "🛡️", label: "Your Files Are Safe", sub: "Automatically Deleted" },
  { emoji: "🌍", label: "Global Access", sub: "Use From Anywhere" },
];

const QUICK_SEARCHES = ["PDF to Word", "Compress Video", "Remove Background", "YouTube Downloader", "Merge PDF", "Trim Video"];

const TOOL_LIBRARY = [
  { icon: "📄", name: "PDF to Word", category: "pdf", description: "Convert PDFs to editable Word documents." },
  { icon: "📑", name: "PDF to Text", category: "pdf", description: "Extract text from PDF files." },
  { icon: "📝", name: "Text to PDF", category: "pdf", description: "Create a PDF from text content." },
  { icon: "📷", name: "Image to PDF", category: "image", description: "Convert JPG or PNG to PDF." },
  { icon: "🔀", name: "Merge PDF", category: "pdf", description: "Combine multiple PDFs." },
  { icon: "✂️", name: "Split PDF", category: "pdf", description: "Split a PDF into sections." },
  { icon: "🔢", name: "Add Page Numbers", category: "pdf", description: "Add page numbers to your PDF." },
  { icon: "✍️", name: "Sign PDF", category: "pdf", description: "Sign your PDF electronically." },
  { icon: "💧", name: "Watermark PDF", category: "pdf", description: "Stamp a watermark on your PDF." },
  { icon: "🎨", name: "Edit PDF", category: "pdf", description: "Manually edit your PDF text, images, and pages fast." },
];

function Navbar({ dark, onToggle, searchValue, onSearchChange }: { dark: boolean; onToggle: () => void; searchValue: string; onSearchChange: (value: string) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="sticky top-0 z-[100] backdrop-blur-xl border-b border-[var(--border)] transition-colors duration-300 bg-[var(--bg-card)]/90 transition-shadow" style={{ boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,.08)" : "none" }}>
      <div className="max-w-[1280px] mx-auto flex items-center h-16 px-3.5 sm:px-6 gap-2 sm:gap-6 justify-between">
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Hamburger button for mobile/tablets */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-xl border border-[var(--border)] bg-[var(--bg-card2)] flex items-center justify-center text-[var(--text-primary)] cursor-pointer hover:bg-[var(--bg-card)] transition-colors shadow-xs"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <a href="/" className="flex items-center gap-2 no-underline shrink-0">
            <img src={dark ? "/image-dark.png" : "/image-copy.png"} alt="VPDFX" className="h-8 sm:h-10 object-contain max-w-[120px] sm:max-w-none" />
          </a>
        </div>

        {/* Desktop / Laptop / MacBook Navigation */}
        <div className="hidden md:flex items-center gap-0.5 lg:gap-1">
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card2)] font-semibold px-2.5 lg:px-3 py-1.5 text-[13px] lg:text-[15px] rounded-lg transition-all duration-150 whitespace-nowrap no-underline">{link.label}</a>
          ))}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Mobile search toggle icon */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="sm:hidden w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--bg-card2)] flex items-center justify-center text-[var(--text-primary)] cursor-pointer hover:bg-[var(--bg-card)] transition-colors"
            title="Search"
          >
            <Search size={15} />
          </button>

          {/* Desktop & Tablet Search Bar */}
          <div className="relative hidden sm:flex items-center gap-2 bg-[var(--bg-card2)] border-[1.5px] border-[var(--border)] rounded-full px-3.5 py-1.5 w-[140px] md:w-[190px] lg:w-[220px] focus-within:border-[var(--accent)] transition-all">
            <Search size={15} className="text-[var(--text-muted)] shrink-0" />
            <input
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchValue.trim()) {
                  const query = searchValue.trim().toLowerCase();
                  const allTools = [...PDF_TOOLS, ...VIDEO_TOOLS, ...IMAGE_TOOLS, ...AUDIO_TOOLS, ...SOCIAL_TOOLS, ...MORE_TOOLS];
                  const match = allTools.find(([, name]) => name.toLowerCase().includes(query));
                  if (match) {
                    router.push(match[1] === "Edit PDF" ? "/editor" : `/tools?tool=${encodeURIComponent(match[1])}`);
                    onSearchChange("");
                  }
                }
              }}
              placeholder="Search tools..."
              className="border-none bg-transparent outline-none text-[13px] lg:text-[14px] text-[var(--text-primary)] w-full font-inherit"
            />
            {searchValue.trim() && (
              <button
                onClick={() => onSearchChange("")}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] text-[12px] bg-transparent border-none cursor-pointer p-0"
                title="Clear search"
              >
                ✕
              </button>
            )}

            {/* Quick Search Dropdown */}
            {searchValue.trim().length > 0 && (
              <div className="absolute top-[calc(100%+8px)] left-0 w-[260px] md:w-[280px] bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-xl z-[120] py-2 max-h-[320px] overflow-y-auto">
                <div className="text-[11px] font-bold text-[var(--text-muted)] px-3 py-1 uppercase tracking-wider">Matching Tools</div>
                {(() => {
                  const query = searchValue.trim().toLowerCase();
                  const all = [
                    ...PDF_TOOLS.map(([icon, name]) => ({ icon, name, cat: "PDF" })),
                    ...VIDEO_TOOLS.map(([icon, name]) => ({ icon, name, cat: "Video" })),
                    ...IMAGE_TOOLS.map(([icon, name]) => ({ icon, name, cat: "Image" })),
                    ...AUDIO_TOOLS.map(([icon, name]) => ({ icon, name, cat: "Audio" })),
                    ...SOCIAL_TOOLS.map(([icon, name]) => ({ icon, name, cat: "Social" })),
                    ...MORE_TOOLS.map(([icon, name]) => ({ icon, name, cat: "More" })),
                  ].filter(t => t.name.toLowerCase().includes(query));

                  if (all.length === 0) {
                    return <div className="text-[13px] text-[var(--text-muted)] px-3 py-3 text-center">No tools found</div>;
                  }

                  return all.slice(0, 8).map((tool) => (
                    <button
                      key={tool.name}
                      onClick={() => {
                        if (tool.name === "Edit PDF") {
                          router.push("/editor");
                        } else {
                          router.push(`/tools?tool=${encodeURIComponent(tool.name)}`);
                        }
                        onSearchChange("");
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-left bg-transparent border-none hover:bg-[var(--bg-card2)] cursor-pointer text-[var(--text-primary)] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[16px]">{tool.icon}</span>
                        <span className="text-[13px] font-medium">{tool.name}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-[var(--text-muted)] px-1.5 py-0.5 bg-[var(--bg-card2)] border border-[var(--border)] rounded">{tool.cat}</span>
                    </button>
                  ));
                })()}
              </div>
            )}
          </div>

          <button onClick={onToggle} title="Toggle dark mode" className="w-8 h-8 sm:w-[38px] sm:h-[38px] rounded-full border-[1.5px] border-[var(--border)] bg-[var(--bg-card)] cursor-pointer text-[var(--text-primary)] flex items-center justify-center transition-all shrink-0 hover:border-[var(--accent)] hover:shadow-xs">
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <div className="flex items-center gap-1 sm:gap-2">
            <a href="#login" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card2)] font-semibold text-[12px] sm:text-[14px] px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-lg transition-all duration-150 whitespace-nowrap no-underline">Log In</a>
            <a href="#signin" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card2)] font-semibold text-[12px] sm:text-[14px] px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-lg transition-all duration-150 whitespace-nowrap no-underline">Sign In</a>
          </div>
        </div>
      </div>

      {/* Mobile Search input drawer (when toggled on mobile) */}
      {mobileSearchOpen && (
        <div className="sm:hidden px-4 py-2.5 border-t border-[var(--border)] bg-[var(--bg-card)]">
          <div className="flex items-center gap-2 bg-[var(--bg-card2)] border border-[var(--border)] rounded-full px-3 py-1.5">
            <span className="text-[var(--text-muted)] text-[13px]">🔎</span>
            <input
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchValue.trim()) {
                  const query = searchValue.trim().toLowerCase();
                  const allTools = [...PDF_TOOLS, ...VIDEO_TOOLS, ...IMAGE_TOOLS, ...AUDIO_TOOLS, ...SOCIAL_TOOLS, ...MORE_TOOLS];
                  const match = allTools.find(([, name]) => name.toLowerCase().includes(query));
                  if (match) {
                    router.push(match[1] === "Edit PDF" ? "/editor" : `/tools?tool=${encodeURIComponent(match[1])}`);
                    onSearchChange("");
                    setMobileSearchOpen(false);
                  }
                }
              }}
              placeholder="Search tools..."
              className="border-none bg-transparent outline-none text-[13px] text-[var(--text-primary)] w-full font-inherit"
              autoFocus
            />
            {searchValue.trim() && (
              <button onClick={() => onSearchChange("")} className="text-[12px] text-[var(--text-muted)] bg-transparent border-none">✕</button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu (iPhone / Android / Small Tablet) */}
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

          <div className="h-px bg-[var(--border)] my-2" />

          <div className="flex gap-2 pt-1 pb-2">
            <a href="#login" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-2 text-[14px] font-semibold rounded-xl border border-[var(--border)] text-[var(--text-primary)] bg-[var(--bg-card2)] no-underline">Log In</a>
            <a href="#signin" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-2 text-[14px] font-semibold rounded-xl border border-[var(--border)] text-[var(--text-primary)] bg-[var(--bg-card2)] no-underline">Sign In</a>
          </div>
        </div>
      )}
    </nav>
  );
}

function Hero({ dark }: { dark: boolean }) {
  return (
    <section
      id="home"
      className="relative overflow-hidden px-4 pt-6 pb-10 sm:px-8 sm:pt-14 sm:pb-14"
      style={{
        background: dark
          ? "linear-gradient(135deg, #0c0e1a 0%, #110d2a 50%, #1a0d1f 100%)"
          : "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #fff7ed 100%)",
      }}
    >
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-14 relative z-10 w-full px-1 sm:px-0">
        <div className="w-full flex-1 max-w-[620px] flex flex-col items-start text-left">
          <h1 className="w-full text-[clamp(32px,5.5vw,56px)] font-black leading-[1.12] tracking-tight mb-4 text-[var(--text-primary)] text-left">
            All Your Files.<br />
            <span className="text-[#2563eb]">One Place.</span>
          </h1>

          <p className="w-full text-[15px] sm:text-[18px] text-[var(--text-secondary)] leading-relaxed mb-6 text-left">
            Convert, edit, compress and manage your PDF, video, image, audio and more — fast, secure, and packed with our Canva-style document studio.
          </p>

          {/* Action CTAs: Full width horizontal layout */}
          <div className="flex flex-row items-center justify-center md:justify-start gap-3 sm:gap-4 mb-7 w-full">
            <a
              href="/editor"
              className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white font-bold text-[14px] sm:text-[16px] shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.01] active:scale-98 transition-all no-underline whitespace-nowrap"
            >
              <Sparkles size={17} className="shrink-0" />
              <span>Canva PDF Editor</span>
            </a>
            <a
              href="/workflow"
              className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3.5 rounded-xl bg-white dark:bg-white/10 hover:bg-gray-50 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 font-bold text-[14px] sm:text-[16px] shadow-xs hover:scale-[1.01] active:scale-98 transition-all no-underline whitespace-nowrap"
            >
              <SlidersHorizontal size={16} className="shrink-0" />
              <span>Custom Workflows</span>
            </a>
          </div>

          {/* Three Feature Badges: Full width horizontal single line strip */}
          <div className="flex flex-row items-center justify-between w-full py-3 px-4 sm:px-6 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-md border border-[var(--border)] shadow-xs">
            <div className="flex flex-1 items-center justify-center sm:justify-start gap-2 px-1">
              <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <ShieldCheck size={16} />
              </div>
              <div className="min-w-0 text-left">
                <div className="text-[12px] sm:text-[13px] font-extrabold text-[var(--text-primary)] leading-tight whitespace-nowrap">100% Secure</div>
                <div className="text-[10px] sm:text-[11px] text-[var(--text-secondary)] whitespace-nowrap">Your files are safe</div>
              </div>
            </div>

            <div className="w-px h-7 bg-[var(--border)] shrink-0 mx-2" />

            <div className="flex flex-1 items-center justify-center sm:justify-start gap-2 px-1">
              <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Zap size={16} />
              </div>
              <div className="min-w-0 text-left">
                <div className="text-[12px] sm:text-[13px] font-extrabold text-[var(--text-primary)] leading-tight whitespace-nowrap">Super Fast</div>
                <div className="text-[10px] sm:text-[11px] text-[var(--text-secondary)] whitespace-nowrap">Instant processing</div>
              </div>
            </div>

            <div className="w-px h-7 bg-[var(--border)] shrink-0 mx-2" />

            <div className="flex flex-1 items-center justify-center sm:justify-start gap-2 px-1">
              <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Sparkles size={16} />
              </div>
              <div className="min-w-0 text-left">
                <div className="text-[12px] sm:text-[13px] font-extrabold text-[var(--text-primary)] leading-tight whitespace-nowrap">Free to Use</div>
                <div className="text-[10px] sm:text-[11px] text-[var(--text-secondary)] whitespace-nowrap">No installation</div>
              </div>
            </div>
          </div>

          {/* MINIMIZED INLINE GRAPHIC FOR MOBILE: strictly bounded inside the text area */}
          <div className="flex md:hidden items-center justify-center w-full mt-5 py-2">
            <div className="relative flex items-center justify-center w-[160px] h-[130px]">
              <img src="/app-icon.png" alt="VPDFX Emblem" className="max-w-[70%] max-h-[70%] object-contain relative z-10 drop-shadow-xl" />
              
              <div className="absolute top-[4%] left-[4%] w-8 h-8 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-[var(--border)] flex items-center justify-center z-20 animate-[floatA_4.5s_ease-in-out_infinite]">
                <div className="bg-[#ef4444] text-white w-5 h-5 rounded flex items-center justify-center text-[7px] font-black tracking-tight">PDF</div>
              </div>
              
              <div className="absolute bottom-[6%] left-[2%] w-8 h-8 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-[var(--border)] flex items-center justify-center z-20 animate-[floatB_5s_ease-in-out_infinite_1s]">
                <span className="text-[14px]">📄</span>
              </div>
              
              <div className="absolute top-[6%] right-[4%] w-8 h-8 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-[var(--border)] flex items-center justify-center z-20 animate-[floatB_4.2s_ease-in-out_infinite_0.5s]">
                <div className="bg-[#8b5cf6] text-white w-5 h-5 rounded flex items-center justify-center text-[10px]">🎥</div>
              </div>
              
              <div className="absolute bottom-[6%] right-[2%] w-8 h-8 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-[var(--border)] flex items-center justify-center z-20 animate-[floatA_5.2s_ease-in-out_infinite_1.5s]">
                <div className="bg-[#10b981] text-white w-5 h-5 rounded flex items-center justify-center text-[11px]">🖼️</div>
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP FLOATING GRAPHIC (right side on md screens) */}
        <div className="hidden md:flex flex-1 flex-col justify-center items-center relative w-full max-w-[420px]">
          <div className="relative justify-center items-center w-[220px] h-[220px] md:w-[260px] md:h-[260px] flex">
            <img src="/app-icon.png" alt="VPDFX Graphic" className="max-w-[72%] max-h-[72%] object-contain relative z-10 drop-shadow-2xl" />
            
            <div className="absolute top-[2%] left-[4%] w-11 h-11 bg-white dark:bg-slate-800 rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.08)] border border-[var(--border)] flex items-center justify-center z-20 animate-[floatA_5.5s_ease-in-out_infinite]">
              <div className="bg-[#ef4444] text-white w-6 h-6 rounded flex items-center justify-center text-[8px] font-black tracking-tight">PDF</div>
            </div>
            
            <div className="absolute bottom-[2%] left-[0%] w-11 h-11 bg-white dark:bg-slate-800 rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.08)] border border-[var(--border)] flex items-center justify-center z-20 animate-[floatB_6.5s_ease-in-out_infinite_1s]">
              <div className="text-[20px]">📄</div>
            </div>
            
            <div className="absolute top-[8%] right-[4%] w-11 h-11 bg-white dark:bg-slate-800 rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.08)] border border-[var(--border)] flex items-center justify-center z-20 animate-[floatB_5s_ease-in-out_infinite_0.5s]">
              <div className="bg-[#8b5cf6] text-white w-7 h-7 rounded flex items-center justify-center text-[13px]">🎥</div>
            </div>
            
            <div className="absolute top-[48%] right-[-2%] w-11 h-11 bg-white dark:bg-slate-800 rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.08)] border border-[var(--border)] flex items-center justify-center z-20 animate-[floatA_6s_ease-in-out_infinite_1.5s]">
              <div className="bg-[#10b981] text-white w-7 h-7 rounded flex items-center justify-center text-[14px]">🖼️</div>
            </div>
            
            <div className="absolute bottom-[4%] right-[10%] w-11 h-11 bg-white dark:bg-slate-800 rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.08)] border border-[var(--border)] flex items-center justify-center z-20 animate-[floatA_7.5s_ease-in-out_infinite_0.2s]">
              <div className="text-[#3b82f6] text-[20px] font-black">〰️</div>
            </div>
            
            <div className="absolute w-[130%] h-[130%] bg-[radial-gradient(circle,rgba(59,130,246,0.12)_0%,rgba(255,255,255,0)_70%)] top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ToolPanel({ id, title, emoji, iconBg, color, tools, onSelectTool, searchValue }: { id: string; title: string; emoji: string; iconBg: string; color: string; tools: string[][]; onSelectTool: (tool: string) => void; searchValue: string }) {
  const visibleTools = tools.filter(([, name]) => !searchValue || name.toLowerCase().includes(searchValue.toLowerCase()));

  return (
    <div id={id} className="p-6 bg-white border border-[#e2e8f0] rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] scroll-mt-[100px]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-[42px] h-[42px] rounded-[10px] text-[20px] flex items-center justify-center opacity-90" style={{ background: iconBg }}>{emoji}</div>
          <span className="font-bold text-[17px] text-[#0f172a]">{title}</span>
        </div>
        <a href={`/category/${id}`} className="text-[13px] py-1.5 px-4 border border-[#c7d2fe] rounded-full font-semibold text-[#4f46e5] hover:bg-[#e0e7ff] transition-all">View All ↗</a>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        {visibleTools.map(([icon, name]) => (
          <button key={name} type="button" onClick={() => onSelectTool(name)} className="flex items-center gap-3 py-1 text-[14.5px] font-medium text-[#475569] hover:text-[#4f46e5] transition-all cursor-pointer bg-transparent border-none w-full text-left">
            <span className="text-[18px] grayscale-[0.2]">{icon}</span>
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">{name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function FeaturesStrip() {
  return (
    <div className="bg-[var(--bg-card)] border-t border-b border-[var(--border)] py-10 px-6 py-6 sm:py-10 bg-[var(--bg-card)] border-t border-[var(--border)] mt-6 sm:mt-12 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex flex-row sm:grid sm:grid-cols-5 gap-4 sm:gap-7 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 snap-x snap-mandatory hide-scrollbar">
          {FEATURES.map((feature) => (
            <div key={feature.label} className="flex flex-col items-center gap-1.5 sm:gap-2.5 text-center min-w-[120px] sm:min-w-0 snap-center shrink-0">
              <div className="w-10 h-10 sm:w-[54px] sm:h-[54px] rounded-full bg-[var(--bg-card2)] border-[1.5px] border-[var(--border)] flex items-center justify-center text-[16px] sm:text-[22px]">
                {feature.emoji}
              </div>
              <div className="font-bold text-[11px] sm:text-[13px] text-[var(--text-primary)] leading-tight">{feature.label}</div>
              <div className="text-[10px] sm:text-[12px] text-[var(--text-muted)]">{feature.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Footer({ dark }: { dark: boolean }) {
  return (
    <footer style={{ background: "var(--bg)", borderTop: "1px solid var(--border)", padding: "52px 24px 28px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 36, marginBottom: 40 }}>
          <div style={{ maxWidth: 300 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <img src={dark ? "/image-dark.png" : "/image copy.png"} alt="VPDFX" style={{ height: 44, objectFit: "contain" }} />
            </div>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.75 }}>The all-in-one platform for all your file conversion, editing and download needs.</p>
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              {["𝕏", "📘", "📷", "💬"].map((icon) => (
                <button key={icon} style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-primary)", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 80, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginBottom: 18 }}>Solutions</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <a href="#" style={{ fontSize: 14, color: "var(--text-secondary)", textDecoration: "none" }}>PDF Editing</a>
                <a href="#" style={{ fontSize: 14, color: "var(--text-secondary)", textDecoration: "none" }}>Video Conversion</a>
                <a href="#" style={{ fontSize: 14, color: "var(--text-secondary)", textDecoration: "none" }}>Image Processing</a>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginBottom: 18 }}>Company</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <a href="#" style={{ fontSize: 14, color: "var(--text-secondary)", textDecoration: "none" }}>About Us</a>
                <a href="#" style={{ fontSize: 14, color: "var(--text-secondary)", textDecoration: "none" }}>Contact</a>
                <a href="#" style={{ fontSize: 14, color: "var(--text-secondary)", textDecoration: "none" }}>Pricing</a>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>© 2026 VPDFX. All rights reserved.</p>
          <div style={{ display: "flex", gap: 20 }}>
            {['Privacy Policy', 'Terms', 'Cookies'].map((link) => (
              <a key={link} href="#" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none" }}>{link}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  const [dark, setDark] = useState(false);
  const [tab, setTab] = useState<Tab>("link");
  const [url, setUrl] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState("PDF to Word");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [quickTools, setQuickTools] = useState<string[]>(["Text to PDF", "Add Page Numbers", "Sign PDF", "Merge PDF", "Split PDF"]);
  const [isEditingQuickTools, setIsEditingQuickTools] = useState(false);

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

  function handleContinue() {
    const trimmed = url.trim();
    if (!trimmed) {
      setStatusMessage("Paste a public link to continue.");
      return;
    }

    try {
      const parsed = new URL(trimmed);
      if (!parsed.protocol.startsWith("http")) {
        throw new Error("Unsupported protocol");
      }
      setSelectedTool("Link conversion");
      setStatusMessage(`Ready to process: ${parsed.hostname}${parsed.pathname}`);
    } catch {
      setStatusMessage("Please enter a valid URL beginning with https:// or http://.");
    }
  }

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) {
      setUploadedFiles([]);
      return;
    }

    const names = files.map((file) => file.name);
    setUploadedFiles(names);
    setSelectedTool(names[0]);
    setStatusMessage(`${names.length} file${names.length > 1 ? "s" : ""} ready to process.`);
    setTab("upload");
  }

  function selectTool(toolName: string) {
    setSelectedTool(toolName);
    setStatusMessage(`${toolName} is ready to use.`);
    setSearchValue("");
  }

  const router = useRouter();

  function handleToolActivate(toolName: string) {
    selectTool(toolName);
    if (toolName === "Edit PDF") {
      router.push("/editor");
    } else {
      router.push(`/tools?tool=${encodeURIComponent(toolName)}`);
    }
  }

  const visibleTools = TOOL_LIBRARY.filter((tool) => {
    const query = searchValue.trim().toLowerCase();
    return !query || tool.name.toLowerCase().includes(query) || tool.category.toLowerCase().includes(query);
  });

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar dark={dark} onToggle={toggleDark} searchValue={searchValue} onSearchChange={setSearchValue} />

      <main style={{ flex: 1 }}>
        <Hero dark={dark} />

        <section id="tools" style={{ padding: "60px 24px", maxWidth: 1280, margin: "0 auto" }}>
          
          {/* Custom Workflows Banner (Above Popular Tools) */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--r-lg)] shadow-[var(--sh-md)] transition-all duration-250 hover:-translate-y-1 hover:shadow-[var(--sh-xl)] hover:border-indigo-500/25 p-4 sm:p-6 mb-8 sm:mb-10 flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between flex-wrap gap-4">
              <div className="flex-1">
                <div className="text-[10px] sm:text-[12px] font-bold text-[var(--text-muted)] uppercase tracking-wide mb-1 sm:mb-1.5">Custom Workflows</div>
                <div className="text-[16px] sm:text-[20px] font-extrabold text-[var(--text-primary)] leading-tight">Chain tools together into one powerful workflow.</div>
                <div className="text-[12px] sm:text-[14px] text-[var(--text-secondary)] mt-1 sm:mt-1.5">Example: Text to PDF ➔ Watermark ➔ Sign ➔ Add Page Numbers</div>
              </div>
              
              <a href="/workflow" className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 rounded-full bg-gradient-to-br from-[#ef4444] to-[#f97316] text-white no-underline font-bold text-[13px] sm:text-[15px] shadow-[0_4px_14px_rgba(239,68,68,0.3)] hover:scale-[1.02] transition-transform shrink-0">
                <span className="text-[16px] sm:text-[18px]">⚙️</span> Create Custom Workflow
              </a>
            </div>
            
            <div className="h-px bg-[var(--border)] my-1 sm:my-2" />
            
            <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
              <div className="text-[10px] sm:text-[12px] font-bold text-[var(--text-muted)] uppercase flex items-center mr-1 sm:mr-2">Or use quick tools:</div>
              
              {isEditingQuickTools ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "8px", background: "var(--bg-card2)", borderRadius: 12, border: "1px dashed var(--border)", width: "100%" }}>
                  <div style={{ width: "100%", fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>Select up to 6 tools to show here:</div>
                  {TOOL_LIBRARY.map(tool => {
                    const isSelected = quickTools.includes(tool.name);
                    return (
                      <button
                        key={tool.name}
                        onClick={() => {
                          if (isSelected) {
                            setQuickTools(quickTools.filter(t => t !== tool.name));
                          } else if (quickTools.length < 6) {
                            setQuickTools([...quickTools, tool.name]);
                          }
                        }}
                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 999, border: `1px solid ${isSelected ? "var(--accent)" : "var(--border)"}`, background: isSelected ? "rgba(79,70,229,0.1)" : "var(--bg)", color: isSelected ? "var(--accent)" : "var(--text-primary)", fontWeight: 600, fontSize: 12, cursor: "pointer" }}
                      >
                        {tool.icon} {tool.name} {isSelected && "✓"}
                      </button>
                    )
                  })}
                  <button onClick={() => setIsEditingQuickTools(false)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 16px", borderRadius: 999, border: "none", background: "var(--accent)", color: "white", fontWeight: 700, fontSize: 12, cursor: "pointer", marginLeft: "auto" }}>
                    Done
                  </button>
                </div>
              ) : (
                <>
                  {quickTools.map(toolName => {
                    const tool = TOOL_LIBRARY.find(t => t.name === toolName);
                    if (!tool) return null;
                    return (
                      <a key={tool.name} href={`/tools?tool=${encodeURIComponent(tool.name)}`} className="inline-flex items-center gap-1.5 py-2.5 px-5.5 bg-transparent text-[var(--accent)] border-2 border-[rgba(79,70,229,0.3)] rounded-full font-semibold text-[13px] transition-all duration-200 whitespace-nowrap hover:bg-indigo-500/10 hover:border-[var(--accent)] flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full border border-[var(--border)] no-underline text-[var(--text-primary)] font-semibold text-[11px] sm:text-[13px]">
                        {tool.icon} {tool.name}
                      </a>
                    );
                  })}
                  <button onClick={() => setIsEditingQuickTools(true)} className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full border border-dashed border-[var(--text-muted)] bg-transparent text-[var(--text-secondary)] font-semibold text-[11px] sm:text-[13px] cursor-pointer hover:bg-[var(--bg-hover)]">
                    ⚙️ Edit
                  </button>
                </>
              )}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 30 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>Popular Tools</h2>
            <a href="#tools" className="inline-flex items-center gap-1.5 py-2.5 px-5.5 bg-transparent text-[var(--accent)] border-2 border-[rgba(79,70,229,0.3)] rounded-full font-semibold text-[13px] transition-all duration-200 whitespace-nowrap hover:bg-indigo-500/10 hover:border-[var(--accent)]" style={{ borderRadius: 999, border: "1px solid rgba(79,70,229,.3)", color: "var(--accent)" }}>View All Tools</a>
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <ToolPanel id="pdf" title="PDF Tools" emoji="📄" iconBg="#fff1f1" color="#ef4444" tools={PDF_TOOLS} onSelectTool={handleToolActivate} searchValue={searchValue} />
            <ToolPanel id="video" title="Video Tools" emoji="🎬" iconBg="#faf5ff" color="#a855f7" tools={VIDEO_TOOLS} onSelectTool={handleToolActivate} searchValue={searchValue} />
            <ToolPanel id="audio" title="Audio Tools" emoji="🎵" iconBg="#fdf4ff" color="#d946ef" tools={AUDIO_TOOLS} onSelectTool={handleToolActivate} searchValue={searchValue} />
            <ToolPanel id="image" title="Image Tools" emoji="🖼️" iconBg="#fffbeb" color="#f59e0b" tools={IMAGE_TOOLS} onSelectTool={handleToolActivate} searchValue={searchValue} />
            <ToolPanel id="social" title="Social Media Tools" emoji="📱" iconBg="#eff6ff" color="#3b82f6" tools={SOCIAL_TOOLS} onSelectTool={handleToolActivate} searchValue={searchValue} />
            <ToolPanel id="more" title="More Tools" emoji="✨" iconBg="#f0fdf4" color="#22c55e" tools={MORE_TOOLS} onSelectTool={handleToolActivate} searchValue={searchValue} />
          </div>

          {visibleTools.length > 0 && searchValue && (
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--r-lg)] shadow-[var(--sh-md)] transition-all duration-250 hover:-translate-y-1 hover:shadow-[var(--sh-xl)] hover:border-indigo-500/25" style={{ marginTop: 20, padding: 20 }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 12 }}>Matching tools</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {visibleTools.slice(0, 6).map((tool) => (
                  <button key={tool.name} type="button" onClick={() => handleToolActivate(tool.name)} style={{ border: "1px solid var(--border)", background: "var(--bg-card2)", borderRadius: 999, padding: "10px 14px", fontSize: 13, fontWeight: 700, color: "var(--text-primary)", cursor: "pointer" }}>
                    {tool.icon} {tool.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <FeaturesStrip />
      <Footer dark={dark} />
    </div>
  );
}
