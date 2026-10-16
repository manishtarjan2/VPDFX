import time
from collections import defaultdict
from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, JSONResponse
import fitz  # PyMuPDF
import re
import io
import json

app = FastAPI()

# In-memory sliding window rate limiter: 20 req/s per IP
_rate_limits = defaultdict(lambda: {"count": 0, "reset_time": 0.0})

@app.middleware("http")
async def security_and_rate_limit_middleware(request: Request, call_next):
    # Rate Limiting: 20 req/sec per IP
    forwarded = request.headers.get("x-forwarded-for")
    client_ip = forwarded.split(",")[0].strip() if forwarded else (request.client.host if request.client else "unknown")
    now = time.time()
    
    ip_data = _rate_limits[client_ip]
    if now > ip_data["reset_time"]:
        ip_data["count"] = 1
        ip_data["reset_time"] = now + 1.0  # 1 second window
    else:
        ip_data["count"] += 1
        if ip_data["count"] > 20:
            return JSONResponse(
                status_code=429,
                content={
                    "detail": "Rate limit exceeded: maximum 20 requests per second allowed.",
                    "status_code": 429
                },
                headers={"Retry-After": "1"}
            )
            
    response = await call_next(request)
    
    # Security Headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def is_page_number(text):
    text = text.strip().lower()
    # Match patterns anywhere in the string
    # E.g. just a number, or 'page 1', or '1 of 5', or 'p. 1'
    if re.fullmatch(r'^[\-\s]*\d+[\-\s]*$', text): # exactly a number
        return True
    
    # Or contains "page x" or "p. x" or "page x of y"
    if re.search(r'\bpage\s*\d+', text) or re.search(r'\bp\.?\s*\d+', text) or re.search(r'\b\d+\s+of\s+\d+\b', text):
        return True
        
    # Or contains just a number if the text is very short (less than 10 chars)
    if len(text) < 10 and re.search(r'\d+', text):
        return True
        
    return False

@app.post("/remove-page-numbers")
async def remove_page_numbers(file: UploadFile = File(...)):
    content = await file.read()
    doc = fitz.open(stream=content, filetype="pdf")
    
    for page in doc:
        rect = page.rect
        # Define header/footer areas (top 15% and bottom 15%)
        header_rect = fitz.Rect(0, 0, rect.width, rect.height * 0.15)
        footer_rect = fitz.Rect(0, rect.height * 0.85, rect.width, rect.height)
        
        words = page.get_text("words")
        # Find continuous text blocks or check words
        
        # We can extract text blocks
        blocks = page.get_text("blocks")
        for b in blocks:
            x0, y0, x1, y1, text, block_no, block_type = b
            if block_type == 0: # text block
                b_rect = fitz.Rect(x0, y0, x1, y1)
                
                # Check if block is entirely in header or footer
                if header_rect.intersects(b_rect) or footer_rect.intersects(b_rect):
                    clean_text = text.strip()
                    print(f"Scanned block: '{clean_text}'")
                    if is_page_number(text):
                        print(f"==> MATCHED as page number! Redacting.")
                        # Redact the block completely
                        page.add_redact_annot(b_rect, fill=(1, 1, 1))
        
        # Apply redactions
        page.apply_redactions()

    out_pdf = io.BytesIO()
    doc.save(out_pdf)
    doc.close()
    
    return Response(
        content=out_pdf.getvalue(),
        media_type="application/pdf"
    )

