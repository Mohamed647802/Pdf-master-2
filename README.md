# ╔═══════════════════════════════════════════╗
# ║      PDF MASTER EDITOR v1.0               ║
# ║   Full-Featured PDF Editing Suite         ║
# ╚═══════════════════════════════════════════╝

<div align="center">

```
██████╗ ██████╗ ███████╗    ███╗   ███╗ █████╗ ███████╗████████╗███████╗██████╗
██╔══██╗██╔══██╗██╔════╝    ████╗ ████║██╔══██╗██╔════╝╚══██╔══╝██╔════╝██╔══██╗
██████╔╝██║  ██║█████╗      ██╔████╔██║███████║███████╗   ██║   █████╗  ██████╔╝
██╔═══╝ ██║  ██║██╔══╝      ██║╚██╔╝██║██╔══██║╚════██║   ██║   ██╔══╝  ██╔══██╗
██║     ██████╔╝██║         ██║ ╚═╝ ██║██║  ██║███████║   ██║   ███████╗██║  ██║
╚═╝     ╚═════╝ ╚═╝         ╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
```

**The ultimate full-featured PDF editing suite — built with FastAPI + React**

[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## ✨ Features

### 📄 Page Management
- ➕ **Add blank pages** — Insert new pages at any position
- 🔄 **Reorder pages** — Drag & drop page reordering
- 🗑️ **Delete pages** — Remove single or multiple pages
- 📋 **Duplicate pages** — Clone any page instantly
- ✂️ **Split PDF** — Divide one PDF into multiple files
- 🔗 **Merge PDFs** — Combine multiple PDFs into one
- 🔁 **Rotate pages** — Rotate 90°, 180°, 270°
- 📐 **Crop pages** — Trim page margins and content

### ✏️ Content Editing
- 📝 **Edit text** — Modify existing text directly in PDF
- 🖼️ **Insert images** — Add images at any position
- 🔤 **Add text boxes** — Create new text overlays
- 📏 **Draw shapes** — Rectangles, circles, lines, arrows
- ✍️ **Freehand drawing** — Pen tool for free-form drawing
- 🎨 **Redact content** — Permanently black out sensitive text

### 🔒 Security
- 🔐 **Password protect** — Add owner & user passwords
- 🔓 **Remove password** — Decrypt PDFs with known password
- 📜 **Set permissions** — Control printing, copying, editing
- 🛡️ **Digital signatures** — Add and verify signatures
- 🔏 **Watermarks** — Add text or image watermarks

### 💬 Annotations
- 📌 **Sticky notes** — Add comment annotations
- 🖊️ **Highlight text** — Yellow/colored text highlighting
- ✏️ **Underline/Strikethrough** — Text decorations
- 📎 **Stamps** — Apply standard stamps (DRAFT, APPROVED, etc.)
- 🔗 **Hyperlinks** — Add clickable links to pages

### 📊 Forms
- 📋 **Fill forms** — Complete PDF form fields interactively
- ✅ **Checkboxes** — Toggle checkbox fields
- 🔘 **Radio buttons** — Select radio button groups
- 📝 **Create form fields** — Design new form elements
- 💾 **Export form data** — Export to JSON/CSV

### 🔄 Conversion
- 📄 **PDF → Word** — Convert to .docx format
- 📊 **PDF → Excel** — Convert to .xlsx spreadsheets
- 🖼️ **PDF → Images** — Export pages as PNG/JPG
- 📑 **Word → PDF** — Convert .docx to PDF
- 📸 **Images → PDF** — Merge images into a PDF
- 🔍 **OCR** — Extract text from scanned PDFs (requires Tesseract)

### 🎯 Advanced
- 📖 **Table of Contents** — Generate/edit bookmarks
- ℹ️ **Document info** — Edit title, author, keywords
- 🗜️ **Compress PDF** — Reduce file size
- 🖨️ **Print** — Print directly from browser
- 📱 **PWA Support** — Install as a native-like app
- 🌙 **Dark Mode** — Eye-friendly dark interface

---

## 📋 Requirements

| Requirement | Version | Notes |
|-------------|---------|-------|
| **Python** | 3.9+ | Backend runtime |
| **Node.js** | 16+ | Frontend build tool |
| **npm** | 8+ | Package manager |
| **Tesseract OCR** | 5.0+ | ⚠️ Optional — only for OCR feature |

### Installing Tesseract OCR (Optional)
- **Windows**: Download installer from [UB-Mannheim/tesseract](https://github.com/UB-Mannheim/tesseract/wiki)
- **macOS**: `brew install tesseract`
- **Linux**: `sudo apt install tesseract-ocr`

---

## 🚀 Quick Start

> **Windows Users**: Just double-click `start.bat` !

```
📂 PDFMaster/
   └── start.bat  ← Double-click this!
```

The launcher will:
1. ✅ Check Python & Node.js are installed
2. 📦 Install all dependencies automatically
3. 🚀 Start the backend API (port 8000)
4. 🌐 Start the frontend (port 3000)
5. 🌍 Open your browser automatically

---

## 🛠️ Manual Setup

### Backend (Python/FastAPI)

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the development server
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at: `http://localhost:8000`  
Interactive API docs: `http://localhost:8000/docs`

### Frontend (React/Vite)

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at: `http://localhost:3000`

### Generate App Icons

```bash
# From the project root
python generate_icons.py
```

---

## 📡 API Reference

### Pages

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/pages/add-blank` | Add a blank page at index |
| `POST` | `/api/pages/duplicate` | Duplicate a page |
| `POST` | `/api/pages/delete` | Delete pages by index list |
| `POST` | `/api/pages/reorder` | Reorder pages by new index list |
| `POST` | `/api/pages/rotate` | Rotate pages by angle |
| `POST` | `/api/pages/crop` | Crop page to specified rect |
| `POST` | `/api/pages/split` | Split PDF at given page indices |
| `POST` | `/api/pages/merge` | Merge multiple PDFs |

### Content Editing

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/edit/add-text` | Add a text annotation |
| `POST` | `/api/edit/add-image` | Insert an image onto a page |
| `POST` | `/api/edit/add-shape` | Draw a rectangle/circle/line |
| `POST` | `/api/edit/redact` | Permanently redact a region |
| `POST` | `/api/edit/watermark` | Add text or image watermark |

### Security

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/security/encrypt` | Password-protect a PDF |
| `POST` | `/api/security/decrypt` | Remove password from PDF |
| `POST` | `/api/security/set-permissions` | Set document permissions |
| `POST` | `/api/security/add-signature` | Add a digital signature |

### Annotations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/annotate/highlight` | Highlight text |
| `POST` | `/api/annotate/underline` | Underline text |
| `POST` | `/api/annotate/strikethrough` | Strikethrough text |
| `POST` | `/api/annotate/note` | Add a sticky note |
| `POST` | `/api/annotate/stamp` | Apply a stamp |
| `POST` | `/api/annotate/link` | Add a hyperlink |

### Forms

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/api/forms/fields` | List all form fields |
| `POST` | `/api/forms/fill` | Fill form fields |
| `POST` | `/api/forms/export` | Export form data as JSON/CSV |
| `POST` | `/api/forms/create` | Create new form fields |

### Conversion

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/convert/to-word` | PDF → .docx |
| `POST` | `/api/convert/to-excel` | PDF → .xlsx |
| `POST` | `/api/convert/to-images` | PDF pages → PNG/JPG |
| `POST` | `/api/convert/from-images` | Images → PDF |
| `POST` | `/api/convert/ocr` | OCR scan → searchable PDF |

### Content Extraction

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/content/extract-text` | Extract all text from PDF |
| `POST` | `/api/content/extract-images` | Extract embedded images |
| `POST` | `/api/content/render-page` | Render page as base64 image |
| `POST` | `/api/content/compress` | Compress/optimize PDF size |
| `GET`  | `/health` | Backend health check |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + O` | Open PDF file |
| `Ctrl + S` | Save / Download PDF |
| `Ctrl + Z` | Undo last action |
| `Ctrl + Y` | Redo action |
| `Ctrl + A` | Select all |
| `Ctrl + C` | Copy selection |
| `Ctrl + V` | Paste |
| `Ctrl + P` | Print document |
| `Ctrl + F` | Find / Search text |
| `Ctrl + +` | Zoom in |
| `Ctrl + -` | Zoom out |
| `Ctrl + 0` | Reset zoom to 100% |
| `Delete` | Delete selected element |
| `Escape` | Deselect / Cancel |
| `Arrow Keys` | Move selected element |
| `Page Up/Down` | Navigate pages |
| `Home` | Go to first page |
| `End` | Go to last page |

---

## 📸 Screenshots

> _Coming soon — screenshots will be added after initial release._

| View | Description |
|------|-------------|
| Main Editor | Drag-and-drop PDF editing canvas |
| Page Manager | Thumbnail sidebar for page operations |
| Annotation Tools | Comment and markup toolbar |
| Security Settings | Password & permissions panel |
| Conversion | Export to Word, Excel, Images |

---

## 🏗️ Tech Stack

### Backend
| Library | Purpose |
|---------|---------|
| **FastAPI** | High-performance REST API framework |
| **PyMuPDF (fitz)** | Core PDF rendering & manipulation |
| **ReportLab** | PDF generation & drawing |
| **pdf2docx** | PDF to Word conversion |
| **pytesseract** | OCR text recognition |
| **Pillow** | Image processing |
| **pypdf** | PDF encryption & permissions |
| **python-docx** | Word document manipulation |
| **openpyxl** | Excel file generation |
| **uvicorn** | ASGI server |
| **aiofiles** | Async file I/O |

### Frontend
| Library | Purpose |
|---------|---------|
| **React 18** | UI framework |
| **Vite** | Lightning-fast build tool |
| **Tailwind CSS** | Utility-first styling |
| **React PDF** | PDF rendering in browser |
| **Zustand** | Lightweight state management |
| **React DnD** | Drag and drop |
| **Framer Motion** | Smooth animations |

### Mobile / PWA
| Feature | Technology |
|---------|-----------|
| **Progressive Web App** | Web App Manifest + Service Worker |
| **Offline Support** | Cache-first strategy via SW |
| **Android App** | Kivy + buildozer WebView wrapper |
| **Install Prompt** | PWA install banner |

---

## 📱 Installing as a Mobile App

### PWA (Recommended — Works on Android & iOS)

1. Open `http://localhost:3000` in **Chrome** (Android) or **Safari** (iOS)
2. Wait for the **"Add to Home Screen"** banner, or:
   - Chrome: tap ⋮ menu → **"Install app"**
   - Safari: tap Share → **"Add to Home Screen"**
3. The app installs with full offline support!

### Android APK (Advanced)

Build a native APK wrapper using Kivy + buildozer:

```bash
# Requires Linux/WSL (not supported on Windows natively)
cd android/
pip install buildozer
buildozer android debug
# APK will be in: android/bin/pdfmaster-1.0-arm64-v8a-debug.apk
```

See [`android/assets/README.txt`](android/assets/README.txt) for detailed instructions.

---

## 📂 Project Structure

```
PDFMaster/
├── 🚀 start.bat                  # Windows one-click launcher
├── 🎨 generate_icons.py          # Icon generator script
├── 📖 README.md                  # This file
│
├── backend/                      # Python FastAPI backend
│   ├── main.py                   # App entry point & CORS config
│   ├── requirements.txt          # Python dependencies
│   ├── routers/                  # API route handlers
│   │   ├── pdf_pages.py          # Page operations
│   │   ├── pdf_edit.py           # Content editing
│   │   ├── pdf_forms.py          # Form handling
│   │   ├── pdf_security.py       # Encryption & permissions
│   │   ├── pdf_content.py        # Text/image extraction
│   │   ├── pdf_convert.py        # Format conversion
│   │   └── pdf_annotate.py       # Annotations & markup
│   └── utils/
│       └── pdf_helpers.py        # Shared utilities
│
├── frontend/                     # React frontend
│   ├── package.json              # Node dependencies
│   ├── index.html                # Entry HTML
│   ├── public/
│   │   ├── manifest.json         # PWA manifest
│   │   ├── sw.js                 # Service Worker
│   │   ├── icon-192.png          # App icon 192×192
│   │   ├── icon-512.png          # App icon 512×512
│   │   └── favicon.png           # Browser favicon
│   └── src/
│       ├── App.jsx               # Root component
│       ├── components/           # UI components
│       ├── styles/               # CSS / Tailwind
│       └── utils/                # Helper functions
│
└── android/                      # Android APK builder
    ├── main.py                   # Kivy WebView app
    ├── buildozer.spec            # Build configuration
    └── assets/
        ├── icon.png              # App icon
        └── splash.png            # Splash screen
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2024 PDF Master Editor Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

<div align="center">

Made with ❤️ and ☕ | PDF Master Editor v1.0

</div>
