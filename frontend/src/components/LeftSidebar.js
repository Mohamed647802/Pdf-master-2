export function buildLeftSidebar() {
  return `
<div class="left-sidebar" id="left-sidebar">
  <div class="sidebar-header">
    <span class="sidebar-title">Pages</span>
    <span class="sidebar-page-count" id="sidebar-page-count">0 pages</span>
  </div>
  <div class="thumbnails-container" id="thumbnails-container">
    <div class="empty-thumbnails">
      <div class="empty-icon">📄</div>
      <div class="empty-text">No PDF open</div>
      <div class="empty-hint">Open a PDF to see pages</div>
    </div>
  </div>
</div>
`;
}

export function renderThumbnails(state) {
  const container = document.getElementById('thumbnails-container');
  const countEl = document.getElementById('sidebar-page-count');
  if (!container) return;

  if (!state.currentFile || state.totalPages === 0) {
    container.innerHTML = `
      <div class="empty-thumbnails">
        <div class="empty-icon">📄</div>
        <div class="empty-text">No PDF open</div>
        <div class="empty-hint">Open a PDF to see pages</div>
      </div>
    `;
    if (countEl) countEl.textContent = '0 pages';
    return;
  }

  if (countEl) countEl.textContent = `${state.totalPages} page${state.totalPages !== 1 ? 's' : ''}`;

  let html = '';
  for (let i = 0; i < state.totalPages; i++) {
    const isActive = i === state.currentPage;
    const thumb = state.thumbnails[i];
    html += `
      <div class="thumbnail-item ${isActive ? 'active' : ''}"
           draggable="true"
           data-page="${i}"
           onclick="window.app.navigateToPage(${i})"
           ondragstart="window.app.handleThumbnailDragStart(event, ${i})"
           ondragover="window.app.handleThumbnailDragOver(event)"
           ondrop="window.app.handleThumbnailDrop(event, ${i})">
        <div class="thumbnail-img-wrap">
          ${thumb
            ? `<img src="data:image/png;base64,${thumb}" alt="Page ${i + 1}" class="thumbnail-img">`
            : `<div class="thumbnail-loading">
                 <div class="spinner-sm"></div>
               </div>`
          }
          <div class="thumbnail-actions">
            <button class="thumbnail-action-btn danger" title="Delete Page"
                    onclick="event.stopPropagation(); window.app.deletePage(${i})">🗑</button>
            <button class="thumbnail-action-btn" title="Rotate Page"
                    onclick="event.stopPropagation(); window.app.rotatePage(90, [${i}])">🔄</button>
          </div>
        </div>
        <div class="thumbnail-label">
          <span class="thumbnail-page-num">${i + 1}</span>
        </div>
      </div>
    `;
  }
  container.innerHTML = html;
}
