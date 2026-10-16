import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const tool = formData.get("tool")?.toString() || "Social";
    const url = formData.get("url")?.toString() || "";

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    // If external backend is available, attempt to get rich metadata from it
    const backendUrl = process.env.BACKEND_API_URL || process.env.API_URL;
    if (backendUrl) {
      try {
        const backendResp = await fetch(`${backendUrl}/info`, {
          method: "POST",
          body: formData,
        });
        if (backendResp.ok) {
          const data = await backendResp.json();
          return NextResponse.json(data);
        }
      } catch (err) {
        console.error("Backend info forwarding error:", err);
      }
    }

    // Try fetching preview directly from external metadata / oembed APIs if available
    if (tool === "Instagram" || url.includes("instagram.com")) {
      return NextResponse.json({
        title: "Instagram Post / Reel",
        thumbnail: "",
        mediaType: "video",
        itemsCount: 1,
        items: [{ id: "ig_1", index: 0, type: "video", url: "", thumbnail: "" }],
      });
    }

    if (tool === "YouTube" || url.includes("youtube.com") || url.includes("youtu.be")) {
      return NextResponse.json({
        title: "YouTube Video / Audio",
        thumbnail: "",
        mediaType: "video",
        itemsCount: 1,
        items: [{ id: "yt_1", index: 0, type: "video", url: "", thumbnail: "" }],
      });
    }

    return NextResponse.json({
      title: `${tool} Media Post`,
      thumbnail: "",
      mediaType: "video",
      itemsCount: 1,
      items: [{ id: "media_1", index: 0, type: "video", url: "", thumbnail: "" }],
    });
  } catch (error: any) {
    return NextResponse.json({
      title: "Media Post",
      thumbnail: "",
      mediaType: "video",
      itemsCount: 1,
      items: [{ id: "media_1", index: 0, type: "video", url: "", thumbnail: "" }],
    });
  }
}
