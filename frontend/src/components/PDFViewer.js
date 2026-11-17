export function buildPDFViewer() {
  return `
<div class="pdf-viewer-container" id="pdf-viewer-container">
  <div class="pdf-canvas-wrap" id="pdf-canvas-wrap">
    <!-- Empty state -->
    <div class="viewer-empty" id="viewer-empty">
      <div class="viewer-empty-icon">📄</div>
      <div class="viewer-empty-title">No PDF Open</div>
      <div class="viewer-empty-subtitle">Open a PDF file to get started</div>
      <button class="btn-primary viewer-open-btn" onclick="document.getElementById('file-input').click()">
        📂 Open PDF
      </button>
    </div>

    <!-- Page display -->
    <div class="page-display" id="page-display" style="display:none; position:relative">
      <img id="pdf-page-img" class="pdf-page-img" alt="PDF Page" draggable="false">
      <canvas id="draw-canvas" class="draw-canvas"></canvas>
      <!-- Text input popover -->
      <div class="text-popover" id="text-popover" style="display:none">
        <textarea id="text-popover-input" class="text-popover-input" placeholder="Type here..." rows="3"></textarea>
        <div class="text-popover-actions">
          <button class="btn-ghost btn-sm" onclick="window.app.cancelTextInput()">Cancel</button>
          <button class="btn-primary btn-sm" onclick="window.app.submitTextInput()">Add</button>
        </div>
      </div>
      <!-- Sticky note popover -->
      <div class="sticky-popover" id="sticky-popover" style="display:none">
        <div class="sticky-popover-header">💬 Sticky Note</div>
        <textarea id="sticky-popover-input" class="text-popover-input" placeholder="Note text..." rows="4"></textarea>
        <div class="text-popover-actions">
          <button class="btn-ghost btn-sm" onclick="window.app.cancelStickyInput()">Cancel</button>
          <button class="btn-primary btn-sm" onclick="window.app.submitStickyInput()">Add Note</button>
        </div>
      </div>
    </div>

    <!-- Loading overlay -->
    <div class="page-loading" id="page-loading" style="display:none">
      <div class="spinner"></div>
      <div class="loading-text">Loading page...</div>
    </div>
  </div>

  <!-- Floating navigation -->
  <div class="page-nav" id="page-nav" style="display:none">
    <button class="nav-btn" id="btn-prev" onclick="window.app.navigatePage(-1)" title="Previous Page">◀</button>
    <span class="nav-info" id="nav-info">1 / 1</span>
    <button class="nav-btn" id="btn-next" onclick="window.app.navigatePage(1)" title="Next Page">▶</button>
  </div>
</div>
`;
}

