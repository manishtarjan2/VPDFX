import { PDFDocument, rgb } from "pdf-lib";
import { CanvasTextElement, EditorPage } from "./types";

interface ExportPdfOptions {
  file: File;
  pages: EditorPage[];
  elements: CanvasTextElement[];
  pdfPageCount: number | null;
  renderedDimensions: { width: number; height: number };
  deletedSpans: { page: number; bbox: [number, number, number, number] }[];
  backgroundPdf: string | null;
}

export async function exportPdfDocument({
  file,
  pages,
  elements,
  pdfPageCount,
  renderedDimensions,
  deletedSpans,
  backgroundPdf,
}: ExportPdfOptions): Promise<void> {
  const totalPagesCount = pages.length > 0 ? pages.length : (pdfPageCount || 1);

  // Expand recurring elements (headers / footers marked repeatAllPages) across all pages
  const expandedEdits: any[] = [];
  elements.forEach(el => {
    const displayText = el.uppercase ? el.text.toUpperCase() : el.text;
    const basePayload = {
      original_bbox: el.originalBbox,
      new_text: displayText,
      size: el.size,
      color: el.color,
      font: el.font,
      align: el.align || 'left',
      x: el.x,
      y: el.y,
      width: el.width,
      height: el.height,
      bold: el.bold,
      italic: el.italic,
      isShape: el.isShape,
      shapeType: el.shapeType,
      bgColor: el.bgColor,
      borderColor: el.borderColor,
      borderWidth: el.borderWidth,
    };

    if (el.repeatAllPages) {
      for (let p = 0; p < totalPagesCount; p++) {
        expandedEdits.push({
          ...basePayload,
          page: p,
          original_bbox: p === el.page ? el.originalBbox : undefined,
        });
      }
    } else {
      expandedEdits.push({
        ...basePayload,
        page: el.page ?? 0,
      });
    }
  });

  // Prepare pages order layout
  const pagesOrderPayload = pages.map(p => ({
    type: p.type,
    sourceIndex: p.originalPageIndex,
  }));

  try {
    // 1. Try PyMuPDF backend with page reordering/insertion and clean vector redaction
    const formData = new FormData();
    formData.append("file", file);
    formData.append("edits", JSON.stringify(expandedEdits));
    formData.append("pages_order", JSON.stringify(pagesOrderPayload));
    if (renderedDimensions.width > 0) {
      formData.append("rendered_width", renderedDimensions.width.toString());
    }
    if (renderedDimensions.height > 0) {
      formData.append("rendered_height", renderedDimensions.height.toString());
    }
    if (deletedSpans.length > 0) {
      formData.append("deleted_spans", JSON.stringify(deletedSpans));
    }

    const pythonApi = process.env.NEXT_PUBLIC_PYTHON_API_URL || (typeof window !== "undefined" ? `${window.location.protocol}//${window.location.hostname}:8000` : "http://localhost:8000");
    const res = await fetch(`${pythonApi}/api/edit-pdf`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `edited_${file.name}`;
      link.click();
      URL.revokeObjectURL(url);
      return;
    } else {
      const errText = await res.text();
      console.warn("Backend edit-pdf returned non-OK:", res.status, errText);
    }
  } catch (backendError) {
    console.warn("Python backend edit failed, attempting pdf-lib fallback:", backendError);
  }

  // Fallback to pdf-lib in browser if backend endpoint is unavailable
  try {
    let arrayBuffer: ArrayBuffer;
    if (backgroundPdf && backgroundPdf.startsWith("data:application/pdf;base64,")) {
      const base64Data = backgroundPdf.split(",")[1];
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      arrayBuffer = bytes.buffer;
    } else {
      arrayBuffer = await file.arrayBuffer();
    }

    const origPdfDoc = await PDFDocument.load(arrayBuffer);
    const newPdfDoc = await PDFDocument.create();

    // Copy or create pages according to pages order
    for (const p of pages) {
      if (p.type === "original" && p.originalPageIndex !== undefined && p.originalPageIndex < origPdfDoc.getPageCount()) {
        const [copiedPage] = await newPdfDoc.copyPages(origPdfDoc, [p.originalPageIndex]);
        newPdfDoc.addPage(copiedPage);
      } else {
        const refSize = origPdfDoc.getPageCount() > 0 ? origPdfDoc.getPage(0).getSize() : { width: 595, height: 842 };
        newPdfDoc.addPage([refSize.width, refSize.height]);
      }
    }

    // If no pages were specified, default copy all
    if (pages.length === 0) {
      const pageIndices = Array.from({ length: origPdfDoc.getPageCount() }, (_, i) => i);
      const copied = await newPdfDoc.copyPages(origPdfDoc, pageIndices);
      copied.forEach(p => newPdfDoc.addPage(p));
    }

    // If we did NOT have backgroundPdf, white-out any deleted or edited bboxes
    if (!backgroundPdf) {
      const whiteoutList = [
        ...deletedSpans,
        ...expandedEdits.filter(e => e.original_bbox).map(e => ({ page: e.page, bbox: e.original_bbox }))
      ];
      for (const item of whiteoutList) {
        const pIdx = item.page;
        if (pIdx < 0 || pIdx >= newPdfDoc.getPageCount()) continue;
        const page = newPdfDoc.getPage(pIdx);
        const { width: pWidth, height: pHeight } = page.getSize();
        const scale = renderedDimensions.width > 0 ? pWidth / renderedDimensions.width : 1;
        const [bx0, by0, bx1, by1] = item.bbox;
        page.drawRectangle({
          x: Math.max(0, (bx0 - 2) * scale),
          y: Math.max(0, pHeight - ((by1 + 2) * scale)),
          width: Math.max(4, (bx1 - bx0 + 4) * scale),
          height: Math.max(4, (by1 - by0 + 4) * scale),
          color: rgb(1, 1, 1),
        });
      }
    }

    // Apply elements to pages
    for (const el of expandedEdits) {
      const pageIndex = el.page ?? 0;
      if (pageIndex < 0 || pageIndex >= newPdfDoc.getPageCount()) continue;

      const page = newPdfDoc.getPage(pageIndex);
      const { width: pageDocWidth, height: pageDocHeight } = page.getSize();

      const scale = renderedDimensions.width > 0 ? pageDocWidth / renderedDimensions.width : 1;
      const pdfX = el.x * scale;

      let r = 0, g = 0, b = 0;
      if (el.color && el.color.startsWith("#") && el.color.length === 7) {
        r = parseInt(el.color.slice(1, 3), 16) / 255;
        g = parseInt(el.color.slice(3, 5), 16) / 255;
        b = parseInt(el.color.slice(5, 7), 16) / 255;
      }

      if (el.isShape) {
        const sW = (el.width || 120) * scale;
        const sH = (el.height || 60) * scale;
        page.drawRectangle({
          x: Math.max(0, pdfX),
          y: Math.max(0, pageDocHeight - (el.y * scale) - sH),
          width: sW,
          height: sH,
          borderColor: rgb(r, g, b),
          borderWidth: Math.max(0.5, (el.borderWidth || 1) * scale),
        });
      }

      if (el.new_text && el.new_text.trim()) {
        page.drawText(el.new_text, {
          x: Math.max(0, pdfX),
          y: Math.max(0, pageDocHeight - (el.y * scale) - (el.size * scale)),
          size: Math.max(6, el.size * scale),
          color: rgb(r, g, b),
        });
      }
    }

    const pdfBytes = await newPdfDoc.save();
    const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `edited_${file.name}`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error("Error saving PDF:", e);
    throw e;
  }
}
