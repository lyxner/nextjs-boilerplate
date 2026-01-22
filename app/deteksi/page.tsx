'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import styles from './page.module.css';

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [result, setResult] = useState<{ text: string; type: 'success' | 'error' | '' }>({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (preview) URL.revokeObjectURL(preview);
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : '');
    setResult({ text: '', type: '' });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return setResult({ text: 'Pilih gambar terlebih dahulu.', type: 'error' });
    setLoading(true);
    setResult({ text: '', type: '' });
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = json?.message ?? `Server error: ${res.status}`;
        return setResult({ text: `Gagal: ${msg}`, type: 'error' });
      }
      if (json?.status === 'success') {
        const p =
          typeof json?.data?.type?.ai_generated === 'number'
            ? `Probabilitas AI: ${(json.data.type.ai_generated * 100).toFixed(2)}%`
            : 'Analisis selesai, tetapi probabilitas tidak ditemukan.';
        setResult({
          text: p,
          type: typeof json?.data?.type?.ai_generated === 'number' ? 'success' : 'error'
        });
      } else {
        setResult({ text: `Gagal analisis: ${json?.message ?? 'Unknown error'}`, type: 'error' });
      }
    } catch (err: any) {
      setResult({ text: `Gagal menghubungi server: ${err?.message ?? err}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.root}>
      <h1 className={styles.title}>Deteksi Gambar AI (Sightengine)</h1>
      <div className={styles.card}>
        <div className={styles.cardHeader}>Unggah & Deteksi</div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.fileInput}>
            <input type="file" accept="image/*" disabled={loading} onChange={handleFileChange} />
          </label>

          <button type="submit" disabled={!file || loading} className={styles.submitButton}>
            {loading ? 'Memproses...' : 'Upload & Analisis'}
          </button>
        </form>

        {/* 1) Preview gambar (jika ada) */}
        {preview && (
          <div className={styles.previewContainer}>
            <h2 className={styles.previewTitle}>Preview</h2>
            <div className={styles.previewImageWrapper}>
              <img src={preview} alt="Preview" className={styles.previewImage} />
            </div>
          </div>
        )}

        {/* 2) Gambar ilustrasi probabilitas (placeholder) - tampilkan saat ada hasil */}
        {result.text && (
          <div className={styles.probImageContainer}>
            <h3 className={styles.probImageTitle}>Ilustrasi Cara Kerja Probabilitas</h3>
            <div className={styles.probImageWrapper}>
              <img
                src="/images4/carakerja.png" /* <-- ganti ini sesuai kebutuhan Anda */
                alt="Ilustrasi Probabilitas"
                className={styles.probImage}
              />
            </div>
          </div>
        )}

        {/* 3) Hasil probabilitas (tampil paling akhir) */}
        {result.text && (
          <div className={`${styles.resultBox} ${result.type === 'success' ? styles.resultSuccess : styles.resultError}`}>
            {result.text}
          </div>
        )}
      </div>
    </main>
  );
}
