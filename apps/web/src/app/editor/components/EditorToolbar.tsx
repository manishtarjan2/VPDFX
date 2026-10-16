"use client";
import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown,
  Check,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Sliders,
  MoveHorizontal,
  Grid,
  Layers,
  Copy,
  Trash2,
  CaseSensitive,
  Group,
  Ungroup,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { CanvasTextElement, FONT_OPTIONS } from "./types";

interface EditorToolbarProps {
  activeElement: CanvasTextElement | null | undefined;
  selectedElementIds: string[];
  handleStyleChange: (prop: any, val: any) => void;
  handleListToggle: () => void;
  handlePosition: (type: 'center' | 'forward' | 'backward') => void;
  toggleRepeatAllPages: (id: string) => void;
  duplicateSelectedElements: () => void;
  deleteSelectedElements: () => void;
  handleGroupElements?: () => void;
  handleUngroupElements?: () => void;
  showFontMenu: boolean;
  setShowFontMenu: (val: boolean) => void;
  showSpacingMenu: boolean;
  setShowSpacingMenu: (val: boolean) => void;
  showTransparencyMenu: boolean;
  setShowTransparencyMenu: (val: boolean) => void;
  showEffectsMenu: boolean;
  setShowEffectsMenu: (val: boolean) => void;
  showAnimateMenu: boolean;
  setShowAnimateMenu: (val: boolean) => void;
  showPositionMenu: boolean;
  setShowPositionMenu: (val: boolean) => void;
}

function ToolbarBtn({
  icon,
  active,
  onClick,
  title,
}: {
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`h-8 min-w-[32px] px-1.5 rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 ${
        active
          ? "bg-indigo-50 text-indigo-600 font-semibold"
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      }`}
      title={title}
    >
      {icon}
    </button>
  );
}

