"use client";
import React, { useState } from "react";
import {
  X, Type, Shapes, Minus, Square, Circle,
  Sparkles, Stamp, ShieldCheck, Bookmark,
  Layers, Lightbulb, Check, ChevronRight,
  MessageSquare, BadgePercent, QrCode, Tag, Award, Heart
} from "lucide-react";
import { CanvasTextElement } from "./types";

interface ElementsPanelProps {
  onClose: () => void;
  addTextElement: (type: "body") => void;
  setActiveSidebarTab: (tab: any) => void;
  addShapeElement: (
    shapeType: 'rect' | 'circle' | 'line' | 'arrow' | 'star' | 'badge' | 'pageBorder' | 'footerLine' | 'headerLine' | 'roundedRect' | 'triangle' | 'callout',
    targetPage?: number,
    repeatAll?: boolean
  ) => void;
  setElements: React.Dispatch<React.SetStateAction<CanvasTextElement[]>>;
  selectSingleElement: (id: string | null) => void;
}

export default function ElementsPanel({
  onClose,
  addTextElement,
  setActiveSidebarTab,
  addShapeElement,
  setElements,
  selectSingleElement,
}: ElementsPanelProps) {
  const [activeTab, setActiveTab] = useState<"all" | "shapes" | "dividers" | "stamps" | "badges" | "callouts" | "icons">("all");

  return (
    <div className="fixed sm:static bottom-0 sm:bottom-auto inset-x-0 sm:inset-x-auto max-h-[82vh] sm:max-h-none w-full sm:w-[320px] h-auto sm:h-full bg-white border-t sm:border-t-0 sm:border-r border-gray-200/90 rounded-t-3xl sm:rounded-none flex flex-col z-50 sm:z-20 shrink-0 shadow-2xl sm:shadow-none animate-in slide-in-from-bottom-6 sm:slide-in-from-left-4 duration-200 overflow-hidden">

      {/* Header with Title & Filter Pills */}
      <div className="p-4 pb-3 border-b border-gray-100 shrink-0 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Shapes size={15} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base leading-tight">Elements & Shapes</h3>
              <p className="text-[11px] text-gray-400">Lines, shapes, stamps & frames</p>
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

        {/* Tab Filters - Scrollable Slider Bar */}
        <div className="flex items-center gap-1 p-1 bg-gray-100/90 rounded-xl overflow-x-auto hide-scrollbar text-xs font-semibold scroll-smooth">
          {[
            { id: "all", label: "All" },
            { id: "shapes", label: "Shapes" },
            { id: "dividers", label: "Dividers" },
            { id: "stamps", label: "Stamps" },
            { id: "badges", label: "Badges" },
            { id: "callouts", label: "Callouts" },
            { id: "icons", label: "Icons" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer text-xs shrink-0 ${
                activeTab === tab.id
                  ? "bg-white text-indigo-600 font-bold shadow-xs ring-1 ring-black/5"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">

        {/* Quick Add Text Box Banner */}
        {(activeTab === "all" || activeTab === "shapes") && (
          <button
            type="button"
            onClick={() => {
              addTextElement("body");
              setActiveSidebarTab('text');
            }}
            className="w-full py-2.5 px-3.5 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border border-indigo-200/80 rounded-xl text-xs font-bold text-indigo-900 flex items-center justify-between transition-all cursor-pointer shadow-2xs group"
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                T
              </div>
              <span>Add Editable Text Box</span>
            </div>
            <ChevronRight size={14} className="text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}

        {/* SECTION 1: PAGE BORDERS & DIVIDERS */}
        {(activeTab === "all" || activeTab === "dividers") && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">Page Layout Dividers</span>
              <span className="text-[10px] text-purple-600 bg-purple-50 font-semibold px-2 py-0.5 rounded-full">All Pages</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Full Perimeter Border */}
              <button
                type="button"
                onClick={() => addShapeElement('pageBorder', 0, true)}
                className="p-3 bg-gray-50/70 hover:bg-indigo-50/40 border border-gray-200/80 hover:border-indigo-400/80 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer group shadow-2xs"
              >
                <div className="w-12 h-14 border-2 border-indigo-600 bg-white rounded-sm shadow-2xs group-hover:scale-105 transition-transform flex items-center justify-center p-1">
                  <div className="w-full h-full border border-dashed border-indigo-200" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Page Border</div>
                  <div className="text-[10px] text-gray-400">All 4 Margins</div>
                </div>
              </button>

              {/* Footer Line */}
              <button
                type="button"
                onClick={() => addShapeElement('footerLine', 0, true)}
                className="p-3 bg-gray-50/70 hover:bg-purple-50/40 border border-gray-200/80 hover:border-purple-400/80 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer group shadow-2xs"
              >
                <div className="w-12 h-14 border border-gray-200 bg-white rounded-sm shadow-2xs group-hover:scale-105 transition-transform flex flex-col justify-end p-1.5">
                  <div className="w-full h-1 bg-purple-600 rounded-full" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900 group-hover:text-purple-600 transition-colors">Footer Line</div>
                  <div className="text-[10px] text-gray-400">Bottom Divider</div>
                </div>
              </button>

              {/* Header Line */}
              <button
                type="button"
                onClick={() => addShapeElement('headerLine', 0, true)}
                className="p-3 bg-gray-50/70 hover:bg-indigo-50/40 border border-gray-200/80 hover:border-indigo-400/80 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer group shadow-2xs"
              >
                <div className="w-12 h-14 border border-gray-200 bg-white rounded-sm shadow-2xs group-hover:scale-105 transition-transform flex flex-col justify-start p-1.5">
                  <div className="w-full h-1 bg-indigo-600 rounded-full" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Header Line</div>
                  <div className="text-[10px] text-gray-400">Top Divider</div>
                </div>
              </button>

              {/* Section Divider */}
              <button
                type="button"
                onClick={() => addShapeElement('line')}
                className="p-3 bg-gray-50/70 hover:bg-indigo-50/40 border border-gray-200/80 hover:border-indigo-400/80 rounded-xl flex flex-col items-center justify-center gap-2 text-center transition-all cursor-pointer group shadow-2xs"
              >
                <div className="w-12 h-14 border border-gray-200 bg-white rounded-sm shadow-2xs group-hover:scale-105 transition-transform flex items-center justify-center p-1.5">
                  <div className="w-full h-1 bg-gray-700 rounded-full" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">Section Line</div>
                  <div className="text-[10px] text-gray-400">Custom Divider</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* SECTION 2: GEOMETRIC SHAPES */}
        {(activeTab === "all" || activeTab === "shapes") && (
          <div className="pt-2 border-t border-gray-100 space-y-2.5">
            <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">Geometric Shapes</span>

            <div className="grid grid-cols-3 gap-2">
              {/* Rectangle */}
              <button
                type="button"
                onClick={() => addShapeElement('rect')}
                className="p-3 bg-gray-50/70 hover:bg-indigo-50/50 border border-gray-200/80 hover:border-indigo-400 rounded-xl flex flex-col items-center justify-center gap-1.5 group transition-all cursor-pointer shadow-2xs"
              >
                <div className="w-9 h-7 rounded-xs border-2 border-indigo-600 bg-indigo-50 group-hover:scale-105 transition-transform" />
                <span className="text-[11px] font-semibold text-gray-700 group-hover:text-indigo-600">Rectangle</span>
              </button>

              {/* Rounded Rectangle */}
              <button
                type="button"
                onClick={() => addShapeElement('roundedRect')}
                className="p-3 bg-gray-50/70 hover:bg-indigo-50/50 border border-gray-200/80 hover:border-indigo-400 rounded-xl flex flex-col items-center justify-center gap-1.5 group transition-all cursor-pointer shadow-2xs"
              >
                <div className="w-9 h-7 rounded-lg border-2 border-indigo-600 bg-indigo-50 group-hover:scale-105 transition-transform" />
                <span className="text-[11px] font-semibold text-gray-700 group-hover:text-indigo-600">Rounded</span>
              </button>

              {/* Circle */}
              <button
                type="button"
                onClick={() => addShapeElement('circle')}
                className="p-3 bg-gray-50/70 hover:bg-indigo-50/50 border border-gray-200/80 hover:border-indigo-400 rounded-xl flex flex-col items-center justify-center gap-1.5 group transition-all cursor-pointer shadow-2xs"
              >
                <div className="w-7 h-7 rounded-full border-2 border-indigo-600 bg-indigo-50 group-hover:scale-105 transition-transform" />
                <span className="text-[11px] font-semibold text-gray-700 group-hover:text-indigo-600">Circle</span>
              </button>

              {/* Triangle */}
              <button
                type="button"
                onClick={() => addShapeElement('triangle')}
                className="p-3 bg-gray-50/70 hover:bg-indigo-50/50 border border-gray-200/80 hover:border-indigo-400 rounded-xl flex flex-col items-center justify-center gap-1.5 group transition-all cursor-pointer shadow-2xs"
              >
                <div className="text-indigo-600 text-xl font-bold group-hover:scale-110 transition-transform leading-none">▲</div>
                <span className="text-[11px] font-semibold text-gray-700 group-hover:text-indigo-600">Triangle</span>
              </button>

              {/* Star */}
              <button
                type="button"
                onClick={() => addShapeElement('star')}
                className="p-3 bg-gray-50/70 hover:bg-indigo-50/50 border border-gray-200/80 hover:border-indigo-400 rounded-xl flex flex-col items-center justify-center gap-1.5 group transition-all cursor-pointer shadow-2xs"
              >
                <div className="text-amber-500 text-xl font-bold group-hover:scale-110 transition-transform leading-none">★</div>
                <span className="text-[11px] font-semibold text-gray-700 group-hover:text-indigo-600">Star</span>
              </button>

              {/* Arrow */}
              <button
                type="button"
                onClick={() => addShapeElement('arrow')}
                className="p-3 bg-gray-50/70 hover:bg-indigo-50/50 border border-gray-200/80 hover:border-indigo-400 rounded-xl flex flex-col items-center justify-center gap-1.5 group transition-all cursor-pointer shadow-2xs"
              >
                <div className="text-indigo-600 font-bold text-sm group-hover:scale-110 transition-transform">──►</div>
                <span className="text-[11px] font-semibold text-gray-700 group-hover:text-indigo-600">Arrow</span>
              </button>
            </div>
          </div>
        )}

        {/* SECTION 3: CALLOUTS & NOTES */}
        {(activeTab === "all" || activeTab === "callouts") && (
          <div className="pt-2 border-t border-gray-100 space-y-2">
            <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">Callouts & Notes</span>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => addShapeElement('callout')}
                className="w-full p-3.5 border border-indigo-200 bg-gradient-to-r from-indigo-50/40 to-indigo-50/20 hover:from-indigo-100/50 hover:to-indigo-50/60 rounded-xl flex items-center gap-3 cursor-pointer transition-all shadow-2xs text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  💡
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    Tip / Note Callout
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    Indigo highlight container for important notes
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  const newId = `warning_${Date.now()}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: newId,
                      text: "⚠️ WARNING: Please verify all terms and specifications before execution.",
                      x: 80,
                      y: 260,
                      size: 11,
                      font: "Helvetica",
                      color: "#991b1b",
                      page: 0,
                      bold: true,
                      isShape: true,
                      shapeType: 'callout',
                      bgColor: "rgba(254, 242, 242, 0.9)",
                      borderColor: "#f87171",
                      borderWidth: 1.5,
                      width: 430,
                      height: 48,
                    }
                  ]);
                  selectSingleElement(newId);
                }}
                className="w-full p-3.5 border border-amber-200 bg-gradient-to-r from-amber-50/50 to-orange-50/30 hover:from-amber-100/50 hover:to-orange-50/50 rounded-xl flex items-center gap-3 cursor-pointer transition-all shadow-2xs text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                  ⚠️
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-gray-900 group-hover:text-amber-700 transition-colors">
                    Warning / Caution Banner
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    Alert box with prominent safety notice styling
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* SECTION 4: DOCUMENT STAMPS */}
        {(activeTab === "all" || activeTab === "stamps") && (
          <div className="pt-2 border-t border-gray-100 space-y-2.5">
            <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">Document Stamps</span>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Approved Stamp */}
              <button
                type="button"
                onClick={() => {
                  const newId = `badge_${Date.now()}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: newId,
                      text: "✓ APPROVED",
                      x: 180,
                      y: 200,
                      size: 16,
                      font: "Helvetica",
                      color: "#059669",
                      page: 0,
                      bold: true,
                      isShape: true,
                      shapeType: 'badge',
                      bgColor: "rgba(16, 185, 129, 0.12)",
                      borderColor: "#059669",
                      borderWidth: 2,
                      width: 150,
                      height: 42,
                    }
                  ]);
                  selectSingleElement(newId);
                }}
                className="p-3 border-2 border-dashed border-emerald-400 bg-emerald-50/50 hover:bg-emerald-100/60 text-emerald-800 rounded-xl text-xs font-black text-center transition-all cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
              >
                ✓ APPROVED
              </button>

              {/* Confidential Stamp */}
              <button
                type="button"
                onClick={() => {
                  const newId = `badge_${Date.now()}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: newId,
                      text: "🔒 CONFIDENTIAL",
                      x: 180,
                      y: 200,
                      size: 14,
                      font: "Helvetica",
                      color: "#dc2626",
                      page: 0,
                      bold: true,
                      isShape: true,
                      shapeType: 'badge',
                      bgColor: "rgba(239, 68, 68, 0.12)",
                      borderColor: "#dc2626",
                      borderWidth: 2,
                      width: 160,
                      height: 42,
                    }
                  ]);
                  selectSingleElement(newId);
                }}
                className="p-3 border-2 border-dashed border-red-400 bg-red-50/50 hover:bg-red-100/60 text-red-800 rounded-xl text-xs font-black text-center transition-all cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
              >
                🔒 CONFIDENTIAL
              </button>

              {/* Draft Stamp */}
              <button
                type="button"
                onClick={() => {
                  const newId = `badge_${Date.now()}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: newId,
                      text: "DRAFT",
                      x: 180,
                      y: 200,
                      size: 16,
                      font: "Helvetica",
                      color: "#475569",
                      page: 0,
                      bold: true,
                      isShape: true,
                      shapeType: 'badge',
                      bgColor: "rgba(100, 116, 139, 0.12)",
                      borderColor: "#475569",
                      borderWidth: 2,
                      width: 140,
                      height: 42,
                    }
                  ]);
                  selectSingleElement(newId);
                }}
                className="p-3 border-2 border-dashed border-slate-400 bg-slate-50/50 hover:bg-slate-100/60 text-slate-800 rounded-xl text-xs font-black text-center transition-all cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
              >
                ✎ DRAFT
              </button>

              {/* Verified Stamp */}
              <button
                type="button"
                onClick={() => {
                  const newId = `badge_${Date.now()}`;
                  setElements(prev => [
                    ...prev,
                    {
                      id: newId,
                      text: "★ VERIFIED",
                      x: 180,
                      y: 200,
                      size: 16,
                      font: "Helvetica",
                      color: "#4f46e5",
                      page: 0,
                      bold: true,
                      isShape: true,
                      shapeType: 'badge',
                      bgColor: "rgba(79, 70, 229, 0.12)",
                      borderColor: "#4f46e5",
                      borderWidth: 2,
                      width: 140,
                      height: 42,
                    }
                  ]);
                  selectSingleElement(newId);
                }}
                className="p-3 border-2 border-dashed border-indigo-400 bg-indigo-50/50 hover:bg-indigo-100/60 text-indigo-800 rounded-xl text-xs font-black text-center transition-all cursor-pointer shadow-2xs hover:scale-[1.02] active:scale-[0.98]"
              >
                ★ VERIFIED
              </button>
            </div>
          </div>
        )}

        {/* SECTION 5: BADGES & TAGS */}
        {(activeTab === "all" || activeTab === "badges") && (
          <div className="pt-2 border-t border-gray-100 space-y-2.5">
            <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">Tags & Status Badges</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "PRIORITY", color: "#e11d48", bg: "#ffe4e6", border: "#fda4af" },
                { label: "PAID IN FULL", color: "#15803d", bg: "#dcfce7", border: "#86efac" },
                { label: "PENDING REVIEW", color: "#b45309", bg: "#fef3c7", border: "#fde68a" },
                { label: "OFFICIAL SEAL", color: "#4338ca", bg: "#e0e7ff", border: "#a5b4fc" },
              ].map((b, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    const newId = `tag_${Date.now()}_${idx}`;
                    setElements(prev => [
                      ...prev,
                      {
                        id: newId,
                        text: b.label,
                        x: 160,
                        y: 180,
                        size: 11,
                        font: "Helvetica",
                        color: b.color,
                        page: 0,
                        bold: true,
                        isShape: true,
                        shapeType: 'badge',
                        bgColor: b.bg,
                        borderColor: b.border,
                        borderWidth: 1.5,
                        width: 130,
                        height: 32,
                        align: "center",
                      }
                    ]);
                    selectSingleElement(newId);
                  }}
                  style={{ color: b.color, backgroundColor: b.bg, borderColor: b.border }}
                  className="p-2 border rounded-lg text-[10px] font-black text-center transition-all cursor-pointer shadow-2xs hover:scale-[1.03] active:scale-[0.97]"
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 6: ICONS & SYMBOLS */}
        {(activeTab === "all" || activeTab === "icons") && (
          <div className="pt-2 border-t border-gray-100 space-y-2.5">
            <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">Icons & Symbols</span>
            <div className="grid grid-cols-4 gap-2">
              {[
                { symbol: "✓", label: "Check", color: "#16a34a" },
                { symbol: "★", label: "Star", color: "#eab308" },
                { symbol: "🔒", label: "Lock", color: "#64748b" },
                { symbol: "🛡️", label: "Shield", color: "#2563eb" },
                { symbol: "✉️", label: "Mail", color: "#0284c7" },
                { symbol: "📞", label: "Phone", color: "#10b981" },
                { symbol: "📍", label: "Pin", color: "#ef4444" },
                { symbol: "🌐", label: "Web", color: "#6366f1" },
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    const newId = `icon_${Date.now()}_${idx}`;
                    setElements(prev => [
                      ...prev,
                      {
                        id: newId,
                        text: item.symbol,
                        x: 200,
                        y: 200,
                        size: 24,
                        font: "Helvetica",
                        color: item.color,
                        page: 0,
                        width: 40,
                        height: 40,
                      }
                    ]);
                    selectSingleElement(newId);
                  }}
                  className="p-2.5 bg-gray-50/80 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer group shadow-2xs"
                >
                  <span className="text-lg group-hover:scale-125 transition-transform leading-none">{item.symbol}</span>
                  <span className="text-[9px] text-gray-500 font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

