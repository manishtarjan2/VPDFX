import React from "react";

interface RulerGuidesOverlayProps {
  showPageBorderRulers: boolean;
  showMargins: boolean;
  showGrid?: boolean;
  showDotMatrix?: boolean;
  pageIndex: number;
  renderedDimensions: { width: number; height: number };
  zoom: number;
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
    currentPos: number;
    pageIndex: number;
    guideId?: string;
  } | null) => void;
  snapGuides: { x: number[]; y: number[] };
}

export const RulerGuidesOverlay: React.FC<RulerGuidesOverlayProps> = ({
  showPageBorderRulers,
  showMargins,
  showGrid = false,
  showDotMatrix = false,
  pageIndex,
  renderedDimensions,
  zoom,
  customGuides,
  setCustomGuides,
  rulerGuideDrag,
  setRulerGuideDrag,
  snapGuides,
}) => {
  const pw = renderedDimensions.width > 0 ? renderedDimensions.width : 595;
  const ph = renderedDimensions.height > 0 ? renderedDimensions.height : 842;
  const marginPt = 36; // 0.5 in

  return (
    <>
      {/* Grid Pattern Overlay */}
      {showGrid && (
        <div
          className="absolute inset-0 pointer-events-none z-[58] select-none opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(99, 102, 241, 0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(99, 102, 241, 0.25) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />
      )}

      {/* Dot Matrix Alignment Grid (Figma/Canva style) */}
      {showDotMatrix && (
        <div
          className="absolute inset-0 pointer-events-none z-[58] select-none opacity-45"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(79, 70, 229, 0.4) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      )}
      {/* Canva-Style Print Safety Margins */}
      {showMargins && (
        <div
          className="absolute pointer-events-none z-[61] border border-dashed border-emerald-500/80 select-none"
          style={{
            left: `${marginPt}px`,
            top: `${marginPt}px`,
            width: `${Math.max(10, pw - marginPt * 2)}px`,
            height: `${Math.max(10, ph - marginPt * 2)}px`,
          }}
        >
          <span className="absolute -top-3.5 left-1 text-[8px] font-bold text-emerald-600 bg-white/90 px-1 py-0.2 rounded border border-emerald-200">
            Margin (0.5&quot;)
          </span>
        </div>
      )}

      {/* Custom User-Marked Guide Lines (Canva Style) */}
      {customGuides
        .filter(g => g.pageIndex === undefined || g.pageIndex === pageIndex)
        .map((guide) => {
          const isH = guide.orientation === 'horizontal';
          const inVal = (guide.position / 72).toFixed(2);

          return (
            <div
              key={guide.id}
              className={`group absolute z-[64] ${isH ? 'left-0 right-0 h-2 -translate-y-1/2 cursor-row-resize' : 'top-0 bottom-0 w-2 -translate-x-1/2 cursor-col-resize'}`}
              style={isH ? { top: `${guide.position}px` } : { left: `${guide.position}px` }}
              onMouseDown={(e) => {
                e.stopPropagation();
                setRulerGuideDrag({
                  orientation: guide.orientation,
                  currentPos: guide.position,
                  pageIndex,
                  guideId: guide.id,
                });
              }}
              title={`Guide: ${Math.round(guide.position)} pt (${inVal}") • Drag to move, drag off page or right-click to delete`}
              onContextMenu={(e) => {
                e.preventDefault();
                setCustomGuides(prev => prev.filter(g => g.id !== guide.id));
              }}
            >
              <div
                className={`absolute ${isH ? 'top-1/2 left-0 right-0 -translate-y-1/2 h-px bg-cyan-500 group-hover:bg-cyan-600 group-hover:h-0.5' : 'left-1/2 top-0 bottom-0 -translate-x-1/2 w-px bg-cyan-500 group-hover:bg-cyan-600 group-hover:w-0.5'} transition-all shadow-xs`}
              />
              <div
                className={`absolute opacity-0 group-hover:opacity-100 transition-opacity bg-cyan-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1 pointer-events-none select-none z-[66] ${
                  isH ? 'left-6 -top-5' : 'top-6 -left-5'
                }`}
              >
                <span>{inVal}&quot;</span>
                <span className="opacity-75 text-[8px]">({Math.round(guide.position)} pt)</span>
              </div>
            </div>
          );
        })}

      {/* Active Dragging Guide Line Preview */}
      {rulerGuideDrag && rulerGuideDrag.pageIndex === pageIndex && (() => {
        const isH = rulerGuideDrag.orientation === 'horizontal';
        const inVal = (rulerGuideDrag.currentPos / 72).toFixed(2);
        return (
          <div
            className={`absolute z-[67] pointer-events-none ${isH ? 'left-0 right-0 h-0.5 bg-cyan-500 -translate-y-1/2 shadow-md' : 'top-0 bottom-0 w-0.5 bg-cyan-500 -translate-x-1/2 shadow-md'}`}
            style={isH ? { top: `${rulerGuideDrag.currentPos}px` } : { left: `${rulerGuideDrag.currentPos}px` }}
          >
            <div
              className={`absolute bg-cyan-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-md flex items-center gap-1 ${
                isH ? 'left-6 -top-6' : 'top-6 -left-6'
              }`}
            >
              <span>{inVal}&quot;</span>
              <span className="opacity-80 text-[8px]">({rulerGuideDrag.currentPos} pt)</span>
            </div>
          </div>
        );
      })()}

      {/* Page Border Rulers */}
      {showPageBorderRulers && (() => {
        const ptPerInch = 72;
        const eighthInch = ptPerInch / 8;

        const xTicks: Array<{ pos: number; type: 'inch' | 'half' | 'quarter' | 'eighth'; inchNum?: number }> = [];
        for (let pos = 0; pos <= pw; pos += eighthInch) {
          const inchIdx = Math.round(pos / ptPerInch);
          const isFullInch = Math.abs(pos - inchIdx * ptPerInch) < 0.5;
          const isHalf = !isFullInch && Math.abs(pos - (Math.floor(pos / ptPerInch) * ptPerInch + ptPerInch / 2)) < 0.5;
          const isQuarter = !isFullInch && !isHalf && Math.abs((pos % (ptPerInch / 4))) < 0.5;

          if (isFullInch) {
            xTicks.push({ pos, type: 'inch', inchNum: inchIdx });
          } else if (isHalf) {
            xTicks.push({ pos, type: 'half' });
          } else if (isQuarter) {
            xTicks.push({ pos, type: 'quarter' });
          } else {
            xTicks.push({ pos, type: 'eighth' });
          }
        }

        const yTicks: Array<{ pos: number; type: 'inch' | 'half' | 'quarter' | 'eighth'; inchNum?: number }> = [];
        for (let pos = 0; pos <= ph; pos += eighthInch) {
          const inchIdx = Math.round(pos / ptPerInch);
          const isFullInch = Math.abs(pos - inchIdx * ptPerInch) < 0.5;
          const isHalf = !isFullInch && Math.abs(pos - (Math.floor(pos / ptPerInch) * ptPerInch + ptPerInch / 2)) < 0.5;
          const isQuarter = !isFullInch && !isHalf && Math.abs((pos % (ptPerInch / 4))) < 0.5;

          if (isFullInch) {
            yTicks.push({ pos, type: 'inch', inchNum: inchIdx });
          } else if (isHalf) {
            yTicks.push({ pos, type: 'half' });
          } else if (isQuarter) {
            yTicks.push({ pos, type: 'quarter' });
          } else {
            yTicks.push({ pos, type: 'eighth' });
          }
        }

        return (
          <div className="absolute inset-0 pointer-events-none z-[62] select-none">
            {/* Top Edge Ruler Scale */}
            <div
              className="absolute top-0 left-0 right-0 h-5 bg-white/95 backdrop-blur-xs border-b border-gray-300 text-[9px] font-sans font-medium text-gray-500 overflow-hidden cursor-row-resize pointer-events-auto"
              title="Click & drag down to mark a horizontal guide line"
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
                const rect = e.currentTarget.getBoundingClientRect();
                const currentY = Math.round((e.clientY - rect.top) / zoom);
                setRulerGuideDrag({
                  orientation: 'horizontal',
                  currentPos: Math.max(10, currentY),
                  pageIndex,
                });
              }}
            >
              {xTicks.map((tick, idx) => {
                const isInch = tick.type === 'inch';
                const isHalf = tick.type === 'half';
                const isQuarter = tick.type === 'quarter';
                const tickHeight = isInch ? 'h-3' : isHalf ? 'h-2' : isQuarter ? 'h-1.5' : 'h-1';
                const tickColor = isInch ? 'bg-gray-700' : isHalf ? 'bg-gray-500' : 'bg-gray-300';

                return (
                  <div
                    key={`rtop-${idx}`}
                    className="absolute bottom-0 flex flex-col items-start pointer-events-none"
                    style={{ left: `${tick.pos}px` }}
                  >
                    <div className={`w-px ${tickHeight} ${tickColor}`} />
                    {isInch && tick.inchNum !== undefined && tick.inchNum > 0 && tick.pos < pw - 15 && (
                      <span className="absolute top-0.5 left-1 leading-none text-[9px] font-bold text-gray-700 select-none">
                        {tick.inchNum}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Left Edge Ruler Scale */}
            <div
              className="absolute top-0 left-0 bottom-0 w-5 bg-white/95 backdrop-blur-xs border-r border-gray-300 text-[9px] font-sans font-medium text-gray-500 overflow-hidden cursor-col-resize pointer-events-auto"
              title="Click & drag right to mark a vertical guide line"
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
                const rect = e.currentTarget.getBoundingClientRect();
                const currentX = Math.round((e.clientX - rect.left) / zoom);
                setRulerGuideDrag({
                  orientation: 'vertical',
                  currentPos: Math.max(10, currentX),
                  pageIndex,
                });
              }}
            >
              {yTicks.map((tick, idx) => {
                const isInch = tick.type === 'inch';
                const isHalf = tick.type === 'half';
                const isQuarter = tick.type === 'quarter';
                const tickWidth = isInch ? 'w-3' : isHalf ? 'w-2' : isQuarter ? 'w-1.5' : 'w-1';
                const tickColor = isInch ? 'bg-gray-700' : isHalf ? 'bg-gray-500' : 'bg-gray-300';

                return (
                  <div
                    key={`rleft-${idx}`}
                    className="absolute right-0 flex items-center justify-end pointer-events-none"
                    style={{ top: `${tick.pos}px` }}
                  >
                    <div className={`h-px ${tickWidth} ${tickColor}`} />
                    {isInch && tick.inchNum !== undefined && tick.inchNum > 0 && tick.pos < ph - 15 && (
                      <span className="absolute left-1 leading-none text-[9px] font-bold text-gray-700 select-none">
                        {tick.inchNum}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Top-Left 0,0 Corner Badge */}
            <div
              className="absolute top-0 left-0 w-5 h-5 bg-gray-100/95 border-r border-b border-gray-300 flex items-center justify-center text-[8px] font-extrabold text-indigo-600 tracking-tighter cursor-pointer pointer-events-auto"
              title="Border Rulers: Inches (in)"
            >
              in
            </div>
          </div>
        );
      })()}

      {/* Snap Alignment Guide Lines */}
      {snapGuides.x.map((gx, i) => (
        <div key={`snap-x-${i}`} className="absolute top-0 bottom-0 z-[60] pointer-events-none" style={{ left: `${gx}px`, width: '1px', background: 'linear-gradient(to bottom, rgba(236,72,153,0.8), rgba(168,85,247,0.8))' }} />
      ))}
      {snapGuides.y.map((gy, i) => (
        <div key={`snap-y-${i}`} className="absolute left-0 right-0 z-[60] pointer-events-none" style={{ top: `${gy}px`, height: '1px', background: 'linear-gradient(to right, rgba(236,72,153,0.8), rgba(168,85,247,0.8))' }} />
      ))}
    </>
  );
};
