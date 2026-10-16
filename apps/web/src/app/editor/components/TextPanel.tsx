"use client";
import React, { useState } from "react";
import {
  X, Plus, Sparkles, PanelTopClose, PanelBottomClose,
  Lock, Unlock, Trash2, Calendar, Hash, CheckSquare,
  FileText, ArrowRight, Layers
} from "lucide-react";
import { CanvasTextElement } from "./types";

interface TextPanelProps {
  onClose: () => void;
  addTextElement: (
    type: "heading" | "subheading" | "body" | "header" | "footer",
    targetPage?: number,
    customProps?: Partial<CanvasTextElement>
  ) => void;
  elements: CanvasTextElement[];
  activeElementId: string | null;
  setActiveElementId: (id: string | null) => void;
  toggleLockElements: (ids?: string[]) => void;
  deleteElement: (id: string) => void;
}

// Curated Canva-style typography combinations
const FONT_COMBINATIONS = [
  {
    name: "Editorial Elegance",
    category: "Classic",
    primary: "ELEGANT EDITORIAL",
    secondary: "Sophisticated luxury magazine layout",
    font: "Georgia",
    color: "#0f172a",
    size: 26,
    subSize: 13,
    bold: true,
  },
  {
    name: "Modern Minimalist",
    category: "Clean",
    primary: "CLEAN & MODERN",
    secondary: "Sleek sans-serif high readability",
    font: "Helvetica",
    color: "#1e293b",
    size: 24,
    subSize: 13,
    bold: true,
  },
  {
    name: "Corporate Executive",
    category: "Business",
    primary: "EXECUTIVE REPORT",
    secondary: "Quarterly summary and performance metrics",
    font: "Times New Roman",
    color: "#0f172a",
    size: 24,
    subSize: 12,
    bold: true,
  },
  {
    name: "Tech Monospace",
    category: "Code",
    primary: "DEVELOPER BUILD",
    secondary: "TERMINAL_SPEC // V2.0.4",
    font: "Courier New",
    color: "#09090b",
    size: 20,
    subSize: 12,
    bold: true,
  },
  {
    name: "Impact Poster",
    category: "Display",
    primary: "BIG ANNOUNCEMENT",
    secondary: "High energy, bold and prominent",
    font: "Impact",
    color: "#4f46e5",
    size: 30,
    subSize: 14,
    bold: true,
  },
];

