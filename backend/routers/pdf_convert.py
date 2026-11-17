from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
import fitz, uuid, os, zipfile, base64
from utils.pdf_helpers import save_upload

router = APIRouter(tags=["convert"])

@router.post("/convert/to-docx")
async def to_docx(file: UploadFile = File(...)):
    path = await save_upload(file)
    out = f"uploads/{uuid.uuid4()}.docx"
    try:
        from pdf2docx import Converter
        cv = Converter(path)
        cv.convert(out)
        cv.close()
    except Exception as e:
        raise HTTPException(500, f"Conversion failed: {e}")
    return FileResponse(out, media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document", filename="converted.docx")

@router.post("/convert/to-images")
async def to_images(file: UploadFile = File(...), format: str = Form("png"), zoom: float = Form(2.0)):
    path = await save_upload(file)
    doc = fitz.open(path)
    zip_path = f"uploads/{uuid.uuid4()}_images.zip"
    with zipfile.ZipFile(zip_path, 'w') as zf:
        for i, page in enumerate(doc):
            mat = fitz.Matrix(zoom, zoom)
            pix = page.get_pixmap(matrix=mat)
            img_path = f"uploads/{uuid.uuid4()}_page{i}.{format}"
            pix.save(img_path)
            zf.write(img_path, f"page_{i+1}.{format}")
            os.remove(img_path)
    doc.close()
    return FileResponse(zip_path, media_type="application/zip", filename="pages.zip")

@router.post("/convert/to-text")
async def to_text(file: UploadFile = File(...)):
    path = await save_upload(file)
    doc = fitz.open(path)
    text = ""
    for page in doc:
        text += page.get_text() + "\n\n"
    doc.close()
    out = f"uploads/{uuid.uuid4()}.txt"
    with open(out, 'w', encoding='utf-8') as f:
        f.write(text)
    return FileResponse(out, media_type="text/plain", filename="extracted.txt")

@router.post("/convert/to-html")
async def to_html(file: UploadFile = File(...)):
    path = await save_upload(file)
    doc = fitz.open(path)
    html = "<html><body>"
    for i, page in enumerate(doc):
        html += f"<div class='page' id='page-{i+1}'>"
        html += page.get_text("html")
        html += "</div><hr>"
    html += "</body></html>"
    doc.close()
    out = f"uploads/{uuid.uuid4()}.html"
    with open(out, 'w', encoding='utf-8') as f:
        f.write(html)
    return FileResponse(out, media_type="text/html", filename="converted.html")

@router.post("/convert/compress")
async def compress_pdf(file: UploadFile = File(...), quality: str = Form("medium")):
    path = await save_upload(file)
    doc = fitz.open(path)
    out = f"uploads/{uuid.uuid4()}_compressed.pdf"

    garbage = {"low": 1, "medium": 3, "high": 4}.get(quality, 3)
    deflate = quality != "low"

    doc.save(out, garbage=garbage, deflate=deflate, deflate_images=True, deflate_fonts=True)
    doc.close()

    orig_size = os.path.getsize(path)
    new_size = os.path.getsize(out)

    return FileResponse(out, media_type="application/pdf", filename="compressed.pdf",
                       headers={"X-Original-Size": str(orig_size), "X-Compressed-Size": str(new_size)})

@router.post("/convert/ocr")
async def ocr_pdf(file: UploadFile = File(...), language: str = Form("eng")):
    path = await save_upload(file)
    try:
        import pytesseract
        from PIL import Image
        import io
    except ImportError:
        raise HTTPException(500, "pytesseract or PIL not installed")

    doc = fitz.open(path)
    new_doc = fitz.open()

    for page in doc:
        mat = fitz.Matrix(2, 2)
        pix = page.get_pixmap(matrix=mat)
        img_bytes = pix.tobytes("png")
        img = Image.open(io.BytesIO(img_bytes))

        ocr_text = pytesseract.image_to_string(img, lang=language)

        new_page = new_doc.new_page(width=page.rect.width, height=page.rect.height)
        new_page.insert_text(fitz.Point(50, 50), ocr_text, fontsize=10)

    doc.close()
    out = f"uploads/{uuid.uuid4()}_ocr.pdf"
    new_doc.save(out); new_doc.close()
    return FileResponse(out, media_type="application/pdf", filename="ocr_result.pdf")
