from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
import fitz, json, uuid
from utils.pdf_helpers import save_upload
from datetime import datetime

router = APIRouter(tags=["annotate"])

@router.post("/annotate/highlight")
async def highlight_text(
    file: UploadFile = File(...),
    page_index: int = Form(0),
    quads: str = Form(...),
    color: str = Form("#FFFF00")
):
    path = await save_upload(file)
    doc = fitz.open(path)
    page = doc[page_index]
    quad_list = json.loads(quads)

    def hex_to_rgb(h):
        h = h.lstrip('#')
        return tuple(int(h[i:i+2], 16)/255.0 for i in (0, 2, 4))

    for q in quad_list:
        rect = fitz.Rect(q[0], q[1], q[2], q[3])
        annot = page.add_highlight_annot(rect)
        annot.set_colors(stroke=hex_to_rgb(color))
        annot.update()

    out = f"uploads/{uuid.uuid4()}_annot.pdf"
    doc.save(out); doc.close()
    return FileResponse(out, media_type="application/pdf", filename="annotated.pdf")

@router.post("/annotate/strikethrough")
async def strikethrough(
    file: UploadFile = File(...),
    page_index: int = Form(0),
    quads: str = Form(...)
):
    path = await save_upload(file)
    doc = fitz.open(path)
    page = doc[page_index]
    for q in json.loads(quads):
        page.add_strikeout_annot(fitz.Rect(q[0], q[1], q[2], q[3]))
    out = f"uploads/{uuid.uuid4()}_annot.pdf"
    doc.save(out); doc.close()
    return FileResponse(out, media_type="application/pdf", filename="annotated.pdf")

@router.post("/annotate/underline")
async def underline_text(
    file: UploadFile = File(...),
    page_index: int = Form(0),
    quads: str = Form(...),
    squiggly: bool = Form(False)
):
    path = await save_upload(file)
    doc = fitz.open(path)
    page = doc[page_index]
    for q in json.loads(quads):
        rect = fitz.Rect(q[0], q[1], q[2], q[3])
        if squiggly:
            page.add_squiggly_annot(rect)
        else:
            page.add_underline_annot(rect)
    out = f"uploads/{uuid.uuid4()}_annot.pdf"
    doc.save(out); doc.close()
    return FileResponse(out, media_type="application/pdf", filename="annotated.pdf")

@router.post("/annotate/sticky-note")
async def add_sticky_note(
    file: UploadFile = File(...),
    page_index: int = Form(0),
    x: float = Form(100),
    y: float = Form(100),
    content: str = Form("Note"),
    author: str = Form("User")
):
    path = await save_upload(file)
    doc = fitz.open(path)
    page = doc[page_index]
    point = fitz.Point(x, y)
    annot = page.add_text_annot(point, content)
    info = annot.info
    info["title"] = author
    info["creationDate"] = datetime.now().strftime("D:%Y%m%d%H%M%S")
    annot.set_info(info)
    annot.update()
    out = f"uploads/{uuid.uuid4()}_annot.pdf"
    doc.save(out); doc.close()
    return FileResponse(out, media_type="application/pdf", filename="annotated.pdf")

@router.post("/annotate/delete")
async def delete_annotation(
    file: UploadFile = File(...),
    page_index: int = Form(0),
    annot_index: int = Form(0)
):
    path = await save_upload(file)
    doc = fitz.open(path)
    page = doc[page_index]
    annots = list(page.annots())
    if annot_index < len(annots):
        page.delete_annot(annots[annot_index])
    out = f"uploads/{uuid.uuid4()}_annot.pdf"
    doc.save(out); doc.close()
    return FileResponse(out, media_type="application/pdf", filename="annotated.pdf")

@router.get("/annotate/list/{filename}/{page}")
async def list_annotations(filename: str, page: int):
    path = f"uploads/{filename}"
    doc = fitz.open(path)
    p = doc[page]
    result = []
    for i, a in enumerate(p.annots()):
        result.append({"index": i, "type": a.type[1], "rect": list(a.rect), "info": a.info})
    doc.close()
    return result
