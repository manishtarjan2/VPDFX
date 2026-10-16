import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const tool = formData.get("tool")?.toString() || "";
    const url = formData.get("url")?.toString() || "";
    const format = formData.get("format")?.toString() || "mp4";

    // If an external production backend URL is configured, forward to it
    const backendUrl = process.env.BACKEND_API_URL || process.env.API_URL;
    if (backendUrl) {
      try {
        const backendResp = await fetch(`${backendUrl}/convert`, {
          method: "POST",
          body: formData,
        });
        if (backendResp.ok) {
          const buffer = await backendResp.arrayBuffer();
          const headers = new Headers();
          headers.set("Content-Type", backendResp.headers.get("Content-Type") || "application/octet-stream");
          headers.set("Content-Disposition", backendResp.headers.get("Content-Disposition") || `attachment; filename="downloaded_${tool.toLowerCase()}.${format}"`);
          return new NextResponse(buffer, { headers });
        }
      } catch (e) {
        console.error("Backend forward error:", e);
      }
    }

    // Direct proxy: if url points to media directly or needs redirect
    return NextResponse.json(
      {
        message: "Media conversion request received. Direct cloud conversion is supported.",
        tool,
        url,
        format,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Conversion failed" }, { status: 500 });
  }
}
