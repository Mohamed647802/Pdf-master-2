const API_BASE = 'http://localhost:8000/api';

async function request(endpoint, formData, method = 'POST') {
  const opts = { method };
  if (formData) opts.body = formData;
  const res = await fetch(`${API_BASE}${endpoint}`, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Request failed');
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.blob();
}

export async function uploadPDF(file) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(`${API_BASE}/pdf/upload`, { method: 'POST', body: fd });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

export async function renderPage(filename, page, zoom = 1.5) {
  const res = await fetch(`${API_BASE}/pdf/render/${encodeURIComponent(filename)}/${page}?zoom=${zoom}`);
  if (!res.ok) throw new Error('Render failed');
  return res.json();
}

export async function getThumbnail(filename, page) {
  const res = await fetch(`${API_BASE}/pages/thumbnail/${encodeURIComponent(filename)}/${page}`);
  if (!res.ok) throw new Error('Thumbnail failed');
  return res.json();
}

export async function getPDFInfo(filename) {
  const res = await fetch(`${API_BASE}/pages/info/${encodeURIComponent(filename)}`);
  if (!res.ok) throw new Error('Info failed');
  return res.json();
}

export async function addText(file, params) {
  const fd = new FormData();
  fd.append('file', file);
  Object.entries(params).forEach(([k, v]) => fd.append(k, v));
  return request('/pdf/add-text', fd);
}

export async function addImage(pdfFile, imgFile, params) {
  const fd = new FormData();
  fd.append('pdf_file', pdfFile);
  fd.append('img_file', imgFile);
  Object.entries(params).forEach(([k, v]) => fd.append(k, v));
  return request('/pdf/add-image', fd);
}

export async function drawShape(file, params) {
  const fd = new FormData();
  fd.append('file', file);
  Object.entries(params).forEach(([k, v]) => fd.append(k, v));
  return request('/pdf/draw', fd);
}

export async function redactRegion(file, params) {
  const fd = new FormData();
  fd.append('file', file);
  Object.entries(params).forEach(([k, v]) => fd.append(k, v));
  return request('/pdf/redact-region', fd);
}

export async function highlightText(file, params) {
  const fd = new FormData();
  fd.append('file', file);
  Object.entries(params).forEach(([k, v]) => fd.append(k, v));
  return request('/annotate/highlight', fd);
}

export async function strikethroughText(file, params) {
  const fd = new FormData();
  fd.append('file', file);
  Object.entries(params).forEach(([k, v]) => fd.append(k, v));
  return request('/annotate/strikethrough', fd);
}

export async function underlineText(file, params) {
  const fd = new FormData();
  fd.append('file', file);
  Object.entries(params).forEach(([k, v]) => fd.append(k, v));
  return request('/annotate/underline', fd);
}

export async function addStickyNote(file, params) {
  const fd = new FormData();
  fd.append('file', file);
  Object.entries(params).forEach(([k, v]) => fd.append(k, v));
  return request('/annotate/sticky-note', fd);
}

export async function deleteAnnotation(file, params) {
  const fd = new FormData();
  fd.append('file', file);
  Object.entries(params).forEach(([k, v]) => fd.append(k, v));
  return request('/annotate/delete', fd);
}

export async function listAnnotations(filename, page) {
  const res = await fetch(`${API_BASE}/annotate/list/${encodeURIComponent(filename)}/${page}`);
  if (!res.ok) throw new Error('List annotations failed');
  return res.json();
}

export async function addBlankPage(file, pageIndex) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('page_index', pageIndex);
  return request('/pages/add-blank', fd);
}

export async function duplicatePage(file, pageIndex) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('page_index', pageIndex);
  return request('/pages/duplicate', fd);
}

export async function deletePage(file, pageIndices) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('page_indices', JSON.stringify(pageIndices));
  return request('/pages/delete', fd);
}

export async function reorderPages(file, newOrder) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('new_order', JSON.stringify(newOrder));
  return request('/pages/reorder', fd);
}

export async function rotatePage(file, pageIndices, degrees) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('page_indices', JSON.stringify(pageIndices));
  fd.append('degrees', degrees);
  return request('/pages/rotate', fd);
}

