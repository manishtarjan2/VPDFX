import React from "react";
import { Document, Page } from "react-pdf";
import { CanvasTextElement, EditorPage } from "./types";
import { PanelTopClose, PanelBottomClose, CheckSquare, Plus, Trash2 } from "lucide-react";
import { CanvasElementItem } from "./CanvasElementItem";
import { RulerGuidesOverlay } from "./RulerGuidesOverlay";

interface CanvasPageItemProps {
  editorPage: EditorPage;
  index: number;
  totalPages: number;
  elements: CanvasTextElement[];
  selectedElementIds: string[];
  activeElementId: string | null;
  editingElementId: string | null;
  hoveredElementId: string | null;
  renderedDimensions: { width: number; height: number };
  isProcessing: boolean;
  backgroundPdf: string | null;
  file: File | null;
  zoom: number;
  showPageBorderRulers: boolean;
  showMargins: boolean;
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
  containerRef: React.RefObject<HTMLDivElement | null> | null;
  onAddTextElement: (type: "header" | "footer", targetPage: number) => void;
  onSelectAllElementsOnPage: (pageIdx: number) => void;
  onInsertPageAt: (index: number) => void;
  onDeletePageAt: (index: number) => void;
  onDeselectAll: () => void;
  onStartMarquee: (e: React.MouseEvent, pageIndex: number) => void;
  onSelectElement: (id: string, e: React.MouseEvent) => void;
  onDoubleClickElement: (id: string, e: React.MouseEvent) => void;
  onHoverElement: (id: string | null) => void;
  onStartDragElement: (e: React.MouseEvent, id: string) => void;
  onStartResizeElement: (e: React.MouseEvent, id: string, corner: 'tl' | 'tr' | 'bl' | 'br') => void;
  onTextChange: (id: string, text: string) => void;
  showGrid?: boolean;
  showDotMatrix?: boolean;
  onDuplicatePage?: (index: number) => void;
  onMovePage?: (index: number, direction: 'up' | 'down') => void;
  onPageBgChange?: (index: number, color: string) => void;
  onToggleRepeatAllPages: (id: string) => void;
  onToggleLock: (ids: string[]) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onGroup: () => void;
  onUngroup: () => void;
  onRenderPageDimensions?: (width: number, height: number) => void;
}