export default function TextPanel({
  onClose,
  addTextElement,
  elements,
  activeElementId,
  setActiveElementId,
  toggleLockElements,
  deleteElement,
}: TextPanelProps) {
  const [activeTab, setActiveTab] = useState<"standard" | "combinations" | "elements">("standard");

  return (
    <div className="fixed sm:static bottom-0 sm:bottom-auto inset-x-0 sm:inset-x-auto max-h-[82vh] sm:max-h-none w-full sm:w-[320px] h-auto sm:h-full bg-white border-t sm:border-t-0 sm:border-r border-gray-200/90 rounded-t-3xl sm:rounded-none flex flex-col z-50 sm:z-20 shrink-0 shadow-2xl sm:shadow-none animate-in slide-in-from-bottom-6 sm:slide-in-from-left-4 duration-200 overflow-hidden">
      
      {/* Header with Title & Tabs */}
      <div className="p-4 pb-3 border-b border-gray-100 shrink-0 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <span className="font-black text-sm">T</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base leading-tight">Typography</h3>
              <p className="text-[11px] text-gray-400">Add text & styles to your PDF</p>
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

        {/* Tab Pills */}
        <div className="flex p-0.5 bg-gray-100 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("standard")}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
              activeTab === "standard"
                ? "bg-white text-gray-900 shadow-xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Basic Text
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("combinations")}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === "combinations"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Sparkles size={12} />
            <span>Styles</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("elements")}
            className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
              activeTab === "elements"
                ? "bg-white text-gray-900 shadow-xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Layers ({elements.length})
          </button>
        </div>
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">

        {/* TAB 1: BASIC TEXT */}
        {activeTab === "standard" && (
          <div className="space-y-4">
            {/* Primary Action Button (Canva Signature Style) */}
            <button
              type="button"
              onClick={() => addTextElement("body")}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-center font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-100 transition-all cursor-pointer active:scale-[0.98]"
            >
              <Plus size={18} strokeWidth={2.5} />
              <span>Add a text box</span>
            </button>

            {/* Default Text Hierarchy Card Stack */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">Default Text Styles</span>

              {/* Heading */}
              <button
                type="button"
                onClick={() => addTextElement("heading")}
                className="w-full p-3.5 bg-gray-50/70 hover:bg-indigo-50/40 border border-gray-200/80 hover:border-indigo-400/80 rounded-xl text-left transition-all group flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xl font-extrabold text-gray-900 group-hover:text-indigo-600 tracking-tight transition-colors">
                    Add a heading
                  </div>
                  <div className="text-[11px] text-gray-400 font-normal mt-0.5">Title • 32px Bold</div>
                </div>
                <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 group-hover:border-indigo-300 flex items-center justify-center text-gray-400 group-hover:text-indigo-600 shadow-2xs transition-all">
                  <Plus size={15} />
                </div>
              </button>

              {/* Subheading */}
              <button
                type="button"
                onClick={() => addTextElement("subheading")}
                className="w-full p-3.5 bg-gray-50/70 hover:bg-indigo-50/40 border border-gray-200/80 hover:border-indigo-400/80 rounded-xl text-left transition-all group flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-base font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                    Add a subheading
                  </div>
                  <div className="text-[11px] text-gray-400 font-normal mt-0.5">Section header • 22px Medium</div>
                </div>
                <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 group-hover:border-indigo-300 flex items-center justify-center text-gray-400 group-hover:text-indigo-600 shadow-2xs transition-all">
                  <Plus size={15} />
                </div>
              </button>

              {/* Body */}
              <button
                type="button"
                onClick={() => addTextElement("body")}
                className="w-full p-3 bg-gray-50/70 hover:bg-indigo-50/40 border border-gray-200/80 hover:border-indigo-400/80 rounded-xl text-left transition-all group flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-sm font-normal text-gray-700 group-hover:text-indigo-600 transition-colors">
                    Add a little bit of body text
                  </div>
                  <div className="text-[11px] text-gray-400 font-normal mt-0.5">Paragraph • 15px Regular</div>
                </div>
                <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 group-hover:border-indigo-300 flex items-center justify-center text-gray-400 group-hover:text-indigo-600 shadow-2xs transition-all">
                  <Plus size={15} />
                </div>
              </button>
            </div>

            {/* Document Header & Footer Section */}
            <div className="pt-3 border-t border-gray-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">Document Layout</span>
                <span className="text-[10px] text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded font-semibold">All Pages</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => addTextElement("header")}
                  className="p-3 bg-gradient-to-br from-purple-50/80 to-purple-50/30 hover:to-purple-100/70 text-purple-800 border border-purple-200/70 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
                >
                  <PanelTopClose size={16} className="text-purple-600" />
                  <span>+ Header</span>
                  <span className="text-[10px] font-normal text-purple-500">Top of doc</span>
                </button>

                <button
                  type="button"
                  onClick={() => addTextElement("footer")}
                  className="p-3 bg-gradient-to-br from-purple-50/80 to-purple-50/30 hover:to-purple-100/70 text-purple-800 border border-purple-200/70 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-[0.98]"
                >
                  <PanelBottomClose size={16} className="text-purple-600" />
                  <span>+ Footer</span>
                  <span className="text-[10px] font-normal text-purple-500">Bottom of doc</span>
                </button>
              </div>
            </div>

            {/* Quick Helper Badges */}
            <div className="pt-2 border-t border-gray-100 space-y-2">
              <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">Quick Add</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
                    addTextElement("body", 0, { text: `Date: ${today}`, size: 12, color: "#64748b" });
                  }}
                  className="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Calendar size={13} className="text-gray-400" />
                  <span>Today's Date</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    addTextElement("footer", 0, { text: "Page 1 of 1", size: 11, color: "#94a3b8", align: "right" });
                  }}
                  className="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Hash size={13} className="text-gray-400" />
                  <span>Page Number</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    addTextElement("body", 0, { text: "Authorized Signature: __________________", size: 12, color: "#475569" });
                  }}
                  className="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CheckSquare size={13} className="text-gray-400" />
                  <span>Signature Line</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FONT COMBINATIONS & PRESETS */}
        {activeTab === "combinations" && (
          <div className="space-y-3">
            <div className="text-xs text-gray-500">
              Click any style to insert professionally paired typography onto your PDF page.
            </div>

            <div className="space-y-2.5">
              {FONT_COMBINATIONS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    addTextElement("heading", 0, {
                      text: preset.primary,
                      font: preset.font,
                      size: preset.size,
                      color: preset.color,
                      bold: preset.bold,
                    });
                  }}
                  className="w-full p-4 bg-gray-50/70 hover:bg-indigo-50/50 border border-gray-200 hover:border-indigo-400 rounded-xl text-left transition-all group cursor-pointer shadow-2xs hover:shadow-xs"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {preset.category}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">{preset.font}</span>
                  </div>
                  <div
                    style={{ fontFamily: preset.font }}
                    className="text-lg font-bold text-gray-900 leading-snug group-hover:text-indigo-600 transition-colors"
                  >
                    {preset.primary}
                  </div>
                  <div
                    style={{ fontFamily: preset.font }}
                    className="text-xs text-gray-500 mt-1"
                  >
                    {preset.secondary}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CURRENT ELEMENTS LIST */}
        {activeTab === "elements" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{elements.length} element{elements.length !== 1 ? 's' : ''} on this document</span>
              {elements.length > 0 && (
                <span className="text-[11px] text-gray-400">Click to select & edit</span>
              )}
            </div>

            {elements.length === 0 ? (
              <div className="p-8 text-center text-gray-400 space-y-2">
                <FileText size={24} className="mx-auto text-gray-300" />
                <div className="text-xs font-medium">No elements added yet</div>
                <button
                  type="button"
                  onClick={() => setActiveTab("standard")}
                  className="text-xs text-indigo-600 font-semibold hover:underline"
                >
                  Add your first text box
                </button>
              </div>
            ) : (
              <div className="space-y-1.5">
                {elements.map((el) => {
                  const isActive = activeElementId === el.id;
                  return (
                    <div
                      key={el.id}
                      onClick={() => setActiveElementId(el.id)}
                      className={`px-3 py-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-all border ${
                        isActive
                          ? "bg-indigo-50 border-indigo-300 shadow-xs"
                          : "bg-gray-50/70 hover:bg-gray-100/70 border-gray-200/80 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate max-w-[200px]">
                        <div
                          className="w-3 h-3 rounded-full shrink-0 border border-gray-300"
                          style={{ backgroundColor: el.color || "#000000" }}
                        />
                        {el.repeatAllPages && (
                          <span className="text-[9px] font-extrabold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded shrink-0">
                            ALL
                          </span>
                        )}
                        <span className={`text-xs truncate ${isActive ? "font-bold text-indigo-900" : "font-medium"}`}>
                          {el.text || (el.isShape ? `Shape (${el.shapeType})` : "(Empty text)")}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLockElements([el.id]);
                          }}
                          className={`p-1 rounded-md transition-colors ${
                            el.locked
                              ? "text-amber-600 bg-amber-50"
                              : "text-gray-400 hover:text-gray-600 hover:bg-gray-200/50"
                          }`}
                          title={el.locked ? "Unlock" : "Lock"}
                        >
                          {el.locked ? <Lock size={13} /> : <Unlock size={13} />}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteElement(el.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

