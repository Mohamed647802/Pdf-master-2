from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
import fitz, json, uuid
from utils.pdf_helpers import save_upload

router = APIRouter(tags=["forms"])

@router.post("/forms/add-field")
async def add_form_field(
    file: UploadFile = File(...),
    page_index: int = Form(0),
    field_type: str = Form("text"),
    name: str = Form("field1"),
    x1: float = Form(100), y1: float = Form(100),
    x2: float = Form(300), y2: float = Form(120),
    value: str = Form(""),
    options: str = Form("[]")
):
    path = await save_upload(file)
    doc = fitz.open(path)
    page = doc[page_index]

    widget = fitz.Widget()
    widget.rect = fitz.Rect(x1, y1, x2, y2)
    widget.field_name = name
    widget.field_value = value

    if field_type == "text":
        widget.field_type = fitz.PDF_WIDGET_TYPE_TEXT
    elif field_type == "checkbox":
        widget.field_type = fitz.PDF_WIDGET_TYPE_CHECKBOX
        widget.field_value = "Yes" if value else "Off"
    elif field_type == "radio":
        widget.field_type = fitz.PDF_WIDGET_TYPE_RADIOBUTTON
    elif field_type == "dropdown":
        widget.field_type = fitz.PDF_WIDGET_TYPE_LISTBOX
        widget.choice_values = json.loads(options)
    elif field_type == "signature":
        widget.field_type = fitz.PDF_WIDGET_TYPE_SIGNATURE

    page.add_widget(widget)
    out = f"uploads/{uuid.uuid4()}_form.pdf"
    doc.save(out); doc.close()
    return FileResponse(out, media_type="application/pdf", filename="form.pdf")

@router.post("/forms/fill")
async def fill_form(
    file: UploadFile = File(...),
    fields: str = Form(...)
):
    path = await save_upload(file)
    doc = fitz.open(path)
    field_values = json.loads(fields)

    for page in doc:
        for widget in page.widgets():
            if widget.field_name in field_values:
                widget.field_value = field_values[widget.field_name]
                widget.update()

    out = f"uploads/{uuid.uuid4()}_filled.pdf"
    doc.save(out); doc.close()
    return FileResponse(out, media_type="application/pdf", filename="filled.pdf")

@router.post("/forms/flatten")
async def flatten_forms(file: UploadFile = File(...)):
    path = await save_upload(file)
    doc = fitz.open(path)
    for page in doc:
        for widget in page.widgets():
            page.delete_widget(widget)
    out = f"uploads/{uuid.uuid4()}_flat.pdf"
    doc.save(out); doc.close()
    return FileResponse(out, media_type="application/pdf", filename="flattened.pdf")

@router.get("/forms/list/{filename}")
async def list_form_fields(filename: str):
    path = f"uploads/{filename}"
    doc = fitz.open(path)
    fields = []
    for page_num, page in enumerate(doc):
        for w in page.widgets():
            fields.append({
                "page": page_num,
                "name": w.field_name,
                "type": w.field_type_string,
                "value": w.field_value,
                "rect": list(w.rect)
            })
    doc.close()
    return fields
