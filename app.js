// app.js
import { openDB, putBlob, getBlob, deleteBlob, loadStruct, saveStruct, exportJSON, importJSON } from './storage.js';
import { setupDropzone, simulateProgress, uploadToCloud } from './uploader.js';

const MAX_LOCAL_VIDEO = 2 * 1024 * 1024 * 1024; // 2GB (client-side guard)

const defaultState = {
  personal: {
    name: 'Divyansh Verma',
    email: 'divyanshv1911@gmail.com',
    phone: '+1(912)441-3829',
    location: 'Chicago, IL',
    linkedin: 'https://www.linkedin.com/in/divyansh-verma-analytics'
  },
  about: {
    intro: "I'm a multidisciplinary creative professional...",
    journey: "From VFX and 3D to digital marketing and analytics...",
    vision: "I create functional, efficient, and memorable experiences..."
  },
  media: {
    demoVideoKey: null,     // IndexedDB key for blob
    demoVideoURL: '',       // optional remote URL
    profileKey: null
  },
  projects: [],
  creative: [],
  skills: {
    '3D & VFX': ['Maya', 'Houdini', 'Unreal Engine', 'ZBrush', 'Substance Painter', 'Nuke'],
    Design: ['Adobe Creative Suite', 'UI/UX Design', 'Visual Design', 'Motion Graphics'],
    Marketing: ['Digital Marketing', 'SEO/SEM', 'Content Marketing', 'Social Media Marketing'],
    Analytics: ['Python', 'R', 'SQL', 'Tableau', 'Business Intelligence', 'Data Analytics']
  }
};

let state = loadStruct() || defaultState;
let editMode = false;

const qs = sel => document.querySelector(sel);
const qsa = sel => Array.from(document.querySelectorAll(sel));

init();

async function init(){
  await openDB();
  wireHeader();
  renderStaticBindings();
  renderDemo();
  renderProjects();
  renderCreative();
  renderSkills();
  wireAbout();
  wireContact();
  wireBackup();
}

/* Header, Edit Mode */
function wireHeader(){
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav__toggle');
  toggle.addEventListener('click', ()=>{
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    nav.setAttribute('aria-expanded', !expanded);
    toggle.setAttribute('aria-expanded', !expanded);
  });

  qs('#editToggle').addEventListener('click', ()=>{
    editMode = !editMode;
    document.body.classList.toggle('is-edit', editMode);
    qs('#editToggle').textContent = editMode ? 'Editing…' : 'Edit Mode';
  });
}

function renderStaticBindings(){
  // Bind editable text fields with data-editable attributes
  qsa('[data-editable]').forEach(el=>{
    el.contentEditable = false;
    el.addEventListener('input', ()=>{
      const path = el.getAttribute('data-editable').split('.');
      setDeep(state, path, el.textContent.trim());
      saveStruct(state);
      hydrateDependent(path);
    });
    el.addEventListener('focus', ()=> { if(!editMode) el.blur(); });
  });
  // Hydrate initial content
  setEditable('personal.name', state.personal.name);
  setEditable('personal.email', state.personal.email);
  setEditable('personal.phone', state.personal.phone);
  setEditable('personal.location', state.personal.location);
  setEditable('about.intro', state.about.intro);
  setEditable('about.journey', state.about.journey);
  setEditable('about.vision', state.about.vision);

  // LinkedIn
  const link = qs('#linkedinLink');
  link.href = state.personal.linkedin || '#';
}

/* Demo Reel */
function renderDemo(){
  const videoEl = qs('#demoVideo');
  applyDemoSource(videoEl);

  const dz = qs('#demoDropzone');
  const browse = qs('#demoBrowse');
  const input = qs('#demoFile');
  const progress = qs('#demoProgress');
  const bar = qs('#demoProgressBar');

  browse.addEventListener('click', ()=> input.click());

  setupDropzone(dz, {
    accept: 'video/*',
    multiple: false,
    progressEl: progress,
    onFiles: async (files)=>{
      const file = files[0];
      if (!file) return;
      if (file.size > MAX_LOCAL_VIDEO){
        alert('This file exceeds 2GB. Use Cloud Upload instead.');
        return;
      }
      await putBlob('demoVideo', file);
      state.media.demoVideoKey = 'demoVideo';
      state.media.demoVideoURL = ''; // prefer local
      saveStruct(state);
      await simulateProgress(file.size, progress);
      applyDemoSource(videoEl);
    }
  });

  // Cloud Upload UI
  qs('#cloudUploadButton').addEventListener('click', async ()=>{
    const endpoint = qs('#cloudEndpoint').value.trim();
    const token = qs('#cloudToken').value.trim();
    const f = input.files?.;
    if (!f){ alert('Choose a file first.'); return; }
    try{
      let lastPct = 0;
      await uploadToCloud({
        endpoint, token, file:f, onProgress: (pct)=>{
          lastPct = pct;
          bar.style.width = pct+'%';
          progress.hidden = false;
        }
      });
      setTimeout(()=>{ progress.hidden = true; bar.style.width = '0%'; }, 700);
      alert('Uploaded to cloud. Paste the CDN URL below and click "Use URL".');
    }catch(err){
      alert('Cloud upload failed: '+err.message);
    }
  });

  qs('#useDemoURL').addEventListener('click', ()=>{
    const url = qs('#demoURL').value.trim();
    if (!url) return;
    state.media.demoVideoURL = url;
    saveStruct(state);
    applyDemoSource(videoEl);
  });
}