export const CanvasPageItem: React.FC<CanvasPageItemProps> = ({
  editorPage,
  index,
  totalPages,
  elements,
  selectedElementIds,
  activeElementId,
  editingElementId,
  hoveredElementId,
  renderedDimensions,
  isProcessing,
  backgroundPdf,
  file,
  zoom,
  showPageBorderRulers,
  showMargins,
  customGuides,
  setCustomGuides,
  rulerGuideDrag,
  setRulerGuideDrag,
  snapGuides,
  marqueeState,
  containerRef,
  onAddTextElement,
  onSelectAllElementsOnPage,
  onInsertPageAt,
  onDeletePageAt,
  onDeselectAll,
  onStartMarquee,
  onSelectElement,
  onDoubleClickElement,
  onHoverElement,
  onStartDragElement,
  onStartResizeElement,
  onTextChange,
  showGrid = false,
  showDotMatrix = false,
  onDuplicatePage,
  onMovePage,
  onPageBgChange,
  onToggleRepeatAllPages,
  onToggleLock,
  onDuplicate,
  onDelete,
  onGroup,
  onUngroup,
  onRenderPageDimensions,
}) => {
  const pageElements = elements.filter(el => el.page === index || el.repeatAllPages);

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Page Header Bar */}
      <div className="w-full max-w-full flex items-center justify-between text-xs font-medium text-gray-500 px-1 select-none overflow-x-auto scrollbar-none gap-2 pb-1.5">
        <div className="flex items-center gap-2 shrink-0">
          <span className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-lg border border-gray-200/80 shadow-2xs font-bold text-gray-800 whitespace-nowrap text-xs">
            Page {index + 1} of {totalPages}
          </span>
          {editorPage.type === "blank" && (
            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-200/80 whitespace-nowrap">
              Blank Page
            </span>
          )}

          {/* Page Background Color Picker */}
          {onPageBgChange && (
            <label className="flex items-center gap-1 bg-white hover:bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-200 cursor-pointer text-[10px] font-semibold text-gray-600 transition-colors shadow-2xs" title="Change page background color">
              <span className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-2xs shrink-0" style={{ backgroundColor: editorPage.bgColor || '#ffffff' }} />
              <span>Color</span>
              <input
                type="color"
                className="hidden"
                value={editorPage.bgColor || '#ffffff'}
                onChange={(e) => onPageBgChange(index, e.target.value)}
              />
            </label>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Move Page Up */}
          {onMovePage && index > 0 && (
            <button
              type="button"
              onClick={() => onMovePage(index, 'up')}
              className="bg-white hover:bg-gray-50 text-gray-600 border border-gray-200/80 p-1.5 rounded-lg shadow-2xs hover:shadow-xs cursor-pointer shrink-0 transition-all"
              title="Move page up"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
            </button>
          )}

          {/* Move Page Down */}
          {onMovePage && index < totalPages - 1 && (
            <button
              type="button"
              onClick={() => onMovePage(index, 'down')}
              className="bg-white hover:bg-gray-50 text-gray-600 border border-gray-200/80 p-1.5 rounded-lg shadow-2xs hover:shadow-xs cursor-pointer shrink-0 transition-all"
              title="Move page down"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
          )}

          <button
            type="button"
            onClick={() => onAddTextElement("header", index)}
            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200/80 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs hover:shadow-xs cursor-pointer whitespace-nowrap transition-all"
            title="Add Header to this page (can link across all pages)"
          >
            <PanelTopClose size={13} className="text-purple-600" />
            <span>Header</span>
          </button>

          <button
            type="button"
            onClick={() => onAddTextElement("footer", index)}
            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200/80 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs hover:shadow-xs cursor-pointer whitespace-nowrap transition-all"
            title="Add Footer to this page (can link across all pages)"
          >
            <PanelBottomClose size={13} className="text-purple-600" />
            <span>Footer</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectAllElementsOnPage(index)}
            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200/80 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs hover:shadow-xs cursor-pointer whitespace-nowrap shrink-0 transition-all"
            title="Select all text elements on this page"
          >
            <CheckSquare size={13} className="text-purple-600" />
            <span>Select Text</span>
          </button>

          {totalPages > 1 && (
            <button
              type="button"
              onClick={() => onDeletePageAt(index)}
              className="bg-white hover:bg-red-50 text-gray-400 hover:text-red-600 border border-gray-200/80 hover:border-red-200 p-1.5 rounded-lg shadow-2xs hover:shadow-xs cursor-pointer shrink-0 transition-all"
              title="Delete this page"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Page Canvas Container */}
      <div
        data-page-index={index}
        className="relative rounded-none border border-gray-300 shadow-md overflow-hidden transition-colors"
        ref={index === 0 && containerRef ? containerRef : null}
        style={{
          opacity: isProcessing ? 0.6 : 1,
          backgroundColor: editorPage.bgColor || '#ffffff',
          width: renderedDimensions.width > 0 ? `${renderedDimensions.width}px` : '595px',
          height: renderedDimensions.height > 0 ? `${renderedDimensions.height}px` : '842px',
        }}
        onMouseDown={(e) => onStartMarquee(e, index)}
        onClick={(e) => {
          if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.react-pdf__Page')) {
            onDeselectAll();
          }
        }}
      >
        {/* Rulers, Safety Margins, Snap Guides and User Lines */}
        <RulerGuidesOverlay
          showPageBorderRulers={showPageBorderRulers}
          showMargins={showMargins}
          showGrid={showGrid}
          showDotMatrix={showDotMatrix}
          pageIndex={index}
          renderedDimensions={renderedDimensions}
          zoom={zoom}
          customGuides={customGuides}
          setCustomGuides={setCustomGuides}
          rulerGuideDrag={rulerGuideDrag}
          setRulerGuideDrag={setRulerGuideDrag}
          snapGuides={snapGuides}
        />

        {/* Marquee Rubber-Band Selection Rectangle */}
        {marqueeState && marqueeState.pageIndex === index && (() => {
          const mx = Math.min(marqueeState.startX, marqueeState.currentX);
          const my = Math.min(marqueeState.startY, marqueeState.currentY);
          const mw = Math.abs(marqueeState.currentX - marqueeState.startX);
          const mh = Math.abs(marqueeState.currentY - marqueeState.startY);
          return (
            <div
              className="absolute z-[55] pointer-events-none rounded-sm"
              style={{
                left: `${mx}px`,
                top: `${my}px`,
                width: `${mw}px`,
                height: `${mh}px`,
                border: '1.5px solid rgba(99, 102, 241, 0.7)',
                backgroundColor: 'rgba(99, 102, 241, 0.08)',
              }}
            />
          );
        })()}

        {/* If original page from PDF, render via react-pdf Document/Page */}
        {editorPage.type === "original" && editorPage.originalPageIndex !== undefined ? (
          <Document
            file={backgroundPdf || file}
            loading={null}
          >
            <Page
              pageNumber={editorPage.originalPageIndex + 1}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              scale={1}
              onRenderSuccess={(page) => {
                if (index === 0 && page.width && page.height && onRenderPageDimensions) {
                  onRenderPageDimensions(page.width, page.height);
                }
              }}
            />
          </Document>
        ) : (
          /* Clean blank page canvas */
          <div className="w-full h-full bg-white flex flex-col justify-between p-8 pointer-events-none select-none">
            <div className="text-[11px] text-gray-300 font-medium">Blank Canvas Page {index + 1}</div>
            <div className="text-center text-xs text-gray-200">VPDFX Canvas</div>
          </div>
        )}

        {/* Freeform Interactive Elements Layer */}
        {pageElements.map((el) => {
          const isSelected = selectedElementIds.includes(el.id);
          const isPrimary = activeElementId === el.id;
          const isEditing = editingElementId === el.id;
          const isHovered = hoveredElementId === el.id && !isSelected;

          return (
            <CanvasElementItem
              key={el.id}
              el={el}
              isSelected={isSelected}
              isPrimary={isPrimary}
              isEditing={isEditing}
              isHovered={isHovered}
              selectedElementIds={selectedElementIds}
              elements={elements}
              renderedDimensions={renderedDimensions}
              onSelect={onSelectElement}
              onDoubleClick={onDoubleClickElement}
              onHover={onHoverElement}
              onStartDrag={onStartDragElement}
              onStartResize={onStartResizeElement}
              onTextChange={onTextChange}
              onToggleRepeatAllPages={onToggleRepeatAllPages}
              onToggleLock={onToggleLock}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
              onGroup={onGroup}
              onUngroup={onUngroup}
            />
          );
        })}
      </div>

      {/* End of Page Quick Action Bar (Add Page, Delete, Duplicate, Footer) */}
      <div className="w-full flex items-center justify-between px-2 pt-1 text-xs text-gray-500 select-none">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-gray-400">Page {index + 1} End</span>
          <span className="text-gray-300">•</span>
          <button
            type="button"
            onClick={() => onAddTextElement("footer", index)}
            className="text-[11px] font-semibold text-gray-500 hover:text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
            title="Add page numbering or footer"
          >
            <PanelBottomClose size={12} className="text-indigo-500" />
            <span>Add Footer</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {onDuplicatePage && (
            <button
              type="button"
              onClick={() => onDuplicatePage(index)}
              className="bg-white hover:bg-gray-50 text-gray-600 hover:text-indigo-600 border border-gray-200/90 px-2 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-2xs hover:shadow-xs cursor-pointer transition-all active:scale-95"
              title="Duplicate this page"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              <span>Duplicate</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onInsertPageAt(index)}
            className="bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-2xs hover:shadow-xs cursor-pointer transition-all active:scale-95"
            title="Add page immediately after this page"
          >
            <Plus size={13} className="text-indigo-600" />
            <span>Add Page</span>
          </button>

          {totalPages > 1 && (
            <button
              type="button"
              onClick={() => onDeletePageAt(index)}
              className="bg-white hover:bg-red-50 text-gray-400 hover:text-red-600 border border-gray-200 hover:border-red-200 p-1.5 rounded-lg shadow-2xs hover:shadow-xs cursor-pointer transition-all active:scale-95"
              title="Delete this page"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
