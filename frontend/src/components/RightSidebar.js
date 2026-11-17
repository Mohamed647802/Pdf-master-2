export function buildRightSidebar() {
  return `
<div class="right-sidebar" id="right-sidebar">
  <div class="sidebar-header">
    <span class="sidebar-title">Properties</span>
  </div>
  <div class="right-sidebar-content" id="right-sidebar-content">
    <!-- Dynamic content based on active tool -->
    <div class="page-info-panel" id="page-info-panel">
      <div class="prop-section">
        <div class="prop-section-title">Page Info</div>
        <div class="prop-row">
          <span class="prop-label">Page</span>
          <span class="prop-value" id="prop-page-num">-</span>
        </div>
        <div class="prop-row">
          <span class="prop-label">Size</span>
          <span class="prop-value" id="prop-page-size">-</span>
        </div>
        <div class="prop-row">
          <span class="prop-label">Rotation</span>
          <span class="prop-value" id="prop-page-rotation">0°</span>
        </div>
      </div>
      <div class="prop-section">
        <div class="prop-section-title">Zoom</div>
        <div class="prop-row">
          <input type="range" class="form-range full-width" id="right-zoom-slider"
                 min="0.25" max="4" step="0.05" value="1.5"
                 oninput="window.app.setZoom(parseFloat(this.value))">
        </div>
        <div class="prop-row" style="justify-content: center;">
          <span class="prop-value" id="right-zoom-display">150%</span>
        </div>
      </div>
    </div>
  </div>
</div>
`;
}

