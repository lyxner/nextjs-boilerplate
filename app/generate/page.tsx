'use client';

import React, { useState, useRef, FormEvent, ChangeEvent } from 'react';
import styles from './page.module.css';

type Aspect = 'square_1_1' | 'widescreen_16_9';

export default function FreepikGeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<Aspect>('square_1_1');
  const [images, setImages] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState('');
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);

  const pollAbortRef = useRef({ aborted: false });

  const handlePromptChange = (e: ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value);
  const handleAspectChange = (e: ChangeEvent<HTMLSelectElement>) => setAspectRatio(e.target.value as Aspect);

  async function pollStatusLoop(tid: string, maxAttempts = 30, intervalMs = 1500) {
    setPolling(true);
    pollAbortRef.current.aborted = false;
    for (let attempt = 0; attempt < maxAttempts && !pollAbortRef.current.aborted; attempt++) {
      if (attempt > 0) await new Promise((r) => setTimeout(r, intervalMs));
      try {
        const resp = await fetch(`/api/generate-image/status?taskId=${encodeURIComponent(tid)}`);
        const json = await resp.json().catch(() => ({}));
        const data = json?.data ?? json;
        const s = data?.status;
        const imgs = Array.isArray(data?.generated) ? data.generated : Array.isArray(data?.images) ? data.images : [];
        if (s) setStatus(s);
        if (imgs.length) { setImages(imgs); break; }
        if (s === 'FAILED' || s === 'COMPLETED') break;
      } catch (err) {
        console.warn('Polling error', err);
      }
    }
    setPolling(false); setLoading(false);
  }

  const cancelPolling = () => { pollAbortRef.current.aborted = true; setPolling(false); setLoading(false); setStatus('Polling dibatalkan.'); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); setError(''); setImages([]); setStatus(null); setTaskId(null);
    if (!prompt.trim()) return setError('Prompt tidak boleh kosong.');
    setLoading(true); setStatus('Mengirim permintaan...');
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspect_ratio: aspectRatio }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) return setError(json?.error ?? `Generate gagal: ${res.status}`);
      const direct = json?.data?.generated ?? json?.generated ?? json?.images ?? null;
      if (Array.isArray(direct) && direct.length) { setImages(direct); setStatus('Selesai'); return; }
      const tid = json?.data?.task_id ?? json?.task_id ?? null;
      if (tid) { setTaskId(tid); setStatus('Task dibuat. Polling status...'); await pollStatusLoop(tid); }
      else setStatus('Tidak ada hasil dari API.');
    } catch (err: any) { setError(String(err)); } finally { setLoading(false); }
  };

  const downloadImage = async (srcOrId: string, filename: string, index: number) => {
    setDownloadingIndex(index); setError('');
    try {
      const isUrl = /^https?:\/\//i.test(srcOrId);
      const body = isUrl ? { imageUrl: srcOrId, filename } : { resourceId: srcOrId, filename };
      const resp = await fetch('/api/freepik-download', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-accept-license': '1' }, body: JSON.stringify(body) });
      if (!resp.ok) throw new Error(await resp.text() || `Response ${resp.status}`);
      const blob = await resp.blob(); const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch (err: any) { console.error('Download error', err); setError(`Gagal mengunduh: ${err?.message ?? err}`); } finally { setDownloadingIndex(null); }
  };

  return (
    <main className={styles.container} aria-live="polite">
      <h1 className={styles.title}>Generate Gambar AI (Freepik)</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label style={{ display: 'block', marginBottom: 6 }}>Prompt</label>
        <textarea
          value={prompt}
          onChange={handlePromptChange}
          placeholder="Disarankan menggunakan bhs.inggris, contoh: A white cat"
          rows={4}
          style={{ width: '100%', padding: 10, borderRadius: 8, boxSizing: 'border-box' }}
        />

        <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
          <select value={aspectRatio} onChange={handleAspectChange} style={{ padding: 8, borderRadius: 8 }} aria-label="Pilih aspect ratio">
            <option value="square_1_1">Square (1:1)</option>
            <option value="widescreen_16_9">16:9 Widescreen</option>
          </select>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            {polling && <button type="button" onClick={cancelPolling} style={{ padding: '8px 12px' }}>Batalkan Polling</button>}
            <button type="submit" style={{ padding: '8px 12px' }} disabled={loading}>{loading ? 'Memproses...' : 'Generate'}</button>
          </div>
        </div>
      </form>

      {error && <div role="alert" style={{ color: 'salmon', marginBottom: 12 }}>{error}</div>}
      {status && <div style={{ marginBottom: 12 }}><strong>Status:</strong> {status}</div>}
      {taskId && <div style={{ marginBottom: 12 }}><small>Task ID: <code>{taskId}</code></small></div>}

      <section className={styles.resultsSection}>
        <h2 className={styles.resultsTitle}>Hasil Gambar</h2>

        {images.length === 0 && (
          <p style={{ textAlign: 'center', color: '#888' }}>
            Belum ada gambar. Generate untuk melihat hasil.
          </p>
        )}

        <div className={styles.resultsGrid}>
          {images.map((src, i) => (
            <div key={i} className={styles.resultCard}>
              <div className={styles.resultImageWrapper}>
                <img src={src} alt={`Hasil ${i + 1}`} className={styles.resultImage} onError={() => console.warn('image load error', src)} />
              </div>

              <button
                type="button"
                className={styles.downloadButton}
                onClick={() => downloadImage(src, `freepik-image-${i + 1}.png`, i)}
                disabled={downloadingIndex !== null}
              >
                {downloadingIndex === i ? 'Mengunduh...' : 'Download'}
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
