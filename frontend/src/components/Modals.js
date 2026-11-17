export function buildModals() {
  return `
<!-- Text Modal -->
<div class="modal-overlay" id="modal-text">
  <div class="modal-card">
    <div class="modal-header">
      <h3>🖊 Add Text</h3>
      <button class="modal-close" onclick="window.app.hideModal('modal-text')">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <label>Text Content</label>
        <textarea id="text-content" class="form-input" rows="3" placeholder="Enter your text..."></textarea>
      </div>
      <div class="form-row-2">
        <div>
          <label>Font Family</label>
          <select id="text-font" class="form-select">
            <option value="helv">Helvetica</option>
            <option value="times">Times New Roman</option>
            <option value="courier">Courier</option>
            <option value="symbol">Symbol</option>
          </select>
        </div>
        <div>
          <label>Font Size</label>
          <input type="number" id="text-size" class="form-input" value="12" min="6" max="144">
        </div>
      </div>
      <div class="form-row-2">
        <div>
          <label>Color</label>
          <input type="color" id="text-color" class="form-color" value="#000000">
        </div>
        <div>
          <label>Style</label>
          <div class="style-buttons">
            <button class="style-btn" id="btn-bold" onclick="this.classList.toggle('active')" title="Bold"><b>B</b></button>
            <button class="style-btn" id="btn-italic" onclick="this.classList.toggle('active')" title="Italic"><i>I</i></button>
            <button class="style-btn" id="btn-underline-txt" onclick="this.classList.toggle('active')" title="Underline"><u>U</u></button>
          </div>
        </div>
      </div>
      <div class="form-row-2">
        <div>
          <label>X Position</label>
          <input type="number" id="text-x" class="form-input" value="100" min="0">
        </div>
        <div>
          <label>Y Position</label>
          <input type="number" id="text-y" class="form-input" value="100" min="0">
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-ghost" onclick="window.app.hideModal('modal-text')">Cancel</button>
      <button class="btn-primary" onclick="window.app.submitText()">Add Text</button>
    </div>
  </div>
</div>

<!-- Draw Settings Modal -->
<div class="modal-overlay" id="modal-draw">
  <div class="modal-card">
    <div class="modal-header">
      <h3>✏ Draw Settings</h3>
      <button class="modal-close" onclick="window.app.hideModal('modal-draw')">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <label>Shape</label>
        <select id="draw-shape" class="form-select" onchange="window.app.setDrawShape(this.value)">
          <option value="rectangle">🔷 Rectangle</option>
          <option value="circle">⭕ Circle</option>
          <option value="line">➖ Line</option>
          <option value="arrow">➡ Arrow</option>
        </select>
      </div>
      <div class="form-row-2">
        <div>
          <label>Stroke Color</label>
          <input type="color" id="draw-stroke-color" class="form-color" value="#6366F1">
        </div>
        <div>
          <label>Fill Color</label>
          <input type="color" id="draw-fill-color" class="form-color" value="#A78BFA">
        </div>
      </div>
      <div class="form-row">
        <label>Stroke Width: <span id="draw-width-val">2</span>px</label>
        <input type="range" id="draw-stroke-width" class="form-range" min="1" max="20" value="2"
          oninput="document.getElementById('draw-width-val').textContent = this.value">
      </div>
      <div class="form-row">
        <label>
          <input type="checkbox" id="draw-filled" style="margin-right:8px"> Filled Shape
        </label>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-ghost" onclick="window.app.hideModal('modal-draw')">Close</button>
      <button class="btn-primary" onclick="window.app.applyDrawSettings()">Apply</button>
    </div>
  </div>
</div>

<!-- Watermark Modal -->
<div class="modal-overlay" id="modal-watermark">
  <div class="modal-card">
    <div class="modal-header">
      <h3>💧 Add Watermark</h3>
      <button class="modal-close" onclick="window.app.hideModal('modal-watermark')">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <label>Watermark Text</label>
        <input type="text" id="watermark-text" class="form-input" value="CONFIDENTIAL" placeholder="e.g. DRAFT">
      </div>
      <div class="form-row-2">
        <div>
          <label>Color</label>
          <input type="color" id="watermark-color" class="form-color" value="#FF0000">
        </div>
        <div>
          <label>Font Size</label>
          <input type="number" id="watermark-size" class="form-input" value="48" min="10" max="200">
        </div>
      </div>
      <div class="form-row">
        <label>Opacity: <span id="wm-opacity-val">30</span>%</label>
        <input type="range" id="watermark-opacity" class="form-range" min="5" max="100" value="30"
          oninput="document.getElementById('wm-opacity-val').textContent = this.value">
      </div>
      <div class="form-row">
        <label>Angle (degrees): <span id="wm-angle-val">45</span>°</label>
        <input type="range" id="watermark-angle" class="form-range" min="-180" max="180" value="45"
          oninput="document.getElementById('wm-angle-val').textContent = this.value">
      </div>
      <div class="form-row">
        <label>Apply to</label>
        <select id="watermark-pages" class="form-select">
          <option value="all">All Pages</option>
          <option value="current">Current Page Only</option>
          <option value="odd">Odd Pages</option>
          <option value="even">Even Pages</option>
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-ghost" onclick="window.app.hideModal('modal-watermark')">Cancel</button>
      <button class="btn-primary" onclick="window.app.applyWatermark()">Add Watermark</button>
    </div>
  </div>
</div>

<!-- Header Footer Modal -->
<div class="modal-overlay" id="modal-header-footer">
  <div class="modal-card">
    <div class="modal-header">
      <h3>📃 Header &amp; Footer</h3>
      <button class="modal-close" onclick="window.app.hideModal('modal-header-footer')">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <label>Header Text</label>
        <input type="text" id="hf-header" class="form-input" placeholder="Header content (use {page} for page number)">
      </div>
      <div class="form-row">
        <label>Footer Text</label>
        <input type="text" id="hf-footer" class="form-input" placeholder="Footer content (use {page} for page number)">
      </div>
      <div class="form-row-2">
        <div>
          <label>Font Size</label>
          <input type="number" id="hf-size" class="form-input" value="10" min="6" max="24">
        </div>
        <div>
          <label>Color</label>
          <input type="color" id="hf-color" class="form-color" value="#333333">
        </div>
      </div>
      <div class="form-row">
        <label>Alignment</label>
        <select id="hf-align" class="form-select">
          <option value="left">Left</option>
          <option value="center" selected>Center</option>
          <option value="right">Right</option>
        </select>
      </div>
      <div class="form-row">
        <label><input type="checkbox" id="hf-page-num" style="margin-right:8px"> Include Page Numbers</label>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-ghost" onclick="window.app.hideModal('modal-header-footer')">Cancel</button>
      <button class="btn-primary" onclick="window.app.applyHeaderFooter()">Apply</button>
    </div>
  </div>
</div>

<!-- Password Modal -->
<div class="modal-overlay" id="modal-password">
  <div class="modal-card">
    <div class="modal-header">
      <h3>🔒 Password Protection</h3>
      <button class="modal-close" onclick="window.app.hideModal('modal-password')">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <label>User Password (open)</label>
        <input type="password" id="pwd-user" class="form-input" placeholder="Password to open the PDF">
      </div>
      <div class="form-row">
        <label>Owner Password (edit)</label>
        <input type="password" id="pwd-owner" class="form-input" placeholder="Password for editing permissions">
      </div>
      <div class="form-row">
        <label>Permissions</label>
        <div class="checkbox-group">
          <label><input type="checkbox" id="perm-print" checked> Allow Printing</label>
          <label><input type="checkbox" id="perm-copy" checked> Allow Copying</label>
          <label><input type="checkbox" id="perm-edit"> Allow Editing</label>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-ghost" onclick="window.app.hideModal('modal-password')">Cancel</button>
      <button class="btn-primary" onclick="window.app.applyPassword()">Protect PDF</button>
    </div>
  </div>
</div>

<!-- Metadata Modal -->
<div class="modal-overlay" id="modal-metadata">
  <div class="modal-card">
    <div class="modal-header">
      <h3>🏷 PDF Metadata</h3>
      <button class="modal-close" onclick="window.app.hideModal('modal-metadata')">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <label>Title</label>
        <input type="text" id="meta-title" class="form-input" placeholder="Document title">
      </div>
      <div class="form-row">
        <label>Author</label>
        <input type="text" id="meta-author" class="form-input" placeholder="Author name">
      </div>
      <div class="form-row">
        <label>Subject</label>
        <input type="text" id="meta-subject" class="form-input" placeholder="Document subject">
      </div>
      <div class="form-row">
        <label>Keywords</label>
        <input type="text" id="meta-keywords" class="form-input" placeholder="keyword1, keyword2, ...">
      </div>
      <div class="form-row">
        <label>Creator</label>
        <input type="text" id="meta-creator" class="form-input" placeholder="Application name">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-ghost" onclick="window.app.hideModal('modal-metadata')">Cancel</button>
      <button class="btn-primary" onclick="window.app.applyMetadata()">Save Metadata</button>
    </div>
  </div>
</div>

<!-- Bookmark Modal -->
<div class="modal-overlay" id="modal-bookmark">
  <div class="modal-card">
    <div class="modal-header">
      <h3>🔖 Add Bookmark</h3>
      <button class="modal-close" onclick="window.app.hideModal('modal-bookmark')">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <label>Bookmark Title</label>
        <input type="text" id="bookmark-title" class="form-input" placeholder="e.g. Chapter 1">
      </div>
      <div class="form-row">
        <label>Target Page</label>
        <input type="number" id="bookmark-page" class="form-input" value="1" min="1">
      </div>
      <div class="form-row">
        <label>Level</label>
        <select id="bookmark-level" class="form-select">
          <option value="1">Top Level</option>
          <option value="2">Sub-Level 1</option>
          <option value="3">Sub-Level 2</option>
        </select>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-ghost" onclick="window.app.hideModal('modal-bookmark')">Cancel</button>
      <button class="btn-primary" onclick="window.app.applyBookmark()">Add Bookmark</button>
    </div>
  </div>
</div>

<!-- Merge Modal -->
<div class="modal-overlay" id="modal-merge">
  <div class="modal-card modal-card-wide">
    <div class="modal-header">
      <h3>📑 Merge PDFs</h3>
      <button class="modal-close" onclick="window.app.hideModal('modal-merge')">✕</button>
    </div>
    <div class="modal-body">
      <div class="drop-zone" id="merge-drop-zone" onclick="document.getElementById('merge-files-input').click()">
        <div class="drop-zone-icon">📂</div>
        <div>Click or drag PDF files here</div>
        <div class="drop-zone-hint">Multiple files supported</div>
        <input type="file" id="merge-files-input" multiple accept=".pdf" style="display:none" onchange="window.app.handleMergeFiles(this.files)">
      </div>
      <div id="merge-file-list" class="file-list"></div>
      <p class="form-hint">Files will be merged in the order listed above. Drag to reorder.</p>
    </div>
    <div class="modal-footer">
      <button class="btn-ghost" onclick="window.app.hideModal('modal-merge')">Cancel</button>
      <button class="btn-primary" onclick="window.app.applyMerge()">Merge PDFs</button>
    </div>
  </div>
</div>

<!-- Split Modal -->
<div class="modal-overlay" id="modal-split">
  <div class="modal-card">
    <div class="modal-header">
      <h3>✂ Split PDF</h3>
      <button class="modal-close" onclick="window.app.hideModal('modal-split')">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <label>Split Mode</label>
        <select id="split-mode" class="form-select" onchange="window.app.updateSplitUI()">
          <option value="ranges">By Page Ranges</option>
          <option value="every">Every N Pages</option>
          <option value="each">Each Page Separately</option>
        </select>
      </div>
      <div id="split-ranges-ui" class="form-row">
        <label>Page Ranges (e.g. 1-3, 4-6, 7-10)</label>
        <input type="text" id="split-ranges" class="form-input" placeholder="1-3, 4-6, 7-">
      </div>
      <div id="split-every-ui" class="form-row" style="display:none">
        <label>Every N Pages</label>
        <input type="number" id="split-every-n" class="form-input" value="5" min="1">
      </div>
      <p class="form-hint">Total pages: <span id="split-total-pages">-</span></p>
    </div>
    <div class="modal-footer">
      <button class="btn-ghost" onclick="window.app.hideModal('modal-split')">Cancel</button>
      <button class="btn-primary" onclick="window.app.applySplit()">Split PDF</button>
    </div>
  </div>
</div>

<!-- Compress Modal -->
<div class="modal-overlay" id="modal-compress">
  <div class="modal-card">
    <div class="modal-header">
      <h3>🗜 Compress PDF</h3>
      <button class="modal-close" onclick="window.app.hideModal('modal-compress')">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <label>Compression Quality</label>
        <div class="quality-cards">
          <label class="quality-card">
            <input type="radio" name="compress-quality" value="low">
            <div class="quality-card-body">
              <div class="quality-icon">🗜</div>
              <div class="quality-name">Low Quality</div>
              <div class="quality-hint">Smallest file size</div>
            </div>
          </label>
          <label class="quality-card active">
            <input type="radio" name="compress-quality" value="medium" checked>
            <div class="quality-card-body">
              <div class="quality-icon">⚖</div>
              <div class="quality-name">Medium Quality</div>
              <div class="quality-hint">Balanced (recommended)</div>
            </div>
          </label>
          <label class="quality-card">
            <input type="radio" name="compress-quality" value="high">
            <div class="quality-card-body">
              <div class="quality-icon">🏆</div>
              <div class="quality-name">High Quality</div>
              <div class="quality-hint">Best visual quality</div>
            </div>
          </label>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-ghost" onclick="window.app.hideModal('modal-compress')">Cancel</button>
      <button class="btn-primary" onclick="window.app.applyCompress()">Compress</button>
    </div>
  </div>
</div>

<!-- Convert Modal -->
<div class="modal-overlay" id="modal-convert">
  <div class="modal-card">
    <div class="modal-header">
      <h3>📄 Export / Convert</h3>
      <button class="modal-close" onclick="window.app.hideModal('modal-convert')">✕</button>
    </div>
    <div class="modal-body">
      <div class="convert-options">
        <button class="convert-option" onclick="window.app.doConvertToDocx()">
          <span class="convert-icon">📝</span>
          <span class="convert-name">Word Document</span>
          <span class="convert-ext">.docx</span>
        </button>
        <button class="convert-option" onclick="window.app.doConvertToImages('png')">
          <span class="convert-icon">🖼</span>
          <span class="convert-name">PNG Images</span>
          <span class="convert-ext">.png (zip)</span>
        </button>
        <button class="convert-option" onclick="window.app.doConvertToImages('jpg')">
          <span class="convert-icon">📷</span>
          <span class="convert-name">JPEG Images</span>
          <span class="convert-ext">.jpg (zip)</span>
        </button>
        <button class="convert-option" onclick="window.app.doConvertToText()">
          <span class="convert-icon">📋</span>
          <span class="convert-name">Plain Text</span>
          <span class="convert-ext">.txt</span>
        </button>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-ghost" onclick="window.app.hideModal('modal-convert')">Close</button>
    </div>
  </div>
</div>

<!-- OCR Modal -->
<div class="modal-overlay" id="modal-ocr">
  <div class="modal-card">
    <div class="modal-header">
      <h3>🔍 OCR - Text Recognition</h3>
      <button class="modal-close" onclick="window.app.hideModal('modal-ocr')">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <label>Language</label>
        <select id="ocr-language" class="form-select">
          <option value="eng">English</option>
          <option value="ara">Arabic</option>
          <option value="fra">French</option>
          <option value="deu">German</option>
          <option value="spa">Spanish</option>
          <option value="chi_sim">Chinese (Simplified)</option>
          <option value="jpn">Japanese</option>
          <option value="rus">Russian</option>
        </select>
      </div>
      <div class="form-row">
        <label>Output</label>
        <select id="ocr-output" class="form-select">
          <option value="layer">Add Text Layer to PDF</option>
          <option value="text">Extract as Text File</option>
        </select>
      </div>
      <p class="form-hint">OCR may take a while for large documents. Please be patient.</p>
    </div>
    <div class="modal-footer">
      <button class="btn-ghost" onclick="window.app.hideModal('modal-ocr')">Cancel</button>
      <button class="btn-primary" onclick="window.app.applyOCR()">Run OCR</button>
    </div>
  </div>
</div>

<!-- Form Field Modal -->
<div class="modal-overlay" id="modal-form-field">
  <div class="modal-card">
    <div class="modal-header">
      <h3>📝 Add Form Field</h3>
      <button class="modal-close" onclick="window.app.hideModal('modal-form-field')">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-row">
        <label>Field Type</label>
        <select id="field-type" class="form-select">
          <option value="text">Text Field</option>
          <option value="checkbox">Checkbox</option>
          <option value="radio">Radio Button</option>
          <option value="dropdown">Dropdown</option>
          <option value="signature">Signature</option>
        </select>
      </div>
      <div class="form-row">
        <label>Field Name</label>
        <input type="text" id="field-name" class="form-input" placeholder="e.g. first_name">
      </div>
      <div class="form-row">
        <label>Default Value</label>
        <input type="text" id="field-default" class="form-input" placeholder="Optional default value">
      </div>
      <div class="form-row-2">
        <div>
          <label>Width</label>
          <input type="number" id="field-width" class="form-input" value="150" min="10">
        </div>
        <div>
          <label>Height</label>
          <input type="number" id="field-height" class="form-input" value="20" min="10">
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-ghost" onclick="window.app.hideModal('modal-form-field')">Cancel</button>
      <button class="btn-primary" onclick="window.app.applyFormField()">Add Field</button>
    </div>
  </div>
</div>
`;
}
