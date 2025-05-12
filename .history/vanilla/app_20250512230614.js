// Cargar y renderizar los datos desde data.json
fetch('../lib/data.json')
  .then(res => res.json())
  .then(data => {
    renderSidebar(data.collections);
    renderTags(data.tags);
    renderBookmarks(data.bookmarks, data.collections, data.bookmark_tags, data.tags);
  });

function renderSidebar(collections) {
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = `<h2 class="text-xl font-semibold mb-4">Categorías</h2>` +
    collections.map(col => `
      <div class="flex items-center gap-2 mb-3 cursor-pointer hover:bg-gray-100 p-2 rounded" data-id="${col.id}">
        <img src="${col.icon}" alt="icon" class="w-6 h-6 rounded"/>
        <span style="color:${col.color}" class="font-medium">${col.title}</span>
      </div>
    `).join('');
}

function renderTags(tags) {
  const tagsEl = document.getElementById('tags');
  tagsEl.innerHTML = tags.map(tag => `
    <span class="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
      <span class="material-icons text-xs">#</span>${tag.name}
    </span>
  `).join('');
}

function renderBookmarks(bookmarks, collections, bookmark_tags, tags) {
  const grid = document.getElementById('bookmarks-grid');
  grid.innerHTML = bookmarks.map(bm => {
    const col = collections.find(c => c.id === bm.collection_id);
    const bmTags = bookmark_tags.filter(bt => bt.bookmark_id === bm.id).map(bt => tags.find(t => t.id === bt.tag_id)?.name).filter(Boolean);
    return `
      <div class="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
        <img src="${bm.image}" alt="${bm.title}" class="w-full h-32 object-cover rounded"/>
        <div class="flex items-center gap-2 mb-1">
          <span class="w-3 h-3 rounded-full" style="background:${col?.color}"></span>
          <span class="text-xs text-gray-500">${col?.title || ''}</span>
        </div>
        <a href="${bm.url}" target="_blank" class="text-lg font-semibold text-blue-700 hover:underline">${bm.title}</a>
        <p class="text-sm text-gray-600">${bm.comment}</p>
        <div class="flex flex-wrap gap-1 mt-2">
          ${bmTags.map(tag => `<span class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">${tag}</span>`).join('')}
        </div>
      </div>
    `;
  }).join('');
}
