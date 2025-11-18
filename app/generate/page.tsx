'use client';

import React, { useState, useRef, FormEvent, ChangeEvent } from 'react';
import styles from './page.module.css';

/**
 * Page: Generate Gambar AI (Freepik)
 * - POST ke /api/generate-image
 * - Jika response berisi task_id tapi belum ada images -> polling ke /api/generate-image/status
 *
 * Pastikan server-side sudah terpasang:
 * - app/api/generate-image/route.ts  (POST handler)
 * - app/api/generate-image/status/route.ts (GET handler)
 */

export default function FreepikGeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'square_1_1' | 'widescreen_16_9'>('square_1_1');
  const [images, setImages] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState('');
  const pollAbortRef = useRef<{ aborted: boolean }>({ aborted: false });

  const handlePromptChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleAspectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setAspectRatio(e.target.value as 'square_1_1' | 'widescreen_16_9');
  };

  // Fungsi polling sederhana (client-side)
  async function pollStatusLoop(tid: string, maxAttempts = 15, intervalMs = 2000) {
    setPolling(true);
    pollAbortRef.current.aborted = false;
    let attempt = 0;

    try {
      while (attempt < maxAttempts && !pollAbortRef.current.aborted) {
        attempt++;
        // tunggu sebelum cek (kecuali attempt ke-1)
        if (attempt > 1) {
          await new Promise((r) => setTimeout(r, intervalMs));
        }

        try {
          const resp = await fetch(`/api/generate-image/status?taskId=${encodeURIComponent(tid)}`);
          const text = await resp.text();
          let json: any;
          try {
            json = text ? JSON.parse(text) : {};
          } catch {
            // respons non-json
            setStatus((prev) => prev ?? 'Menunggu (response non-JSON).');
            continue;
          }

          // ambil status & images dari struktur respons (defensive)
          const data = json?.data ?? json;
          const s = data?.status ?? json?.status ?? null;
          const imgs =
            Array.isArray(data?.generated) && data.generated.length > 0
              ? data.generated
              : Array.isArray(data?.images) && data.images.length > 0
              ? data.images
              : Array.isArray(json?.generated) && json.generated.length > 0
              ? json.generated
              : Array.isArray(json?.images) && json.images.length > 0
              ? json.images
              : [];

          if (s) setStatus(s);
          if (imgs.length > 0) {
            setImages(imgs);
            setPolling(false);
            setLoading(false);
            return { ok: true, images: imgs };
          }

          // jika status final tapi tidak ada images -> stop
          if (s === 'FAILED' || s === 'COMPLETED') {
            setPolling(false);
            setLoading(false);
            return { ok: false, reason: s ?? 'final' };
          }
        } catch (err: any) {
          console.warn('Polling error', err);
          // jangan crash; lanjut ke percobaan berikutnya
        }
      }

      if (!pollAbortRef.current.aborted) {
        setPolling(false);
        setLoading(false);
        setStatus((p) => p ?? 'Batas polling tercapai — coba cek task_id secara manual.');
        return { ok: false, reason: 'timeout' };
      } else {
        // polling dibatalkan
        setPolling(false);
        setLoading(false);
        setStatus('Polling dibatalkan.');
        return { ok: false, reason: 'aborted' };
      }
    } catch (err: any) {
      setPolling(false);
      setLoading(false);
      setError(err?.message ?? 'Polling error');
      return { ok: false, reason: 'error' };
    }
  }

  const cancelPolling = () => {
    pollAbortRef.current.aborted = true;
    setPolling(false);
    setLoading(false);
    setStatus('Polling dibatalkan oleh pengguna.');
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

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspect_ratio: aspectRatio }),
      });

      const text = await response.text();
      let json: any;
      try {
        json = text ? JSON.parse(text) : {};
      } catch (err) {
        setError(`Server returned non-JSON response: ${text}`);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        // server error (Freepik or our server)
        const message = json?.error ?? `Server error: ${response.status}`;
        setError(message);
        setLoading(false);
        return;
      }

      // sukses
      const returnedStatus = json?.status ?? json?.data?.status ?? null;
      const returnedTaskId = json?.task_id ?? json?.data?.task_id ?? null;
      const returnedImages =
        Array.isArray(json?.images) && json.images.length > 0
          ? json.images
          : Array.isArray(json?.data?.generated) && json.data.generated.length > 0
          ? json.data.generated
          : Array.isArray(json?.data?.images) && json.data.images.length > 0
          ? json.data.images
          : Array.isArray(json?.generated) && json.generated.length > 0
          ? json.generated
          : [];

      if (returnedStatus) setStatus(returnedStatus);
      if (returnedImages.length > 0) {
        setImages(returnedImages);
        setLoading(false);
        return;
      }

      if (returnedTaskId) {
        setTaskId(returnedTaskId);
        setStatus(returnedStatus ?? 'Task dibuat; menunggu hasil (async).');

        // jalankan polling client-side
        await pollStatusLoop(returnedTaskId, 15, 2000);
        return;
      }

      // jika tidak ada images & tidak ada task_id (kasus tak terduga)
      setStatus('Tidak ada hasil dan tidak ada task_id dikembalikan.');
    } catch (err: any) {
      setError(`Kesalahan: ${err?.message ?? String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  // kecil: gaya sr-only inline (karena page.module.css tidak punya srOnly)
  const srOnlyStyle: React.CSSProperties = {
    position: 'absolute',
    left: -10000,
    top: 'auto',
    width: 1,
    height: 1,
    overflow: 'hidden',
  };

  return (
    <main className={styles.container} aria-live="polite">
      <h1 className={styles.title}>Generate Gambar AI (Freepik)</h1>

      <form onSubmit={handleSubmit} className={styles.form} aria-describedby="generate-desc">
        <p id="generate-desc" style={srOnlyStyle}>
          Masukkan prompt dan pilih aspect ratio, lalu klik Generate.
        </p>

        <div className={styles.inputGroup}>
          <label htmlFor="prompt-input" className={styles.label}>
            Prompt
          </label>
          <textarea
            id="prompt-input"
            value={prompt}
            onChange={handlePromptChange}
            placeholder="Tulis prompt... (misal: lanskap futuristik dengan lampu neon di malam hari)"
            rows={5}
            disabled={loading}
            className={styles.textarea}
            required
            aria-required="true"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="aspect-select" className={styles.label}>
            Aspect Ratio
          </label>
          <select
            id="aspect-select"
            value={aspectRatio}
            onChange={handleAspectChange}
            disabled={loading}
            aria-label="Pilih Aspect Ratio"
            // className .select tidak ada di CSS yang kamu kirim — biarkan default
          >
            <option value="square_1_1">Square (1:1)</option>
            <option value="widescreen_16_9">16:9 Widescreen</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'flex-end' }}>
          {polling && (
            <button type="button" onClick={cancelPolling} className={styles.button} aria-pressed="false">
              Batalkan Polling
            </button>
          )}

          <button type="submit" disabled={loading} className={styles.button} aria-disabled={loading}>
            {loading ? 'Memproses...' : 'Generate'}
          </button>
        </div>
      </form>

      {error && (
        <div role="alert" aria-live="assertive" className={styles.error}>
          {error}
        </div>
      )}

      {status && (
        <div role="status" aria-live="polite" style={{ textAlign: 'center', marginBottom: 12 }}>
          <strong>Status:</strong> {status}
        </div>
      )}

      {taskId && (
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <small>Task ID: <code>{taskId}</code></small>
        </div>
      )}

      {images.length > 0 && (
        <section className={styles.resultsSection} aria-label="Hasil Generated">
          <h2 className={styles.resultsTitle}>Hasil Gambar</h2>
          <div className={styles.resultsGrid}>
            {images.map((src, i) => (
              <div key={i} className={styles.resultCard}>
                <div className={styles.resultImageWrapper}>
                  <img src={src} alt={`Hasil generasi ${i + 1}`} className={styles.resultImage} />
                </div>
                <a href={src} download={`freepik-image-${i + 1}.png`} className={styles.downloadButton}>
                  Download
                </a>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
