import React from "react";
import {
  Sparkles,
  LayoutTemplate,
  Grid,
  Type,
  Briefcase,
  Upload,
  PenTool,
  Layers,
  Settings2,
} from "lucide-react";
import { SidebarTabType } from "./types";

interface EditorSidebarNavProps {
  activeSidebarTab: SidebarTabType | null;
  setActiveSidebarTab: React.Dispatch<React.SetStateAction<SidebarTabType | null>>;
}

export const EditorSidebarNav: React.FC<EditorSidebarNavProps> = ({
  activeSidebarTab,
  setActiveSidebarTab,
}) => {
  return (
    <div className="w-[58px] md:w-[72px] h-full bg-white border-r border-gray-200 flex flex-col items-center py-2 md:py-4 gap-3 md:gap-5 z-30 shrink-0 overflow-y-auto overflow-x-hidden select-none shadow-xs scrollbar-none">
      <SidebarItem
        icon={<Sparkles size={20} strokeWidth={1.5} className="text-indigo-600 md:w-6 md:h-6" />}
        label="Create"
        active={activeSidebarTab === 'create'}
        onClick={() => setActiveSidebarTab(activeSidebarTab === 'create' ? null : 'create')}
      />
      <SidebarItem
        icon={<LayoutTemplate size={20} strokeWidth={1.5} className="md:w-6 md:h-6" />}
        label="Templates"
        active={activeSidebarTab === 'templates'}
        onClick={() => setActiveSidebarTab(activeSidebarTab === 'templates' ? null : 'templates')}
      />
      <SidebarItem
        icon={<Grid size={20} strokeWidth={1.5} className="md:w-6 md:h-6" />}
        label="Elements"
        active={activeSidebarTab === 'elements'}
        onClick={() => setActiveSidebarTab(activeSidebarTab === 'elements' ? null : 'elements')}
      />
      <SidebarItem
        icon={<Type size={20} strokeWidth={1.5} className="md:w-6 md:h-6" />}
        label="Text"
        active={activeSidebarTab === 'text'}
        onClick={() => setActiveSidebarTab(activeSidebarTab === 'text' ? null : 'text')}
      />
      <SidebarItem
        icon={<Briefcase size={20} strokeWidth={1.5} className="md:w-6 md:h-6" />}
        label="Brand"
        active={activeSidebarTab === 'brand'}
        onClick={() => setActiveSidebarTab(activeSidebarTab === 'brand' ? null : 'brand')}
      />
      <SidebarItem
        icon={<Upload size={20} strokeWidth={1.5} className="md:w-6 md:h-6" />}
        label="Uploads"
        active={activeSidebarTab === 'uploads'}
        onClick={() => setActiveSidebarTab(activeSidebarTab === 'uploads' ? null : 'uploads')}
      />
      <SidebarItem
        icon={<PenTool size={20} strokeWidth={1.5} className="md:w-6 md:h-6" />}
        label="Draw"
        active={activeSidebarTab === 'draw'}
        onClick={() => setActiveSidebarTab(activeSidebarTab === 'draw' ? null : 'draw')}
      />
      <SidebarItem
        icon={<Layers size={20} strokeWidth={1.5} className="md:w-6 md:h-6" />}
        label="Projects"
        active={activeSidebarTab === 'projects'}
        onClick={() => setActiveSidebarTab(activeSidebarTab === 'projects' ? null : 'projects')}
      />
      <SidebarItem
        icon={<Settings2 size={20} strokeWidth={1.5} className="md:w-6 md:h-6" />}
        label="Settings"
        active={activeSidebarTab === 'apps'}
        onClick={() => setActiveSidebarTab(activeSidebarTab === 'apps' ? null : 'apps')}
      />
    </div>
  );
};

function SidebarItem({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 md:gap-1 cursor-pointer w-full py-0.5 md:py-1 transition-colors ${
        active ? 'text-indigo-600 font-bold' : 'text-gray-500 hover:text-gray-800'
      }`}
    >
      <div className={`p-1.5 md:p-2 rounded-xl transition-all ${active ? 'bg-indigo-50 text-indigo-600 scale-105' : 'hover:bg-gray-100'}`}>
        {icon}
      </div>
      <span className="text-[9px] md:text-[10px] tracking-tight leading-tight">{label}</span>
    </div>
  );
}
