import React from "react";
import { CanvasTextElement } from "./types";
import { Move, Ruler, Layers, Group, Ungroup, Lock, Unlock, Copy, Trash2 } from "lucide-react";

interface CanvasElementItemProps {
  el: CanvasTextElement;
  isSelected: boolean;
  isPrimary: boolean;
  isEditing: boolean;
  isHovered: boolean;
  selectedElementIds: string[];
  elements: CanvasTextElement[];
  renderedDimensions: { width: number; height: number };
  onSelect: (id: string, e: React.MouseEvent) => void;
  onDoubleClick: (id: string, e: React.MouseEvent) => void;
  onHover: (id: string | null) => void;
  onStartDrag: (e: React.MouseEvent, id: string) => void;
  onStartResize: (e: React.MouseEvent, id: string, corner: 'tl' | 'tr' | 'bl' | 'br') => void;
  onTextChange: (id: string, text: string) => void;
  onToggleRepeatAllPages: (id: string) => void;
  onToggleLock: (ids: string[]) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onGroup: () => void;
  onUngroup: () => void;
}

export const CanvasElementItem: React.FC<CanvasElementItemProps> = ({
  el,
  isSelected,
  isPrimary,
  isEditing,
  isHovered,
  selectedElementIds,
  elements,
  renderedDimensions,
  onSelect,
  onDoubleClick,
  onHover,
  onStartDrag,
  onStartResize,
  onTextChange,
  onToggleRepeatAllPages,
  onToggleLock,
  onDuplicate,
  onDelete,
  onGroup,
  onUngroup,
}) => {
  return (
    <div
      key={el.id}
      className={`absolute ${isSelected ? 'z-50' : isHovered ? 'z-30' : 'z-20'} group/el`}
      style={{
        left: `${el.x}px`,
        top: `${el.y}px`,
        cursor: isEditing ? 'text' : 'move',
      }}
      onMouseEnter={() => onHover(el.id)}
      onMouseLeave={() => onHover(null)}
      onMouseDown={(e) => onStartDrag(e, el.id)}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => onDoubleClick(el.id, e)}
    >
      {/* Hover Highlight */}
      {isHovered && !isSelected && (
        <div className="absolute -inset-1 border border-indigo-300/60 rounded-sm pointer-events-none z-10 transition-opacity duration-150" />
      )}

      {/* Selection Border & Corner Handles */}
      {isSelected && (
        <div className="absolute -inset-1.5 border-2 border-purple-600 pointer-events-none rounded-sm z-20">
          <div
            onMouseDown={(e) => onStartResize(e, el.id, 'tl')}
            className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-purple-600 rounded-full cursor-nwse-resize pointer-events-auto hover:scale-125 transition-transform"
            title="Drag to resize"
          />
          <div
            onMouseDown={(e) => onStartResize(e, el.id, 'tr')}
            className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-purple-600 rounded-full cursor-nesw-resize pointer-events-auto hover:scale-125 transition-transform"
            title="Drag to resize"
          />
          <div
            onMouseDown={(e) => onStartResize(e, el.id, 'bl')}
            className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-purple-600 rounded-full cursor-nesw-resize pointer-events-auto hover:scale-125 transition-transform"
            title="Drag to resize"
          />
          <div
            onMouseDown={(e) => onStartResize(e, el.id, 'br')}
            className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-purple-600 rounded-full cursor-nwse-resize pointer-events-auto hover:scale-125 transition-transform"
            title="Drag to resize"
          />
        </div>
      )}

      {/* Floating Quick Action Toolbar */}
      {isPrimary && (
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg border border-gray-200/90 px-1.5 py-1 flex items-center gap-1 z-50 pointer-events-auto select-none whitespace-nowrap"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Move Drag Pill */}
          <div
            onMouseDown={(e) => onStartDrag(e, el.id)}
            className="h-7 px-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-xs font-semibold flex items-center gap-1.5 cursor-grab active:cursor-grabbing transition-colors mr-0.5"
            title="Click and drag to move"
          >
            <Move size={13} className="text-gray-600" />
            <span className="text-[11px] leading-none">Move</span>
          </div>

          {/* Live Measurement Badge */}
          <div
            className="h-7 px-2 bg-indigo-50 border border-indigo-200/80 rounded-lg text-indigo-700 text-[10px] font-bold flex items-center gap-1 cursor-default select-none shadow-2xs"
            title={`Position: X: ${Math.round(el.x)}pt, Y: ${Math.round(el.y)}pt • Size: ${Math.round(el.width || 140)} × ${Math.round(el.height || 35)} pt`}
          >
            <Ruler size={11} className="text-indigo-600" />
            <span>{Math.round(el.x)}, {Math.round(el.y)} pt</span>
            <span className="text-indigo-300">|</span>
            <span>{Math.round(el.width || 140)}×{Math.round(el.height || 35)}</span>
          </div>

          {/* Repeat Across All Pages Toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleRepeatAllPages(el.id);
            }}
            className={`h-7 px-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
              el.repeatAllPages
                ? 'bg-purple-100 text-purple-700 border border-purple-200 shadow-2xs'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
            title={el.repeatAllPages ? "Unlink from all pages" : "Link/repeat on all pages"}
          >
            <Layers size={13} className={el.repeatAllPages ? "text-purple-600" : "text-gray-500"} />
            <span className="text-[11px] leading-none whitespace-nowrap">{el.repeatAllPages ? "All Pages" : "Link"}</span>
          </button>

          {/* Group / Ungroup Pill */}
          {(selectedElementIds.length > 1 || el.groupId) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (el.groupId || selectedElementIds.some(id => elements.find(item => item.id === id)?.groupId)) {
                  onUngroup();
                } else {
                  onGroup();
                }
              }}
              className={`h-7 px-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                el.groupId
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200 shadow-2xs'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              title={el.groupId ? "Ungroup elements (Ctrl+Shift+G)" : "Group selected elements together (Ctrl+G)"}
            >
              {el.groupId ? <Ungroup size={13} className="text-indigo-600" /> : <Group size={13} className="text-gray-600" />}
              <span className="text-[11px] leading-none whitespace-nowrap">{el.groupId ? "Ungroup" : "Group"}</span>
            </button>
          )}

          {/* Lock / Unlock */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleLock([el.id]);
            }}
            className={`w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
              el.locked
                ? 'bg-amber-100 text-amber-700 border border-amber-200 shadow-2xs'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
            title={el.locked ? "Unlock element" : "Lock element"}
          >
            {el.locked ? <Lock size={14} className="text-amber-600" /> : <Unlock size={14} />}
          </button>

          {/* Duplicate */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(el.id);
            }}
            disabled={el.locked}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
              el.locked
                ? 'opacity-30 text-gray-400 cursor-not-allowed'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900 cursor-pointer active:scale-95'
            }`}
            title="Duplicate"
          >
            <Copy size={14} />
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(el.id);
            }}
            className="w-7 h-7 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600 flex items-center justify-center cursor-pointer transition-all active:scale-95"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      {/* Render element content: image, shape, or editable textarea */}
      {el.imageUrl ? (
        <div
          style={{
            width: `${el.width || 140}px`,
            height: `${el.height || 70}px`,
            opacity: el.opacity !== undefined ? el.opacity : 1,
          }}
          className="select-none pointer-events-auto overflow-hidden rounded-lg flex items-center justify-center bg-transparent"
        >
          <img
            src={el.imageUrl}
            alt={el.text || "Uploaded element"}
            className="w-full h-full object-contain pointer-events-none"
          />
        </div>
      ) : el.isShape ? (
        <div
          style={{
            width: `${el.width || 120}px`,
            height: `${el.height || 60}px`,
            backgroundColor: el.bgColor || 'transparent',
            borderColor: el.borderColor || el.color,
            borderWidth: `${el.borderWidth !== undefined ? el.borderWidth : 2}px`,
            borderStyle: el.borderWidth === 0 ? 'none' : (el.borderStyle || 'solid'),
            borderRadius: el.shapeType === 'circle' 
              ? '9999px' 
              : el.shapeType === 'roundedRect' 
                ? '16px' 
                : el.shapeType === 'badge' 
                  ? '8px' 
                  : el.shapeType === 'callout' 
                    ? '8px' 
                    : el.shapeType === 'line' || el.shapeType === 'footerLine' || el.shapeType === 'headerLine'
                      ? '0px'
                      : '4px',
            opacity: el.opacity !== undefined ? el.opacity : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: el.color,
            fontWeight: el.bold ? 'bold' : 'normal',
            fontFamily: el.font || 'sans-serif',
            fontSize: `${el.size}px`,
            boxSizing: 'border-box',
            pointerEvents: 'auto',
          }}
          className="select-none cursor-pointer text-center px-2"
        >
          {el.text}
        </div>
      ) : (
        <textarea
          value={el.text}
          rows={1}
          disabled={el.locked}
          onChange={(e) => {
            if (el.locked) return;
            onTextChange(el.id, e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          onFocus={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          onClick={(e) => e.stopPropagation()}
          className={`outline-none border-none p-1 resize-none bg-transparent overflow-hidden ${
            el.locked ? 'cursor-not-allowed select-none' : 'cursor-text'
          } block leading-tight ${
            el.animation === 'bounce' ? 'animate-bounce' : el.animation === 'pulse' ? 'animate-pulse' : ''
          }`}
          style={{
            fontSize: `${el.size}px`,
            color: el.color || '#000000',
            caretColor: el.color || '#000000',
            fontFamily: el.font || 'sans-serif',
            fontWeight: el.bold ? 'bold' : 'normal',
            fontStyle: el.italic ? 'italic' : 'normal',
            textTransform: el.uppercase ? 'uppercase' : 'none',
            letterSpacing: el.letterSpacing !== undefined ? `${el.letterSpacing}px` : undefined,
            opacity: el.opacity !== undefined ? el.opacity : 1,
            textDecoration: [el.underline ? 'underline' : '', el.strikethrough ? 'line-through' : ''].filter(Boolean).join(' ') || undefined,
            textAlign: el.align || 'left',
            textShadow: el.effect === 'shadow' ? '2px 2px 4px rgba(0,0,0,0.5)' : el.effect === 'neon' ? '0 0 6px #6366f1, 0 0 12px #6366f1' : undefined,
            WebkitTextStroke: el.effect === 'outline' ? '1px currentColor' : undefined,
            backgroundColor: el.effect === 'highlight' ? '#fef08a' : 'transparent',
            width: el.width
              ? `${el.width}px`
              : `${Math.min(
                  (renderedDimensions.width || 595) - el.x - 20,
                  Math.max(140, (el.text.length + 3) * (el.size * 0.65))
                )}px`,
            maxWidth: `${Math.max(100, (renderedDimensions.width || 595) - el.x - 10)}px`,
            minHeight: `${el.size * 1.3}px`,
          }}
        />
      )}
    </div>
  );
};
