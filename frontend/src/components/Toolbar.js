export function buildToolbar() {
  return `
<div class="toolbar" id="toolbar">
  <!-- File Operations -->
  <div class="toolbar-group">
    <button class="toolbar-btn" id="btn-open" title="Open PDF (Ctrl+O)" onclick="document.getElementById('file-input').click()">
      <span class="btn-icon">📂</span>
      <span class="btn-label">Open</span>
    </button>
    <button class="toolbar-btn" id="btn-save" title="Save (Ctrl+S)" onclick="window.app.saveCurrent()">
      <span class="btn-icon">💾</span>
      <span class="btn-label">Save</span>
    </button>
    <button class="toolbar-btn" id="btn-download" title="Download PDF" onclick="window.app.downloadCurrent()">
      <span class="btn-icon">📥</span>
      <span class="btn-label">Download</span>
    </button>
  </div>

  <div class="toolbar-sep"></div>

  <!-- Edit Operations -->
  <div class="toolbar-group">
    <button class="toolbar-btn" id="btn-undo" title="Undo (Ctrl+Z)" onclick="window.app.undo()">
      <span class="btn-icon">↩</span>
      <span class="btn-label">Undo</span>
    </button>
    <button class="toolbar-btn" id="btn-redo" title="Redo (Ctrl+Y)" onclick="window.app.redo()">
      <span class="btn-icon">↪</span>
      <span class="btn-label">Redo</span>
    </button>
  </div>

  <div class="toolbar-sep"></div>

  <!-- Draw & Edit Tools -->
  <div class="toolbar-group">
    <button class="toolbar-btn tool-btn" id="btn-tool-select" title="Select Tool (V)" onclick="window.app.setTool('select')" data-tool="select">
      <span class="btn-icon">🖱</span>
      <span class="btn-label">Select</span>
    </button>
    <button class="toolbar-btn tool-btn" id="btn-tool-text" title="Add Text (T)" onclick="window.app.setTool('text')" data-tool="text">
      <span class="btn-icon">🖊</span>
      <span class="btn-label">Text</span>
    </button>
    <button class="toolbar-btn tool-btn" id="btn-tool-image" title="Insert Image (I)" onclick="document.getElementById('image-input').click()" data-tool="image">
      <span class="btn-icon">🖼</span>
      <span class="btn-label">Image</span>
    </button>
    <div class="toolbar-btn-group">
      <button class="toolbar-btn tool-btn" id="btn-tool-draw" title="Draw Shape (D)" onclick="window.app.setTool('draw')" data-tool="draw">
        <span class="btn-icon">✏</span>
        <span class="btn-label">Draw</span>
      </button>
      <button class="toolbar-btn dropdown-trigger" id="btn-shape-dropdown" title="Shape Options" onclick="window.app.toggleDropdown('shape-dropdown')">
        <span class="btn-icon">▾</span>
      </button>
      <div class="dropdown-menu" id="shape-dropdown">
        <div class="dropdown-item" onclick="window.app.setDrawShape('rectangle')">🔷 Rectangle</div>
        <div class="dropdown-item" onclick="window.app.setDrawShape('circle')">⭕ Circle</div>
        <div class="dropdown-item" onclick="window.app.setDrawShape('line')">➖ Line</div>
        <div class="dropdown-item" onclick="window.app.setDrawShape('arrow')">➡ Arrow</div>
        <div class="dropdown-item" onclick="window.app.setDrawShape('freehand')">✒ Freehand</div>
      </div>
    </div>
  </div>

  <div class="toolbar-sep"></div>

  <!-- Annotation Tools -->
  <div class="toolbar-group">
    <button class="toolbar-btn tool-btn" id="btn-tool-highlight" title="Highlight Text (H)" onclick="window.app.setTool('highlight')" data-tool="highlight">
      <span class="btn-icon">🖍</span>
      <span class="btn-label">Highlight</span>
    </button>
    <button class="toolbar-btn tool-btn" id="btn-tool-sticky" title="Sticky Note (N)" onclick="window.app.setTool('sticky')" data-tool="sticky">
      <span class="btn-icon">💬</span>
      <span class="btn-label">Note</span>
    </button>
    <button class="toolbar-btn tool-btn" id="btn-tool-strikethrough" title="Strikethrough" onclick="window.app.setTool('strikethrough')" data-tool="strikethrough">
      <span class="btn-icon">~~S~~</span>
      <span class="btn-label">Strike</span>
    </button>
    <button class="toolbar-btn tool-btn" id="btn-tool-underline" title="Underline" onclick="window.app.setTool('underline')" data-tool="underline">
      <span class="btn-icon"><u>U</u></span>
      <span class="btn-label">Underline</span>
    </button>
  </div>

  <div class="toolbar-sep"></div>

  <!-- Page Operations -->
  <div class="toolbar-group">
    <button class="toolbar-btn" id="btn-add-page" title="Add Blank Page" onclick="window.app.addBlankPage()">
      <span class="btn-icon">➕</span>
      <span class="btn-label">Add Page</span>
    </button>
    <button class="toolbar-btn danger" id="btn-delete-page" title="Delete Page" onclick="window.app.deleteCurrentPage()">
      <span class="btn-icon">🗑</span>
      <span class="btn-label">Delete</span>
    </button>
    <button class="toolbar-btn" id="btn-rotate" title="Rotate Page 90°" onclick="window.app.rotatePage(90)">
      <span class="btn-icon">🔄</span>
      <span class="btn-label">Rotate</span>
    </button>
    <button class="toolbar-btn" id="btn-duplicate" title="Duplicate Page" onclick="window.app.duplicatePage()">
      <span class="btn-icon">📋</span>
      <span class="btn-label">Duplicate</span>
    </button>
  </div>

  <div class="toolbar-sep"></div>

  <!-- Merge / Split -->
  <div class="toolbar-group">
    <button class="toolbar-btn" id="btn-merge" title="Merge PDFs" onclick="window.app.showModal('modal-merge')">
      <span class="btn-icon">📑</span>
      <span class="btn-label">Merge</span>
    </button>
    <button class="toolbar-btn" id="btn-split" title="Split PDF" onclick="window.app.showModal('modal-split')">
      <span class="btn-icon">✂</span>
      <span class="btn-label">Split</span>
    </button>
  </div>

  <div class="toolbar-sep"></div>

  <!-- Security & Document -->
  <div class="toolbar-group">
    <button class="toolbar-btn" id="btn-password" title="Password Protect" onclick="window.app.showModal('modal-password')">
      <span class="btn-icon">🔒</span>
      <span class="btn-label">Password</span>
    </button>
    <button class="toolbar-btn" id="btn-metadata" title="Edit Metadata" onclick="window.app.showModal('modal-metadata')">
      <span class="btn-icon">🏷</span>
      <span class="btn-label">Metadata</span>
    </button>
    <button class="toolbar-btn" id="btn-watermark" title="Add Watermark" onclick="window.app.showModal('modal-watermark')">
      <span class="btn-icon">💧</span>
      <span class="btn-label">Watermark</span>
    </button>
    <button class="toolbar-btn" id="btn-bookmark" title="Add Bookmark" onclick="window.app.showModal('modal-bookmark')">
      <span class="btn-icon">🔖</span>
      <span class="btn-label">Bookmark</span>
    </button>
    <button class="toolbar-btn" id="btn-header-footer" title="Header & Footer" onclick="window.app.showModal('modal-header-footer')">
      <span class="btn-icon">📃</span>
      <span class="btn-label">H/F</span>
    </button>
  </div>

  <div class="toolbar-sep"></div>

  <!-- Convert & Export -->
  <div class="toolbar-group">
    <button class="toolbar-btn" id="btn-to-docx" title="Convert to DOCX" onclick="window.app.showModal('modal-convert')">
      <span class="btn-icon">📄</span>
      <span class="btn-label">To DOCX</span>
    </button>
    <button class="toolbar-btn" id="btn-to-images" title="Convert to Images" onclick="window.app.convertToImages()">
      <span class="btn-icon">🖼</span>
      <span class="btn-label">To IMG</span>
    </button>
    <button class="toolbar-btn" id="btn-compress" title="Compress PDF" onclick="window.app.showModal('modal-compress')">
      <span class="btn-icon">🗜</span>
      <span class="btn-label">Compress</span>
    </button>
    <button class="toolbar-btn" id="btn-ocr" title="Run OCR" onclick="window.app.showModal('modal-ocr')">
      <span class="btn-icon">🔍</span>
      <span class="btn-label">OCR</span>
    </button>
  </div>

  <div class="toolbar-spacer"></div>

  <!-- Right side controls -->
  <div class="toolbar-group toolbar-right">
    <button class="toolbar-btn" id="btn-darkmode" title="Toggle Dark Mode" onclick="window.app.toggleDarkMode()">
      <span class="btn-icon">🌙</span>
    </button>
    <div class="zoom-controls">
      <button class="toolbar-btn zoom-btn" onclick="window.app.setZoom(window.app.state.zoom - 0.1)" title="Zoom Out">－</button>
      <span class="zoom-display" id="zoom-display">150%</span>
      <button class="toolbar-btn zoom-btn" onclick="window.app.setZoom(window.app.state.zoom + 0.1)" title="Zoom In">＋</button>
      <select class="zoom-select" id="zoom-select" onchange="window.app.setZoom(parseFloat(this.value))">
        <option value="0.5">50%</option>
        <option value="0.75">75%</option>
        <option value="1.0">100%</option>
        <option value="1.25">125%</option>
        <option value="1.5" selected>150%</option>
        <option value="2.0">200%</option>
        <option value="3.0">300%</option>
      </select>
    </div>
  </div>
</div>
`;
}
