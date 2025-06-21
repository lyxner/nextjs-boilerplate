// app/page.tsx
'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

export default function Page() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [resultText, setResultText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    console.log('File dipilih:', file);
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultText('');
    } else {
      setSelectedFile(null);
      setPreviewUrl('');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit dipanggil, selectedFile=', selectedFile);
    if (!selectedFile) {
      setResultText('Pilih gambar terlebih dahulu.');
      return;
    }
    setLoading(true);
    setResultText('');
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const endpoint = `${window.location.origin}/api/upload`;
      console.log('Mengirim fetch ke:', endpoint);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      console.log('Fetch selesai, status:', res.status);
      if (!res.ok) {
        let errMsg = `Server error: ${res.status}`;
        try {
          const errData = await res.json();
          if (errData?.message) errMsg = errData.message;
        } catch (_) {}
        console.error('Error response dari server:', errMsg);
        setResultText(`Gagal: ${errMsg}`);
        return;
      }
      const data = await res.json();
      console.log('Data dari API:', data);
      if (data.status === 'success') {
        const aiProb = data.data?.type?.ai_generated;
        if (typeof aiProb === 'number') {
          setResultText(`Probabilitas AI: ${(aiProb * 100).toFixed(2)}%`);
        } else {
          setResultText('Analisis selesai, tetapi probabilitas tidak ditemukan.');
        }
      } else {
        setResultText(`Gagal analisis: ${data.message || 'Unknown error'}`);
      }
    } catch (err: any) {
      console.error('Fetch exception:', err);
      setResultText(`Gagal menghubungi server: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <h1>Deteksi Gambar AI</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="file"
          name="image"
          accept="image/*"
          required
          onChange={handleFileChange}
        />
        <button type="submit" disabled={!selectedFile || loading}>
          {loading ? 'Memproses...' : 'Upload dan Analisis'}
        </button>
      </form>

      {previewUrl && (
        <div style={{ marginTop: '1rem' }}>
          <h2>Preview:</h2>
          <img src={previewUrl} alt="Preview" className="preview-image" />
        </div>
      )}

      {resultText && (
        <div className="result-box" style={{ marginTop: '1rem' }}>
          {resultText}
        </div>
      )}
    </main>
  );
}