async function applyDemoSource(videoEl){
  videoEl.removeAttribute('src');
  videoEl.load();

  if (state.media.demoVideoURL){
    videoEl.src = state.media.demoVideoURL;
    videoEl.load();
    return;
  }
  if (state.media.demoVideoKey){
    const blob = await getBlob(state.media.demoVideoKey);
    if (blob){
      const url = URL.createObjectURL(blob);
      videoEl.src = url;
      videoEl.load();
    }
  }
}

/* Projects */
function renderProjects(){
  const list = qs('#projectList');
  list.innerHTML = '';
  state.projects.forEach((p, idx)=>{
    const li = document.createElement('li');
    li.className = 'project-card';
    li.draggable = true;
    li.dataset.index = idx;

    const img = document.createElement('img');
    img.className = 'project-card__thumb';
    if (p.coverKey) {
      getBlob(p.coverKey).then(b=>{
        if (b) img.src = URL.createObjectURL(b);
      });
    }

    const body = document.createElement('div');
    body.className = 'project-card__body';
    body.innerHTML = `
      <div class="project-card__meta">${p.timeline || ''}</div>
      <div class="project-card__title">${escapeHTML(p.title || 'Untitled')}</div>
      <div class="project-card__subtitle muted">${escapeHTML(p.subtitle || '')}</div>
      <div class="project-card__summary">${escapeHTML(p.summary || '')}</div>
      <div class="project-card__actions">
        <button class="btn btn--ghost btn--sm edit">Edit</button>
        <button class="btn btn--ghost btn--sm view">View</button>
      </div>
    `;
    li.appendChild(img);
    li.appendChild(body);
    list.appendChild(li);

    // Edit handler
    body.querySelector('.edit').addEventListener('click', ()=> openProjectModal(idx));
    body.querySelector('.view').addEventListener('click', ()=> openProjectModal(idx, true));

    // Drag reorder
    li.addEventListener('dragstart', e=>{
      e.dataTransfer.setData('text/plain', idx.toString());
      li.classList.add('dragging');
    });
    li.addEventListener('dragend', ()=> li.classList.remove('dragging'));
    li.addEventListener('dragover', e=>{
      e.preventDefault();
      const dragging = list.querySelector('.dragging');
      const after = getDragAfterElement(list, e.clientY);
      if (after == null){
        list.appendChild(dragging);
      } else {
        list.insertBefore(dragging, after);
      }
    });
    li.addEventListener('drop', ()=>{
      const order = Array.from(list.querySelectorAll('.project-card')).map(el=> +el.dataset.index);
      const newOrder = Array.from(new Set(order)); // robust
      state.projects = newOrder.map(i=> state.projects[i]);
      saveStruct(state);
      renderProjects();
    });
  });

  qs('#addProject').onclick = ()=> openProjectModal(null);
}

