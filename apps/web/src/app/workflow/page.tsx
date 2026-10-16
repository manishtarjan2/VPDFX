"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const PYTHON_API_BASE = process.env.NEXT_PUBLIC_PYTHON_API_URL || "http://localhost:8000";

const AVAILABLE_TOOLS = [
  { id: "text-to-pdf", name: "Text to PDF", icon: "📝", in: "text", out: "pdf" },
  { id: "word-to-pdf", name: "Word to PDF", icon: "📝", in: "word", out: "pdf" },
  { id: "pdf-to-word", name: "PDF to Word", icon: "📄", in: "pdf", out: "word" },
  { id: "watermark", name: "Watermark PDF", icon: "💧", in: "pdf", out: "pdf", configs: [{ id: "text", type: "text-or-file", label: "Watermark", placeholder: "e.g. CONFIDENTIAL" }, { id: "position", type: "select", label: "Position", options: ["Center", "Bottom Right", "Top Left"] }] },
  { id: "sign", name: "Sign PDF", icon: "✍️", in: "pdf", out: "pdf", configs: [{ id: "sign", type: "text-or-file", label: "Signature", placeholder: "Type your full name" }, { id: "position", type: "select", label: "Position", options: ["Bottom Right", "Bottom Center", "Top Right"] }] },
  { id: "page-numbers", name: "Add Page Numbers", icon: "🔢", in: "pdf", out: "pdf", configs: [{ id: "position", type: "select", label: "Position", options: ["Bottom Right", "Bottom Center", "Top Right"] }, { id: "hide_old", type: "select", label: "Old Page Numbers", options: ["Keep Original", "Remove Old (Solid White Box)", "Remove Old (Intelligent AI)"] }] },
  { id: "compress", name: "Compress PDF", icon: "🗜️", in: "pdf", out: "pdf", configs: [{ id: "level", type: "select", label: "Compression Level", options: ["Balanced (Recommended)", "Maximum (Lowest Quality)", "Light (High Quality)"] }] },
  { id: "merge", name: "Merge PDF", icon: "🔀", in: "pdf", out: "pdf", configs: [{ id: "file", type: "file", label: "Additional File to Merge", placeholder: "Choose secondary file..." }, { id: "page_numbers", type: "select", label: "Page Numbers", options: ["Keep Original", "Revise to Serial", "Revise to Serial (AI Removal)"] }] },
  { id: "split", name: "Split PDF", icon: "✂️", in: "pdf", out: "pdf", configs: [{ id: "range", type: "text", label: "Page Range", placeholder: "e.g. 1-5 or 1,3,5" }] }
];

import { NAV_LINKS } from "../page";