@app.post("/api/parse-pdf")
async def parse_pdf(file: UploadFile = File(...), page_index: int = Form(-1)):
    content = await file.read()
    doc = fitz.open(stream=content, filetype="pdf")
    
    if page_index == -1:
        # Parse all pages and create a clean background PDF with text removed so original text glyphs don't show underneath editable text
        all_pages = []
        span_id = 0
        
        # Clone doc to create background_pdf
        bg_doc = fitz.open(stream=content, filetype="pdf")
        
        for i in range(len(doc)):
            page = doc[i]
            bg_page = bg_doc[i]
            page_dict = page.get_text("dict")
            spans = []
            
            for block in page_dict.get("blocks", []):
                if block.get("type") == 0:  # text block
                    for line in block.get("lines", []):
                        line_text = "".join(s.get("text", "") for s in line.get("spans", []))
                        if line_text.strip():
                            first_span = line["spans"][0]
                            color_int = first_span.get("color", 0)
                            hex_color = f"#{color_int:06x}" if isinstance(color_int, int) else "#000000"
                            spans.append({
                                "id": f"span_{span_id}",
                                "text": line_text,
                                "bbox": line.get("bbox"),
                                "size": first_span.get("size", 12),
                                "font": first_span.get("font", "Helvetica"),
                                "color": hex_color,
                                "page": i,
                                "flags": first_span.get("flags", 0)
                            })
                            span_id += 1
                            
                            # Cleanly redact line from background doc
                            l_bbox = line.get("bbox")
                            if l_bbox:
                                rect = fitz.Rect(l_bbox[0] - 1, l_bbox[1] - 1, l_bbox[2] + 1, l_bbox[3] + 1)
                                bg_page.add_redact_annot(rect)
                                
            bg_page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE)
            all_pages.append({
                "spans": spans,
                "width": page.rect.width,
                "height": page.rect.height
            })
            
        import base64
        bg_buffer = io.BytesIO()
        bg_doc.save(bg_buffer)
        bg_doc.close()
        doc.close()
        bg_b64 = base64.b64encode(bg_buffer.getvalue()).decode('utf-8')
        
        return {
            "pages": all_pages,
            "background_pdf": f"data:application/pdf;base64,{bg_b64}"
        }
        
    elif page_index >= len(doc):
        doc.close()
        return {"error": "Page out of bounds"}
        
    page = doc[page_index]
    page_dict = page.get_text("dict")
    
    spans = []
    span_id = 0
    for block in page_dict.get("blocks", []):
        if block.get("type") == 0:  # text block
            for line in block.get("lines", []):
                line_text = "".join(s.get("text", "") for s in line.get("spans", []))
                if line_text.strip():
                    first_span = line["spans"][0]
                    color_int = first_span.get("color", 0)
                    hex_color = f"#{color_int:06x}" if isinstance(color_int, int) else "#000000"
                    
                    spans.append({
                        "id": f"span_{span_id}",
                        "text": line_text,
                        "bbox": line.get("bbox"),  # [x0, y0, x1, y1]
                        "size": first_span.get("size", 12),
                        "font": first_span.get("font", "Helvetica"),
                        "color": hex_color,
                        "page": page_index,
                        "flags": first_span.get("flags", 0)
                    })
                    span_id += 1
                    
    width = page.rect.width
    height = page.rect.height
    doc.close()
    return {"spans": spans, "width": width, "height": height}


def resolve_fitz_font(font_name: str = "Helvetica", bold: bool = False, italic: bool = False) -> str:
    """Map common frontend font family names and styles to valid PyMuPDF standard base-14 font names."""
    f = (font_name or "").lower()
    if "time" in f or "georgia" in f or "serif" in f:
        base = "tiro"
    elif "courier" in f or "mono" in f:
        base = "cour"
    else:
        base = "helv"

    is_bold = bold or ("bold" in f)
    is_italic = italic or ("italic" in f) or ("oblique" in f)

    if is_bold and is_italic:
        return f"{base}-bi"
    elif is_bold:
        return f"{base}-bo"
    elif is_italic:
        return f"{base}-it"
    return base