export function initDrawCanvas(state) {
  const canvas = document.getElementById('draw-canvas');
  const img = document.getElementById('pdf-page-img');
  if (!canvas || !img) return;

  // Match canvas size to displayed image
  const updateCanvasSize = () => {
    canvas.width = img.clientWidth || img.naturalWidth || 800;
    canvas.height = img.clientHeight || img.naturalHeight || 1000;
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
  };

  img.addEventListener('load', updateCanvasSize);
  if (img.complete) updateCanvasSize();

  const ctx = canvas.getContext('2d');
  let drawing = false;
  let startX = 0, startY = 0;
  let snapshot = null;

  const getPos = (e) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  canvas.addEventListener('mousedown', (e) => {
    if (!['draw', 'highlight', 'text', 'sticky', 'strikethrough', 'underline'].includes(state.tool)) return;
    if (state.tool === 'text') {
      const pos = getPos(e);
      window.app.showTextPopover(pos.x, pos.y);
      return;
    }
    if (state.tool === 'sticky') {
      const pos = getPos(e);
      window.app.showStickyPopover(pos.x, pos.y);
      return;
    }
    drawing = true;
    const pos = getPos(e);
    startX = pos.x;
    startY = pos.y;
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    state.isDrawing = true;
    state.drawStart = pos;
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    const pos = getPos(e);
    ctx.putImageData(snapshot, 0, 0);

    const drawSettings = state.drawSettings || {};
    ctx.strokeStyle = drawSettings.strokeColor || '#6366F1';
    ctx.fillStyle = drawSettings.fillColor || '#A78BFA';
    ctx.lineWidth = drawSettings.strokeWidth || 2;

    const dx = pos.x - startX;
    const dy = pos.y - startY;

    ctx.beginPath();
    switch (state.drawShape) {
      case 'rectangle':
        ctx.rect(startX, startY, dx, dy);
        if (drawSettings.filled) ctx.fill();
        ctx.stroke();
        break;
      case 'circle':
        const rx = Math.abs(dx) / 2;
        const ry = Math.abs(dy) / 2;
        const cx = startX + dx / 2;
        const cy = startY + dy / 2;
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        if (drawSettings.filled) ctx.fill();
        ctx.stroke();
        break;
      case 'line':
        ctx.moveTo(startX, startY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        break;
      case 'arrow':
        ctx.moveTo(startX, startY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        // Draw arrowhead
        const angle = Math.atan2(dy, dx);
        const headLen = 15;
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(pos.x - headLen * Math.cos(angle - Math.PI / 6), pos.y - headLen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(pos.x - headLen * Math.cos(angle + Math.PI / 6), pos.y - headLen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
        break;
      case 'freehand':
        ctx.putImageData(snapshot, 0, 0);
        break;
      case 'highlight':
        ctx.fillStyle = `${drawSettings.highlightColor || '#FFFF00'}88`;
        ctx.fillRect(startX, startY, dx, dy);
        break;
    }
  });

  canvas.addEventListener('mouseup', (e) => {
    if (!drawing) return;
    drawing = false;
    state.isDrawing = false;
    const pos = getPos(e);
    const imgEl = document.getElementById('pdf-page-img');
    const scaleX = imgEl ? (imgEl.naturalWidth / imgEl.clientWidth) : 1;
    const scaleY = imgEl ? (imgEl.naturalHeight / imgEl.clientHeight) : 1;

    const params = {
      page: state.currentPage,
      x: Math.min(startX, pos.x) * scaleX,
      y: Math.min(startY, pos.y) * scaleY,
      width: Math.abs(pos.x - startX) * scaleX,
      height: Math.abs(pos.y - startY) * scaleY,
      shape: state.drawShape,
      stroke_color: state.drawSettings?.strokeColor || '#6366F1',
      fill_color: state.drawSettings?.fillColor || '#A78BFA',
      stroke_width: state.drawSettings?.strokeWidth || 2,
      filled: state.drawSettings?.filled || false
    };

    if (state.tool === 'draw' && params.width > 5 && params.height > 5) {
      window.app.submitDrawShape(params);
    } else if (state.tool === 'highlight' && params.width > 5 && params.height > 5) {
      window.app.submitHighlight(params);
    }
  });

  // Freehand drawing
  let freehandPoints = [];
  canvas.addEventListener('mousedown', (e) => {
    if (state.drawShape !== 'freehand' || state.tool !== 'draw') return;
    freehandPoints = [getPos(e)];
  });
  canvas.addEventListener('mousemove', (e) => {
    if (!drawing || state.drawShape !== 'freehand') return;
    const pos = getPos(e);
    freehandPoints.push(pos);
    ctx.putImageData(snapshot, 0, 0);
    ctx.beginPath();
    ctx.strokeStyle = state.drawSettings?.strokeColor || '#6366F1';
    ctx.lineWidth = state.drawSettings?.strokeWidth || 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (freehandPoints.length > 0) {
      ctx.moveTo(freehandPoints[0].x, freehandPoints[0].y);
      freehandPoints.forEach(pt => ctx.lineTo(pt.x, pt.y));
    }
    ctx.stroke();
  });

  canvas.addEventListener('mouseleave', () => {
    if (drawing) {
      drawing = false;
      state.isDrawing = false;
    }
  });
}
