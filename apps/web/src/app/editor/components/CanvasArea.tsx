import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { CanvasTextElement, EditorPage } from "./types";
import { Upload, FilePlus, Plus, ZoomIn, ZoomOut, FileText, Timer, LayoutGrid, Maximize2, HelpCircle, Grid3X3, Layers } from "lucide-react";
import { CanvasPageItem } from "./CanvasPageItem";

interface CanvasAreaProps {
  file: File | null;
  backgroundPdf: string | null;
  pages: EditorPage[];
  elements: CanvasTextElement[];
  selectedElementIds: string[];
  activeElementId: string | null;
  editingElementId: string | null;
  hoveredElementId: string | null;
  renderedDimensions: { width: number; height: number };
  isProcessing: boolean;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  showPageBorderRulers: boolean;
  setShowPageBorderRulers?: React.Dispatch<React.SetStateAction<boolean>>;
  showMargins: boolean;
  setShowMargins?: React.Dispatch<React.SetStateAction<boolean>>;
  showGrid?: boolean;
  setShowGrid?: React.Dispatch<React.SetStateAction<boolean>>;
  showDotMatrix?: boolean;
  setShowDotMatrix?: React.Dispatch<React.SetStateAction<boolean>>;
  onDuplicatePage?: (index: number) => void;
  onMovePage?: (index: number, direction: 'up' | 'down') => void;
  onPageBgChange?: (index: number, color: string) => void;
  customGuides: Array<{
    id: string;
    orientation: 'horizontal' | 'vertical';
    position: number;
    pageIndex?: number;
  }>;
  setCustomGuides: React.Dispatch<React.SetStateAction<Array<{
    id: string;
    orientation: 'horizontal' | 'vertical';
    position: number;
    pageIndex?: number;
  }>>>;
  rulerGuideDrag: {
    orientation: 'horizontal' | 'vertical';
    currentPos: number;
    pageIndex: number;
    guideId?: string;
  } | null;
  setRulerGuideDrag: (drag: {
    orientation: 'horizontal' | 'vertical';
    pageIndex: number;
    currentPos: number;
    guideId?: string;
  } | null) => void;
  snapGuides: { x: number[]; y: number[] };
  marqueeState: {
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    pageIndex: number;
    canvasRect: DOMRect;
  } | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onFileUpload: (file: File) => void;
  onStartBlankDocument: () => void;
  onAddNewPage: () => void;
  onInsertPageAt: (index: number) => void;
  onDeletePageAt: (index: number) => void;
  onDeselectAll: () => void;
  onSelectAllElements: (pageIdx?: number) => void;
  onStartMarquee: (e: React.MouseEvent, pageIndex: number) => void;
  onSelectElement: (id: string, e: React.MouseEvent) => void;
  onDoubleClickElement: (id: string, e: React.MouseEvent) => void;
  onHoverElement: (id: string | null) => void;
  onStartDragElement: (e: React.MouseEvent, id: string) => void;
  onStartResizeElement: (e: React.MouseEvent, id: string, corner: 'tl' | 'tr' | 'bl' | 'br') => void;
  onTextChange: (id: string, text: string) => void;
  onToggleRepeatAllPages: (id: string) => void;
  onToggleLock: (ids: string[]) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onGroup: () => void;
  onUngroup: () => void;
  onRenderPageDimensions?: (width: number, height: number) => void;
  onDocumentLoadSuccess?: (pdf: { numPages: number }) => void;
  addTextElement: (type: "header" | "footer", targetPage: number) => void;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  file,
  backgroundPdf,
  pages,
  elements,
  selectedElementIds,
  activeElementId,
  editingElementId,
  hoveredElementId,
  renderedDimensions,
  isProcessing,
  zoom,
  setZoom,
  showPageBorderRulers,
  setShowPageBorderRulers,
  showMargins,
  setShowMargins,
  showGrid = false,
  setShowGrid,
  showDotMatrix = false,
  setShowDotMatrix,
  onDuplicatePage,
  onMovePage,
  onPageBgChange,
  customGuides,
  setCustomGuides,
  rulerGuideDrag,
  setRulerGuideDrag,
  snapGuides,
  marqueeState,
  containerRef,
  onFileUpload,
  onStartBlankDocument,
  onAddNewPage,
  onInsertPageAt,
  onDeletePageAt,
  onDeselectAll,
  onSelectAllElements,
  onStartMarquee,
  onSelectElement,
  onDoubleClickElement,
  onHoverElement,
  onStartDragElement,
  onStartResizeElement,
  onTextChange,
  onToggleRepeatAllPages,
  onToggleLock,
  onDuplicate,
  onDelete,
  onGroup,
  onUngroup,
  onRenderPageDimensions,
  onDocumentLoadSuccess,
  addTextElement,
}) => {
  return (
    <div
      className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-12 flex flex-col items-center justify-start w-full relative hide-scrollbar"
      onClick={(e) => {
        if (e.target === e.currentTarget) onDeselectAll();
      }}
    >
      {!file ? (
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-12 text-center my-auto">
          <div className="text-4xl sm:text-5xl mb-3">✨</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Canva-Style PDF Editor</h2>
          <p className="text-xs sm:text-base text-gray-500 mb-6 sm:mb-8 max-w-md mx-auto">
            Upload a PDF or start designing directly on a fresh blank document page.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full max-w-sm sm:max-w-none mx-auto">
            <label className="bg-indigo-600 text-white px-5 sm:px-6 py-3 rounded-xl font-bold cursor-pointer hover:bg-indigo-700 shadow-md inline-flex items-center justify-center gap-2 transition-transform active:scale-98 text-sm sm:text-base">
              <Upload size={18} />
              <span>{isProcessing ? "Reading Document..." : "Select PDF File"}</span>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                disabled={isProcessing}
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    onFileUpload(e.target.files[0]);
                  }
                }}
              />
            </label>

            <button
              type="button"
              onClick={onStartBlankDocument}
              disabled={isProcessing}
              className="bg-white hover:bg-indigo-50/60 border-2 border-indigo-200 hover:border-indigo-500 text-indigo-700 px-5 sm:px-6 py-3 rounded-xl font-bold cursor-pointer shadow-sm inline-flex items-center justify-center gap-2 transition-all active:scale-98 text-sm sm:text-base"
            >
              <FilePlus size={18} className="text-indigo-600" />
              <span>Start with Blank Page</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          className="relative flex flex-col items-center mb-28 pb-32 w-full transition-transform"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
        >
          {/* Hidden Document loader to fetch original PDF pages & dimensions */}
          <div className="hidden">
            <Document
              file={backgroundPdf || file}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={null}
            >
              {pages
                .filter(p => p.type === "original" && p.originalPageIndex !== undefined)
                .map(p => (
                  <Page
                    key={`hidden_preload_${p.originalPageIndex}`}
                    pageNumber={(p.originalPageIndex || 0) + 1}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    onRenderSuccess={(page) => {
                      if (p.originalPageIndex === 0 && page.width && page.height && onRenderPageDimensions) {
                        onRenderPageDimensions(page.width, page.height);
                      }
                    }}
                  />
                ))}
            </Document>
          </div>

          {/* Multi-Page Canvas Area */}
          <div className="flex flex-col items-center gap-8 w-full">
            {pages.map((editorPage, index) => (
              <React.Fragment key={editorPage.id}>
                <CanvasPageItem
                  editorPage={editorPage}
                  index={index}
                  totalPages={pages.length}
                  elements={elements}
                  selectedElementIds={selectedElementIds}
                  activeElementId={activeElementId}
                  editingElementId={editingElementId}
                  hoveredElementId={hoveredElementId}
                  renderedDimensions={renderedDimensions}
                  isProcessing={isProcessing}
                  backgroundPdf={backgroundPdf}
                  file={file}
                  zoom={zoom}
                  showPageBorderRulers={showPageBorderRulers}
                  showMargins={showMargins}
                  customGuides={customGuides}
                  setCustomGuides={setCustomGuides}
                  rulerGuideDrag={rulerGuideDrag}
                  setRulerGuideDrag={setRulerGuideDrag}
                  snapGuides={snapGuides}
                  marqueeState={marqueeState}
                  containerRef={containerRef}
                  onAddTextElement={addTextElement}
                  onSelectAllElementsOnPage={onSelectAllElements}
                  onInsertPageAt={onInsertPageAt}
                  onDeletePageAt={onDeletePageAt}
                  onDeselectAll={onDeselectAll}
                  onStartMarquee={onStartMarquee}
                  onSelectElement={onSelectElement}
                  onDoubleClickElement={onDoubleClickElement}
                  onHoverElement={onHoverElement}
                  onStartDragElement={onStartDragElement}
                  onStartResizeElement={onStartResizeElement}
                  onTextChange={onTextChange}
                  onToggleRepeatAllPages={onToggleRepeatAllPages}
                  onToggleLock={onToggleLock}
                  onDuplicate={onDuplicate}
                  onDelete={onDelete}
                  onGroup={onGroup}
                  onUngroup={onUngroup}
                  showGrid={showGrid}
                  showDotMatrix={showDotMatrix}
                  onDuplicatePage={onDuplicatePage}
                  onMovePage={onMovePage}
                  onPageBgChange={onPageBgChange}
                  onRenderPageDimensions={onRenderPageDimensions}
                />

                {/* Canva In-Between Page Insertion Divider */}
                {index < pages.length - 1 && (
                  <div className="group/divider py-1 w-full flex items-center justify-center relative select-none">
                    <div className="absolute inset-x-0 h-[1px] bg-transparent group-hover/divider:bg-indigo-300 transition-colors" />
                    <button
                      type="button"
                      onClick={() => onInsertPageAt(index)}
                      className="relative z-10 flex items-center gap-1.5 bg-white hover:bg-indigo-50 border border-gray-300 hover:border-indigo-400 text-gray-500 hover:text-indigo-700 text-xs font-bold px-3 py-1 rounded-full shadow-xs transition-all duration-150 transform hover:scale-105 cursor-pointer opacity-70 group-hover/divider:opacity-100"
                      title="Add a page in between"
                    >
                      <Plus size={14} className="text-indigo-600" />
                      <span>Add page here</span>
                    </button>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Canva Bottom Add Page Button */}
          <div className="mt-8 flex items-center justify-center">
            <button
              type="button"
              onClick={onAddNewPage}
              className="flex items-center gap-2 bg-white hover:bg-indigo-50 border-2 border-dashed border-indigo-400 hover:border-indigo-600 text-indigo-700 font-bold px-6 py-3 rounded-2xl shadow-sm transition-all cursor-pointer group hover:scale-[1.02]"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-200" />
              <span>Add New Page</span>
            </button>
          </div>
        </div>
      )}

      {/* Canva-Style Bottom Status & Viewport Bar */}
      {file && (
        <div className="fixed bottom-[52px] md:bottom-0 left-[58px] md:left-[72px] right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 px-2 sm:px-4 py-1.5 flex items-center justify-between text-xs text-gray-700 shadow-md select-none gap-2 overflow-x-auto scrollbar-none">
          {/* Left Actions: Notes & Timer */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => alert("Document Notes: You can write project or assignment notes here.")}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-gray-100 transition-colors font-medium cursor-pointer"
              title="Add or view document notes"
            >
              <FileText size={15} className="text-gray-500 shrink-0" />
              <span className="font-semibold text-[11px] sm:text-xs">Notes</span>
            </button>

            <button
              type="button"
              onClick={() => alert("Presentation Timer: 00:00 - Great for pacing student presentations.")}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-gray-100 transition-colors font-medium cursor-pointer"
              title="Presentation Timer"
            >
              <Timer size={15} className="text-gray-500 shrink-0" />
              <span className="font-semibold text-[11px] sm:text-xs">Timer</span>
            </button>
          </div>

          {/* Center / Zoom Slider & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 bg-gray-50/80 px-2 py-0.5 rounded-xl border border-gray-200/60">
            <button
              type="button"
              onClick={() => setZoom(z => Math.max(0.5, +(z - 0.1).toFixed(1)))}
              className="w-6 h-6 rounded-md hover:bg-white hover:text-indigo-600 flex items-center justify-center text-gray-500 transition-all cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>

            <div className="flex items-center w-16 sm:w-28 md:w-36">
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-700 transition-all"
                title={`Zoom: ${Math.round(zoom * 100)}%`}
              />
            </div>

            <button
              type="button"
              onClick={() => setZoom(z => Math.min(2.0, +(z + 0.1).toFixed(1)))}
              className="w-6 h-6 rounded-md hover:bg-white hover:text-indigo-600 flex items-center justify-center text-gray-500 transition-all cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>

            <button
              type="button"
              onClick={() => setZoom(1.0)}
              className="text-[11px] sm:text-xs font-bold text-gray-700 hover:text-indigo-600 px-1.5 py-0.5 rounded hover:bg-white min-w-[38px] text-center cursor-pointer transition-all"
              title="Reset Zoom to 100%"
            >
              {Math.round(zoom * 100)}%
            </button>
          </div>

          {/* Right Actions: Pages Counter, Grid View, Alignment Tools, Fullscreen & Help */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <div className="flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-lg bg-gray-50 border border-gray-200 font-semibold text-gray-600 text-[11px] sm:text-xs">
              <Layers size={13} className="text-gray-500 shrink-0" />
              <span className="hidden sm:inline">Pages</span>
              <span className="text-gray-800">1 / {pages.length}</span>
            </div>

            {/* Rulers (R) Toggle */}
            {setShowPageBorderRulers && (
              <button
                type="button"
                onClick={() => setShowPageBorderRulers(r => !r)}
                className={`w-7 h-7 flex items-center justify-center rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                  showPageBorderRulers
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-200'
                }`}
                title="Toggle Inch Rulers (R)"
              >
                <span className="text-[11px] font-black leading-none">R</span>
              </button>
            )}

            {/* Grid Toggle */}
            {setShowGrid && (
              <button
                type="button"
                onClick={() => setShowGrid(g => !g)}
                className={`p-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                  showGrid
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white hover:bg-gray-100 text-gray-600 border-gray-200'
                }`}
                title="Toggle Alignment Grid (20pt)"
              >
                <Grid3X3 size={14} />
              </button>
            )}

            {/* Dot Matrix Toggle */}
            {setShowDotMatrix && (
              <button
                type="button"
                onClick={() => setShowDotMatrix(d => !d)}
                className={`p-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                  showDotMatrix
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white hover:bg-gray-100 text-gray-600 border-gray-200'
                }`}
                title="Toggle Dot Matrix Canvas"
              >
                <LayoutGrid size={14} />
              </button>
            )}

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen().catch(() => {});
                } else {
                  document.exitFullscreen().catch(() => {});
                }
              }}
              className="p-1.5 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-gray-100 transition-colors cursor-pointer hidden xs:flex"
              title="Toggle Fullscreen Mode"
            >
              <Maximize2 size={14} />
            </button>

            {/* Help Shortcut */}
            <button
              type="button"
              onClick={() => alert("Canva Editor Shortcuts:\n• Ctrl+A: Select all\n• Delete/Backspace: Delete element\n• Drag: Move elements\n• Pinch / Slider: Zoom")}
              className="p-1.5 rounded-lg text-gray-600 hover:text-indigo-600 hover:bg-gray-100 transition-colors cursor-pointer hidden xs:flex"
              title="Keyboard Shortcuts & Help"
            >
              <HelpCircle size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
