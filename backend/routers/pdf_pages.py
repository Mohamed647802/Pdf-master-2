from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse, JSONResponse
import fitz  # pymupdf
import os, json, base64, io, tempfile
from utils.pdf_helpers import save_upload, page_to_base64, cleanup_old_files

router = APIRouter(tags=["pages"])

@router.post("/pages/add-blank")
async def add_blank_page(file: UploadFile = File(...), page_index: int = Form(-1), width: float = Form(595), height: float = Form(842)):
    path = await save_upload(file)
    doc = fitz.open(path)
    if page_index < 0: page_index = len(doc)
    doc.insert_page(page_index, width=width, height=height)
    out = path.replace(".pdf", "_modified.pdf")
    doc.save(out); doc.close()
    return FileResponse(out, media_type="application/pdf", filename="modified.pdf")

@router.post("/pages/duplicate")
async def duplicate_page(file: UploadFile = File(...), page_index: int = Form(0)):
    path = await save_upload(file)
    doc = fitz.open(path)
    doc.copy_page(page_index)
    out = path.replace(".pdf", "_modified.pdf")
    doc.save(out); doc.close()
    return FileResponse(out, media_type="application/pdf", filename="modified.pdf")

@router.post("/pages/delete")
async def delete_pages(file: UploadFile = File(...), page_indices: str = Form(...)):
    path = await save_upload(file)
    doc = fitz.open(path)
    indices = sorted(json.loads(page_indices), reverse=True)
    for i in indices:
        doc.delete_page(i)
    out = path.replace(".pdf", "_modified.pdf")
    doc.save(out); doc.close()
    return FileResponse(out, media_type="application/pdf", filename="modified.pdf")

@router.post("/pages/reorder")
async def reorder_pages(file: UploadFile = File(...), new_order: str = Form(...)):
    path = await save_upload(file)
    doc = fitz.open(path)
    order = json.loads(new_order)
    doc.select(order)
    out = path.replace(".pdf", "_modified.pdf")
    doc.save(out); doc.close()
    return FileResponse(out, media_type="application/pdf", filename="modified.pdf")

@router.post("/pages/rotate")
async def rotate_pages(file: UploadFile = File(...), page_indices: str = Form(...), degrees: int = Form(90)):
    path = await save_upload(file)
    doc = fitz.open(path)
    indices = json.loads(page_indices)
    for i in indices:
        page = doc[i]
        page.set_rotation(page.rotation + degrees)
    out = path.replace(".pdf", "_modified.pdf")
    doc.save(out); doc.close()
    return FileResponse(out, media_type="application/pdf", filename="modified.pdf")

@router.post("/pages/crop")
async def crop_page(file: UploadFile = File(...), page_index: int = Form(0), left: float = Form(0), top: float = Form(0), right: float = Form(0), bottom: float = Form(0)):
    path = await save_upload(file)
    doc = fitz.open(path)
    page = doc[page_index]
    rect = page.rect
    new_rect = fitz.Rect(rect.x0 + left, rect.y0 + top, rect.x1 - right, rect.y1 - bottom)
    page.set_cropbox(new_rect)
    out = path.replace(".pdf", "_modified.pdf")
    doc.save(out); doc.close()
    return FileResponse(out, media_type="application/pdf", filename="modified.pdf")

@router.post("/pages/merge")
async def merge_pdfs(files: list[UploadFile] = File(...)):
    merged = fitz.open()
    for f in files:
        path = await save_upload(f)
        doc = fitz.open(path)
        merged.insert_pdf(doc)
        doc.close()
    import uuid
    out = f"uploads/{uuid.uuid4()}_merged.pdf"
    merged.save(out); merged.close()
    return FileResponse(out, media_type="application/pdf", filename="merged.pdf")

@router.post("/pages/split")
async def split_pdf(file: UploadFile = File(...), ranges: str = Form(...)):
    path = await save_upload(file)
    doc = fitz.open(path)
    page_ranges = json.loads(ranges)
    import uuid, zipfile
    zip_path = f"uploads/{uuid.uuid4()}_split.zip"
    with zipfile.ZipFile(zip_path, 'w') as zf:
        for idx, r in enumerate(page_ranges):
            new_doc = fitz.open()
            new_doc.insert_pdf(doc, from_page=r[0], to_page=r[1])
            tmp = f"uploads/{uuid.uuid4()}_part{idx+1}.pdf"
            new_doc.save(tmp); new_doc.close()
            zf.write(tmp, f"part{idx+1}.pdf")
            os.remove(tmp)
    doc.close()
    return FileResponse(zip_path, media_type="application/zip", filename="split.zip")

@router.get("/pages/thumbnail/{filename}/{page}")
async def get_thumbnail(filename: str, page: int, zoom: float = 0.5):
    path = f"uploads/{filename}"
    if not os.path.exists(path):
        raise HTTPException(404, "File not found")
    doc = fitz.open(path)
    if page >= len(doc):
        raise HTTPException(400, "Page out of range")
    b64 = page_to_base64(doc[page], zoom=zoom)
    doc.close()
    return {"thumbnail": b64, "page": page}

@router.get("/pages/info/{filename}")
async def get_pdf_info(filename: str):
    path = f"uploads/{filename}"
    if not os.path.exists(path):
        raise HTTPException(404, "File not found")
    doc = fitz.open(path)
    info = {"page_count": len(doc), "metadata": doc.metadata, "pages": []}
    for i, p in enumerate(doc):
        info["pages"].append({"index": i, "width": p.rect.width, "height": p.rect.height, "rotation": p.rotation})
    doc.close()
    return info
