// app/model/page.tsx
'use client';

import styles from './page.module.css'; // ← pastikan file ini ada di folder yg sama

export default function ModelPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading1}>Model dan Tools</h1>

      <h2 className={styles.heading2}>Generative Adversarial Networks (GAN)</h2>
      <p className={styles.paragraph}>
        GAN adalah arsitektur AI generatif yang melibatkan dua jaringan: Generator dan Discriminator.
        Generator menghasilkan gambar palsu, sedangkan Discriminator mencoba membedakannya dari gambar asli.
      </p>
      <img src="https://via.placeholder.com/300x200?text=Arsitektur+GAN" alt="Arsitektur GAN" className={styles.image} />

      <h2 className={styles.heading2}>Model Difusi</h2>
      <p className={styles.paragraph}>
        Model difusi bekerja dengan menambahkan noise acak ke gambar dan kemudian belajar membalik proses tersebut.
        Ini memungkinkan penciptaan gambar berkualitas tinggi dari noise acak.
      </p>
      <img src="https://via.placeholder.com/300x200?text=Stable+Diffusion" alt="Output Stable Diffusion" className={styles.image} />

      <h2 className={styles.heading2}>Stable Diffusion</h2>
      <ul className={styles.list}>
        <li>Pilih platform Stable Diffusion (lokal/cloud).</li>
        <li>Masukkan perintah teks (prompt) yang deskriptif.</li>
        <li>Sesuaikan parameter (CFG, langkah difusi, ukuran gambar).</li>
        <li>Tekan tombol generate untuk melihat hasilnya.</li>
      </ul>

      <h2 className={styles.heading2}>Midjourney</h2>
      <ul className={styles.list}>
        <li>Bergabung ke server Discord Midjourney.</li>
        <li>Ketik <code>/imagine [teks prompt]</code></li>
        <li>Pilih variasi hasil atau upscale.</li>
      </ul>
    </div>
  );
}
