from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
import fitz, uuid
from utils.pdf_helpers import save_upload

router = APIRouter(tags=["security"])

@router.post("/security/add-password")
async def add_password(
    file: UploadFile = File(...),
    user_password: str = Form(""),
    owner_password: str = Form(""),
    allow_print: bool = Form(True),
    allow_copy: bool = Form(True),
    allow_edit: bool = Form(True)
):
    path = await save_upload(file)
    doc = fitz.open(path)

    perm = fitz.PDF_PERM_ACCESSIBILITY
    if allow_print: perm |= fitz.PDF_PERM_PRINT | fitz.PDF_PERM_PRINT_HQ
    if allow_copy: perm |= fitz.PDF_PERM_COPY
    if allow_edit: perm |= fitz.PDF_PERM_MODIFY | fitz.PDF_PERM_ANNOTATE | fitz.PDF_PERM_FORM

    encrypt = fitz.PDF_ENCRYPT_AES_256
    out = f"uploads/{uuid.uuid4()}_secure.pdf"
    doc.save(out, encryption=encrypt, user_pw=user_password, owner_pw=owner_password or user_password, permissions=perm)
    doc.close()
    return FileResponse(out, media_type="application/pdf", filename="secured.pdf")

@router.post("/security/remove-password")
async def remove_password(
    file: UploadFile = File(...),
    password: str = Form(...)
):
    path = await save_upload(file)
    doc = fitz.open(path)
    if doc.is_encrypted:
        if not doc.authenticate(password):
            raise HTTPException(401, "Wrong password")
    out = f"uploads/{uuid.uuid4()}_unlocked.pdf"
    doc.save(out, encryption=fitz.PDF_ENCRYPT_NONE)
    doc.close()
    return FileResponse(out, media_type="application/pdf", filename="unlocked.pdf")

@router.get("/security/metadata/{filename}")
async def get_metadata(filename: str):
    path = f"uploads/{filename}"
    doc = fitz.open(path)
    meta = doc.metadata
    doc.close()
    return meta

@router.post("/security/metadata")
async def update_metadata(
    file: UploadFile = File(...),
    title: str = Form(""),
    author: str = Form(""),
    subject: str = Form(""),
    keywords: str = Form(""),
    creator: str = Form("")
):
    path = await save_upload(file)
    doc = fitz.open(path)
    meta = doc.metadata
    if title: meta["title"] = title
    if author: meta["author"] = author
    if subject: meta["subject"] = subject
    if keywords: meta["keywords"] = keywords
    if creator: meta["creator"] = creator
    doc.set_metadata(meta)
    out = f"uploads/{uuid.uuid4()}_meta.pdf"
    doc.save(out); doc.close()
    return FileResponse(out, media_type="application/pdf", filename="updated.pdf")
