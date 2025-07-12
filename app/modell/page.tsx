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
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h1 className={styles.heading1}>Model Generatif: GAN &amp; Difusi</h1>

        {/* GAN Section */}
        <section className={styles.section}>
          <h2 className={styles.heading2}>Generative Adversarial Networks (GAN)</h2>
          <p className={styles.paragraph}>
            GAN adalah dua jaringan neural yang “bertarung":<br />
            <strong>Generator</strong> membuat gambar palsu sedekat mungkin dengan aslinya,<br />
            sementara <strong>Discriminator</strong> memeriksa mana yang asli dan mana yang palsu.
          </p>

          {/* Diagram GAN */}
          <div className={`${styles.card} ${styles.diagramCard}`}>
            <img
              src="/images/kuis/ai1.webp"
              alt="Cara Kerja GAN"
              className={styles.diagramImage}
            />
          </div>

          {/* Teks pengantar varian */}
          <p className={styles.variantIntro}>
            Model GAN ini juga mempunyai banyak varian, beberapa di antaranya:
          </p>

          {/* Varian-model */}
          <div className={styles.variantGrid}>
            <ModelCard
              name="DCGAN"
              logoSrc="/images/kuis/ai1.webp"
              alt="Logo DCGAN"
            />
            <ModelCard
              name="StyleGAN"
              logoSrc="/assets/gan/stylegan-placeholder.png"
              alt="Logo StyleGAN"
            />
            <ModelCard
              name="CycleGAN"
              logoSrc="/assets/gan/cyclegan-placeholder.png"
              alt="Logo CycleGAN"
            />
          </div>

          {/* Contoh hasil GAN */}
          <div className={styles.examplesSection}>
            <h3 className={styles.examplesTitle}>Contoh Gambar dari GAN</h3>
            <div className={styles.examplesGrid}>
              <img src="/images/kuis/ai1.webp" alt="GAN Example 1" />
              <img src="/examples/gan2.jpg" alt="GAN Example 2" />
              <img src="/examples/gan3.jpg" alt="GAN Example 3" />
            </div>
          </div>
        </section>

        {/* Diffusion Section */}
        <section className={styles.section}>
          <h2 className={styles.heading2}>Model Difusi</h2>
          <p className={styles.paragraph}>
            Model difusi memulai dari <em>noise</em> acak, lalu belajar mengurangi noise tersebut langkah demi langkah hingga membentuk gambar yang nyata.
          </p>

          {/* Diagram Difusi */}
          <div className={`${styles.card} ${styles.diagramCard}`}>
            <img
              src="/images/kuis/ai1.webp"
              alt="Cara Kerja Model Difusi"
              className={styles.diagramImage}
            />
          </div>

          {/* Teks pengantar varian */}
          <p className={styles.variantIntro}>
            Model difusi ini juga mempunyai banyak varian, beberapa di antaranya:
          </p>

          {/* Varian-model */}
          <div className={styles.variantGrid}>
            <ModelCard
              name="Stable Diffusion"
              logoSrc="/images/kuis/ai1.webp"
              alt="Logo Stable Diffusion"
            />
            <ModelCard
              name="DALL·E 2"
              logoSrc="https://via.placeholder.com/80?text=DALL%25C2%25B7E2"
              alt="Logo DALL·E 2"
            />
            <ModelCard
              name="Imagen"
              logoSrc="https://via.placeholder.com/80?text=Imagen"
              alt="Logo Imagen"
            />
          </div>

          {/* Contoh hasil Difusi */}
          <div className={styles.examplesSection}>
            <h3 className={styles.examplesTitle}>Contoh Gambar dari Model Difusi</h3>
            <div className={styles.examplesGrid}>
              <img src="/images/kuis/ai1.webp" alt="GAN Example 1" />
              <img src="/examples/diffusion2.jpg" alt="Diffusion Example 2" />
              <img src="/examples/diffusion3.jpg" alt="Diffusion Example 3" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
