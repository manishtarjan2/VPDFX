"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";

const EditorClient = dynamic(() => import("./EditorClient"), {
  ssr: false,
});

export default function EditorPage() {
  useEffect(() => {
    const observerErr = (e: ErrorEvent) => {
      if (e.message === "ResizeObserver loop limit exceeded" || e.message === "ResizeObserver loop completed with undelivered notifications.") {
        e.stopImmediatePropagation();
      }
    };
    window.addEventListener("error", observerErr);
    return () => window.removeEventListener("error", observerErr);
  }, []);

  return <EditorClient />;
}
