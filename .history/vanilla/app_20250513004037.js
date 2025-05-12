let globalData = null;
let selectedCategory = null;
let selectedTag = null;

const ULTIMA_ACTUALIZACION = "13-05-2025";

// Cargar y renderizar los datos desde data.json
fetch('../lib/data.json')
  .then(res => res.json())
  .then(data => {
    globalData = data;
    renderSidebar(data.collections);
    renderTags(data.tags);
    renderBookmarks(data.bookmarks, data.collections, data.bookmark_tags, data.tags);
    addSidebarListeners();
    addTagListeners();
  });

function renderSidebar(collections) {
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = `<div class="mb-4 flex justify-center"><img src="../logoweb1.png" alt="Logo" class="w-32 h-auto"/></div>` +
    `<h2 class="text-xl font-semibold mb-4">Categorías</h2>` +
    `<div class="flex flex-col gap-1" id="categories-list">
      <div class="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded font-bold" data-id="all">
        <span class="w-6 h-6 flex items-center justify-center text-xl">🗃️</span>
        <span class="font-medium">Todas</span>
      </div>` +
    collections.map(col => `
        <div class="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded" data-id="${col.id}">
          <img src="${col.icon}" alt="icon" class="w-6 h-6 rounded"/>
          <span style="color:${col.color}" class="font-medium">${col.title}</span>
        </div>`).join('') +
    `</div>` +
    `<div class="mt-auto text-xs text-gray-500 leading-tight px-2 py-1">
      Ultima actualización: ${ULTIMA_ACTUALIZACION}
      <br/>
      Creado por Juanfranbrv
    </div>`;
}

function renderTags(tags) {
  let filteredTags = tags;
  if (selectedCategory && selectedCategory !== 'all') {
    // Filtrar tags que estén presentes en los bookmarks de la categoría seleccionada
    const bookmarksInCategory = globalData.bookmarks.filter(bm => bm.collection_id === Number(selectedCategory));
    const bookmarkIds = bookmarksInCategory.map(bm => bm.id);
    const tagIds = globalData.bookmark_tags.filter(bt => bookmarkIds.includes(bt.bookmark_id)).map(bt => bt.tag_id);
    filteredTags = tags.filter(tag => tagIds.includes(tag.id));
  }
  const tagsEl = document.getElementById('tags');
  tagsEl.innerHTML = `<span class="bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1 cursor-pointer font-bold" data-id="all"><span class="text-xs">✕</span>Todos</span>` +
    filteredTags.map(tag => `
      <span class="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1 cursor-pointer" data-id="${tag.id}">
        <span class="text-xs">#</span>${tag.name}
      </span>
    `).join('');
}

function renderBookmarks(bookmarks, collections, bookmark_tags, tags) {
  const grid = document.getElementById('bookmarks-grid');
  let filtered = bookmarks;
  if (selectedCategory && selectedCategory !== 'all') {
    filtered = filtered.filter(bm => bm.collection_id === Number(selectedCategory));
  }
  if (selectedTag && selectedTag !== 'all') {
    const tagId = Number(selectedTag);
    const bookmarkIds = bookmark_tags.filter(bt => bt.tag_id === tagId).map(bt => bt.bookmark_id);
    filtered = filtered.filter(bm => bookmarkIds.includes(bm.id));
  }
  grid.innerHTML = filtered.map(bm => {
    const col = collections.find(c => c.id === bm.collection_id);
    const bmTags = bookmark_tags.filter(bt => bt.bookmark_id === bm.id).map(bt => tags.find(t => t.id === bt.tag_id)?.name).filter(Boolean);
    return `
      <a href="${bm.url}" target="_blank" class="block group focus:outline-none">
        <div class="bg-white rounded-lg shadow flex flex-col gap-2 p-0 transition ring-2 ring-transparent group-hover:ring-blue-200 group-focus:ring-blue-400">
          <img src="${bm.image}" alt="${bm.title}" class="w-full aspect-[4/3] object-cover rounded-t-lg"/>
          <div class="p-4 flex flex-col gap-2">
            <div class="flex items-center gap-2 mb-1">
              <span class="w-3 h-3 rounded-full" style="background:${col?.color}"></span>
              <span class="text-xs text-gray-500">${col?.title || ''}</span>
            </div>
            <div class="text-lg font-semibold text-blue-700 group-hover:underline text-truncate-3">${bm.title}</div>
            <p class="text-sm text-gray-600 text-truncate-3">${bm.comment}</p>
            <div class="flex flex-wrap gap-1 mt-2">
              ${bmTags.map(tag => `<span class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">${tag}</span>`).join('')}
            </div>
          </div>
        </div>
      </a>
    `;
  }).join('');
  updateHeader();
}

function addSidebarListeners() {
  document.getElementById('sidebar').addEventListener('click', e => {
    const el = e.target.closest('[data-id]');
    if (!el) return;
    selectedCategory = el.getAttribute('data-id');
    selectedTag = 'all'; // Al seleccionar categoría, los tags vuelven a #Todos
    renderTags(globalData.tags); // Actualiza los tags según la categoría
    renderBookmarks(globalData.bookmarks, globalData.collections, globalData.bookmark_tags, globalData.tags);
    // Resalta la categoría seleccionada
    document.querySelectorAll('#sidebar [data-id]').forEach(div => div.classList.remove('bg-blue-100'));
    el.classList.add('bg-blue-100');
    // Resalta el tag #Todos
    document.querySelectorAll('#tags [data-id]').forEach(span => span.classList.remove('bg-blue-300', 'text-white'));
    const tagTodos = document.querySelector('#tags [data-id="all"]');
    if (tagTodos) tagTodos.classList.add('bg-blue-300', 'text-white');
    addTagListeners(); // Reasigna listeners porque se re-renderizan los tags
  });
}

function addTagListeners() {
  document.getElementById('tags').addEventListener('click', e => {
    const el = e.target.closest('[data-id]');
    if (!el) return;
    selectedTag = el.getAttribute('data-id');
    renderBookmarks(globalData.bookmarks, globalData.collections, globalData.bookmark_tags, globalData.tags);
    // Resalta el tag seleccionado
    document.querySelectorAll('#tags [data-id]').forEach(span => span.classList.remove('bg-blue-300', 'text-white'));
    el.classList.add('bg-blue-300', 'text-white');
    updateHeader();
  });
}

function updateHeader() {
  const header = document.querySelector('main header h1');
  if (selectedCategory === 'all' || !selectedCategory) {
    header.textContent = 'Marcadores Bauset';
  } else {
    const col = globalData.collections.find(c => c.id === Number(selectedCategory));
    if (selectedTag && selectedTag !== 'all') {
      const tag = globalData.tags.find(t => t.id === Number(selectedTag));
      header.textContent = `${col ? col.title : ''} #${tag ? tag.name : ''}`;
    } else {
      header.textContent = col ? col.title : '';
    }
  }
}
