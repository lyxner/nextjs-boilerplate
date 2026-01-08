'use client';

import React, { useState, useRef, FormEvent, ChangeEvent } from 'react';


import styles from './page.module.css';

export default function FreepikGeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'square_1_1' | 'widescreen_16_9'>('square_1_1');
  const [images, setImages] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState('');
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);

  const pollAbortRef = useRef<{ aborted: boolean }>({ aborted: false });

  const handlePromptChange = (e: ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value);
  const handleAspectChange = (e: ChangeEvent<HTMLSelectElement>) => setAspectRatio(e.target.value as any);

  async function pollStatusLoop(tid: string, maxAttempts = 30, intervalMs = 1500) {
    setPolling(true);
    pollAbortRef.current.aborted = false;
    let attempt = 0;

    while (attempt < maxAttempts && !pollAbortRef.current.aborted) {
      attempt++;
      if (attempt > 1) await new Promise((r) => setTimeout(r, intervalMs));
      try {
        const resp = await fetch(`/api/generate-image/status?taskId=${encodeURIComponent(tid)}`);
        const json = await resp.json();
        const data = json?.data ?? json;
        const s = data?.status;
        const imgs = Array.isArray(data?.generated) ? data.generated : Array.isArray(data?.images) ? data.images : [];

        if (s) setStatus(s);
        if (imgs.length > 0) {
          setImages(imgs);
          setPolling(false);
          setLoading(false);
          return;
        }

        if (s === 'FAILED' || s === 'COMPLETED') {
          setPolling(false);
          setLoading(false);
          return;
        }
      } catch (err: any) {
        console.warn('Polling error', err);
      }
    }

    setPolling(false);
    setLoading(false);
    if (!pollAbortRef.current.aborted) setStatus('Batas polling tercapai.');
  }

  const cancelPolling = () => {
    pollAbortRef.current.aborted = true;
    setPolling(false);
    setLoading(false);
    setStatus('Polling dibatalkan.');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setImages([]);
    setStatus(null);
    setTaskId(null);

    if (!prompt.trim()) {
      setError('Prompt tidak boleh kosong.');
      return;
    }

    setLoading(true);
    setStatus('Mengirim permintaan...');

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspect_ratio: aspectRatio }),
      });

      const json = await response.json();
      if (!response.ok) {
        setError(json?.error ?? `Generate gagal: ${response.status}`);
        setLoading(false);
        return;
      }

      // Jika API langsung mengembalikan gambar 
      const directImgs = json?.data?.generated ?? json?.generated ?? json?.images ?? null;
      if (Array.isArray(directImgs) && directImgs.length > 0) {
        setImages(directImgs);
        setStatus('Selesai');
        setLoading(false);
        return;
      }

      // Jika task id diberikan, polling
      const tid = json?.data?.task_id ?? json?.task_id ?? null;
      if (tid) {
        setTaskId(tid);
        setStatus('Task dibuat. Polling status...');
        await pollStatusLoop(tid);
      } else {
        setStatus('Tidak ada hasil dari API.');
      }
    } catch (err: any) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  // POST supaya token panjang aman dan mudah dilihat di logs
  const downloadImage = async (srcOrId: string, filename: string, index: number) => {
    setDownloadingIndex(index);
    setError('');

    try {
      const isUrl = /^https?:\/\//i.test(srcOrId);
      const body = isUrl ? { imageUrl: srcOrId, filename } : { resourceId: srcOrId, filename };

      // panggil POST ke endpoint download
      const resp = await fetch('/api/freepik-download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-accept-license': '1', // server memeriksa header ini
        },
        body: JSON.stringify(body),
      });

      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt || `Response ${resp.status}`);
      }

      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    } catch (err: any) {
      console.error('Download error', err);
      setError(`Gagal mengunduh: ${err?.message ?? err}`);
    } finally {
      setDownloadingIndex(null);
    }
  };

  // inline styles tombol
  const downloadBtnStyle: React.CSSProperties = {
    backgroundColor: '#b71c1c', // dark red
    color: '#fff',
    border: 'none',
    padding: '10px 14px',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
    marginTop: 8,
  };

  const disabledStyle: React.CSSProperties = {
    opacity: 0.6,
    cursor: 'not-allowed',
  };

  return (
    <main className={styles.container ?? ''} aria-live="polite" style={{ padding: 20 }}>
      <h1 className={styles.title ?? ''}>Generate Gambar AI (Freepik)</h1>

      <form onSubmit={handleSubmit} className={styles.form ?? ''} style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 6 }}>Prompt</label>
        <textarea
          value={prompt}
          onChange={handlePromptChange}
          placeholder="Disarankan menggunakan bhs.inggris,contoh: A white cat"
          rows={4}
          style={{ width: '100%', padding: 10, borderRadius: 8 }}
        />

        <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
          <select value={aspectRatio} onChange={handleAspectChange} style={{ padding: 8, borderRadius: 8 }}>
            <option value="square_1_1">Square (1:1)</option>
            <option value="widescreen_16_9">16:9 Widescreen</option>
          </select>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            {polling && (
              <button type="button" onClick={cancelPolling} className={styles.button ?? ''} style={{ padding: '8px 12px' }}>
                Batalkan Polling
              </button>
            )}
            <button type="submit" className={styles.button ?? ''} style={{ padding: '8px 12px' }} disabled={loading}>
              {loading ? 'Memproses...' : 'Generate'}
            </button>
          </div>
        </div>
      </form>

      {error && <div role="alert" style={{ color: 'salmon', marginBottom: 12 }}>{error}</div>}
      {status && <div style={{ marginBottom: 12 }}><strong>Status:</strong> {status}</div>}
      {taskId && <div style={{ marginBottom: 12 }}><small>Task ID: <code>{taskId}</code></small></div>}

      <section>
        <h2>Hasil Gambar</h2>

        {/* Jika belum ada gambar, tampilkan pesan */}
        {images.length === 0 && <p style={{ color: '#888' }}>Belum ada gambar. Generate untuk melihat hasil.</p>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {images.map((src, i) => (
            <div key={i} style={{ border: '1px solid #2222', padding: 12, borderRadius: 8, textAlign: 'center' }}>
              <img
                src={src}
                alt={`Hasil ${i + 1}`}
                style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 6 }}
                onError={() => console.warn('image load error', src)}
              />

              <div style={{ marginTop: 8 }}>
                <button
                  data-testid={`download-button-${i}`}
                  type="button"
                  style={{
                    ...downloadBtnStyle,
                    ...(downloadingIndex !== null ? disabledStyle : {}),
                    width: '100%',
                  }}
                  onClick={() => downloadImage(src, `freepik-image-${i + 1}.png`, i)}
                  disabled={downloadingIndex !== null}
                >
                  {downloadingIndex === i ? 'Mengunduh...' : 'Download'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
