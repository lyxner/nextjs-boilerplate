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
        <h1 className={styles.heading1}>Model Generatif: GAN &amp; Model Difusi</h1>

        {/* GAN Section */}
        <section className={styles.section}>
          <h2 className={styles.heading2}>Generative Adversarial Networks (GAN)</h2>
          <p className={styles.paragraph}>
            GAN adalah dua jaringan neural yang berkompetensi:<br />
            <strong>Generator</strong> membuat gambar palsu sedekat mungkin dengan aslinya,<br />
            sementara <strong>Discriminator</strong> memeriksa mana yang asli dan mana yang palsu.<br/>
            proses akan selesai ketika <strong>Discriminator</strong> tidak bisa membedakan gambar asli dan gambar palsu
          </p>

          {/* Diagram GAN */}
          <div className={`${styles.card} ${styles.diagramCard}`}>
            <img
              src="/slide6/kerja1.jpg"
              alt="Cara Kerja GAN"
              className={styles.diagramImage}
            />
          </div>


          {/* Contoh hasil GAN */}
          <div className={styles.examplesSection}>
            <h3 className={styles.examplesTitle}>Contoh Gambar dari GAN</h3>
            <div className={styles.examplesGrid}>
              <img src="/slide6/contohgan.webp" alt="GAN Example 1" />
              <img src="/slide6/contohgan2.png" alt="GAN Example 2" />
              <img src="/slide6/contohgan3.png" alt="GAN Example 3" />
            </div>
          </div>
        </section>

        {/* Diffusion Section */}
        <section className={styles.section}>
          <h2 className={styles.heading2}>Model Difusi</h2>
          <p className={styles.paragraph}>
           Model difusi adalah model generatif yang mempunyai cara kerja dengan membuat sebuah data sampel yang kacau dengan menambahkan noise pada data tersebut <strong>(Forward Diffusion) </strong>
           yang kemudian membalik proses tersebut dengan mengurangi noise pada data sampel <strong>(Denoising)</strong> secara bertahap <br/>
           dengan melibatkan conditioning yang pada akhirnya model difusi dapat menciptakan data baru atau sampel yang berasal dari noise murni.
          </p>

          {/* Diagram Difusi */}
          <div className={`${styles.card} ${styles.diagramCard}`}>
            <img
              src="/slide6/kerja2.png"
              alt="Cara Kerja Model Difusi"
              className={styles.diagramImage}
            />
          </div>

        

          {/* Contoh hasil Difusi */}
          <div className={styles.examplesSection}>
            <h3 className={styles.examplesTitle}>Contoh Gambar dari Model Difusi</h3>
            <div className={styles.examplesGrid}>
              <img src="/images/kuis/ai1.webp" alt="GAN Example 1" />
              <img src="/slide6/gambar1.webp" alt="Diffusion Example 2" />
              <img src="/slide6/gambar2.webp" alt="Diffusion Example 3" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
