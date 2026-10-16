import React from "react";
import { Download } from "lucide-react";
import { NAV_LINKS } from "../../page";

interface EditorHeaderProps {
  file: File | null;
  isProcessing: boolean;
  onSavePdf: () => void;
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  file,
  isProcessing,
  onSavePdf,
  mobileNavOpen,
  setMobileNavOpen,
}) => {
  return (
    <nav className="sticky top-0 z-[100] bg-white border-b border-gray-200 transition-shadow duration-300 shadow-xs shrink-0">
      <div className="w-full flex items-center h-14 sm:h-16 px-3 sm:px-6 gap-2 sm:gap-6 justify-between">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden w-8 h-8 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center text-sm text-gray-700 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileNavOpen ? "✕" : "☰"}
          </button>

          <a href="/" className="flex items-center gap-2 no-underline shrink-0">
            <img src="/image-copy.png" alt="VPDFX" className="h-7 sm:h-10 object-contain max-w-[110px] sm:max-w-none" />
          </a>
        </div>

        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="no-underline text-gray-600 font-semibold px-2.5 lg:px-3 py-1.5 text-[13px] lg:text-[15px] hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">{link.label}</a>
          ))}
        </div>

        <div className="flex-1" />

        {/* Export / Actions on Top Right */}
        {file ? (
          <div className="flex items-center gap-2 sm:gap-4 shrink-0 max-w-[65%] sm:max-w-[45%] justify-end">
            <span
              className="text-xs sm:text-sm font-medium text-gray-600 truncate max-w-[100px] sm:max-w-[180px] md:max-w-[260px]"
              title={file.name}
            >
              {file.name}
            </span>
            <button
              onClick={onSavePdf}
              disabled={isProcessing}
              className="flex items-center gap-1.5 sm:gap-2 bg-indigo-600 text-white hover:bg-indigo-700 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm shadow-sm transition-colors disabled:opacity-50 shrink-0 cursor-pointer"
            >
              <Download size={15} />
              <span>{isProcessing ? "Saving..." : "Export"}</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <a href="/category/pdf" className="text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700 py-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg no-underline transition-colors">PDF Tools ↗</a>
          </div>
        )}
      </div>

      {/* Mobile Navigation Drawer for Editor */}
      {mobileNavOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 shadow-lg flex flex-col gap-1 max-h-[60vh] overflow-y-auto">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">Navigation</div>
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileNavOpen(false)}
              className="text-gray-800 font-medium text-[14px] py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors no-underline flex items-center justify-between"
            >
              <span>{link.label}</span>
              <span className="text-gray-400 text-[12px]">→</span>
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};
