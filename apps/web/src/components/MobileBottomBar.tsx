"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  FileText, 
  Palette, 
  Image as ImageIcon, 
  Video, 
  Share2 
} from "lucide-react";

export default function MobileBottomBar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/", Icon: Home },
    { label: "PDF", href: "/category/pdf", Icon: FileText },
    { label: "Canva", href: "/editor", Icon: Palette },
    { label: "Image", href: "/category/image", Icon: ImageIcon },
    { label: "Video", href: "/category/video", Icon: Video },
    { label: "Social", href: "/category/social", Icon: Share2 },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[999] bg-[var(--bg-card)]/95 backdrop-blur-xl border-t border-[var(--border)] shadow-[0_-4px_24px_rgba(0,0,0,0.08)] px-1.5 py-1 safe-area-bottom">
      <div className="flex items-center justify-around max-w-[500px] mx-auto">
        {navItems.map(({ label, href, Icon }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={label}
              href={href}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 no-underline shrink-0 relative ${
                isActive
                  ? "text-[var(--accent)] font-bold bg-[var(--bg-card2)] shadow-xs scale-102"
                  : "text-[var(--text-secondary)] font-medium hover:text-[var(--text-primary)]"
              }`}
            >
              <Icon 
                size={20} 
                strokeWidth={isActive ? 2.3 : 1.75} 
                className={`transition-transform duration-200 ${isActive ? "scale-110" : ""}`}
              />
              <span className={`text-[10px] tracking-tight mt-1 ${isActive ? "font-bold text-[var(--accent)]" : "font-medium"}`}>
                {label}
              </span>
              {isActive && (
                <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-[var(--accent)]" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
