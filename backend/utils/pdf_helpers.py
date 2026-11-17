import fitz, os, base64, uuid, time
from fastapi import UploadFile
import aiofiles

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def save_upload(file: UploadFile) -> str:
    ext = os.path.splitext(file.filename)[1] if file.filename else ".pdf"
    filename = f"{uuid.uuid4()}{ext}"
    path = os.path.join(UPLOAD_DIR, filename)
    async with aiofiles.open(path, 'wb') as f:
        content = await file.read()
        await f.write(content)
    return path

def page_to_base64(page: fitz.Page, zoom: float = 0.5) -> str:
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat)
    img_bytes = pix.tobytes("png")
    return base64.b64encode(img_bytes).decode()

def cleanup_old_files(max_age_seconds: int = 3600):
    now = time.time()
    for fname in os.listdir(UPLOAD_DIR):
        fpath = os.path.join(UPLOAD_DIR, fname)
        if os.path.isfile(fpath):
            age = now - os.path.getmtime(fpath)
            if age > max_age_seconds:
                try: os.remove(fpath)
                except: pass
