export interface CanvasTextElement {
  id: string;
  text: string;
  x: number;
  y: number;
  size: number;
  font: string;
  color: string;
  page: number;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  uppercase?: boolean;
  letterSpacing?: number;
  lineHeight?: number;
  opacity?: number;
  align?: 'left' | 'center' | 'right';
  effect?: 'none' | 'shadow' | 'outline' | 'neon' | 'highlight';
  animation?: 'none' | 'fade' | 'bounce' | 'pulse';
  originalBbox?: [number, number, number, number];
  originalText?: string;
  isPdfParsed?: boolean;
  isHeader?: boolean;
  isFooter?: boolean;
  repeatAllPages?: boolean;
  locked?: boolean;
  isShape?: boolean;
  shapeType?: 'rect' | 'circle' | 'line' | 'arrow' | 'star' | 'badge' | 'pageBorder' | 'footerLine' | 'headerLine' | 'roundedRect' | 'triangle' | 'callout';
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double';
  bgColor?: string;
  borderColor?: string;
  borderWidth?: number;
  width?: number;
  height?: number;
  imageUrl?: string;
  groupId?: string;
}

export interface EditorPage {
  id: string;
  type: "original" | "blank";
  originalPageIndex?: number;
  bgColor?: string;
}

export type SidebarTabType = "create" | "templates" | "elements" | "text" | "brand" | "uploads" | "draw" | "projects" | "apps";

export const FONT_OPTIONS = [
  "Helvetica",
  "Arial",
  "Times New Roman",
  "Courier New",
  "Georgia",
  "Verdana",
  "Impact",
  "Trebuchet MS",
  "Comic Sans MS"
];