function getDragAfterElement(container, y){
  const cards = [...container.querySelectorAll('.project-card:not(.dragging)')];
  return cards.reduce((closest, child)=>{
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height/2;
    if (offset < 0 && offset > closest.offset){
      return { offset, element: child };
    } else return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function openProjectModal(index, readOnly=false){
  const modal = qs('#projectModal');
  const form = qs('#projectForm');
  const delBtn = qs('#deleteProject');
  const title = qs('#projectModalTitle');

  let proj = index!=null ? {...state.projects[index]} : {
    title:'', subtitle:'', timeline:'', roles:'', tools:'', summary:'', details:'',
    coverKey:null, galleryKeys:[]
  };

  title.textContent = index!=null ? 'Edit Project' : 'Add Project';
  form.title.value = proj.title;
  form.subtitle.value = proj.subtitle;
  form.timeline.value = proj.timeline;
  form.roles.value = Array.isArray(proj.roles) ? proj.roles.join(', ') : (proj.roles || '');
  form.tools.value = Array.isArray(proj.tools) ? proj.tools.join(', ') : (proj.tools || '');
  form.summary.value = proj.summary;
  form.details.value = proj.details;

  // Cover
  const coverImg = qs('#coverPreview');
  coverImg.src = '';
  if (proj.coverKey){
    getBlob(proj.coverKey).then(b=> b && (coverImg.src = URL.createObjectURL(b)));
  }

  // Gallery
  const galleryWrap = qs('#galleryPreview');
  galleryWrap.innerHTML = '';
  if (proj.galleryKeys?.length){
    proj.galleryKeys.forEach(async key=>{
      const b = await getBlob(key);
      if (!b) return;
      const img = document.createElement('img');
      img.src = URL.createObjectURL(b);
      galleryWrap.appendChild(img);
    });
  }

  // Dropzones
  setupDropzone(qs('#coverDrop'), {
    accept: 'image/*',
    onFiles: async files=>{
      const f = files[0]; if (!f) return;
      const key = `project-cover-${Date.now()}`;
      await putBlob(key, f);
      // cleanup old
      if (proj.coverKey && proj.coverKey!==key) await deleteBlob(proj.coverKey);
      proj.coverKey = key;
      const b = await getBlob(key);
      coverImg.src = URL.createObjectURL(b);
    }
  });
  setupDropzone(qs('#galleryDrop'), {
    accept: 'image/*',
    multiple: true,
    onFiles: async files=>{
      for (const f of files){
        const key = `project-gallery-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        await putBlob(key, f);
        proj.galleryKeys.push(key);
        const b = await getBlob(key);
        const img = document.createElement('img');
        img.src = URL.createObjectURL(b);
        galleryWrap.appendChild(img);
      }
    }
  });
  qs('#coverBrowse').onclick = ()=> qs('#coverDrop input[type=file]').click();
  qs('#galleryBrowse').onclick = ()=> qs('#galleryDrop input[type=file]').click();

  delBtn.style.visibility = index!=null ? 'visible' : 'hidden';
  delBtn.onclick = ()=>{
    if (index==null) return;
    if (!confirm('Delete this project?')) return;
    // clean blobs (optional to keep cache)
    if (proj.coverKey) deleteBlob(proj.coverKey);
    proj.galleryKeys?.forEach(k=> deleteBlob(k));
    state.projects.splice(index,1);
    saveStruct(state);
    modal.close();
    renderProjects();
  };

  form.onsubmit = e=>{
    e.preventDefault();
    proj.title    = form.title.value.trim();
    proj.subtitle = form.subtitle.value.trim();
    proj.timeline = form.timeline.value.trim();
    proj.roles    = form.roles.value.split(',').map(s=>s.trim()).filter(Boolean);
    proj.tools    = form.tools.value.split(',').map(s=>s.trim()).filter(Boolean);
    proj.summary  = form.summary.value.trim();
    proj.details  = form.details.value.trim();

    if (index!=null) state.projects[index] = proj;
    else state.projects.push(proj);

    saveStruct(state);
    modal.close();
    renderProjects();
  };

  modal.showModal();
}

/* Creative Corner */
function renderCreative(){
  const list = qs('#creativeList');
  list.innerHTML = '';
  state.creative.forEach((item, idx)=>{
    const li = document.createElement('li');
    li.className = 'creative-card';

    const mediaWrap = document.createElement(item.type==='video' ? 'video' : 'img');
    if (item.type==='video'){
      mediaWrap.controls = true; mediaWrap.playsinline = true; mediaWrap.muted = true;
    }
    if (item.key){
      getBlob(item.key).then(b=>{
        if (b) mediaWrap.src = URL.createObjectURL(b);
      });
    }

    const body = document.createElement('div');
    body.className = 'creative-card__body';
    body.innerHTML = `
      <div class="muted">${new Date(item.createdAt||Date.now()).toLocaleDateString()}</div>
      <div>${escapeHTML(item.caption||'')}</div>
      <div style="margin-top:8px; display:flex; gap:8px;">
        <button class="btn btn--ghost btn--sm edit">Edit</button>
        <button class="btn btn--danger btn--sm delete">Delete</button>
      </div>
    `;

    body.querySelector('.edit').onclick = ()=> openCreativeModal(idx);
    body.querySelector('.delete').onclick = ()=>{
      if (!confirm('Delete this post?')) return;
      if (item.key) deleteBlob(item.key);
      state.creative.splice(idx,1);
      saveStruct(state);
      renderCreative();
    };

    li.appendChild(mediaWrap);
    li.appendChild(body);
    list.appendChild(li);
  });

  qs('#addCreative').onclick = ()=> openCreativeModal(null);
}

function openCreativeModal(index){
  const modal = qs('#creativeModal');
  const form = qs('#creativeForm');
  const imgPrev = qs('#creativeImagePreview');
  const vidPrev = qs('#creativeVideoPreview');
  const delBtn = qs('#deleteCreative');

  let item = index!=null ? {...state.creative[index]} : { type:'image', caption:'', key:null, createdAt: Date.now() };

  // Reset previews
  imgPrev.src = ''; imgPrev.hidden = false;
  vidPrev.src = ''; vidPrev.hidden = true;

  form.caption.value = item.caption || '';

  // Dropzone
  setupDropzone(qs('#creativeDrop'), {
    accept: 'image/*,video/*',
    onFiles: async files=>{
      const f = files[0]; if (!f) return;
      const key = `creative-${Date.now()}`;
      await putBlob(key, f);
      if (item.key && item.key!==key) await deleteBlob(item.key);
      item.key = key;
      item.type = f.type.startsWith('video') ? 'video' : 'image';
      const b = await getBlob(key);
      const url = URL.createObjectURL(b);
      if (item.type==='video'){ vidPrev.src = url; vidPrev.hidden=false; imgPrev.hidden=true; }
      else { imgPrev.src = url; imgPrev.hidden=false; vidPrev.hidden=true; }
    }
  });
  qs('#creativeBrowse').onclick = ()=> qs('#creativeDrop input[type=file]').click();

  delBtn.style.visibility = index!=null ? 'visible' : 'hidden';
  delBtn.onclick = ()=>{
    if (index==null) return;
    if (!confirm('Delete this post?')) return;
    if (item.key) deleteBlob(item.key);
    state.creative.splice(index,1);
    saveStruct(state);
    modal.close();
    renderCreative();
  };

  form.onsubmit = e=>{
    e.preventDefault();
    item.caption = form.caption.value.trim();
    if (index!=null) state.creative[index] = item;
    else state.creative.unshift(item); // newest first
    saveStruct(state);
    modal.close();
    renderCreative();
  };

  modal.showModal();
}

/* Skills */
function renderSkills(){
  const wrap = qs('#skillsWrap');
  wrap.innerHTML = '';
  for (const [cat, items] of Object.entries(state.skills)){
    const card = document.createElement('div');
    card.className = 'skill-card';
    card.innerHTML = `<h4>${escapeHTML(cat)}</h4><div class="muted">${items.map(escapeHTML).join(' • ')}</div>`;
    wrap.appendChild(card);
  }
}

/* About/Profile */
function wireAbout(){
  setupDropzone(qs('#profileDrop'), {
    accept: 'image/*',
    onFiles: async files=>{
      const f = files; if (!f) return;
      const key = `profile-${Date.now()}`;
      await putBlob(key, f);
      if (state.media.profileKey && state.media.profileKey!==key) await deleteBlob(state.media.profileKey);
      state.media.profileKey = key;
      saveStruct(state);
      hydrateProfile();
    }
  });
  qs('#profileBrowse').onclick = ()=> qs('#profileDrop input[type=file]').click();
  hydrateProfile();
}

async function hydrateProfile(){
  const img = qs('#profileImage');
  img.src = '';
  if (state.media.profileKey){
    const b = await getBlob(state.media.profileKey);
    if (b) img.src = URL.createObjectURL(b);
  }
}

/* Contact */
function wireContact(){
  // keep LinkedIn link synced if edited through JSON later
  const link = qs('#linkedinLink');
  link.href = state.personal.linkedin || '#';
}

/* Backup */
function wireBackup(){
  qs('#exportData').onclick = ()=> exportJSON();
  qs('#importData').addEventListener('change', async (e)=>{
    const file = e.target.files?.;
    if (!file) return;
    await importJSON(file);
    state = loadStruct() || defaultState;
    // re-render everything
    renderStaticBindings();
    renderDemo();
    renderProjects();
    renderCreative();
    renderSkills();
    hydrateProfile();
    alert('Imported content.');
  });
}

/* Helpers */
function setEditable(path, value){
  const el = qs(`[data-editable="${path}"]`);
  if (el) el.textContent = value || '';
}
function setDeep(obj, pathArr, value){
  let ref = obj;
  for (let i=0;i<pathArr.length-1;i++){
    const k = pathArr[i];
    if (!(k in ref)) ref[k] = {};
    ref = ref[k];
  }
  ref[pathArr[pathArr.length-1]] = value;
  saveStruct(state);
}
function hydrateDependent(path){
  if (path==='personal' && path[1]==='linkedin'){
    const link = qs('#linkedinLink');
    link.href = state.personal.linkedin || '#';
  }
}
function escapeHTML(s){
  return (s||'').replace(/[&<>"']/g, c=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
