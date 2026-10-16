"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NAV_LINKS } from "../page";

interface ImageStep {
  id: string;
  tool: string;
  name: string;
  icon: string;
  description: string;
  options: Record<string, any>;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export default function ImageWorkflowPage() {
  const router = useRouter();
  const [dark, setDark] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [imageDims, setImageDims] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [workflowSteps, setWorkflowSteps] = useState<ImageStep[]>([]);
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentExecutingIdx, setCurrentExecutingIdx] = useState<number>(-1);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);
  const [resultOcrText, setResultOcrText] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultFilename, setResultFilename] = useState<string>("processed_image.png");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // Drag crop state
  const [cropBox, setCropBox] = useState({ x: 20, y: 20, width: 260, height: 260 });
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const [cropDragStart, setCropDragStart] = useState({ x: 0, y: 0, boxX: 0, boxY: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("vpdfx-theme");
    if (savedTheme === "dark") {
      setDark(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  function toggleDark() {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.setAttribute("data-theme", next ? "dark" : "");
      window.localStorage.setItem("vpdfx-theme", next ? "dark" : "light");
      return next;
    });
  }

  // Handle uploaded image file
  const handleFileSelect = (file: File) => {
    if (!file || !file.type.startsWith("image/")) {
      setStatusMessage("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }
    setUploadedFile(file);
    const url = URL.createObjectURL(file);
    setOriginalImageUrl(url);
    setResultImageUrl(null);
    setResultOcrText(null);
    setResultBlob(null);
    setStatusMessage(null);

    const img = new Image();
    img.onload = () => {
      setImageDims({ width: img.naturalWidth, height: img.naturalHeight });
      setCropBox({
        x: Math.round(img.naturalWidth * 0.1),
        y: Math.round(img.naturalHeight * 0.1),
        width: Math.round(img.naturalWidth * 0.8),
        height: Math.round(img.naturalHeight * 0.8),
      });
    };
    img.src = url;

    // Default starter pipeline if empty
    if (workflowSteps.length === 0) {
      setWorkflowSteps([
        {
          id: "step_resize",
          tool: "Resize Image",
          name: "Resize Image",
          icon: "📐",
          description: "Scale resolution with aspect ratio lock",
          options: { width: 1200, height: 800, maintainAspect: true },
        },
        {
          id: "step_compress",
          tool: "Compress Image",
          name: "Compress Image",
          icon: "🗜️",
          description: "Optimize file size and fidelity",
          options: { quality: 80 },
        },
      ]);
      setActiveStepId("step_resize");
    }
  };

  const addStep = (toolName: string, icon: string, desc: string, defaultOpts: Record<string, any>) => {
    const newStep: ImageStep = {
      id: `step_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      tool: toolName,
      name: toolName,
      icon,
      description: desc,
      options: defaultOpts,
    };
    setWorkflowSteps((prev) => [...prev, newStep]);
    setActiveStepId(newStep.id);
  };

  const removeStep = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setWorkflowSteps((prev) => prev.filter((s) => s.id !== id));
    if (activeStepId === id) {
      const remaining = workflowSteps.filter((s) => s.id !== id);
      setActiveStepId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const updateStepOption = (stepId: string, key: string, value: any) => {
    setWorkflowSteps((prev) =>
      prev.map((s) => {
        if (s.id !== stepId) return s;
        return {
          ...s,
          options: { ...s.options, [key]: value },
        };
      })
    );
  };

  // Run the full multi-step image pipeline sequentially
  const runWorkflow = async () => {
    if (!uploadedFile) {
      setStatusMessage("Please upload an image first.");
      return;
    }
    if (workflowSteps.length === 0) {
      setStatusMessage("Please add at least one operation to the workflow.");
      return;
    }

    setIsProcessing(true);
    setStatusMessage("Starting image pipeline...");
    setProgressPercent(5);
    setResultImageUrl(null);
    setResultOcrText(null);

    let currentFile: File = uploadedFile;
    let finalBlob: Blob = uploadedFile;
    let finalFileName = `processed_${uploadedFile.name}`;

    try {
      for (let i = 0; i < workflowSteps.length; i++) {
        const step = workflowSteps[i];
        setCurrentExecutingIdx(i);
        setStatusMessage(`Executing Step ${i + 1} of ${workflowSteps.length}: ${step.name}...`);
        setProgressPercent(Math.round(((i + 1) / (workflowSteps.length + 1)) * 100));

        const formData = new FormData();
        formData.append("files", currentFile, currentFile.name);
        formData.append("tool", step.tool);

        if (step.tool === "Resize Image") {
          formData.append("resizeWidth", (step.options.width || 800).toString());
          formData.append("resizeHeight", (step.options.height || 600).toString());
          formData.append("maintainAspect", step.options.maintainAspect !== false ? "true" : "false");
        } else if (step.tool === "Compress Image") {
          formData.append("compressQuality", (step.options.quality || 75).toString());
        } else if (step.tool === "Rotate Image") {
          formData.append("rotateAngle", (step.options.angle || 90).toString());
        } else if (step.tool === "Crop Image") {
          formData.append("cropWidth", (step.options.width || cropBox.width).toString());
          formData.append("cropHeight", (step.options.height || cropBox.height).toString());
          formData.append("cropLeft", (step.options.left || cropBox.x).toString());
          formData.append("cropTop", (step.options.top || cropBox.y).toString());
        } else if (step.tool === "Image to PDF") {
          formData.append("pdfOrientation", step.options.orientation || "portrait");
          formData.append("pdfMargin", step.options.margin || "small");
        }

        const res = await fetch("http://localhost:4000/convert", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const err = await res.text();
          throw new Error(`Error during ${step.name}: ${err || "Processing failed"}`);
        }

        const stepBlob = await res.blob();
        finalBlob = stepBlob;

        // Check disposition filename if present
        const disp = res.headers.get("content-disposition");
        if (disp && disp.includes("filename")) {
          const match = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disp);
          if (match && match[1]) {
            finalFileName = match[1].replace(/['"]/g, "");
          }
        }

        // If it's OCR Image to Text, read as text and finish
        if (step.tool === "Image to Text") {
          const text = await stepBlob.text();
          setResultOcrText(text || "No text detected in this image.");
          finalFileName = "extracted_text.txt";
          break;
        }

        // Prepare intermediate File for next chained step
        currentFile = new File([stepBlob], finalFileName, { type: stepBlob.type || "image/png" });
      }

      setProgressPercent(100);
      setResultBlob(finalBlob);
      setResultFilename(finalFileName);

      if (!resultOcrText && finalBlob.type !== "application/pdf") {
        const outUrl = URL.createObjectURL(finalBlob);
        setResultImageUrl(outUrl);
      }
      setStatusMessage("🎉 Workflow completed successfully!");
    } catch (err: any) {
      console.error(err);
      setStatusMessage(err.message || "An error occurred during workflow execution.");
    } finally {
      setIsProcessing(false);
      setCurrentExecutingIdx(-1);
    }
  };

  const downloadResult = () => {
    if (!resultBlob) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = resultFilename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const activeStep = workflowSteps.find((s) => s.id === activeStepId) || workflowSteps[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--bg-main, #f8fafc)" }}>
      <nav className="sticky top-0 z-[100] backdrop-blur-xl border-b border-[var(--border)] transition-colors duration-300 bg-[var(--bg-card)]/85" style={{ boxShadow: "0 2px 20px rgba(0,0,0,.06)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", height: 64, padding: "0 24px", gap: 8 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginRight: 14, flexShrink: 0 }}>
            <img src={dark ? "/image-dark.png" : "/image-copy.png"} alt="VPDFX" style={{ height: 42, objectFit: "contain" }} />
          </a>

          <div className="flex items-center gap-2">
            <Link href="/category/image" className="text-[13px] font-bold text-[var(--text-secondary)] hover:text-amber-500 px-3 py-1.5 rounded-lg transition-colors">
              ← Back to Image Tools
            </Link>
            <span className="text-[var(--border)]">/</span>
            <span className="text-[13px] font-extrabold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              ⚡ Image Workflow Studio
            </span>
          </div>

          <div style={{ flex: 1 }} />

          <button onClick={toggleDark} title="Toggle dark mode" style={{ width: 38, height: 38, borderRadius: "50%", border: "1.5px solid var(--border)", background: "var(--bg-card)", cursor: "pointer", fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {dark ? "☀️" : "🌙"}
          </button>
        </div>
      </nav>

      {/* Main Studio Container */}
      <main style={{ flex: 1, maxWidth: 1440, width: "100%", margin: "0 auto", padding: "28px 24px 60px" }}>
        {/* Studio Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border)] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-3xl shadow-md shadow-orange-500/20">
              🖼️
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-[var(--text-primary)]">Image Sequential Workflow</h1>
                <span className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-800">
                  Automated Pipeline
                </span>
              </div>
              <p className="text-[14px] text-[var(--text-secondary)] mt-0.5">
                Chain crop, resize, background removal, format conversions, compression, and PDF export in one single automated run.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 bg-[var(--bg-card2)] hover:bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] font-bold text-[13px] rounded-xl transition-all cursor-pointer shadow-sm hover:border-amber-500"
            >
              📁 {uploadedFile ? "Change Image" : "Choose Image"}
            </button>
            <button
              onClick={runWorkflow}
              disabled={isProcessing || !uploadedFile}
              className={`px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-[14px] rounded-xl shadow-md shadow-orange-500/25 transition-all flex items-center gap-2 cursor-pointer ${
                isProcessing || !uploadedFile ? "opacity-60 cursor-not-allowed" : "hover:scale-[1.02] active:scale-95"
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing Pipeline...
                </>
              ) : (
                <>
                  <span>▶</span> Run Full Workflow
                </>
              )}
            </button>
          </div>
        </div>

        {/* Studio 3-Column Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Column 1: Step Pipeline Builder (4 cols) */}
          <div className="lg:col-span-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border)]">
              <div>
                <h2 className="text-[16px] font-extrabold text-[var(--text-primary)]">Pipeline Actions ({workflowSteps.length})</h2>
                <p className="text-[12px] text-[var(--text-secondary)]">Steps execute sequentially from top to bottom</p>
              </div>
              <button
                onClick={() => setWorkflowSteps([])}
                className="text-[12px] text-red-500 hover:underline font-semibold"
                title="Clear all steps"
              >
                Clear
              </button>
            </div>

            {/* Steps list */}
            <div className="flex flex-col gap-2.5 mb-6">
              {workflowSteps.length === 0 ? (
                <div className="text-center py-8 px-4 border-2 border-dashed border-[var(--border)] rounded-2xl text-[13px] text-[var(--text-muted)]">
                  No steps added yet. Click one of the action cards below to add it to your pipeline.
                </div>
              ) : (
                workflowSteps.map((step, idx) => {
                  const isActive = activeStep?.id === step.id;
                  const isCurrentRunning = currentExecutingIdx === idx;
                  return (
                    <div
                      key={step.id}
                      onClick={() => setActiveStepId(step.id)}
                      className={`group relative flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isActive
                          ? "bg-amber-500/10 border-amber-500 shadow-sm"
                          : "bg-[var(--bg-card2)] border-[var(--border)] hover:border-amber-400"
                      } ${isCurrentRunning ? "ring-2 ring-amber-500 animate-pulse" : ""}`}
                    >
                      <div className="w-7 h-7 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center font-black text-[12px] text-[var(--text-secondary)] shrink-0">
                        {idx + 1}
                      </div>
                      <div className="text-xl shrink-0">{step.icon}</div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-[14px] text-[var(--text-primary)] truncate">{step.name}</div>
                        <div className="text-[11px] text-[var(--text-secondary)] truncate">
                          {step.tool === "Resize Image" && `${step.options.width} × ${step.options.height} px`}
                          {step.tool === "Compress Image" && `${step.options.quality}% Quality`}
                          {step.tool === "Rotate Image" && `${step.options.angle}° Angle`}
                          {step.tool === "Crop Image" && `Crop Box Applied`}
                          {step.tool === "Remove BG" && `AI Subject Cutout`}
                          {step.tool === "Image to PDF" && `${step.options.orientation || "Portrait"}`}
                          {step.tool.includes("to") && step.tool}
                        </div>
                      </div>
                      <button
                        onClick={(e) => removeStep(step.id, e)}
                        className="opacity-0 group-hover:opacity-100 hover:text-red-500 p-1 text-[16px] transition-opacity shrink-0"
                        title="Remove step"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Add action menu */}
            <div>
              <div className="text-[12px] font-black uppercase text-[var(--text-muted)] tracking-wider mb-2.5">
                + Add Action to Pipeline
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => addStep("Resize Image", "📐", "Resize pixel resolution", { width: 1200, height: 800, maintainAspect: true })}
                  className="flex items-center gap-2 p-2.5 bg-[var(--bg-card2)] hover:bg-amber-500/10 border border-[var(--border)] hover:border-amber-400 rounded-xl text-left text-[12px] font-bold text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  <span>📐</span> Resize
                </button>
                <button
                  onClick={() => addStep("Compress Image", "🗜️", "Reduce file size", { quality: 75 })}
                  className="flex items-center gap-2 p-2.5 bg-[var(--bg-card2)] hover:bg-amber-500/10 border border-[var(--border)] hover:border-amber-400 rounded-xl text-left text-[12px] font-bold text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  <span>🗜️</span> Compress
                </button>
                <button
                  onClick={() => addStep("Crop Image", "✂️", "Crop boundary region", { width: 400, height: 400, left: 50, top: 50 })}
                  className="flex items-center gap-2 p-2.5 bg-[var(--bg-card2)] hover:bg-amber-500/10 border border-[var(--border)] hover:border-amber-400 rounded-xl text-left text-[12px] font-bold text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  <span>✂️</span> Crop
                </button>
                <button
                  onClick={() => addStep("Rotate Image", "🔄", "Rotate orientation", { angle: 90 })}
                  className="flex items-center gap-2 p-2.5 bg-[var(--bg-card2)] hover:bg-amber-500/10 border border-[var(--border)] hover:border-amber-400 rounded-xl text-left text-[12px] font-bold text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  <span>🔄</span> Rotate
                </button>
                <button
                  onClick={() => addStep("Remove BG", "🧹", "Isolate subject cutout", {})}
                  className="flex items-center gap-2 p-2.5 bg-[var(--bg-card2)] hover:bg-amber-500/10 border border-[var(--border)] hover:border-amber-400 rounded-xl text-left text-[12px] font-bold text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  <span>🧹</span> Remove BG
                </button>
                <button
                  onClick={() => addStep("JPG to PNG", "🖼️", "Convert to transparent PNG", {})}
                  className="flex items-center gap-2 p-2.5 bg-[var(--bg-card2)] hover:bg-amber-500/10 border border-[var(--border)] hover:border-amber-400 rounded-xl text-left text-[12px] font-bold text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  <span>🖼️</span> JPG → PNG
                </button>
                <button
                  onClick={() => addStep("PNG to JPG", "🖼️", "Convert to compressed JPG", {})}
                  className="flex items-center gap-2 p-2.5 bg-[var(--bg-card2)] hover:bg-amber-500/10 border border-[var(--border)] hover:border-amber-400 rounded-xl text-left text-[12px] font-bold text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  <span>🖼️</span> PNG → JPG
                </button>
                <button
                  onClick={() => addStep("WebP to JPG", "🧩", "Convert WebP to JPG", {})}
                  className="flex items-center gap-2 p-2.5 bg-[var(--bg-card2)] hover:bg-amber-500/10 border border-[var(--border)] hover:border-amber-400 rounded-xl text-left text-[12px] font-bold text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  <span>🧩</span> WebP → JPG
                </button>
                <button
                  onClick={() => addStep("Image to PDF", "📄", "Save image into PDF page", { orientation: "portrait", margin: "small" })}
                  className="flex items-center gap-2 p-2.5 bg-[var(--bg-card2)] hover:bg-amber-500/10 border border-[var(--border)] hover:border-amber-400 rounded-xl text-left text-[12px] font-bold text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  <span>📄</span> To PDF
                </button>
                <button
                  onClick={() => addStep("Image to Text", "🔤", "OCR text extraction", {})}
                  className="flex items-center gap-2 p-2.5 bg-[var(--bg-card2)] hover:bg-amber-500/10 border border-[var(--border)] hover:border-amber-400 rounded-xl text-left text-[12px] font-bold text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  <span>🔤</span> OCR Text
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Live Visual Canvas & Workspace (5 cols) */}
          <div className="lg:col-span-5 bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl p-5 shadow-sm min-h-[560px] flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[var(--border)]">
              <div>
                <h2 className="text-[16px] font-extrabold text-[var(--text-primary)]">Interactive Canvas</h2>
                <p className="text-[12px] text-[var(--text-secondary)]">
                  {uploadedFile ? `${uploadedFile.name} • ${formatFileSize(uploadedFile.size)} (${imageDims.width} × ${imageDims.height} px)` : "Upload an image to start previewing"}
                </p>
              </div>
              {uploadedFile && (
                <button
                  onClick={() => {
                    setUploadedFile(null);
                    setOriginalImageUrl(null);
                    setResultImageUrl(null);
                    setResultOcrText(null);
                  }}
                  className="text-[12px] text-[var(--text-secondary)] hover:text-red-500 font-semibold"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Dropzone or Preview Area */}
            <div className="flex-1 flex flex-col items-center justify-center bg-[var(--bg-card2)] rounded-2xl border-2 border-dashed border-[var(--border)] p-4 relative overflow-hidden min-h-[380px]">
              {!originalImageUrl ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-8 text-center cursor-pointer hover:scale-105 transition-transform"
                >
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center text-3xl mb-3 shadow-inner">
                    📷
                  </div>
                  <div className="font-extrabold text-[16px] text-[var(--text-primary)] mb-1">
                    Select or Drop Image Here
                  </div>
                  <div className="text-[13px] text-[var(--text-secondary)] max-w-xs">
                    Supports JPG, PNG, WEBP, GIF, and SVG files for sequential processing
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  {/* Image render */}
                  <img
                    src={resultImageUrl || originalImageUrl}
                    alt="Preview"
                    className="max-h-[380px] w-auto max-w-full object-contain rounded-lg shadow-sm"
                    style={{
                      transform: activeStep?.tool === "Rotate Image" ? `rotate(${activeStep.options.angle || 0}deg)` : "none",
                      transition: "transform 0.3s ease",
                    }}
                  />

                  {/* Crop Overlay if Crop Image step is active */}
                  {activeStep?.tool === "Crop Image" && imageDims.width > 0 && (
                    <div
                      className="absolute border-2 border-amber-500 bg-amber-500/20 rounded-md pointer-events-none"
                      style={{
                        width: "60%",
                        height: "60%",
                        boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.45)",
                      }}
                    >
                      <div className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded shadow">
                        CROP ZONE
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Progress Overlay */}
              {isProcessing && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white text-center z-30">
                  <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
                  <div className="text-[16px] font-extrabold mb-1">Processing Workflow...</div>
                  <div className="text-[13px] text-zinc-300 mb-4">{statusMessage}</div>
                  <div className="w-64 bg-zinc-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>
              )}
            </div>

            {/* OCR Text Result Card if applicable */}
            {resultOcrText && (
              <div className="mt-4 p-4 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-bold text-sky-800 dark:text-sky-300">Extracted Text Output:</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(resultOcrText);
                      setCopiedText(true);
                      setTimeout(() => setCopiedText(false), 2000);
                    }}
                    className="text-[12px] bg-sky-600 text-white px-2.5 py-1 rounded-lg font-bold hover:bg-sky-700"
                  >
                    {copiedText ? "Copied! ✓" : "Copy All"}
                  </button>
                </div>
                <textarea
                  readOnly
                  value={resultOcrText}
                  className="w-full h-24 p-2 text-[12px] bg-white dark:bg-zinc-900 border border-sky-300 dark:border-sky-800 rounded-xl outline-none resize-none font-mono"
                />
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-[12px] text-[var(--text-secondary)] font-medium">
                {statusMessage && !isProcessing ? statusMessage : "Ready to process"}
              </span>

              {resultBlob && (
                <button
                  onClick={downloadResult}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[13px] rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>⬇</span> Download Processed File
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
            />
          </div>

          {/* Column 3: Active Step Configuration (3 cols) */}
          <div className="lg:col-span-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl p-5 shadow-sm">
            <div className="pb-3 mb-4 border-b border-[var(--border)]">
              <h2 className="text-[16px] font-extrabold text-[var(--text-primary)]">Step Options</h2>
              <p className="text-[12px] text-[var(--text-secondary)]">
                {activeStep ? activeStep.name : "Select a step to configure"}
              </p>
            </div>

            {!activeStep ? (
              <div className="text-center py-10 text-[13px] text-[var(--text-muted)]">
                Click on any step in the pipeline to tweak its individual options.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 p-3 bg-[var(--bg-card2)] rounded-2xl border border-[var(--border)] mb-1">
                  <span className="text-2xl">{activeStep.icon}</span>
                  <div>
                    <div className="font-extrabold text-[14px] text-[var(--text-primary)]">{activeStep.name}</div>
                    <div className="text-[11px] text-[var(--text-secondary)]">{activeStep.description}</div>
                  </div>
                </div>

                {/* Resize Image Config */}
                {activeStep.tool === "Resize Image" && (
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-[12px] font-bold text-[var(--text-primary)] mb-1 block">Width (px)</label>
                      <input
                        type="number"
                        value={activeStep.options.width || 1200}
                        onChange={(e) => {
                          const w = parseInt(e.target.value) || 0;
                          updateStepOption(activeStep.id, "width", w);
                          if (activeStep.options.maintainAspect && imageDims.width > 0) {
                            const ratio = imageDims.height / imageDims.width;
                            updateStepOption(activeStep.id, "height", Math.round(w * ratio));
                          }
                        }}
                        className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-card2)] text-[var(--text-primary)] font-semibold text-[13px] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[12px] font-bold text-[var(--text-primary)] mb-1 block">Height (px)</label>
                      <input
                        type="number"
                        value={activeStep.options.height || 800}
                        onChange={(e) => {
                          const h = parseInt(e.target.value) || 0;
                          updateStepOption(activeStep.id, "height", h);
                          if (activeStep.options.maintainAspect && imageDims.height > 0) {
                            const ratio = imageDims.width / imageDims.height;
                            updateStepOption(activeStep.id, "width", Math.round(h * ratio));
                          }
                        }}
                        className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-card2)] text-[var(--text-primary)] font-semibold text-[13px] outline-none"
                      />
                    </div>
                    <label className="flex items-center gap-2 text-[12px] font-bold text-[var(--text-secondary)] cursor-pointer mt-1">
                      <input
                        type="checkbox"
                        checked={activeStep.options.maintainAspect !== false}
                        onChange={(e) => updateStepOption(activeStep.id, "maintainAspect", e.target.checked)}
                        className="accent-amber-500 w-4 h-4 rounded"
                      />
                      Maintain Aspect Ratio
                    </label>
                  </div>
                )}

                {/* Compress Image Config */}
                {activeStep.tool === "Compress Image" && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between text-[12px] font-bold text-[var(--text-primary)]">
                      <span>Compression Quality</span>
                      <span className="text-amber-500 font-extrabold">{activeStep.options.quality || 75}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="95"
                      value={activeStep.options.quality || 75}
                      onChange={(e) => updateStepOption(activeStep.id, "quality", parseInt(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-[var(--text-muted)]">
                      <span>Small size (10%)</span>
                      <span>High fidelity (95%)</span>
                    </div>
                  </div>
                )}

                {/* Rotate Image Config */}
                {activeStep.tool === "Rotate Image" && (
                  <div className="flex flex-col gap-2.5">
                    <label className="text-[12px] font-bold text-[var(--text-primary)]">Rotation Angle</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[90, 180, 270, 0].map((deg) => (
                        <button
                          key={deg}
                          onClick={() => updateStepOption(activeStep.id, "angle", deg)}
                          className={`p-2 rounded-xl border text-[12px] font-bold transition-all cursor-pointer ${
                            (activeStep.options.angle || 90) === deg
                              ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                              : "bg-[var(--bg-card2)] text-[var(--text-primary)] border-[var(--border)] hover:border-amber-400"
                          }`}
                        >
                          {deg === 0 ? "0° (Reset)" : `${deg}° Rotation`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Crop Image Config */}
                {activeStep.tool === "Crop Image" && (
                  <div className="flex flex-col gap-3">
                    <div className="text-[12px] text-[var(--text-secondary)]">
                      Adjust crop boundaries in pixels:
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-[var(--text-muted)] block mb-1">Width</label>
                        <input
                          type="number"
                          value={activeStep.options.width || cropBox.width}
                          onChange={(e) => updateStepOption(activeStep.id, "width", parseInt(e.target.value) || 100)}
                          className="w-full p-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card2)] text-[12px] font-bold outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-[var(--text-muted)] block mb-1">Height</label>
                        <input
                          type="number"
                          value={activeStep.options.height || cropBox.height}
                          onChange={(e) => updateStepOption(activeStep.id, "height", parseInt(e.target.value) || 100)}
                          className="w-full p-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card2)] text-[12px] font-bold outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Image to PDF Config */}
                {activeStep.tool === "Image to PDF" && (
                  <div className="flex flex-col gap-3">
                    <label className="text-[12px] font-bold text-[var(--text-primary)]">Page Orientation</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["portrait", "landscape"].map((orient) => (
                        <button
                          key={orient}
                          onClick={() => updateStepOption(activeStep.id, "orientation", orient)}
                          className={`p-2 rounded-xl border text-[12px] font-bold capitalize transition-all cursor-pointer ${
                            (activeStep.options.orientation || "portrait") === orient
                              ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                              : "bg-[var(--bg-card2)] text-[var(--text-primary)] border-[var(--border)]"
                          }`}
                        >
                          {orient}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Remove BG & Formats note */}
                {["Remove BG", "JPG to PNG", "PNG to JPG", "WebP to JPG", "Image to Text"].includes(activeStep.tool) && (
                  <div className="p-3 bg-[var(--bg-card2)] rounded-xl border border-[var(--border)] text-[12px] text-[var(--text-secondary)]">
                    ✓ Automated intelligent processing configured for this operation.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
