'use client';

import styles from './page.module.css';

type ModelCardProps = { name: string; logoSrc: string; alt: string };
const ModelCard = ({ name, logoSrc, alt }: ModelCardProps) => (
  <div className={styles.card}>
    <img src={logoSrc} alt={alt} className={styles.cardImage} />
    <h3 className={styles.cardTitle}>{name}</h3>
  </div>
);

const sections = [
  {
    id: 'gan',
    title: 'Generative Adversarial Networks (GAN)',
    paragraph: (
      <>
        GAN adalah dua jaringan neural yang berkompetensi:<br />
        <strong>Generator</strong> membuat gambar palsu sedekat mungkin dengan aslinya,<br />
        sementara <strong>Discriminator</strong> memeriksa mana yang asli dan mana yang palsu.<br />
        Proses akan selesai ketika <strong>Discriminator</strong> tidak bisa membedakan gambar asli dan gambar palsu.
      </>
    ),
    diagram: { src: '/slide6/kerja1.jpg', alt: 'Cara Kerja GAN' },
    examples: [
      { src: '/slide6/contohgan.webp', alt: 'GAN Example 1' },
      { src: '/slide6/contohgan2.png', alt: 'GAN Example 2' },
      { src: '/slide6/contohgan3.png', alt: 'GAN Example 3' },
    ],
  },
  {
    id: 'diffusion',
    title: 'Model Difusi',
    paragraph: (
      <>
        Model difusi adalah model generatif yang bekerja dengan menambahkan noise pada data <strong>(Forward Diffusion)</strong>
        lalu membalik proses tersebut dengan <strong>denoising</strong> bertahap. Dengan conditioning, model difusi dapat
        menghasilkan sampel baru dari noise murni.
      </>
    ),
    diagram: { src: '/slide6/kerja2.png', alt: 'Cara Kerja Model Difusi' },
    examples: [
      { src: '/images/kuis/ai1.webp', alt: 'Diffusion Example 1' },
      { src: '/slide6/gambar1.webp', alt: 'Diffusion Example 2' },
      { src: '/slide6/gambar2.webp', alt: 'Diffusion Example 3' },
    ],
  },
];

export default function ModelPage() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <h1 className={styles.heading1}>Model Generatif: GAN &amp; Model Difusi</h1>

        {sections.map(({ id, title, paragraph, diagram, examples }) => (
          <section key={id} className={styles.section}>
            <h2 className={styles.heading2}>{title}</h2>
            <p className={styles.paragraph}>{paragraph}</p>

            <div className={`${styles.card} ${styles.diagramCard}`}>
              <img src={diagram.src} alt={diagram.alt} className={styles.diagramImage} />
            </div>

            <div className={styles.examplesSection}>
              <h3 className={styles.examplesTitle}>Contoh Gambar dari {title.includes('GAN') ? 'GAN' : 'Model Difusi'}</h3>
              <div className={styles.examplesGrid}>
                {examples.map((ex) => (
                  <img key={ex.src} src={ex.src} alt={ex.alt} />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