def hex_to_rgb(hex_str: str, default=(0.0, 0.0, 0.0)):
    if not hex_str:
        return default
    c = hex_str.lstrip("#")
    if len(c) == 6:
        try:
            return (int(c[0:2], 16) / 255.0, int(c[2:4], 16) / 255.0, int(c[4:6], 16) / 255.0)
        except Exception:
            return default
    elif len(c) == 3:
        try:
            return (int(c[0]*2, 16) / 255.0, int(c[1]*2, 16) / 255.0, int(c[2]*2, 16) / 255.0)
        except Exception:
            return default
    return default


@app.post("/api/edit-pdf")
async def edit_pdf(
    file: UploadFile = File(...),
    edits: str = Form(...),
    page_index: int = Form(0),
    pages_order: str = Form(None),
    rendered_width: float = Form(None),
    rendered_height: float = Form(None),
    deleted_spans: str = Form(None)
):
    try:
        content = await file.read()
        orig_doc = fitz.open(stream=content, filetype="pdf")

        # If pages_order is provided, construct the new document page-by-page
        if pages_order:
            try:
                order_list = json.loads(pages_order)
                doc = fitz.open()
                default_rect = orig_doc[0].rect if len(orig_doc) > 0 else fitz.Rect(0, 0, 595.28, 841.89)
                for item in order_list:
                    if item.get("type") == "original" and "sourceIndex" in item:
                        src_idx = item["sourceIndex"]
                        if 0 <= src_idx < len(orig_doc):
                            doc.insert_pdf(orig_doc, from_page=src_idx, to_page=src_idx)
                        else:
                            doc.new_page(width=default_rect.width, height=default_rect.height)
                    else:
                        # Blank page
                        doc.new_page(width=default_rect.width, height=default_rect.height)
                orig_doc.close()
            except Exception as e:
                print("Error parsing pages_order, falling back to orig_doc:", e)
                doc = orig_doc
        else:
            doc = orig_doc

        edit_list = json.loads(edits)

        # Expand doc if edits target added pages
        max_page_requested = max([e.get("page", 0) for e in edit_list], default=0)
        while len(doc) <= max_page_requested:
            last_rect = doc[-1].rect if len(doc) > 0 else fitz.Rect(0, 0, 595.28, 841.89)
            doc.new_page(width=last_rect.width, height=last_rect.height)

        # 1. Redact deleted spans if explicitly provided
        pages_to_apply = set()
        if deleted_spans:
            try:
                del_list = json.loads(deleted_spans)
                for item in del_list:
                    p_idx = item.get("page", 0)
                    bbox = item.get("bbox")
                    if 0 <= p_idx < len(doc) and bbox and len(bbox) == 4:
                        page = doc[p_idx]
                        r_scale = 1.0
                        if rendered_width and rendered_width > 0:
                            r_scale = page.rect.width / rendered_width
                        rect = fitz.Rect(
                            bbox[0] * r_scale - 1.5,
                            bbox[1] * r_scale - 1.5,
                            bbox[2] * r_scale + 1.5,
                            bbox[3] * r_scale + 1.5
                        )
                        page.add_redact_annot(rect)
                        pages_to_apply.add(p_idx)
            except Exception as e:
                print("Error redacting deleted_spans:", e)

        # 2. Redact original text positions where edits occur
        for edit in edit_list:
            p_idx = edit.get("page", page_index)
            if p_idx < 0 or p_idx >= len(doc):
                continue
            bbox = edit.get("original_bbox")
            if bbox and len(bbox) == 4:
                page = doc[p_idx]
                r_scale = 1.0
                if rendered_width and rendered_width > 0:
                    r_scale = page.rect.width / rendered_width
                rect = fitz.Rect(
                    bbox[0] * r_scale - 1.5,
                    bbox[1] * r_scale - 1.5,
                    bbox[2] * r_scale + 1.5,
                    bbox[3] * r_scale + 1.5
                )
                page.add_redact_annot(rect)
                pages_to_apply.add(p_idx)

        for p_idx in pages_to_apply:
            doc[p_idx].apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE)

        # 3. Draw shapes first (so text sits on top if overlapping)
        for edit in edit_list:
            if not edit.get("isShape"):
                continue
            p_idx = edit.get("page", page_index)
            if p_idx < 0 or p_idx >= len(doc):
                continue
            page = doc[p_idx]
            scale = 1.0
            if rendered_width and rendered_width > 0:
                scale = page.rect.width / rendered_width

            x = edit.get("x", 50) * scale
            y = edit.get("y", 50) * scale
            w = edit.get("width", 120) * scale
            h = edit.get("height", 60) * scale
            border_w = max(0.5, edit.get("borderWidth", 1) * scale)

            color = hex_to_rgb(edit.get("borderColor") or edit.get("color"), (0.3, 0.3, 0.9))
            bg_hex = edit.get("bgColor")
            fill = hex_to_rgb(bg_hex) if bg_hex and bg_hex != "transparent" else None
            shape_type = edit.get("shapeType", "rect")

            try:
                if shape_type == "circle":
                    radius = min(w, h) / 2
                    center = fitz.Point(x + radius, y + radius)
                    page.draw_circle(center, radius, color=color, fill=fill, width=border_w)
                elif shape_type in ("line", "headerLine", "footerLine"):
                    p1 = fitz.Point(x, y + h / 2)
                    p2 = fitz.Point(x + w, y + h / 2)
                    page.draw_line(p1, p2, color=color, width=border_w)
                else:
                    rect = fitz.Rect(x, y, x + w, y + h)
                    page.draw_rect(rect, color=color, fill=fill, width=border_w)
            except Exception as e:
                print(f"Error drawing shape {shape_type}:", e)

        # 4. Insert updated / new text at exact coordinates
        for edit in edit_list:
            p_idx = edit.get("page", page_index)
            if p_idx < 0 or p_idx >= len(doc):
                continue
            page = doc[p_idx]
            new_text = edit.get("new_text", "")
            if not new_text or not str(new_text).strip():
                continue

            scale = 1.0
            if rendered_width and rendered_width > 0:
                scale = page.rect.width / rendered_width

            size = max(6.0, float(edit.get("size", 12)) * scale)
            color = hex_to_rgb(edit.get("color", "#000000"))

            fontname = resolve_fitz_font(
                edit.get("font", "helv"),
                bold=bool(edit.get("bold")),
                italic=bool(edit.get("italic"))
            )

            # Prioritize current canvas position x, y; fall back to original_bbox
            if "x" in edit and "y" in edit:
                x = edit["x"] * scale
                y = edit["y"] * scale
            elif edit.get("original_bbox") and len(edit["original_bbox"]) == 4:
                x = edit["original_bbox"][0] * scale
                y = edit["original_bbox"][1] * scale
            else:
                x = 50.0 * scale
                y = 50.0 * scale

            align_code = 0
            if edit.get("align") == "center":
                align_code = 1
            elif edit.get("align") == "right":
                align_code = 2

            # Give sufficient bounding box for multiple lines or long text
            target_w = edit.get("width", max(300, len(new_text) * size * 0.7)) * scale
            target_h = max(size * 2.5, 40.0 * scale)
            rect = fitz.Rect(x, y, min(page.rect.width - 5, x + target_w), y + target_h)

            try:
                page.insert_textbox(rect, new_text, fontsize=size, fontname=fontname, color=color, align=align_code)
            except Exception as e1:
                # Safe fallback to standard base helv
                try:
                    page.insert_textbox(rect, new_text, fontsize=size, fontname="helv", color=color, align=align_code)
                except Exception as e2:
                    print(f"Failed to insert text '{new_text[:30]}':", e2)

        out_pdf = io.BytesIO()
        doc.save(out_pdf)
        doc.close()

        return Response(
            content=out_pdf.getvalue(),
            media_type="application/pdf"
        )
    except Exception as e:
        print("Fatal error in edit_pdf:", e)
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

