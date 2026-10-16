"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileBottomBar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/", icon: "🏠" },
    { label: "PDF", href: "/category/pdf", icon: "📄" },
    { label: "Canva", href: "/editor", icon: "🎨" },
    { label: "Image", href: "/category/image", icon: "🖼️" },
    { label: "Video", href: "/category/video", icon: "🎬" },
    { label: "Social", href: "/category/social", icon: "📱" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[999] bg-[var(--bg-card)]/95 backdrop-blur-xl border-t border-[var(--border)] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 safe-area-bottom">
      <div className="flex items-center justify-around max-w-[500px] mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 no-underline shrink-0 ${
                isActive
                  ? "text-[var(--accent)] font-bold bg-[var(--bg-card2)] scale-105"
                  : "text-[var(--text-secondary)] font-medium hover:text-[var(--text-primary)]"
              }`}
            >
              <span className="text-[19px] leading-tight mb-0.5">{item.icon}</span>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
