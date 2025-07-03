// app/deteksi/page.tsx
'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import styles from './page.module.css';

export default function Page() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [resultText, setResultText] = useState<string>('');
  const [resultType, setResultType] = useState<'success' | 'error' | ''>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultText('');
      setResultType('');
    } else {
      setSelectedFile(null);
      setPreviewUrl('');
      setResultText('');
      setResultType('');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setResultText('Pilih gambar terlebih dahulu.');
      setResultType('error');
      return;
    }
    setLoading(true);
    setResultText('');
    setResultType('');
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        let errMsg = `Server error: ${res.status}`;
        try {
          const errData = await res.json();
          if (errData?.message) errMsg = errData.message;
        } catch {}
        setResultText(`Gagal: ${errMsg}`);
        setResultType('error');
        return;
      }
      const data = await res.json();
      if (data.status === 'success') {
        const aiProb = data.data?.type?.ai_generated;
        if (typeof aiProb === 'number') {
          setResultText(`Probabilitas AI: ${(aiProb * 100).toFixed(2)}%`);
          setResultType('success');
        } else {
          setResultText('Analisis selesai, tetapi probabilitas tidak ditemukan.');
          setResultType('error');
        }
      } else {
        setResultText(`Gagal analisis: ${data.message || 'Unknown error'}`);
        setResultType('error');
      }
    } catch (err: any) {
      setResultText(`Gagal menghubungi server: ${err.message}`);
      setResultType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.root}>
      <h1 className={styles.title}>Deteksi Gambar AI</h1>

      <div className={styles.card}>
        <div className={styles.cardHeader}>Unggah & Deteksi</div>

        <form onSubmit={handleSubmit} className={styles.form} encType="multipart/form-data">
          <label className={styles.fileInput}>
            <input
              type="file"
              name="image"
              accept="image/*"
              disabled={loading}
              onChange={handleFileChange}
            />
          </label>
          <button
            type="submit"
            disabled={!selectedFile || loading}
            className={styles.submitButton}
          >
            {loading ? 'Memproses...' : 'Upload & Analisis'}
          </button>
        </form>

        {previewUrl && (
          <div className={styles.previewContainer}>
            <h2 className={styles.previewTitle}>Preview</h2>
            <div className={styles.previewImageWrapper}>
              <img src={previewUrl} alt="Preview" className={styles.previewImage} />
            </div>
          </div>
        )}

        {resultText && (
          <div
            className={`${styles.resultBox} ${
              resultType === 'success' ? styles.resultSuccess : styles.resultError
            }`}
          >
            {resultText}
          </div>
        )}
      </div>
    </main>
  );
}
