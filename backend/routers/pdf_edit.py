from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
import fitz
import json, os, base64, uuid
from utils.pdf_helpers import save_upload

router = APIRouter(tags=["edit"])

@router.post("/pdf/upload")
async def upload_pdf(file: UploadFile = File(...)):
    path = await save_upload(file)
    filename = os.path.basename(path)
    doc = fitz.open(path)
    page_count = len(doc)
    doc.close()
    return {"filename": filename, "page_count": page_count, "path": path}

@router.post("/pdf/add-text")
async def add_text(
    file: UploadFile = File(...),
    page_index: int = Form(0),
    x: float = Form(100),
    y: float = Form(100),
    text: str = Form("Sample Text"),
    font_size: float = Form(12),
    font_name: str = Form("helv"),
    color: str = Form("#000000"),
    bold: bool = Form(False),
    italic: bool = Form(False)
):
    path = await save_upload(file)
    doc = fitz.open(path)
    page = doc[page_index]

    def hex_to_rgb(h):
        h = h.lstrip('#')
        return tuple(int(h[i:i+2], 16)/255.0 for i in (0, 2, 4))

    rgb = hex_to_rgb(color)

    # Choose font
    fn = font_name
    if bold and italic: fn = "tibo"
    elif bold: fn = "tibd" if "times" in font_name.lower() else "helv"
    elif italic: fn = "tiit" if "times" in font_name.lower() else "helv"

    page.insert_text(
        fitz.Point(x, y),
        text,
        fontsize=font_size,
        fontname=fn,
        color=rgb
    )

    out = f"uploads/{uuid.uuid4()}_edit.pdf"
    doc.save(out); doc.close()
    return FileResponse(out, media_type="application/pdf", filename="edited.pdf")

@router.post("/pdf/add-image")
async def add_image(
    pdf_file: UploadFile = File(...),
    img_file: UploadFile = File(...),
    page_index: int = Form(0),
    x: float = Form(100),
    y: float = Form(100),
    width: float = Form(200),
    height: float = Form(200)
):
    pdf_path = await save_upload(pdf_file)
    img_path = await save_upload(img_file)

    doc = fitz.open(pdf_path)
    page = doc[page_index]
    rect = fitz.Rect(x, y, x + width, y + height)
    page.insert_image(rect, filename=img_path)

    out = f"uploads/{uuid.uuid4()}_edit.pdf"
    doc.save(out); doc.close()
    return FileResponse(out, media_type="application/pdf", filename="edited.pdf")

@router.post("/pdf/draw")
async def draw_shape(
    file: UploadFile = File(...),
    page_index: int = Form(0),
    shape: str = Form("rectangle"),
    x1: float = Form(100), y1: float = Form(100),
    x2: float = Form(200), y2: float = Form(200),
    color: str = Form("#000000"),
    fill_color: str = Form(""),
    stroke_width: float = Form(1),
    points: str = Form("[]")
):
    path = await save_upload(file)
    doc = fitz.open(path)
    page = doc[page_index]

    def hex_to_rgb(h):
        if not h: return None
        h = h.lstrip('#')
        return tuple(int(h[i:i+2], 16)/255.0 for i in (0, 2, 4))

    stroke = hex_to_rgb(color)
    fill = hex_to_rgb(fill_color) if fill_color else None

    shape_obj = page.new_shape()

    if shape == "rectangle":
        shape_obj.draw_rect(fitz.Rect(x1, y1, x2, y2))
    elif shape == "circle" or shape == "ellipse":
        shape_obj.draw_ellipse(fitz.Rect(x1, y1, x2, y2))
    elif shape == "line":
        shape_obj.draw_line(fitz.Point(x1, y1), fitz.Point(x2, y2))
    elif shape == "arrow":
        shape_obj.draw_line(fitz.Point(x1, y1), fitz.Point(x2, y2))
        import math
        angle = math.atan2(y2 - y1, x2 - x1)
        arrow_len = 15
        for a in [angle + 2.5, angle - 2.5]:
            ax = x2 - arrow_len * math.cos(a)
            ay = y2 - arrow_len * math.sin(a)
            shape_obj.draw_line(fitz.Point(x2, y2), fitz.Point(ax, ay))
    elif shape == "freehand":
        pts = json.loads(points)
        if len(pts) >= 2:
            shape_obj.draw_polyline([fitz.Point(p[0], p[1]) for p in pts])

    shape_obj.finish(color=stroke, fill=fill, width=stroke_width)
    shape_obj.commit()

    out = f"uploads/{uuid.uuid4()}_edit.pdf"
    doc.save(out); doc.close()
    return FileResponse(out, media_type="application/pdf", filename="edited.pdf")

@router.post("/pdf/redact-region")
async def redact_region(
    file: UploadFile = File(...),
    page_index: int = Form(0),
    x1: float = Form(0), y1: float = Form(0),
    x2: float = Form(100), y2: float = Form(100)
):
    path = await save_upload(file)
    doc = fitz.open(path)
    page = doc[page_index]
    page.add_redact_annot(fitz.Rect(x1, y1, x2, y2))
    page.apply_redactions()
    out = f"uploads/{uuid.uuid4()}_edit.pdf"
    doc.save(out); doc.close()
    return FileResponse(out, media_type="application/pdf", filename="redacted.pdf")

@router.get("/pdf/render/{filename}/{page}")
async def render_page(filename: str, page: int, zoom: float = 1.5):
    path = f"uploads/{filename}"
    if not os.path.exists(path):
        raise HTTPException(404, "File not found")
    doc = fitz.open(path)
    if page >= len(doc):
        raise HTTPException(400, "Page out of range")
    p = doc[page]
    mat = fitz.Matrix(zoom, zoom)
    pix = p.get_pixmap(matrix=mat)
    img_bytes = pix.tobytes("png")
    b64 = base64.b64encode(img_bytes).decode()
    doc.close()
    return {"image": b64, "width": p.rect.width * zoom, "height": p.rect.height * zoom}