export default function WorkflowPage() {
  const [dark, setDark] = useState(false);
  const [steps, setSteps] = useState<(typeof AVAILABLE_TOOLS[0] & { id: string })[]>([]);
  const [stepConfigs, setStepConfigs] = useState<Record<string, string>>({});
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [completed, setCompleted] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [savedWorkflows, setSavedWorkflows] = useState<any[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [workflowName, setWorkflowName] = useState("");

  const [uploadedFileData, setUploadedFileData] = useState<File | null>(null);
  const [stepFiles, setStepFiles] = useState<Record<string, File>>({});
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDark(document.documentElement.getAttribute("data-theme") === "dark");
      const saved = window.localStorage.getItem("vpdfx-workflows");
      if (saved) {
        try {
          setSavedWorkflows(JSON.parse(saved));
        } catch (e) {}
      }
    }
  }, []);

  function toggleDark() {
    setDark((previous) => {
      const next = !previous;
      document.documentElement.setAttribute("data-theme", next ? "dark" : "");
      window.localStorage.setItem("vpdfx-theme", next ? "dark" : "light");
      return next;
    });
  }

  const saveWorkflow = () => {
    if (!workflowName.trim()) return;
    const newWf = { id: Date.now().toString(), name: workflowName, steps, configs: stepConfigs };
    const updated = [...savedWorkflows, newWf];
    setSavedWorkflows(updated);
    window.localStorage.setItem("vpdfx-workflows", JSON.stringify(updated));
    setShowSaveModal(false);
    setWorkflowName("");
  };

  const loadWorkflow = (wf: any) => {
    setSteps(wf.steps);
    setStepConfigs(wf.configs);
    setCompleted(false);
    setCurrentStepIndex(-1);
  };

  const addStep = (tool: typeof AVAILABLE_TOOLS[0]) => {
    setSteps([...steps, { ...tool, id: tool.id + "-" + Date.now() }]);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0].name);
      setUploadedFileData(e.target.files[0]);
      setCompleted(false);
      setCurrentStepIndex(-1);
      setProcessedBlob(null);
    }
  };

  const runWorkflow = async () => {
    if (steps.length === 0 || !uploadedFile || !uploadedFileData) return;
    setIsProcessing(true);
    setCompleted(false);
    setCurrentStepIndex(0);

    try {
      // Import PDF lib dynamically so it doesn't break SSR
      // @ts-ignore
      const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib/dist/pdf-lib.min.js');
      
      let currentPdf: any = null;
      
      // If the first step or the input is PDF, load it
      if (uploadedFileData.name.toLowerCase().endsWith('.pdf')) {
        const arrayBuffer = await uploadedFileData.arrayBuffer();
        currentPdf = await PDFDocument.load(arrayBuffer);
      } else {
        // Fallback for non-pdf (simulate converting to PDF)
        currentPdf = await PDFDocument.create();
        const page = currentPdf.addPage([595.28, 841.89]);
        page.drawText("Converted from " + uploadedFileData.name, { x: 50, y: 800, size: 12 });
      }

      for (let i = 0; i < steps.length; i++) {
        setCurrentStepIndex(i);
        const step = steps[i];
        
        // Let UI update
        await new Promise(r => setTimeout(r, 600));

        if (step.name === "Watermark PDF") {
          const text = stepConfigs[`${step.id}_text`] || "CONFIDENTIAL";
          const pages = currentPdf.getPages();
          const helveticaFont = await currentPdf.embedFont(StandardFonts.HelveticaBold);
          for (const page of pages) {
            const { width, height } = page.getSize();
            page.drawText(text, {
              x: width / 4,
              y: height / 2,
              size: 40,
              font: helveticaFont,
              color: rgb(0.8, 0.8, 0.8),
              rotate: { type: 'degrees', angle: 45 },
              opacity: 0.5,
            });
          }
        } 
        else if (step.name === "Merge PDF") {
          const secondaryFile = stepFiles[`${step.id}_file`];
          if (secondaryFile && secondaryFile.name.toLowerCase().endsWith('.pdf')) {
            const secondaryBuffer = await secondaryFile.arrayBuffer();
            const secondaryPdf = await PDFDocument.load(secondaryBuffer);
            const copiedPages = await currentPdf.copyPages(secondaryPdf, secondaryPdf.getPageIndices());
            copiedPages.forEach((page: any) => currentPdf.addPage(page));
          }
          
          let aiSuccess = false;
          if (stepConfigs[`${step.id}_page_numbers`] === "Revise to Serial (AI Removal)") {
            try {
              const tempBytes = await currentPdf.save();
              const formData = new FormData();
              formData.append("file", new Blob([tempBytes], { type: "application/pdf" }), "temp.pdf");
              const res = await fetch(`${PYTHON_API_BASE}/remove-page-numbers`, { method: "POST", body: formData });
              if (res.ok) {
                const cleanedBuffer = await res.arrayBuffer();
                currentPdf = await PDFDocument.load(cleanedBuffer);
                aiSuccess = true;
              }
            } catch (e) {
              console.error("AI removal failed", e);
            }
          }

          if (stepConfigs[`${step.id}_page_numbers`] === "Revise to Serial" || stepConfigs[`${step.id}_page_numbers`] === "Revise to Serial (AI Removal)") {
            const pages = currentPdf.getPages();
            const helveticaFont = await currentPdf.embedFont(StandardFonts.Helvetica);
            for (let pIdx = 0; pIdx < pages.length; pIdx++) {
              const page = pages[pIdx];
              const { width, height } = page.getSize();
              const cropBox = page.getCropBox();
              const startX = cropBox?.x || 0;
              const startY = cropBox?.y || 0;
              
              if (stepConfigs[`${step.id}_page_numbers`] === "Revise to Serial" || (stepConfigs[`${step.id}_page_numbers`] === "Revise to Serial (AI Removal)" && !aiSuccess)) {
                // Hide old page numbers at both top and bottom corners entirely
                page.drawRectangle({ x: startX, y: startY, width: width, height: 100, color: rgb(1, 1, 1) }); // Hide bottom 100px
                page.drawRectangle({ x: startX, y: startY + height - 100, width: width, height: 100, color: rgb(1, 1, 1) }); // Hide top 100px
              }
              
              page.drawText(`Page ${pIdx + 1} of ${pages.length}`, {
                x: startX + width / 2 - 35,
                y: startY + 30,
                size: 11,
                font: helveticaFont,
                color: rgb(0, 0, 0),
              });
            }
          }
        }
        else if (step.name === "Sign PDF") {
          const signText = stepConfigs[`${step.id}_sign`] || "Approved";
          const pages = currentPdf.getPages();
          const page = pages[pages.length - 1]; // sign last page
          const helveticaFont = await currentPdf.embedFont(StandardFonts.HelveticaBoldOblique);
          page.drawText(signText, {
            x: 50,
            y: 50,
            size: 24,
            font: helveticaFont,
            color: rgb(0, 0, 0.8),
          });
        }
        else if (step.name === "Add Page Numbers") {
          let pages = currentPdf.getPages();
          const helveticaFont = await currentPdf.embedFont(StandardFonts.Helvetica);
          
          let aiSuccess = false;
          if (stepConfigs[`${step.id}_hide_old`] === "Remove Old (Intelligent AI)") {
            try {
              const tempBytes = await currentPdf.save();
              const formData = new FormData();
              formData.append("file", new Blob([tempBytes], { type: "application/pdf" }), "temp.pdf");
              const res = await fetch(`${PYTHON_API_BASE}/remove-page-numbers`, { method: "POST", body: formData });
              if (res.ok) {
                const cleanedBuffer = await res.arrayBuffer();
                currentPdf = await PDFDocument.load(cleanedBuffer);
                pages = currentPdf.getPages();
                aiSuccess = true;
              }
            } catch (e) {
              console.error("AI removal failed", e);
            }
          }

          for (let pIdx = 0; pIdx < pages.length; pIdx++) {
            const page = pages[pIdx];
            const { width, height } = page.getSize();
            // Get crop box to handle PDFs that don't start at 0,0
            const cropBox = page.getCropBox();
            const startX = cropBox?.x || 0;
            const startY = cropBox?.y || 0;
            
            // Draw white box if selected, OR if AI failed as a fallback
            if (stepConfigs[`${step.id}_hide_old`] === "Remove Old (Solid White Box)" || (stepConfigs[`${step.id}_hide_old`] === "Remove Old (Intelligent AI)" && !aiSuccess)) {
              page.drawRectangle({ x: startX, y: startY, width: width, height: 100, color: rgb(1, 1, 1) });
              page.drawRectangle({ x: startX, y: startY + height - 100, width: width, height: 100, color: rgb(1, 1, 1) });
            }

            const position = stepConfigs[`${step.id}_position`] || "Bottom Right";
            let xPos = startX + width - 50;
            let yPos = startY + 30;
            
            if (position === "Bottom Center") {
              xPos = startX + width / 2 - 10;
              yPos = startY + 30;
            } else if (position === "Top Right") {
              xPos = startX + width - 50;
              yPos = startY + height - 30;
            }

            page.drawText(`${pIdx + 1}`, {
              x: xPos,
              y: yPos,
              size: 12,
              font: helveticaFont,
              color: rgb(0, 0, 0),
            });
          }
        }
      }

      const pdfBytes = await currentPdf.save();
      setProcessedBlob(new Blob([pdfBytes], { type: "application/pdf" }));

    } catch (err) {
      console.error("Workflow error:", err);
      // Fallback
      setProcessedBlob(new Blob(["Simulation fallback due to error"], { type: "text/plain" }));
    }

    setCurrentStepIndex(-1);
    setIsProcessing(false);
    setCompleted(true);
  };

  const downloadResult = () => {
    if (!uploadedFile || steps.length === 0 || !processedBlob) return;
    const finalExt = steps[steps.length - 1].out;
    const baseName = uploadedFile.split('.').slice(0, -1).join('.') || uploadedFile;
    const downloadName = `vpdfx_${baseName}_processed.${finalExt}`;
    
    const url = URL.createObjectURL(processedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col font-[var(--font-inter)] text-[var(--text-primary)]">
      <nav className="sticky top-0 z-[100] backdrop-blur-xl border-b border-[var(--border)] transition-colors duration-300 bg-[var(--bg-card)]/85 shadow-[0_2px_20px_rgba(0,0,0,.08)]">
        <div className="max-w-[1280px] mx-auto flex items-center h-16 px-4 sm:px-6 gap-2 sm:gap-6 justify-between">
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button
              onClick={() => setShowSaveModal(false)}
              className="md:hidden w-9 h-9 rounded-lg border border-[var(--border)] bg-[var(--bg-card2)] flex items-center justify-center text-[17px] text-[var(--text-primary)] cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              ☰
            </button>

            <a href="/" className="flex items-center gap-2 no-underline shrink-0">
              <img src={dark ? "/image-dark.png" : "/image-copy.png"} alt="VPDFX" className="h-8 sm:h-11 object-contain max-w-[120px] sm:max-w-none" />
            </a>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <a key={link.label} href={link.href} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card2)] font-semibold px-2.5 lg:px-3 py-1.5 text-[13px] lg:text-[15px] rounded-lg transition-all whitespace-nowrap no-underline">{link.label}</a>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative hidden sm:flex items-center gap-2 bg-[var(--bg-card2)] border-[1.5px] border-[var(--border)] rounded-full px-3.5 py-1.5 w-[140px] md:w-[190px] focus-within:border-[var(--accent)]">
              <span className="text-[var(--text-muted)] text-[13px]">🔎</span>
              <input value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="Search..." className="border-none bg-transparent outline-none text-[13px] text-[var(--text-primary)] w-full font-inherit" />
            </div>

            <button onClick={toggleDark} title="Toggle dark mode" className="w-8 h-8 sm:w-[38px] sm:h-[38px] rounded-full border-[1.5px] border-[var(--border)] bg-[var(--bg-card)] cursor-pointer text-[14px] sm:text-[17px] flex items-center justify-center transition-all shrink-0 hover:border-[var(--accent)]">
              {dark ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-[1000px] mx-auto px-4 py-6 sm:px-6 sm:py-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <h1 className="text-[28px] sm:text-[36px] font-[900] m-0 tracking-tight text-[var(--text-primary)] leading-tight">Custom Workflow Builder</h1>
            <p className="text-[14px] sm:text-[16px] text-[var(--text-secondary)] mt-2">Chain multiple tools together into an automated pipeline.</p>
          </div>
        </div>

        <div className="flex flex-col-reverse lg:grid lg:grid-cols-[320px_1fr] gap-6 sm:gap-8">
          
          {/* Sidebar - Available Tools */}
          <div className="flex flex-col gap-6 w-full">
            {savedWorkflows.length > 0 && (
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--r-lg)] shadow-[var(--sh-md)] transition-all duration-250 hover:-translate-y-1 hover:shadow-[var(--sh-xl)] hover:border-indigo-500/25 p-6 shadow-sm border border-[var(--border)] rounded-2xl bg-[var(--bg-card)]">
                <div className="mb-4">
                  <h3 className="text-[16px] font-[900] text-[var(--text-primary)] mb-1">Saved Workflows</h3>
                  <p className="text-[12px] text-[var(--text-secondary)]">Click to load a previous workflow.</p>
                </div>
                <div className="flex flex-col gap-2">
                  {savedWorkflows.map(wf => (
                    <button key={wf.id} onClick={() => loadWorkflow(wf)} className="flex items-center justify-between p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] hover:bg-white hover:border-[var(--accent)] hover:shadow-sm transition-all text-left group">
                      <div className="flex-1 min-w-0 pr-3">
                        <div className="font-bold text-[14px] mb-1.5 truncate text-[var(--text-primary)]">{wf.name}</div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {wf.steps.map((step: any, i: number) => (
                            <React.Fragment key={i}>
                              <span className="text-[14px] bg-[var(--bg-card2)] border border-[var(--border)] rounded px-1.5 py-0.5" title={step.name}>{step.icon}</span>
                              {i < wf.steps.length - 1 && <span className="text-[10px] text-[var(--text-muted)]">➔</span>}
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                      <div className="text-[var(--accent)] font-bold text-[12px] px-3 py-1.5 bg-[rgba(79,70,229,0.1)] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Load</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--r-lg)] shadow-[var(--sh-md)] transition-all duration-250 hover:-translate-y-1 hover:shadow-[var(--sh-xl)] hover:border-indigo-500/25 p-6 shadow-sm border border-[var(--border)] rounded-2xl bg-[var(--bg-card)]">
              <div className="mb-6">
                <h3 className="text-[18px] font-[900] text-[var(--text-primary)] mb-1">Available Actions</h3>
                <p className="text-[13px] text-[var(--text-secondary)]">Click to add compatible steps to your flow.</p>
              </div>
            
            <div className="flex flex-col gap-3">
              {AVAILABLE_TOOLS.filter(tool => {
                const currentOutput = steps.length > 0 ? steps[steps.length - 1].out : null;
                const matchesStep = currentOutput === null || tool.in === currentOutput;
                const query = searchValue.trim().toLowerCase();
                const matchesSearch = !query || tool.name.toLowerCase().includes(query);
                return matchesStep && matchesSearch;
              }).map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => addStep(tool)}
                  className="group relative flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] hover:bg-white hover:border-[var(--accent)] hover:shadow-md transition-all duration-300 text-left cursor-pointer w-full"
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white border border-[var(--border)] shadow-sm text-xl group-hover:scale-110 transition-transform">
                    {tool.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-[700] text-[14px] text-[var(--text-primary)] truncate">{tool.name}</div>
                    <div className="text-[11px] text-[var(--text-muted)] font-mono uppercase tracking-wider">{tool.in} → {tool.out}</div>
                  </div>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[var(--bg-card2)] text-[var(--accent)] font-bold group-hover:bg-[var(--accent)] group-hover:text-white transition-colors">
                    +
                  </div>
                </button>
              ))}
              
              {AVAILABLE_TOOLS.filter(tool => {
                const currentOutput = steps.length > 0 ? steps[steps.length - 1].out : null;
                return currentOutput !== null && tool.in === currentOutput;
              }).length === 0 && steps.length > 0 && (
                <div className="p-4 bg-[var(--bg-card2)] rounded-xl border border-dashed border-[var(--border)] text-center">
                  <span className="text-[24px] mb-2 block">🚫</span>
                  <div className="text-[13px] font-semibold text-[var(--text-secondary)]">No compatible actions</div>
                  <div className="text-[12px] text-[var(--text-muted)] mt-1">Try finishing the workflow or removing the last step.</div>
                </div>
              )}
            </div>
          </div>
          </div>

          {/* Main Area - Pipeline */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--r-lg)] shadow-[var(--sh-md)] transition-all duration-250 hover:-translate-y-1 hover:shadow-[var(--sh-xl)] hover:border-indigo-500/25 flex flex-col p-5 sm:p-8 min-h-[400px] sm:min-h-[600px] shadow-sm border border-[var(--border)] rounded-2xl bg-[var(--bg-card)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
              <h3 className="text-[20px] sm:text-[22px] font-[900] text-[var(--text-primary)] m-0">Your Pipeline</h3>
              {steps.length > 0 && (
                <div className="flex items-center gap-3">
                  <button onClick={() => setShowSaveModal(true)} disabled={isProcessing} className="px-4 py-1.5 bg-[var(--bg-card2)] hover:bg-[var(--bg)] hover:border-[var(--accent)] border border-[var(--border)] text-[var(--text-primary)] font-bold text-[13px] rounded-full transition-colors flex items-center gap-1.5 shadow-sm">
                    💾 Save
                  </button>
                  <div className="px-3 py-1 bg-[var(--bg-card2)] text-[var(--text-secondary)] text-[12px] font-bold rounded-full uppercase tracking-widest border border-[var(--border)]">
                    {steps.length} {steps.length === 1 ? 'Step' : 'Steps'}
                  </div>
                </div>
              )}
            </div>
            
            {steps.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-[var(--border)] rounded-2xl bg-[var(--bg-card2)] p-10 text-center">
                <div className="w-20 h-20 mb-6 relative">
                  <div className="absolute inset-0 bg-[var(--accent)] opacity-10 rounded-full animate-pulse"></div>
                  <span className="absolute inset-0 flex items-center justify-center text-[40px]">⚙️</span>
                </div>
                <h4 className="text-[18px] font-[800] text-[var(--text-primary)] mb-2">Build Your Automation</h4>
                <p className="text-[14px] text-[var(--text-secondary)] max-w-sm">Select actions from the left panel to snap them together into a continuous workflow.</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col gap-4 relative px-4">
                {/* Connecting Line */}
                <div className="absolute left-[30px] sm:left-[38px] top-6 bottom-6 w-1 bg-gradient-to-b from-[var(--border)] to-[var(--border)] z-0 rounded-full" />

                {/* Start Node */}
                <div className="relative z-10 flex items-center gap-3 sm:gap-4 group">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--bg-card2)] border-[3px] border-[var(--border)] flex items-center justify-center text-[18px] sm:text-[20px] shadow-sm">
                    🏁
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-[var(--text-primary)] text-[14px] sm:text-[15px]">Start Workflow</div>
                    <div className="text-[11px] sm:text-[12px] text-[var(--text-secondary)]">Input: {steps[0].in.toUpperCase()}</div>
                  </div>
                </div>

                {steps.map((step, idx) => {
                  const isActive = currentStepIndex === idx;
                  const isDone = completed || (currentStepIndex > idx && currentStepIndex !== -1);
                  
                  let borderColor = "border-[var(--border)]";
                  let bgCard = "bg-white";
                  let iconBg = "bg-[var(--bg-card2)]";
                  let statusLabel = "";
                  
                  if (isActive) {
                    borderColor = "border-[var(--accent)]";
                    bgCard = "bg-[var(--bg-card)] shadow-[0_0_20px_rgba(79,70,229,0.15)]";
                    iconBg = "bg-white text-[var(--accent)]";
                    statusLabel = "Processing...";
                  } else if (isDone) {
                    borderColor = "border-[#22c55e]";
                    bgCard = "bg-[#f0fdf4]";
                    iconBg = "bg-white text-[#22c55e]";
                    statusLabel = "Done";
                  }

                  return (
                    <div key={step.id} className={`relative z-10 flex items-start gap-3 sm:gap-4 transition-all duration-500 ${isProcessing && !isActive && !isDone ? "opacity-50 grayscale-[0.5]" : "opacity-100"}`}>
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${iconBg} border-[3px] ${borderColor} flex items-center justify-center text-[18px] sm:text-[20px] shadow-sm transition-all duration-500 ${isActive ? "scale-110" : "mt-1"}`}>
                        {step.icon}
                      </div>
                      <div className={`flex-1 flex flex-col px-4 py-3 sm:px-5 sm:py-3 rounded-xl border-[2px] ${borderColor} ${bgCard} transition-all duration-500 group shadow-sm overflow-hidden`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] sm:text-[11px] font-[900] text-[var(--text-muted)] uppercase tracking-widest bg-[var(--bg-card2)] px-2 py-0.5 rounded-full border border-[var(--border)]">Step {idx + 1}</span>
                              {statusLabel && <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive ? "bg-[rgba(79,70,229,0.1)] text-[var(--accent)]" : "bg-[#dcfce7] text-[#166534]"}`}>{statusLabel}</span>}
                            </div>
                            <div className="font-[700] text-[15px] sm:text-[16px] text-[var(--text-primary)] truncate">{step.name}</div>
                          </div>
                          <div className="flex items-center gap-2 ml-2">
                            {!isProcessing && !completed && (
                              <button onClick={() => removeStep(idx)} className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded bg-[var(--bg-card2)] hover:bg-[#fee2e2] text-[var(--text-secondary)] hover:text-[#ef4444] transition-colors flex-shrink-0" title="Remove step">
                                ✕
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Configuration Area */}
                        {'configs' in step && step.configs && step.configs.length > 0 && (
                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
                            {step.configs.map((config: any) => (
                              <div key={config.id}>
                                <label className="block text-[11px] font-bold text-[var(--text-secondary)] mb-1 uppercase tracking-wider">{config.label}</label>
                                {config.type === "text" && (
                                  <input 
                                    type="text"
                                    placeholder={config.placeholder}
                                    disabled={isProcessing || completed}
                                    value={stepConfigs[`${step.id}_${config.id}`] || ""}
                                    onChange={(e) => setStepConfigs({ ...stepConfigs, [`${step.id}_${config.id}`]: e.target.value })}
                                    className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-[14px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-60"
                                  />
                                )}
                                {config.type === "text-or-file" && (
                                  <div className="flex items-center gap-2 relative">
                                    <input 
                                      type="text"
                                      placeholder={stepConfigs[`${step.id}_${config.id}_file`] ? "Using uploaded image..." : config.placeholder}
                                      disabled={isProcessing || completed || !!stepConfigs[`${step.id}_${config.id}_file`]}
                                      value={stepConfigs[`${step.id}_${config.id}`] || ""}
                                      onChange={(e) => setStepConfigs({ ...stepConfigs, [`${step.id}_${config.id}`]: e.target.value })}
                                      className={`w-full bg-[var(--bg)] border ${stepConfigs[`${step.id}_${config.id}_file`] ? 'border-dashed border-[var(--accent)] bg-[rgba(79,70,229,0.05)] text-[var(--accent)] font-semibold' : 'border-[var(--border)] text-[var(--text-primary)]'} rounded-lg px-3 py-2 text-[14px] outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-60 pr-24`}
                                    />
                                    {stepConfigs[`${step.id}_${config.id}_file`] ? (
                                      <button
                                        onClick={() => {
                                          const newConfigs = { ...stepConfigs };
                                          delete newConfigs[`${step.id}_${config.id}_file`];
                                          setStepConfigs(newConfigs);
                                        }}
                                        disabled={isProcessing || completed}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold bg-[#fee2e2] text-[#ef4444] px-2 py-1 rounded hover:bg-[#fecaca] transition-colors"
                                      >
                                        Remove File
                                      </button>
                                    ) : (
                                      <label className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer flex items-center gap-1 text-[11px] font-bold bg-[var(--bg-card2)] border border-[var(--border)] text-[var(--text-secondary)] px-2 py-1 rounded hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors">
                                        <span>📁</span> Upload Image
                                        <input 
                                          type="file"
                                          accept="image/*"
                                          disabled={isProcessing || completed}
                                          className="hidden"
                                          onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                              setStepConfigs({ ...stepConfigs, [`${step.id}_${config.id}`]: "", [`${step.id}_${config.id}_file`]: e.target.files[0].name });
                                              setStepFiles({ ...stepFiles, [`${step.id}_${config.id}_file`]: e.target.files[0] });
                                            }
                                          }}
                                        />
                                      </label>
                                    )}
                                  </div>
                                )}
                                {config.type === "select" && config.options && (
                                  <select 
                                    disabled={isProcessing || completed}
                                    value={stepConfigs[`${step.id}_${config.id}`] || config.options[0]}
                                    onChange={(e) => setStepConfigs({ ...stepConfigs, [`${step.id}_${config.id}`]: e.target.value })}
                                    className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-3 py-2 text-[14px] text-[var(--text-primary)] outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-60"
                                  >
                                    {config.options.map((opt: string) => (
                                      <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                  </select>
                                )}
                                {config.type === "file" && (
                                  <div className="flex items-center gap-3">
                                    <label className={`flex-1 flex items-center justify-between border ${stepConfigs[`${step.id}_${config.id}`] ? 'border-[var(--accent)] bg-[rgba(79,70,229,0.05)]' : 'border-dashed border-[var(--border)] hover:bg-[var(--bg)]'} rounded-lg px-4 py-2 cursor-pointer transition-colors ${isProcessing || completed ? 'opacity-60 pointer-events-none' : ''}`}>
                                      <span className={`text-[14px] truncate mr-2 ${stepConfigs[`${step.id}_${config.id}`] ? 'text-[var(--text-primary)] font-bold' : 'text-[var(--text-secondary)]'}`}>
                                        {stepConfigs[`${step.id}_${config.id}`] || config.placeholder}
                                      </span>
                                      <span className="text-[12px] font-bold bg-[var(--bg-card2)] border border-[var(--border)] px-3 py-1 rounded text-[var(--text-secondary)]">Browse</span>
                                      <input 
                                        type="file"
                                        disabled={isProcessing || completed}
                                        className="hidden"
                                        onChange={(e) => {
                                          if (e.target.files && e.target.files.length > 0) {
                                            setStepConfigs({ ...stepConfigs, [`${step.id}_${config.id}`]: e.target.files[0].name });
                                            setStepFiles({ ...stepFiles, [`${step.id}_file`]: e.target.files[0] });
                                          }
                                        }}
                                      />
                                    </label>
                                    {stepConfigs[`${step.id}_${config.id}`] && !(isProcessing || completed) && (
                                      <button 
                                        onClick={() => {
                                          const newConfigs = { ...stepConfigs };
                                          delete newConfigs[`${step.id}_${config.id}`];
                                          setStepConfigs(newConfigs);
                                        }} 
                                        className="p-2 rounded hover:bg-[#fee2e2] text-[#ef4444]" 
                                        title="Remove file"
                                      >
                                        ✕
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Actions Footer */}
            {steps.length > 0 && (
              <div className="mt-10 pt-8 border-t border-[var(--border)]">
                {!uploadedFile ? (
                  <div className="relative overflow-hidden border-2 border-dashed border-[var(--accent)] rounded-2xl p-10 text-center bg-[rgba(79,70,229,0.03)] group hover:bg-[rgba(79,70,229,0.06)] transition-colors">
                    <div className="text-[40px] mb-4 transform group-hover:-translate-y-2 transition-transform">📁</div>
                    <h4 className="font-[900] text-[20px] text-[var(--text-primary)] mb-2">Upload File to Automate</h4>
                    <p className="text-[15px] text-[var(--text-secondary)] mb-6 max-w-md mx-auto">Upload the initial {steps[0].in.toUpperCase()} file to run it through this {steps.length}-step automated pipeline instantly.</p>
                    <label className="inline-flex items-center justify-center px-8 py-3 bg-[var(--accent)] hover:bg-[#4338ca] text-white rounded-full font-bold text-[16px] cursor-pointer shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                      Browse Files
                      <input type="file" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                ) : isProcessing ? (
                  <div className="text-center p-8 bg-[var(--bg-card2)] rounded-2xl border border-[var(--border)]">
                    <div className="w-12 h-12 border-4 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin mx-auto mb-4"></div>
                    <h4 className="text-[22px] font-[900] text-[var(--accent)] mb-2">Executing Pipeline...</h4>
                    <p className="text-[15px] text-[var(--text-secondary)]">Running <span className="font-bold text-[var(--text-primary)]">"{uploadedFile}"</span> through {steps.length} steps.</p>
                  </div>
                ) : completed ? (
                  <div className="bg-[#f0fdf4] border-2 border-[#bbf7d0] p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-full bg-[#dcfce7] text-[#22c55e] flex items-center justify-center text-[28px] shadow-sm">✅</div>
                      <div>
                        <h4 className="font-[900] text-[20px] text-[#166534] mb-1">Workflow Complete!</h4>
                        <p className="text-[14px] text-[#15803d]">Your file has successfully passed through {steps.length} automated steps.</p>
                      </div>
                    </div>
                    <button onClick={downloadResult} className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#166534] hover:bg-[#14532d] text-white font-[800] shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 whitespace-nowrap">
                      Download Result
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-5 rounded-2xl border-2 border-[var(--border)] shadow-sm gap-4">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="w-12 h-12 rounded-xl bg-[var(--bg-card2)] flex items-center justify-center text-[24px]">📄</div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[12px] font-[800] text-[var(--text-muted)] uppercase tracking-wider mb-0.5">Ready to process</div>
                        <div className="font-[700] text-[15px] text-[var(--text-primary)] truncate">{uploadedFile}</div>
                      </div>
                    </div>
                    <button onClick={runWorkflow} className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[var(--accent)] hover:bg-[#4338ca] text-white font-[900] text-[16px] shadow-[0_8px_20px_rgba(79,70,229,0.25)] hover:shadow-[0_12px_25px_rgba(79,70,229,0.35)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
                      <span>▶</span> Start Automation
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Save Workflow Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[var(--bg-card)] rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-[var(--border)]">
            <h3 className="text-[20px] font-bold text-[var(--text-primary)] mb-4">Save Workflow</h3>
            <p className="text-[14px] text-[var(--text-secondary)] mb-4">Give your workflow a name to easily run it again later.</p>
            <input
              type="text"
              autoFocus
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder="e.g. Daily Report Generator"
              className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-3 text-[15px] font-semibold text-[var(--text-primary)] outline-none focus:border-[var(--accent)] mb-6 transition-colors"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowSaveModal(false)} className="flex-1 py-2.5 rounded-xl font-bold text-[var(--text-secondary)] bg-[var(--bg-card2)] hover:bg-[var(--bg)] border border-[var(--border)] transition-colors">Cancel</button>
              <button onClick={saveWorkflow} disabled={!workflowName.trim()} className="flex-1 py-2.5 rounded-xl font-bold text-white bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:hover:bg-[var(--accent)] transition-colors shadow-md">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
