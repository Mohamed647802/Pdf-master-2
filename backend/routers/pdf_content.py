from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
import fitz, json, uuid, math
from utils.pdf_helpers import save_upload

router = APIRouter(tags=["content"])

@router.post("/content/watermark")
async def add_watermark(
    file: UploadFile = File(...),
    text: str = Form("WATERMARK"),
    opacity: float = Form(0.3),
    angle: float = Form(45),
    font_size: float = Form(60),
    color: str = Form("#FF0000"),
    all_pages: bool = Form(True),
    page_index: int = Form(0)
):
    path = await save_upload(file)
    doc = fitz.open(path)

    def hex_to_rgb(h):
        h = h.lstrip('#')
        return tuple(int(h[i:i+2], 16)/255.0 for i in (0, 2, 4))

    rgb = hex_to_rgb(color)
    pages = range(len(doc)) if all_pages else [page_index]

    for pi in pages:
        page = doc[pi]
        cx, cy = page.rect.width / 2, page.rect.height / 2
        angle_rad = math.radians(angle)
        page.insert_text(
            fitz.Point(cx - len(text) * font_size * 0.3, cy),
            text,
            fontsize=font_size,
            color=rgb,
            morph=(fitz.Point(cx, cy), fitz.Matrix(math.cos(angle_rad), math.sin(angle_rad), -math.sin(angle_rad), math.cos(angle_rad), 0, 0))
        )

    out = f"uploads/{uuid.uuid4()}_wm.pdf"
    doc.save(out); doc.close()
    return FileResponse(out, media_type="application/pdf", filename="watermarked.pdf")

@router.post("/content/header-footer")
async def add_header_footer(
    file: UploadFile = File(...),
    header_text: str = Form(""),
    footer_text: str = Form(""),
    include_page_number: bool = Form(True),
    include_date: bool = Form(False),
    font_size: float = Form(10),
    margin: float = Form(30)
):
    from datetime import datetime
    path = await save_upload(file)
    doc = fitz.open(path)
    today = datetime.now().strftime("%Y-%m-%d")

    for i, page in enumerate(doc):
        w = page.rect.width
        h = page.rect.height

        h_text = header_text
        if include_date: h_text += f"  {today}"

        f_text = footer_text
        if include_page_number: f_text += f"  Page {i+1} of {len(doc)}"

        if h_text:
            page.insert_text(fitz.Point(margin, margin), h_text, fontsize=font_size, color=(0, 0, 0))
        if f_text:
            page.insert_text(fitz.Point(margin, h - margin), f_text, fontsize=font_size, color=(0, 0, 0))

    out = f"uploads/{uuid.uuid4()}_hf.pdf"
    doc.save(out); doc.close()
    return FileResponse(out, media_type="application/pdf", filename="headerfooter.pdf")

@router.get("/content/bookmarks/{filename}")
async def get_bookmarks(filename: str):
    path = f"uploads/{filename}"
    doc = fitz.open(path)
    toc = doc.get_toc()
    doc.close()
    return [{"level": t[0], "title": t[1], "page": t[2]} for t in toc]

@router.post("/content/add-bookmark")
async def add_bookmark(
    file: UploadFile = File(...),
    title: str = Form(...),
    page_index: int = Form(0),
    level: int = Form(1)
):
    path = await save_upload(file)
    doc = fitz.open(path)
    toc = doc.get_toc()
    toc.append([level, title, page_index + 1])
    doc.set_toc(toc)
    out = f"uploads/{uuid.uuid4()}_bm.pdf"
    doc.save(out); doc.close()
    return FileResponse(out, media_type="application/pdf", filename="bookmarked.pdf")

@router.post("/content/delete-bookmark")
async def delete_bookmark(
    file: UploadFile = File(...),
    bookmark_index: int = Form(0)
):
    path = await save_upload(file)
    doc = fitz.open(path)
    toc = doc.get_toc()
    if bookmark_index < len(toc):
        toc.pop(bookmark_index)
    doc.set_toc(toc)
    out = f"uploads/{uuid.uuid4()}_bm.pdf"
    doc.save(out); doc.close()
    return FileResponse(out, media_type="application/pdf", filename="bookmarked.pdf")

@router.post("/content/add-link")
async def add_link(
    file: UploadFile = File(...),
    page_index: int = Form(0),
    x1: float = Form(100), y1: float = Form(100),
    x2: float = Form(200), y2: float = Form(120),
    url: str = Form("https://example.com")
):
    path = await save_upload(file)
    doc = fitz.open(path)
    page = doc[page_index]
    link = {"kind": fitz.LINK_URI, "from": fitz.Rect(x1, y1, x2, y2), "uri": url}
    page.insert_link(link)
    out = f"uploads/{uuid.uuid4()}_link.pdf"
    doc.save(out); doc.close()
    return FileResponse(out, media_type="application/pdf", filename="linked.pdf")

@router.post("/content/redact")
async def redact_content(
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
    out = f"uploads/{uuid.uuid4()}_redact.pdf"
    doc.save(out); doc.close()
    return FileResponse(out, media_type="application/pdf", filename="redacted.pdf")
