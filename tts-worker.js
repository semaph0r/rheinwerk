/* Neuronale Sprachausgabe (Piper/VITS) im Web Worker – rechnet abseits des Spiel-Threads.
   Bausteine (zur Laufzeit von CDNs geladen, einmalig, danach im Browser-Cache):
   – Aussprache: piper_phonemize (espeak-ng als WebAssembly, @diffusionstudio/piper-wasm, jsdelivr)
   – Netz: onnxruntime-web 1.18 (WebAssembly-Backend, cdnjs)
   – Stimme: „Thorsten“ (Thorsten Müller, CC0) aus rhasspy/piper-voices (Hugging Face)
   Protokoll: {type:'init', voices:[id]} → progress… → ready | error;  {type:'synth', id, text, voice, speed} → audio | error */
/* eslint-disable no-restricted-globals */
const ORT_BASE = 'https://cdnjs.cloudflare.com/ajax/libs/onnxruntime-web/1.18.0/';
const PH_BASE = 'https://cdn.jsdelivr.net/npm/@diffusionstudio/piper-wasm@1.0.0/build/piper_phonemize';
const HF = ['https://huggingface.co/rhasspy/piper-voices/resolve/main', 'https://huggingface.co/diffusionstudio/piper-voices/resolve/main'];
const PATHS = {
  'de_DE-thorsten-medium': 'de/de_DE/thorsten/medium/de_DE-thorsten-medium.onnx',
  'de_DE-kerstin-low': 'de/de_DE/kerstin/low/de_DE-kerstin-low.onnx',
  'de_DE-thorsten-low': 'de/de_DE/thorsten/low/de_DE-thorsten-low.onnx',
  'de_DE-eva_k-x_low': 'de/de_DE/eva_k/x_low/de_DE-eva_k-x_low.onnx',
};
const CACHE = 'rheinwerk-tts-v1';
let phon = null, phOut = null, ready = null;
const voices = {};      // id -> { session, cfg }

