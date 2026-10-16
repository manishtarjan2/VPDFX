"use client";
import React, { useState } from "react";
import { X } from "lucide-react";
import { CanvasTextElement } from "./types";

interface TemplatesPanelProps {
  onClose: () => void;
  renderedDimensions: { width: number; height: number };
  setElements: React.Dispatch<React.SetStateAction<CanvasTextElement[]>>;
}

export default function TemplatesPanel({
  onClose,
  renderedDimensions,
  setElements,
}: TemplatesPanelProps) {
  const [templateCategory, setTemplateCategory] = useState<string>("All");

  const templates = [
    {
      title: "Professional Invoice",
      tag: "Finance",
      tagColor: "bg-emerald-100 text-emerald-800",
      desc: "Complete billing header, invoice #, client details, itemized table, total & footer",
      badge: "💰 Popular",
      action: () => {
        const baseId = Date.now();
        const pageWidth = renderedDimensions.width || 595;
        const pageHeight = renderedDimensions.height || 842;
        setElements(prev => [
          ...prev,
          {
            id: `inv_header_${baseId}`,
            text: "INVOICE",
            x: 50,
            y: 50,
            size: 28,
            font: "Helvetica",
            color: "#0f172a",
            bold: true,
            page: 0,
          },
          {
            id: `inv_meta_${baseId}`,
            text: "Invoice #: INV-2026-001\nDate: " + new Date().toLocaleDateString() + "\nDue: In 14 Days",
            x: pageWidth - 190,
            y: 50,
            size: 11,
            font: "Helvetica",
            color: "#64748b",
            page: 0,
          },
          {
            id: `inv_billto_${baseId}`,
            text: "BILLED TO:\nAcme Corporation\n123 Business Way, Suite 400\nclient@company.com",
            x: 50,
            y: 120,
            size: 11,
            font: "Helvetica",
            color: "#334155",
            bold: false,
            page: 0,
          },
          {
            id: `inv_line1_${baseId}`,
            text: "",
            x: 50,
            y: 185,
            size: 14,
            font: "Helvetica",
            color: "#cbd5e1",
            page: 0,
            isShape: true,
            shapeType: 'line',
            borderColor: "#cbd5e1",
            borderWidth: 1.5,
            width: pageWidth - 100,
            height: 2,
          },
          {
            id: `inv_table_hdr_${baseId}`,
            text: "Description                                         Qty     Rate         Amount\nProfessional Design Consultation       1       $1,200.00    $1,200.00\nSystem Implementation & Deploy        1       $2,450.00    $2,450.00",
            x: 50,
            y: 200,
            size: 11,
            font: "Courier New",
            color: "#1e293b",
            page: 0,
          },
          {
            id: `inv_total_${baseId}`,
            text: "SUBTOTAL:   $3,650.00\nTAX (8%):      $292.00\nTOTAL DUE:  $3,942.00",
            x: pageWidth - 200,
            y: 280,
            size: 12,
            font: "Courier New",
            color: "#0f172a",
            bold: true,
            page: 0,
          },
          {
            id: `inv_foot_${baseId}`,
            text: "Thank you for your business! Payment instructions: ACH / Wire transfer.",
            x: 50,
            y: Math.max(700, pageHeight - 60),
            size: 10,
            font: "Helvetica",
            color: "#94a3b8",
            page: 0,
            repeatAllPages: true,
          }
        ]);
      }
    },
    {
      title: "Legal Non-Disclosure Agreement",
      tag: "Legal",
      tagColor: "bg-blue-100 text-blue-800",
      desc: "Binding NDA terms, mutual disclosures clause, confidentiality & dual signature",
      badge: "⚖️ Standard",
      action: () => {
        const baseId = Date.now();
        const pageWidth = renderedDimensions.width || 595;
        const pageHeight = renderedDimensions.height || 842;
        setElements(prev => [
          ...prev,
          {
            id: `nda_title_${baseId}`,
            text: "NON-DISCLOSURE AGREEMENT",
            x: 50,
            y: 60,
            size: 20,
            font: "Times New Roman",
            color: "#0f172a",
            bold: true,
            page: 0,
          },
          {
            id: `nda_sub_${baseId}`,
            text: "This Mutual Confidentiality and Non-Disclosure Agreement is entered into as of " + new Date().toLocaleDateString() + ", by and between the Disclosing Party and Receiving Party.",
            x: 50,
            y: 105,
            size: 11,
            font: "Times New Roman",
            color: "#334155",
            page: 0,
          },
          {
            id: `nda_body_${baseId}`,
            text: "1. Confidential Information: Both parties agree to safeguard proprietary secrets, trade materials, software specifications, and customer databases.\n2. Term: This commitment remains strictly binding for a duration of two (2) calendar years from date of execution.",
            x: 50,
            y: 155,
            size: 10.5,
            font: "Times New Roman",
            color: "#334155",
            page: 0,
          },
          {
            id: `nda_sig1_${baseId}`,
            text: "_____________________________\nDisclosing Party Signature\nDate: _______________________",
            x: 50,
            y: Math.max(620, pageHeight - 140),
            size: 10,
            font: "Times New Roman",
            color: "#1e293b",
            page: 0,
          },
          {
            id: `nda_sig2_${baseId}`,
            text: "_____________________________\nReceiving Party Signature\nDate: _______________________",
            x: pageWidth - 230,
            y: Math.max(620, pageHeight - 140),
            size: 10,
            font: "Times New Roman",
            color: "#1e293b",
            page: 0,
          }
        ]);
      }
    },
    {
      title: "Certificate of Achievement",
      tag: "Awards",
      tagColor: "bg-amber-100 text-amber-800",
      desc: "Gold perimeter border, ornate completion ribbon, recipient name & certification seal",
      badge: "🏆 Verified",
      action: () => {
        const baseId = Date.now();
        const pageWidth = renderedDimensions.width || 595;
        const pageHeight = renderedDimensions.height || 842;
        setElements(prev => [
          ...prev,
          {
            id: `cert_border_${baseId}`,
            text: "",
            x: 25,
            y: 25,
            size: 14,
            font: "Helvetica",
            color: "#d97706",
            page: 0,
            isShape: true,
            shapeType: 'pageBorder',
            borderColor: "#d97706",
            borderWidth: 3,
            borderStyle: 'solid',
            width: pageWidth - 50,
            height: pageHeight - 50,
          },
          {
            id: `cert_head_${baseId}`,
            text: "CERTIFICATE OF EXCELLENCE",
            x: 70,
            y: 100,
            size: 24,
            font: "Times New Roman",
            color: "#b45309",
            bold: true,
            page: 0,
          },
          {
            id: `cert_presents_${baseId}`,
            text: "This certificate is proudly awarded to",
            x: 70,
            y: 145,
            size: 12,
            font: "Georgia",
            color: "#6b7280",
            page: 0,
          },
          {
            id: `cert_name_${baseId}`,
            text: "RECIPIENT FULL NAME",
            x: 70,
            y: 180,
            size: 26,
            font: "Georgia",
            color: "#1e293b",
            bold: true,
            underline: true,
            page: 0,
          },
          {
            id: `cert_desc_${baseId}`,
            text: "For outstanding professional accomplishment, dedicated excellence, and verified mastery in completing all required curriculum standards.",
            x: 70,
            y: 235,
            size: 11,
            font: "Georgia",
            color: "#475569",
            page: 0,
          },
          {
            id: `cert_seal_${baseId}`,
            text: "★ VERIFIED ★\nEXCELLENCE",
            x: pageWidth - 180,
            y: Math.max(580, pageHeight - 160),
            size: 14,
            font: "Helvetica",
            color: "#b45309",
            bold: true,
            page: 0,
            isShape: true,
            shapeType: 'circle',
            bgColor: "rgba(251, 191, 36, 0.15)",
            borderColor: "#b45309",
            borderWidth: 2,
            width: 100,
            height: 100,
          }
        ]);
      }
    },
    {
      title: "Executive Business Summary",
      tag: "Business",
      tagColor: "bg-purple-100 text-purple-800",
      desc: "Quarterly review layout with KPI callout boxes, milestone checklist & key findings",
      badge: "📊 Corporate",
      action: () => {
        const baseId = Date.now();
        setElements(prev => [
          ...prev,
          {
            id: `rep_title_${baseId}`,
            text: "Q3 STRATEGIC PERFORMANCE REPORT",
            x: 50,
            y: 50,
            size: 22,
            font: "Helvetica",
            color: "#1e1b4b",
            bold: true,
            page: 0,
          },
          {
            id: `rep_kpi1_${baseId}`,
            text: "📈 +38% YoY\nRevenue Growth",
            x: 50,
            y: 100,
            size: 13,
            font: "Helvetica",
            color: "#4338ca",
            bold: true,
            page: 0,
            isShape: true,
            shapeType: 'roundedRect',
            bgColor: "rgba(99, 102, 241, 0.08)",
            borderColor: "#6366f1",
            borderWidth: 1.5,
            width: 140,
            height: 55,
          },
          {
            id: `rep_kpi2_${baseId}`,
            text: "🎯 99.4%\nSLA Compliance",
            x: 210,
            y: 100,
            size: 13,
            font: "Helvetica",
            color: "#059669",
            bold: true,
            page: 0,
            isShape: true,
            shapeType: 'roundedRect',
            bgColor: "rgba(16, 185, 129, 0.08)",
            borderColor: "#10b981",
            borderWidth: 1.5,
            width: 140,
            height: 55,
          },
          {
            id: `rep_exec_${baseId}`,
            text: "Executive Summary:\nOur core operations demonstrated exceptional resilience throughout Q3. Customer acquisition efficiency expanded across international enterprise segments.",
            x: 50,
            y: 180,
            size: 11,
            font: "Helvetica",
            color: "#334155",
            page: 0,
          }
        ]);
      }
    },
    {
      title: "Offer Letter & Employment",
      tag: "HR",
      tagColor: "bg-indigo-100 text-indigo-800",
      desc: "Formal job offer with compensation package, start date, benefits & candidate acceptance",
      badge: "💼 Hiring",
      action: () => {
        const baseId = Date.now();
        setElements(prev => [
          ...prev,
          {
            id: `offer_title_${baseId}`,
            text: "EMPLOYMENT OFFER LETTER",
            x: 50,
            y: 60,
            size: 20,
            font: "Helvetica",
            color: "#0f172a",
            bold: true,
            page: 0,
          },
          {
            id: `offer_body_${baseId}`,
            text: "Dear Candidate,\n\nWe are pleased to offer you the full-time position of Senior Software Engineer. We were deeply impressed by your experience and know you will be a vital addition to our engineering team.",
            x: 50,
            y: 105,
            size: 11,
            font: "Helvetica",
            color: "#334155",
            page: 0,
          },
          {
            id: `offer_terms_${baseId}`,
            text: "• Base Salary: Competitive Annual Compensation\n• Benefits: Comprehensive Health, Vision, Dental & 401(k)\n• Start Date: Next Business Quarter",
            x: 50,
            y: 185,
            size: 11,
            font: "Helvetica",
            color: "#1e293b",
            page: 0,
          }
        ]);
      }
    }
  ];

  return (
    <div className="fixed sm:static bottom-0 sm:bottom-auto inset-x-0 sm:inset-x-auto max-h-[75vh] sm:max-h-none w-full sm:w-[300px] h-auto sm:h-full bg-white border-t sm:border-t-0 sm:border-r border-gray-200 rounded-t-3xl sm:rounded-none p-5 flex flex-col gap-4 z-50 sm:z-20 shrink-0 overflow-y-auto animate-in slide-in-from-bottom-8 sm:slide-in-from-left-4 duration-200 shadow-2xl sm:shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-800 text-lg">Templates</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-md"
        >
          <X size={18} />
        </button>
      </div>
      <p className="text-xs text-gray-500">
        Apply ready-to-use document layout presets to customize your PDF instantly.
      </p>

      {/* Category filter pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-none text-[11px] font-semibold text-gray-600 shrink-0">
        {["All", "Finance", "Legal", "Business", "Awards", "HR"].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setTemplateCategory(cat)}
            className={`px-3 py-1 rounded-full cursor-pointer transition-all shrink-0 ${
              templateCategory === cat
                ? "bg-indigo-600 text-white shadow-2xs font-bold"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {cat === "Awards" ? "Certificates" : cat}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {templates
          .filter(tpl => templateCategory === "All" || tpl.tag === templateCategory)
          .map((tpl, i) => (
            <div
              key={i}
              onClick={tpl.action}
              className="p-3.5 border border-gray-200 hover:border-indigo-500 bg-white hover:bg-indigo-50/30 rounded-xl cursor-pointer transition-all shadow-2xs hover:shadow-xs group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-gray-900 group-hover:text-indigo-600">{tpl.title}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tpl.tagColor}`}>{tpl.tag}</span>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed mb-2">{tpl.desc}</p>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[10px]">
                <span className="font-medium text-gray-400">{tpl.badge}</span>
                <span className="text-indigo-600 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-1 shrink-0 whitespace-nowrap">
                  <span>Apply Layout</span>
                  <span>→</span>
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
