"use client";
import React, { useState } from "react";
import { X, Upload, Plus, History, Save, RotateCcw, Clock, FileText, CheckCircle2, Download, Trash2, ShieldCheck, Sparkles, Wand2, FilePlus, Sparkle, LayoutGrid, Award, FileSpreadsheet, Presentation, Receipt, Sliders, Moon, Sun, Lock, Shield, Eye, Hash, Calendar, Pen, QrCode, FileCheck2, Settings2, Magnet, Ruler, Bell, Keyboard, Palette, FileDown, Layers, MousePointerClick, RefreshCw, ZoomIn, Check, Square, Type, Table, Stamp, GraduationCap, BookOpen, Quote, ListChecks, CheckSquare, FlaskConical, School, Building2, LineChart, BarChart2, PieChart, Image as ImageIcon, FileCode, BookmarkCheck } from "lucide-react";
import { CanvasTextElement, EditorPage } from "./types";

// Brand Kit Panel
export function BrandPanel({
  onClose,
  activeElementId,
  handleStyleChange,
}: {
  onClose: () => void;
  activeElementId: string | null;
  handleStyleChange: (prop: any, val: any) => void;
}) {
  return (
    <div className="fixed sm:static bottom-0 sm:bottom-auto inset-x-0 sm:inset-x-auto max-h-[75vh] sm:max-h-none w-full sm:w-[300px] h-auto sm:h-full bg-white border-t sm:border-t-0 sm:border-r border-gray-200 rounded-t-3xl sm:rounded-none p-5 flex flex-col gap-4 z-50 sm:z-20 shrink-0 overflow-y-auto animate-in slide-in-from-bottom-8 sm:slide-in-from-left-4 duration-200 shadow-2xl sm:shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800 text-lg">Brand Kit</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-md"
        >
          <X size={18} />
        </button>
      </div>
      <p className="text-xs text-gray-500">
        Apply unified brand colors and typography presets with a single click.
      </p>

      <div className="flex flex-col gap-3">
        <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Brand Color Palettes</span>
        {[
          { name: "Modern Tech", colors: ["#4f46e5", "#06b6d4", "#10b981", "#1e293b"] },
          { name: "Executive Corporate", colors: ["#1e3a8a", "#0284c7", "#475569", "#0f172a"] },
          { name: "Warm Sunset", colors: ["#ea580c", "#f59e0b", "#ec4899", "#831843"] },
          { name: "Minimalist Mono", colors: ["#111827", "#4b5563", "#9ca3af", "#e5e7eb"] },
        ].map((pal, idx) => (
          <div
            key={idx}
            className="p-3 border border-gray-200 hover:border-indigo-400 rounded-xl bg-gray-50/50 flex flex-col gap-2 cursor-pointer transition-all"
            onClick={() => {
              if (activeElementId) {
                handleStyleChange("color", pal.colors[0]);
              }
            }}
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-700">{pal.name}</span>
              <span className="text-[10px] text-gray-400">Click to apply</span>
            </div>
            <div className="flex gap-2">
              {pal.colors.map((c, ci) => (
                <div
                  key={ci}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (activeElementId) handleStyleChange("color", c);
                  }}
                  className="w-8 h-8 rounded-lg border border-black/10 shadow-2xs hover:scale-110 transition-transform cursor-pointer"
                  style={{ backgroundColor: c }}
                  title={`Apply color: ${c}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Uploads Panel
export function UploadsPanel({
  onClose,
  setElements,
  selectSingleElement,
}: {
  onClose: () => void;
  setElements: React.Dispatch<React.SetStateAction<CanvasTextElement[]>>;
  selectSingleElement: (id: string | null) => void;
}) {
  const [activeTab, setActiveTab] = useState<"upload" | "signatures" | "stamps">("upload");
  const [signerName, setSignerName] = useState<string>("Alex Morgan");
  const [signatureColor, setSignatureColor] = useState<string>("#1e3a8a");

  // Signatures presets
  const SIGNATURE_STYLES = [
    { font: "Georgia", style: "italic", label: "Classic Elegance" },
    { font: "Comic Sans MS", style: "italic", label: "Fluid Script" },
    { font: "Times New Roman", style: "italic", label: "Formal Executive" },
    { font: "Courier New", style: "normal", label: "Clean Monospace" },
  ];

  return (
    <div className="fixed sm:static bottom-0 sm:bottom-auto inset-x-0 sm:inset-x-auto max-h-[82vh] sm:max-h-none w-full sm:w-[320px] h-auto sm:h-full bg-white border-t sm:border-t-0 sm:border-r border-gray-200/90 rounded-t-3xl sm:rounded-none flex flex-col z-50 sm:z-20 shrink-0 shadow-2xl sm:shadow-none animate-in slide-in-from-bottom-6 sm:slide-in-from-left-4 duration-200 overflow-hidden">
      
      {/* Header with Title & Filter Pills */}
      <div className="p-4 pb-3 border-b border-gray-100 shrink-0 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Upload size={15} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base leading-tight">Uploads & Signatures</h3>
              <p className="text-[11px] text-gray-400">Logos, digital signs & stamps</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Filters */}
        <div className="flex p-0.5 bg-gray-100 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
              activeTab === "upload" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Upload
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("signatures")}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
              activeTab === "signatures" ? "bg-white text-indigo-600 shadow-xs" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Signatures
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("stamps")}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
              activeTab === "stamps" ? "bg-white text-indigo-600 shadow-xs" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Seals
          </button>
        </div>
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">

        {/* TAB 1: FILE UPLOAD */}
        {activeTab === "upload" && (
          <div className="space-y-4">
            <label className="border-2 border-dashed border-indigo-300 hover:border-indigo-500 bg-gradient-to-b from-indigo-50/40 to-purple-50/30 hover:to-indigo-50/70 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all shadow-2xs group">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-indigo-100 flex items-center justify-center group-hover:scale-105 transition-transform text-indigo-600">
                <Upload size={22} />
              </div>
              <span className="text-xs font-bold text-indigo-900 mt-1">Upload Image, Logo or Signature</span>
              <span className="text-[11px] text-gray-400">PNG, JPG, SVG, WebP supported</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      const dataUrl = reader.result as string;
                      const newId = `img_${Date.now()}`;
                      setElements(prev => [
                        ...prev,
                        {
                          id: newId,
                          text: f.name,
                          x: 140,
                          y: 180,
                          size: 14,
                          font: "Helvetica",
                          color: "transparent",
                          page: 0,
                          imageUrl: dataUrl,
                          width: 160,
                          height: 80,
                        }
                      ]);
                      selectSingleElement(newId);
                    };
                    reader.readAsDataURL(f);
                  }
                }}
              />
            </label>

            {/* Upload hints */}
            <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-100 space-y-1.5">
              <div className="text-[11px] font-bold text-gray-700">Supported Uses:</div>
              <ul className="text-[11px] text-gray-500 list-disc list-inside space-y-1">
                <li>Company logos for headers or letterheads</li>
                <li>Scanned handwritten signatures with transparent backgrounds</li>
                <li>Digital certification badges and watermarks</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: DIGITAL SIGNATURE GENERATOR */}
        {activeTab === "signatures" && (
          <div className="space-y-3.5">
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                Type Your Name
              </label>
              <input
                type="text"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                placeholder="Enter full name"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
            </div>

            {/* Signature Color Dots */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Ink Color</span>
              <div className="flex items-center gap-1.5">
                {[
                  { name: "Navy Blue", color: "#1e3a8a" },
                  { name: "Classic Black", color: "#0f172a" },
                  { name: "Royal Indigo", color: "#4338ca" },
                  { name: "Dark Red", color: "#991b1b" },
                ].map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setSignatureColor(c.color)}
                    style={{ backgroundColor: c.color }}
                    className={`w-5 h-5 rounded-full cursor-pointer transition-transform ${
                      signatureColor === c.color ? 'scale-125 ring-2 ring-offset-1 ring-indigo-400' : 'hover:scale-110'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Signature Previews */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Choose Signature Style
              </span>

              {SIGNATURE_STYLES.map((sig) => (
                <button
                  key={sig.label}
                  type="button"
                  onClick={() => {
                    const newId = `sig_${Date.now()}`;
                    setElements(prev => [
                      ...prev,
                      {
                        id: newId,
                        text: signerName || "Signature",
                        x: 160,
                        y: 350,
                        size: 26,
                        font: sig.font,
                        color: signatureColor,
                        page: 0,
                        italic: sig.style === "italic",
                        bold: true,
                      }
                    ]);
                    selectSingleElement(newId);
                  }}
                  className="w-full p-3.5 border border-gray-200/90 hover:border-indigo-400 bg-gray-50/70 hover:bg-indigo-50/40 rounded-xl text-left transition-all cursor-pointer shadow-2xs group flex items-center justify-between"
                >
                  <div>
                    <div
                      style={{
                        fontFamily: sig.font,
                        fontStyle: sig.style,
                        color: signatureColor,
                      }}
                      className="text-xl font-bold leading-tight"
                    >
                      {signerName || "Signature"}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">{sig.label}</div>
                  </div>
                  <Plus size={16} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: OFFICIAL SEALS & BADGES */}
        {activeTab === "stamps" && (
          <div className="space-y-3">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Official Document Seals
            </span>

            <div className="space-y-2">
              {/* Corporate Seal */}
              <button
                type="button"
                onClick={() => {
                  const newId = `seal_${Date.now()}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: newId,
                      text: "★ OFFICIAL SEAL ★\nVERIFIED DOCUMENT",
                      x: 160,
                      y: 220,
                      size: 11,
                      font: "Helvetica",
                      color: "#1e3a8a",
                      page: 0,
                      bold: true,
                      isShape: true,
                      shapeType: 'circle',
                      bgColor: "rgba(30, 58, 138, 0.08)",
                      borderColor: "#1e3a8a",
                      borderWidth: 2,
                      width: 90,
                      height: 90,
                    }
                  ]);
                  selectSingleElement(newId);
                }}
                className="w-full p-3 bg-gray-50/70 hover:bg-blue-50/40 border border-gray-200 hover:border-blue-300 rounded-xl flex items-center gap-3 transition-all cursor-pointer shadow-2xs group text-left"
              >
                <div className="w-10 h-10 rounded-full border-2 border-blue-900 bg-blue-50 flex items-center justify-center font-bold text-xs text-blue-900 shrink-0">
                  ★
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900 group-hover:text-blue-900">Round Official Seal</div>
                  <div className="text-[10px] text-gray-500">Circular corporate verification seal</div>
                </div>
              </button>

              {/* Notary Seal */}
              <button
                type="button"
                onClick={() => {
                  const newId = `notary_${Date.now()}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: newId,
                      text: "NOTARY PUBLIC\nSTATE CERTIFIED",
                      x: 160,
                      y: 220,
                      size: 11,
                      font: "Georgia",
                      color: "#854d0e",
                      page: 0,
                      bold: true,
                      isShape: true,
                      shapeType: 'roundedRect',
                      bgColor: "rgba(234, 179, 8, 0.12)",
                      borderColor: "#ca8a04",
                      borderWidth: 2,
                      width: 140,
                      height: 50,
                    }
                  ]);
                  selectSingleElement(newId);
                }}
                className="w-full p-3 bg-gray-50/70 hover:bg-amber-50/40 border border-gray-200 hover:border-amber-300 rounded-xl flex items-center gap-3 transition-all cursor-pointer shadow-2xs group text-left"
              >
                <div className="w-10 h-10 rounded-lg border-2 border-amber-700 bg-amber-50 flex items-center justify-center font-bold text-xs text-amber-800 shrink-0">
                  ⚖
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900 group-hover:text-amber-900">Notary Certification</div>
                  <div className="text-[10px] text-gray-500">Legal notary stamp block</div>
                </div>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Draw & Highlight Panel
export function DrawPanel({
  onClose,
  elements,
  setElements,
  selectSingleElement,
}: {
  onClose: () => void;
  elements: CanvasTextElement[];
  setElements: React.Dispatch<React.SetStateAction<CanvasTextElement[]>>;
  selectSingleElement: (id: string | null) => void;
}) {
  const [activeTab, setActiveTab] = useState<"all" | "highlighter" | "pen" | "redact">("all");
  const [highlighterHeight, setHighlighterHeight] = useState<number>(20);

  const HIGHLIGHTERS = [
    { name: "Yellow", bg: "rgba(253, 224, 71, 0.45)", dot: "#eab308", border: "border-yellow-200", boxBg: "bg-yellow-50/60" },
    { name: "Green", bg: "rgba(34, 197, 94, 0.35)", dot: "#22c55e", border: "border-emerald-200", boxBg: "bg-emerald-50/60" },
    { name: "Pink", bg: "rgba(244, 114, 182, 0.4)", dot: "#ec4899", border: "border-pink-200", boxBg: "bg-pink-50/60" },
    { name: "Cyan", bg: "rgba(56, 189, 248, 0.4)", dot: "#06b6d4", border: "border-cyan-200", boxBg: "bg-cyan-50/60" },
    { name: "Orange", bg: "rgba(251, 146, 60, 0.4)", dot: "#f97316", border: "border-orange-200", boxBg: "bg-orange-50/60" },
    { name: "Purple", bg: "rgba(192, 132, 252, 0.38)", dot: "#a855f7", border: "border-purple-200", boxBg: "bg-purple-50/60" },
  ];

  return (
    <div className="fixed sm:static bottom-0 sm:bottom-auto inset-x-0 sm:inset-x-auto max-h-[82vh] sm:max-h-none w-full sm:w-[320px] h-auto sm:h-full bg-white border-t sm:border-t-0 sm:border-r border-gray-200/90 rounded-t-3xl sm:rounded-none flex flex-col z-50 sm:z-20 shrink-0 shadow-2xl sm:shadow-none animate-in slide-in-from-bottom-6 sm:slide-in-from-left-4 duration-200 overflow-hidden">
      
      {/* Header with Title & Filter Pills */}
      <div className="p-4 pb-3 border-b border-gray-100 shrink-0 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <span className="text-sm">🖍</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base leading-tight">Draw & Highlight</h3>
              <p className="text-[11px] text-gray-400">Highlighters, pens & redaction boxes</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Filter Pills */}
        <div className="flex p-0.5 bg-gray-100 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
              activeTab === "all" ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("highlighter")}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
              activeTab === "highlighter" ? "bg-white text-indigo-600 shadow-xs" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Markers
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pen")}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
              activeTab === "pen" ? "bg-white text-indigo-600 shadow-xs" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Pens
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("redact")}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
              activeTab === "redact" ? "bg-white text-indigo-600 shadow-xs" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Redact
          </button>
        </div>
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">

        {/* SECTION 1: HIGHLIGHTER MARKERS */}
        {(activeTab === "all" || activeTab === "highlighter") && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">Translucent Highlighters</span>
              {/* Thickness selector */}
              <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-[10px] font-semibold text-gray-600">
                <button
                  type="button"
                  onClick={() => setHighlighterHeight(14)}
                  className={`px-1.5 py-0.5 rounded ${highlighterHeight === 14 ? 'bg-white text-indigo-600 font-bold shadow-2xs' : 'hover:text-gray-900'}`}
                  title="Thin highlighter (14px)"
                >
                  S
                </button>
                <button
                  type="button"
                  onClick={() => setHighlighterHeight(20)}
                  className={`px-1.5 py-0.5 rounded ${highlighterHeight === 20 ? 'bg-white text-indigo-600 font-bold shadow-2xs' : 'hover:text-gray-900'}`}
                  title="Medium highlighter (20px)"
                >
                  M
                </button>
                <button
                  type="button"
                  onClick={() => setHighlighterHeight(30)}
                  className={`px-1.5 py-0.5 rounded ${highlighterHeight === 30 ? 'bg-white text-indigo-600 font-bold shadow-2xs' : 'hover:text-gray-900'}`}
                  title="Large highlighter (30px)"
                >
                  L
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {HIGHLIGHTERS.map((hl) => (
                <button
                  key={hl.name}
                  type="button"
                  onClick={() => {
                    const newId = `hl_${Date.now()}`;
                    setElements(prev => [
                      ...prev,
                      {
                        id: newId,
                        text: "",
                        x: 100,
                        y: 180 + (elements.length * 20),
                        size: 14,
                        font: "Helvetica",
                        color: "transparent",
                        page: 0,
                        isShape: true,
                        shapeType: 'rect',
                        bgColor: hl.bg,
                        borderColor: "transparent",
                        borderWidth: 0,
                        width: 220,
                        height: highlighterHeight,
                      }
                    ]);
                    selectSingleElement(newId);
                  }}
                  className={`p-2.5 border ${hl.border} ${hl.boxBg} hover:opacity-90 rounded-xl flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs group active:scale-[0.98]`}
                >
                  <div
                    className="w-4 h-4 rounded-full shrink-0 shadow-2xs border border-white"
                    style={{ backgroundColor: hl.dot }}
                  />
                  <div className="text-left">
                    <div className="text-xs font-bold text-gray-800">{hl.name}</div>
                    <div className="text-[10px] text-gray-500">Translucent</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: PEN MARKINGS & ACCENTS */}
        {(activeTab === "all" || activeTab === "pen") && (
          <div className="pt-2 border-t border-gray-100 space-y-2.5">
            <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">Pen Lines & Annotations</span>

            <div className="grid grid-cols-2 gap-2">
              {/* Red Underline */}
              <button
                type="button"
                onClick={() => {
                  const newId = `pen_line_${Date.now()}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: newId,
                      text: "",
                      x: 100,
                      y: 200,
                      size: 14,
                      font: "Helvetica",
                      color: "#ef4444",
                      page: 0,
                      isShape: true,
                      shapeType: 'line',
                      bgColor: "transparent",
                      borderColor: "#ef4444",
                      borderWidth: 3,
                      borderStyle: 'solid',
                      width: 180,
                      height: 3,
                    }
                  ]);
                  selectSingleElement(newId);
                }}
                className="p-3 border border-red-200/90 bg-red-50/40 hover:bg-red-100/50 rounded-xl flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs active:scale-[0.98]"
              >
                <div className="w-6 h-6 rounded-lg bg-red-500 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                  ✏️
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-gray-900">Red Underline</div>
                  <div className="text-[10px] text-gray-500">3px Accent</div>
                </div>
              </button>

              {/* Blue Underline */}
              <button
                type="button"
                onClick={() => {
                  const newId = `pen_line_${Date.now()}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: newId,
                      text: "",
                      x: 100,
                      y: 200,
                      size: 14,
                      font: "Helvetica",
                      color: "#2563eb",
                      page: 0,
                      isShape: true,
                      shapeType: 'line',
                      bgColor: "transparent",
                      borderColor: "#2563eb",
                      borderWidth: 3,
                      borderStyle: 'solid',
                      width: 180,
                      height: 3,
                    }
                  ]);
                  selectSingleElement(newId);
                }}
                className="p-3 border border-blue-200/90 bg-blue-50/40 hover:bg-blue-100/50 rounded-xl flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs active:scale-[0.98]"
              >
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                  ✏️
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-gray-900">Blue Underline</div>
                  <div className="text-[10px] text-gray-500">3px Accent</div>
                </div>
              </button>

              {/* Green Underline */}
              <button
                type="button"
                onClick={() => {
                  const newId = `pen_line_${Date.now()}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: newId,
                      text: "",
                      x: 100,
                      y: 200,
                      size: 14,
                      font: "Helvetica",
                      color: "#16a34a",
                      page: 0,
                      isShape: true,
                      shapeType: 'line',
                      bgColor: "transparent",
                      borderColor: "#16a34a",
                      borderWidth: 3,
                      borderStyle: 'solid',
                      width: 180,
                      height: 3,
                    }
                  ]);
                  selectSingleElement(newId);
                }}
                className="p-3 border border-emerald-200/90 bg-emerald-50/40 hover:bg-emerald-100/50 rounded-xl flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs active:scale-[0.98]"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                  ✏️
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-gray-900">Green Line</div>
                  <div className="text-[10px] text-gray-500">3px Accent</div>
                </div>
              </button>

              {/* Dashed Attention Line */}
              <button
                type="button"
                onClick={() => {
                  const newId = `pen_line_${Date.now()}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: newId,
                      text: "",
                      x: 100,
                      y: 200,
                      size: 14,
                      font: "Helvetica",
                      color: "#f59e0b",
                      page: 0,
                      isShape: true,
                      shapeType: 'line',
                      bgColor: "transparent",
                      borderColor: "#f59e0b",
                      borderWidth: 2,
                      borderStyle: 'dashed',
                      width: 180,
                      height: 2,
                    }
                  ]);
                  selectSingleElement(newId);
                }}
                className="p-3 border border-amber-200/90 bg-amber-50/40 hover:bg-amber-100/50 rounded-xl flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs active:scale-[0.98]"
              >
                <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                  〰
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-gray-900">Dashed Line</div>
                  <div className="text-[10px] text-gray-500">Attention Box</div>
                </div>
              </button>
            </div>

            {/* Quick Checkmark & Cross Stamps */}
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const newId = `mark_${Date.now()}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: newId,
                      text: "✓",
                      x: 150,
                      y: 200,
                      size: 28,
                      font: "Helvetica",
                      color: "#16a34a",
                      page: 0,
                      bold: true,
                    }
                  ]);
                  selectSingleElement(newId);
                }}
                className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="text-base font-black">✓</span>
                <span>Checkmark</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const newId = `mark_${Date.now()}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: newId,
                      text: "✗",
                      x: 150,
                      y: 200,
                      size: 28,
                      font: "Helvetica",
                      color: "#dc2626",
                      page: 0,
                      bold: true,
                    }
                  ]);
                  selectSingleElement(newId);
                }}
                className="flex-1 py-2 px-3 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="text-base font-black">✗</span>
                <span>Cross Mark</span>
              </button>
            </div>
          </div>
        )}

        {/* SECTION 3: REDACTION & WHITEOUT */}
        {(activeTab === "all" || activeTab === "redact") && (
          <div className="pt-2 border-t border-gray-100 space-y-2.5">
            <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">Privacy & Redaction</span>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Black Redact */}
              <button
                type="button"
                onClick={() => {
                  const newId = `redact_black_${Date.now()}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: newId,
                      text: "",
                      x: 120,
                      y: 200,
                      size: 14,
                      font: "Helvetica",
                      color: "transparent",
                      page: 0,
                      isShape: true,
                      shapeType: 'rect',
                      bgColor: "#000000",
                      borderColor: "#000000",
                      borderWidth: 0,
                      width: 160,
                      height: 24,
                    }
                  ]);
                  selectSingleElement(newId);
                }}
                className="p-3 border border-gray-300 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs active:scale-[0.98]"
              >
                <div className="w-6 h-6 rounded-md bg-black text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                  ⬛
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-gray-900">Black Redact</div>
                  <div className="text-[10px] text-gray-500">Hide text/numbers</div>
                </div>
              </button>

              {/* Whiteout Box */}
              <button
                type="button"
                onClick={() => {
                  const newId = `whiteout_${Date.now()}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: newId,
                      text: "",
                      x: 120,
                      y: 200,
                      size: 14,
                      font: "Helvetica",
                      color: "transparent",
                      page: 0,
                      isShape: true,
                      shapeType: 'rect',
                      bgColor: "#ffffff",
                      borderColor: "#e2e8f0",
                      borderWidth: 1,
                      width: 160,
                      height: 24,
                    }
                  ]);
                  selectSingleElement(newId);
                }}
                className="p-3 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs active:scale-[0.98]"
              >
                <div className="w-6 h-6 rounded-md bg-white border border-gray-300 text-gray-700 flex items-center justify-center font-bold text-xs shadow-2xs">
                  ⬜
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-gray-900">Whiteout Box</div>
                  <div className="text-[10px] text-gray-500">Cover & rewrite</div>
                </div>
              </button>

              {/* Gray Mask */}
              <button
                type="button"
                onClick={() => {
                  const newId = `mask_gray_${Date.now()}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: newId,
                      text: "",
                      x: 120,
                      y: 200,
                      size: 14,
                      font: "Helvetica",
                      color: "transparent",
                      page: 0,
                      isShape: true,
                      shapeType: 'rect',
                      bgColor: "rgba(100, 116, 139, 0.4)",
                      borderColor: "#94a3b8",
                      borderWidth: 1,
                      borderStyle: "dashed",
                      width: 160,
                      height: 24,
                    }
                  ]);
                  selectSingleElement(newId);
                }}
                className="p-3 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-xl flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs active:scale-[0.98]"
              >
                <div className="w-6 h-6 rounded-md bg-slate-400 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                  ░
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-gray-900">Muted Mask</div>
                  <div className="text-[10px] text-gray-500">Subtle shaded cover</div>
                </div>
              </button>

              {/* Yellow Marker Redact */}
              <button
                type="button"
                onClick={() => {
                  const newId = `alert_box_${Date.now()}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: newId,
                      text: "⚠️ REVIEW REQUIRED",
                      x: 120,
                      y: 200,
                      size: 12,
                      font: "Helvetica",
                      color: "#b45309",
                      page: 0,
                      bold: true,
                      isShape: true,
                      shapeType: 'rect',
                      bgColor: "rgba(254, 240, 138, 0.5)",
                      borderColor: "#f59e0b",
                      borderWidth: 1,
                      width: 170,
                      height: 28,
                    }
                  ]);
                  selectSingleElement(newId);
                }}
                className="p-3 border border-amber-200 bg-amber-50 hover:bg-amber-100 rounded-xl flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs active:scale-[0.98]"
              >
                <div className="w-6 h-6 rounded-md bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                  ⚠️
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-gray-900">Review Box</div>
                  <div className="text-[10px] text-gray-500">Alert highlight</div>
                </div>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Projects & History Panel