export async function cropPage(file, params) {
  const fd = new FormData();
  fd.append('file', file);
  Object.entries(params).forEach(([k, v]) => fd.append(k, v));
  return request('/pages/crop', fd);
}

export async function mergePDFs(files) {
  const fd = new FormData();
  files.forEach(f => fd.append('files', f));
  return request('/pages/merge', fd);
}

export async function splitPDF(file, ranges) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('ranges', JSON.stringify(ranges));
  return request('/pages/split', fd);
}

export async function compressPDF(file, quality) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('quality', quality);
  return request('/convert/compress', fd);
}

export async function convertToDocx(file) {
  const fd = new FormData();
  fd.append('file', file);
  return request('/convert/to-docx', fd);
}

export async function convertToImages(file, format) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('format', format);
  return request('/convert/to-images', fd);
}

export async function convertToText(file) {
  const fd = new FormData();
  fd.append('file', file);
  return request('/convert/to-text', fd);
}

export async function convertToHTML(file) {
  const fd = new FormData();
  fd.append('file', file);
  return request('/convert/to-html', fd);
}

export async function runOCR(file, language = 'eng') {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('language', language);
  return request('/convert/ocr', fd);
}

export async function addWatermark(file, params) {
  const fd = new FormData();
  fd.append('file', file);
  Object.entries(params).forEach(([k, v]) => fd.append(k, v));
  return request('/content/watermark', fd);
}

export async function addHeaderFooter(file, params) {
  const fd = new FormData();
  fd.append('file', file);
  Object.entries(params).forEach(([k, v]) => fd.append(k, v));
  return request('/content/header-footer', fd);
}

export async function getBookmarks(filename) {
  const res = await fetch(`${API_BASE}/content/bookmarks/${encodeURIComponent(filename)}`);
  if (!res.ok) throw new Error('Failed to get bookmarks');
  return res.json();
}

export async function addBookmark(file, params) {
  const fd = new FormData();
  fd.append('file', file);
  Object.entries(params).forEach(([k, v]) => fd.append(k, v));
  return request('/content/add-bookmark', fd);
}

export async function deleteBookmark(file, bookmarkIndex) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('bookmark_index', bookmarkIndex);
  return request('/content/delete-bookmark', fd);
}

export async function addLink(file, params) {
  const fd = new FormData();
  fd.append('file', file);
  Object.entries(params).forEach(([k, v]) => fd.append(k, v));
  return request('/content/add-link', fd);
}

export async function redactContent(file, params) {
  const fd = new FormData();
  fd.append('file', file);
  Object.entries(params).forEach(([k, v]) => fd.append(k, v));
  return request('/content/redact', fd);
}

export async function addPassword(file, params) {
  const fd = new FormData();
  fd.append('file', file);
  Object.entries(params).forEach(([k, v]) => fd.append(k, v));
  return request('/security/add-password', fd);
}

export async function removePassword(file, password) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('password', password);
  return request('/security/remove-password', fd);
}

export async function getMetadata(filename) {
  const res = await fetch(`${API_BASE}/security/metadata/${encodeURIComponent(filename)}`);
  if (!res.ok) throw new Error('Failed to get metadata');
  return res.json();
}

export async function updateMetadata(file, params) {
  const fd = new FormData();
  fd.append('file', file);
  Object.entries(params).forEach(([k, v]) => fd.append(k, v));
  return request('/security/metadata', fd);
}

export async function listFormFields(filename) {
  const res = await fetch(`${API_BASE}/forms/list/${encodeURIComponent(filename)}`);
  if (!res.ok) throw new Error('Failed to list form fields');
  return res.json();
}

export async function addFormField(file, params) {
  const fd = new FormData();
  fd.append('file', file);
  Object.entries(params).forEach(([k, v]) => fd.append(k, v));
  return request('/forms/add-field', fd);
}

export async function fillForms(file, fields) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('fields', JSON.stringify(fields));
  return request('/forms/fill', fd);
}

export async function flattenForms(file) {
  const fd = new FormData();
  fd.append('file', file);
  return request('/forms/flatten', fd);
}
