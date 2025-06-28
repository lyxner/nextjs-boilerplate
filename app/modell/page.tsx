// app/model/page.tsx
'use client';

import styles from './page.module.css';

type ModelCardProps = {
  name: string;
  logoSrc: string;
  alt: string;
};

function ModelCard({ name, logoSrc, alt }: ModelCardProps) {
  return (
    <div className={styles.card}>
      <img src={logoSrc} alt={alt} className={styles.cardImage} />
      <h3 className={styles.cardTitle}>{name}</h3>
    </div>
  );
}

export default function ModelPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading1}>Model Generatif: GAN &amp; Difusi</h1>

      {/* Penjelasan GAN */}
      <section className={styles.section}>
        <h2 className={styles.heading2}>Generative Adversarial Networks (GAN)</h2>
        <p className={styles.paragraph}>
          GAN adalah dua jaringan neural yang “bertarung”:  
          <strong>Generator</strong> berupaya membuat gambar palsu yang mirip aslinya,  
          sementara <strong>Discriminator</strong> bertugas menebak mana gambar asli dan palsu.  
          Seiring latihan, Generator makin pandai menipu, dan Discriminator makin jeli mendeteksi.
        </p>

        <div className={styles.cardGrid}>
          <ModelCard
            name="DCGAN"
            logoSrc="/assets/gan/dcgan-placeholder.png" // ganti nanti
            alt="Logo DCGAN"
          />
          <ModelCard
            name="StyleGAN"
            logoSrc="/assets/gan/stylegan-placeholder.png" // ganti nanti
            alt="Logo StyleGAN"
          />
          <ModelCard
            name="CycleGAN"
            logoSrc="/assets/gan/cyclegan-placeholder.png" // ganti nanti
            alt="Logo CycleGAN"
          />
        </div>
      </section>

      {/* Penjelasan Difusi */}
      <section className={styles.section}>
        <h2 className={styles.heading2}>Model Difusi</h2>
        <p className={styles.paragraph}>
          Model difusi memulai dari <em>noise</em> acak, lalu belajar “menghapus” noise itu sedikit demi sedikit  
          hingga membentuk gambar yang nyata. Proses ini seperti mempelajari urutan mundur dari gambar buram ke jernih.
        </p>

        <div className={styles.cardGrid}>
          <ModelCard
            name="Stable Diffusion"
            logoSrc="https://via.placeholder.com/80?text=SD" // contoh placeholder
            alt="Logo Stable Diffusion"
          />
          <ModelCard
            name="DALL·E 2"
            logoSrc="https://via.placeholder.com/80?text=DALL%25C2%25B7E2" // contoh placeholder
            alt="Logo DALL·E 2"
          />
          <ModelCard
            name="Imagen"
            logoSrc="https://via.placeholder.com/80?text=Imagen" // contoh placeholder
            alt="Logo Imagen"
          />
        </div>
      </section>
    </div>
  );
}
