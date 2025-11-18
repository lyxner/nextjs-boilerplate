'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import styles from './page.module.css';

export default function FreepikGeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'square_1_1' | 'widescreen_16_9'>('square_1_1');
  const [images, setImages] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePromptChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleAspectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setAspectRatio(e.target.value as 'square_1_1' | 'widescreen_16_9');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setImages([]);
    setStatus(null);

    if (!prompt.trim()) {
      setError('Prompt tidak boleh kosong.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/freepik-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspect_ratio: aspectRatio }),
      });

      // baca respons text dulu (aman terhadap body kosong)
      const text = await res.text();

      // coba parse JSON dengan try/catch
      let json: any;
      try {
        json = text ? JSON.parse(text) : {};
      } catch (err) {
        // respons bukan JSON valid
        setError(`Server returned non-JSON response: ${text}`);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        // jika server merespon error (401/403/405/429/500 dll)
        setError(json.error ?? `Server error: ${res.status}`);
      } else {
        // sukses: update status & gambar (jika tersedia)
        if (json.status) setStatus(json.status);
        if (Array.isArray(json.images) && json.images.length > 0) {
          setImages(json.images);
        } else {
          // tidak ada gambar langsung (task async) -> tampilkan status saja
          if (!json.images || json.images.length === 0) {
            setStatus(json.status ?? 'Menunggu hasil (jika task async).');
          }
        }
      }
    } catch (e: any) {
      setError(`Kesalahan: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container} aria-live="polite">
      <h1 className={styles.title}>Generate Gambar AI (Freepik)</h1>

      <form onSubmit={handleSubmit} className={styles.form} aria-describedby="generate-desc">
        <p id="generate-desc" className={styles.srOnly}>
          Masukkan prompt dan pilih aspect ratio, lalu klik Generate.
        </p>

        {/* LABEL untuk textarea (aksesibel) */}
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

        {/* LABEL untuk select (aksesibel) */}
        <div className={styles.inputGroup}>
          <label htmlFor="aspect-select" className={styles.label}>
            Aspect Ratio
          </label>
          <select
            id="aspect-select"
            value={aspectRatio}
            onChange={handleAspectChange}
            disabled={loading}
            className={styles.select}
            aria-label="Pilih Aspect Ratio"
          >
            <option value="square_1_1">Square (1:1)</option>
            <option value="widescreen_16_9">16:9 Widescreen</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={styles.button}
          aria-disabled={loading}
        >
          {loading ? 'Memproses...' : 'Generate'}
        </button>
      </form>

      {/* Status & error: gunakan aria-live agar pembaca layar diberi tahu */}
      {error && (
        <div role="alert" aria-live="assertive" className={styles.error}>
          {error}
        </div>
      )}

      {status && (
        <div role="status" aria-live="polite" className={styles.status}>
          Status: {status}
        </div>
      )}

      {/* Hasil gambar */}
      {images.length > 0 && (
        <section className={styles.results} aria-label="Hasil Generated">
          <h2 className={styles.resultsTitle}>Hasil Gambar</h2>
          <div className={styles.resultsGrid}>
            {images.map((src, i) => (
              <div key={i} className={styles.resultCard}>
                <img src={src} alt={`Hasil generasi ${i + 1}`} className={styles.resultImage} />
                <a href={src} download={`freepik-mystic-${i + 1}.png`} className={styles.download}>
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