export function EditorToolbar({
  activeElement,
  selectedElementIds,
  handleStyleChange,
  handleListToggle,
  handlePosition,
  toggleRepeatAllPages,
  duplicateSelectedElements,
  deleteSelectedElements,
  handleGroupElements,
  handleUngroupElements,
  showFontMenu,
  setShowFontMenu,
  showSpacingMenu,
  setShowSpacingMenu,
  showTransparencyMenu,
  setShowTransparencyMenu,
  showEffectsMenu,
  setShowEffectsMenu,
  showAnimateMenu,
  setShowAnimateMenu,
  showPositionMenu,
  setShowPositionMenu,
}: EditorToolbarProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const fontBtnRef = useRef<HTMLButtonElement>(null);
  const spacingBtnRef = useRef<HTMLButtonElement>(null);
  const transparencyBtnRef = useRef<HTMLButtonElement>(null);
  const effectsBtnRef = useRef<HTMLButtonElement>(null);
  const animateBtnRef = useRef<HTMLButtonElement>(null);
  const positionBtnRef = useRef<HTMLButtonElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 4);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const slideLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -220, behavior: "smooth" });
      setTimeout(checkScroll, 200);
    }
  };

  const slideRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 220, behavior: "smooth" });
      setTimeout(checkScroll, 200);
    }
  };

  const [fontPos, setFontPos] = useState({ top: 0, left: 0 });
  const [spacingPos, setSpacingPos] = useState({ top: 0, left: 0 });
  const [transparencyPos, setTransparencyPos] = useState({ top: 0, left: 0 });
  const [effectsPos, setEffectsPos] = useState({ top: 0, left: 0 });
  const [animatePos, setAnimatePos] = useState({ top: 0, left: 0 });
  const [positionPos, setPositionPos] = useState({ top: 0, left: 0 });

  const closeAllMenus = () => {
    setShowFontMenu(false);
    setShowSpacingMenu(false);
    setShowTransparencyMenu(false);
    setShowEffectsMenu(false);
    setShowAnimateMenu(false);
    setShowPositionMenu(false);
  };

  // Close menus on click outside
  useEffect(() => {
    function handleDocumentClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (
        !target.closest(".editor-portal-menu") &&
        !target.closest(".editor-toolbar-btn")
      ) {
        closeAllMenus();
      }
    }
    if (showFontMenu || showSpacingMenu || showTransparencyMenu || showEffectsMenu || showAnimateMenu || showPositionMenu) {
      document.addEventListener("mousedown", handleDocumentClick);
      return () => document.removeEventListener("mousedown", handleDocumentClick);
    }
  }, [showFontMenu, showSpacingMenu, showTransparencyMenu, showEffectsMenu, showAnimateMenu, showPositionMenu]);

  return (
    <div className="relative w-full h-11 min-h-[44px] bg-white border-b border-gray-200 flex items-center z-30 shrink-0 select-none shadow-[0_1px_2px_rgba(0,0,0,0.03)] text-xs">
      {/* Left Slider Arrow Button */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 z-40 flex items-center bg-gradient-to-r from-white via-white/95 to-transparent pr-4 pl-1">
          <button
            type="button"
            onClick={slideLeft}
            className="w-6 h-7 bg-white hover:bg-gray-100 text-gray-700 hover:text-indigo-600 rounded-md border border-gray-200 shadow-xs flex items-center justify-center cursor-pointer transition-transform active:scale-95"
            title="Slide options left"
          >
            <ChevronLeft size={15} />
          </button>
        </div>
      )}

      {/* Main Horizontal Sliding Options Strip */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="w-full h-full px-3 flex items-center justify-start gap-1 overflow-x-auto overflow-y-hidden scrollbar-none whitespace-nowrap scroll-smooth"
      >
      {/* Font Family Selector Dropdown */}
      <div className="relative border-r border-gray-200 pr-1.5 shrink-0">
        <button
          ref={fontBtnRef}
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            const next = !showFontMenu;
            closeAllMenus();
            if (next && fontBtnRef.current) {
              const rect = fontBtnRef.current.getBoundingClientRect();
              setFontPos({ top: rect.bottom + 4, left: rect.left });
            }
            setShowFontMenu(next);
          }}
          className="editor-toolbar-btn h-8 px-2.5 hover:bg-gray-100 rounded-lg text-xs font-semibold text-gray-800 min-w-[110px] max-w-[145px] flex items-center justify-between border border-gray-200 hover:border-gray-300 bg-white cursor-pointer transition-all"
          title="Font Family"
        >
          <span className="truncate">
            {activeElement?.font
              ? activeElement.font.split(",")[0].replace(/^.*[+/]/, "").substring(0, 14)
              : "Helvetica"}
          </span>
          <ChevronDown size={13} className="text-gray-400 ml-1.5 shrink-0" />
        </button>

        {mounted &&
          showFontMenu &&
          createPortal(
            <div
              className="editor-portal-menu fixed w-52 max-h-72 overflow-y-auto bg-white rounded-xl shadow-2xl border border-gray-200 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100"
              style={{ top: `${fontPos.top}px`, left: `${fontPos.left}px` }}
            >
              <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Font Family
              </div>
              {FONT_OPTIONS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    handleStyleChange("font", f);
                    setShowFontMenu(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer ${
                    (activeElement?.font || "Helvetica").includes(f)
                      ? "font-bold text-indigo-600 bg-indigo-50/50"
                      : "text-gray-700"
                  }`}
                  style={{ fontFamily: f }}
                >
                  <span>{f}</span>
                  {(activeElement?.font || "Helvetica").includes(f) && (
                    <Check size={14} className="text-indigo-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>,
            document.body
          )}
      </div>

      {/* Font Size Selector (- / input / +) */}
      <div className="flex items-center border-r border-gray-200 pr-1.5 shrink-0">
        <div className="flex items-center h-8 bg-gray-50 border border-gray-200 rounded-lg p-0.5 hover:border-gray-300 transition-colors">
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            className="w-6 h-7 rounded-md hover:bg-white hover:shadow-2xs flex items-center justify-center font-bold text-gray-600 hover:text-gray-900 cursor-pointer active:scale-95 transition-all text-xs"
            onClick={() =>
              handleStyleChange("size", Math.max(6, (activeElement?.size || 12) - 1))
            }
            title="Decrease Font Size"
          >
            -
          </button>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={activeElement ? Math.round(activeElement.size) : 12}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (!isNaN(val)) handleStyleChange("size", Math.min(200, Math.max(1, val)));
            }}
            className="w-9 text-center font-bold text-xs outline-none bg-transparent text-gray-800"
            placeholder="12"
            title="Font Size"
          />
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            className="w-6 h-7 rounded-md hover:bg-white hover:shadow-2xs flex items-center justify-center font-bold text-gray-600 hover:text-gray-900 cursor-pointer active:scale-95 transition-all text-xs"
            onClick={() =>
              handleStyleChange("size", (activeElement?.size || 12) + 1)
            }
            title="Increase Font Size"
          >
            +
          </button>
        </div>
      </div>

      {/* Text Color Picker */}
      <div className="flex items-center border-r border-gray-200 pr-1.5 shrink-0">
        <label
          className="relative group cursor-pointer h-8 min-w-[32px] px-1.5 rounded-lg hover:bg-gray-100 flex flex-col items-center justify-center transition-colors"
          title="Text Color"
        >
          <span
            className="font-black text-sm leading-none"
            style={{ color: activeElement?.color || "#000000" }}
          >
            A
          </span>
          <span
            className="w-4 h-1 rounded-full mt-0.5 shadow-2xs"
            style={{ backgroundColor: activeElement?.color || "#000000" }}
          />
          <input
            type="color"
            value={
              activeElement?.color && activeElement.color.startsWith("#")
                ? activeElement.color
                : "#000000"
            }
            onChange={(e) => handleStyleChange("color", e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </label>
      </div>

      {/* Font Style Toggles (Bold, Italic, Underline, Strikethrough) */}
      <div className="flex items-center gap-0.5 border-r border-gray-200 pr-1.5 shrink-0">
        <ToolbarBtn
          icon={<Bold size={15} />}
          active={!!activeElement?.bold}
          onClick={() => handleStyleChange("bold", !activeElement?.bold)}
          title="Bold"
        />
        <ToolbarBtn
          icon={<Italic size={15} />}
          active={!!activeElement?.italic}
          onClick={() => handleStyleChange("italic", !activeElement?.italic)}
          title="Italic"
        />
        <ToolbarBtn
          icon={<Underline size={15} />}
          active={!!activeElement?.underline}
          onClick={() => handleStyleChange("underline", !activeElement?.underline)}
          title="Underline"
        />
        <ToolbarBtn
          icon={<Strikethrough size={15} />}
          active={!!activeElement?.strikethrough}
          onClick={() =>
            handleStyleChange("strikethrough", !activeElement?.strikethrough)
          }
          title="Strikethrough"
        />
      </div>

      {/* Alignment Single Cycle Button (Canva-style) & List Toggle */}
      <div className="flex items-center gap-0.5 border-r border-gray-200 pr-1.5 shrink-0">
        <ToolbarBtn
          icon={
            activeElement?.align === "center" ? (
              <AlignCenter size={15} />
            ) : activeElement?.align === "right" ? (
              <AlignRight size={15} />
            ) : (
              <AlignLeft size={15} />
            )
          }
          active={activeElement?.align !== undefined && activeElement.align !== "left"}
          onClick={() => {
            const current = activeElement?.align || "left";
            const next = current === "left" ? "center" : current === "center" ? "right" : "left";
            handleStyleChange("align", next);
          }}
          title={`Alignment: ${
            activeElement?.align === "center"
              ? "Center (click for Right)"
              : activeElement?.align === "right"
              ? "Right (click for Left)"
              : "Left (click for Center)"
          }`}
        />
        {(() => {
          const firstLine = (activeElement?.text || "").split("\n")[0] || "";
          const isNumbered = /^\d+[\.\)]\s/.test(firstLine);
          const isAlphaUpper = /^[A-Z][\.\)]\s/.test(firstLine);
          const isAlphaLower = /^[a-z][\.\)]\s/.test(firstLine);
          const isBullet = /^•\s/.test(firstLine);
          const isListActive = isBullet || isNumbered || isAlphaUpper || isAlphaLower;

          let label = "Lists (click to cycle: Bullet • -> 1,2,3 -> A,B,C -> a,b,c -> Off)";
          if (isBullet) label = "List: Bullets • (click for 1, 2, 3...)";
          else if (isNumbered) label = "List: Numbers 1, 2, 3... (click for A, B, C...)";
          else if (isAlphaUpper) label = "List: Uppercase A, B, C... (click for a, b, c...)";
          else if (isAlphaLower) label = "List: Lowercase a, b, c... (click to turn off)";

          return (
            <ToolbarBtn
              icon={
                isNumbered ? (
                  <ListOrdered size={15} />
                ) : isAlphaUpper ? (
                  <span className="font-bold text-[11px] leading-none">A.</span>
                ) : isAlphaLower ? (
                  <span className="font-bold text-[11px] leading-none">a.</span>
                ) : (
                  <List size={15} />
                )
              }
              active={isListActive}
              onClick={handleListToggle}
              title={label}
            />
          );
        })()}
      </div>

      {/* Text Case & Spacing */}
      <div className="flex items-center gap-0.5 border-r border-gray-200 pr-1.5 shrink-0">
        <ToolbarBtn
          icon={<CaseSensitive size={15} />}
          active={!!activeElement?.uppercase}
          onClick={() =>
            handleStyleChange("uppercase", !activeElement?.uppercase)
          }
          title="Uppercase Toggle (aA)"
        />

        {/* Spacing Button (Canva Style) */}
        <div className="relative">
          <button
            ref={spacingBtnRef}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              const next = !showSpacingMenu;
              closeAllMenus();
              if (next && spacingBtnRef.current) {
                const rect = spacingBtnRef.current.getBoundingClientRect();
                setSpacingPos({ top: rect.bottom + 4, left: Math.max(10, rect.left - 40) });
              }
              setShowSpacingMenu(next);
            }}
            className={`editor-toolbar-btn h-8 min-w-[32px] px-1.5 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              showSpacingMenu || (activeElement?.letterSpacing && activeElement.letterSpacing !== 0)
                ? "bg-indigo-50 text-indigo-600 font-semibold"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
            title="Spacing"
          >
            {/* Canva Spacing Icon: Horizontal line with outward arrows */}
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="8" x2="13" y2="8" />
              <polyline points="5 5 2 8 5 11" />
              <polyline points="11 5 14 8 11 11" />
            </svg>
          </button>
          {mounted &&
            showSpacingMenu &&
            createPortal(
              <div
                className="editor-portal-menu fixed w-56 bg-white rounded-xl shadow-2xl border border-gray-200 p-3 z-[9999] animate-in fade-in zoom-in-95 duration-100 space-y-2.5"
                style={{ top: `${spacingPos.top}px`, left: `${spacingPos.left}px` }}
              >
                <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                  <span>Letter spacing</span>
                  <span className="font-semibold text-gray-500">{activeElement?.letterSpacing ?? 0}</span>
                </div>
                <input
                  type="range"
                  min="-2"
                  max="20"
                  step="0.5"
                  value={activeElement?.letterSpacing ?? 0}
                  onChange={(e) => handleStyleChange("letterSpacing", parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg"
                />
              </div>,
              document.body
            )}
        </div>

        {/* Transparency / Opacity Button (Canva Style: Checkerboard Grid) */}
        <div className="relative">
          <button
            ref={transparencyBtnRef}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              const next = !showTransparencyMenu;
              closeAllMenus();
              if (next && transparencyBtnRef.current) {
                const rect = transparencyBtnRef.current.getBoundingClientRect();
                setTransparencyPos({ top: rect.bottom + 4, left: Math.max(10, rect.left - 40) });
              }
              setShowTransparencyMenu(next);
            }}
            className={`editor-toolbar-btn h-8 min-w-[32px] px-1.5 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
              showTransparencyMenu || (activeElement?.opacity !== undefined && activeElement.opacity < 1)
                ? "bg-indigo-50 text-indigo-600 font-semibold"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
            title={`Transparency: ${Math.round((activeElement?.opacity ?? 1) * 100)}%`}
          >
            {/* Canva Transparency Icon: 3x3 checkered opacity grid */}
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
              <rect x="2" y="2" width="4" height="4" rx="0.5" fill="currentColor" fillOpacity="0.85" />
              <rect x="6" y="2" width="4" height="4" rx="0.5" fill="currentColor" fillOpacity="0.3" />
              <rect x="10" y="2" width="4" height="4" rx="0.5" fill="currentColor" fillOpacity="0.85" />
              <rect x="2" y="6" width="4" height="4" rx="0.5" fill="currentColor" fillOpacity="0.3" />
              <rect x="6" y="6" width="4" height="4" rx="0.5" fill="currentColor" fillOpacity="0.85" />
              <rect x="10" y="6" width="4" height="4" rx="0.5" fill="currentColor" fillOpacity="0.3" />
              <rect x="2" y="10" width="4" height="4" rx="0.5" fill="currentColor" fillOpacity="0.85" />
              <rect x="6" y="10" width="4" height="4" rx="0.5" fill="currentColor" fillOpacity="0.3" />
              <rect x="10" y="10" width="4" height="4" rx="0.5" fill="currentColor" fillOpacity="0.85" />
            </svg>
          </button>
          {mounted &&
            showTransparencyMenu &&
            createPortal(
              <div
                className="editor-portal-menu fixed w-56 bg-white rounded-xl shadow-2xl border border-gray-200 p-3 z-[9999] animate-in fade-in zoom-in-95 duration-100 space-y-2.5"
                style={{ top: `${transparencyPos.top}px`, left: `${transparencyPos.left}px` }}
              >
                <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                  <span>Transparency</span>
                  <span className="font-semibold text-gray-500">{Math.round((activeElement?.opacity ?? 1) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={Math.round((activeElement?.opacity ?? 1) * 100)}
                  onChange={(e) => handleStyleChange("opacity", parseFloat((parseInt(e.target.value) / 100).toFixed(2)))}
                  className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg"
                />
              </div>,
              document.body
            )}
        </div>
      </div>

      {/* Effects, Animate, and Position Menus */}
      <div className="flex items-center gap-1 pl-0.5 shrink-0">
        {/* Effects Toggle */}
        <div className="relative">
          <button
            ref={effectsBtnRef}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              const next = !showEffectsMenu;
              closeAllMenus();
              if (next && effectsBtnRef.current) {
                const rect = effectsBtnRef.current.getBoundingClientRect();
                setEffectsPos({ top: rect.bottom + 4, left: rect.left });
              }
              setShowEffectsMenu(next);
            }}
            className={`editor-toolbar-btn h-8 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center justify-center ${
              activeElement?.effect && activeElement.effect !== "none"
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            Effects
          </button>
          {mounted &&
            showEffectsMenu &&
            createPortal(
              <div
                className="editor-portal-menu fixed w-36 bg-white rounded-xl shadow-2xl border border-gray-200 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100"
                style={{ top: `${effectsPos.top}px`, left: `${effectsPos.left}px` }}
              >
                <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Text Effects
                </div>
                {(["none", "shadow", "outline", "neon", "highlight"] as const).map(
                  (eff) => (
                    <button
                      key={eff}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        handleStyleChange("effect", eff);
                        setShowEffectsMenu(false);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs capitalize flex items-center justify-between hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer ${
                        (activeElement?.effect || "none") === eff
                          ? "font-bold text-indigo-600 bg-indigo-50/50"
                          : "text-gray-700"
                      }`}
                    >
                      <span>{eff}</span>
                      {(activeElement?.effect || "none") === eff && (
                        <Check size={13} className="text-indigo-600" />
                      )}
                    </button>
                  )
                )}
              </div>,
              document.body
            )}
        </div>

        {/* Animate Toggle */}
        <div className="relative">
          <button
            ref={animateBtnRef}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              const next = !showAnimateMenu;
              closeAllMenus();
              if (next && animateBtnRef.current) {
                const rect = animateBtnRef.current.getBoundingClientRect();
                setAnimatePos({ top: rect.bottom + 4, left: rect.left });
              }
              setShowAnimateMenu(next);
            }}
            className={`editor-toolbar-btn h-8 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center justify-center ${
              activeElement?.animation && activeElement.animation !== "none"
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            Animate
          </button>
          {mounted &&
            showAnimateMenu &&
            createPortal(
              <div
                className="editor-portal-menu fixed w-36 bg-white rounded-xl shadow-2xl border border-gray-200 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100"
                style={{ top: `${animatePos.top}px`, left: `${animatePos.left}px` }}
              >
                <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Animation
                </div>
                {(["none", "fade", "bounce", "pulse"] as const).map((anim) => (
                  <button
                    key={anim}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      handleStyleChange("animation", anim);
                      setShowAnimateMenu(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left text-xs capitalize flex items-center justify-between hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer ${
                      (activeElement?.animation || "none") === anim
                        ? "font-bold text-indigo-600 bg-indigo-50/50"
                        : "text-gray-700"
                    }`}
                  >
                    <span>{anim === "fade" ? "Fade In" : anim}</span>
                    {(activeElement?.animation || "none") === anim && (
                      <Check size={13} className="text-indigo-600" />
                    )}
                  </button>
                ))}
              </div>,
              document.body
            )}
        </div>

        {/* Position Toggle */}
        <div className="relative shrink-0">
          <button
            ref={positionBtnRef}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              const next = !showPositionMenu;
              closeAllMenus();
              if (next && positionBtnRef.current) {
                const rect = positionBtnRef.current.getBoundingClientRect();
                setPositionPos({ top: rect.bottom + 4, left: Math.max(10, rect.right - 176) });
              }
              setShowPositionMenu(next);
            }}
            className="editor-toolbar-btn h-8 px-3 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer transition-all shrink-0 whitespace-nowrap flex items-center justify-center"
          >
            Position
          </button>
          {mounted &&
            showPositionMenu &&
            createPortal(
              <div
                className="editor-portal-menu fixed w-44 bg-white rounded-xl shadow-2xl border border-gray-200 py-1.5 z-[9999] animate-in fade-in zoom-in-95 duration-100"
                style={{ top: `${positionPos.top}px`, left: `${positionPos.left}px` }}
              >
                <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Align & Layer
                </div>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    handlePosition("center");
                    setShowPositionMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs hover:bg-indigo-50 hover:text-indigo-600 text-gray-700 cursor-pointer flex items-center justify-between"
                >
                  <span>Center Horizontally</span>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    handlePosition("forward");
                    setShowPositionMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs hover:bg-indigo-50 hover:text-indigo-600 text-gray-700 cursor-pointer flex items-center justify-between"
                >
                  <span>Bring Forward</span>
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    handlePosition("backward");
                    setShowPositionMenu(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-xs hover:bg-indigo-50 hover:text-indigo-600 text-gray-700 cursor-pointer flex items-center justify-between"
                >
                  <span>Send Backward</span>
                </button>
              </div>,
              document.body
            )}
        </div>

        {/* Repeat across all pages toggle */}
        {activeElement && (
          <div className="flex items-center gap-1 border-l border-gray-200 pl-2 shrink-0">
            <button
              type="button"
              onClick={() => toggleRepeatAllPages(activeElement.id)}
              className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-md border transition-colors cursor-pointer shrink-0 ${
                activeElement.repeatAllPages
                  ? "bg-purple-100 text-purple-800 border-purple-400 shadow-inner"
                  : "bg-white hover:bg-gray-100 text-gray-700 border-gray-300"
              }`}
              title={
                activeElement.repeatAllPages
                  ? "Linked to all pages (Click to unlink)"
                  : "Link / Repeat this text on all pages"
              }
            >
              <Layers
                size={12}
                className={
                  activeElement.repeatAllPages ? "text-purple-700" : "text-gray-500"
                }
              />
              <span>{activeElement.repeatAllPages ? "All Pages" : "Link"}</span>
            </button>
          </div>
        )}

        {(selectedElementIds.length > 1 || (activeElement && activeElement.groupId)) && (
          <div className="flex items-center gap-1.5 border-l border-gray-200 pl-2 shrink-0">
            {selectedElementIds.length > 1 && (
              <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                {selectedElementIds.length} Selected
              </span>
            )}
            {/* Canva Group / Ungroup Button */}
            {activeElement?.groupId ? (
              <button
                type="button"
                onClick={handleUngroupElements}
                className="h-8 px-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs"
                title="Ungroup elements (Ctrl+Shift+G)"
              >
                <Ungroup size={13} className="text-indigo-600" />
                <span>Ungroup</span>
              </button>
            ) : selectedElementIds.length > 1 ? (
              <button
                type="button"
                onClick={handleGroupElements}
                className="h-8 px-2.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all shadow-2xs hover:shadow-xs"
                title="Group selected elements together (Ctrl+G)"
              >
                <Group size={13} className="text-gray-600" />
                <span>Group</span>
              </button>
            ) : null}
            {selectedElementIds.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={duplicateSelectedElements}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  title="Duplicate selected elements"
                >
                  <Copy size={14} />
                </button>
                <button
                  type="button"
                  onClick={deleteSelectedElements}
                  className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title="Delete selected elements (Delete key)"
                >
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        )}
        </div>
      </div>

      {/* Right Slider Arrow Button */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 z-40 flex items-center bg-gradient-to-l from-white via-white/95 to-transparent pl-4 pr-1">
          <button
            type="button"
            onClick={slideRight}
            className="w-6 h-7 bg-white hover:bg-gray-100 text-gray-700 hover:text-indigo-600 rounded-md border border-gray-200 shadow-xs flex items-center justify-center cursor-pointer transition-transform active:scale-95"
            title="Slide options right"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
