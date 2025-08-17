// storage.js
const DB_NAME = 'divyansh-portfolio';
const DB_VERSION = 1;
let db;

export async function openDB(){
  if (db) return db;
  db = await new Promise((resolve, reject)=>{
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const d = req.result;
      if (!d.objectStoreNames.contains('media')) d.createObjectStore('media');
    };
    req.onsuccess = ()=> resolve(req.result);
    req.onerror = ()=> reject(req.error);
  });
  return db;
}

export async function putBlob(key, blob){
  const d = await openDB();
  return new Promise((resolve, reject)=>{
    const tx = d.transaction('media','readwrite');
    tx.objectStore('media').put(blob, key);
    tx.oncomplete = resolve;
    tx.onerror = ()=> reject(tx.error);
  });
}
export async function getBlob(key){
  const d = await openDB();
  return new Promise((resolve, reject)=>{
    const tx = d.transaction('media','readonly');
    const req = tx.objectStore('media').get(key);
    req.onsuccess = ()=> resolve(req.result || null);
    req.onerror = ()=> reject(req.error);
  });
}
export async function deleteBlob(key){
  const d = await openDB();
  return new Promise((resolve, reject)=>{
    const tx = d.transaction('media','readwrite');
    tx.objectStore('media').delete(key);
    tx.oncomplete = resolve;
    tx.onerror = ()=> reject(tx.error);
  });
}

// Structure in LocalStorage
const STRUCT_KEY = 'site-structure-v1';
export function loadStruct(){
  try{
    return JSON.parse(localStorage.getItem(STRUCT_KEY)) || null;
  }catch{ return null; }
}
export function saveStruct(obj){
  localStorage.setItem(STRUCT_KEY, JSON.stringify(obj));
}

// Export/Import
export async function exportJSON(){
  const struct = loadStruct();
  const payload = { struct, exportedAt: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(payload,null,2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), {href:url, download:'divyansh-portfolio.json'});
  a.click(); URL.revokeObjectURL(url);
}

export async function importJSON(file){
  const text = await file.text();
  const data = JSON.parse(text);
  if (data && data.struct) saveStruct(data.struct);
}