export function ProjectsPanel({
  onClose,
  file,
  pagesCount,
  elementsCount,
  onSavePdf,
  elements = [],
  setElements,
}: {
  onClose: () => void;
  file: File | null;
  pagesCount: number;
  elementsCount: number;
  onSavePdf: () => void;
  elements?: CanvasTextElement[];
  setElements?: React.Dispatch<React.SetStateAction<CanvasTextElement[]>>;
}) {
  const [activeTab, setActiveTab] = useState<"project" | "history">("project");
  const [revisions, setRevisions] = useState<Array<{ id: string; name: string; time: string; count: number; data: CanvasTextElement[] }>>([
    {
      id: "rev-init",
      name: "Initial Document Baseline",
      time: "Original upload",
      count: 0,
      data: [],
    },
  ]);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Manual snapshot creation
  const handleSaveRevision = () => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newRev = {
      id: `rev-${Date.now()}`,
      name: `Revision #${revisions.length + 1} (${elementsCount} element${elementsCount === 1 ? '' : 's'})`,
      time: timeStr,
      count: elementsCount,
      data: [...elements],
    };
    setRevisions(prev => [newRev, ...prev]);
    setSaveSuccessMsg("Snapshot saved successfully!");
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleRestoreRevision = (rev: { id: string; name: string; count: number; data: CanvasTextElement[] }) => {
    if (setElements) {
      setElements([...rev.data]);
      setSaveSuccessMsg(`Restored "${rev.name}"`);
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }
  };

  return (
    <div className="fixed sm:static bottom-0 sm:bottom-auto inset-x-0 sm:inset-x-auto max-h-[85vh] sm:max-h-none w-full sm:w-[320px] h-auto sm:h-full bg-white border-t sm:border-t-0 sm:border-r border-gray-200 rounded-t-3xl sm:rounded-none p-5 flex flex-col gap-4 z-50 sm:z-20 shrink-0 overflow-y-auto animate-in slide-in-from-bottom-8 sm:slide-in-from-left-4 duration-200 shadow-2xl sm:shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <History size={16} />
          </div>
          <h3 className="font-bold text-gray-800 text-base">Projects & History</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-md transition-colors"
          title="Close panel"
        >
          <X size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveTab("project")}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
            activeTab === "project" ? "bg-white text-indigo-700 shadow-xs" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Active Project
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("history")}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "history" ? "bg-white text-indigo-700 shadow-xs" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <span>History</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-50 text-indigo-600 font-bold border border-indigo-100">
            {revisions.length}
          </span>
        </button>
      </div>

      {saveSuccessMsg && (
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold animate-in fade-in duration-200">
          <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* TAB 1: ACTIVE PROJECT METADATA & ACTIONS */}
      {activeTab === "project" && (
        <div className="flex flex-col gap-4">
          {/* Active File Card */}
          <div className="p-3.5 border border-indigo-100 rounded-2xl bg-gradient-to-br from-indigo-50/60 to-purple-50/30">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider">Active Document</span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-white/80 border border-emerald-100 px-2 py-0.5 rounded-full shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Editing
              </span>
            </div>
            <div className="text-sm font-bold text-gray-900 truncate" title={file?.name || "Untitled Document.pdf"}>
              {file?.name || "Untitled Document.pdf"}
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-indigo-100/70 text-center">
              <div className="bg-white/90 p-2 rounded-xl border border-indigo-100/60">
                <div className="text-base font-extrabold text-indigo-700">{pagesCount}</div>
                <div className="text-[10px] font-semibold text-gray-500 uppercase">Pages</div>
              </div>
              <div className="bg-white/90 p-2 rounded-xl border border-indigo-100/60">
                <div className="text-base font-extrabold text-purple-700">{elementsCount}</div>
                <div className="text-[10px] font-semibold text-gray-500 uppercase">Elements</div>
              </div>
            </div>
          </div>

          {/* Quick Snapshot Action */}
          <div className="p-3.5 border border-gray-200 rounded-2xl bg-gray-50/70 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-800">Save Snapshot</span>
              <Sparkles size={14} className="text-indigo-500" />
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Capture a milestone snapshot of your current text, shapes, and positions so you can revert anytime.
            </p>
            <button
              type="button"
              onClick={handleSaveRevision}
              className="w-full py-2 px-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 hover:text-indigo-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <Save size={13} className="text-indigo-600" />
              <span>Save Current Version</span>
            </button>
          </div>

          {/* Export Action */}
          <div className="flex flex-col gap-2 pt-1">
            <button
              type="button"
              onClick={onSavePdf}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Download size={14} />
              <span>Export & Download Document</span>
            </button>
            <span className="text-[10px] text-center text-gray-400">
              Generates high-resolution vector PDF with embedded fonts & assets
            </span>
          </div>
        </div>
      )}

      {/* TAB 2: REVISION HISTORY LIST */}
      {activeTab === "history" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-700">Milestone Revisions</span>
            <button
              type="button"
              onClick={handleSaveRevision}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <Plus size={12} />
              <span>New</span>
            </button>
          </div>

          <div className="flex flex-col gap-2 max-h-[360px] overflow-y-auto hide-scrollbar pr-0.5">
            {revisions.map((rev, idx) => (
              <div
                key={rev.id}
                className="p-3 bg-white border border-gray-200 hover:border-indigo-300 rounded-2xl shadow-2xs hover:shadow-xs transition-all flex flex-col gap-2 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                      {rev.name}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-0.5">
                      <Clock size={11} />
                      <span>{rev.time}</span>
                      <span>•</span>
                      <span>{rev.count} element(s)</span>
                    </div>
                  </div>
                  {idx === 0 && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100">
                      Latest
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => handleRestoreRevision(rev)}
                    className="px-2.5 py-1 bg-gray-50 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Restore this version"
                  >
                    <RotateCcw size={11} />
                    <span>Restore</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-2">
            <ShieldCheck size={16} className="text-indigo-600 shrink-0" />
            <span className="text-[11px] text-gray-500">
              Revisions are saved directly in your current session for instant undo and safe experimentation.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Settings & Connected Tools Panel
export function AppsPanel({
  onClose,
  renderedDimensions,
  setElements,
  selectSingleElement,
  showPageBorderRulers = false,
  setShowPageBorderRulers,
  showMargins = false,
  setShowMargins,
  customGuides = [],
  setCustomGuides,
}: {
  onClose: () => void;
  renderedDimensions: { width: number; height: number };
  setElements: React.Dispatch<React.SetStateAction<CanvasTextElement[]>>;
  selectSingleElement: (id: string | null) => void;
  showPageBorderRulers?: boolean;
  setShowPageBorderRulers?: (val: boolean) => void;
  showMargins?: boolean;
  setShowMargins?: (val: boolean) => void;
  customGuides?: Array<{ id: string; orientation: 'horizontal' | 'vertical'; position: number; pageIndex?: number }>;
  setCustomGuides?: React.Dispatch<React.SetStateAction<Array<{ id: string; orientation: 'horizontal' | 'vertical'; position: number; pageIndex?: number }>>>;
}) {
  const [activeTab, setActiveTab] = useState<"tools" | "settings">("tools");
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [highQualityPreview, setHighQualityPreview] = useState(true);
  const [customQrText, setCustomQrText] = useState("https://vpdfx.com");

  const CONNECTED_TOOLS = [
    {
      icon: <Hash size={18} className="text-indigo-600" />,
      title: "Page Numbering",
      desc: "Auto-generate Page X of Y on all pages",
      badge: "Header/Footer",
      action: () => {
        const newId = `pagenum_${Date.now()}`;
        setElements(prev => [
          ...prev,
          {
            id: newId,
            text: "Page 1",
            x: renderedDimensions.width > 0 ? renderedDimensions.width - 100 : 480,
            y: renderedDimensions.height > 0 ? renderedDimensions.height - 40 : 800,
            size: 11,
            font: "Helvetica",
            color: "#6b7280",
            page: 0,
            repeatAllPages: true,
          }
        ]);
        selectSingleElement(newId);
      }
    },
    {
      icon: <Calendar size={18} className="text-emerald-600" />,
      title: "Date Stamp",
      desc: "Insert live formatted date stamp",
      badge: "Metadata",
      action: () => {
        const todayStr = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        const newId = `date_${Date.now()}`;
        setElements(prev => [
          ...prev,
          {
            id: newId,
            text: `Date: ${todayStr}`,
            x: 40,
            y: 70,
            size: 11,
            font: "Helvetica",
            color: "#4b5563",
            page: 0,
          }
        ]);
        selectSingleElement(newId);
      }
    },
    {
      icon: <Pen size={18} className="text-purple-600" />,
      title: "Signature Line",
      desc: "Formal signer line with title and line separator",
      badge: "Legal",
      action: () => {
        const newId = `sigline_${Date.now()}`;
        setElements(prev => [
          ...prev,
          {
            id: newId,
            text: "_________________________\nAuthorized Signature",
            x: 60,
            y: 720,
            size: 12,
            font: "Helvetica",
            color: "#374151",
            page: 0,
          }
        ]);
        selectSingleElement(newId);
      }
    },
    {
      icon: <QrCode size={18} className="text-blue-600" />,
      title: "Dynamic QR Code Badge",
      desc: "Generate scannable QR badge linked to any URL",
      badge: "Interactive",
      action: () => {
        const newId = `qr_${Date.now()}`;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(customQrText)}`;
        setElements(prev => [
          ...prev,
          {
            id: newId,
            text: "QR Code",
            x: 420,
            y: 690,
            size: 10,
            font: "Helvetica",
            color: "#000000",
            page: 0,
            imageUrl: qrUrl,
            width: 100,
            height: 100,
          }
        ]);
        selectSingleElement(newId);
      }
    },
    {
      icon: <ShieldCheck size={18} className="text-red-600" />,
      title: "Confidential Watermark",
      desc: "Diagonal translucent security stamp across page",
      badge: "Security",
      action: () => {
        const newId = `wm_${Date.now()}`;
        setElements(prev => [
          ...prev,
          {
            id: newId,
            text: "CONFIDENTIAL",
            x: 90,
            y: 380,
            size: 48,
            font: "Helvetica",
            color: "#dc2626",
            opacity: 0.15,
            bold: true,
            page: 0,
            repeatAllPages: true,
            width: 420,
            align: "center",
          }
        ]);
        selectSingleElement(newId);
      }
    },
    {
      icon: <FileCheck2 size={18} className="text-teal-600" />,
      title: "Approved Stamp",
      desc: "Digital green approval badge with current timestamp",
      badge: "Workflow",
      action: () => {
        const newId = `stamp_${Date.now()}`;
        setElements(prev => [
          ...prev,
          {
            id: newId,
            text: `✔ APPROVED\n${new Date().toLocaleDateString()}`,
            x: 400,
            y: 80,
            size: 13,
            font: "Helvetica",
            color: "#059669",
            bold: true,
            page: 0,
            width: 140,
            align: "center",
          }
        ]);
        selectSingleElement(newId);
      }
    },
  ];

  return (
    <div className="fixed sm:static bottom-0 sm:bottom-auto inset-x-0 sm:inset-x-auto max-h-[85vh] sm:max-h-none w-full sm:w-[320px] h-auto sm:h-full bg-white border-t sm:border-t-0 sm:border-r border-gray-200 rounded-t-3xl sm:rounded-none p-5 flex flex-col gap-4 z-50 sm:z-20 shrink-0 overflow-y-auto animate-in slide-in-from-bottom-8 sm:slide-in-from-left-4 duration-200 shadow-2xl sm:shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Settings2 size={16} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-base">Settings & Tools</h3>
            <span className="text-[10px] text-gray-400">Connected utilities & preferences</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-md transition-colors"
          title="Close panel"
        >
          <X size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveTab("tools")}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
            activeTab === "tools" ? "bg-white text-indigo-700 shadow-xs" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Connected Tools
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("settings")}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
            activeTab === "settings" ? "bg-white text-indigo-700 shadow-xs" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Canvas Settings
        </button>
      </div>

      {/* TAB 1: CONNECTED TOOLS */}
      {activeTab === "tools" && (
        <div className="flex flex-col gap-3">
          {/* QR Code quick input */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">QR Code Target URL</span>
            <input
              type="text"
              value={customQrText}
              onChange={(e) => setCustomQrText(e.target.value)}
              placeholder="https://..."
              className="text-xs px-2.5 py-1.5 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            {CONNECTED_TOOLS.map((tool, idx) => (
              <div
                key={idx}
                onClick={tool.action}
                className="p-3 border border-gray-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/40 rounded-2xl cursor-pointer transition-all flex items-start gap-3 group shadow-2xs hover:shadow-xs active:scale-[0.99]"
              >
                <div className="p-2 rounded-xl bg-gray-50 border border-gray-100 group-hover:bg-white group-hover:shadow-2xs transition-all shrink-0">
                  {tool.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="font-bold text-xs text-gray-800 group-hover:text-indigo-600 transition-colors truncate">
                      {tool.title}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-md bg-gray-100 text-gray-500 shrink-0">
                      {tool.badge}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400 leading-snug">
                    {tool.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CANVAS SETTINGS & WORKSPACE PREFERENCES */}
      {activeTab === "settings" && (
        <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto hide-scrollbar pr-0.5">
          {/* Quick Reset to Default Settings Bar */}
          <div className="flex items-center justify-between p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
              <RefreshCw size={13} className="text-indigo-600" />
              <span>Default Configuration</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setSnapEnabled(true);
                setHighQualityPreview(true);
                if (setShowMargins) setShowMargins(false);
                if (setShowPageBorderRulers) setShowPageBorderRulers(false);
                if (setCustomGuides) setCustomGuides([]);
              }}
              className="text-[11px] font-bold px-2 py-1 bg-white hover:bg-indigo-600 text-indigo-700 hover:text-white rounded-lg border border-indigo-200 transition-all cursor-pointer shadow-2xs"
              title="Reset all toggles to recommended defaults"
            >
              Reset to Defaults
            </button>
          </div>

          {/* Section 1: Display & Canvas Helpers */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Canvas Display & Alignment
            </span>

            {/* Page Border Rulers & Measurement Scale */}
            <div className="p-3 bg-white border border-gray-200 rounded-2xl shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Ruler size={17} className="text-indigo-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-gray-800">Show Rulers & Guides (Inch)</div>
                  <div className="text-[10px] text-gray-400">Canva-style border ruler in inches (1/8&quot;, 1/4&quot;, 1/2&quot;, 1&quot;)</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={showPageBorderRulers}
                onChange={(e) => setShowPageBorderRulers && setShowPageBorderRulers(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Magnetic Guides */}
            <div className="p-3 bg-white border border-gray-200 rounded-2xl shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Magnet size={17} className="text-indigo-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-gray-800">Magnetic Snap Guides</div>
                  <div className="text-[10px] text-gray-400">Pink guides snap to center, margins & edges</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={snapEnabled}
                onChange={(e) => setSnapEnabled(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded cursor-pointer accent-indigo-600"
              />
            </div>

            {/* High-DPI Rendering */}
            <div className="p-3 bg-white border border-gray-200 rounded-2xl shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Eye size={17} className="text-purple-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-gray-800">High-DPI Retina Preview</div>
                  <div className="text-[10px] text-gray-400">2× supersampling for razor sharp text</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={highQualityPreview}
                onChange={(e) => setHighQualityPreview(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Print Margins & Bleed */}
            <div className="p-3 bg-white border border-gray-200 rounded-2xl shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <LayoutGrid size={17} className="text-emerald-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-gray-800">Print Margins (0.5 in)</div>
                  <div className="text-[10px] text-gray-400">Visual safety margin lines on page boundaries</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={showMargins}
                onChange={(e) => setShowMargins && setShowMargins(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Custom Guide Lines Manager */}
            <div className="p-3 bg-white border border-gray-200 rounded-2xl shadow-2xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Ruler size={17} className="text-indigo-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-gray-800">Custom Guide Lines</div>
                    <div className="text-[10px] text-gray-400">Drag from rulers or add guide markers</div>
                  </div>
                </div>
                {customGuides.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCustomGuides && setCustomGuides([])}
                    className="text-[10px] font-bold text-rose-500 hover:text-rose-600 cursor-pointer px-2 py-0.5 rounded bg-rose-50 border border-rose-200/60"
                  >
                    Clear All ({customGuides.length})
                  </button>
                )}
              </div>

              {/* Quick Add Guide Buttons */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const pw = renderedDimensions.width > 0 ? renderedDimensions.width : 595;
                    if (setCustomGuides) {
                      setCustomGuides(prev => [
                        ...prev,
                        { id: `g_vcenter_${Date.now()}`, orientation: 'vertical', position: Math.round(pw / 2) }
                      ]);
                    }
                  }}
                  className="px-2.5 py-1.5 bg-indigo-50/70 hover:bg-indigo-100/70 text-indigo-700 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer border border-indigo-200/50 transition-colors"
                >
                  <span>+ Vertical Center</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const ph = renderedDimensions.height > 0 ? renderedDimensions.height : 842;
                    if (setCustomGuides) {
                      setCustomGuides(prev => [
                        ...prev,
                        { id: `g_hcenter_${Date.now()}`, orientation: 'horizontal', position: Math.round(ph / 2) }
                      ]);
                    }
                  }}
                  className="px-2.5 py-1.5 bg-indigo-50/70 hover:bg-indigo-100/70 text-indigo-700 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer border border-indigo-200/50 transition-colors"
                >
                  <span>+ Horizontal Center</span>
                </button>
              </div>

              <div className="text-[10px] text-gray-400 italic">
                Tip: Click and drag anywhere directly from the top or left inch ruler onto your canvas to position a guide line.
              </div>
            </div>
          </div>

          {/* Section 2: Editing & Interaction Preferences */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Editing & Interaction
            </span>

            {/* Double-Click to Edit Text */}
            <div className="p-3 bg-white border border-gray-200 rounded-2xl shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MousePointerClick size={17} className="text-blue-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-gray-800">Double-Click Text Editing</div>
                  <div className="text-[10px] text-gray-400">Single click moves bounding box; double-click edits text</div>
                </div>
              </div>
              <input
                type="checkbox"
                defaultChecked={true}
                className="w-4 h-4 text-indigo-600 rounded cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Auto-Save Session Milestones */}
            <div className="p-3 bg-white border border-gray-200 rounded-2xl shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <RefreshCw size={17} className="text-teal-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-gray-800">Session Auto-Save</div>
                  <div className="text-[10px] text-gray-400">Automatically creates revision points on page edits</div>
                </div>
              </div>
              <input
                type="checkbox"
                defaultChecked={true}
                className="w-4 h-4 text-indigo-600 rounded cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Arrow Nudge Precision */}
            <div className="p-3 bg-white border border-gray-200 rounded-2xl shadow-2xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Sliders size={17} className="text-indigo-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-gray-800">Arrow Key Nudge Step</div>
                    <div className="text-[10px] text-gray-400">Arrow keys: 1 pt • Shift + Arrow: 10 pt</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  1 pt / 10 pt
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Keyboard Shortcuts Quick Cheat Sheet */}
          <div className="p-3.5 bg-gradient-to-br from-gray-50 to-indigo-50/30 rounded-2xl border border-gray-200 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                <Keyboard size={14} className="text-indigo-600" />
                <span>Shortcuts Cheat Sheet</span>
              </div>
              <span className="text-[9px] font-semibold text-gray-400">Windows / Mac</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1">
              <div className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-gray-100">
                <span className="text-gray-500">Duplicate</span>
                <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-mono font-bold text-gray-700">Ctrl+D</kbd>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-gray-100">
                <span className="text-gray-500">Group / Ungroup</span>
                <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-mono font-bold text-gray-700">Ctrl+G</kbd>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-gray-100">
                <span className="text-gray-500">Select All</span>
                <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-mono font-bold text-gray-700">Ctrl+A</kbd>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-white rounded-lg border border-gray-100">
                <span className="text-gray-500">Copy / Paste</span>
                <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-mono font-bold text-gray-700">Ctrl+C / V</kbd>
              </div>
            </div>
          </div>

          {/* Section 4: Document Specs & Engine Info */}
          <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
              <ShieldCheck size={14} className="text-indigo-600" />
              <span>Document Engine Specs</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600">
              <div className="bg-white p-2 rounded-xl border border-gray-100">
                <span className="text-gray-400 block text-[9px] uppercase font-bold">Standard Page</span>
                <span className="font-semibold text-gray-800">
                  {renderedDimensions.width > 0 ? `${Math.round(renderedDimensions.width)} × ${Math.round(renderedDimensions.height)} pt` : "595 × 842 pt (A4)"}
                </span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-gray-100">
                <span className="text-gray-400 block text-[9px] uppercase font-bold">Color Profile</span>
                <span className="font-semibold text-gray-800">sRGB / 24-bit TrueColor</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-gray-100">
                <span className="text-gray-400 block text-[9px] uppercase font-bold">Export Architecture</span>
                <span className="font-semibold text-gray-800">PDF-Lib Vector Engine</span>
              </div>
              <div className="bg-white p-2 rounded-xl border border-gray-100">
                <span className="text-gray-400 block text-[9px] uppercase font-bold">Viewer Standard</span>
                <span className="font-semibold text-gray-800">PDF.js Canvas Renderer</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Create Panel - Canva Style Document Creator
export function CreatePanel({
  onClose,
  startBlankDocument,
  addTextElement,
  setElements,
  selectSingleElement,
  addNewPage,
  openTemplatesTab,
}: {
  onClose: () => void;
  startBlankDocument: () => Promise<void> | void;
  addTextElement: (type: "heading" | "subheading" | "body" | "header" | "footer", targetPage?: number) => void;
  setElements: React.Dispatch<React.SetStateAction<CanvasTextElement[]>>;
  selectSingleElement: (id: string | null) => void;
  addNewPage?: () => void;
  openTemplatesTab?: () => void;
}) {
  const [createMode, setCreateMode] = useState<"basic" | "student" | "advanced">("basic");
  // Student dynamic custom layout generator states
  const [collegeName, setCollegeName] = useState("HARVARD UNIVERSITY / TECH INSTITUTE");
  const [studentName, setStudentName] = useState("John Doe");
  const [rollNo, setRollNo] = useState("CS-2026-8941");
  const [subjectTitle, setSubjectTitle] = useState("Operating Systems & Cloud Architecture");
  const [collegeLogoUrl, setCollegeLogoUrl] = useState<string | null>(null);

  return (
    <div className="fixed sm:static bottom-0 sm:bottom-auto inset-x-0 sm:inset-x-auto max-h-[85vh] sm:max-h-none w-full sm:w-[320px] h-auto sm:h-full bg-white border-t sm:border-t-0 sm:border-r border-gray-200 rounded-t-3xl sm:rounded-none p-5 flex flex-col gap-4 z-50 sm:z-20 shrink-0 overflow-y-auto animate-in slide-in-from-bottom-8 sm:slide-in-from-left-4 duration-200 shadow-2xl sm:shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-base">Create</h3>
            <span className="text-[10px] text-gray-400">Standard, student & pro toolkit</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-md transition-colors cursor-pointer"
          title="Close panel"
        >
          <X size={18} />
        </button>
      </div>

      {/* Mode Switcher Slider: Basic vs Student vs Advanced */}
      <div className="flex items-center p-1 bg-gray-100 rounded-xl text-xs font-semibold shrink-0 gap-1 overflow-x-auto hide-scrollbar">
        <button
          type="button"
          onClick={() => setCreateMode("basic")}
          className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer whitespace-nowrap ${
            createMode === "basic"
              ? "bg-white text-indigo-600 font-bold shadow-xs"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Basic
        </button>
        <button
          type="button"
          onClick={() => setCreateMode("student")}
          className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1 ${
            createMode === "student"
              ? "bg-white text-indigo-600 font-bold shadow-xs"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <GraduationCap size={13} className="text-indigo-600" />
          <span>Student</span>
        </button>
        <button
          type="button"
          onClick={() => setCreateMode("advanced")}
          className={`flex-1 py-1.5 px-2 rounded-lg text-center transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1 ${
            createMode === "advanced"
              ? "bg-white text-indigo-600 font-bold shadow-xs"
              : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <span>Advanced</span>
          <span className="px-1.5 py-0.2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded text-[9px] font-black uppercase">
            PRO
          </span>
        </button>
      </div>

      {/* ===================== MODE 1: BASIC TOOLS ===================== */}
      {createMode === "basic" && (
        <div className="flex flex-col gap-4">
          {/* Section 1: Canvas Dimensions & Setup */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Canvas Setup & Dimensions
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  startBlankDocument();
                  onClose();
                }}
                className="p-3 bg-white hover:bg-indigo-50/50 border border-gray-200 hover:border-indigo-300 rounded-xl cursor-pointer transition-all shadow-2xs group flex flex-col gap-1 text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800 group-hover:text-indigo-700">A4 Document</span>
                  <span className="text-[9px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded">595 × 842 pt</span>
                </div>
                <span className="text-[10px] text-gray-400 leading-none">Standard 8.27 × 11.69 in</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  startBlankDocument();
                  onClose();
                }}
                className="p-3 bg-white hover:bg-indigo-50/50 border border-gray-200 hover:border-indigo-300 rounded-xl cursor-pointer transition-all shadow-2xs group flex flex-col gap-1 text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800 group-hover:text-indigo-700">US Letter</span>
                  <span className="text-[9px] font-bold bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded">612 × 792 pt</span>
                </div>
                <span className="text-[10px] text-gray-400 leading-none">Standard 8.5 × 11.0 in</span>
              </button>
            </div>
          </div>

          {/* Section 2: Core Creation Tools */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Insert Elements & Typography
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  addTextElement("heading");
                  onClose();
                }}
                className="p-2.5 bg-white hover:bg-indigo-50/60 border border-gray-200 hover:border-indigo-300 rounded-xl flex flex-col items-center text-center gap-1.5 cursor-pointer transition-all shadow-2xs group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Type size={16} />
                </div>
                <span className="text-xs font-bold text-gray-800 group-hover:text-indigo-700">Heading</span>
                <span className="text-[9px] text-gray-400 leading-none">24pt Bold</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  addTextElement("body");
                  onClose();
                }}
                className="p-2.5 bg-white hover:bg-indigo-50/60 border border-gray-200 hover:border-indigo-300 rounded-xl flex flex-col items-center text-center gap-1.5 cursor-pointer transition-all shadow-2xs group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <FileText size={16} />
                </div>
                <span className="text-xs font-bold text-gray-800 group-hover:text-indigo-700">Body Text</span>
                <span className="text-[9px] text-gray-400 leading-none">12pt Regular</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (addNewPage) addNewPage();
                  else startBlankDocument();
                  onClose();
                }}
                className="p-2.5 bg-white hover:bg-purple-50/60 border border-gray-200 hover:border-purple-300 rounded-xl flex flex-col items-center text-center gap-1.5 cursor-pointer transition-all shadow-2xs group"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Plus size={16} />
                </div>
                <span className="text-xs font-bold text-gray-800 group-hover:text-purple-700">New Page</span>
                <span className="text-[9px] text-gray-400 leading-none">Append Page</span>
              </button>
            </div>
          </div>

          {/* Section 3: Media & Quick Insert */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Assets & Fast Placeholders
            </span>
            <div className="grid grid-cols-2 gap-2">
              <label className="p-3 bg-white hover:bg-emerald-50/60 border border-gray-200 hover:border-emerald-300 rounded-xl flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs group">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <Upload size={16} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-gray-800 group-hover:text-emerald-700">Insert Image</span>
                  <span className="text-[10px] text-gray-400">PNG, JPG, SVG</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        const dataUrl = reader.result as string;
                        const newId = `img_${Date.now()}`;
                        setElements(prev => [
                          ...prev,
                          {
                            id: newId,
                            text: f.name,
                            imageUrl: dataUrl,
                            x: 80,
                            y: 120,
                            width: 200,
                            height: 150,
                            size: 14,
                            font: "Helvetica",
                            color: "#000000",
                            page: 0,
                          }
                        ]);
                        selectSingleElement(newId);
                        onClose();
                      };
                      reader.readAsDataURL(f);
                    }
                  }}
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  const now = Date.now();
                  const newShapeId = `shape_${now}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: newShapeId,
                      text: "",
                      isShape: true,
                      shapeType: "rect",
                      x: 100,
                      y: 150,
                      width: 220,
                      height: 120,
                      size: 12,
                      font: "Helvetica",
                      color: "#4f46e5",
                      bgColor: "#eef2ff",
                      opacity: 0.9,
                      page: 0,
                    }
                  ]);
                  selectSingleElement(newShapeId);
                  onClose();
                }}
                className="p-3 bg-white hover:bg-blue-50/60 border border-gray-200 hover:border-blue-300 rounded-xl flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs group text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <Square size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800 group-hover:text-blue-700">Shape Box</span>
                  <span className="text-[10px] text-gray-400">Card container</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  const now = Date.now();
                  const dateId = `c_date_${now}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: dateId,
                      text: new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
                      x: 360,
                      y: 50,
                      size: 12,
                      font: "Helvetica",
                      color: "#475569",
                      page: 0,
                      width: 190,
                      align: "right",
                    }
                  ]);
                  selectSingleElement(dateId);
                  onClose();
                }}
                className="p-3 bg-white hover:bg-amber-50/60 border border-gray-200 hover:border-amber-300 rounded-xl flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs group text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <Calendar size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800 group-hover:text-amber-700">Date Stamp</span>
                  <span className="text-[10px] text-gray-400">Live date</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  const now = Date.now();
                  const sigId = `sig_line_${now}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: sigId,
                      text: "_______________________________\nAuthorized Signature / Date",
                      x: 320,
                      y: 720,
                      size: 11,
                      font: "Helvetica",
                      color: "#334155",
                      page: 0,
                      width: 220,
                      align: "center",
                    }
                  ]);
                  selectSingleElement(sigId);
                  onClose();
                }}
                className="p-3 bg-white hover:bg-rose-50/60 border border-gray-200 hover:border-rose-300 rounded-xl flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs group text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <Pen size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800 group-hover:text-rose-700">Sign Line</span>
                  <span className="text-[10px] text-gray-400">Formal block</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODE 2: STUDENT & COLLEGE TOOLS ===================== */}
      {createMode === "student" && (
        <div className="flex flex-col gap-4">
          {/* Dynamic College & Student Customizer Card */}
          <div className="p-3.5 bg-gradient-to-br from-indigo-50/90 via-purple-50/50 to-pink-50/30 rounded-2xl border border-indigo-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                <School size={15} className="text-indigo-600" />
                <span>My College & Student Info</span>
              </span>
              <span className="text-[9px] font-bold bg-indigo-100/80 text-indigo-700 px-1.5 py-0.5 rounded-md">
                Live Dynamic
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {/* College Name & Logo */}
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-gray-500 block mb-0.5">College / University</label>
                  <input
                    type="text"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    placeholder="e.g. Stanford University / MIT"
                    className="w-full px-2.5 py-1.5 bg-white border border-indigo-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block mb-0.5">Logo</label>
                  <label className="w-8 h-8 rounded-lg bg-white border border-indigo-200 hover:border-indigo-400 flex items-center justify-center cursor-pointer transition-colors shadow-2xs overflow-hidden">
                    {collegeLogoUrl ? (
                      <img src={collegeLogoUrl} alt="Logo" className="w-full h-full object-contain p-0.5" />
                    ) : (
                      <Upload size={14} className="text-indigo-600" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => setCollegeLogoUrl(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Student Name & Roll No */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block mb-0.5">Student Name</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-2.5 py-1.5 bg-white border border-indigo-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block mb-0.5">Roll / Reg No</label>
                  <input
                    type="text"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    placeholder="Roll No"
                    className="w-full px-2.5 py-1.5 bg-white border border-indigo-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Subject / Course Title */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 block mb-0.5">Subject / Project Title</label>
                <input
                  type="text"
                  value={subjectTitle}
                  onChange={(e) => setSubjectTitle(e.target.value)}
                  placeholder="e.g. Operating Systems / Chemistry Lab"
                  className="w-full px-2.5 py-1.5 bg-white border border-indigo-200 rounded-lg text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Instant One-Click Create Button right inside the card */}
              <button
                type="button"
                onClick={async () => {
                  await startBlankDocument();
                  const now = Date.now();
                  const elems: CanvasTextElement[] = [
                    {
                      id: `stu_col_${now}`,
                      text: collegeName.toUpperCase(),
                      x: 40,
                      y: 80,
                      size: 20,
                      font: "Helvetica",
                      bold: true,
                      color: "#1e1b4b",
                      page: 0,
                      width: 515,
                      align: "center",
                    },
                    {
                      id: `stu_dept_${now}`,
                      text: "DEPARTMENT OF HIGHER STUDIES & RESEARCH",
                      x: 40,
                      y: 110,
                      size: 11,
                      font: "Helvetica",
                      color: "#64748b",
                      page: 0,
                      width: 515,
                      align: "center",
                    },
                    {
                      id: `stu_sub_${now}`,
                      text: `COURSE: ${subjectTitle.toUpperCase()}`,
                      x: 40,
                      y: 220,
                      size: 15,
                      font: "Helvetica",
                      bold: true,
                      color: "#3730a3",
                      page: 0,
                      width: 515,
                      align: "center",
                    },
                    {
                      id: `stu_ass_${now}`,
                      text: "TERM ASSIGNMENT & REPORT",
                      x: 40,
                      y: 250,
                      size: 24,
                      font: "Helvetica",
                      bold: true,
                      color: "#0f172a",
                      page: 0,
                      width: 515,
                      align: "center",
                    },
                    {
                      id: `stu_box_${now}`,
                      text: `SUBMITTED BY:\nName: ${studentName}\nRoll No: ${rollNo}\nDate: ${new Date().toLocaleDateString()}`,
                      x: 80,
                      y: 420,
                      size: 13,
                      font: "Helvetica",
                      color: "#1e293b",
                      page: 0,
                      width: 435,
                      lineHeight: 1.6,
                    },
                    {
                      id: `stu_prof_${now}`,
                      text: "SUBMITTED TO:\nCourse Instructor / Faculty In-Charge\nGrade / Remarks: _____________\n\nAuthorized Signature: ________________________",
                      x: 80,
                      y: 620,
                      size: 12,
                      font: "Helvetica",
                      color: "#475569",
                      page: 0,
                      width: 435,
                      lineHeight: 1.6,
                    },
                  ];

                  if (collegeLogoUrl) {
                    elems.push({
                      id: `stu_logo_${now}`,
                      text: "Logo",
                      imageUrl: collegeLogoUrl,
                      x: 257,
                      y: 135,
                      width: 80,
                      height: 70,
                      size: 12,
                      font: "Helvetica",
                      color: "#000000",
                      page: 0,
                    });
                  }

                  setElements(elems);
                  selectSingleElement(elems[0].id);
                  onClose();
                }}
                className="w-full mt-2 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-indigo-200"
              >
                <Sparkles size={15} />
                <span>Build Document with My Info</span>
              </button>
            </div>
          </div>

          {/* Instant 1-Click Formats */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center justify-between">
              <span>Generate College Formats</span>
              <span className="text-[9px] text-gray-400 font-normal">Uses Your Info</span>
            </span>

            <div className="space-y-2">
              {/* 1. Assignment Front Cover Page */}
              <button
                type="button"
                onClick={async () => {
                  await startBlankDocument();
                  const now = Date.now();
                  const elems: CanvasTextElement[] = [
                    // College Header
                    {
                      id: `stu_col_${now}`,
                      text: collegeName.toUpperCase(),
                      x: 40,
                      y: 80,
                      size: 20,
                      font: "Helvetica",
                      bold: true,
                      color: "#1e1b4b",
                      page: 0,
                      width: 515,
                      align: "center",
                    },
                    {
                      id: `stu_dept_${now}`,
                      text: "DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING",
                      x: 40,
                      y: 110,
                      size: 11,
                      font: "Helvetica",
                      color: "#64748b",
                      page: 0,
                      width: 515,
                      align: "center",
                    },
                    // Subject & Assignment Title
                    {
                      id: `stu_sub_${now}`,
                      text: `COURSE: ${subjectTitle.toUpperCase()}`,
                      x: 40,
                      y: 220,
                      size: 15,
                      font: "Helvetica",
                      bold: true,
                      color: "#3730a3",
                      page: 0,
                      width: 515,
                      align: "center",
                    },
                    {
                      id: `stu_ass_${now}`,
                      text: "ASSIGNMENT REPORT",
                      x: 40,
                      y: 250,
                      size: 24,
                      font: "Helvetica",
                      bold: true,
                      color: "#0f172a",
                      page: 0,
                      width: 515,
                      align: "center",
                    },
                    // Student Details Box
                    {
                      id: `stu_box_${now}`,
                      text: `SUBMITTED BY:\nName: ${studentName}\nRoll No: ${rollNo}\nSemester: 6th Sem | Section: A\nDate of Submission: ${new Date().toLocaleDateString()}`,
                      x: 80,
                      y: 420,
                      size: 13,
                      font: "Helvetica",
                      color: "#1e293b",
                      page: 0,
                      width: 435,
                      lineHeight: 1.6,
                    },
                    // Faculty Verification Box
                    {
                      id: `stu_prof_${now}`,
                      text: "SUBMITTED TO:\nProf. Department Faculty Coordinator\nGrade / Marks: _____________\n\nFaculty Signature: ________________________",
                      x: 80,
                      y: 620,
                      size: 12,
                      font: "Helvetica",
                      color: "#475569",
                      page: 0,
                      width: 435,
                      lineHeight: 1.6,
                    },
                  ];

                  if (collegeLogoUrl) {
                    elems.push({
                      id: `stu_logo_${now}`,
                      text: "Logo",
                      imageUrl: collegeLogoUrl,
                      x: 257,
                      y: 135,
                      width: 80,
                      height: 70,
                      size: 12,
                      font: "Helvetica",
                      color: "#000000",
                      page: 0,
                    });
                  }

                  setElements(elems);
                  selectSingleElement(elems[0].id);
                  onClose();
                }}
                className="w-full p-3 bg-white hover:bg-indigo-50/60 border border-gray-200 hover:border-indigo-300 rounded-xl flex items-center gap-3 cursor-pointer transition-all shadow-2xs text-left group"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <FileText size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-gray-800 group-hover:text-indigo-700">
                    Assignment Front Cover Page
                  </div>
                  <div className="text-[10px] text-gray-400">
                    Full college letterhead, student info & faculty grade box
                  </div>
                </div>
              </button>

              {/* 2. Practical / Lab Record File Format */}
              <button
                type="button"
                onClick={async () => {
                  await startBlankDocument();
                  const now = Date.now();
                  const elems: CanvasTextElement[] = [
                    // College Lab Header
                    {
                      id: `lab_hdr_${now}`,
                      text: `${collegeName.toUpperCase()}\nPRACTICAL LABORATORY RECORD`,
                      x: 40,
                      y: 50,
                      size: 18,
                      font: "Helvetica",
                      bold: true,
                      color: "#0f172a",
                      page: 0,
                      width: 515,
                      align: "center",
                    },
                    // Experiment Meta
                    {
                      id: `lab_meta_${now}`,
                      text: `EXPERIMENT NO: 01    |    DATE: ${new Date().toLocaleDateString()}\nSTUDENT: ${studentName}    |    ROLL NO: ${rollNo}\nSUBJECT: ${subjectTitle}`,
                      x: 45,
                      y: 110,
                      size: 11,
                      font: "Helvetica",
                      bold: true,
                      color: "#334155",
                      page: 0,
                      width: 505,
                    },
                    // Aim & Apparatus
                    {
                      id: `lab_aim_${now}`,
                      text: "AIM OF THE EXPERIMENT:\nTo design, implement and verify the performance characteristics of the given system.\n\nAPPARATUS / TOOLS REQUIRED:\n1. Workstation with Linux / UNIX environment\n2. Standard development compiler & debugger toolchain\n3. Measurement instruments & diagnostic software",
                      x: 45,
                      y: 170,
                      size: 11,
                      font: "Helvetica",
                      color: "#1e293b",
                      page: 0,
                      width: 505,
                      lineHeight: 1.5,
                    },
                    // Observation Table
                    {
                      id: `lab_tbl_${now}`,
                      text: "OBSERVATION & READINGS TABLE:\n──────────────────────────────────────────────────────────\nS.NO    INPUT VALUE (X)    OBSERVED OUTPUT (Y)    STATUS\n──────────────────────────────────────────────────────────\n 01            10 Hz               9.88 ms         PASS\n 02            25 Hz              24.72 ms         PASS\n 03            50 Hz              49.91 ms         PASS\n──────────────────────────────────────────────────────────",
                      x: 45,
                      y: 340,
                      size: 11,
                      font: "Courier",
                      color: "#0f172a",
                      page: 0,
                      width: 505,
                    },
                    // Result & Teacher Remarks
                    {
                      id: `lab_res_${now}`,
                      text: "RESULT & CONCLUSION:\nThe experiment was performed successfully and results align with theoretical values.\n\nTeacher's Remarks: ________________________________\nSignature & Date: ________________________________",
                      x: 45,
                      y: 540,
                      size: 11,
                      font: "Helvetica",
                      color: "#334155",
                      page: 0,
                      width: 505,
                      lineHeight: 1.5,
                    },
                  ];

                  setElements(elems);
                  selectSingleElement(elems[0].id);
                  onClose();
                }}
                className="w-full p-3 bg-white hover:bg-emerald-50/60 border border-gray-200 hover:border-emerald-300 rounded-xl flex items-center gap-3 cursor-pointer transition-all shadow-2xs text-left group"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <FlaskConical size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-gray-800 group-hover:text-emerald-700">
                    Practical / Lab Record Format
                  </div>
                  <div className="text-[10px] text-gray-400">
                    Aim, Apparatus, Observation Table & Teacher Remarks
                  </div>
                </div>
              </button>

              {/* 3. Project Presentation / PPT Slide */}
              <button
                type="button"
                onClick={async () => {
                  await startBlankDocument();
                  const now = Date.now();
                  const elems: CanvasTextElement[] = [
                    // PPT Title Box
                    {
                      id: `ppt_hdr_${now}`,
                      text: subjectTitle.toUpperCase(),
                      x: 40,
                      y: 90,
                      size: 26,
                      font: "Helvetica",
                      bold: true,
                      color: "#1e1b4b",
                      page: 0,
                      width: 515,
                      align: "center",
                    },
                    {
                      id: `ppt_sub_${now}`,
                      text: "SEMINAR & PROJECT PRESENTATION",
                      x: 40,
                      y: 140,
                      size: 13,
                      font: "Helvetica",
                      bold: true,
                      color: "#4f46e5",
                      page: 0,
                      width: 515,
                      align: "center",
                    },
                    // Agenda / Slide Points
                    {
                      id: `ppt_pts_${now}`,
                      text: "AGENDA & KEY TAKEAWAYS:\n\n• 01. Problem Statement & Motivation\n• 02. Existing Literature & Comparative Analysis\n• 03. Proposed Architecture & Methodology\n• 04. Experimental Evaluation & Graphs\n• 05. Conclusion, Limitations & Future Roadmap",
                      x: 60,
                      y: 240,
                      size: 14,
                      font: "Helvetica",
                      color: "#1e293b",
                      page: 0,
                      width: 475,
                      lineHeight: 1.8,
                    },
                    // Presenter Footer
                    {
                      id: `ppt_ftr_${now}`,
                      text: `Presented by: ${studentName} (${rollNo})  •  ${collegeName}`,
                      x: 40,
                      y: 680,
                      size: 11,
                      font: "Helvetica",
                      bold: true,
                      color: "#64748b",
                      page: 0,
                      width: 515,
                      align: "center",
                    },
                  ];

                  setElements(elems);
                  selectSingleElement(elems[0].id);
                  onClose();
                }}
                className="w-full p-3 bg-white hover:bg-purple-50/60 border border-gray-200 hover:border-purple-300 rounded-xl flex items-center gap-3 cursor-pointer transition-all shadow-2xs text-left group"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <Presentation size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-gray-800 group-hover:text-purple-700">
                    Project Presentation / PPT Slide
                  </div>
                  <div className="text-[10px] text-gray-400">
                    Title slide with clean agenda bullets & presenter badge
                  </div>
                </div>
              </button>

              {/* 4. Research Paper / IEEE 2-Column Manuscript Format */}
              <button
                type="button"
                onClick={async () => {
                  await startBlankDocument();
                  const now = Date.now();
                  const elems: CanvasTextElement[] = [
                    {
                      id: `res_title_${now}`,
                      text: subjectTitle.toUpperCase(),
                      x: 40,
                      y: 50,
                      size: 18,
                      font: "Times New Roman",
                      bold: true,
                      color: "#0f172a",
                      page: 0,
                      width: 515,
                      align: "center",
                    },
                    {
                      id: `res_authors_${now}`,
                      text: `${studentName} (Reg: ${rollNo})\nDepartment of Engineering & Applied Sciences, ${collegeName}`,
                      x: 40,
                      y: 95,
                      size: 10,
                      font: "Times New Roman",
                      italic: true,
                      color: "#475569",
                      page: 0,
                      width: 515,
                      align: "center",
                    },
                    {
                      id: `res_abstract_${now}`,
                      text: "ABSTRACT—In this research paper, we formulate and investigate the design parameters for modern distributed computational frameworks. We implement an empirical evaluation protocol to measure latency, throughput, and fault tolerance across synthetic benchmarks. Experimental results demonstrate a 24.8% improvement in resource efficiency while maintaining strict consistency guarantees.\n\nKeywords—Distributed Systems, Performance Analysis, Benchmarking, Algorithmic Optimization.",
                      x: 50,
                      y: 145,
                      size: 9.5,
                      font: "Times New Roman",
                      color: "#1e293b",
                      page: 0,
                      width: 495,
                      isShape: true,
                      shapeType: 'callout',
                      bgColor: "#f8fafc",
                      borderColor: "#e2e8f0",
                      borderWidth: 1,
                      height: 105,
                    },
                    // Column 1
                    {
                      id: `res_col1_${now}`,
                      text: "I. INTRODUCTION\nModern cloud-native and autonomous architectures demand deterministic responsiveness under fluctuating workloads. Traditional approaches often suffer from queuing bottlenecks under peak load intervals.\n\nII. METHODOLOGY & ARCHITECTURE\nOur pipeline is organized into three pipeline tiers: ingestion, parallel transformation, and distributed synchronization. Each tier operates concurrently using asynchronous message passing queues.",
                      x: 50,
                      y: 270,
                      size: 9.5,
                      font: "Times New Roman",
                      color: "#0f172a",
                      page: 0,
                      width: 240,
                    },
                    // Column 2
                    {
                      id: `res_col2_${now}`,
                      text: "III. EMPIRICAL RESULTS\nWe conducted 50 independent trials across variable batch sizes. The proposed architecture showed significant scaling stability without memory degradation.\n\nIV. CONCLUSION & FUTURE WORK\nThe demonstrated methodology proves robust for real-world deployments. Future research will explore decentralized consensus optimizations.",
                      x: 305,
                      y: 270,
                      size: 9.5,
                      font: "Times New Roman",
                      color: "#0f172a",
                      page: 0,
                      width: 240,
                    },
                    // References box
                    {
                      id: `res_refs_${now}`,
                      text: "REFERENCES\n[1] J. Smith et al., 'High-Performance Cloud Architectures,' IEEE Trans. Comput., 2024.\n[2] A. Turing, 'On Computable Numbers with Applications,' Proc. LMS, 1936.",
                      x: 50,
                      y: 690,
                      size: 8.5,
                      font: "Times New Roman",
                      color: "#64748b",
                      page: 0,
                      width: 495,
                    },
                  ];

                  setElements(elems);
                  selectSingleElement(elems[0].id);
                  onClose();
                }}
                className="w-full p-3 bg-white hover:bg-sky-50/60 border border-gray-200 hover:border-sky-300 rounded-xl flex items-center gap-3 cursor-pointer transition-all shadow-2xs text-left group"
              >
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <FileText size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-gray-800 group-hover:text-sky-700">
                    Research Paper / Manuscript
                  </div>
                  <div className="text-[10px] text-gray-400">
                    Abstract box, 2-column IEEE format & IEEE references
                  </div>
                </div>
              </button>

              {/* 5. Project Synopsis & Detailed Report Format */}
              <button
                type="button"
                onClick={async () => {
                  await startBlankDocument();
                  const now = Date.now();
                  const elems: CanvasTextElement[] = [
                    {
                      id: `rep_hdr_${now}`,
                      text: `${collegeName.toUpperCase()}\nFINAL PROJECT SYNOPSIS & TECHNICAL REPORT`,
                      x: 40,
                      y: 60,
                      size: 16,
                      font: "Helvetica",
                      bold: true,
                      color: "#0f172a",
                      page: 0,
                      width: 515,
                      align: "center",
                    },
                    {
                      id: `rep_meta_${now}`,
                      text: `PROJECT TITLE: ${subjectTitle.toUpperCase()}\nSTUDENT LEAD: ${studentName}  |  REG NO: ${rollNo}\nSUBMISSION DATE: ${new Date().toLocaleDateString()}`,
                      x: 45,
                      y: 120,
                      size: 11,
                      font: "Helvetica",
                      bold: true,
                      color: "#4338ca",
                      page: 0,
                      width: 505,
                    },
                    {
                      id: `rep_body_${now}`,
                      text: "1. EXECUTIVE SUMMARY & PROBLEM DEFINITION:\nThe goal of this project is to create an accessible, high-efficiency software system that bridges the gap between complex file processing tools and intuitive graphical user interaction.\n\n2. HARDWARE & SOFTWARE SPECIFICATIONS:\n• Operating Platform: Linux / Windows 11 / macOS\n• Frontend Stack: Next.js, React, TailwindCSS, Lucide-React Icons\n• Processing Pipeline: PyMuPDF high-fidelity engine with WebAssembly fallback\n\n3. MILESTONES & WORK BREAKDOWN STRUCTURE:\n[✓] Phase 1: Requirements Gathering & UI/UX Wireframing\n[✓] Phase 2: Core Engine Architecture & Vector Parsing Integration\n[✓] Phase 3: Validation, Unit Testing & Performance Profiling",
                      x: 45,
                      y: 200,
                      size: 11,
                      font: "Helvetica",
                      color: "#1e293b",
                      page: 0,
                      width: 505,
                    },
                    {
                      id: `rep_sign_${now}`,
                      text: "PROJECT GUIDE / MENTOR:\nProf. __________________________________\nDepartment of Technology Studies\n\nMentor Signature: ______________________",
                      x: 45,
                      y: 640,
                      size: 11,
                      font: "Helvetica",
                      color: "#475569",
                      page: 0,
                      width: 505,
                    },
                  ];

                  setElements(elems);
                  selectSingleElement(elems[0].id);
                  onClose();
                }}
                className="w-full p-3 bg-white hover:bg-teal-50/60 border border-gray-200 hover:border-teal-300 rounded-xl flex items-center gap-3 cursor-pointer transition-all shadow-2xs text-left group"
              >
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <BookmarkCheck size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-gray-800 group-hover:text-teal-700">
                    Project Report & Synopsis
                  </div>
                  <div className="text-[10px] text-gray-400">
                    Executive summary, tech stack specs & milestone checklist
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Academic Insert Elements */}
          <div className="flex flex-col gap-2 pt-1">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
              Academic Badges & Insert Tools
            </span>
            <div className="grid grid-cols-2 gap-2">
              {/* Formula Callout */}
              <button
                type="button"
                onClick={() => {
                  const now = Date.now();
                  const formulaId = `stu_math_${now}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: formulaId,
                      text: "THEOREM / FORMULA:\nf(x) = ∫ [e^(-λt) • cos(ωt)] dt   (t ≥ 0)",
                      x: 60,
                      y: 280,
                      size: 13,
                      font: "Courier",
                      color: "#1e1b4b",
                      page: 0,
                      bold: true,
                      isShape: true,
                      shapeType: 'callout',
                      bgColor: "#f1f5f9",
                      borderColor: "#cbd5e1",
                      borderWidth: 1.5,
                      width: 380,
                      height: 54,
                    }
                  ]);
                  selectSingleElement(formulaId);
                  onClose();
                }}
                className="p-3 bg-white hover:bg-blue-50/60 border border-gray-200 hover:border-blue-300 rounded-xl flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs group text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-serif font-black text-sm group-hover:scale-105 transition-transform shrink-0">
                  ∑x
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800 group-hover:text-blue-700">Formula Box</span>
                  <span className="text-[10px] text-gray-400">Math / theorem</span>
                </div>
              </button>

              {/* Citation APA Box */}
              <button
                type="button"
                onClick={() => {
                  const now = Date.now();
                  const citeId = `stu_cite_${now}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: citeId,
                      text: "REFERENCES (APA 7th):\n[1] Author, A. (2025). Title of Paper. Journal Name, 12(4), 45-60.",
                      x: 45,
                      y: 650,
                      size: 10,
                      font: "Helvetica",
                      color: "#334155",
                      page: 0,
                      width: 505,
                    }
                  ]);
                  selectSingleElement(citeId);
                  onClose();
                }}
                className="p-3 bg-white hover:bg-purple-50/60 border border-gray-200 hover:border-purple-300 rounded-xl flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs group text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <Quote size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800 group-hover:text-purple-700">Citation Box</span>
                  <span className="text-[10px] text-gray-400">APA / IEEE format</span>
                </div>
              </button>

              {/* Grade Stamp */}
              <button
                type="button"
                onClick={() => {
                  const now = Date.now();
                  const gradeId = `stu_grade_${now}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: gradeId,
                      text: "★ GRADE: A+  |  VERIFIED",
                      x: 360,
                      y: 80,
                      size: 13,
                      font: "Helvetica",
                      color: "#15803d",
                      page: 0,
                      bold: true,
                      isShape: true,
                      shapeType: 'badge',
                      bgColor: "rgba(34, 197, 94, 0.12)",
                      borderColor: "#15803d",
                      borderWidth: 2,
                      width: 175,
                      height: 38,
                    }
                  ]);
                  selectSingleElement(gradeId);
                  onClose();
                }}
                className="p-3 bg-white hover:bg-amber-50/60 border border-gray-200 hover:border-amber-300 rounded-xl flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs group text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition-transform shrink-0">
                  A+
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800 group-hover:text-amber-700">Grade Stamp</span>
                  <span className="text-[10px] text-gray-400">Reviewed / Graded</span>
                </div>
              </button>

              {/* Faculty Sign Line */}
              <button
                type="button"
                onClick={() => {
                  const now = Date.now();
                  const profSigId = `stu_sig_${now}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: profSigId,
                      text: "_______________________________\nProfessor / Department Head Signature",
                      x: 320,
                      y: 720,
                      size: 11,
                      font: "Helvetica",
                      color: "#334155",
                      page: 0,
                      width: 220,
                      align: "center",
                    }
                  ]);
                  selectSingleElement(profSigId);
                  onClose();
                }}
                className="p-3 bg-white hover:bg-rose-50/60 border border-gray-200 hover:border-rose-300 rounded-xl flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs group text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <Pen size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800 group-hover:text-rose-700">Faculty Sign</span>
                </div>
              </button>
            </div>
          </div>

          {/* Student Section 3: Data Forms, Tables & Scientific Charts */}
          <div className="flex flex-col gap-2 pt-1">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
              <LineChart size={13} />
              <span>Data Forms, Tables & Visual Graphs</span>
            </span>

            <div className="grid grid-cols-2 gap-2">
              {/* Scientific Data Table */}
              <button
                type="button"
                onClick={() => {
                  const now = Date.now();
                  const tblId = `stu_tbl_${now}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: tblId,
                      text: "EXPERIMENTAL OBSERVATION & RESULTS:\n┌──────┬──────────────┬────────────┬───────────┐\n│ Trial│ Parameter (X)│ Value (Y)  │ Error (±) │\n├──────┼──────────────┼────────────┼───────────┤\n│  01  │  10.5 kHz    │  2.41 V    │  ± 0.02   │\n│  02  │  20.0 kHz    │  4.82 V    │  ± 0.03   │\n│  03  │  40.0 kHz    │  9.65 V    │  ± 0.05   │\n└──────┴──────────────┴────────────┴───────────┘",
                      x: 45,
                      y: 320,
                      size: 11,
                      font: "Courier",
                      color: "#0f172a",
                      page: 0,
                      width: 505,
                    }
                  ]);
                  selectSingleElement(tblId);
                  onClose();
                }}
                className="p-3 bg-white hover:bg-indigo-50/60 border border-gray-200 hover:border-indigo-300 rounded-xl flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs group text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <Table size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800 group-hover:text-indigo-700">Lab Data Table</span>
                  <span className="text-[10px] text-gray-400">Structured grid</span>
                </div>
              </button>

              {/* Line Graph Plot Module */}
              <button
                type="button"
                onClick={() => {
                  const now = Date.now();
                  const graphId = `stu_graph_${now}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: graphId,
                      text: "GRAPH: Output Amplitude vs Frequency\n 10V |           .---*\n  8V |       .--'     \n  6V |    .-'         \n  4V |  .-            \n  2V | *              \n  0V └─────────────────\n      10k  20k  30k  40k",
                      x: 60,
                      y: 460,
                      size: 11,
                      font: "Courier",
                      color: "#1e1b4b",
                      page: 0,
                      bold: true,
                      isShape: true,
                      shapeType: 'callout',
                      bgColor: "#f8fafc",
                      borderColor: "#cbd5e1",
                      borderWidth: 1.5,
                      width: 320,
                      height: 140,
                    }
                  ]);
                  selectSingleElement(graphId);
                  onClose();
                }}
                className="p-3 bg-white hover:bg-blue-50/60 border border-gray-200 hover:border-blue-300 rounded-xl flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs group text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <LineChart size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800 group-hover:text-blue-700">Line Graph</span>
                  <span className="text-[10px] text-gray-400">X-Y Plot model</span>
                </div>
              </button>

              {/* Bar Chart Distribution */}
              <button
                type="button"
                onClick={() => {
                  const now = Date.now();
                  const barId = `stu_bar_${now}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: barId,
                      text: "SURVEY DISTRIBUTION COMPARISON:\nGroup A (Benchmark):  ████████████████ 85%\nGroup B (Optimized):  ████████████████████ 98%\nGroup C (Fallback):   ████████ 42%",
                      x: 45,
                      y: 380,
                      size: 11,
                      font: "Courier",
                      color: "#1e293b",
                      page: 0,
                      bold: true,
                      isShape: true,
                      shapeType: 'callout',
                      bgColor: "#eff6ff",
                      borderColor: "#bfdbfe",
                      borderWidth: 1.5,
                      width: 440,
                      height: 80,
                    }
                  ]);
                  selectSingleElement(barId);
                  onClose();
                }}
                className="p-3 bg-white hover:bg-emerald-50/60 border border-gray-200 hover:border-emerald-300 rounded-xl flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs group text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <BarChart2 size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800 group-hover:text-emerald-700">Bar Chart</span>
                  <span className="text-[10px] text-gray-400">Metric breakdown</span>
                </div>
              </button>

              {/* Figure & Diagram Image Placeholder */}
              <label className="p-3 bg-white hover:bg-amber-50/60 border border-gray-200 hover:border-amber-300 rounded-xl flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs group text-left">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <ImageIcon size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800 group-hover:text-amber-700">Add Diagram</span>
                  <span className="text-[10px] text-gray-400">Figure / Circuit</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        const dataUrl = reader.result as string;
                        const now = Date.now();
                        const imgId = `diag_${now}`;
                        const capId = `cap_${now}`;
                        setElements(prev => [
                          ...prev,
                          {
                            id: imgId,
                            text: f.name,
                            imageUrl: dataUrl,
                            x: 100,
                            y: 280,
                            width: 320,
                            height: 200,
                            size: 14,
                            font: "Helvetica",
                            color: "#000000",
                            page: 0,
                          },
                          {
                            id: capId,
                            text: "Figure 1.1: System Architecture Diagram & Dataflow Schematics",
                            x: 100,
                            y: 490,
                            width: 320,
                            size: 10,
                            font: "Helvetica",
                            color: "#64748b",
                            page: 0,
                            align: "center",
                          }
                        ]);
                        selectSingleElement(imgId);
                        onClose();
                      };
                      reader.readAsDataURL(f);
                    }
                  }}
                />
              </label>

              {/* Source Code Snippet Box */}
              <button
                type="button"
                onClick={() => {
                  const now = Date.now();
                  const codeId = `stu_code_${now}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: codeId,
                      text: "// Program 1.0: Algorithm Implementation\n#include <stdio.h>\nint main() {\n    printf(\"Hello, Operating Systems!\\n\");\n    return 0;\n}",
                      x: 60,
                      y: 300,
                      size: 11,
                      font: "Courier",
                      color: "#1e1b4b",
                      page: 0,
                      isShape: true,
                      shapeType: 'callout',
                      bgColor: "#f8fafc",
                      borderColor: "#cbd5e1",
                      borderWidth: 1.5,
                      width: 420,
                      height: 110,
                    }
                  ]);
                  selectSingleElement(codeId);
                  onClose();
                }}
                className="col-span-2 p-3 bg-white hover:bg-slate-50 border border-gray-200 hover:border-slate-300 rounded-xl flex items-center gap-3 cursor-pointer transition-all shadow-2xs group text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <FileCode size={16} />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-gray-800 group-hover:text-slate-900">
                    Source Code & Algorithm Box
                  </div>
                  <div className="text-[10px] text-gray-400">
                    Monospaced syntax block for CS coding assignments & practical records
                  </div>
                </div>
              </button>

              {/* Executive Summary / Key Findings Card */}
              <button
                type="button"
                onClick={() => {
                  const now = Date.now();
                  const sumId = `stu_sum_${now}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: sumId,
                      text: "EXECUTIVE RESEARCH SUMMARY & KEY TAKEAWAYS:\n• Objective: Measure performance gains using decoupled worker threads.\n• Methodology: 10,000 requests processed under simulated real-world conditions.\n• Key Finding: Latency dropped by 43% with zero dropped connection packets.\n• Recommendation: Proceed with full production rollout.",
                      x: 50,
                      y: 220,
                      size: 11,
                      font: "Helvetica",
                      color: "#1e1b4b",
                      page: 0,
                      bold: false,
                      isShape: true,
                      shapeType: 'callout',
                      bgColor: "#f0fdf4",
                      borderColor: "#86efac",
                      borderWidth: 1.5,
                      width: 485,
                      height: 95,
                    }
                  ]);
                  selectSingleElement(sumId);
                  onClose();
                }}
                className="col-span-2 p-3 bg-white hover:bg-emerald-50/60 border border-gray-200 hover:border-emerald-300 rounded-xl flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs group text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <BookmarkCheck size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800 group-hover:text-emerald-700">Research Summary Card</span>
                  <span className="text-[10px] text-gray-400">Key takeaways, objectives & outcomes box</span>
                </div>
              </button>

              {/* Pie Chart Distribution Model */}
              <button
                type="button"
                onClick={() => {
                  const now = Date.now();
                  const pieId = `stu_pie_${now}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: pieId,
                      text: "RESOURCE ALLOCATION BREAKDOWN:\n  [██████████] Computational Compute: 55%\n  [█████]       Database Query I/O:   25%\n  [███]         Network Latency:      12%\n  [██]          System Overhead:       8%",
                      x: 60,
                      y: 380,
                      size: 11,
                      font: "Courier",
                      color: "#1e293b",
                      page: 0,
                      bold: true,
                      isShape: true,
                      shapeType: 'callout',
                      bgColor: "#faf5ff",
                      borderColor: "#e9d5ff",
                      borderWidth: 1.5,
                      width: 420,
                      height: 90,
                    }
                  ]);
                  selectSingleElement(pieId);
                  onClose();
                }}
                className="p-3 bg-white hover:bg-purple-50/60 border border-gray-200 hover:border-purple-300 rounded-xl flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs group text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <PieChart size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800 group-hover:text-purple-700">Pie / Ratio Chart</span>
                  <span className="text-[10px] text-gray-400">Resource breakdown</span>
                </div>
              </button>

              {/* Certificate of Originality Stamp */}
              <button
                type="button"
                onClick={() => {
                  const now = Date.now();
                  const certId = `stu_cert_${now}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: certId,
                      text: "CERTIFICATE OF ORIGINALITY & PLAGIARISM CLEARANCE:\nI hereby certify that this project work is my original composition and has not been submitted elsewhere for any other degree or diploma.\n\nStudent Signature: __________________  Date: ____________",
                      x: 50,
                      y: 650,
                      size: 10,
                      font: "Helvetica",
                      color: "#334155",
                      page: 0,
                      isShape: true,
                      shapeType: 'callout',
                      bgColor: "#fffbeb",
                      borderColor: "#fde68a",
                      borderWidth: 1.5,
                      width: 495,
                      height: 75,
                    }
                  ]);
                  selectSingleElement(certId);
                  onClose();
                }}
                className="p-3 bg-white hover:bg-amber-50/60 border border-gray-200 hover:border-amber-300 rounded-xl flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs group text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <ShieldCheck size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800 group-hover:text-amber-700">Originality Stamp</span>
                  <span className="text-[10px] text-gray-400">Anti-plagiarism statement</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODE 3: ADVANCED TOOLS ===================== */}
      {createMode === "advanced" && (
        <div className="flex flex-col gap-4">
          {/* Advanced Section 1: Dynamic Data & Verification */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1">
              <span>Dynamic Data & Verification</span>
            </span>
            <div className="grid grid-cols-2 gap-2">
              {/* Dynamic QR Verification Code */}
              <button
                type="button"
                onClick={() => {
                  const now = Date.now();
                  const qrId = `adv_qr_${now}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: qrId,
                      text: "https://vpdfx.com/verify",
                      qrPayload: `VPDFX-DOC-${now}`,
                      x: 440,
                      y: 60,
                      width: 90,
                      height: 90,
                      size: 10,
                      font: "Helvetica",
                      color: "#1e1b4b",
                      page: 0,
                    }
                  ]);
                  selectSingleElement(qrId);
                  onClose();
                }}
                className="p-3 bg-gradient-to-br from-indigo-50/60 to-purple-50/40 hover:from-indigo-100/60 hover:to-purple-100/60 border border-indigo-200 rounded-xl flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs group text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <QrCode size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800 group-hover:text-indigo-700">QR Code</span>
                  <span className="text-[10px] text-gray-500">Scan & Verify</span>
                </div>
              </button>

              {/* Dynamic Page Numbering */}
              <button
                type="button"
                onClick={() => {
                  const now = Date.now();
                  const pgId = `adv_pgnum_${now}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: pgId,
                      text: "Page 1 of 1 • Confidential",
                      x: 200,
                      y: 800,
                      size: 10,
                      font: "Helvetica",
                      color: "#64748b",
                      page: 0,
                      width: 200,
                      align: "center",
                    }
                  ]);
                  selectSingleElement(pgId);
                  onClose();
                }}
                className="p-3 bg-white hover:bg-slate-50 border border-gray-200 hover:border-slate-300 rounded-xl flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs group text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <Hash size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800 group-hover:text-slate-900">Page Num</span>
                  <span className="text-[10px] text-gray-400">Footer tracker</span>
                </div>
              </button>
            </div>
          </div>

          {/* Advanced Section 2: Financial & Structured Data Blocks */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
              Data Tables & Legal Modules
            </span>
            <div className="space-y-2">
              {/* Structured Pricing / Invoice Row */}
              <button
                type="button"
                onClick={() => {
                  const now = Date.now();
                  const tableId = `adv_table_${now}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: tableId,
                      text: "DESCRIPTION                         QTY       RATE       TOTAL\n───────────────────────────────────────────────────\n01. Professional Consulting Services     10 hrs     $120.00     $1,200.00\n02. System Architecture & Setup          1 unit    $850.00       $850.00\n───────────────────────────────────────────────────\n                                                NET DUE:     $2,050.00",
                      x: 40,
                      y: 380,
                      size: 11,
                      font: "Courier",
                      color: "#1e293b",
                      page: 0,
                      width: 515,
                    }
                  ]);
                  selectSingleElement(tableId);
                  onClose();
                }}
                className="w-full p-3 bg-white hover:bg-indigo-50/50 border border-gray-200 hover:border-indigo-300 rounded-xl flex items-center gap-3 cursor-pointer transition-all shadow-2xs text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <Table size={16} />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-gray-800 group-hover:text-indigo-700">
                    Pricing & Ledger Table
                  </div>
                  <div className="text-[10px] text-gray-400">
                    Tabulated monospaced financial rows with automatic calculations
                  </div>
                </div>
              </button>

              {/* Watermark Security Banner */}
              <button
                type="button"
                onClick={() => {
                  const now = Date.now();
                  const wmarkId = `adv_wmark_${now}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: wmarkId,
                      text: "DO NOT DUPLICATE • ORIGINAL COPY",
                      x: 45,
                      y: 440,
                      size: 26,
                      font: "Helvetica",
                      color: "rgba(148, 163, 184, 0.28)",
                      page: 0,
                      bold: true,
                      width: 505,
                      align: "center",
                    }
                  ]);
                  selectSingleElement(wmarkId);
                  onClose();
                }}
                className="w-full p-3 bg-white hover:bg-rose-50/50 border border-gray-200 hover:border-rose-300 rounded-xl flex items-center gap-3 cursor-pointer transition-all shadow-2xs text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <ShieldCheck size={16} />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-gray-800 group-hover:text-rose-700">
                    Security Watermark Layer
                  </div>
                  <div className="text-[10px] text-gray-400">
                    Diagonal anti-tamper diagonal canvas watermark
                  </div>
                </div>
              </button>

              {/* Legal Terms & Clause Container */}
              <button
                type="button"
                onClick={() => {
                  const now = Date.now();
                  const clauseId = `adv_clause_${now}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: clauseId,
                      text: "CONFIDENTIALITY & GOVERNING LAW CLAUSE:\nBoth parties agree that all information disclosed under this agreement shall remain strictly confidential. This document shall be governed in accordance with applicable commercial jurisdictions.",
                      x: 45,
                      y: 620,
                      size: 9.5,
                      font: "Helvetica",
                      color: "#475569",
                      page: 0,
                      width: 505,
                    }
                  ]);
                  selectSingleElement(clauseId);
                  onClose();
                }}
                className="w-full p-3 bg-white hover:bg-purple-50/50 border border-gray-200 hover:border-purple-300 rounded-xl flex items-center gap-3 cursor-pointer transition-all shadow-2xs text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <FileCheck2 size={16} />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-gray-800 group-hover:text-purple-700">
                    Legal Terms & Fine Print
                  </div>
                  <div className="text-[10px] text-gray-400">
                    Jurisdiction notice and standard binding compliance disclaimer
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

