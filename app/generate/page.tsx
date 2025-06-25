// app/generate/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import styles from './page.module.css';

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

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
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `Server error: ${res.status}`);
      } else {
        if (Array.isArray(data.images) && data.images.length > 0) {
          setImages(data.images);
        } else {
          setError('Tidak ada gambar yang dihasilkan.');
        }
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(`Gagal memanggil server: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Image Generation</h1>
      <p className={styles.description}>
        Masukkan prompt untuk menghasilkan gambar menggunakan Google Gemini API.
      </p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <textarea
          className={styles.textarea}
          placeholder="Contoh: Pemandangan gunung di bawah cahaya senja dengan awan dramatis"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
        />
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Memproses...' : 'Generate Image'}
        </button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      {images.length > 0 && (
        <div className={styles.results}>
          {images.map((src, idx) => (
            <div key={idx} className={styles.imageWrapper}>
              <img src={src} alt={`Generated ${idx + 1}`} className={styles.image} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
