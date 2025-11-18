'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import styles from './page.module.css';

export default function FreepikGeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<string>('widescreen_16_9');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handlePromptChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleAspectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setAspectRatio(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setImages([]);

    if (!prompt.trim()) {
      setError('Prompt tidak boleh kosong.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/freepik-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, aspect_ratio: aspectRatio }),
      });

      const text = await res.text();
      if (!res.ok) {
        setError(`Server error: ${res.status} — ${text}`);
      } else {
        const json = JSON.parse(text);
        if (Array.isArray(json.images) && json.images.length > 0) {
          setImages(json.images);
        } else {
          setError(json.error ?? 'Gagal menghasilkan gambar.');
        }
      }
    } catch (e: any) {
      setError(`Kesalahan: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Generate Gambar AI (Freepik)</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="prompt" className={styles.label}>Prompt:</label>
          <textarea
            id="prompt"
            className={styles.textarea}
            placeholder="Misal: pemandangan futuristik dengan cahaya neon"
            value={prompt}
            onChange={handlePromptChange}
            rows={4}
            disabled={loading}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="aspect" className={styles.label}>Aspect Ratio:</label>
          <select
            id="aspect"
            value={aspectRatio}
            onChange={handleAspectChange}
            disabled={loading}
            className={styles.select}
          >
            <option value="square">Square</option>
            <option value="widescreen_16_9">16:9 Widescreen</option>
            <option value="portrait">Portrait</option>
          </select>
        </div>

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Memproses...' : 'Generate'}
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      {images.length > 0 && (
        <section className={styles.resultsSection}>
          <h2 className={styles.resultsTitle}>Hasil Gambar:</h2>
          <div className={styles.resultsGrid}>
            {images.map((src, i) => (
              <div key={i} className={styles.resultCard}>
                {/* Jika src adalah base64: bisa langsung <img src={src} /> */}
                <img src={src} alt={`Generated ${i}`} className={styles.resultImage} />
                <a href={src} download={`freepik-img-${i}.png`} className={styles.download}>
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
