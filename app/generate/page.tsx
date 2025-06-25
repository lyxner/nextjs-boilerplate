// app/generate/page.tsx
'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import styles from './page.module.css';

export default function GeneratePage() {
  // mode: 'text2img' atau 'img2img'
  const [mode, setMode] = useState<'text2img' | 'img2img'>('text2img');
  const [prompt, setPrompt] = useState('');
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [previewInputUrl, setPreviewInputUrl] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleModeChange = (newMode: 'text2img' | 'img2img') => {
    if (loading) return;
    setMode(newMode);
    setPrompt('');
    setInputFile(null);
    setPreviewInputUrl('');
    setImages([]);
    setError('');
  };

  const handlePromptChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setInputFile(file);
      setPreviewInputUrl(URL.createObjectURL(file));
    } else {
      setInputFile(null);
      setPreviewInputUrl('');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setImages([]);
    if (!prompt.trim()) {
      setError('Prompt tidak boleh kosong.');
      return;
    }
    if (mode === 'img2img' && !inputFile) {
      setError('Pilih gambar input');
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('mode', mode);
      if (mode === 'img2img' && inputFile) {
        formData.append('image', inputFile);
      }
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        body: formData,
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

      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabButton} ${mode === 'text2img' ? styles.activeTab : ''}`}
          onClick={() => handleModeChange('text2img')}
          disabled={loading}
          type="button"
        >
          Text ke Gambar Generated
        </button>
        <button
          className={`${styles.tabButton} ${mode === 'img2img' ? styles.activeTab : ''}`}
          onClick={() => handleModeChange('img2img')}
          disabled={loading}
          type="button"
        >
          Text + Gambar ke Gambar Generated
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {mode === 'img2img' && (
          <div className={styles.inputGroup}>
            <label htmlFor="inputImage" className={styles.label}>
              Pilih Gambar Input:
            </label>
            <input
              type="file"
              id="inputImage"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
              className={styles.fileInput}
            />
            {previewInputUrl && (
              <div className={styles.inputPreviewCard}>
                <img
                  src={previewInputUrl}
                  alt="Preview Input"
                  className={styles.inputPreviewImage}
                />
              </div>
            )}
          </div>
        )}

        <div className={styles.inputGroup}>
          <label htmlFor="prompt" className={styles.label}>
            Prompt:
          </label>
          <textarea
            id="prompt"
            className={styles.textarea}
            placeholder={
              mode === 'text2img'
                ? 'Contoh: Pemandangan matahari terbenam di pegunungan, detail tinggi'
                : 'Contoh: Ubah langit menjadi ungu, pertahankan objek utama'
            }
            value={prompt}
            onChange={handlePromptChange}
            rows={4}
            disabled={loading}
          />
        </div>

       
        <button type="submit" disabled={loading} className={styles.button}>
          {loading
            ? 'Memproses...'
            : mode === 'text2img'
            ? 'Generate'
            : 'Generate'}
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      {images.length > 0 && (
        <section className={styles.resultsSection}>
          <h2 className={styles.resultsTitle}>Hasil Generated:</h2>
          <div className={styles.resultsGrid}>
            {images.map((src, idx) => (
              <div key={idx} className={styles.resultCard}>
                <div className={styles.resultImageWrapper}>
                  <img
                    src={src}
                    alt={`Generated ${idx + 1}`}
                    className={styles.resultImage}
                  />
                </div>
                <a
                  href={src}
                  download={`generated-${mode}-${idx + 1}.png`}
                  className={styles.downloadButton}
                >
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