export function updateRightSidebar(state) {
  const content = document.getElementById('right-sidebar-content');
  if (!content) return;

  // Update always-visible page info
  const pageNumEl = document.getElementById('prop-page-num');
  const pageSizeEl = document.getElementById('prop-page-size');
  if (pageNumEl) pageNumEl.textContent = state.totalPages > 0 ? `${state.currentPage + 1} / ${state.totalPages}` : '-';

  const rightZoom = document.getElementById('right-zoom-slider');
  const rightZoomDisplay = document.getElementById('right-zoom-display');
  if (rightZoom) rightZoom.value = state.zoom;
  if (rightZoomDisplay) rightZoomDisplay.textContent = `${Math.round(state.zoom * 100)}%`;

  // Build tool-specific panel
  const existingToolPanel = document.getElementById('tool-props-panel');

  let toolHTML = '';
  switch (state.tool) {
    case 'text':
      toolHTML = `
        <div class="prop-section" id="tool-props-panel">
          <div class="prop-section-title">🖊 Text Tool</div>
          <div class="prop-row-col">
            <label class="prop-label">Font</label>
            <select class="form-select" id="rs-text-font" onchange="window.app.updateTextSettings()">
              <option value="helv">Helvetica</option>
              <option value="times">Times</option>
              <option value="courier">Courier</option>
            </select>
          </div>
          <div class="prop-row-col">
            <label class="prop-label">Size</label>
            <input type="number" class="form-input" id="rs-text-size" value="12" min="6" max="144" onchange="window.app.updateTextSettings()">
          </div>
          <div class="prop-row">
            <label class="prop-label">Color</label>
            <input type="color" class="form-color" id="rs-text-color" value="#000000" onchange="window.app.updateTextSettings()">
          </div>
          <div class="prop-row">
            <div class="style-buttons">
              <button class="style-btn" id="rs-bold" onclick="this.classList.toggle('active'); window.app.updateTextSettings()" title="Bold"><b>B</b></button>
              <button class="style-btn" id="rs-italic" onclick="this.classList.toggle('active'); window.app.updateTextSettings()" title="Italic"><i>I</i></button>
              <button class="style-btn" id="rs-underline" onclick="this.classList.toggle('active'); window.app.updateTextSettings()" title="Underline"><u>U</u></button>
            </div>
          </div>
          <div class="prop-row" style="margin-top:8px">
            <button class="btn-primary full-width" onclick="window.app.showModal('modal-text')">Open Text Editor</button>
          </div>
        </div>
      `;
      break;

    case 'draw':
      toolHTML = `
        <div class="prop-section" id="tool-props-panel">
          <div class="prop-section-title">✏ Draw Tool</div>
          <div class="prop-row-col">
            <label class="prop-label">Shape</label>
            <select class="form-select" id="rs-draw-shape" onchange="window.app.setDrawShape(this.value)">
              <option value="rectangle">🔷 Rectangle</option>
              <option value="circle">⭕ Circle</option>
              <option value="line">➖ Line</option>
              <option value="arrow">➡ Arrow</option>
              <option value="freehand">✒ Freehand</option>
            </select>
          </div>
          <div class="prop-row">
            <label class="prop-label">Stroke</label>
            <input type="color" class="form-color" id="rs-stroke-color" value="#6366F1" onchange="window.app.updateDrawSettings()">
          </div>
          <div class="prop-row">
            <label class="prop-label">Fill</label>
            <input type="color" class="form-color" id="rs-fill-color" value="#A78BFA" onchange="window.app.updateDrawSettings()">
          </div>
          <div class="prop-row-col">
            <label class="prop-label">Width: <span id="rs-width-val">2</span>px</label>
            <input type="range" class="form-range" id="rs-stroke-width" min="1" max="20" value="2"
              oninput="document.getElementById('rs-width-val').textContent=this.value; window.app.updateDrawSettings()">
          </div>
          <div class="prop-row">
            <label><input type="checkbox" id="rs-filled" onchange="window.app.updateDrawSettings()" style="margin-right:6px"> Filled</label>
          </div>
        </div>
      `;
      break;

    case 'highlight':
      toolHTML = `
        <div class="prop-section" id="tool-props-panel">
          <div class="prop-section-title">🖍 Highlight Tool</div>
          <div class="prop-row">
            <label class="prop-label">Color</label>
            <input type="color" class="form-color" id="rs-highlight-color" value="#FFFF00" onchange="window.app.updateHighlightSettings()">
          </div>
          <div class="color-presets">
            <div class="color-preset" style="background:#FFFF00" onclick="document.getElementById('rs-highlight-color').value='#FFFF00'; window.app.updateHighlightSettings()" title="Yellow"></div>
            <div class="color-preset" style="background:#90EE90" onclick="document.getElementById('rs-highlight-color').value='#90EE90'; window.app.updateHighlightSettings()" title="Green"></div>
            <div class="color-preset" style="background:#FFB6C1" onclick="document.getElementById('rs-highlight-color').value='#FFB6C1'; window.app.updateHighlightSettings()" title="Pink"></div>
            <div class="color-preset" style="background:#87CEEB" onclick="document.getElementById('rs-highlight-color').value='#87CEEB'; window.app.updateHighlightSettings()" title="Blue"></div>
            <div class="color-preset" style="background:#FFD700" onclick="document.getElementById('rs-highlight-color').value='#FFD700'; window.app.updateHighlightSettings()" title="Gold"></div>
          </div>
          <div class="prop-row" style="margin-top:8px">
            <p class="prop-hint">Click and drag on the PDF to highlight text area</p>
          </div>
        </div>
      `;
      break;

    case 'sticky':
      toolHTML = `
        <div class="prop-section" id="tool-props-panel">
          <div class="prop-section-title">💬 Sticky Note Tool</div>
          <div class="prop-row">
            <label class="prop-label">Color</label>
            <input type="color" class="form-color" id="rs-note-color" value="#FFD700">
          </div>
          <div class="color-presets">
            <div class="color-preset" style="background:#FFD700" onclick="document.getElementById('rs-note-color').value='#FFD700'" title="Yellow"></div>
            <div class="color-preset" style="background:#90EE90" onclick="document.getElementById('rs-note-color').value='#90EE90'" title="Green"></div>
            <div class="color-preset" style="background:#FFB6C1" onclick="document.getElementById('rs-note-color').value='#FFB6C1'" title="Pink"></div>
            <div class="color-preset" style="background:#87CEEB" onclick="document.getElementById('rs-note-color').value='#87CEEB'" title="Blue"></div>
          </div>
          <div class="prop-row" style="margin-top:8px">
            <p class="prop-hint">Click on the PDF to place a sticky note</p>
          </div>
        </div>
      `;
      break;

    case 'select':
    default:
      toolHTML = `
        <div class="prop-section" id="tool-props-panel">
          <div class="prop-section-title">🖱 Select Tool</div>
          <div class="select-hint">
            <div class="select-hint-icon">👆</div>
            <div class="select-hint-text">Click an element to select it and view its properties</div>
          </div>
        </div>
      `;
      break;
  }

  // Insert or replace tool panel
  const existing = document.getElementById('tool-props-panel');
  const pageInfoPanel = document.getElementById('page-info-panel');
  if (existing) {
    existing.outerHTML = toolHTML;
  } else if (pageInfoPanel) {
    pageInfoPanel.insertAdjacentHTML('afterend', toolHTML);
  } else {
    content.insertAdjacentHTML('beforeend', toolHTML);
  }
}
