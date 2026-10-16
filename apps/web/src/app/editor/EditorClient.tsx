"use client";
import React, { useState, useRef, useEffect } from "react";
import { pdfjs } from "react-pdf";
import { PDFDocument } from "pdf-lib";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { CanvasTextElement, EditorPage, SidebarTabType } from "./components/types";
import TextPanel from "./components/TextPanel";
import ElementsPanel from "./components/ElementsPanel";
import TemplatesPanel from "./components/TemplatesPanel";
import {
  BrandPanel,
  UploadsPanel,
  DrawPanel,
  ProjectsPanel,
  AppsPanel,
  CreatePanel,
} from "./components/ToolPanels";
import { EditorToolbar } from "./components/EditorToolbar";
import { EditorHeader } from "./components/EditorHeader";
import { EditorSidebarNav } from "./components/EditorSidebarNav";
import { CanvasArea } from "./components/CanvasArea";
import { exportPdfDocument } from "./components/exportPdf";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function EditorClient() {
  const [file, setFile] = useState<File | null>(null);
  const [backgroundPdf, setBackgroundPdf] = useState<string | null>(null);
  const [pdfPageCount, setPdfPageCount] = useState<number | null>(null);
  const [pages, setPages] = useState<EditorPage[]>([]);
  const [pdfDimensions, setPdfDimensions] = useState({ width: 0, height: 0 });
  const [renderedDimensions, setRenderedDimensions] = useState({ width: 0, height: 0 });
  const [elements, setElements] = useState<CanvasTextElement[]>([]);
  const [activeElementId, setActiveElementId] = useState<string | null>(null);
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const [editingElementId, setEditingElementId] = useState<string | null>(null);
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [zoom, setZoom] = useState(1.0);
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTabType | null>("create");
  const [editorMobileNavOpen, setEditorMobileNavOpen] = useState(false);

  // Marquee rubber-band selection state
  const [marqueeState, setMarqueeState] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    pageIndex: number;
    canvasRect: DOMRect;
  } | null>(null);

  // Snap alignment guides
  const [snapGuides, setSnapGuides] = useState<{ x: number[]; y: number[] }>({ x: [], y: [] });

  // Page Border Rulers setting
  const [showPageBorderRulers, setShowPageBorderRulers] = useState(false);

  // Print safety margins
  const [showMargins, setShowMargins] = useState(false);

  // Alignment Grid & Dot Matrix states (Figma / Canva style)
  const [showGrid, setShowGrid] = useState(false);
  const [showDotMatrix, setShowDotMatrix] = useState(false);

  // Custom User Guide Lines
  const [customGuides, setCustomGuides] = useState<Array<{
    id: string;
    orientation: 'horizontal' | 'vertical';
    position: number;
    pageIndex?: number;
  }>>([]);

  // Dragging a new guide out from the top or left ruler
  const [rulerGuideDrag, setRulerGuideDrag] = useState<{
    orientation: 'horizontal' | 'vertical';
    currentPos: number;
    pageIndex: number;
    guideId?: string;
  } | null>(null);

  // Dragging state for freeform moving
  const [dragState, setDragState] = useState<{
    id: string;
    startX: number;
    startY: number;
    initialPositions: Record<string, { x: number; y: number }>;
  } | null>(null);

  // Resize state for corner handle scaling
  const [resizeState, setResizeState] = useState<{
    id: string;
    corner: 'tl' | 'tr' | 'bl' | 'br';
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    initialWidth: number;
    initialHeight: number;
    initialSize: number;
  } | null>(null);

  // Clipboard for Ctrl+C and Ctrl+V
  const [copiedElements, setCopiedElements] = useState<CanvasTextElement[]>([]);

  // Menu dropdown toggle states
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showEffectsMenu, setShowEffectsMenu] = useState(false);
  const [showAnimateMenu, setShowAnimateMenu] = useState(false);
  const [showPositionMenu, setShowPositionMenu] = useState(false);
  const [showSpacingMenu, setShowSpacingMenu] = useState(false);
  const [showTransparencyMenu, setShowTransparencyMenu] = useState(false);

  // Track original parsed spans deleted by the user
  const [deletedSpans, setDeletedSpans] = useState<{ page: number; bbox: [number, number, number, number] }[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  // Selection handlers
  function selectSingleElement(id: string | null) {
    setActiveElementId(id);
    if (!id) {
      setSelectedElementIds([]);
      return;
    }
    const targetEl = elements.find(el => el.id === id);
    if (targetEl?.groupId) {
      const groupElementIds = elements.filter(el => el.groupId === targetEl.groupId).map(el => el.id);
      setSelectedElementIds(groupElementIds.length > 0 ? groupElementIds : [id]);
    } else {
      setSelectedElementIds([id]);
    }
  }

  function toggleSelectElement(id: string) {
    const targetEl = elements.find(el => el.id === id);
    const idsToToggle = targetEl?.groupId
      ? elements.filter(el => el.groupId === targetEl.groupId).map(el => el.id)
      : [id];

    setSelectedElementIds(prev => {
      const allSelected = idsToToggle.every(item => prev.includes(item));
      const next = allSelected
        ? prev.filter(item => !idsToToggle.includes(item))
        : Array.from(new Set([...prev, ...idsToToggle]));
      setActiveElementId(next.length > 0 ? next[next.length - 1] : null);
      return next;
    });
  }

  function selectAllElementsOnPage(pageIdx?: number) {
    if (pageIdx !== undefined) {
      const pageEls = elements.filter(el => el.page === pageIdx || el.repeatAllPages).map(el => el.id);
      setSelectedElementIds(pageEls);
      setActiveElementId(pageEls[0] || null);
    } else {
      const allIds = elements.map(el => el.id);
      setSelectedElementIds(allIds);
      setActiveElementId(allIds[0] || null);
    }
  }

  function deselectAll() {
    setActiveElementId(null);
    setSelectedElementIds([]);
    setEditingElementId(null);
    setSnapGuides({ x: [], y: [] });
    setShowFontMenu(false);
    setShowEffectsMenu(false);
    setShowAnimateMenu(false);
    setShowPositionMenu(false);
    setShowSpacingMenu(false);
    setShowTransparencyMenu(false);
  }

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const activeTag = (document.activeElement?.tagName || "").toLowerCase();
      const isTyping = activeTag === "input" || activeTag === "textarea";

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
        if (!isTyping && elements.length > 0) {
          e.preventDefault();
          selectAllElementsOnPage();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
        if (!isTyping && selectedElementIds.length > 0) {
          e.preventDefault();
          const itemsToCopy = elements.filter(el => selectedElementIds.includes(el.id));
          setCopiedElements(itemsToCopy);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {
        if (!isTyping && copiedElements.length > 0) {
          e.preventDefault();
          const pastedIds: string[] = [];
          const pastedElements: CanvasTextElement[] = copiedElements.map((el, idx) => {
            const newId = `paste_${Date.now()}_${idx}`;
            pastedIds.push(newId);
            return {
              ...el,
              id: newId,
              x: el.x + 25,
              y: el.y + 25,
              groupId: undefined,
              originalBbox: undefined,
              isPdfParsed: false,
            };
          });
          setElements(prev => [...prev, ...pastedElements]);
          setSelectedElementIds(pastedIds);
          setActiveElementId(pastedIds[pastedIds.length - 1] || null);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
        if (!isTyping && selectedElementIds.length > 0) {
          e.preventDefault();
          duplicateSelectedElements();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "g") {
        if (!isTyping) {
          e.preventDefault();
          if (e.shiftKey) {
            ungroupSelectedElements();
          } else {
            groupSelectedElements();
          }
        }
      } else if (e.key === "Escape") {
        deselectAll();
      } else if ((e.key === "Delete" || e.key === "Backspace") && !isTyping) {
        if (selectedElementIds.length > 0) {
          e.preventDefault();
          deleteSelectedElements();
        }
      } else if (["arrowup", "arrowdown", "arrowleft", "arrowright"].includes(e.key.toLowerCase()) && !isTyping) {
        if (selectedElementIds.length > 0) {
          e.preventDefault();
          const step = e.shiftKey ? 10 : 1;
          const dx = e.key.toLowerCase() === "arrowleft" ? -step : e.key.toLowerCase() === "arrowright" ? step : 0;
          const dy = e.key.toLowerCase() === "arrowup" ? -step : e.key.toLowerCase() === "arrowdown" ? step : 0;
          setElements(prev =>
            prev.map(el =>
              selectedElementIds.includes(el.id) && !el.locked
                ? { ...el, x: Math.max(0, el.x + dx), y: Math.max(0, el.y + dy) }
                : el
            )
          );
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [elements, selectedElementIds, copiedElements]);

  // Responsive zoom
  useEffect(() => {
    function calculateBestFit() {
      if (typeof window === "undefined") return;
      const screenWidth = window.innerWidth;
      const targetPageWidth = renderedDimensions.width > 0 ? renderedDimensions.width : 595;
      
      if (screenWidth < 640) {
        const optimalZoom = Math.max(0.4, Math.min(0.9, +((screenWidth - 24) / targetPageWidth).toFixed(2)));
        setZoom(optimalZoom);
      } else if (screenWidth < 1024) {
        const optimalZoom = Math.max(0.6, Math.min(1.0, +((screenWidth - 120) / targetPageWidth).toFixed(2)));
        setZoom(optimalZoom);
      }
    }

    calculateBestFit();
    window.addEventListener("resize", calculateBestFit);
    return () => window.removeEventListener("resize", calculateBestFit);
  }, [renderedDimensions.width]);

  // Dragging event handlers with snapping
  useEffect(() => {
    const SNAP_THRESHOLD = 5;
    const pageW = renderedDimensions.width > 0 ? renderedDimensions.width : 595;
    const pageH = renderedDimensions.height > 0 ? renderedDimensions.height : 842;

    function computeSnap(movingIds: string[], currentElements: CanvasTextElement[], rawDx: number, rawDy: number) {
      const guides: { x: number[]; y: number[] } = { x: [], y: [] };
      let snapDx = rawDx;
      let snapDy = rawDy;

      const staticEdgesX: number[] = [0, pageW / 2, pageW];
      const staticEdgesY: number[] = [0, pageH / 2, pageH];

      if (showMargins) {
        staticEdgesX.push(36, pageW - 36);
        staticEdgesY.push(36, pageH - 36);
      }

      customGuides.forEach(cg => {
        if (cg.orientation === 'vertical') staticEdgesX.push(cg.position);
        if (cg.orientation === 'horizontal') staticEdgesY.push(cg.position);
      });

      currentElements.forEach(el => {
        if (movingIds.includes(el.id)) return;
        const w = el.width || Math.max(140, (el.text.length + 3) * (el.size * 0.65));
        const h = el.height || Math.max(28, el.size * 1.3);
        staticEdgesX.push(el.x, el.x + w / 2, el.x + w);
        staticEdgesY.push(el.y, el.y + h / 2, el.y + h);
      });

      const movingEdgesX: number[] = [];
      const movingEdgesY: number[] = [];
      currentElements.forEach(el => {
        const init = dragState?.initialPositions[el.id];
        if (!init || !movingIds.includes(el.id)) return;
        const w = el.width || Math.max(140, (el.text.length + 3) * (el.size * 0.65));
        const h = el.height || Math.max(28, el.size * 1.3);
        const px = init.x + rawDx;
        const py = init.y + rawDy;
        movingEdgesX.push(px, px + w / 2, px + w);
        movingEdgesY.push(py, py + h / 2, py + h);
      });

      let bestSnapX = Infinity;
      for (const me of movingEdgesX) {
        for (const se of staticEdgesX) {
          const diff = se - me;
          if (Math.abs(diff) < Math.abs(bestSnapX) && Math.abs(diff) < SNAP_THRESHOLD) {
            bestSnapX = diff;
          }
        }
      }
      if (Math.abs(bestSnapX) < SNAP_THRESHOLD) {
        snapDx = rawDx + bestSnapX;
        for (const me of movingEdgesX) {
          for (const se of staticEdgesX) {
            if (Math.abs(se - (me + bestSnapX)) < 1) guides.x.push(se);
          }
        }
      }

      let bestSnapY = Infinity;
      for (const me of movingEdgesY) {
        for (const se of staticEdgesY) {
          const diff = se - me;
          if (Math.abs(diff) < Math.abs(bestSnapY) && Math.abs(diff) < SNAP_THRESHOLD) {
            bestSnapY = diff;
          }
        }
      }
      if (Math.abs(bestSnapY) < SNAP_THRESHOLD) {
        snapDy = rawDy + bestSnapY;
        for (const me of movingEdgesY) {
          for (const se of staticEdgesY) {
            if (Math.abs(se - (me + bestSnapY)) < 1) guides.y.push(se);
          }
        }
      }

      setSnapGuides({ x: [...new Set(guides.x)], y: [...new Set(guides.y)] });
      return { snapDx, snapDy };
    }

    function handleMouseMove(e: MouseEvent) {
      if (!dragState) return;
      const rawDx = (e.clientX - dragState.startX) / zoom;
      const rawDy = (e.clientY - dragState.startY) / zoom;
      const movingIds = Object.keys(dragState.initialPositions);

      setElements(prev => {
        const { snapDx, snapDy } = computeSnap(movingIds, prev, rawDx, rawDy);
        return prev.map(el => {
          const initPos = dragState.initialPositions[el.id];
          if (initPos) {
            return {
              ...el,
              x: Math.max(0, initPos.x + snapDx),
              y: Math.max(0, initPos.y + snapDy),
            };
          }
          return el;
        });
      });
    }

    function handleEnd() {
      if (dragState) {
        setDragState(null);
        setSnapGuides({ x: [], y: [] });
      }
    }

    if (dragState) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleEnd);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleEnd);
      };
    }
  }, [dragState, zoom, renderedDimensions, showMargins, customGuides]);

  // Corner resize handling
  useEffect(() => {
    function handleResizeMove(e: MouseEvent) {
      if (!resizeState) return;
      const dx = (e.clientX - resizeState.startX) / zoom;
      const dy = (e.clientY - resizeState.startY) / zoom;

      setElements(prev =>
        prev.map(el => {
          if (el.id !== resizeState.id) return el;

          let newWidth = resizeState.initialWidth;
          let newHeight = resizeState.initialHeight;
          let newX = resizeState.initialX;
          let newY = resizeState.initialY;
          let newSize = resizeState.initialSize;

          if (resizeState.corner === 'br') {
            newWidth = Math.max(30, resizeState.initialWidth + dx);
            newHeight = Math.max(20, resizeState.initialHeight + dy);
          } else if (resizeState.corner === 'bl') {
            const proposedW = Math.max(30, resizeState.initialWidth - dx);
            newX = resizeState.initialX + (resizeState.initialWidth - proposedW);
            newWidth = proposedW;
            newHeight = Math.max(20, resizeState.initialHeight + dy);
          } else if (resizeState.corner === 'tr') {
            newWidth = Math.max(30, resizeState.initialWidth + dx);
            const proposedH = Math.max(20, resizeState.initialHeight - dy);
            newY = resizeState.initialY + (resizeState.initialHeight - proposedH);
            newHeight = proposedH;
          } else if (resizeState.corner === 'tl') {
            const proposedW = Math.max(30, resizeState.initialWidth - dx);
            const proposedH = Math.max(20, resizeState.initialHeight - dy);
            newX = resizeState.initialX + (resizeState.initialWidth - proposedW);
            newY = resizeState.initialY + (resizeState.initialHeight - proposedH);
            newWidth = proposedW;
            newHeight = proposedH;
          }

          if (!el.isShape && !el.imageUrl) {
            const ratio = newWidth / Math.max(30, resizeState.initialWidth);
            newSize = Math.max(8, Math.min(160, Math.round(resizeState.initialSize * ratio)));
          }

          return {
            ...el,
            x: Math.max(0, Math.round(newX)),
            y: Math.max(0, Math.round(newY)),
            width: Math.round(newWidth),
            height: Math.round(newHeight),
            size: newSize,
          };
        })
      );
    }

    function handleResizeEnd() {
      if (resizeState) setResizeState(null);
    }

    if (resizeState) {
      window.addEventListener("mousemove", handleResizeMove);
      window.addEventListener("mouseup", handleResizeEnd);
      return () => {
        window.removeEventListener("mousemove", handleResizeMove);
        window.removeEventListener("mouseup", handleResizeEnd);
      };
    }
  }, [resizeState, zoom]);

  // Marquee rubber-band selection
  useEffect(() => {
    function handleMarqueeMove(e: MouseEvent) {
      if (!marqueeState) return;
      setMarqueeState(prev => prev ? {
        ...prev,
        currentX: (e.clientX - prev.canvasRect.left) / zoom,
        currentY: (e.clientY - prev.canvasRect.top) / zoom,
      } : null);
    }

    function handleMarqueeEnd() {
      if (!marqueeState) return;
      const x1 = Math.min(marqueeState.startX, marqueeState.currentX);
      const y1 = Math.min(marqueeState.startY, marqueeState.currentY);
      const x2 = Math.max(marqueeState.startX, marqueeState.currentX);
      const y2 = Math.max(marqueeState.startY, marqueeState.currentY);

      if (Math.abs(x2 - x1) > 5 || Math.abs(y2 - y1) > 5) {
        const pageIdx = marqueeState.pageIndex;
        const pageEls = elements.filter(el => el.page === pageIdx || el.repeatAllPages);
        const hitIds: string[] = [];

        pageEls.forEach(el => {
          const elW = el.width || Math.max(140, (el.text.length + 3) * (el.size * 0.65));
          const elH = el.height || Math.max(28, el.size * 1.3);
          if (el.x < x2 && el.x + elW > x1 && el.y < y2 && el.y + elH > y1) {
            hitIds.push(el.id);
          }
        });

        if (hitIds.length > 0) {
          setSelectedElementIds(hitIds);
          setActiveElementId(hitIds[0]);
        }
      }

      setMarqueeState(null);
    }

    if (marqueeState) {
      window.addEventListener("mousemove", handleMarqueeMove);
      window.addEventListener("mouseup", handleMarqueeEnd);
      return () => {
        window.removeEventListener("mousemove", handleMarqueeMove);
        window.removeEventListener("mouseup", handleMarqueeEnd);
      };
    }
  }, [marqueeState, elements, zoom]);

  // Dragging guides from rulers
  useEffect(() => {
    function handleRulerGuideMove(e: MouseEvent) {
      if (!rulerGuideDrag) return;
      const pageContainer = document.querySelector(`[data-page-index="${rulerGuideDrag.pageIndex}"]`);
      if (!pageContainer) return;
      const rect = pageContainer.getBoundingClientRect();
      const pos = rulerGuideDrag.orientation === 'horizontal'
        ? Math.round((e.clientY - rect.top) / zoom)
        : Math.round((e.clientX - rect.left) / zoom);

      setRulerGuideDrag(prev => prev ? { ...prev, currentPos: pos } : null);
    }

    function handleRulerGuideEnd() {
      if (!rulerGuideDrag) return;
      const pos = rulerGuideDrag.currentPos;
      const pw = renderedDimensions.width > 0 ? renderedDimensions.width : 595;
      const ph = renderedDimensions.height > 0 ? renderedDimensions.height : 842;
      const maxLimit = rulerGuideDrag.orientation === 'horizontal' ? ph : pw;

      if (pos >= 0 && pos <= maxLimit) {
        if (rulerGuideDrag.guideId) {
          setCustomGuides(prev =>
            prev.map(g => (g.id === rulerGuideDrag.guideId ? { ...g, position: pos } : g))
          );
        } else {
          const newGuide = {
            id: `guide_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            orientation: rulerGuideDrag.orientation,
            position: pos,
            pageIndex: rulerGuideDrag.pageIndex,
          };
          setCustomGuides(prev => [...prev, newGuide]);
        }
      } else if (rulerGuideDrag.guideId) {
        setCustomGuides(prev => prev.filter(g => g.id !== rulerGuideDrag.guideId));
      }

      setRulerGuideDrag(null);
    }

    if (rulerGuideDrag) {
      window.addEventListener("mousemove", handleRulerGuideMove);
      window.addEventListener("mouseup", handleRulerGuideEnd);
      return () => {
        window.removeEventListener("mousemove", handleRulerGuideMove);
        window.removeEventListener("mouseup", handleRulerGuideEnd);
      };
    }
  }, [rulerGuideDrag, zoom, renderedDimensions]);

  const onDocumentLoadSuccess = React.useCallback(({ numPages }: { numPages: number }) => {
    setPdfPageCount(numPages);
    setPages(prev => {
      if (prev.length === 0) {
        return Array.from({ length: numPages }, (_, i) => ({
          id: `orig_page_${i}`,
          type: "original" as const,
          originalPageIndex: i,
        }));
      }
      return prev;
    });
  }, []);

  function addTextElement(
    type: "heading" | "subheading" | "body" | "header" | "footer",
    targetPage = 0,
    customProps?: Partial<CanvasTextElement>
  ) {
    const newId = `text_${Date.now()}`;
    const pageWidth = renderedDimensions.width > 0 ? renderedDimensions.width : 595;
    const pageHeight = renderedDimensions.height > 0 ? renderedDimensions.height : 842;
    const contentWidth = Math.min(480, pageWidth - 80);
    const centerX = Math.max(20, Math.round((pageWidth - contentWidth) / 2));

    let newEl: CanvasTextElement;
    if (type === "header") {
      newEl = {
        id: newId,
        text: "Document Header Title",
        x: 40,
        y: 35,
        width: pageWidth - 80,
        size: 13,
        font: "Helvetica",
        color: "#6b7280",
        bold: true,
        page: targetPage,
        isHeader: true,
        repeatAllPages: true,
      };
    } else if (type === "footer") {
      newEl = {
        id: newId,
        text: "Document Footer • Confidential",
        x: 40,
        y: Math.max(700, pageHeight - 45),
        width: pageWidth - 80,
        size: 12,
        font: "Helvetica",
        color: "#9ca3af",
        bold: false,
        page: targetPage,
        isFooter: true,
        repeatAllPages: true,
      };
    } else if (type === "heading") {
      newEl = {
        id: newId,
        text: "Add a heading",
        x: centerX,
        y: 120 + (elements.filter(e => e.page === targetPage).length * 35),
        width: contentWidth,
        size: 32,
        font: "Helvetica",
        color: "#111827",
        bold: true,
        align: "center",
        page: targetPage,
      };
    } else if (type === "subheading") {
      newEl = {
        id: newId,
        text: "Add a subheading",
        x: centerX,
        y: 160 + (elements.filter(e => e.page === targetPage).length * 35),
        width: contentWidth,
        size: 22,
        font: "Helvetica",
        color: "#374151",
        bold: false,
        align: "center",
        page: targetPage,
      };
    } else {
      newEl = {
        id: newId,
        text: "Add a little bit of body text",
        x: centerX,
        y: 200 + (elements.filter(e => e.page === targetPage).length * 35),
        width: contentWidth,
        size: 15,
        font: "Helvetica",
        color: "#4b5563",
        bold: false,
        align: "center",
        page: targetPage,
      };
    }

    if (customProps) {
      newEl = { ...newEl, ...customProps };
    }

    setElements(prev => [...prev, newEl]);
    selectSingleElement(newId);
  }

  function handleTextChange(id: string, newText: string) {
    setElements(prev => prev.map(el => (el.id === id ? { ...el, text: newText } : el)));
  }

  function handleStyleChange(
    key: "size" | "color" | "bold" | "italic" | "underline" | "strikethrough" | "align" | "font" | "effect" | "animation" | "uppercase" | "letterSpacing" | "opacity",
    value: any
  ) {
    if (!activeElementId) return;
    setElements(prev => prev.map(el => (el.id === activeElementId ? { ...el, [key]: value } : el)));
  }

  function handleListToggle() {
    if (!activeElementId) return;
    const el = elements.find(item => item.id === activeElementId);
    if (!el) return;

    const lines = el.text.split("\n");
    const firstLine = lines[0] || "";

    let currentFormat: "bullet" | "number" | "alphaUpper" | "alphaLower" | "none" = "none";
    if (/^•\s/.test(firstLine)) {
      currentFormat = "bullet";
    } else if (/^\d+[\.\)]\s/.test(firstLine)) {
      currentFormat = "number";
    } else if (/^[A-Z][\.\)]\s/.test(firstLine)) {
      currentFormat = "alphaUpper";
    } else if (/^[a-z][\.\)]\s/.test(firstLine)) {
      currentFormat = "alphaLower";
    }

    const stripPrefix = (str: string) => str.replace(/^([•\-\*]|\d+[\.\)]|[a-zA-Z][\.\)])\s*/, "");

    let newLines: string[] = [];
    if (currentFormat === "none") {
      newLines = lines.map(line => `• ${stripPrefix(line)}`);
    } else if (currentFormat === "bullet") {
      newLines = lines.map((line, idx) => `${idx + 1}. ${stripPrefix(line)}`);
    } else if (currentFormat === "number") {
      newLines = lines.map((line, idx) => {
        const letter = String.fromCharCode(65 + (idx % 26));
        return `${letter}. ${stripPrefix(line)}`;
      });
    } else if (currentFormat === "alphaUpper") {
      newLines = lines.map((line, idx) => {
        const letter = String.fromCharCode(97 + (idx % 26));
        return `${letter}. ${stripPrefix(line)}`;
      });
    } else {
      newLines = lines.map(line => stripPrefix(line));
    }

    handleTextChange(activeElementId, newLines.join("\n"));
  }

  function handlePosition(action: "forward" | "backward" | "center") {
    if (!activeElementId) return;
    if (action === "center") {
      setElements(prev =>
        prev.map(el => {
          if (el.id === activeElementId && renderedDimensions.width > 0) {
            return { ...el, x: (renderedDimensions.width / 2) - 100 };
          }
          return el;
        })
      );
    } else if (action === "forward") {
      setElements(prev => {
        const item = prev.find(el => el.id === activeElementId);
        if (!item) return prev;
        return [...prev.filter(el => el.id !== activeElementId), item];
      });
    } else if (action === "backward") {
      setElements(prev => {
        const item = prev.find(el => el.id === activeElementId);
        if (!item) return prev;
        return [item, ...prev.filter(el => el.id !== activeElementId)];
      });
    }
    setShowPositionMenu(false);
  }

  function duplicateElement(id: string) {
    const el = elements.find(item => item.id === id);
    if (!el) return;
    const newId = `text_${Date.now()}`;
    const newEl: CanvasTextElement = {
      ...el,
      id: newId,
      x: el.x + 20,
      y: el.y + 20,
      originalBbox: undefined,
      isPdfParsed: false,
    };
    setElements(prev => [...prev, newEl]);
    selectSingleElement(newId);
  }

  function duplicateSelectedElements() {
    if (selectedElementIds.length === 0) return;
    const newAdded: CanvasTextElement[] = [];
    const newIds: string[] = [];
    selectedElementIds.forEach((id, idx) => {
      const el = elements.find(item => item.id === id);
      if (el) {
        const newId = `text_${Date.now()}_${idx}`;
        newIds.push(newId);
        newAdded.push({
          ...el,
          id: newId,
          x: el.x + 20,
          y: el.y + 20,
          originalBbox: undefined,
          isPdfParsed: false,
        });
      }
    });
    setElements(prev => [...prev, ...newAdded]);
    setSelectedElementIds(newIds);
    setActiveElementId(newIds[newIds.length - 1] || null);
  }

  function toggleLockElements(ids?: string[]) {
    const targetIds = ids || (selectedElementIds.length > 0 ? selectedElementIds : activeElementId ? [activeElementId] : []);
    if (targetIds.length === 0) return;
    setElements(prev =>
      prev.map(el => {
        if (targetIds.includes(el.id)) {
          return { ...el, locked: !el.locked };
        }
        return el;
      })
    );
  }

  function groupSelectedElements() {
    if (selectedElementIds.length < 2) return;
    const newGroupId = `group_${Date.now()}`;
    setElements(prev =>
      prev.map(el => {
        if (selectedElementIds.includes(el.id)) {
          return { ...el, groupId: newGroupId };
        }
        return el;
      })
    );
  }

  function ungroupSelectedElements() {
    if (selectedElementIds.length === 0) return;
    const targetGroupIds = new Set(
      elements
        .filter(el => selectedElementIds.includes(el.id) && el.groupId)
        .map(el => el.groupId)
    );
    if (targetGroupIds.size === 0) return;

    setElements(prev =>
      prev.map(el => {
        if (el.groupId && targetGroupIds.has(el.groupId)) {
          return { ...el, groupId: undefined };
        }
        return el;
      })
    );
  }

  function addShapeElement(
    shapeType: 'rect' | 'circle' | 'line' | 'arrow' | 'star' | 'badge' | 'pageBorder' | 'footerLine' | 'headerLine' | 'roundedRect' | 'triangle' | 'callout',
    targetPage = 0,
    repeatAll = false
  ) {
    const newId = `shape_${Date.now()}`;
    const pageWidth = renderedDimensions.width > 0 ? renderedDimensions.width : 595;
    const pageHeight = renderedDimensions.height > 0 ? renderedDimensions.height : 842;
    const defaultX = pageWidth / 2 - 80;
    const defaultY = 160 + (elements.filter(e => e.page === targetPage).length * 40);

    let newShape: CanvasTextElement;

    if (shapeType === 'pageBorder') {
      newShape = {
        id: newId,
        text: '',
        x: 20,
        y: 20,
        size: 14,
        font: "Helvetica",
        color: "#1e293b",
        page: targetPage,
        repeatAllPages: repeatAll,
        isShape: true,
        shapeType: 'pageBorder',
        bgColor: 'transparent',
        borderColor: '#1e293b',
        borderWidth: 2,
        borderStyle: 'solid',
        width: Math.max(200, pageWidth - 40),
        height: Math.max(200, pageHeight - 40),
      };
    } else if (shapeType === 'footerLine') {
      newShape = {
        id: newId,
        text: '',
        x: 35,
        y: Math.max(650, pageHeight - 65),
        size: 12,
        font: "Helvetica",
        color: "#94a3b8",
        page: targetPage,
        repeatAllPages: repeatAll,
        isShape: true,
        shapeType: 'footerLine',
        bgColor: 'transparent',
        borderColor: '#94a3b8',
        borderWidth: 1.5,
        borderStyle: 'solid',
        width: Math.max(200, pageWidth - 70),
        height: 2,
      };
    } else if (shapeType === 'headerLine') {
      newShape = {
        id: newId,
        text: '',
        x: 35,
        y: 55,
        size: 12,
        font: "Helvetica",
        color: "#94a3b8",
        page: targetPage,
        repeatAllPages: repeatAll,
        isShape: true,
        shapeType: 'headerLine',
        bgColor: 'transparent',
        borderColor: '#94a3b8',
        borderWidth: 1.5,
        borderStyle: 'solid',
        width: Math.max(200, pageWidth - 70),
        height: 2,
      };
    } else if (shapeType === 'line') {
      newShape = {
        id: newId,
        text: '',
        x: defaultX - 40,
        y: defaultY,
        size: 14,
        font: "Helvetica",
        color: "#334155",
        page: targetPage,
        repeatAllPages: repeatAll,
        isShape: true,
        shapeType: 'line',
        bgColor: 'transparent',
        borderColor: '#334155',
        borderWidth: 2,
        borderStyle: 'solid',
        width: 240,
        height: 2,
      };
    } else if (shapeType === 'roundedRect') {
      newShape = {
        id: newId,
        text: '',
        x: defaultX,
        y: defaultY,
        size: 14,
        font: "Helvetica",
        color: "#4f46e5",
        page: targetPage,
        repeatAllPages: repeatAll,
        isShape: true,
        shapeType: 'roundedRect',
        bgColor: 'rgba(79, 70, 229, 0.08)',
        borderColor: '#4f46e5',
        borderWidth: 2,
        borderStyle: 'solid',
        width: 160,
        height: 90,
      };
    } else if (shapeType === 'callout') {
      newShape = {
        id: newId,
        text: 'Important note or callout text goes here...',
        x: defaultX - 30,
        y: defaultY,
        size: 13,
        font: "Helvetica",
        color: "#1e293b",
        page: targetPage,
        repeatAllPages: repeatAll,
        isShape: true,
        shapeType: 'callout',
        bgColor: 'rgba(238, 242, 255, 0.9)',
        borderColor: '#6366f1',
        borderWidth: 2,
        borderStyle: 'solid',
        width: 220,
        height: 65,
      };
    } else {
      newShape = {
        id: newId,
        text: shapeType === 'arrow' ? '───►' : shapeType === 'star' ? '★' : shapeType === 'triangle' ? '▲' : '',
        x: defaultX,
        y: defaultY,
        size: shapeType === 'star' ? 36 : shapeType === 'triangle' ? 30 : 14,
        font: "Helvetica",
        color: "#4f46e5",
        page: targetPage,
        repeatAllPages: repeatAll,
        isShape: true,
        shapeType,
        bgColor: shapeType === 'rect' || shapeType === 'circle' ? 'rgba(79, 70, 229, 0.12)' : 'transparent',
        borderColor: '#4f46e5',
        borderWidth: 2,
        borderStyle: 'solid',
        width: shapeType === 'arrow' ? 140 : shapeType === 'circle' ? 100 : shapeType === 'triangle' ? 60 : 130,
        height: shapeType === 'arrow' ? 24 : shapeType === 'circle' ? 100 : shapeType === 'triangle' ? 60 : 80,
      };
    }

    setElements(prev => [...prev, newShape]);
    selectSingleElement(newId);
  }

  function deleteElement(id: string) {
    const el = elements.find(item => item.id === id);
    if (el?.locked) return;
    if (el?.originalBbox) {
      setDeletedSpans(prev => [...prev, { page: el.page ?? 0, bbox: el.originalBbox! }]);
    }
    setElements(prev => prev.filter(item => item.id !== id));
    setSelectedElementIds(prev => prev.filter(item => item !== id));
    if (activeElementId === id) setActiveElementId(null);
  }

  function deleteSelectedElements() {
    if (selectedElementIds.length === 0) return;
    const toDelete = elements.filter(el => selectedElementIds.includes(el.id) && !el.locked);
    const newDeletedSpans: { page: number; bbox: [number, number, number, number] }[] = [];
    toDelete.forEach(el => {
      if (el.originalBbox) {
        newDeletedSpans.push({ page: el.page ?? 0, bbox: el.originalBbox });
      }
    });
    if (newDeletedSpans.length > 0) {
      setDeletedSpans(prev => [...prev, ...newDeletedSpans]);
    }

    setElements(prev => prev.filter(el => !selectedElementIds.includes(el.id) || el.locked));
    setSelectedElementIds(prev => prev.filter(id => {
      const el = elements.find(item => item.id === id);
      return el?.locked;
    }));
  }

  async function startBlankDocument() {
    setIsProcessing(true);
    const standardWidth = 595;
    const standardHeight = 842;
    setPdfDimensions({ width: standardWidth, height: standardHeight });
    setRenderedDimensions({ width: standardWidth, height: standardHeight });
    setPdfPageCount(1);
    
    try {
      const blankDoc = await PDFDocument.create();
      blankDoc.addPage([standardWidth, standardHeight]);
      const pdfBytes = await blankDoc.save();
      const blankBlob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
      const blankFile = new File([blankBlob], "Untitled Document.pdf", { type: "application/pdf" });
      setFile(blankFile);
      
      const newPageId = `blank_page_${Date.now()}`;
      setPages([{ id: newPageId, type: "blank" }]);
      
      const titleWidth = Math.min(480, standardWidth - 80);
      const newId = `text_${Date.now()}`;
      setElements([
        {
          id: newId,
          text: "Double-click to edit your title",
          x: Math.round((standardWidth - titleWidth) / 2),
          y: 120,
          width: titleWidth,
          size: 26,
          font: "Helvetica",
          color: "#0f172a",
          bold: true,
          align: "center",
          page: 0,
        }
      ]);
      selectSingleElement(newId);
    } catch (e) {
      console.error("Failed to initialize blank document:", e);
    } finally {
      setIsProcessing(false);
    }
  }

  function addNewPage() {
    setPages(prev => {
      const newPageIdx = prev.length;
      const newPageId = `blank_page_${Date.now()}`;
      const nextPages: EditorPage[] = [
        ...prev,
        { id: newPageId, type: "blank" }
      ];

      const newId = `text_${Date.now()}`;
      const pageWidth = renderedDimensions.width > 0 ? renderedDimensions.width : 595;
      const contentWidth = Math.min(480, pageWidth - 80);
      const defaultX = Math.max(20, Math.round((pageWidth - contentWidth) / 2));
      setElements(existing => [
        ...existing,
        {
          id: newId,
          text: `Heading on page ${newPageIdx + 1}`,
          x: defaultX,
          y: 120,
          width: contentWidth,
          size: 28,
          font: "Helvetica",
          color: "#111827",
          bold: true,
          align: "center",
          page: newPageIdx,
        }
      ]);
      selectSingleElement(newId);

      return nextPages;
    });
  }

  function insertPageAt(afterIndex: number) {
    const insertPosition = afterIndex + 1;
    const newPageId = `blank_page_${Date.now()}`;

    setElements(prev =>
      prev.map(el => {
        if (!el.repeatAllPages && el.page >= insertPosition) {
          return { ...el, page: el.page + 1 };
        }
        return el;
      })
    );

    setPages(prev => {
      const updated = [...prev];
      updated.splice(insertPosition, 0, { id: newPageId, type: "blank" });
      return updated;
    });

    const newId = `text_${Date.now()}`;
    const defaultX = renderedDimensions.width > 0 ? renderedDimensions.width / 2 - 100 : 150;
    setElements(existing => [
      ...existing,
      {
        id: newId,
        text: `Page ${insertPosition + 1}`,
        x: defaultX,
        y: 120,
        size: 28,
        font: "Helvetica",
        color: "#111827",
        bold: true,
        page: insertPosition,
      }
    ]);
    selectSingleElement(newId);
  }

  function duplicatePageAt(pageIndex: number) {
    const insertPosition = pageIndex + 1;
    const targetPage = pages[pageIndex];
    const newPageId = `page_dup_${Date.now()}`;

    // 1. Shift elements on subsequent pages
    setElements(prev => {
      const pageElementsToClone = prev
        .filter(el => el.page === pageIndex && !el.repeatAllPages)
        .map((el, i) => ({
          ...el,
          id: `elem_${Date.now()}_${i}`,
          page: insertPosition,
        }));

      const shifted = prev.map(el => {
        if (!el.repeatAllPages && el.page >= insertPosition) {
          return { ...el, page: el.page + 1 };
        }
        return el;
      });

      return [...shifted, ...pageElementsToClone];
    });

    // 2. Insert page duplicate
    setPages(prev => {
      const updated = [...prev];
      updated.splice(insertPosition, 0, {
        id: newPageId,
        type: targetPage?.type || "blank",
        originalPageIndex: targetPage?.originalPageIndex,
        bgColor: targetPage?.bgColor,
      });
      return updated;
    });
  }

  function movePageAt(pageIndex: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? pageIndex - 1 : pageIndex + 1;
    if (targetIndex < 0 || targetIndex >= pages.length) return;

    // Swap pages in pages array
    setPages(prev => {
      const updated = [...prev];
      const temp = updated[pageIndex];
      updated[pageIndex] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });

    // Swap elements page indices
    setElements(prev =>
      prev.map(el => {
        if (el.repeatAllPages) return el;
        if (el.page === pageIndex) return { ...el, page: targetIndex };
        if (el.page === targetIndex) return { ...el, page: pageIndex };
        return el;
      })
    );
  }

  function changePageBgAt(pageIndex: number, color: string) {
    setPages(prev =>
      prev.map((p, idx) => (idx === pageIndex ? { ...p, bgColor: color } : p))
    );
  }

  function deletePageAt(pageIndex: number) {
    if (pages.length <= 1) {
      alert("A document must contain at least one page.");
      return;
    }

    setElements(prev =>
      prev
        .filter(el => el.repeatAllPages || el.page !== pageIndex)
        .map(el => {
          if (!el.repeatAllPages && el.page > pageIndex) {
            return { ...el, page: el.page - 1 };
          }
          return el;
        })
    );

    setPages(prev => prev.filter((_, idx) => idx !== pageIndex));
    deselectAll();
  }

  function toggleRepeatAllPages(id: string) {
    setElements(prev =>
      prev.map(el => (el.id === id ? { ...el, repeatAllPages: !el.repeatAllPages } : el))
    );
  }

  async function handleFileUpload(selectedFile: File) {
    setFile(selectedFile);
    setBackgroundPdf(null);
    setPdfPageCount(null);
    setPages([]);
    setDeletedSpans([]);
    setIsProcessing(true);
    setActiveElementId(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const pythonApi = process.env.NEXT_PUBLIC_PYTHON_API_URL || (typeof window !== "undefined" ? `${window.location.protocol}//${window.location.hostname}:8000` : "http://localhost:8000");
      const res = await fetch(`${pythonApi}/api/parse-pdf`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        const parsedElements: CanvasTextElement[] = [];

        if (Array.isArray(data.pages)) {
          const initialPages: EditorPage[] = data.pages.map((_: any, idx: number) => ({
            id: `orig_page_${idx}`,
            type: "original" as const,
            originalPageIndex: idx,
          }));
          setPages(initialPages);
          setPdfPageCount(data.pages.length);

          data.pages.forEach((pageData: any, pageIdx: number) => {
            if (Array.isArray(pageData.spans)) {
              pageData.spans.forEach((span: any) => {
                const bbox = span.bbox || [50, 50, 200, 70];
                parsedElements.push({
                  id: `pdf_text_${pageIdx}_${span.id}`,
                  text: span.text,
                  x: bbox[0],
                  y: bbox[1],
                  size: Math.round(span.size || 14),
                  font: span.font || "Helvetica",
                  color: span.color || "#000000",
                  page: pageIdx,
                  bold: (span.flags & 2) !== 0 || (span.font && span.font.toLowerCase().includes("bold")),
                  italic: (span.flags & 1) !== 0 || (span.font && span.font.toLowerCase().includes("italic")),
                  originalBbox: bbox,
                  originalText: span.text,
                  isPdfParsed: true,
                });
              });
            }
          });
        }

        if (data.background_pdf) {
          setBackgroundPdf(data.background_pdf);
        }

        if (parsedElements.length > 0) {
          setElements(parsedElements);
          setIsProcessing(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Backend parse-pdf unavailable, falling back to default starter element:", err);
    }

    const newId = `text_${Date.now()}`;
    setElements([
      {
        id: newId,
        text: "Type your text here",
        x: 100,
        y: 100,
        size: 24,
        font: "Helvetica",
        color: "#111827",
        bold: true,
        page: 0,
      }
    ]);
    selectSingleElement(newId);
    setIsProcessing(false);
  }

  async function savePdf() {
    if (!file) return;
    setIsProcessing(true);
    try {
      await exportPdfDocument({
        file,
        pages,
        elements,
        pdfPageCount,
        renderedDimensions,
        deletedSpans,
        backgroundPdf,
      });
    } catch (e) {
      alert("Failed to save PDF. Please check your document.");
    } finally {
      setIsProcessing(false);
    }
  }

  const activeElement = elements.find(el => el.id === activeElementId);

  return (
    <div className="fixed inset-0 flex flex-col bg-[#f3f4f6] font-sans overflow-hidden">
      {/* Company Main Header & Mobile Nav */}
      <EditorHeader
        file={file}
        isProcessing={isProcessing}
        onSavePdf={savePdf}
        mobileNavOpen={editorMobileNavOpen}
        setMobileNavOpen={setEditorMobileNavOpen}
      />

      {/* Editor Body */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* Backdrop for Mobile Overlay when any tool tab is open */}
        {activeSidebarTab && (
          <div
            className="sm:hidden fixed inset-0 bg-black/40 backdrop-blur-2xs z-40 transition-opacity"
            onClick={() => setActiveSidebarTab(null)}
          />
        )}

        {/* Sidebar Navigation */}
        <EditorSidebarNav
          activeSidebarTab={activeSidebarTab}
          setActiveSidebarTab={setActiveSidebarTab}
        />

        {/* Canva Create Side Panel */}
        {activeSidebarTab === 'create' && (
          <CreatePanel
            onClose={() => setActiveSidebarTab(null)}
            startBlankDocument={startBlankDocument}
            addTextElement={addTextElement}
            setElements={setElements}
            selectSingleElement={selectSingleElement}
            addNewPage={addNewPage}
            openTemplatesTab={() => setActiveSidebarTab('templates')}
          />
        )}

        {/* Canva Text Side Panel */}
        {activeSidebarTab === 'text' && (
          <TextPanel
            onClose={() => setActiveSidebarTab(null as any)}
            addTextElement={addTextElement}
            elements={elements}
            activeElementId={activeElementId}
            setActiveElementId={setActiveElementId}
            toggleLockElements={toggleLockElements}
            deleteElement={deleteElement}
          />
        )}

        {/* Canva Elements Side Panel */}
        {activeSidebarTab === 'elements' && (
          <ElementsPanel
            onClose={() => setActiveSidebarTab(null as any)}
            addTextElement={addTextElement}
            setActiveSidebarTab={setActiveSidebarTab}
            addShapeElement={addShapeElement}
            setElements={setElements}
            selectSingleElement={selectSingleElement}
          />
        )}

        {/* Canva Templates Side Panel */}
        {activeSidebarTab === 'templates' && (
          <TemplatesPanel
            onClose={() => setActiveSidebarTab(null as any)}
            renderedDimensions={renderedDimensions}
            setElements={setElements}
          />
        )}

        {/* Canva Brand Side Panel */}
        {activeSidebarTab === 'brand' && (
          <BrandPanel
            onClose={() => setActiveSidebarTab(null as any)}
            activeElementId={activeElementId}
            handleStyleChange={handleStyleChange}
          />
        )}

        {/* Canva Uploads Side Panel */}
        {activeSidebarTab === 'uploads' && (
          <UploadsPanel
            onClose={() => setActiveSidebarTab(null as any)}
            setElements={setElements}
            selectSingleElement={selectSingleElement}
          />
        )}

        {/* Canva Draw / Redaction Side Panel */}
        {activeSidebarTab === 'draw' && (
          <DrawPanel
            onClose={() => setActiveSidebarTab(null as any)}
            elements={elements}
            setElements={setElements}
            selectSingleElement={selectSingleElement}
          />
        )}

        {/* Canva Projects Side Panel */}
        {activeSidebarTab === 'projects' && (
          <ProjectsPanel
            onClose={() => setActiveSidebarTab(null as any)}
            file={file}
            pagesCount={pages.length}
            elementsCount={elements.length}
            onSavePdf={savePdf}
            elements={elements}
            setElements={setElements}
          />
        )}

        {/* Canva Settings / Apps Side Panel */}
        {activeSidebarTab === 'apps' && (
          <AppsPanel
            onClose={() => setActiveSidebarTab(null as any)}
            renderedDimensions={renderedDimensions}
            setElements={setElements}
            selectSingleElement={selectSingleElement}
            showPageBorderRulers={showPageBorderRulers}
            setShowPageBorderRulers={setShowPageBorderRulers}
            showMargins={showMargins}
            setShowMargins={setShowMargins}
            customGuides={customGuides}
            setCustomGuides={setCustomGuides}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden min-h-0">
          {/* Top Full-Width Toolbar */}
          {file && (
            <EditorToolbar
              activeElement={activeElement}
              selectedElementIds={selectedElementIds}
              handleStyleChange={handleStyleChange}
              handleListToggle={handleListToggle}
              handlePosition={handlePosition}
              toggleRepeatAllPages={toggleRepeatAllPages}
              duplicateSelectedElements={duplicateSelectedElements}
              deleteSelectedElements={deleteSelectedElements}
              handleGroupElements={groupSelectedElements}
              handleUngroupElements={ungroupSelectedElements}
              showFontMenu={showFontMenu}
              setShowFontMenu={setShowFontMenu}
              showSpacingMenu={showSpacingMenu}
              setShowSpacingMenu={setShowSpacingMenu}
              showTransparencyMenu={showTransparencyMenu}
              setShowTransparencyMenu={setShowTransparencyMenu}
              showEffectsMenu={showEffectsMenu}
              setShowEffectsMenu={setShowEffectsMenu}
              showAnimateMenu={showAnimateMenu}
              setShowAnimateMenu={setShowAnimateMenu}
              showPositionMenu={showPositionMenu}
              setShowPositionMenu={setShowPositionMenu}
            />
          )}

          {/* Canvas Area with Pages and Zoom */}
          <CanvasArea
            file={file}
            backgroundPdf={backgroundPdf}
            pages={pages}
            elements={elements}
            selectedElementIds={selectedElementIds}
            activeElementId={activeElementId}
            editingElementId={editingElementId}
            hoveredElementId={hoveredElementId}
            renderedDimensions={renderedDimensions}
            isProcessing={isProcessing}
            zoom={zoom}
            setZoom={setZoom}
            showPageBorderRulers={showPageBorderRulers}
            setShowPageBorderRulers={setShowPageBorderRulers}
            showMargins={showMargins}
            setShowMargins={setShowMargins}
            showGrid={showGrid}
            setShowGrid={setShowGrid}
            showDotMatrix={showDotMatrix}
            setShowDotMatrix={setShowDotMatrix}
            onDuplicatePage={duplicatePageAt}
            onMovePage={movePageAt}
            onPageBgChange={changePageBgAt}
            customGuides={customGuides}
            setCustomGuides={setCustomGuides}
            rulerGuideDrag={rulerGuideDrag}
            setRulerGuideDrag={setRulerGuideDrag}
            snapGuides={snapGuides}
            marqueeState={marqueeState}
            containerRef={containerRef}
            onFileUpload={handleFileUpload}
            onStartBlankDocument={startBlankDocument}
            onAddNewPage={addNewPage}
            onInsertPageAt={insertPageAt}
            onDeletePageAt={deletePageAt}
            onDeselectAll={deselectAll}
            onSelectAllElements={selectAllElementsOnPage}
            onStartMarquee={(e, pageIdx) => {
              if (
                e.target === e.currentTarget ||
                (e.target as HTMLElement).closest('.react-pdf__Page') ||
                (e.target as HTMLElement).classList.contains('pointer-events-none')
              ) {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) / zoom;
                const y = (e.clientY - rect.top) / zoom;
                setMarqueeState({
                  startX: x,
                  startY: y,
                  currentX: x,
                  currentY: y,
                  pageIndex: pageIdx,
                  canvasRect: rect,
                });
                deselectAll();
              }
            }}
            onSelectElement={(id, e) => {
              if (e.shiftKey || e.ctrlKey || e.metaKey) {
                setEditingElementId(null);
                toggleSelectElement(id);
              } else {
                setEditingElementId(null);
                selectSingleElement(id);
              }
            }}
            onDoubleClickElement={(id, e) => {
              const el = elements.find(item => item.id === id);
              if (el && !el.isShape && !el.imageUrl && !el.locked) {
                selectSingleElement(id);
                setEditingElementId(id);
                setTimeout(() => {
                  const textarea = (e.currentTarget as HTMLElement).querySelector('textarea');
                  if (textarea) {
                    textarea.focus();
                    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
                  }
                }, 0);
              }
            }}
            onHoverElement={setHoveredElementId}
            onStartDragElement={(e, id) => {
              const target = e.target as HTMLElement;
              if (target.closest('button') || target.getAttribute('title') === 'Drag to resize') {
                return;
              }
              e.stopPropagation();

              if (e.shiftKey || e.ctrlKey || e.metaKey) {
                setEditingElementId(null);
                toggleSelectElement(id);
                return;
              }

              if (editingElementId === id && target.tagName.toLowerCase() === 'textarea') {
                return;
              }

              if (target.tagName.toLowerCase() === 'textarea') {
                if (!selectedElementIds.includes(id)) {
                  selectSingleElement(id);
                }
                setEditingElementId(null);
                return;
              }

              setEditingElementId(null);
              let idsToMove: string[];
              if (selectedElementIds.includes(id)) {
                idsToMove = selectedElementIds;
              } else {
                selectSingleElement(id);
                idsToMove = [id];
                const targetEl = elements.find(item => item.id === id);
                if (targetEl?.groupId) {
                  idsToMove = elements.filter(item => item.groupId === targetEl.groupId).map(item => item.id);
                }
              }

              const initialPositions: Record<string, { x: number; y: number }> = {};
              elements.forEach(item => {
                if (idsToMove.includes(item.id)) {
                  initialPositions[item.id] = { x: item.x, y: item.y };
                }
              });
              setDragState({
                id,
                startX: e.clientX,
                startY: e.clientY,
                initialPositions,
              });
            }}
            onStartResizeElement={(e, id, corner) => {
              e.stopPropagation();
              e.preventDefault();
              const el = elements.find(item => item.id === id);
              if (!el) return;
              const w = el.width || Math.max(140, (el.text.length + 3) * (el.size * 0.65));
              const h = el.height || Math.max(28, el.size * 1.3);
              setResizeState({
                id,
                corner,
                startX: e.clientX,
                startY: e.clientY,
                initialX: el.x,
                initialY: el.y,
                initialWidth: w,
                initialHeight: h,
                initialSize: el.size,
              });
            }}
            onTextChange={handleTextChange}
            onToggleRepeatAllPages={toggleRepeatAllPages}
            onToggleLock={toggleLockElements}
            onDuplicate={duplicateElement}
            onDelete={deleteElement}
            onGroup={groupSelectedElements}
            onUngroup={ungroupSelectedElements}
            onRenderPageDimensions={(width, height) => {
              setRenderedDimensions({ width, height });
            }}
            onDocumentLoadSuccess={onDocumentLoadSuccess}
            addTextElement={addTextElement}
          />
        </div>
      </div>
    </div>
  );
}
