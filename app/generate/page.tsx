'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import styles from './page.module.css';

export default function FreepikGeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'square_1_1' | 'widescreen_16_9' | 'classic_4_3'>('square_1_1');
  const [images, setImages] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePromptChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleAspectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setAspectRatio(e.target.value as any);
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
      const res = await fetch('/api/freepik-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, aspect_ratio: aspectRatio }),
      });

      const text = await res.text();
      const json = JSON.parse(text);

      if (!res.ok) {
        setError(`Server error: ${res.status} — ${text}`);
      } else {
        if (json.images && Array.isArray(json.images) && json.images.length > 0) {
          setImages(json.images);
        }
        if (json.taskId) {
          setTaskId(json.taskId);
        }
        if (json.status) {
          setStatus(json.status);
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
      <h1 className={styles.title}>Generate Gambar AI (Freepik Mystic)</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="prompt" className={styles.label}>Prompt:</label>
          <textarea
            id="prompt"
            className={styles.textarea}
            placeholder="Misal: lanskap futuristik di malam hari"
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
            <option value="square_1_1">Square (1:1)</option>
            <option value="widescreen_16_9">16:9 Widescreen</option>
            <option value="classic_4_3">4:3 Classics</option>
          </select>
        </div>

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Memproses...' : 'Generate'}
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      {status && (
        <p className={styles.status}>Status: {status}{taskId ? ` (Task ID: ${taskId})` : ''}</p>
      )}

      {images.length > 0 && (
        <section className={styles.resultsSection}>
          <h2 className={styles.resultsTitle}>Hasil Gambar:</h2>
          <div className={styles.resultsGrid}>
            {images.map((src, i) => (
              <div key={i} className={styles.resultCard}>
                <img src={src} alt={`Generated ${i}`} className={styles.resultImage} />
                <a href={src} download={`freepik-mystic-${i}.png`} className={styles.download}>
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
