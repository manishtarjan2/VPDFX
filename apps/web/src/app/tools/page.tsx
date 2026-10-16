"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const TOOL_LIBRARY = [
  { icon: "📄", name: "PDF to Word", category: "pdf", description: "Convert PDFs to editable Word documents." },
  { icon: "📑", name: "PDF to Text", category: "pdf", description: "Extract text from PDF files." },
  { icon: "📝", name: "Text to PDF", category: "pdf", description: "Create a PDF from text content." },
  { icon: "📷", name: "Image to PDF", category: "image", description: "Convert JPG or PNG to PDF." },
  { icon: "🔀", name: "Merge PDF", category: "pdf", description: "Combine multiple PDFs." },
  { icon: "✂️", name: "Split PDF", category: "pdf", description: "Split a PDF into sections." },
  { icon: "🔄", name: "Rotate PDF", category: "pdf", description: "Rotate PDF pages 90 degrees." },
  { icon: "💧", name: "Watermark PDF", category: "pdf", description: "Stamp a watermark on your PDF." },
  { icon: "✍️", name: "Sign PDF", category: "pdf", description: "Add your signature to a PDF." },
  { icon: "🔢", name: "Add Page Numbers", category: "pdf", description: "Insert page numbers into a PDF." },
  { icon: "🎨", name: "Edit PDF", category: "pdf", description: "Manually edit your PDF text, images, and pages fast." },
  { icon: "🎥", name: "YouTube", category: "social", description: "Download YouTube videos and audio." },
  { icon: "💼", name: "LinkedIn", category: "social", description: "Download LinkedIn videos and posts." },
  { icon: "📸", name: "Instagram", category: "social", description: "Download Instagram Reels, Stories, Photos & Albums." },
  { icon: "📌", name: "Pinterest", category: "social", description: "Download Pinterest videos and images." },
  { icon: "👥", name: "Facebook", category: "social", description: "Download Facebook videos." },
  { icon: "🤖", name: "Reddit", category: "social", description: "Download Reddit videos." },
  { icon: "🎵", name: "TikTok", category: "social", description: "Download TikTok videos without watermark." },
  { icon: "👻", name: "Snapchat", category: "social", description: "Download Snapchat stories." },
  { icon: "🐦", name: "Twitter (X)", category: "social", description: "Download Twitter videos and gifs." },
  { icon: "✨", name: "More Platforms", category: "social", description: "Download from more platforms." },
  { icon: "🎵", name: "Video to MP3", category: "video", description: "Extract audio from your videos." },
  { icon: "🎬", name: "Video to MP4", category: "video", description: "Convert your video to MP4." },
  { icon: "🗜️", name: "Compress Video", category: "video", description: "Reduce your video file size." },
  { icon: "✂️", name: "Trim Video", category: "video", description: "Cut or trim a video file." },
  { icon: "📐", name: "Resize Video", category: "video", description: "Change video dimensions." },
  { icon: "🔄", name: "Change Format", category: "video", description: "Convert video to another format." },
  { icon: "🎞️", name: "Extract Frames", category: "video", description: "Get image frames from video." },
  { icon: "👾", name: "Video to GIF", category: "video", description: "Convert a video to a GIF animation." },
  { icon: "📏", name: "Change Resolution", category: "video", description: "Change video resolution." },
  { icon: "🔀", name: "Merge Videos", category: "video", description: "Combine multiple videos." },
  { icon: "🖼️", name: "JPG to PNG", category: "image", description: "Convert JPG images to PNG." },
  { icon: "🖼️", name: "PNG to JPG", category: "image", description: "Convert PNG images to JPG." },
  { icon: "🧩", name: "WebP to JPG", category: "image", description: "Convert WebP images to JPG." },
  { icon: "📐", name: "Resize Image", category: "image", description: "Resize an image." },
  { icon: "🗜️", name: "Compress Image", category: "image", description: "Compress an image file size." },
  { icon: "✂️", name: "Crop Image", category: "image", description: "Crop an image." },
  { icon: "🎨", name: "Edit Image", category: "image", description: "Edit image with text, drawings, filters, and shapes." },
  { icon: "🔄", name: "Rotate Image", category: "image", description: "Rotate an image." },
  { icon: "🧹", name: "Remove BG", category: "image", description: "Remove image background." },
  { icon: "🔤", name: "Image to Text", category: "image", description: "Extract text from an image." },
  { icon: "🎵", name: "Audio to MP3", category: "audio", description: "Convert audio formats to MP3." },
  { icon: "✂️", name: "Trim Audio", category: "audio", description: "Cut audio files." },
  { icon: "🔊", name: "Volume Booster", category: "audio", description: "Boost the volume of audio." },
  { icon: "📝", name: "Word to PDF", category: "pdf", description: "Convert Word documents to PDF." },
  { icon: "📊", name: "Excel to PDF", category: "pdf", description: "Convert Excel sheets to PDF." },
  { icon: "🔒", name: "Protect PDF", category: "pdf", description: "Add a password to your PDF." },
];

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

function formatSecondsToTime(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds || 0));
  const hrs = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function parseTimeToSeconds(timeStr: string): number {
  const parts = timeStr.trim().split(':').map(Number);
  if (parts.length === 3) {
    return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
  }
  if (parts.length === 2) {
    return (parts[0] || 0) * 60 + (parts[1] || 0);
  }
  return Number(timeStr) || 0;
}

