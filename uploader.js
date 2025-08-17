// uploader.js
export function setupDropzone(zone, {onFiles, accept= '', multiple=false, progressEl}){
  const input = zone.querySelector('input[type=file]') || (()=>{ const i=document.createElement('input'); i.type='file'; zone.appendChild(i); return i; })();
  if (accept) input.setAttribute('accept', accept);
  if (multiple) input.setAttribute('multiple', 'multiple');

  const browseBtn = zone.querySelector('button');
  browseBtn?.addEventListener('click', ()=> input.click());

  input.addEventListener('change', ()=> handleFiles(input.files));

  function handleFiles(files){
    if (!files || !files.length) return;
    const arr = Array.from(files);
    onFiles(arr, progressEl);
  }

  zone.addEventListener('dragover', e=>{ e.preventDefault(); zone.classList.add('highlight'); });
  zone.addEventListener('dragleave', ()=> zone.classList.remove('highlight'));
  zone.addEventListener('drop', e=>{
    e.preventDefault();
    zone.classList.remove('highlight');
    let files = e.dataTransfer?.files;
    if (files?.length) handleFiles(files);
  });
}

export async function simulateProgress(totalBytes, progressEl, onUpdate){
  if (!progressEl) return;
  progressEl.hidden = false;
  const bar = progressEl.querySelector('.progress__bar');
  let loaded = 0;
  while (loaded < totalBytes){
    await new Promise(r=> setTimeout(r, 30));
    loaded += totalBytes/80;
    const pct = Math.min(100, Math.round(loaded/totalBytes*100));
    bar.style.width = pct+'%';
    onUpdate?.(pct);
  }
  setTimeout(()=>{ progressEl.hidden = true; bar.style.width = '0%'; }, 600);
}

// Simple cloud upload placeholder (you can swap for Uploadcare/Uppy)
export async function uploadToCloud({endpoint, token, file, onProgress}){
  if (!endpoint || !token) throw new Error('Missing cloud endpoint or token');

  // Basic fetch with progress: use XHR for progress
  const xhr = new XMLHttpRequest();
  return await new Promise((resolve, reject)=>{
    xhr.open('POST', endpoint);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.upload.onprogress = (e)=>{
      if (e.lengthComputable) onProgress?.(Math.round(e.loaded/e.total*100));
    };
    xhr.onload = ()=>{
      if (xhr.status >=200 && xhr.status<300){
        try{ resolve(JSON.parse(xhr.responseText)); }
        catch{ resolve({ok:true, response:xhr.responseText}); }
      } else reject(new Error('Upload failed: '+xhr.status));
    };
    xhr.onerror = ()=> reject(new Error('Network error'));
    const form = new FormData();
    form.append('file', file);
    xhr.send(form);
  });
}