const post = (m, tr) => self.postMessage(m, tr || []);
async function cacheGet(url) { try { if (!self.caches) return null; const c = await caches.open(CACHE); const r = await c.match(url); return r ? new Uint8Array(await r.arrayBuffer()) : null; } catch (e) { return null; } }
async function cachePut(url, bytes) { try { if (!self.caches) return; const c = await caches.open(CACHE); await c.put(url, new Response(bytes)); } catch (e) { /* Speicher voll / nicht erlaubt: dann eben ohne Cache */ } }
// Download mit Fortschritt; Ergebnis im Cache Storage (überlebt Neuladen und Browser-Neustart)
async function fetchBytes(urls, what, cache = true) {
  for (const url of [].concat(urls)) {
    const hit = cache && await cacheGet(url); if (hit) { post({ type: 'progress', what, loaded: hit.length, total: hit.length, cached: true }); return hit; }
    try {
      const r = await fetch(url); if (!r.ok) throw new Error(r.status + ' ' + url);
      const total = Number(r.headers.get('content-length')) || 0; const rd = r.body.getReader(); const parts = []; let got = 0, lastT = 0;
      for (;;) { const { done, value } = await rd.read(); if (done) break; parts.push(value); got += value.length; const now = Date.now(); if (now - lastT > 250) { lastT = now; post({ type: 'progress', what, loaded: got, total }); } }
      const out = new Uint8Array(got); let o = 0; for (const p of parts) { out.set(p, o); o += p.length; }
      post({ type: 'progress', what, loaded: got, total: total || got });
      if (cache) await cachePut(url, out);
      return out;
    } catch (e) { if (url === [].concat(urls).slice(-1)[0]) throw e; }
  }
  return null;
}
async function init(ids) {
  // ONNX-Laufzeit
  self.importScripts(ORT_BASE + 'ort.wasm.min.js');
  const ort = self.ort; ort.env.wasm.numThreads = 1; ort.env.wasm.wasmPaths = ORT_BASE; ort.env.wasm.proxy = false;
  // Aussprache-Modul: Daten (18 MB) selbst laden und cachen, dann ohne weiteren Download einhängen
  self.importScripts(PH_BASE + '.js');
  const [phWasm, phData] = await Promise.all([fetchBytes(PH_BASE + '.wasm', 'Aussprache (Wasm)'), fetchBytes(PH_BASE + '.data', 'Aussprache-Wörterbuch')]);
  phon = await self.createPiperPhonemize({
    print: (d) => { phOut = d; }, printErr: (e) => { console.warn('[phonemize]', e); },
    wasmBinary: phWasm.buffer,
    getPreloadedPackage: () => phData.buffer,
    locateFile: (u) => (u.endsWith('.wasm') ? PH_BASE + '.wasm' : u.endsWith('.data') ? PH_BASE + '.data' : u),
  });
  for (const id of ids) {
    const p = PATHS[id]; if (!p) continue;
    const cfgB = await fetchBytes(HF.map((b) => `${b}/${p}.json`), `Stimme ${id} (Konfiguration)`);
    const cfg = JSON.parse(new TextDecoder().decode(cfgB));
    const model = await fetchBytes(HF.map((b) => `${b}/${p}`), `Stimme ${id}`);
    post({ type: 'progress', what: `Stimme ${id} wird geladen`, loaded: 1, total: 1 });
    const session = await ort.InferenceSession.create(model.buffer, { executionProviders: ['wasm'], graphOptimizationLevel: 'all' });
    voices[id] = { session, cfg };
  }
  return Object.keys(voices);
}
function phonemize(text, lang) {
  phOut = null;
  phon.callMain(['-l', lang, '--input', JSON.stringify([{ text }]), '--espeak_data', '/espeak-ng-data']);
  if (!phOut) throw new Error('Aussprache fehlgeschlagen');
  return JSON.parse(phOut).phoneme_ids;
}
async function synth(text, id, speed = 1) {
  const v = voices[id] || voices[Object.keys(voices)[0]]; if (!v) throw new Error('keine Stimme geladen');
  const ort = self.ort, inf = v.cfg.inference || {};
  // Satzweise rechnen (lange Funksprüche), mit kurzen Pausen dazwischen
  const parts = text.replace(/\s+/g, ' ').match(/[^.!?]+[.!?]*/g) || [text];
  const sr = v.cfg.audio.sample_rate, pcms = []; let n = 0;
  for (const part of parts) {
    const t = part.trim(); if (!t) continue;
    const ids = phonemize(t, v.cfg.espeak.voice);
    const feeds = {
      input: new ort.Tensor('int64', BigInt64Array.from(ids, (x) => BigInt(x)), [1, ids.length]),
      input_lengths: new ort.Tensor('int64', BigInt64Array.from([BigInt(ids.length)])),
      scales: new ort.Tensor('float32', Float32Array.from([inf.noise_scale ?? 0.667, (inf.length_scale ?? 1) / speed, inf.noise_w ?? 0.8])),
    };
    if (v.cfg.num_speakers > 1) feeds.sid = new ort.Tensor('int64', BigInt64Array.from([0n]));
    const out = await v.session.run(feeds); const pcm = out.output.data;
    pcms.push(pcm); n += pcm.length; const gap = new Float32Array(Math.round(sr * 0.12)); pcms.push(gap); n += gap.length;
  }
  const all = new Float32Array(n); let o = 0; for (const p of pcms) { all.set(p, o); o += p.length; }
  return { pcm: all, sr };
}
self.onmessage = async (e) => {
  const m = e.data;
  if (m.type === 'init') {
    if (!ready) ready = init(m.voices || ['de_DE-thorsten-medium']);
    try { const v = await ready; post({ type: 'ready', voices: v }); } catch (err) { ready = null; post({ type: 'error', msg: String(err && err.message || err) }); }
  } else if (m.type === 'synth') {
    try { await ready; const t0 = Date.now(); const { pcm, sr } = await synth(m.text, m.voice, m.speed || 1); post({ type: 'audio', id: m.id, pcm, sr, ms: Date.now() - t0 }, [pcm.buffer]); }
    catch (err) { post({ type: 'audio', id: m.id, error: String(err && err.message || err) }); }
  } else if (m.type === 'clear') {
    try { await caches.delete(CACHE); post({ type: 'cleared' }); } catch (err) { post({ type: 'cleared', error: String(err) }); }
  }
};