export default function ToolWorkspacePage() {
  const router = useRouter();
  const [selectedTool, setSelectedTool] = useState<string>("PDF to Word");
  const [search, setSearch] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [splitRanges, setSplitRanges] = useState([{ id: 1, from: 1, to: 2 }]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState("best");

  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [watermarkPos, setWatermarkPos] = useState("Center");
  const [pageNumberPos, setPageNumberPos] = useState("Bottom-Center");
  const [pageNumberFormat, setPageNumberFormat] = useState("page_n_of_m");
  const [signatureText, setSignatureText] = useState("");
  const [signaturePos, setSignaturePos] = useState("Bottom-Right");
  const [signatureType, setSignatureType] = useState("text");
  const [signatureImage, setSignatureImage] = useState<File | null>(null);
  const [pdfPassword, setPdfPassword] = useState("");

  // Video Options
  const [trimStart, setTrimStart] = useState("00:00:00");
  const [trimEnd, setTrimEnd] = useState("00:00:10");
  const [extractTime, setExtractTime] = useState("00:00:01");
  const [compressLevel, setCompressLevel] = useState("Medium");
  const [videoResolution, setVideoResolution] = useState("1280x720");
  const [videoFormat, setVideoFormat] = useState("mp4");
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [capturedFrameUrl, setCapturedFrameUrl] = useState<string | null>(null);
  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);

  interface SocialMediaItem {
    id: string;
    index: number;
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
    title?: string;
  }

  const [socialPreview, setSocialPreview] = useState<{
    title: string;
    thumbnail: string;
    mediaType?: 'image' | 'video' | 'carousel' | 'mixed';
    itemsCount?: number;
    items?: SocialMediaItem[];
  } | null>(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number>(0);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

  // Image Options
  const [cropRatio, setCropRatio] = useState("Free");
  const [cropWidth, setCropWidth] = useState("400");
  const [cropHeight, setCropHeight] = useState("400");
  const [cropLeft, setCropLeft] = useState("100");
  const [cropTop, setCropTop] = useState("100");
  const [imageDims, setImageDims] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Extended Image & Edit Options
  const [resizeWidth, setResizeWidth] = useState("800");
  const [resizeHeight, setResizeHeight] = useState("600");
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [compressQuality, setCompressQuality] = useState(75);
  const [rotateAngle, setRotateAngle] = useState(90);
  const [filterMode, setFilterMode] = useState("normal");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blurVal, setBlurVal] = useState(0);
  const [overlayText, setOverlayText] = useState("");
  const [textColor, setTextColor] = useState("#ffffff");
  const [textSize, setTextSize] = useState(36);
  const [pdfOrientation, setPdfOrientation] = useState<"portrait" | "landscape">("portrait");
  const [pdfMargin, setPdfMargin] = useState<"none" | "small" | "large">("small");
  const [extractedOcrText, setExtractedOcrText] = useState("");
  const [copiedText, setCopiedText] = useState(false);

  const [dark, setDark] = useState(false);

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

  function captureFrameFromVideo(downloadDirectly = false) {
    if (!videoPlayerRef.current) return;
    const video = videoPlayerRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
        setCapturedFrameUrl(dataUrl);

        const curTimeStr = formatSecondsToTime(video.currentTime);
        setExtractTime(curTimeStr);

        if (downloadDirectly) {
          const a = document.createElement("a");
          a.href = dataUrl;
          const cleanName = (files[0]?.name || "video").replace(/\.[^/.]+$/, "");
          a.download = `frame_${cleanName}_${curTimeStr.replace(/:/g, "-")}.jpg`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          setMessage(`Success! Frame captured at ${curTimeStr} and downloaded.`);
        }
      }
    } catch (err) {
      console.warn("Client side frame capture note:", err);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const toolName = params.get("tool");
    const categoryName = params.get("category");

    if (toolName) {
      setSelectedTool(decodeURIComponent(toolName));
    } else if (categoryName) {
      const firstInCategory = TOOL_LIBRARY.find(t => t.category === categoryName);
      if (firstInCategory) {
        setSelectedTool(firstInCategory.name);
      }
    }
  }, []);

  const currentTool = TOOL_LIBRARY.find((tool) => tool.name === selectedTool) ?? TOOL_LIBRARY[0];

  const filteredTools = useMemo(() => {
    let tools = TOOL_LIBRARY;

    // Then apply text search if it exists
    const query = search.trim().toLowerCase();
    if (query) {
      tools = tools.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query),
      );
    }
    return tools;
  }, [search, currentTool.category]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
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
            {[
              { label: "Home", href: "/" },
              { label: "PDF", href: "/category/pdf" },
              { label: "Canva", href: "/editor" },
              { label: "Video", href: "/category/video" },
              { label: "Audio", href: "/category/audio" },
              { label: "Image", href: "/category/image" },
              { label: "Social", href: "/category/social" },
              { label: "More", href: "/category/more" },
            ].map((link) => (
              <a key={link.label} href={link.href} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card2)] font-semibold px-2.5 lg:px-3 py-1.5 text-[13px] lg:text-[15px] rounded-lg transition-all whitespace-nowrap no-underline">{link.label}</a>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative hidden sm:flex items-center gap-2 bg-[var(--bg-card2)] border-[1.5px] border-[var(--border)] rounded-full px-3.5 py-1.5 w-[140px] md:w-[190px] focus-within:border-[var(--accent)]">
              <span className="text-[var(--text-muted)] text-[13px]">🔎</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search tools..." className="border-none bg-transparent outline-none text-[13px] text-[var(--text-primary)] w-full font-inherit" />
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
            {[
              { label: "Home", href: "/" },
              { label: "PDF", href: "/category/pdf" },
              { label: "Canva", href: "/editor" },
              { label: "Video", href: "/category/video" },
              { label: "Audio", href: "/category/audio" },
              { label: "Image", href: "/category/image" },
              { label: "Social", href: "/category/social" },
              { label: "More", href: "/category/more" },
            ].map((link) => (
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

      <main style={{ flex: 1, background: "linear-gradient(180deg,#f5f7ff 0%,#eef2ff 100%)", color: "#0f172a" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px" }}>
          <div className="flex flex-col sm:flex-row items-center sm:justify-center relative gap-4 mb-8 sm:mb-10 text-center">
            <button
              type="button"
              onClick={() => {
                const cat = currentTool?.category || "pdf";
                router.push(`/category/${cat}`);
              }}
              className="sm:absolute sm:left-0 sm:top-1/2 sm:-translate-y-1/2 inline-flex items-center gap-1.5 py-2 px-4 bg-transparent text-[var(--accent)] border border-[rgba(79,70,229,0.3)] rounded-full font-semibold text-[13px] transition-all hover:bg-indigo-500/10 hover:border-[var(--accent)] cursor-pointer self-start sm:self-auto"
            >
              <span className="text-[15px]">←</span> Back
            </button>
            <div>
              <h1 className="m-0 text-[26px] sm:text-[34px] md:text-[42px] font-extrabold text-[var(--text-primary)] leading-tight">{currentTool.name}</h1>
              <p className="mt-2 text-[14px] sm:text-[17px] md:text-[19px] text-[var(--text-secondary)] max-w-[600px] mx-auto">{currentTool.description}</p>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            {currentTool.category === 'social' ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  maxWidth: 800,
                  minHeight: 350,
                  background: "#eff6ff",
                  border: "2px solid #bfdbfe",
                  borderRadius: 16,
                  padding: 40
                }}
              >
                <div style={{ fontSize: 52, marginBottom: 12 }}>{currentTool.icon}</div>
                <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8, color: "#1e3a8a" }}>Download {currentTool.name} Media</h2>
                <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24, textAlign: "center", maxWidth: 580 }}>
                  {currentTool.name === 'Instagram'
                    ? "Download Instagram Reels, Stories, Photos, and Multi-Image Carousel Posts in original Full HD quality or MP3 audio."
                    : `Enter any public ${currentTool.name} post, video, reel, or short link to fetch and download high quality video, photo, or MP3 audio.`
                  }
                </p>

                <div style={{ display: "flex", width: "100%", maxWidth: 650, gap: 12 }}>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder={
                      currentTool.name === 'YouTube' ? 'https://www.youtube.com/watch?v=... or https://youtu.be/...' :
                      currentTool.name === 'Instagram' ? 'Paste Instagram Reel, Story, Photo, or Carousel link (e.g. /reel/..., /p/...)' :
                      currentTool.name === 'TikTok' ? 'https://www.tiktok.com/@user/video/...' :
                      currentTool.name === 'Twitter (X)' ? 'https://x.com/user/status/...' :
                      currentTool.name === 'Pinterest' ? 'https://pin.it/... or https://pinterest.com/pin/...' :
                      currentTool.name === 'LinkedIn' ? 'https://www.linkedin.com/posts/...' :
                      currentTool.name === 'Facebook' ? 'https://www.facebook.com/watch/?v=...' :
                      currentTool.name === 'Reddit' ? 'https://www.reddit.com/r/.../comments/...' :
                      'https://...'
                    }
                    style={{ flex: 1, padding: "16px 20px", fontSize: 15, borderRadius: 12, border: "2px solid #bfdbfe", outline: "none", color: "#334155", background: "white" }}
                  />

                  <button
                    onClick={async () => {
                      if (!url.trim()) {
                        setMessage("Please enter a valid URL.");
                        return;
                      }

                      try {
                        setIsLoading(true);
                        const formData = new FormData();
                        formData.append("tool", currentTool.name);
                        formData.append("url", url.trim());
                        formData.append("format", format);
                        formData.append("files", new Blob(["dummy"], { type: 'text/plain' }), "dummy.txt");

                        if (!socialPreview) {
                          setMessage(`Fetching media info from ${currentTool.name}...`);
                          const response = await fetch(`${API_BASE}/info`, {
                            method: "POST",
                            body: formData,
                          });

                          if (!response.ok) {
                            // If info endpoint has an issue with platform, fallback to direct download card
                            setSocialPreview({
                              title: `${currentTool.name} Media Post`,
                              thumbnail: "",
                            });
                            setMessage("Ready! Select quality and click download.");
                            return;
                          }

                          const info = await response.json();
                          setSocialPreview(info);
                          setMessage(info.mediaType === 'image' || info.mediaType === 'carousel' ? "Ready! Download full HD photo or album." : "Select quality and download.");
                        }
                      } catch (err: any) {
                        // Resilient fallback so users can always proceed to download
                        setSocialPreview({
                          title: `${currentTool.name} Media Post`,
                          thumbnail: "",
                        });
                        setMessage("Ready! Choose your format and download.");
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    disabled={isLoading || !!socialPreview}
                    style={{ background: "#2563eb", color: "white", padding: "0 32px", fontSize: 16, fontWeight: 700, borderRadius: 12, border: "none", cursor: (isLoading || socialPreview) ? "not-allowed" : "pointer", opacity: (isLoading || socialPreview) ? 0.6 : 1, boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)" }}
                  >
                    {isLoading ? "Fetching..." : "Fetch Media"}
                  </button>
                </div>

                {/* Quick Platform Quality badges */}
                <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap", justifyContent: "center" }}>
                  <span style={{ fontSize: 12, color: "#1d4ed8", background: "#dbeafe", padding: "4px 10px", borderRadius: 999, fontWeight: 700 }}>✓ Reels, Stories & Posts</span>
                  <span style={{ fontSize: 12, color: "#1d4ed8", background: "#dbeafe", padding: "4px 10px", borderRadius: 999, fontWeight: 700 }}>✓ Full HD Photos & Albums</span>
                  <span style={{ fontSize: 12, color: "#1d4ed8", background: "#dbeafe", padding: "4px 10px", borderRadius: 999, fontWeight: 700 }}>✓ 1080p Video & Audio MP3</span>
                </div>

                {socialPreview && (
                  <div style={{ marginTop: 24, padding: 24, background: "white", borderRadius: 16, border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: 20 }}>
                    {/* Header info bar */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{
                            padding: "3px 10px",
                            borderRadius: 999,
                            fontSize: 12,
                            fontWeight: 700,
                            background: socialPreview.mediaType === 'image' ? '#fef3c7' : (socialPreview.mediaType === 'carousel' ? '#e0e7ff' : '#dcfce7'),
                            color: socialPreview.mediaType === 'image' ? '#b45309' : (socialPreview.mediaType === 'carousel' ? '#4338ca' : '#15803d'),
                          }}>
                            {socialPreview.mediaType === 'carousel' ? `📑 Carousel / Album (${socialPreview.items?.length || socialPreview.itemsCount || 1} items)` : (socialPreview.mediaType === 'image' ? '🖼️ Photo / Image' : '🎬 Video / Reel')}
                          </span>
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 700, color: "#1e293b", marginTop: 4 }}>{socialPreview.title}</div>
                      </div>

                      <button onClick={() => { setSocialPreview(null); setSelectedMediaIndex(0); }} style={{ background: "none", border: "1px solid #e2e8f0", padding: "6px 14px", borderRadius: 8, color: "#64748b", fontWeight: 600, cursor: "pointer", fontSize: 12 }}>
                        ✕ Change URL
                      </button>
                    </div>

                    {/* Media Overview Gallery (when multiple items or carousel) */}
                    {socialPreview.items && socialPreview.items.length > 1 && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: "#334155" }}>
                            Overview / All Slides ({socialPreview.items.length})
                          </span>
                          <span style={{ fontSize: 12, color: "#64748b" }}>
                            Click any item to inspect or download individually
                          </span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 12 }}>
                          {socialPreview.items.map((item, idx) => {
                            const isSelected = selectedMediaIndex === idx;
                            return (
                              <div
                                key={item.id || idx}
                                onClick={() => setSelectedMediaIndex(idx)}
                                style={{
                                  position: "relative",
                                  borderRadius: 12,
                                  overflow: "hidden",
                                  cursor: "pointer",
                                  border: isSelected ? "3px solid #2563eb" : "2px solid #e2e8f0",
                                  boxShadow: isSelected ? "0 4px 14px rgba(37, 99, 235, 0.25)" : "none",
                                  transition: "all 0.15s ease",
                                  background: "#f8fafc",
                                }}
                              >
                                {item.thumbnail ? (
                                  <img src={item.thumbnail} alt={`Slide ${idx + 1}`} style={{ width: "100%", height: 110, objectFit: "cover", display: "block" }} />
                                ) : (
                                  <div style={{ width: "100%", height: 110, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, background: "#f1f5f9" }}>
                                    {item.type === 'image' ? '🖼️' : '🎬'}
                                  </div>
                                )}
                                <div style={{
                                  position: "absolute",
                                  top: 6,
                                  left: 6,
                                  background: "rgba(15, 23, 42, 0.75)",
                                  color: "white",
                                  fontSize: 10,
                                  fontWeight: 700,
                                  padding: "2px 6px",
                                  borderRadius: 6,
                                  backdropFilter: "blur(4px)",
                                }}>
                                  #{idx + 1} {item.type === 'image' ? '🖼️' : '🎬'}
                                </div>
                                {isSelected && (
                                  <div style={{
                                    position: "absolute",
                                    bottom: 6,
                                    right: 6,
                                    background: "#2563eb",
                                    color: "white",
                                    fontSize: 10,
                                    fontWeight: 700,
                                    padding: "2px 6px",
                                    borderRadius: 6,
                                  }}>
                                    ✓ Selected
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Single or Currently Selected Preview Card */}
                    <div style={{
                      display: "flex",
                      gap: 20,
                      alignItems: "center",
                      padding: 16,
                      background: "#f8fafc",
                      borderRadius: 12,
                      border: "1px solid #e2e8f0",
                      flexWrap: "wrap"
                    }}>
                      {/* Active Thumbnail */}
                      {(() => {
                        const activeItem = socialPreview.items && socialPreview.items[selectedMediaIndex];
                        const thumbSrc = activeItem?.thumbnail || socialPreview.thumbnail;
                        return thumbSrc ? (
                          <div style={{ position: "relative" }}>
                            <img src={thumbSrc} alt="Preview" style={{ width: 140, height: 100, objectFit: "cover", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }} />
                            {activeItem && (
                              <span style={{
                                position: "absolute",
                                bottom: 6,
                                left: 6,
                                background: "rgba(0,0,0,0.75)",
                                color: "white",
                                fontSize: 11,
                                fontWeight: 700,
                                padding: "2px 6px",
                                borderRadius: 4,
                              }}>
                                {activeItem.type === 'image' ? 'Photo' : 'Video'} {socialPreview.items && socialPreview.items.length > 1 ? `(${selectedMediaIndex + 1} of ${socialPreview.items.length})` : ''}
                              </span>
                            )}
                          </div>
                        ) : null;
                      })()}

                      <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, minWidth: 260 }}>
                        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                          {/* Only show video quality/resolution dropdown if active item is actually a video */}
                          {(() => {
                            const activeItem = socialPreview.items && socialPreview.items[selectedMediaIndex];
                            const isCurrentVideo = activeItem ? activeItem.type === 'video' : socialPreview.mediaType === 'video';
                            if (isCurrentVideo) {
                              return (
                                <select
                                  value={format}
                                  onChange={(e) => setFormat(e.target.value)}
                                  style={{ padding: "8px 12px", fontSize: 14, borderRadius: 8, border: "1px solid #cbd5e1", outline: "none", color: "#334155", background: "white", cursor: "pointer" }}
                                >
                                  <option value="best">Video (Highest Quality)</option>
                                  <option value="720p">Video (720p)</option>
                                  <option value="audio">Audio Only (MP3)</option>
                                </select>
                              );
                            } else {
                              return (
                                <span style={{
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color: "#047857",
                                  background: "#d1fae5",
                                  padding: "7px 14px",
                                  borderRadius: 8,
                                  border: "1px solid #a7f3d0",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6
                                }}>
                                  ✓ Original Full HD Image
                                </span>
                              );
                            }
                          })()}

                          {/* Download this specific selected item */}
                          <button
                            onClick={async () => {
                              try {
                                setIsLoading(true);
                                setMessage("Downloading selected item...");
                                const formData = new FormData();
                                formData.append("tool", currentTool.name);
                                formData.append("url", url.trim());
                                formData.append("format", format);
                                formData.append("itemIndex", selectedMediaIndex.toString());
                                formData.append("files", new Blob(["dummy"], { type: 'text/plain' }), "dummy.txt");

                                const response = await fetch(`${API_BASE}/convert`, {
                                  method: "POST",
                                  body: formData,
                                });

                                if (!response.ok) {
                                  const errText = await response.text();
                                  throw new Error(errText || "Download failed");
                                }

                                const contentLength = response.headers.get('content-length');
                                const total = contentLength ? parseInt(contentLength, 10) : 0;
                                let blob: Blob;

                                if (total > 0 && response.body) {
                                  const reader = response.body.getReader();
                                  const chunks = [];
                                  let received = 0;

                                  while (true) {
                                    const { done, value } = await reader.read();
                                    if (done) break;
                                    if (value) {
                                      chunks.push(value);
                                      received += value.length;
                                      setDownloadProgress(Math.round((received / total) * 100));
                                    }
                                  }
                                  blob = new Blob(chunks);
                                } else {
                                  blob = await response.blob();
                                }

                                const activeItem = socialPreview.items && socialPreview.items[selectedMediaIndex];
                                const isImg = activeItem?.type === 'image' || socialPreview.mediaType === 'image';
                                let downloadFilename = `downloaded_${currentTool.name.replace(/\s+/g, '_')}_${selectedMediaIndex + 1}${isImg ? '.jpg' : '.mp4'}`;
                                const disposition = response.headers.get('content-disposition');
                                if (disposition && disposition.indexOf('attachment') !== -1) {
                                  const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
                                  if (matches != null && matches[1]) {
                                    downloadFilename = matches[1].replace(/['"]/g, '');
                                  }
                                }
                                const dlUrl = window.URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = dlUrl;
                                a.download = downloadFilename;
                                document.body.appendChild(a);
                                a.click();
                                a.remove();
                                window.URL.revokeObjectURL(dlUrl);
                                setMessage(`Success! Downloaded ${isImg ? 'Photo' : 'Video'}.`);
                              } catch (err: any) {
                                setMessage(err.message || "Download error.");
                              } finally {
                                setIsLoading(false);
                                setDownloadProgress(null);
                              }
                            }}
                            disabled={isLoading}
                            style={{
                              background: "#10b981",
                              color: "white",
                              padding: "9px 20px",
                              fontSize: 14,
                              fontWeight: 700,
                              borderRadius: 8,
                              border: "none",
                              cursor: isLoading ? "not-allowed" : "pointer",
                              opacity: isLoading ? 0.7 : 1,
                              display: "flex",
                              alignItems: "center",
                              gap: 6
                            }}
                          >
                            <span>📥</span>
                            {isLoading ? (downloadProgress !== null ? `Downloading ${downloadProgress}%` : "Downloading...") : (socialPreview.items && socialPreview.items.length > 1 ? `Download Slide #${selectedMediaIndex + 1}` : "Download")}
                          </button>

                          {/* Download All (ZIP) if multiple items */}
                          {socialPreview.items && socialPreview.items.length > 1 && (
                            <button
                              onClick={async () => {
                                try {
                                  setIsLoading(true);
                                  setMessage("Packaging all items into a ZIP bundle...");
                                  const formData = new FormData();
                                  formData.append("tool", currentTool.name);
                                  formData.append("url", url.trim());
                                  formData.append("format", format);
                                  formData.append("downloadAll", "true");
                                  formData.append("files", new Blob(["dummy"], { type: 'text/plain' }), "dummy.txt");

                                  const response = await fetch(`${API_BASE}/convert`, {
                                    method: "POST",
                                    body: formData,
                                  });

                                  if (!response.ok) {
                                    const errText = await response.text();
                                    throw new Error(errText || "Download failed");
                                  }

                                  const blob = await response.blob();
                                  let downloadFilename = `${currentTool.name}_Album_${Date.now()}.zip`;
                                  const disposition = response.headers.get('content-disposition');
                                  if (disposition && disposition.indexOf('attachment') !== -1) {
                                    const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
                                    if (matches != null && matches[1]) {
                                      downloadFilename = matches[1].replace(/['"]/g, '');
                                    }
                                  }
                                  const dlUrl = window.URL.createObjectURL(blob);
                                  const a = document.createElement("a");
                                  a.href = dlUrl;
                                  a.download = downloadFilename;
                                  document.body.appendChild(a);
                                  a.click();
                                  a.remove();
                                  window.URL.revokeObjectURL(dlUrl);
                                  setMessage(`Success! Downloaded all ${socialPreview.items?.length} items in a ZIP archive.`);
                                } catch (err: any) {
                                  setMessage(err.message || "Download all error.");
                                } finally {
                                  setIsLoading(false);
                                  setDownloadProgress(null);
                                }
                              }}
                              disabled={isLoading}
                              style={{
                                background: "#4f46e5",
                                color: "white",
                                padding: "9px 20px",
                                fontSize: 14,
                                fontWeight: 700,
                                borderRadius: 8,
                                border: "none",
                                cursor: isLoading ? "not-allowed" : "pointer",
                                opacity: isLoading ? 0.7 : 1,
                                display: "flex",
                                alignItems: "center",
                                gap: 6
                              }}
                            >
                              <span>📦</span>
                              {isLoading ? "Bundling ZIP..." : `Download All (${socialPreview.items.length}) as ZIP`}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {message && <div style={{ marginTop: 24, padding: "12px 24px", background: "white", borderRadius: 8, color: "#3b82f6", fontWeight: 600, border: "1px solid #bfdbfe" }}>{message}</div>}
              </div>
            ) : files.length === 0 ? (
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  maxWidth: 800,
                  minHeight: 350,
                  background: "#fdf8f8",
                  border: "2px dashed #fca5a5",
                  borderRadius: 16,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    background: "#e5322d",
                    color: "white",
                    padding: "18px 48px",
                    borderRadius: 8,
                    fontSize: 24,
                    fontWeight: 600,
                    marginBottom: 16,
                    boxShadow: "0 4px 12px rgba(229, 50, 45, 0.3)"
                  }}
                >
                  {(() => {
                    if (selectedTool === 'Excel to PDF') return "Select Excel file (.xlsx, .xls, .csv)";
                    if (selectedTool === 'Word to PDF') return "Select Word file (.docx, .doc)";
                    if (selectedTool === 'Text to PDF') return "Select Text file (.txt)";
                    if (currentTool.category === 'image') return "Select Image file";
                    if (currentTool.category === 'video') return "Select Video file";
                    if (currentTool.category === 'audio') return "Select Audio file";
                    return `Select PDF file${selectedTool === 'Merge PDF' ? 's' : ''}`;
                  })()}
                </div>
                <div style={{ fontSize: 16, color: "#333", fontWeight: 500 }}>or drop files here</div>
                <input
                  type="file"
                  multiple
                  accept={
                    selectedTool === 'Excel to PDF' ? '.xlsx,.xls,.csv' :
                    selectedTool === 'Word to PDF' ? '.docx,.doc' :
                    selectedTool === 'Text to PDF' ? '.txt' :
                    currentTool.category === 'image' ? 'image/*' :
                    currentTool.category === 'video' ? 'video/*' :
                    currentTool.category === 'audio' ? 'audio/*' :
                    '.pdf'
                  }
                  onChange={async (event) => {
                    const selectedFiles = Array.from(event.target.files ?? []);
                    if (selectedTool === 'Merge PDF') {
                      setFiles(prev => [...prev, ...selectedFiles]);
                    } else {
                      setFiles(selectedFiles);
                      if (selectedFiles.length > 0) {
                        if (selectedFiles[0].name.toLowerCase().endsWith('.pdf')) {
                          try {
                            const arrayBuffer = await selectedFiles[0].arrayBuffer();
                            // @ts-ignore
                            const { PDFDocument } = await import('pdf-lib/dist/pdf-lib.min.js');
                            const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
                            setTotalPages(pdfDoc.getPageCount());
                          } catch (e) {
                            // Use console.log to prevent Next.js from showing a dev error overlay for invalid/mock PDFs
                            console.log("Could not parse PDF to count pages (likely a simulated file):", e);
                            setTotalPages(1); // Fallback to 1 page
                          }
                        } else if (selectedFiles[0].type.startsWith('image/')) {
                          const img = new Image();
                          img.onload = () => {
                            setImageDims({ width: img.naturalWidth, height: img.naturalHeight });
                            setResizeWidth(img.naturalWidth.toString());
                            setResizeHeight(img.naturalHeight.toString());
                            setCropWidth(Math.floor(img.naturalWidth * 0.8).toString());
                            setCropHeight(Math.floor(img.naturalHeight * 0.8).toString());
                            setCropLeft(Math.floor(img.naturalWidth * 0.1).toString());
                            setCropTop(Math.floor(img.naturalHeight * 0.1).toString());
                          };
                          img.src = URL.createObjectURL(selectedFiles[0]);
                          setTotalPages(0);
                        } else {
                          setTotalPages(0);
                        }
                      }
                    }
                    setMessage(null);
                    event.target.value = '';
                  }}
                  style={{ display: "none" }}
                />
              </label>
            ) : (
              <div style={{ display: "flex", gap: 32, width: "100%" }}>
                {/* Main Preview Area */}
                <div style={{ flex: 1, background: "#f1f5f9", borderRadius: 12, padding: 30, display: "flex", flexWrap: "wrap", gap: 20, alignContent: "flex-start", minHeight: 400 }}>
                  {/* Dedicated Video Player for Extract Frames & Video Tools */}
                  {files.length > 0 && (selectedTool === 'Extract Frames' || files[0].type.startsWith('video/') || files[0].name.match(/\.(mp4|webm|mov|mkv|avi)$/i)) && (
                    <div style={{
                      width: "100%",
                      background: "white",
                      borderRadius: 14,
                      padding: 20,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                      border: "1.5px solid #e2e8f0",
                      marginBottom: 10,
                      display: "flex",
                      flexDirection: "column",
                      gap: 14
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 22 }}>🎬</span>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: 16, color: "#0f172a" }}>{files[0].name}</div>
                            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>
                              Size: <span style={{ color: "#0284c7", fontWeight: 800 }}>{formatFileSize(files[0].size)}</span>
                              {videoDuration > 0 && (
                                <> • Duration: <span style={{ color: "#334155", fontWeight: 800 }}>{formatSecondsToTime(videoDuration)}</span></>
                              )}
                            </div>
                          </div>
                        </div>
                        <div style={{
                          background: "#eef2ff",
                          color: "#4f46e5",
                          fontWeight: 800,
                          fontSize: 13,
                          padding: "6px 14px",
                          borderRadius: 999,
                          fontFamily: "monospace"
                        }}>
                          Live: {formatSecondsToTime(videoCurrentTime)} / {formatSecondsToTime(videoDuration)}
                        </div>
                      </div>

                      {/* Embedded HTML5 Video Element */}
                      <div style={{
                        position: "relative",
                        width: "100%",
                        background: "#090d16",
                        borderRadius: 10,
                        overflow: "hidden",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        minHeight: 280,
                        maxHeight: 460
                      }}>
                        <video
                          ref={videoPlayerRef}
                          src={URL.createObjectURL(files[0])}
                          controls
                          playsInline
                          onLoadedMetadata={(e) => {
                            const d = e.currentTarget.duration || 0;
                            setVideoDuration(d);
                            // Initial capture after load
                            setTimeout(() => captureFrameFromVideo(false), 200);
                          }}
                          onTimeUpdate={(e) => {
                            const cur = e.currentTarget.currentTime || 0;
                            setVideoCurrentTime(cur);
                            setExtractTime(formatSecondsToTime(cur));
                          }}
                          onSeeked={() => {
                            captureFrameFromVideo(false);
                          }}
                          onPlay={() => setIsVideoPlaying(true)}
                          onPause={() => {
                            setIsVideoPlaying(false);
                            captureFrameFromVideo(false);
                          }}
                          style={{
                            maxWidth: "100%",
                            maxHeight: 460,
                            width: "auto",
                            height: "auto",
                            display: "block",
                            borderRadius: 8
                          }}
                        />
                      </div>

                      {/* Scrubber & Action Toolbar */}
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        background: "#f8fafc",
                        padding: "12px 16px",
                        borderRadius: 10,
                        border: "1px solid #e2e8f0",
                        flexWrap: "wrap"
                      }}>
                        <button
                          type="button"
                          onClick={() => {
                            if (videoPlayerRef.current) {
                              if (videoPlayerRef.current.paused) {
                                videoPlayerRef.current.play();
                              } else {
                                videoPlayerRef.current.pause();
                              }
                            }
                          }}
                          style={{
                            background: "#0f172a",
                            color: "white",
                            border: "none",
                            borderRadius: 8,
                            padding: "8px 16px",
                            fontWeight: 700,
                            fontSize: 13,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 6
                          }}
                        >
                          {isVideoPlaying ? "⏸️ Pause" : "▶️ Play"}
                        </button>

                        <div style={{ flex: 1, minWidth: 180, display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", fontFamily: "monospace" }}>
                            {formatSecondsToTime(videoCurrentTime)}
                          </span>
                          <input
                            type="range"
                            min="0"
                            max={videoDuration || 100}
                            step="0.05"
                            value={videoCurrentTime}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              setVideoCurrentTime(val);
                              setExtractTime(formatSecondsToTime(val));
                              if (videoPlayerRef.current) {
                                videoPlayerRef.current.currentTime = val;
                              }
                            }}
                            onMouseUp={() => captureFrameFromVideo(false)}
                            onTouchEnd={() => captureFrameFromVideo(false)}
                            style={{ flex: 1, accentColor: "#e5322d", cursor: "pointer" }}
                          />
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", fontFamily: "monospace" }}>
                            {formatSecondsToTime(videoDuration)}
                          </span>
                        </div>

                        {/* Capture Button Right inside Player */}
                        <button
                          type="button"
                          onClick={() => captureFrameFromVideo(false)}
                          style={{
                            background: "linear-gradient(135deg, #e5322d 0%, #dc2626 100%)",
                            color: "white",
                            border: "none",
                            borderRadius: 8,
                            padding: "8px 18px",
                            fontWeight: 800,
                            fontSize: 13,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            boxShadow: "0 2px 8px rgba(229, 50, 45, 0.35)"
                          }}
                        >
                          📸 Use Scene at {formatSecondsToTime(videoCurrentTime)}
                        </button>

                        <button
                          type="button"
                          onClick={() => captureFrameFromVideo(true)}
                          style={{
                            background: "#10b981",
                            color: "white",
                            border: "none",
                            borderRadius: 8,
                            padding: "8px 16px",
                            fontWeight: 700,
                            fontSize: 13,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 6
                          }}
                        >
                          ⬇️ Direct Download
                        </button>
                      </div>
                    </div>
                  )}

                  {files.map((f, i) => (
                    <div key={i} style={{ width: 140, height: 180, background: "white", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 12, position: "relative", overflow: "hidden" }}>

                      {selectedTool === 'Watermark PDF' && watermarkText && (
                        <div style={{
                          position: 'absolute',
                          ...(watermarkPos === 'Top-Left' ? { top: 20, left: 10 } : watermarkPos === 'Bottom-Right' ? { bottom: 30, right: 10 } : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }),
                          fontSize: 12,
                          fontWeight: 900,
                          color: 'rgba(0,0,0,0.25)',
                          pointerEvents: 'none',
                          zIndex: 10,
                          whiteSpace: 'nowrap',
                          userSelect: 'none',
                        }}>
                          {watermarkText}
                        </div>
                      )}

                      {selectedTool === 'Add Page Numbers' && (
                        <div style={{
                          position: 'absolute',
                          ...(pageNumberPos === 'Top-Left' ? { top: 10, left: 10 } :
                            pageNumberPos === 'Top-Center' ? { top: 10, left: '50%', transform: 'translateX(-50%)' } :
                              pageNumberPos === 'Top-Right' ? { top: 10, right: 10 } :
                                pageNumberPos === 'Bottom-Left' ? { bottom: 10, left: 10 } :
                                  pageNumberPos === 'Bottom-Center' ? { bottom: 10, left: '50%', transform: 'translateX(-50%)' } :
                                    pageNumberPos === 'Bottom-Right' ? { bottom: 10, right: 10 } : {}),
                          fontSize: 10,
                          fontWeight: 800,
                          color: '#e5322d',
                          background: 'rgba(229, 50, 45, 0.1)',
                          padding: '2px 6px',
                          borderRadius: 4,
                          pointerEvents: 'none',
                          zIndex: 10,
                        }}>
                          {pageNumberFormat === 'n' ? '1' :
                            pageNumberFormat === 'page_n' ? 'Page 1' :
                              pageNumberFormat === 'n_of_m' ? '1 of 5' :
                                'Page 1 of 5'}
                        </div>
                      )}

                      {selectedTool === 'Sign PDF' && (signatureType === 'text' ? signatureText : signatureImage) && (
                        <div style={{
                          position: 'absolute',
                          ...(signaturePos === 'Top-Left' ? { top: 10, left: 10 } :
                            signaturePos === 'Top-Right' ? { top: 10, right: 10 } :
                              signaturePos === 'Bottom-Left' ? { bottom: 10, left: 10 } :
                                { bottom: 10, right: 10 }), // Default to Bottom-Right
                          fontSize: 14,
                          fontFamily: "'Brush Script MT', cursive, sans-serif",
                          color: '#0f172a',
                          pointerEvents: 'none',
                          zIndex: 10,
                          maxWidth: 100,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {signatureType === 'text' ? signatureText : (
                            <div style={{ width: 40, height: 20, background: 'rgba(0,0,0,0.1)', border: '1px dashed #64748b', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>IMG</div>
                          )}
                        </div>
                      )}

                      {f.type.startsWith('image/') ? (
                        <div
                          style={{
                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                            pointerEvents: selectedTool === 'Crop Image' ? 'auto' : 'none',
                            cursor: selectedTool === 'Crop Image' ? 'crosshair' : 'default',
                            zIndex: 1,
                            opacity: selectedTool === 'Watermark PDF' ? 0.3 : 1
                          }}
                          onMouseDown={(e) => {
                            if (selectedTool !== 'Crop Image' || imageDims.width === 0) return;
                            const rect = e.currentTarget.getBoundingClientRect();
                            const mouseX = e.clientX - rect.left;
                            const mouseY = e.clientY - rect.top;
                            const scale = Math.min(140 / imageDims.width, 180 / imageDims.height);
                            const renderedW = imageDims.width * scale;
                            const renderedH = imageDims.height * scale;
                            const offsetX = (140 - renderedW) / 2;
                            const offsetY = (180 - renderedH) / 2;
                            const imgX = (mouseX - offsetX) / scale;
                            const imgY = (mouseY - offsetY) / scale;
                            if (imgX >= 0 && imgX <= imageDims.width && imgY >= 0 && imgY <= imageDims.height) {
                              setIsDragging(true);
                              setDragStart({ x: imgX, y: imgY });
                              setCropLeft(Math.round(imgX).toString());
                              setCropTop(Math.round(imgY).toString());
                              setCropWidth("0");
                              setCropHeight("0");
                            }
                          }}
                          onMouseMove={(e) => {
                            if (!isDragging || selectedTool !== 'Crop Image') return;
                            const rect = e.currentTarget.getBoundingClientRect();
                            let mouseX = e.clientX - rect.left;
                            let mouseY = e.clientY - rect.top;
                            const scale = Math.min(140 / imageDims.width, 180 / imageDims.height);
                            const renderedW = imageDims.width * scale;
                            const renderedH = imageDims.height * scale;
                            const offsetX = (140 - renderedW) / 2;
                            const offsetY = (180 - renderedH) / 2;
                            let imgX = (mouseX - offsetX) / scale;
                            let imgY = (mouseY - offsetY) / scale;
                            imgX = Math.max(0, Math.min(imgX, imageDims.width));
                            imgY = Math.max(0, Math.min(imgY, imageDims.height));

                            let newLeft = Math.min(dragStart.x, imgX);
                            let newTop = Math.min(dragStart.y, imgY);
                            let newWidth = Math.abs(imgX - dragStart.x);
                            let newHeight = Math.abs(imgY - dragStart.y);

                            if (cropRatio !== "Free") {
                              const ratio = parseFloat(cropRatio);
                              if (newWidth / newHeight > ratio) {
                                newWidth = newHeight * ratio;
                              } else {
                                newHeight = newWidth / ratio;
                              }
                              if (imgX < dragStart.x) newLeft = dragStart.x - newWidth;
                              if (imgY < dragStart.y) newTop = dragStart.y - newHeight;
                            }

                            setCropLeft(Math.round(newLeft).toString());
                            setCropTop(Math.round(newTop).toString());
                            setCropWidth(Math.round(newWidth).toString());
                            setCropHeight(Math.round(newHeight).toString());
                          }}
                          onMouseUp={() => setIsDragging(false)}
                          onMouseLeave={() => setIsDragging(false)}
                        >
                          <img
                            src={URL.createObjectURL(f)}
                            onLoad={(e) => setImageDims({ width: e.currentTarget.naturalWidth, height: e.currentTarget.naturalHeight })}
                            style={{ 
                              width: '100%', 
                              height: '100%', 
                              objectFit: 'contain',
                              transform: selectedTool === 'Rotate Image' ? `rotate(${rotateAngle}deg)` : 'none',
                              filter: selectedTool === 'Edit Image' 
                                ? `${filterMode === 'grayscale' ? 'grayscale(100%)' : filterMode === 'sepia' ? 'sepia(100%)' : filterMode === 'invert' ? 'invert(100%)' : filterMode === 'vintage' ? 'sepia(50%) hue-rotate(-30deg)' : filterMode === 'vivid' ? 'saturate(160%) contrast(110%)' : 'none'} brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)` 
                                : 'none',
                              transition: 'all 0.2s ease'
                            }}
                            alt="Preview"
                          />
                          {selectedTool === 'Edit Image' && overlayText && (
                            <div style={{
                              position: 'absolute',
                              bottom: 12,
                              left: '50%',
                              transform: 'translateX(-50%)',
                              color: textColor,
                              fontSize: 13,
                              fontWeight: 800,
                              textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                              pointerEvents: 'none',
                              whiteSpace: 'nowrap',
                              zIndex: 10,
                            }}>
                              {overlayText}
                            </div>
                          )}
                          {selectedTool === 'Crop Image' && imageDims.width > 0 && (
                            (() => {
                              const cw = parseInt(cropWidth) || imageDims.width / 2;
                              const ch = parseInt(cropHeight) || imageDims.height / 2;
                              const cl = parseInt(cropLeft) || imageDims.width / 4;
                              const ct = parseInt(cropTop) || imageDims.height / 4;

                              const scale = Math.min(140 / imageDims.width, 180 / imageDims.height);
                              const renderedW = imageDims.width * scale;
                              const renderedH = imageDims.height * scale;
                              const offsetX = (140 - renderedW) / 2;
                              const offsetY = (180 - renderedH) / 2;

                              const boxLeft = offsetX + (cl * scale);
                              const boxTop = offsetY + (ct * scale);
                              const boxW = cw * scale;
                              const boxH = ch * scale;

                              return (
                                <div style={{
                                  position: 'absolute',
                                  left: boxLeft,
                                  top: boxTop,
                                  width: boxW,
                                  height: boxH,
                                  border: '2px dashed #e5322d',
                                  backgroundColor: 'rgba(229, 50, 45, 0.2)',
                                  pointerEvents: 'none',
                                  zIndex: 10
                                }} />
                              );
                            })()
                          )}
                        </div>
                      ) : f.type === 'application/pdf' ? (
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1, opacity: selectedTool === 'Watermark PDF' ? 0.3 : 1 }}>
                          <iframe src={`${URL.createObjectURL(f)}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`} style={{ width: '200%', height: '200%', border: 'none', transform: 'scale(0.5)', transformOrigin: 'top left' }} title="Thumbnail" />
                        </div>
                      ) : (f.type.startsWith('video/') || f.name.match(/\.(mp4|webm|mov|mkv|avi)$/i)) ? (
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
                          {capturedFrameUrl ? (
                            <img src={capturedFrameUrl} alt="Video Frame" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ fontSize: 44, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))' }}>🎬</div>
                          )}
                          <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(229,50,45,0.9)', color: 'white', fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 4 }}>VIDEO</div>
                        </div>
                      ) : (
                        <div style={{ fontSize: 48, marginBottom: 12, opacity: selectedTool === 'Watermark PDF' ? 0.8 : 1, zIndex: 2 }}>📄</div>
                      )}

                      {/* File Info Badge overlay on Card */}
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.5) 70%, transparent 100%)',
                        padding: '16px 8px 6px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        zIndex: 12,
                        pointerEvents: 'none',
                      }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'white', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {f.name}
                        </div>
                        <div style={{ fontSize: 10, fontWeight: 800, color: '#38bdf8', background: 'rgba(0,0,0,0.4)', padding: '1px 6px', borderRadius: 999, marginTop: 2 }}>
                          {formatFileSize(f.size)}
                        </div>
                      </div>
                    </div>
                  ))}

                  {selectedTool === 'Split PDF' && (
                    <div style={{ width: "100%", borderTop: "2px dashed #cbd5e1", margin: "10px 0", paddingTop: 20, display: "flex", flexWrap: "wrap", gap: 20 }}>
                      {splitRanges.map((range, index) => {
                        const fileUrl = files.length > 0 ? URL.createObjectURL(files[0]) : null;
                        return (
                          <div key={`visual-${range.id}`} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div style={{ fontSize: 13, color: "#64748b", fontWeight: 700, marginBottom: 8 }}>Range {index + 1}</div>
                            <div style={{ display: "flex", alignItems: "center", border: "1px dashed #cbd5e1", padding: 12, borderRadius: 8, background: "white" }}>
                              <div style={{ width: 100, height: 140, border: "1px solid #e2e8f0", background: "white", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 10, position: "relative", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", overflow: "hidden" }}>
                                {fileUrl && (
                                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                                    <iframe src={`${fileUrl}#page=${range.from}&toolbar=0&navpanes=0&scrollbar=0&view=Fit`} style={{ width: '200%', height: '200%', border: 'none', transform: 'scale(0.5)', transformOrigin: 'top left' }} title="Thumbnail" />
                                  </div>
                                )}
                                <span style={{ color: "#4f46e5", fontWeight: 800, fontSize: 14, position: "relative", zIndex: 10, background: "rgba(255,255,255,0.9)", padding: "2px 6px", borderRadius: 4 }}>{range.from}</span>
                              </div>
                              <div style={{ padding: "0 10px", color: "#94a3b8", fontWeight: 800, fontSize: 18 }}>...</div>
                              <div style={{ width: 100, height: 140, border: "1px solid #e2e8f0", background: "white", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 10, position: "relative", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", overflow: "hidden" }}>
                                {fileUrl && (
                                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                                    <iframe src={`${fileUrl}#page=${range.to}&toolbar=0&navpanes=0&scrollbar=0&view=Fit`} style={{ width: '200%', height: '200%', border: 'none', transform: 'scale(0.5)', transformOrigin: 'top left' }} title="Thumbnail" />
                                  </div>
                                )}
                                <span style={{ color: "#4f46e5", fontWeight: 800, fontSize: 14, position: "relative", zIndex: 10, background: "rgba(255,255,255,0.9)", padding: "2px 6px", borderRadius: 4 }}>{range.to}</span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {selectedTool === 'Merge PDF' && (
                    <label style={{ width: 140, height: 180, background: "transparent", border: "2px dashed #e5322d", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#e5322d", fontWeight: 700 }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>+</div>
                      <div style={{ fontSize: 14 }}>Add more</div>
                      <input
                        type="file"
                        multiple
                        onChange={(event) => {
                          const selectedFiles = Array.from(event.target.files ?? []);
                          setFiles(prev => [...prev, ...selectedFiles]);
                          setMessage(null);
                          event.target.value = '';
                        }}
                        style={{ display: "none" }}
                      />
                    </label>
                  )}
                </div>

                {/* Action Sidebar */}
                <div style={{ width: 320, background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: 24, boxShadow: "0 12px 30px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, color: "#333" }}>{currentTool.name} Options</div>

                  {selectedTool === 'Split PDF' && (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", marginBottom: 16 }}>
                        <div style={{ flex: 1, textAlign: "center", padding: "10px", borderBottom: "3px solid #10b981", color: "#10b981", fontWeight: 700, display: "flex", flexDirection: "column", gap: 4 }}>
                          <span style={{ fontSize: 20 }}>✂️</span> Range
                        </div>
                        <div style={{ flex: 1, textAlign: "center", padding: "10px", color: "#94a3b8", fontWeight: 600, display: "flex", flexDirection: "column", gap: 4 }}>
                          <span style={{ fontSize: 20 }}>📄</span> Pages
                        </div>
                      </div>

                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#333", display: "flex", justifyContent: "space-between" }}>
                        <span>Range mode:</span>
                        {totalPages > 0 && <span style={{ color: "#10b981" }}>Total pages: {totalPages}</span>}
                      </div>
                      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                        <button style={{ flex: 1, padding: "8px", background: "white", border: "1.5px solid #e5322d", color: "#e5322d", borderRadius: 8, fontWeight: 700 }}>Custom</button>
                        <button style={{ flex: 1, padding: "8px", background: "#f8faff", border: "1.5px solid transparent", color: "#94a3b8", borderRadius: 8, fontWeight: 600 }}>Fixed</button>
                      </div>

                      <div style={{ maxHeight: 220, overflowY: "auto", paddingRight: 4 }}>
                        {splitRanges.map((range, index) => (
                          <div key={range.id} style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6, color: "#475569", display: "flex", alignItems: "center", gap: 6 }}>
                              <span style={{ fontSize: 11 }}>↕</span> Range {index + 1}
                            </div>
                            <div style={{ display: "flex", gap: 0, border: "1px solid #cbd5e1", borderRadius: 4, overflow: "hidden" }}>
                              <div style={{ flex: 1, display: "flex", alignItems: "center", background: "white", borderRight: "1px solid #cbd5e1" }}>
                                <span style={{ fontSize: 11, color: "#64748b", padding: "0 8px", width: 60 }}>from page</span>
                                <input type="number" min={1} max={totalPages > 0 ? totalPages : undefined} value={range.from} onChange={(e) => {
                                  const newRanges = [...splitRanges];
                                  let val = parseInt(e.target.value) || 1;
                                  if (totalPages > 0 && val > totalPages) val = totalPages;
                                  newRanges[index].from = val;
                                  setSplitRanges(newRanges);
                                }} style={{ width: "100%", border: "none", outline: "none", padding: "8px", borderLeft: "1px solid #cbd5e1", textAlign: "right" }} />
                              </div>
                              <div style={{ flex: 1, display: "flex", alignItems: "center", background: "white" }}>
                                <span style={{ fontSize: 11, color: "#64748b", padding: "0 8px", width: 30 }}>to</span>
                                <input type="number" min={1} max={totalPages > 0 ? totalPages : undefined} value={range.to} onChange={(e) => {
                                  const newRanges = [...splitRanges];
                                  let val = parseInt(e.target.value) || 1;
                                  if (totalPages > 0 && val > totalPages) val = totalPages;
                                  newRanges[index].to = val;
                                  setSplitRanges(newRanges);
                                }} style={{ width: "100%", border: "none", outline: "none", padding: "8px", borderLeft: "1px solid #cbd5e1", textAlign: "right" }} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                        <button
                          onClick={() => setSplitRanges([...splitRanges, { id: Date.now(), from: 1, to: 1 }])}
                          style={{ padding: "8px 24px", background: "white", border: "1.5px solid #e5322d", color: "#e5322d", borderRadius: 8, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                        >
                          <span style={{ fontSize: 16 }}>+</span> Add Range
                        </button>
                      </div>

                      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#94a3b8", cursor: "pointer" }}>
                        <input type="checkbox" style={{ accentColor: "#e5322d", width: 16, height: 16 }} />
                        Merge all ranges in one PDF file.
                      </label>
                    </div>
                  )}

                  {selectedTool === 'Watermark PDF' && (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", marginBottom: 16 }}>
                        <div style={{ flex: 1, textAlign: "center", padding: "10px", borderBottom: "3px solid #3b82f6", color: "#3b82f6", fontWeight: 700, display: "flex", flexDirection: "column", gap: 4 }}>
                          <span style={{ fontSize: 20 }}>💧</span> Watermark
                        </div>
                      </div>

                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#333" }}>Watermark Text</div>
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={e => setWatermarkText(e.target.value)}
                        placeholder="Enter watermark text..."
                        style={{ width: "100%", padding: 10, border: "1px solid #cbd5e1", borderRadius: 8, marginBottom: 16, outline: "none" }}
                      />

                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#333" }}>Position</div>
                      <select
                        value={watermarkPos}
                        onChange={e => setWatermarkPos(e.target.value)}
                        style={{ width: "100%", padding: 10, border: "1px solid #cbd5e1", borderRadius: 8, outline: "none", marginBottom: 16 }}
                      >
                        <option value="Center">Center</option>
                        <option value="Top-Left">Top Left</option>
                        <option value="Bottom-Right">Bottom Right</option>
                      </select>
                    </div>
                  )}

                  {selectedTool === 'Add Page Numbers' && (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", marginBottom: 16 }}>
                        <div style={{ flex: 1, textAlign: "center", padding: "10px", borderBottom: "3px solid #e5322d", color: "#e5322d", fontWeight: 700, display: "flex", flexDirection: "column", gap: 4 }}>
                          <span style={{ fontSize: 20 }}>🔢</span> Page Numbers
                        </div>
                      </div>

                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#333" }}>Position</div>
                      <select
                        value={pageNumberPos}
                        onChange={e => setPageNumberPos(e.target.value)}
                        style={{ width: "100%", padding: 10, border: "1px solid #cbd5e1", borderRadius: 8, outline: "none", marginBottom: 16 }}
                      >
                        <option value="Bottom-Center">Bottom Center</option>
                        <option value="Bottom-Left">Bottom Left</option>
                        <option value="Bottom-Right">Bottom Right</option>
                        <option value="Top-Center">Top Center</option>
                        <option value="Top-Left">Top Left</option>
                        <option value="Top-Right">Top Right</option>
                      </select>

                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#333" }}>Format</div>
                      <select
                        value={pageNumberFormat}
                        onChange={e => setPageNumberFormat(e.target.value)}
                        style={{ width: "100%", padding: 10, border: "1px solid #cbd5e1", borderRadius: 8, outline: "none", marginBottom: 16 }}
                      >
                        <option value="page_n_of_m">Page 1 of 5</option>
                        <option value="n_of_m">1 of 5</option>
                        <option value="page_n">Page 1</option>
                        <option value="n">1</option>
                      </select>
                    </div>
                  )}

                  {selectedTool === 'Sign PDF' && (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", marginBottom: 16 }}>
                        <div style={{ flex: 1, textAlign: "center", padding: "10px", borderBottom: "3px solid #f59e0b", color: "#f59e0b", fontWeight: 700, display: "flex", flexDirection: "column", gap: 4 }}>
                          <span style={{ fontSize: 20 }}>✍️</span> Sign
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, cursor: "pointer" }}>
                          <input type="radio" checked={signatureType === 'text'} onChange={() => setSignatureType('text')} /> Text
                        </label>
                        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, cursor: "pointer" }}>
                          <input type="radio" checked={signatureType === 'image'} onChange={() => setSignatureType('image')} /> Image
                        </label>
                      </div>

                      {signatureType === 'text' ? (
                        <>
                          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#333" }}>Your Signature</div>
                          <input
                            type="text"
                            value={signatureText || ""}
                            onChange={e => setSignatureText(e.target.value)}
                            placeholder="Type your name to sign..."
                            style={{ width: "100%", padding: 10, border: "1px solid #cbd5e1", borderRadius: 8, marginBottom: 16, outline: "none", fontFamily: "'Brush Script MT', cursive, sans-serif", fontSize: 18 }}
                          />
                        </>
                      ) : (
                        <>
                          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#333" }}>Upload Signature Image</div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => e.target.files && setSignatureImage(e.target.files[0])}
                            style={{ width: "100%", padding: 10, border: "1px solid #cbd5e1", borderRadius: 8, marginBottom: 16 }}
                          />
                        </>
                      )}

                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#333" }}>Position</div>
                      <select
                        value={signaturePos}
                        onChange={e => setSignaturePos(e.target.value)}
                        style={{ width: "100%", padding: 10, border: "1px solid #cbd5e1", borderRadius: 8, outline: "none", marginBottom: 16 }}
                      >
                        <option value="Bottom-Right">Bottom Right</option>
                        <option value="Bottom-Left">Bottom Left</option>
                        <option value="Top-Right">Top Right</option>
                        <option value="Top-Left">Top Left</option>
                      </select>
                    </div>
                  )}

                  {selectedTool === 'Protect PDF' && (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                        <span style={{ fontSize: 22 }}>🔒</span>
                        <span style={{ fontSize: 15, fontWeight: 800, color: "#1e293b" }}>Set Password</span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#334155" }}>Enter Password to Protect PDF:</div>
                      <input
                        type="password"
                        value={pdfPassword}
                        onChange={e => setPdfPassword(e.target.value)}
                        placeholder="Enter secure password..."
                        style={{
                          width: "100%",
                          padding: "12px 14px",
                          border: "1.5px solid #cbd5e1",
                          borderRadius: 8,
                          outline: "none",
                          fontSize: 14,
                          marginBottom: 10,
                          background: "#f8fafc"
                        }}
                      />
                      <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.4 }}>
                        Anyone who opens this protected PDF will be required to type this password.
                      </div>
                    </div>
                  )}

                  {selectedTool === 'Trim Video' && (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#333" }}>Start Time (HH:MM:SS)</div>
                      <input type="text" value={trimStart} onChange={e => setTrimStart(e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #cbd5e1", borderRadius: 8, outline: "none", marginBottom: 16 }} />
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#333" }}>End Time (HH:MM:SS)</div>
                      <input type="text" value={trimEnd} onChange={e => setTrimEnd(e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #cbd5e1", borderRadius: 8, outline: "none", marginBottom: 16 }} />
                    </div>
                  )}

                  {selectedTool === 'Extract Frames' && (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", marginBottom: 16 }}>
                        <div style={{ flex: 1, textAlign: "center", padding: "10px", borderBottom: "3px solid #e5322d", color: "#e5322d", fontWeight: 700, display: "flex", flexDirection: "column", gap: 4 }}>
                          <span style={{ fontSize: 20 }}>🎞️</span> Frame Extraction
                        </div>
                      </div>

                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#333" }}>Frame Timestamp (HH:MM:SS)</div>
                      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                        <input
                          type="text"
                          value={extractTime}
                          onChange={e => {
                            setExtractTime(e.target.value);
                            const secs = parseTimeToSeconds(e.target.value);
                            if (videoPlayerRef.current && !isNaN(secs)) {
                              videoPlayerRef.current.currentTime = secs;
                            }
                          }}
                          placeholder="00:00:01"
                          style={{ flex: 1, padding: "10px 12px", border: "1.5px solid #cbd5e1", borderRadius: 8, outline: "none", fontSize: 15, fontWeight: 700, color: "#0f172a", fontFamily: "monospace" }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (videoPlayerRef.current) {
                              const cur = videoPlayerRef.current.currentTime;
                              setExtractTime(formatSecondsToTime(cur));
                              captureFrameFromVideo(false);
                            }
                          }}
                          title="Capture current video frame"
                          style={{
                            background: "#e5322d",
                            color: "white",
                            border: "none",
                            borderRadius: 8,
                            padding: "0 14px",
                            fontWeight: 700,
                            fontSize: 13,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 6
                          }}
                        >
                          📸 Sync
                        </button>
                      </div>

                      {/* Micro nudge buttons */}
                      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                        {[
                          { label: "-1s", diff: -1 },
                          { label: "-0.1s", diff: -0.1 },
                          { label: "+0.1s", diff: 0.1 },
                          { label: "+1s", diff: 1 },
                        ].map((btn) => (
                          <button
                            key={btn.label}
                            type="button"
                            onClick={() => {
                              if (videoPlayerRef.current) {
                                const newSec = Math.max(0, (videoPlayerRef.current.currentTime || 0) + btn.diff);
                                videoPlayerRef.current.currentTime = newSec;
                                setExtractTime(formatSecondsToTime(newSec));
                                setTimeout(() => captureFrameFromVideo(false), 80);
                              }
                            }}
                            style={{
                              flex: 1,
                              padding: "6px 0",
                              fontSize: 11,
                              fontWeight: 700,
                              background: "#f1f5f9",
                              border: "1px solid #cbd5e1",
                              borderRadius: 6,
                              color: "#334155",
                              cursor: "pointer"
                            }}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>

                      {/* Frame Preview Snapshot */}
                      {capturedFrameUrl ? (
                        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: 10, marginBottom: 14 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span>SELECTED SCENE PREVIEW:</span>
                            <span style={{ color: "#e5322d", fontWeight: 800 }}>{extractTime}</span>
                          </div>
                          <img
                            src={capturedFrameUrl}
                            alt="Captured Frame"
                            style={{ width: "100%", height: 110, objectFit: "cover", borderRadius: 6, border: "1px solid #cbd5e1" }}
                          />
                          <button
                            type="button"
                            onClick={() => captureFrameFromVideo(true)}
                            style={{
                              width: "100%",
                              marginTop: 8,
                              padding: "8px 12px",
                              background: "#10b981",
                              color: "white",
                              border: "none",
                              borderRadius: 6,
                              fontWeight: 700,
                              fontSize: 12,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 6
                            }}
                          >
                            ⚡ Instant Download Frame (.JPG)
                          </button>
                        </div>
                      ) : (
                        <div style={{ background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: 8, padding: "12px", textAlign: "center", fontSize: 12, color: "#64748b", marginBottom: 14 }}>
                          Play or pause the video on the left to view the scene and tap <b>Sync</b> or <b>Capture This Frame</b>.
                        </div>
                      )}
                    </div>
                  )}

                  {selectedTool === 'Compress Video' && (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#333" }}>Compression Level</div>
                      <select value={compressLevel} onChange={e => setCompressLevel(e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #cbd5e1", borderRadius: 8, outline: "none", marginBottom: 16 }}>
                        <option value="Low (CRF 23)">Low (CRF 23) - Larger file</option>
                        <option value="Medium (CRF 28)">Medium (CRF 28) - Balanced</option>
                        <option value="High (CRF 32)">High (CRF 32) - Smaller file</option>
                      </select>
                    </div>
                  )}

                  {selectedTool === 'Change Resolution' && (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#333" }}>Resolution</div>
                      <select value={videoResolution} onChange={e => setVideoResolution(e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #cbd5e1", borderRadius: 8, outline: "none", marginBottom: 16 }}>
                        <option value="1920x1080">1080p (1920x1080)</option>
                        <option value="1280x720">720p (1280x720)</option>
                        <option value="854x480">480p (854x480)</option>
                        <option value="640x360">360p (640x360)</option>
                      </select>
                    </div>
                  )}

                  {selectedTool === 'Change Format' && (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#333" }}>Target Format</div>
                      <select value={videoFormat} onChange={e => setVideoFormat(e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #cbd5e1", borderRadius: 8, outline: "none", marginBottom: 16 }}>
                        <option value="mp4">MP4</option>
                        <option value="avi">AVI</option>
                        <option value="mov">MOV</option>
                        <option value="mkv">MKV</option>
                      </select>
                    </div>
                  )}
                  {selectedTool === 'Crop Image' && (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#333" }}>Aspect Ratio</div>
                      <select value={cropRatio} onChange={e => setCropRatio(e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #cbd5e1", borderRadius: 8, outline: "none", marginBottom: 16 }}>
                        <option value="Free">Free / Custom</option>
                        <option value="1">1:1 (Square)</option>
                        <option value="1.333333333">4:3 (Landscape)</option>
                        <option value="0.75">3:4 (Portrait)</option>
                        <option value="1.777777778">16:9 (Widescreen)</option>
                        <option value="0.5625">9:16 (Story)</option>
                      </select>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#333" }}>Width (px)</div>
                      <input type="number" value={cropWidth} onChange={e => setCropWidth(e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #cbd5e1", borderRadius: 8, outline: "none", marginBottom: 16 }} />
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#333" }}>Height (px)</div>
                      <input type="number" value={cropHeight} onChange={e => setCropHeight(e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #cbd5e1", borderRadius: 8, outline: "none", marginBottom: 16 }} />
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#333" }}>Left (X Offset)</div>
                      <input type="number" value={cropLeft} onChange={e => setCropLeft(e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #cbd5e1", borderRadius: 8, outline: "none", marginBottom: 16 }} />
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#333" }}>Top (Y Offset)</div>
                      <input type="number" value={cropTop} onChange={e => setCropTop(e.target.value)} style={{ width: "100%", padding: 10, border: "1px solid #cbd5e1", borderRadius: 8, outline: "none", marginBottom: 16 }} />
                    </div>
                  )}

                  {selectedTool === 'Resize Image' && (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", marginBottom: 16 }}>
                        <div style={{ flex: 1, textAlign: "center", padding: "10px", borderBottom: "3px solid #e5322d", color: "#e5322d", fontWeight: 700, display: "flex", flexDirection: "column", gap: 4 }}>
                          <span style={{ fontSize: 20 }}>📐</span> Resize Dimensions
                        </div>
                      </div>
                      {imageDims.width > 0 && files.length > 0 && (
                        <div style={{ fontSize: 12, color: "#64748b", background: "#f8fafc", padding: "8px 12px", borderRadius: 6, marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span>Original: <b>{imageDims.width} × {imageDims.height} px</b></span>
                          <span style={{ fontWeight: 800, color: "#e5322d", background: "#fee2e2", padding: "1px 6px", borderRadius: 4 }}>{formatFileSize(files[0].size)}</span>
                        </div>
                      )}
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#333" }}>Width (px)</div>
                      <input 
                        type="number" 
                        value={resizeWidth} 
                        onChange={e => {
                          const val = e.target.value;
                          setResizeWidth(val);
                          if (maintainAspect && imageDims.width > 0 && imageDims.height > 0) {
                            const wNum = parseFloat(val);
                            if (!isNaN(wNum)) {
                              setResizeHeight(Math.round((wNum * imageDims.height) / imageDims.width).toString());
                            }
                          }
                        }} 
                        style={{ width: "100%", padding: 10, border: "1px solid #cbd5e1", borderRadius: 8, outline: "none", marginBottom: 14 }} 
                      />
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#333" }}>Height (px)</div>
                      <input 
                        type="number" 
                        value={resizeHeight} 
                        onChange={e => {
                          const val = e.target.value;
                          setResizeHeight(val);
                          if (maintainAspect && imageDims.width > 0 && imageDims.height > 0) {
                            const hNum = parseFloat(val);
                            if (!isNaN(hNum)) {
                              setResizeWidth(Math.round((hNum * imageDims.width) / imageDims.height).toString());
                            }
                          }
                        }} 
                        style={{ width: "100%", padding: 10, border: "1px solid #cbd5e1", borderRadius: 8, outline: "none", marginBottom: 14 }} 
                      />
                      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#475569", cursor: "pointer", marginBottom: 14 }}>
                        <input 
                          type="checkbox" 
                          checked={maintainAspect} 
                          onChange={e => setMaintainAspect(e.target.checked)} 
                          style={{ accentColor: "#e5322d", width: 16, height: 16 }} 
                        />
                        Maintain aspect ratio
                      </label>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <button 
                          type="button" 
                          onClick={() => {
                            if (imageDims.width > 0) {
                              setResizeWidth(Math.round(imageDims.width * 0.5).toString());
                              setResizeHeight(Math.round(imageDims.height * 0.5).toString());
                            }
                          }}
                          style={{ padding: "8px", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                        >
                          50% Scale
                        </button>
                        <button 
                          type="button" 
                          onClick={() => {
                            if (imageDims.width > 0) {
                              setResizeWidth(Math.round(imageDims.width * 0.75).toString());
                              setResizeHeight(Math.round(imageDims.height * 0.75).toString());
                            }
                          }}
                          style={{ padding: "8px", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                        >
                          75% Scale
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedTool === 'Compress Image' && (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", marginBottom: 16 }}>
                        <div style={{ flex: 1, textAlign: "center", padding: "10px", borderBottom: "3px solid #10b981", color: "#10b981", fontWeight: 700, display: "flex", flexDirection: "column", gap: 4 }}>
                          <span style={{ fontSize: 20 }}>🗜️</span> Compression Quality
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#333" }}>
                        <span>Target Quality:</span>
                        <span style={{ color: "#10b981" }}>{compressQuality}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" 
                        max="95" 
                        value={compressQuality} 
                        onChange={e => setCompressQuality(parseInt(e.target.value))} 
                        style={{ width: "100%", accentColor: "#10b981", marginBottom: 14 }} 
                      />
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94a3b8", marginBottom: 16 }}>
                        <span>Maximum Compression</span>
                        <span>Balanced</span>
                        <span>Best Fidelity</span>
                      </div>

                      {files.length > 0 && (
                        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "12px 14px", borderRadius: 8, fontSize: 13, color: "#166534" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <span style={{ color: "#475569" }}>Original Size:</span>
                            <span style={{ fontWeight: 800 }}>{formatFileSize(files[0].size)}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                            <span style={{ color: "#475569" }}>Estimated Output:</span>
                            <span style={{ fontWeight: 800, color: "#10b981" }}>
                              {formatFileSize(Math.max(5120, Math.round(files[0].size * (compressQuality / 100) * 0.55)))}
                            </span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, borderTop: "1px dashed #bbf7d0", paddingTop: 6, color: "#15803d" }}>
                            <span>Estimated Savings:</span>
                            <span style={{ fontWeight: 800 }}>
                              ~{Math.max(5, Math.round((1 - (compressQuality / 100) * 0.55) * 100))}% reduction
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedTool === 'Rotate Image' && (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", marginBottom: 16 }}>
                        <div style={{ flex: 1, textAlign: "center", padding: "10px", borderBottom: "3px solid #3b82f6", color: "#3b82f6", fontWeight: 700, display: "flex", flexDirection: "column", gap: 4 }}>
                          <span style={{ fontSize: 20 }}>🔄</span> Rotate Angle
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                        <button 
                          type="button" 
                          onClick={() => setRotateAngle(prev => (prev + 90) % 360)}
                          style={{ padding: "10px", background: "white", border: "1.5px solid #cbd5e1", borderRadius: 8, fontWeight: 700, color: "#1e293b", cursor: "pointer" }}
                        >
                          +90° CW
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setRotateAngle(prev => (prev + 270) % 360)}
                          style={{ padding: "10px", background: "white", border: "1.5px solid #cbd5e1", borderRadius: 8, fontWeight: 700, color: "#1e293b", cursor: "pointer" }}
                        >
                          -90° CCW
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setRotateAngle(180)}
                          style={{ padding: "10px", background: rotateAngle === 180 ? "#eff6ff" : "white", border: `1.5px solid ${rotateAngle === 180 ? '#3b82f6' : '#cbd5e1'}`, borderRadius: 8, fontWeight: 700, color: rotateAngle === 180 ? '#3b82f6' : '#1e293b', cursor: "pointer" }}
                        >
                          180° Flip
                        </button>
                        <button 
                          type="button" 
                          onClick={() => setRotateAngle(0)}
                          style={{ padding: "10px", background: rotateAngle === 0 ? "#eff6ff" : "white", border: `1.5px solid ${rotateAngle === 0 ? '#3b82f6' : '#cbd5e1'}`, borderRadius: 8, fontWeight: 700, color: rotateAngle === 0 ? '#3b82f6' : '#1e293b', cursor: "pointer" }}
                        >
                          Reset (0°)
                        </button>
                      </div>
                      <div style={{ background: "#f8fafc", padding: "8px 12px", borderRadius: 6, fontSize: 13, textAlign: "center", color: "#64748b" }}>
                        Angle: <b>{rotateAngle}°</b>
                      </div>
                    </div>
                  )}

                  {selectedTool === 'Edit Image' && (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", marginBottom: 16 }}>
                        <div style={{ flex: 1, textAlign: "center", padding: "10px", borderBottom: "3px solid #8b5cf6", color: "#8b5cf6", fontWeight: 700, display: "flex", flexDirection: "column", gap: 4 }}>
                          <span style={{ fontSize: 20 }}>🎨</span> Image Filters & Adjust
                        </div>
                      </div>
                      
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#333" }}>Filter Presets</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginBottom: 16 }}>
                        {[
                          { id: "normal", name: "Normal" },
                          { id: "grayscale", name: "B&W" },
                          { id: "sepia", name: "Sepia" },
                          { id: "invert", name: "Invert" },
                          { id: "vintage", name: "Vintage" },
                          { id: "vivid", name: "Vivid" },
                        ].map(f => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setFilterMode(f.id)}
                            style={{
                              padding: "6px 4px",
                              fontSize: 11,
                              fontWeight: 700,
                              borderRadius: 6,
                              border: `1.5px solid ${filterMode === f.id ? '#8b5cf6' : '#cbd5e1'}`,
                              background: filterMode === f.id ? '#f5f3ff' : 'white',
                              color: filterMode === f.id ? '#8b5cf6' : '#475569',
                              cursor: "pointer",
                            }}
                          >
                            {f.name}
                          </button>
                        ))}
                      </div>

                      <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#475569", display: "flex", justifyContent: "space-between" }}>
                        <span>Brightness</span>
                        <span>{brightness}%</span>
                      </div>
                      <input type="range" min="30" max="200" value={brightness} onChange={e => setBrightness(parseInt(e.target.value))} style={{ width: "100%", accentColor: "#8b5cf6", marginBottom: 10 }} />

                      <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#475569", display: "flex", justifyContent: "space-between" }}>
                        <span>Contrast</span>
                        <span>{contrast}%</span>
                      </div>
                      <input type="range" min="30" max="200" value={contrast} onChange={e => setContrast(parseInt(e.target.value))} style={{ width: "100%", accentColor: "#8b5cf6", marginBottom: 10 }} />

                      <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4, color: "#475569", display: "flex", justifyContent: "space-between" }}>
                        <span>Saturation</span>
                        <span>{saturation}%</span>
                      </div>
                      <input type="range" min="0" max="200" value={saturation} onChange={e => setSaturation(parseInt(e.target.value))} style={{ width: "100%", accentColor: "#8b5cf6", marginBottom: 14 }} />

                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, color: "#333" }}>Overlay Text</div>
                      <input 
                        type="text" 
                        value={overlayText} 
                        onChange={e => setOverlayText(e.target.value)} 
                        placeholder="Type text watermark/caption..." 
                        style={{ width: "100%", padding: 8, border: "1px solid #cbd5e1", borderRadius: 6, outline: "none", fontSize: 13, marginBottom: 8 }} 
                      />
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} style={{ width: 34, height: 34, border: "none", borderRadius: 4, cursor: "pointer" }} />
                        <span style={{ fontSize: 12, color: "#64748b" }}>Color</span>
                        <div style={{ flex: 1 }} />
                        <button type="button" onClick={() => { setBrightness(100); setContrast(100); setSaturation(100); setFilterMode("normal"); setOverlayText(""); }} style={{ fontSize: 11, color: "#94a3b8", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Reset Adjustments</button>
                      </div>
                    </div>
                  )}

                  {selectedTool === 'Remove BG' && (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", marginBottom: 16 }}>
                        <div style={{ flex: 1, textAlign: "center", padding: "10px", borderBottom: "3px solid #8b5cf6", color: "#8b5cf6", fontWeight: 700, display: "flex", flexDirection: "column", gap: 4 }}>
                          <span style={{ fontSize: 20 }}>🧹</span> Remove Background
                        </div>
                      </div>
                      <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.5, marginBottom: 14 }}>
                        Automatically extracts the foreground subject and creates a transparent PNG output.
                      </div>
                      <div style={{ background: "#f5f3ff", border: "1px solid #ddd6fe", padding: "10px 14px", borderRadius: 8, fontSize: 12, color: "#6d28d9" }}>
                        ✓ Clean alpha channel transparent output
                      </div>
                    </div>
                  )}

                  {(selectedTool === 'JPG to PNG' || selectedTool === 'PNG to JPG' || selectedTool === 'WebP to JPG') && (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", marginBottom: 16 }}>
                        <div style={{ flex: 1, textAlign: "center", padding: "10px", borderBottom: "3px solid #f59e0b", color: "#f59e0b", fontWeight: 700, display: "flex", flexDirection: "column", gap: 4 }}>
                          <span style={{ fontSize: 20 }}>🔄</span> Format Conversion
                        </div>
                      </div>
                      <div style={{ background: "#fffbeb", border: "1px solid #fde68a", padding: "10px 14px", borderRadius: 8, fontSize: 13, color: "#92400e" }}>
                        Target: <b>{selectedTool === 'JPG to PNG' ? 'PNG (lossless)' : 'JPG (optimized)'}</b>
                      </div>
                    </div>
                  )}

                  {selectedTool === 'Image to PDF' && (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", marginBottom: 16 }}>
                        <div style={{ flex: 1, textAlign: "center", padding: "10px", borderBottom: "3px solid #e5322d", color: "#e5322d", fontWeight: 700, display: "flex", flexDirection: "column", gap: 4 }}>
                          <span style={{ fontSize: 20 }}>📄</span> PDF Page Setup
                        </div>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#333" }}>Orientation</div>
                      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                        <button type="button" onClick={() => setPdfOrientation("portrait")} style={{ flex: 1, padding: "8px", background: pdfOrientation === "portrait" ? "#fef2f2" : "white", border: `1.5px solid ${pdfOrientation === "portrait" ? '#e5322d' : '#cbd5e1'}`, color: pdfOrientation === "portrait" ? '#e5322d' : '#475569', borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>Portrait</button>
                        <button type="button" onClick={() => setPdfOrientation("landscape")} style={{ flex: 1, padding: "8px", background: pdfOrientation === "landscape" ? "#fef2f2" : "white", border: `1.5px solid ${pdfOrientation === "landscape" ? '#e5322d' : '#cbd5e1'}`, color: pdfOrientation === "landscape" ? '#e5322d' : '#475569', borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>Landscape</button>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#333" }}>Margin</div>
                      <select value={pdfMargin} onChange={e => setPdfMargin(e.target.value as any)} style={{ width: "100%", padding: 10, border: "1px solid #cbd5e1", borderRadius: 8, outline: "none" }}>
                        <option value="none">No margin (Full Bleed)</option>
                        <option value="small">Small margin (0.5 inch)</option>
                        <option value="large">Big margin (1.0 inch)</option>
                      </select>
                    </div>
                  )}

                  {selectedTool === 'Image to Text' && (
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ display: "flex", borderBottom: "1px solid #e2e8f0", marginBottom: 16 }}>
                        <div style={{ flex: 1, textAlign: "center", padding: "10px", borderBottom: "3px solid #0284c7", color: "#0284c7", fontWeight: 700, display: "flex", flexDirection: "column", gap: 4 }}>
                          <span style={{ fontSize: 20 }}>🔤</span> OCR Text Extractor
                        </div>
                      </div>
                      {extractedOcrText && (
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>Recognized Text:</span>
                            <button type="button" onClick={() => { navigator.clipboard.writeText(extractedOcrText); setCopiedText(true); setTimeout(() => setCopiedText(false), 2000); }} style={{ fontSize: 11, color: "#0284c7", background: "#f0f9ff", border: "1px solid #bae6fd", padding: "3px 8px", borderRadius: 4, cursor: "pointer", fontWeight: 600 }}>{copiedText ? "Copied! ✓" : "Copy"}</button>
                          </div>
                          <textarea value={extractedOcrText} readOnly style={{ width: "100%", height: 100, padding: 8, fontSize: 12, border: "1px solid #cbd5e1", borderRadius: 6, background: "#f8fafc", outline: "none", resize: "none" }} />
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <button
                      type="button"
                      onClick={async () => {
                        if (files.length === 0) {
                          setMessage("Please select at least one file.");
                          return;
                        }
                        setIsLoading(true);
                        setMessage("Processing...");
                        try {
                          const formData = new FormData();
                          files.forEach(file => {
                            formData.append("files", file);
                          });
                          formData.append("tool", selectedTool);
                          if (selectedTool === 'Split PDF') {
                            const compiledRange = splitRanges.map(r => `${r.from}-${r.to}`).join(',');
                            formData.append("pageRange", compiledRange);
                          } else if (selectedTool === 'Watermark PDF') {
                            formData.append("watermarkText", watermarkText);
                            formData.append("watermarkPos", watermarkPos);
                          } else if (selectedTool === 'Add Page Numbers') {
                            formData.append("pageNumberPos", pageNumberPos);
                            formData.append("pageNumberFormat", pageNumberFormat);
                          } else if (selectedTool === 'Sign PDF') {
                            if (signatureType === 'text' && !signatureText.trim()) {
                              setMessage("Please enter a signature text.");
                              setIsLoading(false);
                              return;
                            } else if (signatureType === 'image' && !signatureImage) {
                              setMessage("Please upload a signature image.");
                              setIsLoading(false);
                              return;
                            }

                            if (signatureType === 'text') {
                              formData.append("signatureText", signatureText);
                            } else if (signatureImage) {
                              formData.append("signatureImage", signatureImage);
                            }
                            formData.append("signaturePos", signaturePos);
                          } else if (selectedTool === 'Trim Video') {
                            formData.append("trimStart", trimStart);
                            formData.append("trimEnd", trimEnd);
                          } else if (selectedTool === 'Extract Frames') {
                            formData.append("extractTime", extractTime);
                          } else if (selectedTool === 'Compress Video') {
                            formData.append("compressLevel", compressLevel);
                          } else if (selectedTool === 'Change Resolution') {
                            formData.append("videoResolution", videoResolution);
                          } else if (selectedTool === 'Change Format') {
                            formData.append("videoFormat", videoFormat);
                          } else if (selectedTool === 'Crop Image') {
                            formData.append("cropWidth", cropWidth);
                            formData.append("cropHeight", cropHeight);
                            formData.append("cropLeft", cropLeft);
                            formData.append("cropTop", cropTop);
                          } else if (selectedTool === 'Resize Image') {
                            formData.append("resizeWidth", resizeWidth);
                            formData.append("resizeHeight", resizeHeight);
                            formData.append("maintainAspect", maintainAspect ? "true" : "false");
                          } else if (selectedTool === 'Compress Image') {
                            formData.append("compressQuality", compressQuality.toString());
                          } else if (selectedTool === 'Rotate Image') {
                            formData.append("rotateAngle", rotateAngle.toString());
                          } else if (selectedTool === 'Edit Image') {
                            formData.append("filterMode", filterMode);
                            formData.append("brightness", brightness.toString());
                            formData.append("contrast", contrast.toString());
                            formData.append("saturation", saturation.toString());
                            formData.append("overlayText", overlayText);
                            formData.append("textColor", textColor);
                          } else if (selectedTool === 'Image to PDF') {
                            formData.append("pdfOrientation", pdfOrientation);
                            formData.append("pdfMargin", pdfMargin);
                          } else if (selectedTool === 'Protect PDF') {
                            formData.append("pdfPassword", pdfPassword);
                          }

                          const response = await fetch(`${API_BASE}/convert`, {
                            method: "POST",
                            body: formData,
                          });

                          if (!response.ok) {
                            const errText = await response.text();
                            throw new Error(errText || "Conversion failed");
                          }

                          const blob = await response.blob();

                          let downloadFilename = `converted_${files[0].name}`;
                          const disposition = response.headers.get('content-disposition');
                          if (disposition && disposition.indexOf('attachment') !== -1) {
                            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                            const matches = filenameRegex.exec(disposition);
                            if (matches != null && matches[1]) {
                              downloadFilename = matches[1].replace(/['"]/g, '');
                            }
                          }

                          if (selectedTool === 'Image to Text') {
                            const text = await blob.text();
                            setExtractedOcrText(text || "No text detected in this image.");
                            setMessage("Success! Text extracted below.");
                          } else {
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = downloadFilename;
                            document.body.appendChild(a);
                            a.click();
                            a.remove();
                            window.URL.revokeObjectURL(url);
                            setMessage("Success! File downloaded.");
                          }
                        } catch (err: any) {
                          setMessage(err.message || "Error during processing.");
                        } finally {
                          setIsLoading(false);
                        }
                      }}
                      disabled={isLoading}
                      style={{ background: "#e5322d", color: "white", border: "none", borderRadius: 8, padding: "16px", fontSize: 18, fontWeight: 700, cursor: isLoading ? "not-allowed" : "pointer", opacity: isLoading ? 0.7 : 1, width: "100%" }}
                    >
                      {isLoading ? "Processing..." : currentTool.name}
                    </button>
                    <button type="button" onClick={() => setFiles([])} style={{ background: "transparent", color: "#64748b", border: "1px solid #cbd5e1", borderRadius: 8, padding: "12px", fontSize: 14, fontWeight: 600, cursor: "pointer", width: "100%" }}>
                      Start over
                    </button>
                    {message && <div style={{ color: "#e5322d", fontWeight: 600, textAlign: "center", marginTop: 10 }}>{message}</div>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)", padding: "52px 24px 28px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 36, marginBottom: 40 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <img src={dark ? "/image-dark.png" : "/image-copy.png"} alt="VPDFX" style={{ height: 44, objectFit: "contain" }} />
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.75, maxWidth: 220 }}>The all-in-one platform for all your file conversion, editing and download needs.</p>
              <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                {["𝕏", "📘", "📷", "💬"].map((icon) => (
                  <button key={icon} style={{ width: 34, height: 34, borderRadius: "50%", border: "1.5px solid var(--border)", background: "var(--bg-card2)", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 14 }}>Solutions</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a href="#" style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none" }}>PDF Editing</a>
                <a href="#" style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none" }}>Video Conversion</a>
                <a href="#" style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none" }}>Image Processing</a>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", marginBottom: 14 }}>Company</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <a href="#" style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none" }}>About Us</a>
                <a href="#" style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none" }}>Contact</a>
                <a href="#" style={{ fontSize: 13, color: "var(--text-secondary)", textDecoration: "none" }}>Pricing</a>
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
    </div>
  );
}
