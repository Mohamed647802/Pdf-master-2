from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routers import pdf_edit, pdf_pages, pdf_forms, pdf_security, pdf_content, pdf_convert, pdf_annotate
import os

app = FastAPI(title="PDF Master Editor API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.include_router(pdf_edit.router, prefix="/api")
app.include_router(pdf_pages.router, prefix="/api")
app.include_router(pdf_forms.router, prefix="/api")
app.include_router(pdf_security.router, prefix="/api")
app.include_router(pdf_content.router, prefix="/api")
app.include_router(pdf_convert.router, prefix="/api")
app.include_router(pdf_annotate.router, prefix="/api")

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

@app.get("/health")
def health(): return {"status": "ok"}
