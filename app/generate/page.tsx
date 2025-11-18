'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import styles from './page.module.css';

export default function GeneratePage() {
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
    setInputFile(file);
    setPreviewInputUrl(file ? URL.createObjectURL(file) : '');
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
      setError('Pilih gambar input.');
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

      const text = await res.text();
      if (!res.ok) {
        setError(`Server error: ${res.status} — ${text}`);
      } else if (!text) {
        setError('Respons dari server kosong.');
      } else {
        try {
          const json = JSON.parse(text);
          if (Array.isArray(json.images) && json.images.length > 0) {
            setImages(json.images);
          } else {
            setError(json.error ?? 'Tidak ada gambar yang dihasilkan.');
          }
        } catch (e: any) {
          setError(`Gagal parse respons: ${e.message}`);
        }
      }
    } catch (e: any) {
      setError(`Gagal memanggil server: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Generate Gambar AI</h1>

      <div className={styles.tabContainer}>
        <button
          type="button"
          className={`${styles.tabButton} ${mode === 'text2img' ? styles.activeTab : ''}`}
          onClick={() => handleModeChange('text2img')}
          disabled={loading}
        >
          Text → Gambar
        </button>
        <button
          type="button"
          className={`${styles.tabButton} ${mode === 'img2img' ? styles.activeTab : ''}`}
          onClick={() => handleModeChange('img2img')}
          disabled={loading}
        >
          Text + Gambar → Gambar
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {mode === 'img2img' && (
          <div className={styles.inputGroup}>
            <label htmlFor="inputImage" className={styles.label}>Pilih Gambar Input:</label>
            <input
              type="file"
              id="inputImage"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
            />
            {previewInputUrl && (
              <div className={styles.preview}>
                <img
                  src={previewInputUrl}
                  alt="Preview Input"
                  className={styles.previewImage}
                />
              </div>
            )}
          </div>
        )}

        <div className={styles.inputGroup}>
          <label htmlFor="prompt" className={styles.label}>Prompt:</label>
          <textarea
            id="prompt"
            className={styles.textarea}
            placeholder={mode === 'text2img'
              ? 'Contoh: pemandangan matahari terbenam di pegunungan'
              : 'Contoh edit: ubah langit menjadi ungu'}
            value={prompt}
            onChange={handlePromptChange}
            rows={4}
            disabled={loading}
          />
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
            {images.map((src, idx) => (
              <div key={idx} className={styles.resultCard}>
                <img src={src} alt={`Generated ${idx}`} className={styles.resultImage} />
                <a href={src} download={`generated-${idx + 1}.png`} className={styles.download}>
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
